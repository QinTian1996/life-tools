---
phase: "10"
phase_name: "Download + Polish"
project: "喵十七的工具箱"
generated: "2026-05-11"
counts:
  decisions: 1
  lessons: 1
  patterns: 1
  surprises: 0
missing_artifacts: []
---

# Phase 10 Learnings: Download + Polish

## Decisions

### Blob download + CDN fonts = zero server cost
下载用 `URL.createObjectURL(blob)` 在前端生成，不经过 API。CDN 字体 (`jsDelivr`) 嵌入 `<link>` 标签，下载的 HTML 自包含——没有后端依赖。

**Rationale:** 不需要额外 API 路由或 Puppeteer，纯客户端方案。
**Source:** download.ts

## Lessons

### scoped `<style>` 比 Tailwind prose 插件更适合 LLM HTML
LLM 输出的 HTML 片段没有 Tailwind 类名，用 `prose` 插件需要 `@tailwindcss/typography` 依赖且样式不可控。注入 `<style>` 标签直接写 CSS 选择器 + `var(--token)`，更精确、零依赖。

**Context:** 对比了 prose 插件和 scoped style 方案，后者对 LLM HTML 控制力更强。
**Source:** BaziReportTab.tsx

## Patterns

### 组件内 `<style>` 注入用于第三方 HTML 样式化
当渲染不受控 HTML（LLM 输出、Markdown 转 HTML）时，在组件内注入 scoped `<style>` 标签是轻量方案。适用于 Next.js App Router，无需额外配置。

**When to use:** 渲染第三方/sanitized HTML 内容时。
**Source:** BaziReportTab.tsx
