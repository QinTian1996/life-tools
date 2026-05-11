"use client";

import { useState } from "react";
import { BaziReportTab } from "./BaziReportTab";
import { downloadReportAsHtml } from "@/lib/bazi/download";

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
      <div className="flex items-center justify-between border-b border-[var(--border)]">
        <div className="flex flex-1">
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
        <button
          onClick={() => downloadReportAsHtml(
            activeTab === 'professional' ? professional : detailed,
            activeTab,
            inputName
          )}
          className="mr-3 px-3 py-1.5 text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--secondary)] rounded transition-colors flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          下载报告
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
