# Phase 7: Foundation — Specification

**Created:** 2026-05-11
**Ambiguity score:** 0.20 (gate: ≤ 0.20)
**Requirements:** 7 locked

## Goal

Calendar utilities (lunisolar-powered Gregorian↔Lunar conversion) and Bazi 四柱 calculator as pure TypeScript functions, plus `/bazi` route skeleton with PageLayout wrapper — no UI form, testable in isolation.

## Background

No calendar or Bazi computation code exists in the codebase. The home page has a "算八字" button linking to `/bazi` but the route does not exist. The `bazi-minimal/` directory contains reference templates (HTML report, analysis framework) but no executable code. This phase builds the foundation: install `lunisolar`, create utility modules, scaffold the page.

## Requirements

1. **Lunisolar integration**: Install and configure `lunisolar` for calendar + Bazi computation.
   - Current: No calendar library installed
   - Target: `lunisolar` ^2.6.0 installed via npm; `src/lib/bazi/calendar.ts` exports Gregorian↔Lunar conversion functions
   - Acceptance: `npm ls lunisolar` shows installed; `calendar.ts` exports at minimum `toLunar(date)` and `toSolar(lunarDate)`

2. **Separate year/date/time input model**: Functions accept year, month, day as separate parameters.
   - Current: No input model exists
   - Target: `src/lib/bazi/types.ts` defines `BirthInput { year, month, day, hour?, minute?, calendar: 'solar'|'lunar', timeMode: 'precise'|'shichen'|'unknown', gender: 'male'|'female' }`
   - Acceptance: TypeScript compiles; type is exported and importable

3. **Gregorian + Lunar date modes**: Calendar utility handles both modes.
   - Current: No conversion exists
   - Target: `calendar.ts` converts solar→lunar and lunar→solar; lunar input gets converted to solar before Bazi calculation
   - Acceptance: Known date 2024-02-10 (solar) converts to 正月初一 (lunar); conversion round-trip is lossless

4. **Time input flexibility**: Time accepts half-hour precision, 时辰, or "unknown".
   - Current: No time handling
   - Target: `timeMode: 'precise'` uses hour/minute; `timeMode: 'shichen'` maps 时辰 name to hour; `timeMode: 'unknown'` defaults to 子时 (23:00-01:00)
   - Acceptance: All three modes produce valid hour values for Bazi computation

5. **四柱八字 computation**: Calculate year/month/day/hour pillars from birth input.
   - Current: No computation
   - Target: `src/lib/bazi/calculator.ts` exports `computeBazi(input: BirthInput)` returning `{ yearPillar, monthPillar, dayPillar, hourPillar }` with 天干地支
   - Acceptance: Known birth date 2000-02-05 08:00 male → produces correct 四柱 (can validate against known reference)

6. **大运 + 十神 computation**: Calculate derived Bazi data.
   - Current: No computation
   - Target: `computeBazi()` also returns `{ dayun: Dayun[], shiShen: ShiShenMap }`; 大运 starts at birth and follows gender-based direction (顺排/逆排)
   - Acceptance: Returned 大运 list is non-empty; 十神 map has entries for each pillar's 天干

7. **Bazi page skeleton**: Create `/bazi` route with PageLayout wrapper.
   - Current: `/bazi` returns 404
   - Target: `src/app/bazi/page.tsx` renders a `‹PageLayout title="算八字"›` with basic placeholder content; home page link to `/bazi` works
   - Acceptance: Visiting `/bazi` shows page with SiteHeader "算八字"; no JS errors; TypeScript compiles

## Boundaries

**In scope:**
- `lunisolar` npm installation
- `src/lib/bazi/types.ts` — BirthInput type definition
- `src/lib/bazi/calendar.ts` — Gregorian↔Lunar conversion functions
- `src/lib/bazi/calculator.ts` — 四柱八字 + 大运 + 十神 computation (pure functions)
- `src/app/bazi/page.tsx` — PageLayout skeleton
- Home page link verification (BZ-06)

**Out of scope:**
- BaziForm input component — Phase 8 handles the full form UI
- API route (`/api/bazi`) — Phase 9 handles LLM integration
- Loading animation + report rendering — Phase 9
- HTML report download — Phase 10
- DOMPurify sanitization — Phase 9
- 纳音 / 神煞 computation — defer to future (lunisolar supports via plugins)

## Constraints

- Must use `lunisolar` ^2.6.0 (not self-implement calendar math)
- All calculator functions must be pure (no side effects, no network calls, no React)
- TypeScript strict mode — no `any`, no `@ts-ignore`
- Date range: 1900-2100 (lunisolar's supported range)

## Acceptance Criteria

- [ ] `npm ls lunisolar` confirms installation
- [ ] `src/lib/bazi/calendar.ts` exports `toLunar()` and `toSolar()`
- [ ] `src/lib/bazi/types.ts` defines `BirthInput` with all specified fields
- [ ] `src/lib/bazi/calculator.ts` exports `computeBazi()` returning 四柱 + 大运 + 十神
- [ ] Known birth date produces correct 四柱 (validated against reference)
- [ ] All three time modes (precise/shichen/unknown) produce valid output
- [ ] `/bazi` route renders without error; home page link works
- [ ] `npm run build` passes with zero TypeScript errors

## Ambiguity Report

| Dimension          | Score | Min  | Status | Notes                              |
|--------------------|-------|------|--------|------------------------------------|
| Goal Clarity       | 0.90  | 0.75 | ✓      | lunisolar + pure functions + skeleton |
| Boundary Clarity   | 0.80  | 0.70 | ✓      | Explicit phase boundary with 7 requirements |
| Constraint Clarity | 0.70  | 0.65 | ✓      | lunisolar, pure functions, TS strict |
| Acceptance Criteria| 0.75  | 0.70 | ✓      | 8 pass/fail checks                  |
| **Ambiguity**      | 0.20  | ≤0.20| ✓      |                                     |

## Interview Log

| Round | Perspective | Question summary                      | Decision locked                         |
|-------|-------------|---------------------------------------|-----------------------------------------|
| 1     | Researcher  | lunisolar or self-implement?          | Use lunisolar ^2.6.0                    |
| 1     | Researcher  | Deliverable: pure functions or full page? | Pure functions + skeleton + basic interaction |

---
*Phase: 07-foundation*
*Spec created: 2026-05-11*
*Next step: /gsd-discuss-phase 7 — implementation decisions (file structure, function signatures, etc.)*
