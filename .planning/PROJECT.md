# 喵十七的工具箱 (life-tools)

## What This Is

A personal toolbox of random useful/digital garden tools for friends. Very casual, exploratory project — no fixed roadmap, add features as ideas come. The only constant is that it's built with Next.js and lives at this domain.

**Current:** Next.js app with home page at `/` linking to planned features `/bazi`, `/eat`, and `/chat`.

## Core Value

A place to dump random tools that might be useful someday. Low commitment, high creativity. If something doesn't get finished, that's fine.

## Completed Milestones

### v1.0 LLM Chat Entry — COMPLETE ✓

**Goal:** 在首页加一个聊天按钮（风格和 bazi、吃啥一样），点进去是简易聊天界面

**Delivered:**
- 首页增加「聊天」按钮
- 路由：`/chat`
- 简易聊天界面
- DeepSeek API (`deepseek-v4-flash`) 对话

**Stats:** 2 phases, 4 plans, 4 commits, 100% requirements (6/6)

**Archived:** 2026-05-09

## Completed Milestones

### v2.0 UI Design System & Visual Language — COMPLETE ✅ (2026-05-10)

**Goal:** 建立完整的设计范式体系。4 layers: philosophy → tokens → components → migration.

**Delivered:**
- 8 design principles (温暖极简主义) + 5 anti-patterns
- Full OKLCH color system: 11 semantic token pairs, amber/warm-stone scales
- 7-level typography (LXGW WenKai + Sarasa Mono)
- 4 UI components (Button 3 variants, Card, Badge, Input) with clsx + forwardRef
- Brand bar dark mode: rgba(28,25,23,0.85) + backdrop-filter blur(12px)
- Home page + chat page migrated to design tokens
- 20/20 requirements satisfied, build passes, 0 hardcoded colors remain

**Stats:** 4 phases, 6 plans, 20 requirements, audit passed
**Archive:** `.planning/milestones/v2.0-ROADMAP.md`

## Current State

No active milestone. Project has:
- Working Next.js 16 app with unified UI layout (`/`, `/chat`, `/api/chat`)
- Full design system (tokens in globals.css, components in src/components/ui/)
- 4 UI components (Button, Card, Badge, Input) with asChild/dark mode support

## Current Milestone: v3.0 八字命理工具

**Goal:** 实现八字排盘+AI 命理分析工具，复用现有 chat 模块的 LLM 接入（DeepSeek API）。

**Target features:**
- 输入表单：公历/农历切换、日期时间时辰、性别（必填）、姓名（选填/LLM 生成）
- 等待动画：输入回显 + 八字四柱 + 吐槽轮播（多条，渐入渐出 5s/条）
- 报告渲染在主区域（可滚动），底部保留输入栏，重新提交清旧报告
- HTML 报告下载
- 遵循温暖极简设计语言 + 轻松字体

**Reference:** `bazi-minimal/` 工作流（陆致极框架 + 韦千里八步法）
**Route:** `/bazi`

## Requirements

### Validated

- ✓ Basic Next.js 16 + React 19 + Tailwind CSS 4 project structure — existing
- ✓ Home page with navigation links — existing
- ✓ Tailwind CSS styling system — existing
- ✓ **CHAT-01**: 首页增加「聊天」按钮 — v1.0
- ✓ **CHAT-02**: `/chat` 路由显示简易聊天界面 — v1.0
- ✓ **CHAT-03**: 调用 DeepSeek API 进行对话 — v1.0
- ✓ **CHAT-04**: 支持发送消息并显示 AI 回复 — v1.0
- ✓ **UI-01**: 统一品牌导航栏（SiteHeader + LOGO + 暗色模式） — post-v1.0
- ✓ **UI-02**: 统一页面布局框架（PageLayout） — post-v1.0
- ✓ **UI-03**: 首页和聊天页迁移到统一布局 — post-v1.0

### Out of Scope

- Mobile app — Web-first, desktop only unless user requests
- User accounts/auth — No authentication planned
- Deployment beyond current host — TBD
- 多模型切换 — 单一 DeepSeek 模型

## Context

**Project Type:** Brownfield Next.js project with working chat feature and unified UI layout framework.

**Existing Codebase:**
- `src/app/page.tsx` — Home page ("喵十七的工具箱") with unified PageLayout, links to `/bazi`, `/eat`, `/chat`
- `src/app/layout.tsx` — Root layout with fonts, metadata "喵十七的工具箱"
- `src/app/chat/` — Working chat interface using DeepSeek API via AI SDK 6.x
- `src/components/chat/` — ChatUI, MessageList, MessageBubble, ChatInput
- `src/components/layout/` — SiteHeader (dark-mode aware brand bar), PageLayout (unified page wrapper)
- `src/app/api/chat/` — Chat API route
- Dark mode: CSS variables with `prefers-color-scheme`, header bar turns black in dark mode (known issue → v2.0)
- Planned routes `/bazi`, `/eat` not yet implemented

**User Approach:**
- Casual, exploratory — no fixed roadmap
- Add features one at a time as ideas come
- Personal project for friends
- v2.0 focus: design quality and consistency

## Constraints

- **Tech Stack**: Next.js 16 + React 19 + Tailwind CSS 4 — don't change
- **LLM Provider**: DeepSeek API — if LLM features added
- **No Auth**: No user accounts or authentication

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Next.js App Router | Existing project, stable | ✓ Validated in v1.0 |
| Tailwind CSS 4 | Existing project, comfortable | ✓ Validated in v1.0 |
| DeepSeek LLM API | First LLM feature uses DeepSeek | ✓ Validated in v1.0 |
| DeepSeek Model: deepseek-v4-flash | Fast, cost-effective for testing | ✓ Validated in v1.0 |
| AI SDK 6.x with useChat | Streaming UI with @ai-sdk/react | ✓ Validated in v1.0 |

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
*Last updated: 2026-05-09 after v2.0 milestone initialization*