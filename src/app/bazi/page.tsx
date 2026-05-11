"use client";

import { useState } from "react";
import PageLayout from "@/components/layout/PageLayout";
import { BaziForm } from "@/components/bazi/BaziForm";
import { computeBazi } from "@/lib/bazi/calculator";
import type { BirthInput, BaziResult } from "@/lib/bazi/types";

export default function BaziPage() {
  const [result, setResult] = useState<BaziResult | null>(null);

  function handleCalculate(input: BirthInput) {
    const baziResult = computeBazi(input);
    setResult(baziResult);
  }

  return (
    <PageLayout title="算八字">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <BaziForm onCalculate={handleCalculate} />

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
