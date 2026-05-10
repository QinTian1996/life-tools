# Requirements: 喵十七的工具箱

**Defined:** 2026-05-09
**Core Value:** 为"喵十七的工具箱"建立温暖简洁的设计范式体系，所有页面遵循统一视觉语言
**Milestone:** v2.0 UI Design System & Visual Language

## v2.0 Requirements

### Layer 1: Design Philosophy & Principles (范式/哲学)

- [ ] **DSGN-01**: 定义"温暖极简主义"设计理念文档，明确核心原则（温暖、简洁、克制、工具感）
- [ ] **DSGN-02**: 定义设计原则的具体含义和判断标准（何时加装饰、何时去除、如何保持温暖感而非冷感）
- [ ] **DSGN-03**: 定义反模式清单：明确禁止的设计做法（如纯黑背景、多重阴影、装饰性渐变等）

### Layer 2: Design Tokens & Specifications (规范/语言)

- [ ] **TOKN-01**: 定义完整暖色调色彩调色板 — 亮色模式包含主色（amber）、辅色（warm-stone）、语义色（success/destructive/warning），每色5-10个色阶
- [ ] **TOKN-02**: 定义暗色模式色彩调色板 — 暖色暗底（非纯黑），amber 色阶向亮偏移，表面层级通过色值区分
- [ ] **TOKN-03**: 定义品牌栏暗色模式配色 — 半透明暖色背景 + backdrop-filter 模糊效果
- [ ] **TOKN-04**: 定义排版体系 — 字体族、字号层级（7-9级）、字重（400/510/590）、行高
- [ ] **TOKN-05**: 定义间距体系 — 基于 8px 节奏的间距 tokens（4/8/12/16/24/32/48）
- [ ] **TOKN-06**: 定义圆角和阴影 tokens — 暖色系阴影（非纯灰），圆角 6-16px 范围

### Layer 3: CSS Implementation & Component Library (实现/框架)

- [ ] **IMPL-01**: 重写 `src/app/globals.css` — 使用 Tailwind CSS 4 `@theme` + `@variant dark { }` 实现完整设计 token 体系
- [ ] **IMPL-02**: 实现暗色模式语义 token — `@variant dark { }` 块中定义所有暗色模式色彩覆写
- [ ] **IMPL-03**: 实现品牌栏暗色模式修复 — 替换当前 `#0a0a0a` 为暖色半透明 + backdrop-filter
- [ ] **IMPL-04**: 建立 Button 组件和样式 — primary/secondary/ghost 变体，统一圆角/间距/hover 态
- [ ] **IMPL-05**: 建立 Card 组件和样式 — 统一卡片容器，含 padding/圆角/边框/阴影
- [ ] **IMPL-06**: 建立 Badge 组件和样式 — 状态标签（success/warning/default）
- [ ] **IMPL-07**: 建立 Input 组件和样式 — 输入框统一外观，含 focus/focus-visible 环状高亮

### Layer 4: Page Migration (应用/改造)

- [ ] **MIGR-01**: 改造首页 (`src/app/page.tsx`) — 首页内容遵循新设计 token，使用新组件（Button、Card）
- [x] **MIGR-02**: 改造聊天页 (`src/components/chat/`) — 聊天组件遵循新设计 token，输入框/按钮使用新组件
- [ ] **MIGR-03**: 验证亮色模式 — 首页和聊天页在亮色模式下视觉一致，token 正确应用
- [ ] **MIGR-04**: 验证暗色模式 — 品牌栏为暖色而非纯黑，所有页面在暗色下可读，token 正确切换

## v1.0 Requirements (Validated)

Requirements from v1.0 that have shipped and remain valid:

- ✓ **CHAT-01**: 首页增加「聊天」按钮 — v1.0
- ✓ **CHAT-02**: `/chat` 路由显示简易聊天界面 — v1.0
- ✓ **CHAT-03**: 调用 DeepSeek API 进行对话 — v1.0
- ✓ **CHAT-04**: 支持发送消息并显示 AI 回复 — v1.0
- ✓ **UI-01**: 统一品牌导航栏（SiteHeader + LOGO + 暗色模式） — post-v1.0
- ✓ **UI-02**: 统一页面布局框架（PageLayout） — post-v1.0
- ✓ **UI-03**: 首页和聊天页迁移到统一布局 — post-v1.0

## Out of Scope

| Feature | Reason |
|---------|--------|
| Figma/Sketch 设计稿 | 个人项目，CSS 直接作为设计源 |
| 动画/过渡系统 | 保持简洁，仅 CSS transition |
| 响应式移动端设计 | 桌面优先，移动端不在范围内 |
| Storybook/文档平台 | 项目规模不需要文档站点 |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| DSGN-01 | — | Pending |
| DSGN-02 | — | Pending |
| DSGN-03 | — | Pending |
| TOKN-01 | — | Pending |
| TOKN-02 | — | Pending |
| TOKN-03 | — | Pending |
| TOKN-04 | — | Pending |
| TOKN-05 | — | Pending |
| TOKN-06 | — | Pending |
| IMPL-01 | — | Pending |
| IMPL-02 | — | Pending |
| IMPL-03 | — | Pending |
| IMPL-04 | — | Pending |
| IMPL-05 | — | Pending |
| IMPL-06 | — | Pending |
| IMPL-07 | — | Pending |
| MIGR-01 | — | Pending |
| MIGR-02 | 06-02 | Complete |
| MIGR-03 | — | Pending |
| MIGR-04 | — | Pending |

**Coverage:**
- v2.0 requirements: 20 total
- Mapped to phases: 0 (pending roadmap)

---
*Requirements defined: 2026-05-09*
*Last updated: 2026-05-09 after initial definition*
