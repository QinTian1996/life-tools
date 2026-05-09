# Implementation Plan: Unified UI Framework

**Branch**: `001-unified-ui-framework` | **Date**: 2026-05-09 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-unified-ui-framework/spec.md`

## Summary

为"喵十七的工具箱"所有页面建立统一的 UI 框架：抽取共享品牌导航栏组件（`SiteHeader`）和页面布局组件（`PageLayout`），包含左上角 LOGO + 品牌文字（点击回首页），统一 amber/orange 暖色系视觉风格，并适配暗色模式。迁移现有聊天页的内联 header 到统一框架。

## Technical Context

**Language/Version**: TypeScript 5.x
**Primary Dependencies**: Next.js 16 (App Router), React 19, Tailwind CSS 4
**Storage**: N/A (纯 UI 层，无数据存储)
**Testing**: 手动验证（无自动化测试框架）
**Target Platform**: Web (Desktop-first, >=1280px)
**Project Type**: Web application (Next.js App Router)
**Performance Goals**: 品牌栏点击导航 < 1 秒内完成
**Constraints**: 不引入第三方 UI 库；仅使用 Tailwind CSS 4 + CSS 变量；复用已有 `public/logo.svg`
**Scale/Scope**: 2 个现有页面（首页 + /chat），未来可扩展至 N 个子页面

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Simplicity First | ✅ PASS | 仅新增 2 个组件（SiteHeader + PageLayout），无过度抽象 |
| II. Ship and Iterate | ✅ PASS | 先统一现有 2 个页面，框架支持未来扩展 |
| III. Web-Focused | ✅ PASS | Next.js App Router + Tailwind CSS 4，Desktop-first |
| IV. Verify Before Ship | ✅ PASS | 手动验证首页 + 聊天页功能正常 |
| V. Respect Constraints | ✅ PASS | 不引入新框架/库，不改变现有堆栈 |

**Gate Result**: ALL PASS — proceed to Phase 0.

## Project Structure

### Documentation (this feature)

```text
specs/001-unified-ui-framework/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (component interfaces)
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── layout.tsx           # Root layout — 引入 SiteHeader + PageLayout
│   ├── page.tsx             # 首页 — 使用 PageLayout 包裹
│   ├── chat/
│   │   └── page.tsx         # 聊天页 — 使用 PageLayout 包裹
│   └── globals.css          # 全局样式 — 可选暗色模式品牌栏变量
├── components/
│   ├── layout/
│   │   ├── SiteHeader.tsx    # 品牌导航栏（LOGO + 文字 + 标题）
│   │   └── PageLayout.tsx   # 页面布局框架（SiteHeader + 内容区）
│   └── chat/                # 现有聊天组件（不变）
public/
└── logo.svg                 # 已有 LOGO 文件
```

**Structure Decision**: 采用 "Single project" 结构。新增 `src/components/layout/` 目录存放布局组件（SiteHeader、PageLayout），与现有的 `src/components/chat/` 平级。页面通过 `<PageLayout title="xxx">` 包裹内容来获取统一框架，组件本身负责视觉渲染，不依赖全局状态。

## Complexity Tracking

> No constitution violations — no complexity tracking needed.
