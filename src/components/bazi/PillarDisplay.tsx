"use client";

import type { BaziResult } from "@/lib/bazi/types";

interface PillarDisplayProps {
  result: BaziResult;
}

export function PillarDisplay({ result }: PillarDisplayProps) {
  const pillars = [
    { label: '年柱', pillar: result.yearPillar },
    { label: '月柱', pillar: result.monthPillar },
    { label: '日柱', pillar: result.dayPillar },
    { label: '时柱', pillar: result.hourPillar },
  ];

  return (
    <div className="grid grid-cols-4 gap-3">
      {pillars.map(({ label, pillar }) => (
        <div key={label} className="text-center p-3 bg-[var(--secondary)] rounded-lg">
          <div className="text-xs text-[var(--muted-foreground)] mb-1">{label}</div>
          <div className="text-lg font-semibold text-[var(--foreground)]">
            {pillar.stemName}{pillar.branchName}
          </div>
        </div>
      ))}
    </div>
  );
}
