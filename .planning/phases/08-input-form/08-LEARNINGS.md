---
phase: "8"
phase_name: "Input Form"
project: "喵十七的工具箱"
generated: "2026-05-11"
counts:
  decisions: 1
  lessons: 1
  patterns: 1
  surprises: 0
missing_artifacts: []
---

# Phase 8 Learnings: Input Form

## Decisions

### BaziForm was already implemented when executor spawned
Plan 08-01 assumed BaziForm needed to be created from scratch, but the component was already in `src/components/bazi/BaziForm.tsx` with full functionality — the planner and executor from an earlier step had already built it. The executor correctly detected this and verified the existing implementation rather than attempting to rebuild.

**Rationale:** Multiple agents working on the same phase can lead to overlapping work. The executor's first-action check (read existing file) prevented duplicate implementation.
**Source:** 08-01 execution log

## Lessons

### Two-row layout naturally emerged from the SPEC requirement
The user's layout specification ("上面那排是数值, 下面那排是格式toggle") guided the implementation directly. No ambiguity in translation from SPEC to code — the form naturally split into `flex flex-col gap-4` with two internal rows.

**Context:** SPEC requirement 5 explicitly defined the two-row structure, which mapped cleanly to JSX.
**Source:** BaziForm.tsx implementation

## Patterns

### Form validation via computed `isValid` + button `disabled` prop
BaziForm uses a single `isValid` computation that checks all field constraints, then passes the result to Button's `disabled` prop. No inline error messages — clean form state management in a single place.

**When to use:** Simple forms where disabled-button feedback is sufficient, no complex per-field validation needed.
**Source:** BaziForm.tsx
