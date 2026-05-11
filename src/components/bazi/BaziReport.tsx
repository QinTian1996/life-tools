"use client";

import { useState } from "react";
import { BaziReportTab } from "./BaziReportTab";

interface BaziReportProps {
  professional: string;
  detailed: string;
  inputName?: string;
}

type TabVersion = 'professional' | 'detailed';

export function BaziReport({ professional, detailed, inputName }: BaziReportProps) {
  const [activeTab, setActiveTab] = useState<TabVersion>('professional');

  return (
    <div className="bg-[var(--card)] rounded-lg border border-[var(--border)] overflow-hidden">
      <div className="flex border-b border-[var(--border)]">
        <button
          onClick={() => setActiveTab('professional')}
          className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
            activeTab === 'professional'
              ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
              : 'bg-[var(--secondary)] text-[var(--muted-foreground)] hover:bg-[var(--secondary)]/80'
          }`}
        >
          专业版
        </button>
        <button
          onClick={() => setActiveTab('detailed')}
          className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
            activeTab === 'detailed'
              ? 'bg-[var(--primary)] text-[var(--primary-foreground)]'
              : 'bg-[var(--secondary)] text-[var(--muted-foreground)] hover:bg-[var(--secondary)]/80'
          }`}
        >
          详解版
        </button>
      </div>

      <div className="p-6 overflow-y-auto max-h-[70vh]">
        {activeTab === 'professional' ? (
          <BaziReportTab content={professional} version="professional" />
        ) : (
          <BaziReportTab content={detailed} version="detailed" />
        )}
      </div>
    </div>
  );
}
