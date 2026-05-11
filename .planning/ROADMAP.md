# Roadmap: 喵十七的工具箱

**Last updated:** 2026-05-11

## Completed Milestones

| Milestone | Status | Phases | Requirements | Archive |
|-----------|--------|--------|-------------|---------|
| v1.0 LLM Chat Entry | **Archived** | 2 (01-02) | 6/6 | `.planning/milestones/v1.0-phases/` |
| v2.0 UI Design System & Visual Language | **Complete** ✅ | 4 (03-06) | 20/20 | `.planning/milestones/v2.0-ROADMAP.md` |

## Active Milestone: v3.0 八字命理工具

**Goal:** 实现八字排盘+AI 命理分析工具，复用现有 chat 模块的 LLM 接入（DeepSeek API）。

**Granularity:** standard
**Dependencies:** lunisolar (^2.6.0), DeepSeek API (existing), DOMPurify

## Phases

- [ ] **Phase 7: Foundation** — Calendar utilities + Bazi calculator (pure functions, no UI)
- [ ] **Phase 8: Input Form** — BaziPage + BaziForm component with validation
- [ ] **Phase 9: Loading + Report** — BaziLoading + BaziReport + API integration
- [ ] **Phase 10: Download + Polish** — HTML download + sanitization + abort

## Phase Details

### Phase 7: Foundation
**Goal:** Calendar utilities and Bazi 四柱 calculator as pure functions — no UI dependencies, testable in isolation.

**Depends on:** Nothing (first phase)

**Requirements:** BZ-01, BZ-02, BZ-03, BZ-06, BZ-07, BZ-08, **BZ-18** (Create /bazi route with basic page skeleton)

**Success Criteria** (what must be TRUE):
1. User can convert Gregorian date to lunar date (and vice versa) via `src/lib/bazi/calendar.ts`
2. User can input year/month/day separately and have calendar compute correctly (BZ-01)
3. Calendar supports both solar (公历) and lunar (农历) date input modes (BZ-02)
4. Time input supports half-hour precision,时辰 selection (子丑寅卯...), and "不知道" option (BZ-03)
5. Homepage "算八字" button links to `/bazi` route (BZ-06)
6. System computes valid 四柱八字 (年柱/月柱/日柱/时柱) from birth data (BZ-07)
7. System computes 大运 and 十神 from birth data (BZ-08)
8. User visiting `/bazi` sees a page with PageLayout wrapper and basic page skeleton (BZ-18)

**Plans:** TBD

---

### Phase 8: Input Form
**Goal:** Users see a functional input form at `/bazi` with all required fields and validation.

**Depends on:** Phase 7

**Requirements:** BZ-04, BZ-05

**Success Criteria** (what must be TRUE):
1. User must select gender (男/女) before submission — form blocks without it (BZ-04)
2. User can optionally enter a name; if left blank, the system generates a name in "〈形容词〉的〈动物〉" format (BZ-05)
3. Form has proper validation state management — submit is disabled until required fields valid
4. Form submitted data flows correctly to API layer

**Plans:** TBD

**UI hint:** yes

---

### Phase 9: Loading + Report
**Goal:** Users experience engaging loading animation, then see scrollable dual-version report with LLM-generated content.

**Depends on:** Phase 8

**Requirements:** BZ-09, BZ-10, BZ-11, BZ-12, BZ-13, BZ-16, BZ-17

**Success Criteria** (what must be TRUE):
1. After submit, user sees input echo + computed 四柱 displayed immediately (BZ-09)
2. During wait, user sees rotating 吐槽 carousel (LLM-generated多条, fade in/out every 5s) (BZ-10)
3. Report renders in main area with scroll — user can switch between 专业版 and 详解版 tabs (BZ-11)
4. Input bar remains at bottom after report generation (BZ-12)
5. Re-submitting clears the old report and starts fresh (BZ-13)
6. LLM-generated HTML is sanitized with DOMPurify before rendering (BZ-16)
7. User can abort in-flight API request (BZ-17)

**Plans:** TBD

**UI hint:** yes

---

### Phase 10: Download + Polish
**Goal:** Users can download a self-contained HTML report following project design language.

**Depends on:** Phase 9

**Requirements:** BZ-14, BZ-15

**Success Criteria** (what must be TRUE):
1. User can download report as HTML file via button click (BZ-14)
2. Downloaded HTML uses CDN fonts and requires no external dependencies (BZ-14)
3. Downloaded HTML follows project design language (warm minimalist aesthetic) (BZ-15)

**Plans:** TBD

**UI hint:** yes

---

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 7. Foundation | 0/1 | Not started | - |
| 8. Input Form | 0/1 | Not started | - |
| 9. Loading + Report | 0/1 | Not started | - |
| 10. Download + Polish | 0/1 | Not started | - |

## Coverage

✓ All 18 v3.0 requirements mapped (BZ-01 through BZ-18, including BZ-18)
✓ No orphaned requirements
✓ Phases derived from requirements (not imposed)
✓ Granularity: standard (4 phases for 18 requirements)

---

*Roadmap updated: 2026-05-11 — Added BZ-18 (basic /bazi page scaffold) to Phase 7*
