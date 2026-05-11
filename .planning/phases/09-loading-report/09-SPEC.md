# Phase 9: Loading + Report — Specification

**Created:** 2026-05-11
**Ambiguity score:** 0.18 (gate: ≤ 0.20)
**Requirements:** 7 locked

## Goal

API route generates Bazi report (non-streaming) via DeepSeek LLM, while page shows loading animation (input echo + four pillars + LLM roast carousel), then renders scrollable dual-version report with sanitized HTML and abort support.

## Background

Phase 7 built the library functions and page skeleton. Phase 8 built the BaziForm component. The page currently calls `computeBazi()` locally to display results. This phase replaces the local call with a two-step API: first a fast call for roast jokes (displayed as carousel during wait), then a slow call for the full report. No `/api/bazi` route exists yet.

## Requirements

1. **Bazi API route**: `/api/bazi` accepts `BirthInput` and returns LLM-generated content.
   - Current: No `/api/bazi` route exists; page calls local `computeBazi()`
   - Target: `POST /api/bazi` accepts JSON body with `BirthInput` fields; calls DeepSeek via `streamText` but returns full response (non-streaming to client); returns `{ roasts: string[], report: { professional: string, detailed: string } }`
   - Acceptance: API returns 200 with valid JSON for valid input; returns 400 for invalid input; uses deepseek-v4-flash model

2. **Two-step loading flow**: Fast roast call then slow report call.
   - Current: Button click immediately shows local computation results
   - Target: On submit → call API with `mode: 'roasts'` first (fast, ~2-5s) → start carousel animation → call API with `mode: 'report'` (slow, 30-60s) → render report
   - Acceptance: Roasts appear within 5s of submit; carousel begins immediately; report appears when second call completes

3. **Loading animation**: Input echo + four pillars + roast carousel.
   - Current: No loading state — results appear instantly
   - Target: During wait: show birth input summary, computed four pillars (四柱), and rotating roasts (LLM-generated, fade in/out every 5 seconds)
   - Acceptance: Carousel cycles through roasts with visible fade transition; four pillars correctly displayed; input info visible

4. **Dual-version report rendering**: Professional and plain-language versions.
   - Current: Simple text display of computation results
   - Target: Report renders as HTML in a scrollable area with tab toggle: 专业版 / 详解版. Content is LLM-generated HTML (sanitized via DOMPurify before `dangerouslySetInnerHTML`). Follows project design language (warm colors, LXGW WenKai font)
   - Acceptance: Both tabs render without layout breakage; switching tabs is instant; HTML renders safely

5. **Report display layout**: Report occupies main area, input stays at bottom.
   - Current: Form + results in vertical flow
   - Target: After generation, report is in scrollable main area; BaziForm remains at bottom (compact/collapsed style); form values preserved for re-submission
   - Acceptance: Report scrolls independently from form; form values unchanged after report generation

6. **Re-submit clears old report**: New submission replaces previous results.
   - Current: N/A — no previous report to clear
   - Target: Submitting new input clears old report content and roasts, starts fresh loading animation
   - Acceptance: After re-submit, old report is gone; new loading animation begins; no residual content

7. **Abort support**: User can cancel in-flight API requests.
   - Current: No abort mechanism
   - Target: During loading, a cancel button appears; clicking it calls `abortController.abort()` on both API calls; page returns to form state
   - Acceptance: Clicking cancel stops loading animation; form returns to pre-submit state; no report rendered

## Boundaries

**In scope:**
- `src/app/api/bazi/route.ts` — two-mode API (roasts + report) via DeepSeek
- Loading animation component with carousel
- Report rendering with tab toggle (专业版/详解版)
- DOMPurify sanitization
- AbortController cancel button
- Report scrollable, form at bottom
- Re-submit clears previous state

**Out of scope:**
- HTML report download — Phase 10
- Report PDF generation — not planned
- Streaming (character-by-character) report rendering — non-streaming to client
- Report caching/persistence — regenerate on each submit
- DeepSeek model selection UI — hardcoded to deepseek-v4-flash

## Constraints

- LLM: DeepSeek API (process.env.DEEPSEEK_API_KEY), model deepseek-v4-flash
- API route follows existing `/api/chat` pattern (Next.js App Router)
- DOMPurify must be installed and applied before any `dangerouslySetInnerHTML`
- AbortController must clean up both API calls on cancel
- TypeScript strict — no `any`, no `@ts-ignore`

## Acceptance Criteria

- [ ] `POST /api/bazi` returns valid JSON with `roasts` and `report` fields
- [ ] Carousel displays roasts with 5-second fade transition between items
- [ ] 专业版 and 详解版 tabs render LLM HTML content correctly
- [ ] DOMPurify prevents script injection in rendered HTML
- [ ] Cancel button stops loading and returns to form state
- [ ] Re-submitting clears old report and starts fresh
- [ ] `npm run build` passes with zero TypeScript errors

## Ambiguity Report

| Dimension          | Score | Min  | Status | Notes                              |
|--------------------|-------|------|--------|------------------------------------|
| Goal Clarity       | 0.90  | 0.75 | ✓      | Two-step API + carousel + dual tabs |
| Boundary Clarity   | 0.80  | 0.70 | ✓      | Explicit scope: API, loading, report |
| Constraint Clarity | 0.80  | 0.65 | ✓      | DeepSeek, non-streaming, DOMPurify  |
| Acceptance Criteria| 0.75  | 0.70 | ✓      | 7 pass/fail checks                 |
| **Ambiguity**      | 0.18  | ≤0.20| ✓      |                                    |

## Interview Log

| Round | Perspective | Question summary                      | Decision locked                         |
|-------|-------------|---------------------------------------|-----------------------------------------|
| 1     | Researcher  | LLM integration pattern?              | New non-streaming /api/bazi route       |
| 1     | Researcher  | Loading state during API call?        | Input echo + four pillars + roast carousel |
| 2     | Simplifier  | Where do roasts come from?            | Two API calls: fast roasts, slow report  |

---
*Phase: 09-loading-report*
*Spec created: 2026-05-11*
*Next step: /gsd-discuss-phase 9*
