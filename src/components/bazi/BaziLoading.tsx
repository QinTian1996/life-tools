"use client";

import type { BirthInput, BaziResult } from "@/lib/bazi/types";
import { PillarDisplay } from "./PillarDisplay";
import { RoastCarousel } from "./RoastCarousel";

interface BaziLoadingProps {
  input: BirthInput;
  baziResult: BaziResult;
  roasts: string[];
  phase: 'roasts' | 'report';
}

function formatInputSummary(input: BirthInput): string {
  const dateStr = `${input.year}年${input.month}月${input.day}日`;
  const genderStr = input.gender === 'male' ? '男' : '女';

  let timeStr = '';
  if (input.timeMode === 'precise' && input.hour !== undefined) {
    timeStr = ` ${String(input.hour).padStart(2, '0')}:${String(input.minute || 0).padStart(2, '0')}`;
  } else if (input.timeMode === 'shichen' && input.shichen) {
    timeStr = ` ${input.shichen}时`;
  } else {
    timeStr = ' 时间不详';
  }

  return `${dateStr}${timeStr} ${genderStr}`;
}

export function BaziLoading({ input, baziResult, roasts, phase }: BaziLoadingProps) {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="text-center">
        <div className="inline-block px-4 py-2 bg-[var(--card)] rounded-full border border-[var(--border)]">
          <span className="text-[var(--muted-foreground)]">正在分析：</span>
          <span className="text-[var(--foreground)] font-medium">
            {formatInputSummary(input)}
          </span>
          {input.name && (
            <span className="text-[var(--muted-foreground)] ml-2">（{input.name}）</span>
          )}
        </div>
      </div>

      <div className="bg-[var(--card)] rounded-lg p-4 border border-[var(--border)]">
        <h3 className="text-sm font-medium text-[var(--muted-foreground)] mb-3 text-center">
          四柱八字
        </h3>
        <PillarDisplay result={baziResult} />
      </div>

      <div className="text-center text-sm text-[var(--muted-foreground)]">
        {phase === 'roasts' ? (
          <span>正在生成吐槽...</span>
        ) : (
          <span>正在生成命理报告（预计30-60秒）...</span>
        )}
      </div>

      <RoastCarousel roasts={roasts} />
    </div>
  );
}
