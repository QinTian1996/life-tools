# Phase 7: Foundation - Context

**Gathered:** 2026-05-11
**Status:** Ready for planning
**SPEC:** 7 requirements locked (07-SPEC.md, ambiguity 0.20)

## Phase Boundary

Build calendar utilities (lunisolar-powered Gregorian↔Lunar conversion) and Bazi 四柱 calculator as pure TypeScript functions, plus `/bazi` route with minimal test interaction — input a date, click "排盘", see 公历/农历/四柱.

## Requirements (locked via SPEC.md)

**7 requirements are locked.** See `07-SPEC.md` for full requirements with current/target/acceptance.

**In scope (from SPEC.md):**
- `lunisolar` npm installation
- `src/lib/bazi/types.ts` — BirthInput type definition
- `src/lib/bazi/calendar.ts` — Gregorian↔Lunar conversion
- `src/lib/bazi/calculator.ts` — 四柱 + 大运 + 十神 (pure functions)
- `src/app/bazi/page.tsx` — PageLayout skeleton with test interaction
- Home page link to `/bazi`

**Out of scope (from SPEC.md):**
- BaziForm input component — Phase 8
- API route — Phase 9
- Loading animation + report rendering — Phase 9
- HTML download — Phase 10
- 纳音 / 神煞 — future

## Implementation Decisions

### File Structure

- **D-01:** Calendar and calculator utilities live in `src/lib/bazi/`
  - `src/lib/bazi/types.ts` — `BirthInput` type and return types
  - `src/lib/bazi/calendar.ts` — `toLunar()`, `toSolar()` conversion functions
  - `src/lib/bazi/calculator.ts` — `computeBazi()` function computing 四柱 + 大运 + 十神
  - No barrel `index.ts` — import directly from each module (follows project convention)

### Page Skeleton

- **D-02:** `/bazi` page uses `PageLayout title="算八字"` wrapper (follows chat page pattern)
- **D-03:** Page content: centered form area + output area below
  - Form fields: year (input), month (input), day (input), all defaulting to 公历 mode (农历切换 deferred to Phase 8)
  - Time input: toggle between precise (hour:minute) and 时辰 (子丑寅卯...下拉) modes, plus "不知道" option
  - Gender: 男/女 select
  - Button: "排盘" (primary variant)
  - Output area below button: shows 公历日期, 农历日期, 四柱八字 (年柱/月柱/日柱/时柱, each with 天干+地支)
- **D-04:** Button click calls `calendar.ts` and `calculator.ts` directly (client-side, no API call — API route is Phase 9)
- **D-05:** Output uses existing design tokens (`text-[var(--foreground)]` for labels, `text-[var(--muted-foreground)]` for values)

### Time Input Design

- **D-06:** Time mode toggle: three radio buttons or segmented control — "精确时间" | "时辰" | "不知道"
  - "精确时间": two inputs (hour 0-23, minute 0-30 step), or a single `time` input
  - "时辰": select dropdown with 12 options (子丑寅卯辰巳午未申酉戌亥)
  - "不知道": no additional input, defaults to 子时
- **D-07:** Component complexity: keep it simple for Phase 7 — inline JSX, no separate BaziForm component yet. Phase 8 will extract into proper component.

### the agent's Discretion

The following are left to the planner and researcher:
- Exact function signatures for `toLunar()`, `toSolar()`, `computeBazi()`
- Return type structures (how 天干地支 are represented: tuple `[stem, branch]`, enum, or string)
- How 大运 list and 十神 map are structured
- Whether to use `<select>`, `<input type="time">`, or custom components for time input
- CSS layout details for the test page (exact flex/grid classes)
- lunisolar API integration pattern (which methods to call, plugin usage)

## Canonical References

- `.planning/phases/07-foundation/07-SPEC.md` — **Locked requirements** — MUST read before planning
- `.planning/REQUIREMENTS.md` — v3.0 requirements BZ-01..BZ-08, BZ-18
- `.planning/ROADMAP.md` — Phase 7 goal and success criteria
- `.planning/research/SUMMARY.md` — Research findings (lunisolar recommendation)
- `.planning/research/STACK.md` — lunisolar ^2.6.0, no other new deps
- `.planning/research/ARCHITECTURE.md` — File structure and integration points
- `src/app/page.tsx` — Home page pattern (PageLayout usage)
- `src/app/chat/page.tsx` — Chat page pattern (PageLayout + child component)
- `src/components/layout/PageLayout.tsx` — PageLayout component API

## Existing Code Insights

### Reusable Assets
- **PageLayout**: `src/components/layout/PageLayout.tsx` — wraps page with SiteHeader + content area. Use `<PageLayout title="算八字">`
- **Button**: `src/components/ui/Button.tsx` — primary/secondary/ghost variants, asChild support
- **Design tokens**: `src/app/globals.css` — all semantic tokens available for styling

### Established Patterns
- New pages follow the `src/app/[route]/page.tsx` pattern with PageLayout wrapper
- Components use named exports with explicit import paths (no barrel files)
- Styling uses Tailwind arbitrary values referencing CSS variables: `bg-[var(--background)]`, `text-[var(--foreground)]`

### Integration Points
- Home page `src/app/page.tsx` already has `<Button asChild><Link href="/bazi">算八字</Link>` — link exists, route needs to exist
- No existing Bazi code — all utility functions are new
- Phase 8 will build on this page's form elements

## Deferred Ideas

None — discussion stayed within Phase 7 scope.

---
*Phase: 07-Foundation*
*Context gathered: 2026-05-11*
