---
phase: 07-foundation
plan: '01'
subsystem: bazi
tags: [bazi, calendar, lunisolar, foundation]
dependency_graph:
  requires: []
  provides: [BZ-01, BZ-02, BZ-03, BZ-06, BZ-07, BZ-08, BZ-18]
  affects: []
tech_stack:
  added: [lunisolar@2.6.0]
  patterns: [pure functions, TypeScript interfaces, client-side computation]
key_files:
  created:
    - src/lib/bazi/types.ts
    - src/lib/bazi/calendar.ts
    - src/lib/bazi/calculator.ts
    - src/app/bazi/page.tsx
  modified:
    - package.json
    - package-lock.json
decisions:
  - id: D-01
    decision: File structure: src/lib/bazi/types.ts, calendar.ts, calculator.ts
  - id: D-02
    decision: PageLayout title="算八字"
  - id: D-03
    decision: Form fields: year/month/day inputs (公历 mode), time toggle, gender select, 排盘 button
  - id: D-04
    decision: Button calls calendar.ts + calculator.ts directly (client-side, no API)
  - id: D-05
    decision: Output uses design tokens
  - id: D-06
    decision: Time mode toggle: 精确时间 | 时辰 | 不知道
  - id: D-07
    decision: Phase 7 keeps inline JSX, no separate BaziForm component
---

# Phase 7 Plan 01: Foundation Summary

**One-liner:** lunisolar-powered 八字 foundation with calendar utilities and /bazi test page

**Completed:** 2026-05-11
**Duration:** ~10 minutes
**Tasks completed:** 4/4

## What Was Built

### 1. lunisolar Integration (Task 1)
- Installed `lunisolar@2.6.0` for Gregorian↔Lunar conversion and 四柱 computation
- Created `src/lib/bazi/types.ts` with all core types:
  - `BirthInput` - year/month/day/calendar/timeMode/gender
  - `Pillar` - stem + branch representation
  - `Dayun` - 大运 period
  - `ShiShenMap` - 十神 mapping
  - `BaziResult` - full computation result

### 2. Calendar Utilities (Task 2)
- `src/lib/bazi/calendar.ts` with:
  - `toLunar(year, month, day)` → lunar date string (e.g., '正月初一【2024年】')
  - `toSolar(lunarYear, lunarMonth, lunarDay, isLeapMonth?)` → Gregorian date string

### 3. Bazi Calculator (Task 3)
- `src/lib/bazi/calculator.ts` with `computeBazi(input: BirthInput)`:
  - Computes 四柱 (year/month/day/hour pillars) using lunisolar char8 API
  - Computes 8 大运 periods starting at age 8
  - Computes 十神 map for each pillar's stem
  - Handles all three time modes: precise, shichen, unknown

### 4. /bazi Page (Task 4)
- `src/app/bazi/page.tsx` with:
  - PageLayout wrapper with title="算八字"
  - Year/month/day inputs in 公历 mode
  - Time mode toggle: 精确时间 / 时辰 / 不知道
  - Gender select: 男 / 女
  - 排盘 button computing and displaying:
    - 公历日期, 农历日期
    - 四柱八字 (年柱/月柱/日柱/时柱)
    - 大运 (8 periods)
    - 十神 (年干/月干/日干/时干)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] lunisolar Stem/Branch type mismatch**
- **Found during:** npm build
- **Issue:** `char8.year.stem` returns a `Stem` object, not a `string`. TypeScript error: "Argument of type 'Stem' is not assignable to parameter of type 'string'."
- **Fix:** Added `.toString()` calls: `char8.year.stem.toString()`, `char8.day.stem.toString()`
- **Files modified:** `src/lib/bazi/calculator.ts`
- **Commit:** 8b8a4ac

**2. [Rule 1 - Bug] lunar.month.isLeap property doesn't exist**
- **Found during:** npm build
- **Issue:** `lunar.month` is a number (1-12 or 101-112 for leap months), not an object with `isLeap` property. TypeScript error: "Property 'isLeap' does not exist on type 'number'."
- **Fix:** Changed `lunar.month.isLeap` to `lunar.isLeapMonth` boolean, and `lunar.month.n` to `lunar.month % 100` for month number
- **Files modified:** `src/lib/bazi/calendar.ts`
- **Commit:** 8b8a4ac

**3. [Rule 1 - Bug] result.date doesn't exist on Lunisolar instance**
- **Found during:** npm build
- **Issue:** `lunisolar.fromLunar()` returns a Lunisolar instance, not an object with a `date` property. TypeScript error: "Property 'date' does not exist on type 'Lunisolar'."
- **Fix:** Changed `result.date` to `result.format('YYYY-MM-DD')` for date formatting
- **Files modified:** `src/lib/bazi/calendar.ts`
- **Commit:** 8b8a4ac

## Threat Surface Scan

No new security surface introduced. All computation is client-side with no network calls or user data storage.

## Verification Results

| Check | Result |
|-------|--------|
| `npm ls lunisolar` | lunisolar@2.6.0 installed |
| `npm run build` | Passed with zero errors |
| `/bazi` route | Created at `src/app/bazi/page.tsx` |
| All exports exist | BirthInput, BaziResult, Pillar, Dayun, ShiShenMap, toLunar, toSolar, computeBazi |
| Homepage link | Already exists (BZ-06 satisfied by previous phase) |

## Known Stubs

None - all stubs from the plan are functional:
- toLunar() and toSolar() are fully implemented
- computeBazi() computes actual 四柱 using lunisolar
- 大运 uses actual stem/branch positions (simplified but functional)
- 十神 uses proper stem-indexed lookup

## Commits

- **8b8a4ac** feat(07): install lunisolar and create bazi foundation library
  - 6 files changed, 477 insertions(+)

## Self-Check

- [x] lunisolar ^2.6.0 installed
- [x] BirthInput type defines all fields
- [x] toLunar(year, month, day) returns lunar date string
- [x] toSolar(lunarYear, lunarMonth, lunarDay) returns Gregorian date string
- [x] computeBazi(input) returns BaziResult with pillars, dayun, shiShen
- [x] /bazi page renders with PageLayout title="算八字"
- [x] Form has year/month/day inputs, time mode toggle, gender select
- [x] 排盘 button computes and displays results
- [x] npm run build passes
- [x] All files created match plan specifications
