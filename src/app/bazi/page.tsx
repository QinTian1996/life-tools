"use client";

import { useState, useRef, useCallback } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { BaziForm } from "@/components/bazi/BaziForm";
import { BaziLoading } from "@/components/bazi/BaziLoading";
import { BaziReport } from "@/components/bazi/BaziReport";
import { computeBazi } from "@/lib/bazi/calculator";
import { getPreRoasts } from "@/lib/bazi/pre-roasts";
import type { BirthInput, BaziResult } from "@/lib/bazi/types";

type PageState = 'form' | 'loading-roasts' | 'loading-report' | 'done' | 'error';

interface ReportData {
  professional: string;
  detailed: string;
}

export default function BaziPage() {
  const [state, setState] = useState<PageState>('form');
  const [currentInput, setCurrentInput] = useState<BirthInput | null>(null);
  const [currentBazi, setCurrentBazi] = useState<BaziResult | null>(null);
  const [roasts, setRoasts] = useState<string[]>([]);
  const [report, setReport] = useState<ReportData | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const fetchingRoastsRef = useRef(false);

  const handleRoastRefill = useCallback(async () => {
    if (fetchingRoastsRef.current || !currentInput) return;
    fetchingRoastsRef.current = true;
    try {
      const res = await fetch('/api/bazi/roasts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentInput),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.roasts?.length) {
          setRoasts(prev => [...prev, ...data.roasts]);
        }
      }
    } finally {
      fetchingRoastsRef.current = false;
    }
  }, [currentInput]);

  const handleCancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setState('form');
    setRoasts([]);
    setReport(null);
    setErrorMessage(null);
  }, []);

  const handleCalculate = useCallback(async (input: BirthInput) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    setCurrentInput(input);
    setState('loading-roasts');
    setRoasts([]);
    setReport(null);
    setErrorMessage(null);

    const bazi = computeBazi(input);
    setCurrentBazi(bazi);
    setRoasts(getPreRoasts(bazi.dayPillar.stem));

    try {
      const safeFetch = async (url: string, body: BirthInput): Promise<{ ok: boolean; json: Record<string, unknown> | null }> => {
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
          signal: abortControllerRef.current!.signal,
        });
        const text = await res.text();
        try { return { ok: res.ok, json: JSON.parse(text) }; }
        catch { return { ok: false, json: { error: text.slice(0, 200) } }; }
      } catch {
        return { ok: false, json: { error: '网络请求失败' } };
      }
    };

    const roastsRes = await safeFetch('/api/bazi/roasts', input);
    if (!roastsRes.ok) throw new Error(String(roastsRes.json?.error || '获取吐槽失败'));
    setRoasts((roastsRes.json as Record<string, string[]>).roasts || []);

    setState('loading-report');

    const reportRes = await safeFetch('/api/bazi/report', input);
    if (!reportRes.ok) throw new Error(String(reportRes.json?.error || '生成报告失败'));

    setReport({
      professional: String(reportRes.json?.professional || ''),
      detailed: String(reportRes.json?.detailed || ''),
    });
    setState('done');
  } catch (err) {
    if (err instanceof Error && err.name === 'AbortError') return;
    setErrorMessage(err instanceof Error ? err.message : '发生错误');
    setState('error');
  }
}, []);

  const handleReset = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setCurrentInput(null);
    setCurrentBazi(null);
    setRoasts([]);
    setReport(null);
    setErrorMessage(null);
    setState('form');
  }, []);

  const isLoading = state === 'loading-roasts' || state === 'loading-report';
  const isCollapsed = state === 'done' && report !== null;

  return (
    <PageLayout title="算八字">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto space-y-6">

          {isCollapsed ? (
            <div className="bg-[var(--card)] rounded-lg p-4 border border-[var(--border)] flex items-center justify-between">
              <div>
                <div className="text-sm text-[var(--muted-foreground)]">
                  {currentInput?.name ? `${currentInput.name} · ` : ''}
                  {currentInput?.year}年{currentInput?.month}月{currentInput?.day}日 ·
                  {currentInput?.gender === 'male' ? '男' : '女'}
                </div>
                <div className="text-xs text-[var(--muted-foreground)] mt-1">
                  已生成报告
                </div>
              </div>
              <button
                onClick={handleReset}
                className="px-4 py-2 text-sm font-medium bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg hover:opacity-90 transition-opacity"
              >
                重新排盘
              </button>
            </div>
          ) : (
            <BaziForm
              onCalculate={handleCalculate}
              isLoading={isLoading}
              onCancel={handleCancel}
            />
          )}

          {state === 'error' && errorMessage && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-600 dark:text-red-400 text-sm">{errorMessage}</p>
              <button
                onClick={handleReset}
                className="mt-2 text-sm text-red-600 dark:text-red-400 underline"
              >
                返回表单
              </button>
            </div>
          )}

          {(state === 'loading-roasts' || state === 'loading-report') && currentInput && currentBazi && (
            <BaziLoading
              input={currentInput}
              baziResult={currentBazi}
              roasts={roasts}
              phase={state === 'loading-roasts' ? 'roasts' : 'report'}
              onRoastIndexChange={(idx, total) => {
                if (total - idx <= 4) handleRoastRefill();
              }}
            />
          )}

          {state === 'done' && report && currentInput && (
            <BaziReport
              professional={report.professional}
              detailed={report.detailed}
              inputName={currentInput.name}
            />
          )}
        </div>
      </div>
    </PageLayout>
  );
}
