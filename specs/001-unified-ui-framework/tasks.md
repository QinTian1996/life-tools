# Tasks: Unified UI Framework

**Input**: Design documents from `/specs/001-unified-ui-framework/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: No automated tests requested. Verification is manual per quickstart.md.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/` at repository root
- Components: `src/components/layout/`, `src/components/chat/`
- Pages: `src/app/page.tsx`, `src/app/chat/page.tsx`
- Global styles: `src/app/globals.css`
- Static assets: `public/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Ensure directory structure and verify existing assets

- [x] T001 Create `src/components/layout/` directory
- [x] T002 Verify `public/logo.svg` exists and is a valid SVG file

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Shared UI components that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T003 [P] Create `SiteHeader` component with logo navigation in `src/components/layout/SiteHeader.tsx`
- [x] T004 [P] Create `PageLayout` wrapper component in `src/components/layout/PageLayout.tsx`

**Checkpoint**: Components ready — user stories can now apply them to pages

---

## Phase 3: User Story 1 - Brand Logo Navigation (Priority: P1) 🎯 MVP

**Goal**: 用户在子页面（/chat）左上角看到品牌标识（LOGO + "喵十七"），点击回到首页

**Independent Test**: 打开 `/chat`，看到左上角有 LOGO + "喵十七" 文字，点击后跳转到首页 `/`

### Implementation for User Story 1

- [x] T005 [US1] Apply `<PageLayout title="聊天">` wrapper in `src/app/chat/page.tsx`
- [x] T006 [US1] Remove inline `<header>` from `src/components/chat/ChatUI.tsx` (lines 36-38), keep only flex container and content
- [x] T007 [US1] Verify: `npm run dev` → open `/chat` → click logo → navigates to `/`

**Checkpoint**: US1 complete — brand logo visible and clickable on chat page, navigates to homepage

---

## Phase 4: User Story 2 - Consistent Page Layout Structure (Priority: P1)

**Goal**: 首页和所有子页面都有统一的品牌栏和视觉风格

**Independent Test**: 分别打开首页和 /chat，都看到顶部品牌栏，背景渐变一致，聊天功能正常

### Implementation for User Story 2

- [x] T008 [US2] Apply `<PageLayout>` wrapper in `src/app/page.tsx` — wrap existing content, remove standalone gradient background (moved to PageLayout)
- [x] T009 [US2] Adjust homepage content layout for compatibility with PageLayout (toolbox title, description, buttons, signature)
- [x] T010 [US2] Verify: `npm run dev` → open `/` and `/chat` — confirm brand bar present on both, gradients consistent, chat messaging still works

**Checkpoint**: US1 + US2 complete — all existing pages have unified layout

---

## Phase 5: User Story 3 - Reusable Design Framework (Priority: P2)

**Goal**: 开发者新增页面时只需套用 PageLayout 即可获得统一风格

**Independent Test**: 创建空白测试页，套用 PageLayout，验证自动获得品牌栏和统一背景

### Implementation for User Story 3

- [ ] T011 [US3] Add dark-mode CSS variables for brand bar background in `src/app/globals.css` (ensure brand bar follows `--background` in dark mode)
- [ ] T012 [US3] Add dark-mode logo visibility fix in `src/app/globals.css` (e.g., `filter: invert` for `logo.svg` under `prefers-color-scheme: dark`)
- [ ] T013 [US3] Update metadata title from "Create Next App" to "喵十七的工具箱" in `src/app/layout.tsx`
- [ ] T014 [US3] Verify: switch OS to dark mode → confirm brand bar background darkens and logo remains visible

**Checkpoint**: US3 complete — framework is reusable, dark mode works, metadata correct

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final verification and cleanup

- [x] T015 Run full quickstart.md verification checklist (all acceptance scenarios from spec.md)
- [x] T016 Ensure no console errors on `/` and `/chat` pages
- [x] T017 Verify `npm run build` succeeds with no errors

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Depends on Setup — BLOCKS all user stories
- **US1 (Phase 3)**: Depends on Foundational — creates MVP
- **US2 (Phase 4)**: Depends on US1 (needs PageLayout applied to at least one page first)
- **US3 (Phase 5)**: Depends on US2 (needs all pages migrated before dark mode polish)
- **Polish (Phase 6)**: Depends on all stories complete

### User Story Dependencies

- **US1 (P1)**: After Foundational — can create MVP independently
- **US2 (P1)**: After US1 — extends layout to homepage, builds on US1 patterns
- **US3 (P2)**: After US2 — polish phase (dark mode, metadata, reusability)

### Within Each Phase

```
Phase 2: T003 [P] SiteHeader ──┬── no deps between them
         T004 [P] PageLayout ──┘
Phase 3: T005 → T006 → T007 (sequential: apply → remove → verify)
Phase 4: T008 → T009 → T010 (sequential: apply → adjust → verify)
Phase 5: T011 [P] globals:brand ──┐
         T012 [P] globals:logo  ──┤ parallel (different CSS blocks)
         T013 [P] layout:title  ──┘
         T014 (depends on T011, T012)
Phase 6: T015 → T016 → T017 (sequential verification)
```

---

## Parallel Example: Phase 2 (Foundational)

```bash
# Launch both components in parallel:
Task: "Create SiteHeader component in src/components/layout/SiteHeader.tsx"
Task: "Create PageLayout component in src/components/layout/PageLayout.tsx"
```

## Parallel Example: Phase 5 (US3)

```bash
# Launch all CSS and metadata updates in parallel:
Task: "Add dark-mode CSS variables for brand bar in src/app/globals.css"
Task: "Add dark-mode logo visibility fix in src/app/globals.css"
Task: "Update metadata title in src/app/layout.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — creates SiteHeader + PageLayout)
3. Complete Phase 3: US1 — brand logo on chat page
4. **STOP and VERIFY**: Open /chat, click logo → goes to /
5. Deploy if ready

### Incremental Delivery

1. Setup + Foundational → Components ready
2. Add US1 → Chat page has brand logo navigation (MVP!)
3. Add US2 → Homepage has brand bar, both pages visually consistent
4. Add US3 → Dark mode works, metadata fixed, framework reusable
5. Polish → Build passes, no console errors

### Single Developer Strategy

Follow phases sequentially (Phase 1 → 2 → 3 → 4 → 5 → 6). Each phase produces a verifiable checkpoint.

---

## Notes

- [P] tasks = different files, no dependencies — can run in parallel
- [Story] label maps task to specific user story for traceability
- Each user story phase has its own checkpoint for independent verification
- Commit after each phase or logical task group
- All page modifications preserve existing functionality (chat messaging must still work)
- No automated tests — verification is manual via `npm run dev` and visual inspection
