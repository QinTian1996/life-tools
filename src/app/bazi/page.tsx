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
      const roastsResponse = await fetch('/api/bazi/roasts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
        signal: abortControllerRef.current.signal,
      });

      if (!roastsResponse.ok) {
        const error = await roastsResponse.json();
        throw new Error(error.error || '获取吐槽失败');
      }

      const roastsData = await roastsResponse.json();
      setRoasts(roastsData.roasts || []);

      setState('loading-report');

      const reportResponse = await fetch('/api/bazi/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
        signal: abortControllerRef.current.signal,
      });

      if (!reportResponse.ok) {
        const error = await reportResponse.json();
        throw new Error(error.error || '生成报告失败');
      }

      const reportData = await reportResponse.json();
      setReport({
        professional: reportData.professional || '',
        detailed: reportData.detailed || '',
      });

      setState('done');
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }
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
            />
          )}

          {state === 'done' && report && currentInput && (
            <div className="space-y-6">
              <div className="text-center">
                <button
                  onClick={handleReset}
                  className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] underline"
                >
                  ← 重新排盘
                </button>
              </div>

              <BaziReport
                professional={report.professional}
                detailed={report.detailed}
                inputName={currentInput.name}
              />
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
