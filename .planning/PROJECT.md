# 喵十七的工具箱 (life-tools)

## What This Is

A personal toolbox of random useful/digital garden tools for friends. Very casual, exploratory project — no fixed roadmap, add features as ideas come. The only constant is that it's built with Next.js and lives at this domain.

**Current:** Next.js app with home page at `/` linking to planned features `/bazi` and `/eat` (not yet built).

## Core Value

A place to dump random tools that might be useful someday. Low commitment, high creativity. If something doesn't get finished, that's fine.

## Requirements

### Validated

- ✓ Basic Next.js 16 + React 19 + Tailwind CSS 4 project structure — existing
- ✓ Home page with navigation links — existing
- ✓ Tailwind CSS styling system — existing

### Active

- [ ] Feature: TBD (user will add as ideas come)
- [ ] Feature: TBD

### Out of Scope

- Mobile app — Web-first, desktop only unless user requests
- User accounts/auth — No authentication planned
- Deployment beyond current host — TBD

## Context

**Project Type:** Brownfield Next.js project with codebase already mapped.

**Existing Codebase:**
- `src/app/page.tsx` — Home page ("喵十七的工具箱") with links to `/bazi` and `/eat`
- `src/app/layout.tsx` — Root layout with fonts
- Planned API routes at `src/app/api/bazi/` and `src/app/api/eat/`
- Planned LLM integration with GLM API (env: `GLM_API_KEY`)
- Currently has NO features implemented beyond the home page shell

**User Approach:**
- Casual, exploratory — no fixed roadmap
- Add features one at a time as ideas come
- May go weeks/months between contributions
- Personal project for friends

## Constraints

- **Tech Stack**: Next.js 16 + React 19 + Tailwind CSS 4 — don't change
- **LLM Provider**: GLM API via `https://api.z.ai/api/paas/v4` — if LLM features added
- **No Auth**: No user accounts or authentication

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Next.js App Router | Existing project, stable | — Pending |
| Tailwind CSS 4 | Existing project, comfortable | — Pending |
| GLM LLM API | Commit from existing codebase map | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-05-08 after initialization*