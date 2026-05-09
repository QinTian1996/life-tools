# Roadmap: 喵十七的工具箱 v2.0

**Milestone:** v2.0 UI Design System & Visual Language
**Created:** 2026-05-09
**Phases:** 4 (continuing from v1.0 phases 1-2)

## Phase Summary

| # | Phase | Goal | Requirements | Success Criteria |
|---|-------|------|--------------|------------------|
| 3 | Design Philosophy | 定义温暖极简主义的设计"魂" | DSGN-01, DSGN-02, DSGN-03 | 3 |
| 4 | Design Tokens | 量化所有视觉规范为 tokens | TOKN-01..TOKN-06 | 4 |
| 5 | CSS & Components | 代码落地：CSS 变量 + 组件库 | IMPL-01..IMPL-07 | 5 |
| 6 | Page Migration | 现有页面全面改造 | MIGR-01..MIGR-04 | 4 |

## Phase 3: Design Philosophy & Principles

**Goal:** 定义"温暖极简主义"的设计理念、具体原则和反模式清单。

**Requirements:** DSGN-01, DSGN-02, DSGN-03

**Success Criteria:**
1. 理念文档不少于 5 条具体可操作的设计原则
2. 每条原则有"做"和"不做"的示例
3. 反模式清单覆盖至少 5 种常见错误

## Phase 4: Design Tokens & Specifications

**Goal:** 量化所有视觉规范：色彩（亮+暗）、排版、间距、圆角阴影。

**Requirements:** TOKN-01..TOKN-06

**Success Criteria:**
1. 亮色模式 5+ 语义色 + 2 功能色
2. 暗色背景非纯黑，品牌栏为半透明暖色
3. 排版 7+ 级字号，间距基于 8px 节奏
4. text/bg 组合满足 WCAG AA 4.5:1

## Phase 5: CSS Implementation & Component Library

**Goal:** 代码落地：重写 globals.css，建立 Button/Card/Badge/Input 组件库。

**Requirements:** IMPL-01..IMPL-07

**Success Criteria:**
1. globals.css 用 @theme + @variant dark { } 管理亮/暗模式
2. 品牌栏暗色下为半透明暖色 + backdrop-filter
3. Button 3 variants (primary/secondary/ghost)，所有状态完整
4. Card/Input 组件统一外观 + focus ring
5. build 通过，无 TS 错误

## Phase 6: Page Migration & Verification

**Goal:** 首页和聊天页改造为新设计系统，亮/暗模式验证。

**Requirements:** MIGR-01..MIGR-04

**Success Criteria:**
1. 首页和聊天页使用新组件和 token
2. 亮色模式视觉一致
3. 暗色模式品牌栏为暖色，文字可读
4. 聊天功能不受影响，build 通过

## Dependency Graph

```
Phase 3 → Phase 4 → Phase 5 → Phase 6
(理念)    (tokens)  (CSS+组件) (迁移)
```

## Requirement Coverage

| REQ-ID | Phase | Status |
|--------|-------|--------|
| DSGN-01 | 3 | Pending |
| DSGN-02 | 3 | Pending |
| DSGN-03 | 3 | Pending |
| TOKN-01 | 4 | Pending |
| TOKN-02 | 4 | Pending |
| TOKN-03 | 4 | Pending |
| TOKN-04 | 4 | Pending |
| TOKN-05 | 4 | Pending |
| TOKN-06 | 4 | Pending |
| IMPL-01 | 5 | Pending |
| IMPL-02 | 5 | Pending |
| IMPL-03 | 5 | Pending |
| IMPL-04 | 5 | Pending |
| IMPL-05 | 5 | Pending |
| IMPL-06 | 5 | Pending |
| IMPL-07 | 5 | Pending |
| MIGR-01 | 6 | Pending |
| MIGR-02 | 6 | Pending |
| MIGR-03 | 6 | Pending |
| MIGR-04 | 6 | Pending |

**Coverage:** 20/20 mapped ✓

---
*Roadmap created: 2026-05-09*
