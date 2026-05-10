# Phase 5: CSS Implementation & Component Library — Specification

**Created:** 2026-05-09
**Ambiguity score:** 0.147 (gate: ≤ 0.20)
**Requirements:** 7 locked

## Goal

将 Phase 4 的设计 Token 规范落地为代码——重写 `globals.css` 使用 `@theme` + `@variant dark { }` 体系，修复品牌栏暗色模式，建立 4 个基础 UI 组件（Button/Card/Badge/Input），每个组件覆盖 default/hover/focus/active/disabled 五态。

## Background

**Current state (from codebase):**
- `src/app/globals.css`: 35 行，4 个 CSS 变量（--background, --foreground, --header-bg, --header-fg），使用 `@media (prefers-color-scheme: dark)` 而非 `@variant dark { }`，颜色用 hex 而非 oklch
- `src/components/layout/SiteHeader.tsx`: 使用 `var(--header-bg)` — 亮色模式为 `#d97706`（amber-600），暗色模式为 `#0a0a0a`（纯近黑）——这就是用户反馈的"丑陋黑色顶栏"
- `src/components/layout/PageLayout.tsx`: 页面布局框架
- `src/components/chat/`: 聊天组件（ChatUI, MessageBubble, MessageList, ChatInput）——这些有内联 Tailwind 类但没有使用共享组件
- `.planning/design-tokens.md`: 完整的 Token 规范（19 对语义色 + 20 级原始色 + 7 级字号 + 5 级圆角 + 完整 `@theme` 配置）
- `.planning/design-philosophy.md`: 设计理念文档（P4 平面优先、P5 即时反馈三态、P6 150ms 过渡等）

**Gap between current state and target:** globals.css 需要完全重写以匹配 Token 规范；SiteHeader 需要暗色模式修复；没有共享 UI 组件库——消息气泡、聊天输入框等是手工内联样式而非复用组件。

## Requirements

1. **重写 globals.css**: 用设计 Token 规范的完整 `@theme` + `:root` + `@variant dark { }` 配置块替换现有文件。
   - Current: 35 行 CSS，4 个变量，@media dark，hex 颜色
   - Target: 完整的 `@theme` 块（所有语义色映射），`:root` 块（亮色模式值），`@variant dark { }` 块（暗色模式值），品牌栏半透明暖色，backdrop-filter；`@custom-variant dark (&:where(.dark, .dark *))`；使用 oklch 值
   - Acceptance: `grep -c "oklch" src/app/globals.css` ≥ 50; `grep "@variant dark" src/app/globals.css` 返回 match; `grep "rgba(28, 25, 23" src/app/globals.css` 返回 match; `npm run build` 通过

2. **修复品牌栏暗色模式**: SiteHeader 在暗色模式下渲染为半透明暖色而非纯黑。
   - Current: `--header-bg: #0a0a0a`（纯近黑）在暗色模式下
   - Target: 暗色模式 `--header-bg: rgba(28, 25, 23, 0.85)`；header 元素有 `backdrop-filter: blur(12px)`；属性选择器 `header[data-site-header]` 用于 backdrop-filter
   - Acceptance: `grep "rgba(28, 25, 23, 0.85)" src/app/globals.css` 返回 match; SiteHeader 组件拥有 `data-site-header` 属性；`grep "backdrop-filter: blur(12px)" src/app/globals.css` 返回 match（含 -webkit- 前缀）

3. **建立 Button 组件**: 位于 `src/components/ui/Button.tsx`。3 种 variant（primary/secondary/ghost），2 种 size（default/sm），5 个状态（default/hover/focus/active/disabled）+ loading 态。
   - Current: 项目中有内联 `<button>` 和 `<a>` 样式，无共享 Button 组件
   - Target: React 组件 `<Button variant="primary" size="default">` — 使用 Tailwind 类 + 设计 Token；primary: amber-500 背景 + hover:amber-600；secondary: warm-stone-100 背景；ghost: 透明 + hover:bg；所有 variant: focus:ring-2 focus:ring-amber-400, disabled:opacity-50 cursor-not-allowed, active:scale-[0.98]；transition-all duration-150；圆角 12px
   - Acceptance: `src/components/ui/Button.tsx` 存在; `grep "variant.*primary\|secondary\|ghost" src/components/ui/Button.tsx` 返回 match; `grep "focus:ring-2" src/components/ui/Button.tsx` 返回 match; `grep "disabled:opacity-50" src/components/ui/Button.tsx` 返回 match

4. **建立 Card 组件**: 位于 `src/components/ui/Card.tsx`。默认 variant，带 padding/圆角/边框。
   - Current: 聊天页的内联卡片样式，无共享 Card 组件
   - Target: `<Card>` 渲染为 `<div>` 带 bg-card、text-card-foreground、border、rounded-lg(12px)、p-4(16px) 或 p-6(24px) 通过 padding prop
   - Acceptance: `src/components/ui/Card.tsx` 存在; `grep "rounded-lg\|rounded-\[var(--radius-lg)\]\|rounded-xl" src/components/ui/Card.tsx` 返回 match; `grep "bg-card" src/components/ui/Card.tsx` 返回 match

5. **建立 Badge 组件**: 位于 `src/components/ui/Badge.tsx`。default/success 两种 variant，胶囊形。
   - Current: 不存在 Badge 组件
   - Target: `<Badge variant="default">` — default: bg-muted/muted-foreground；success: bg-success/success-fg；rounded-full(9999px)；px-2 py-0.5；text-xs
   - Acceptance: `src/components/ui/Badge.tsx` 存在; `grep "rounded-full" src/components/ui/Badge.tsx` 返回 match; `grep "variant.*success" src/components/ui/Badge.tsx` 返回 match

6. **建立 Input 组件**: 位于 `src/components/ui/Input.tsx`。default 外观，focus ring，disabled 态。
   - Current: ChatInput 中有内联 `<textarea>` 样式，无共享 Input 组件
   - Target: `<Input>` 渲染为 `<input>` 带 border、rounded-md(8px)、px-3 py-2、bg-background、text-foreground、focus:ring-2 focus:ring-amber-400 focus:border-ring、disabled:opacity-50、placeholder:text-muted-foreground
   - Acceptance: `src/components/ui/Input.tsx` 存在; `grep "focus:ring-2" src/components/ui/Input.tsx` 返回 match; `grep "placeholder:text-muted-foreground" src/components/ui/Input.tsx` 返回 match

7. **准备 PageLayout/SiteHeader 用于 Phase 6 迁移**: PageLayout 和 SiteHeader 应引用全局 CSS 变量以使暗色模式修复生效。Phase 6 将实际迁移页面内容以使用新组件。
   - Current: SiteHeader 使用 `var(--header-bg)` 和 `var(--header-fg)`——已经指向 CSS 变量，但旧变量值为纯黑
   - Target: globals.css 重写后，`--header-bg` 在暗色模式下自动变为 `rgba(28, 25, 23, 0.85)`——无需修改现有组件。SiteHeader 添加 `data-site-header` 属性以触发 backdrop-filter CSS 规则。
   - Acceptance: `grep "data-site-header" src/components/layout/SiteHeader.tsx` 返回 match; `npm run build` 通过

## Boundaries

**In scope:**
- 重写 `src/app/globals.css` 为完整的设计 Token CSS 配置
- 修复品牌栏暗色模式（半透明暖色 + backdrop-filter）
- 创建 `src/components/ui/Button.tsx`（3 variants, 5 states）
- 创建 `src/components/ui/Card.tsx`（默认 variant）
- 创建 `src/components/ui/Badge.tsx`（2 variants）
- 创建 `src/components/ui/Input.tsx`（默认 variant, focus ring）
- 添加 `data-site-header` 属性到 SiteHeader 组件
- 确保 `npm run build` 通过——无 TypeScript 错误

**Out of scope:**
- 将现有页面迁移到新组件 — 即 Phase 6 的范围
- 将聊天组件（ChatInput、MessageBubble）重构为使用共享组件 — Phase 6
- 组件测试（Jest/Vitest） — 项目当前无测试框架，验收使用手动 grep + build
- 字体加载（霞鹜文楷、更纱黑体）的 next/font 配置 — Phase 6
- 组件文档或 Storybook — 项目规模不需要
- 组件动画/过渡系统 — 仅用 Tailwind transition 类

## Constraints

- 仅使用 Tailwind CSS 4 + CSS 变量——不引入第三方 UI 库（Radix UI、shadcn/ui 等）
- 所有颜色值必须使用 oklch（来自 `.planning/design-tokens.md`）
- 暗色模式切换使用 `@variant dark { }` 块（而非旧的 `@media prefers-color-scheme`）
- Button variant 命名：`primary` / `secondary` / `ghost`（不使用 `default` / `outline` 等）
- 所有交互元素必须覆盖 hover / focus / active / disabled 四态 + Button 额外覆盖 loading
- 过渡时长：hover effect 150ms ease-out，其他 200ms ease-in-out
- 圆角：Button+Card 12px，Input 8px，Badge full

## Acceptance Criteria

- [ ] `grep -c "oklch" src/app/globals.css` ≥ 50
- [ ] `grep "@variant dark" src/app/globals.css` 返回 match
- [ ] `grep "rgba(28, 25, 23" src/app/globals.css` 返回 match
- [ ] `grep "backdrop-filter: blur(12px)" src/app/globals.css` 返回 match
- [ ] `src/components/ui/Button.tsx` 存在，grep "variant" 返回 primary/secondary/ghost
- [ ] `src/components/ui/Button.tsx` 中 grep "focus:ring-2" 和 "disabled:opacity-50" 均返回 match
- [ ] `src/components/ui/Card.tsx` 存在，grep "bg-card" 返回 match
- [ ] `src/components/ui/Badge.tsx` 存在，grep "rounded-full" 返回 match
- [ ] `src/components/ui/Input.tsx` 存在，grep "focus:ring-2" 返回 match
- [ ] `grep "data-site-header" src/components/layout/SiteHeader.tsx` 返回 match
- [ ] `npm run build` 退出码 0，无 TypeScript 错误

## Ambiguity Report

| Dimension          | Score | Min  | Status | Notes |
|--------------------|-------|------|--------|-------|
| Goal Clarity       | 0.95  | 0.75 | ✓      | 7 requirements with current/target/acceptance |
| Boundary Clarity   | 0.88  | 0.70 | ✓      | Explicit in/out scope lists |
| Constraint Clarity | 0.72  | 0.65 | ✓      | Style constraints from design-philosophy + tokens |
| Acceptance Criteria| 0.78  | 0.70 | ✓      | 11 grep-verifiable pass/fail criteria |
| **Ambiguity**      | 0.147 | ≤0.20| ✓      | All dimensions above minimum |

## Interview Log

| Round | Perspective    | Question summary | Decision locked |
|-------|----------------|------------------|-----------------|
| 1 | Researcher | Delta: globals.css rewrite approach? | 原地重写 — 直接覆盖旧文件 |
| 1 | Researcher | Component state coverage? | 5 states: default/hover/focus/active/disabled; Button +loading |
| 2 | Simplifier | MVP scope: all 4 components or cut? | 全部保留，核心 variant only |
| 2 | Boundary Keeper | Acceptance: how to verify? | grep CSS class + npm run dev 手动检查 |

---
*Phase: 05-css-components*
*Spec created: 2026-05-09*
*Next step: /gsd-discuss-phase 5 — implementation decisions (component props API, file structure, etc.)*
