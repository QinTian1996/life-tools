# Data Model: Unified UI Framework

**Feature**: 001-unified-ui-framework
**Date**: 2026-05-09

## Overview

This feature has **no persistent data model** — it is a pure UI framework layer. No database tables, API schemas, or storage entities are involved.

## Component Entities (UI Layer)

### SiteHeader

固定在页面顶部的品牌导航栏组件。

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | `string` | No | 当前子页面标题，显示在品牌栏右侧。首页不传 |
| `isHome` | `boolean` | No | 是否在首页。决定 LOGO 是链接(`<Link>`)还是纯展示 |

**States**: 无状态 — 纯展示组件

### PageLayout

包裹所有页面的外层布局框架。

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | `string` | No | 传递给 SiteHeader 的页面标题 |
| `children` | `ReactNode` | Yes | 子页面的实际内容 |

**States**: 无状态 — 纯结构组件，通过 children 委托内容渲染

## Validation Rules

- `title` 若传入，长度建议 <= 10 个中文字符（超出品牌栏可能溢出）
- `children` 必须为合法的 React 节点
