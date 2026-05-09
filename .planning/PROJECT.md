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

## Current Milestone: v2.0 UI Design System & Visual Language

**Goal:** 建立完整的设计范式体系 — 从设计哲学和原则出发，定义色彩、组件、布局规范，产出可复用实现，所有页面遵循新设计系统。

**Core themes:** 温暖 + 简洁（warm + minimal）

**Target features:**
- 定义设计范式/理念/视觉原则
- 暗色模式品牌栏：半透明暖色（不再纯黑）
- 完整的全局色彩体系（亮 + 暗调色板）
- 统一组件规范（按钮、卡片、输入框等）
- 页面布局规范（完善并正式化现有框架）
- 现有页面按新设计系统改造

**Four-layer design framework:**
| 层 | 内容 |
|----|------|
| 范式/哲学 | 设计理念、视觉原则 |
| 规范/语言 | 色彩、间距、排版、组件 tokens |
| 实现/框架 | CSS 变量、Tailwind 主题、组件库 |
| 应用/改造 | 页面迁移、新页面模板 |

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