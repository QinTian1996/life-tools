# 喵十七的工具箱 (life-tools)

## What This Is

A personal toolbox of random useful/digital garden tools for friends. Very casual, exploratory project — no fixed roadmap, add features as ideas come. The only constant is that it's built with Next.js and lives at this domain.

**Current:** Next.js app with home page at `/` linking to planned features `/bazi`, `/eat`, and `/chat`.

## Core Value

A place to dump random tools that might be useful someday. Low commitment, high creativity. If something doesn't get finished, that's fine.

## Current Milestone: v1.0 LLM Chat Entry

**Goal:** 在首页加一个聊天按钮（风格和 bazi、吃啥一样），点进去是简易聊天界面

**Target features:**
- 首页增加「聊天」按钮
- 路由：`/chat`
- 简易聊天界面
- DeepSeek API (`deepseek-v4-flash`) 对话

## Requirements

### Validated

- ✓ Basic Next.js 16 + React 19 + Tailwind CSS 4 project structure — existing
- ✓ Home page with navigation links — existing
- ✓ Tailwind CSS styling system — existing

### Active

- [ ] **CHAT-01**: 首页增加「聊天」按钮（风格与 bazi、吃啥一致）
- [ ] **CHAT-02**: `/chat` 路由显示简易聊天界面
- [ ] **CHAT-03**: 调用 DeepSeek API 进行对话
- [ ] **CHAT-04**: 支持发送消息并显示 AI 回复

### Out of Scope

- Mobile app — Web-first, desktop only unless user requests
- User accounts/auth — No authentication planned
- Deployment beyond current host — TBD
- 多模型切换 — 单一 DeepSeek 模型

## Context

**Project Type:** Brownfield Next.js project with codebase already mapped.

**Existing Codebase:**
- `src/app/page.tsx` — Home page ("喵十七的工具箱") with links to `/bazi`, `/eat`, `/chat`
- `src/app/layout.tsx` — Root layout with fonts
- Planned API routes at `src/app/api/bazi/` and `src/app/api/eat/`
- Planned LLM integration with DeepSeek API (env: `DEEPSEEK_API_KEY`)
- Currently has NO features implemented beyond the home page shell

**User Approach:**
- Casual, exploratory — no fixed roadmap
- Add features one at a time as ideas come
- May go weeks/months between contributions
- Personal project for friends

## Constraints

- **Tech Stack**: Next.js 16 + React 19 + Tailwind CSS 4 — don't change
- **LLM Provider**: DeepSeek API — if LLM features added
- **No Auth**: No user accounts or authentication

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Next.js App Router | Existing project, stable | — Pending |
| Tailwind CSS 4 | Existing project, comfortable | — Pending |
| DeepSeek LLM API | First LLM feature uses DeepSeek | — Pending |
| DeepSeek Model: deepseek-v4-flash | Fast, cost-effective for testing | — Pending |

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
*Last updated: 2026-05-08 after v1.0 milestone initialization*