"use client";

import { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/Button";
import { computeBazi } from "@/lib/bazi/calculator";
import type { BirthInput, BaziResult } from "@/lib/bazi/types";

const SHICHEN_OPTIONS = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

export default function BaziPage() {
  const [result, setResult] = useState<BaziResult | null>(null);
  const [timeMode, setTimeMode] = useState<'precise' | 'shichen' | 'unknown'>('precise');
  const [gender, setGender] = useState<'male' | 'female'>('male');

  function handleSubmit(formData: FormData) {
    const year = parseInt(formData.get('year') as string);
    const month = parseInt(formData.get('month') as string);
    const day = parseInt(formData.get('day') as string);
    const hour = parseInt(formData.get('hour') as string) || 12;
    const minute = parseInt(formData.get('minute') as string) || 0;
    const shichen = formData.get('shichen') as string || '子';

    const input: BirthInput = {
      year,
      month,
      day,
      calendar: 'solar',
      timeMode,
      gender,
      hour: timeMode === 'precise' ? hour : undefined,
      minute: timeMode === 'precise' ? minute : undefined,
      shichen: timeMode === 'shichen' ? shichen : undefined,
    };

    const baziResult = computeBazi(input);
    setResult(baziResult);
  }

  return (
    <PageLayout title="算八字">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <form
            action={handleSubmit}
            className="space-y-4 bg-[var(--card)] rounded-lg p-6 border border-[var(--border)]"
          >
            <h2 className="text-lg font-semibold text-[var(--foreground)]">出生信息</h2>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-[var(--muted-foreground)] mb-1">年份</label>
                <input
                  name="year"
                  type="number"
                  min="1900"
                  max="2100"
                  defaultValue="2000"
                  className="w-full h-10 px-3 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-[var(--muted-foreground)] mb-1">月份</label>
                <input
                  name="month"
                  type="number"
                  min="1"
                  max="12"
                  defaultValue="2"
                  className="w-full h-10 px-3 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-[var(--muted-foreground)] mb-1">日期</label>
                <input
                  name="day"
                  type="number"
                  min="1"
                  max="31"
                  defaultValue="5"
                  className="w-full h-10 px-3 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-[var(--muted-foreground)] mb-2">时间模式</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="timeMode"
                    value="precise"
                    checked={timeMode === 'precise'}
                    onChange={() => setTimeMode('precise')}
                  />
                  <span className="text-sm text-[var(--foreground)]">精确时间</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="timeMode"
                    value="shichen"
                    checked={timeMode === 'shichen'}
                    onChange={() => setTimeMode('shichen')}
                  />
                  <span className="text-sm text-[var(--foreground)]">时辰</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="timeMode"
                    value="unknown"
                    checked={timeMode === 'unknown'}
                    onChange={() => setTimeMode('unknown')}
                  />
                  <span className="text-sm text-[var(--foreground)]">不知道</span>
                </label>
              </div>
            </div>

            {timeMode === 'precise' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[var(--muted-foreground)] mb-1">小时 (0-23)</label>
                  <input
                    name="hour"
                    type="number"
                    min="0"
                    max="23"
                    defaultValue="8"
                    className="w-full h-10 px-3 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)]"
                  />
                </div>
                <div>
                  <label className="block text-sm text-[var(--muted-foreground)] mb-1">分钟 (0-59)</label>
                  <input
                    name="minute"
                    type="number"
                    min="0"
                    max="59"
                    defaultValue="0"
                    className="w-full h-10 px-3 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)]"
                  />
                </div>
              </div>
            )}

            {timeMode === 'shichen' && (
              <div>
                <label className="block text-sm text-[var(--muted-foreground)] mb-1">时辰</label>
                <select
                  name="shichen"
                  className="w-full h-10 px-3 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)]"
                >
                  {SHICHEN_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}时</option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <label className="block text-sm text-[var(--muted-foreground)] mb-1">性别</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as 'male' | 'female')}
                className="w-full h-10 px-3 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)]"
              >
                <option value="male">男</option>
                <option value="female">女</option>
              </select>
            </div>

            <Button type="submit" variant="primary" className="w-full">
              排盘
            </Button>
          </form>

          {result && (
            <div className="bg-[var(--card)] rounded-lg p-6 border border-[var(--border)] space-y-4">
              <h2 className="text-lg font-semibold text-[var(--foreground)]">排盘结果</h2>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-[var(--muted-foreground)]">公历日期：</span>
                  <span className="text-[var(--foreground)]">{result.solarDate}</span>
                </div>
                <div>
                  <span className="text-[var(--muted-foreground)]">农历日期：</span>
                  <span className="text-[var(--foreground)]">{result.lunarDate}</span>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-[var(--foreground)] mb-2">四柱八字</h3>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: '年柱', pillar: result.yearPillar },
                    { label: '月柱', pillar: result.monthPillar },
                    { label: '日柱', pillar: result.dayPillar },
                    { label: '时柱', pillar: result.hourPillar },
                  ].map(({ label, pillar }) => (
                    <div key={label} className="text-center p-2 bg-[var(--secondary)] rounded">
                      <div className="text-xs text-[var(--muted-foreground)]">{label}</div>
                      <div className="text-lg font-semibold text-[var(--foreground)]">
                        {pillar.stemName}{pillar.branchName}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-[var(--foreground)] mb-2">大运</h3>
                <div className="flex flex-wrap gap-2">
                  {result.dayun.map((d, i) => (
                    <div key={i} className="px-3 py-1 bg-[var(--secondary)] rounded text-sm">
                      {d.age}岁 {d.stemName}{d.branchName}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-[var(--foreground)] mb-2">十神</h3>
                <div className="grid grid-cols-4 gap-2 text-sm">
                  <div className="text-center">
                    <div className="text-xs text-[var(--muted-foreground)]">年干</div>
                    <div className="text-[var(--foreground)]">{result.shiShen.yearStem}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-[var(--muted-foreground)]">月干</div>
                    <div className="text-[var(--foreground)]">{result.shiShen.monthStem}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-[var(--muted-foreground)]">日干</div>
                    <div className="text-[var(--foreground)]">{result.shiShen.dayStem}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xs text-[var(--muted-foreground)]">时干</div>
                    <div className="text-[var(--foreground)]">{result.shiShen.hourStem}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
