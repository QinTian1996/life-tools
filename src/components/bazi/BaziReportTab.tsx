"use client";

import { useMemo } from "react";
import DOMPurify from "dompurify";

interface BaziReportTabProps {
  content: string;
  version: 'professional' | 'detailed';
}

export function BaziReportTab({ content, version }: BaziReportTabProps) {
  const cleanContent = useMemo(() => {
    const clean = DOMPurify.sanitize(content, {
      ALLOWED_TAGS: [
        'p', 'br', 'h1', 'h2', 'h3', 'h4',
        'strong', 'b', 'em', 'i', 'u',
        'table', 'thead', 'tbody', 'tr', 'th', 'td',
        'span', 'div', 'ul', 'ol', 'li',
      ],
      ALLOWED_ATTR: ['class', 'style'],
      ALLOW_DATA_ATTR: false,
    });
    return clean;
  }, [content]);

  return (
    <>
      <style>{`
        .bazi-report h2 {
          font-family: var(--font-brand);
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--primary);
          margin: 1.5rem 0 0.75rem;
        }
        .bazi-report h3 {
          font-size: 1.125rem;
          font-weight: 600;
          margin: 1.25rem 0 0.5rem;
        }
        .bazi-report p {
          margin: 0.75rem 0;
          line-height: 1.7;
        }
        .bazi-report table {
          width: 100%;
          border-collapse: collapse;
          margin: 1rem 0;
        }
        .bazi-report th, .bazi-report td {
          border: 1px solid var(--border);
          padding: 0.5rem 0.75rem;
          text-align: left;
        }
        .bazi-report th {
          background: var(--primary);
          color: white;
          font-weight: 600;
        }
        .bazi-report tr:nth-child(even) {
          background: oklch(0.98 0.01 50 / 0.5);
        }
        @media (prefers-color-scheme: dark) {
          .bazi-report tr:nth-child(even) {
            background: oklch(0.25 0.01 50 / 0.5);
          }
        }
        .bazi-report ul, .bazi-report ol {
          margin: 0.75rem 0;
          padding-left: 1.5rem;
        }
        .bazi-report li {
          margin: 0.25rem 0;
        }
      `}</style>
      <div
        className="bazi-report text-[var(--foreground)] leading-relaxed space-y-4"
        dangerouslySetInnerHTML={{ __html: cleanContent }}
      />
    </>
  );
}
