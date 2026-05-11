# Phase 9: Loading + Report - Context

**Gathered:** 2026-05-11
**Status:** Ready for planning
**SPEC:** 7 requirements locked (09-SPEC.md, ambiguity 0.18)

## Phase Boundary

Build `/api/bazi/roasts` + `/api/bazi/report` API routes, loading animation with roast carousel, and dual-version report rendering with DOMPurify sanitization and abort support. Replace Phase 7 local `computeBazi()` call with API-driven flow.

## Requirements (locked via SPEC.md)

**7 requirements are locked.** See `09-SPEC.md` for full requirements with current/target/acceptance.

**In scope:**
- `/api/bazi/roasts` + `/api/bazi/report` API routes (DeepSeek deepseek-v4-flash)
- Loading animation (input echo + four pillars + roast carousel)
- BaziReport container + BaziReportTab child components
- Dual-version tab toggle (专业版/详解版)
- DOMPurify sanitization before `dangerouslySetInnerHTML`
- AbortController cancel button
- Form collapses to summary after report

**Out of scope:**
- HTML download — Phase 10
- PDF — not planned
- Streaming rendering — non-streaming to client

## Implementation Decisions

### API Design

- **D-01:** Two separate routes: `POST /api/bazi/roasts` and `POST /api/bazi/report`
  - Both accept `BirthInput` fields in JSON body
  - Roasts returns `{ roasts: string[] }` — fast (~2-5s)
  - Report returns `{ professional: string, detailed: string }` — slow (30-60s)
  - Both use `@ai-sdk/deepseek` with `deepseek('deepseek-v4-flash')` and `streamText`
  - Reuse existing DeepSeek API key from `.env.local` (`DEEPSEEK_API_KEY`)
- **D-02:** Prompt templates live in `src/lib/bazi/prompts/` as independent files
  - `roasts.txt` — prompt for generating N roast jokes
  - `report-professional.txt` — prompt for 专业版 report
  - `report-detailed.txt` — prompt for 详解版 report

### Report Component Structure

- **D-03:** `BaziReport` (container) + `BaziReportTab` (child per version)
  - BaziReport manages tab state (`'professional' | 'detailed'`) and receives both version contents as props
  - BaziReportTab renders a single version's sanitized HTML
- **D-04:** Report template wraps LLM content fragments in project-styled HTML
  - Template structure: basic info table + four pillars table + dayun table + four-perspective analysis (强弱/调候/格局/形象) + conclusion
  - LLM outputs HTML content fragments; frontend wraps them in the template with project design tokens

### Loading Flow

- **D-05:** Two-step sequential flow managed in page.tsx:
  1. User clicks 排盘 → `status: 'loading-roasts'` → call `/api/bazi/roasts`
  2. Roasts return → `status: 'loading-report'` → start carousel → call `/api/bazi/report`
  3. Report returns → `status: 'done'` → render report
- **D-06:** Loading state shows: birth input summary + computed four pillars + roast carousel
  - Four pillars: computed client-side from Phase 7 `computeBazi()` (no API needed)
  - Carousel: JS `setInterval` every 5s, CSS `transition: opacity` for fade in/out

### DoMPurify Integration

- **D-07:** `npm install dompurify @types/dompurify`
- **D-08:** Sanitize in BaziReportTab before `dangerouslySetInnerHTML`:
  ```tsx
  import DOMPurify from 'dompurify';
  const clean = DOMPurify.sanitize(content);
  <div dangerouslySetInnerHTML={{ __html: clean }} />
  ```

### Cancel / Abort

- **D-09:** 排盘 button transforms to "取消" during loading
  - Uses `AbortController` shared across both API calls
  - On cancel: abort both calls, reset `status` to `'form'`
  - Form values preserved, no report rendered
- **D-10:** AbortController created at submit time, passed to both fetch calls via `signal`

### Form State After Report

- **D-11:** After report renders, BaziForm collapses to a compact summary row:
  - Shows: "2000年1月1日 12:00 男" (input summary) + "重新排盘" button
  - Clicking expands back to full form, clears report
  - State managed in page.tsx via `status` + a `collapsed` boolean

### the agent's Discretion

The following are left to the planner and researcher:
- Exact prompt text in `src/lib/bazi/prompts/*.txt`
- Report template HTML structure and CSS within project design tokens
- Carousel animation details (exact CSS transition values)
- API route implementation (how to call `streamText`, parse response)
- Error handling specifics (timeout values, retry logic)
- How BirthInput fields are mapped to LLM prompt variables

## Canonical References

- `.planning/phases/09-loading-report/09-SPEC.md` — **Locked requirements** — MUST read before planning
- `.planning/REQUIREMENTS.md` — v3.0 requirements BZ-09..BZ-13, BZ-16, BZ-17
- `.planning/research/SUMMARY.md` — Research findings (lunisolar, DeepSeek API)
- `src/app/api/chat/route.ts` — Existing LLM API pattern to adapt
- `src/lib/bazi/types.ts` — BirthInput, BaziResult types
- `src/lib/bazi/calculator.ts` — computeBazi() for four pillars during loading
- `src/components/bazi/BaziForm.tsx` — Form component to integrate with
- `bazi-minimal/templates/report-template.html` — Reference report template
- `bazi-minimal/SKILL.md` — Reference analysis methodology

## Existing Code Insights

### Reusable Assets
- **Chat API pattern**: `src/app/api/chat/route.ts` — DeepSeek + streamText + error handling
- **computeBazi()**: `src/lib/bazi/calculator.ts` — already computes four pillars client-side
- **BaziForm**: `src/components/bazi/BaziForm.tsx` — form to preserve/collapse
- **PageLayout**: `src/components/layout/PageLayout.tsx` — page wrapper

### Integration Points
- `src/app/bazi/page.tsx` — needs state machine refactor (form → loading → report)
- New: `src/app/api/bazi/roasts/route.ts` + `src/app/api/bazi/report/route.ts`
- New: `src/components/bazi/BaziReport.tsx` + `BaziReportTab.tsx`
- New: `src/lib/bazi/prompts/` — prompt template files
- New npm dep: `dompurify` + `@types/dompurify`

## Deferred Ideas

None — discussion stayed within Phase 9 scope.

---
*Phase: 09-Loading + Report*
*Context gathered: 2026-05-11*
