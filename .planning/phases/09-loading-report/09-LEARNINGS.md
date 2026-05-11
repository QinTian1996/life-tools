---
phase: "9"
phase_name: "Loading + Report"
project: "喵十七的工具箱"
generated: "2026-05-11"
counts:
  decisions: 1
  lessons: 2
  patterns: 1
  surprises: 1
missing_artifacts: []
---

# Phase 9 Learnings: Loading + Report

## Decisions

### Report API uses generateText not streamText
虽然项目已有 `streamText` 模式（chat API），八字报告用 `generateText` 更合适——报告需要整篇返回做 tab 切换，不需要逐字流式渲染。roasts API 同理。

**Rationale:** 报告有两个版本（专业版/详解版），需要一次性拿到全部内容才能渲染 tab 切换。流式传输反而增加复杂度。
**Source:** 09-01-PLAN.md

## Lessons

### LLM JSON 响应需要处理 markdown 包裹
DeepSeek 经常把 JSON 包在 markdown 代码块里（```json ... ```），即使 prompt 明确要求纯 JSON。API route 里需要 `replace(/```json\s*|\s*```/g, '')` 清理后再 `JSON.parse`。

**Context:** roasts API 的 prompt 要求返回 `["roast1", "roast2"]` 格式，但 LLM 实际返回了 ` ```json ["roast1", "roast2"] ``` `。
**Source:** /api/bazi/roasts route.ts

### 状态机重构了 page.tsx 的整个结构
Phase 9 从简单的 form→result 变成了 form→loading-roasts→loading-report→done 四状态。每个状态有不同的 UI 布局（loading 层 vs report 层）。状态切换需要清理 AbortController 和上一个状态的数据。

**Context:** 原 page.tsx 只有 `result` 状态，Phase 9 完全重写了页面逻辑。
**Source:** page.tsx

## Patterns

### 渐进式组件化：内联 → 独立组件
Phase 7 内联表单 → Phase 8 BaziForm 组件 → Phase 9 BaziLoading/BaziReport 组件。每个阶段在前一个基础上抽取，不推翻重来。

**When to use:** 多阶段 UI 开发，先验证功能再组件化。
**Source:** 07→08→09 phase progression

## Surprises

### 报告内容太长，需要用 markdown 转 HTML
LLM 输出的报告（几千字 + 表格）如果用纯文本 `<p>` 渲染会丢失格式。需要让 LLM 输出 markdown，前端用 `marked` 或类似库转成 HTML，再用 DOMPurify 消毒。

**Impact:** 当前实现让 LLM 输出 HTML 片段，但大段表格在 prompt 里描述格式很困难。后续可能需要引入 markdown 渲染管线。
**Source:** BaziReportTab.tsx implementation
