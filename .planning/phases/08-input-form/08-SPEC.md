# Phase 8: Input Form — Specification

**Created:** 2026-05-11
**Ambiguity score:** 0.13 (gate: ≤ 0.20)
**Requirements:** 4 locked

## Goal

Extract Phase 7's inline test form into a proper `BaziForm` component with complete input fields (year/month/day, lunar toggle, time mode, gender, name) and client-side validation — while keeping the existing 排盘 button and result display.

## Background

Phase 7 built the Bazi library functions (`src/lib/bazi/*`) and a `/bazi` page with an inline test form. The form currently has year/month/day inputs (公历 only), a time toggle, gender select, and a 排盘 button that calls the local library functions. This phase extracts the form into `src/components/bazi/BaziForm.tsx`, adds a lunar calendar toggle for date input, and implements form validation (required fields + range checks). The 排盘 button and result display remain functional from Phase 7.

## Requirements

1. **BaziForm component extraction**: Move form JSX from `page.tsx` into a reusable component.
   - Current: Form is inline JSX in `src/app/bazi/page.tsx`
   - Target: `src/components/bazi/BaziForm.tsx` exports `<BaziForm>` with all form state and logic; `page.tsx` imports and renders it
   - Acceptance: `page.tsx` imports `BaziForm`; `BaziForm.tsx` exports the component; build passes

2. **Lunar calendar toggle for date input**: Date fields support 公历/农历 switching.
   - Current: Date inputs are 公历 only; no lunar conversion display
   - Target: Toggle between 公历 and 农历 mode for year/month/day; in 农历 mode, month supports leap month indicator; date labels change to reflect mode
   - Acceptance: Toggling 公历/农历 changes the date input labels and calls correct calendar functions from Phase 7

3. **Gender required + name optional**: Form enforces gender selection and accepts optional name.
   - Current: Gender select exists but no enforced required state; no name field
   - Target: Gender is required — 排盘 button disabled until selected (男/女); name field is optional with placeholder "留空自动生成"
   - Acceptance: Button stays disabled when gender is unselected; button enables when gender chosen; name field accepts free text or empty

4. **Full field validation**: Form validates all inputs before enabling submission.
   - Current: No validation — button always enabled after gender selection
   - Target: All required fields validated: year (1900-2100), month (1-12, or 1-12 with leap for lunar), day (1-31, validated against month), gender (required). 排盘 button disabled until all valid
   - Acceptance: Invalid date (e.g., Feb 30) → button disabled; valid date + gender → button enabled; year outside 1900-2100 → button disabled

## Boundaries

**In scope:**
- `src/components/bazi/BaziForm.tsx` — form component with all inputs and validation
- Lunar/公历 toggle for date input
- Gender required enforcement
- Name optional field with placeholder
- Form validation (required + range + date validity)
- 排盘 button (functional, calls Phase 7 library functions)
- Result display area (保留 from Phase 7)
- Page.tsx updated to import BaziForm

**Out of scope:**
- API route (`/api/bazi`) — Phase 9
- LLM integration — Phase 9
- Loading animation — Phase 9
- Report rendering with 专业版/详解版 tabs — Phase 9
- HTML download — Phase 10
- Form submission to API — Phase 9 (currently calls local functions)

## Constraints

- Must reuse Phase 7 types (`BirthInput`, `Gender`, `TimeMode`) from `src/lib/bazi/types.ts`
- Must reuse Phase 7 calendar functions for lunar conversion validation
- Must use existing UI components (Button, PageLayout) and design tokens
- TypeScript strict — no `any`, no `@ts-ignore`

## Acceptance Criteria

- [ ] `src/components/bazi/BaziForm.tsx` exists and exports `<BaziForm>`
- [ ] `src/app/bazi/page.tsx` imports and renders `<BaziForm>` instead of inline JSX
- [ ] Toggling 公历/农历 changes date input labels
- [ ] 排盘 button disabled when gender unselected
- [ ] 排盘 button disabled when date fields empty or invalid
- [ ] 排盘 button enabled when all fields valid (year/month/day in range + gender selected)
- [ ] Name field accepts empty value and shows placeholder
- [ ] 排盘 button click still calls Phase 7 functions and displays results
- [ ] `npm run build` passes with zero TypeScript errors

## Ambiguity Report

| Dimension          | Score | Min  | Status | Notes                              |
|--------------------|-------|------|--------|------------------------------------|
| Goal Clarity       | 0.95  | 0.75 | ✓      | Extract component + validation     |
| Boundary Clarity   | 0.85  | 0.70 | ✓      | Explicit scope: form only, no API  |
| Constraint Clarity | 0.80  | 0.65 | ✓      | Reuse Phase 7 types + components   |
| Acceptance Criteria| 0.85  | 0.70 | ✓      | 9 pass/fail checks                 |
| **Ambiguity**      | 0.13  | ≤0.20| ✓      |                                    |

## Interview Log

| Round | Perspective | Question summary                      | Decision locked                         |
|-------|-------------|---------------------------------------|-----------------------------------------|
| 1     | Researcher  | Extract or rewrite form?              | Extract + enhance existing form         |
| 1     | Researcher  | Validation scope?                     | Required fields + range only            |
| 2     | Simplifier  | Keep 排盘 button + results?           | Yes, keep functional from Phase 7       |
| 2     | Simplifier  | Lunar calendar toggle?                | Yes, date supports 公历/农历 switch     |

---
*Phase: 08-input-form*
*Spec created: 2026-05-11*
*Next step: /gsd-discuss-phase 8*
