# Phase 8: Input Form - Context

**Gathered:** 2026-05-11
**Status:** Ready for planning
**SPEC:** 4 requirements locked (08-SPEC.md, ambiguity 0.13)

## Phase Boundary

Extract Phase 7's inline test form into `src/components/bazi/BaziForm.tsx`, add full input fields (lunar toggle, time modes, gender, name), and implement client-side validation — button disabled until all required fields pass. Keep Phase 7's 排盘 button and result display functional.

## Requirements (locked via SPEC.md)

**4 requirements are locked.** See `08-SPEC.md` for full requirements with current/target/acceptance.

**In scope (from SPEC.md):**
- `src/components/bazi/BaziForm.tsx` — form component
- Lunar/公历 toggle for date input
- Gender required enforcement
- Name optional field with placeholder
- Form validation (required + range)
- 排盘 button (calls Phase 7 library functions)
- Result display area (保留)

**Out of scope:**
- API route — Phase 9
- Loading animation — Phase 9
- Report rendering — Phase 9
- HTML download — Phase 10

## Implementation Decisions

### Component Structure

- **D-01:** BaziForm lives in `src/components/bazi/BaziForm.tsx`, imported by `src/app/bazi/page.tsx`
- **D-02:** BaziForm props accept an `onCalculate` callback — form passes `BirthInput` data up; page.tsx calls Phase 7 library functions and renders results
- **D-03:** Result display (`公历/农历/四柱`) stays in `page.tsx`, NOT inside BaziForm — form is pure input, parent handles output

### Lunar Calendar Toggle

- **D-04:** 公历/农历 toggle uses a toggle switch (公历 ↔ 农历)
- **D-05:** In 农历 mode, month field should accommodate leap month (闰月). The simplest approach: a checkbox "闰月" appears next to the month select when 农历 is active

### Validation

- **D-06:** Validation approach: button disabled until all required fields pass. No inline error messages. No toast/popup.
- **D-07:** Validation rules:
  - Year: 1900–2100, required
  - Month: 1–12, required (in 农历 mode, leap month handled via checkbox)
  - Day: 1–31, validated against month, required
  - Gender: 男/女, required
  - Name: optional, no validation
  - Time: always valid (precise/shichen/unknown all produce valid values)

### Name Field

- **D-08:** Name input placeholder text: "留空将自动生成"
- **D-09:** Name value is stored in `BirthInput.name` — if empty string, downstream Phase 9 LLM will generate a name

### Form Layout

- **D-10:** Form uses two-row compact layout:
  - Row 1 (numeric): year / month / day inputs + gender select + 排盘 button
  - Row 2 (toggles): 公历↔农历 toggle + time mode toggle (精确/时辰/不知道)
  - Name field: below rows
  - Goal: minimize form height so result area is visible without scrolling

### the agent's Discretion

The following are left to the planner and researcher:
- Exact BaziForm props interface (what fields, callback signature)
- Toggle switch implementation (custom CSS or a library like `@radix-ui/react-switch`)
- Validation logic organization (inline checks vs separate validation function)
- CSS layout — flex/grid arrangement of form fields
- Whether to use `<input type="number">` or `<input type="text">` with pattern validation for year/month/day
- Leap month UI in lunar mode (checkbox, select option, or toggle)

## Canonical References

- `.planning/phases/08-input-form/08-SPEC.md` — **Locked requirements** — MUST read before planning
- `.planning/phases/07-foundation/07-SPEC.md` — Phase 7 types and functions this phase depends on
- `.planning/phases/07-foundation/07-CONTEXT.md` — Phase 7 implementation decisions (file structure, patterns)
- `.planning/REQUIREMENTS.md` — v3.0 requirements BZ-04, BZ-05
- `.planning/ROADMAP.md` — Phase 8 goal and success criteria
- `src/app/bazi/page.tsx` — Current inline form (will be refactored)
- `src/lib/bazi/types.ts` — BirthInput, Gender, TimeMode types
- `src/components/ui/Button.tsx` — Button component API

## Existing Code Insights

### Reusable Assets
- **BirthInput type**: `src/lib/bazi/types.ts` — already has all fields: year, month, day, hour, minute, calendar, timeMode, gender, name
- **Phase 7 page**: `src/app/bazi/page.tsx` — contains inline form + result display to extract from
- **Button**: `src/components/ui/Button.tsx` — `variant="primary"`, `disabled` prop
- **Design tokens**: `bg-[var(--background)]`, `text-[var(--foreground)]`, etc.

### Established Patterns
- Components use named exports: `export function BaziForm({ ... }: BaziFormProps)`
- Client components use `"use client"` directive when using React hooks
- Import paths follow `@/` alias convention: `@/components/bazi/BaziForm`

### Integration Points
- `page.tsx` imports BaziForm and passes `onCalculate` callback
- `BaziForm` builds a `BirthInput` object and calls `onCalculate(input)`
- `page.tsx` calls `computeBazi(input)` from Phase 7 lib and displays result
- Phase 9 will replace the local `computeBazi` call with an API call

## Deferred Ideas

None — discussion stayed within Phase 8 scope.

---
*Phase: 08-Input Form*
*Context gathered: 2026-05-11*
