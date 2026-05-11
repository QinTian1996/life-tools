/**
 * HTML Report Download Utility
 * Blob-based download with full HTML template including CDN fonts
 */

/**
 * Triggers browser download of report as HTML file
 */
export function downloadReportAsHtml(
  content: string,
  version: 'professional' | 'detailed',
  inputName?: string
): void {
  const title = `八字报告-${inputName || '未命名'}-${version === 'professional' ? '专业版' : '详解版'}`;
  const html = buildDownloadTemplate(content, title, version, inputName);

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `${title}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Builds a complete HTML document for download
 */
export function buildDownloadTemplate(
  content: string,
  title: string,
  version: 'professional' | 'detailed',
  inputName?: string
): string {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/lxgw-wenkai-webfont@1.7.0/lxgwwenkai-regular.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/lxgw-wenkai-webfont@1.7.0/lxgwwenkai-light.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/lxgw-wenkai-webfont@1.7.0/lxgwwenkai-bold.css">
  <style>
    body { background: oklch(0.98 0.01 50); color: oklch(0.18 0.01 50); }
    /* CSS variables for light mode */
    :root {
      --primary: oklch(0.769 0.188 70.08);
      --foreground: oklch(0.18 0.01 50);
      --card: oklch(0.98 0.01 50);
      --border: oklch(0.92 0.02 50);
      --font-brand: "LXGW WenKai", system-ui, sans-serif;
    }
    /* Dark mode */
    @media (prefers-color-scheme: dark) {
      :root {
        --primary: oklch(0.828 0.189 84.43);
        --foreground: oklch(0.96 0.01 50);
        --card: oklch(0.25 0.01 50);
        --border: oklch(0.35 0.02 50);
      }
    }
    /* Scoped styles matching BaziReportTab */
    .bazi-report {
      font-family: var(--font-brand);
      color: var(--foreground);
      line-height: 1.7;
    }
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
  </style>
</head>
<body>
  <div class="bazi-report" style="max-width: 800px; margin: 2rem auto; padding: 2rem; background: var(--card); border-radius: 0.5rem;">
    ${content}
  </div>
  <footer style="text-align: center; margin-top: 2rem; color: var(--foreground); opacity: 0.7; font-size: 0.875rem;">
    —— 喵十七 · 八字命理
  </footer>
</body>
</html>`;
}