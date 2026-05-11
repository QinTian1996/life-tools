# Project Research Summary

**Project:** 喵十七的工具箱 — v3.0 八字命理工具
**Domain:** LLM-powered Bazi (八字) fortune-telling web tool
**Researched:** 2026-05-11
**Confidence:** HIGH

## Executive Summary

This is a Bazi analysis web tool that transforms birth data (date/time, gender, optional name) into AI-generated fortune reports. The core experience: user inputs birth details → sees loading animation with computed 八字 chart and rotating commentary → receives a scrollable dual-version report (专业版 + 详解版) → downloads as self-contained HTML. Experts build this by reusing the existing DeepSeek API infrastructure and adding the `lunisolar` library for 四柱 computation, keeping the stack minimal.

The recommended approach uses a non-streaming API route (vs the chat module's streaming) for the longer report generation, with client-side timer driving the 吐槽轮播 loading animation. Critical technical challenge is lunar calendar conversion accuracy around Chinese New Year and leap months. The primary risks are XSS from LLM-generated HTML, unbounded token costs, and calendar accuracy errors that would fundamentally flaw readings.

## Key Findings

### Recommended Stack

The research identified a minimal stack addition strategy. The `lunisolar` library (^2.6.0) provides all Bazi computation needs: `char8` for basic 四柱 and `char8ex` plugin for extended features (神煞, 十神, 纳音) on demand. No other new libraries needed — HTML download uses native Blob API, carousel uses pure CSS animations. The existing AI SDK infrastructure (`ai`, `@ai-sdk/react`, `@ai-sdk/deepseek`) is reused from the chat module.

**Core technologies:**
- **lunisolar**: Gregorian↔Lunar conversion + 四柱计算 — `char8` provides pillars directly, solar terms support
- **DeepSeek API (existing)**: Reuse from `src/app/api/chat/route.ts` pattern with `streamText` but non-streaming to client
- **Native Blob API**: HTML report download — no html2canvas/jspdf needed
- **CSS animations**: Rotating 吐槽 carousel — no framer-motion needed

### Expected Features

**Must have (table stakes):**
- Gregorian date input — primary mode for most users
- Gender selection (男/女) — required for 大运 direction and 六亲 analysis
- Loading animation with 八字 chart display — 30-60s wait needs engagement
- Dual-report rendering (专业版/详解版) — tab toggle between versions
- HTML download — self-contained takeaway value
- Re-submit clears previous report — expected behavior

**Should have (competitive):**
- Lunar date input — full lunar calendar support (high complexity, defer if needed)
- 八字 chart during loading — shows computation working, reduces abandonment
- Rotating 吐槽 carousel — entertainment during long wait
- LLM-generated name fallback — delightful default ("悠闲的狐狸" style)

**Defer (v2+):**
- PDF download — requires complex pipeline (pandoc + chromium), HTML sufficient
- User accounts — anonymous use per project constraints
- char8ex plugin features — only if user explicitly requests 神煞/十神/纳音

### Architecture Approach

The Bazi feature integrates with Next.js 16 + React 19 + Tailwind CSS 4 using a form → API → report data flow. A non-streaming API route (`/api/bazi`) computes 四柱 and 大运, then generates dual-format reports via DeepSeek LLM. The chat module's streaming pattern is not reused directly — Bazi reports are single long-form documents requiring `streamText` but awaiting full completion. React `useState` handles state management (no Zustand/Redux needed for this linear flow). Loading animation runs client-side via `setInterval` independent of API latency.

**Major components:**
1. **BaziForm** (`src/components/bazi/BaziForm.tsx`) — Input form with calendar toggle, date/time pickers, gender select, optional name
2. **BaziLoading** (`src/components/bazi/BaziLoading.tsx`) — Input echo, 四柱 display, 吐槽轮播 animation
3. **BaziReport** (`src/components/bazi/BaziReport.tsx`) — Tab-switched dual reports, scrollable markdown rendering
4. **API Route** (`src/app/api/bazi/route.ts`) — Bazi computation + LLM report generation + HTML download

### Critical Pitfalls

1. **XSS via LLM-Generated HTML** — LLM output rendered with `dangerouslySetInnerHTML` without sanitization enables arbitrary JS execution. Must use DOMPurify with strict allowed-tags list before rendering.

2. **Chinese Calendar Conversion Accuracy** — Wrong lunar date or 天干地支 calculation around Chinese New Year and leap months destroys reading credibility. Use `lunisolar` (not older `solarlunar`), cross-validate with known test values (Jan 25, 2020 = 己亥 year before Lichun).

3. **Unbounded Token Generation** — No `max_tokens` on API calls leads to unpredictable costs. Always set `max_tokens: 4000` for Bazi reports (longer than chat).

4. **Stream Abort Handling Bugs** — AI SDK's `onFinish` NOT called on stream abort without `consumeStream`. Must pass `consumeStream` and handle abort in both `onError` and `onFinish`.

5. **Form State Lost on Failed Submit** — React 19 default resets forms after submission. Must return submitted data on failure and restore form state on error.

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Foundation & Core Form
**Rationale:** Calendar utility and Bazi calculator are pure functions with no UI dependencies — build and test in isolation first. Form validation and state management are fundamental UX that other phases depend on.
**Delivers:** `src/lib/bazi/calendar.ts`, `src/lib/bazi/calculator.ts`, `BaziForm` component with validation
**Addresses:** Gregorian date input, gender selection, form validation, lunar conversion (if time permits)
**Avoids:** Pitfall B6 (form state lost on failure) — implement proper error-state return pattern

### Phase 2: Loading Experience & Basic Report
**Rationale:** Loading animation is critical for user engagement during 30-60s API wait. Report rendering with markdown and tab switching delivers the core value proposition.
**Delivers:** `BaziLoading` component with 吐槽轮播, `BaziReport` with dual-tab display, API route skeleton with stub responses
**Addresses:** Loading animation, 八字 chart during load, rotating 吐槽, report rendering
**Avoids:** Pitfall B5 (carousel CLS) — use CSS transforms only, honor `prefers-reduced-motion`; Pitfall B1 (XSS) — implement DOMPurify sanitization alongside first markdown render

### Phase 3: LLM Integration & Full API
**Rationale:** LLM prompt templates and full API route completion enable the actual fortune-telling. This phase has the highest risk (cost, latency, errors) so it comes after UI shell is verified.
**Delivers:** `/api/bazi` route with DeepSeek integration, dual-report prompt templates, full streaming abort handling
**Addresses:** Dual-report generation, LLM-generated name fallback
**Avoids:** Pitfalls 1, 3, 4, 6 — max_tokens, stream abort handling, API key security, timeout configuration

### Phase 4: HTML Download & Polish
**Rationale:** Download is a secondary feature (takeaway value) that should not block core experience. Chinese font embedding requires the report content to be finalized first.
**Delivers:** HTML download with self-contained styling and fonts, error handling refinement
**Avoids:** Pitfall B4 (Chinese fonts) — use base64-embedded fonts or Google Fonts with unicode-range

### Phase Ordering Rationale

- **Foundation before UI**: Calendar and calculator are testable in isolation; UI depends on their interfaces
- **Loading before LLM**: Animation must work with stubbed responses before real API integration
- **Report before Download**: Download needs finalized report structure and styling
- **UI shell before LLM**: Verify all UI states (loading, error, success) with fake data first

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 1 (Calendar conversion)**: MEDIUM confidence — need to verify `lunisolar` handles edge cases (leap months, CNY boundary) with actual test dates
- **Phase 3 (LLM prompts)**: Prompt engineering for dual-report format needs iteration — may need multiple planning cycles

Phases with standard patterns (skip research-phase):
- **Phase 2 (Loading animation)**: CSS animations are well-documented; carousel accessibility patterns are standard
- **Phase 4 (HTML download)**: Native Blob API + template approach is straightforward

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | `lunisolar` verified via Context7 docs, existing AI SDK confirmed in project |
| Features | HIGH | Detailed requirements from bazi-minimal skill, dual-report format established |
| Architecture | HIGH | Clear data flow, existing patterns to follow, non-streaming decision well-reasoned |
| Pitfalls | HIGH | Multiple high-quality sources, Bazi-specific pitfalls thoroughly documented |

**Overall confidence:** HIGH

### Gaps to Address

- **Calendar library verification**: `lunisolar` is recommended but FEATURES.md suggested `lunar-calendar` or `chinese-calendar`. Need to confirm `lunisolar` handles lunar→Gregorian conversion for birth date inputs (not just Bazi computation).
- **LLM report quality**: Prompt templates need iteration with actual DeepSeek responses. Budget for 2-3 prompt refinement cycles.
- **Typical wait time**: FEATURES.md estimates 30-60s for LLM generation. This affects loading animation content — may need adjustment based on实测.

## Sources

### Primary (HIGH confidence)
- **Context7 lunisolar docs** — Calendar computation API, char8 usage patterns
- **lunisolar GitHub** — Plugin architecture for char8ex, active maintenance status (Aug 2025)
- **bazi-minimal/SKILL.md** — Bazi analysis methodology (陆致极 + 韦千里), dual-report format
- **Vercel AI SDK docs** — `streamText` abort handling, `consumeStream` requirement

### Secondary (MEDIUM confidence)
- **bazi-minimal/templates/report-template.html** — HTML styling template
- **lunar-javascript GitHub issues** — Calendar edge case discussions
- **FEATURES.md lunar conversion** — nongli114.com search format for verification

### Tertiary (LOW confidence)
- **AI SDK abort handling** — Needs live testing to confirm `onFinish` + `consumeStream` behavior
- **LLM prompt quality** — Requires iteration; initial prompts may need significant refinement

---
*Research completed: 2026-05-11*
*Ready for roadmap: yes*