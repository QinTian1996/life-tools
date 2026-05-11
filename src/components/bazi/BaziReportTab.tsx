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
    <div
      className="bazi-report prose prose-sm max-w-none"
      dangerouslySetInnerHTML={{ __html: cleanContent }}
    />
  );
}
