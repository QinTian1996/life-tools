# Research: Unified UI Framework

**Feature**: 001-unified-ui-framework
**Date**: 2026-05-09

## Research Topics

### 1. Layout Strategy: Component vs Nested Layout

**Decision**: PageLayout 组件包裹（而非嵌套 layout.tsx）

**Rationale**:
- 需要向布局传递当前页面标题（FR-005），App Router 的嵌套 `layout.tsx` 无法直接接收子页面的动态参数（需通过 params 或 context，不灵活）
- PageLayout 是一个普通的 React Server Component，子页面直接 `<PageLayout title="聊天"><ChatUI /></PageLayout>`，API 清晰
- 保持 root `layout.tsx` 简洁（仅字体、metadata），业务布局逻辑集中在 PageLayout
- 符合 "Simplicity First" 原则 — 不引入 layout groups 或 parallel routes

**Alternatives considered**:
- Nested layout groups `(tool)/layout.tsx`: 需要 layout group 文件夹，结构复杂，标题传递仍需 workaround
- Template files `template.tsx`: 每次导航重新挂载，不必要

### 2. Navigation: Next.js Link vs Plain <a>

**Decision**: 使用 Next.js `<Link>` 组件

**Rationale**:
- `<Link>` 提供客户端路由（SPA 导航），页面切换不刷新，1 秒内完成导航（SC-001）
- 现有代码使用 `<a href>`，本次迁移统一替换为 `<Link>`
- 在首页时 LOGO 不渲染为 `<Link>`（FR-002），而是纯 `<span>` 或禁用链接

**Alternatives considered**:
- `useRouter().push()`: 对纯链接场景过度
- 纯 `<a>`: 会导致页面刷新，不符合 SC-001

### 3. Dark Mode: Tailwind CSS 4 Approach

**Decision**: 使用 CSS 变量的 `prefers-color-scheme` 媒体查询（现有方案），品牌栏跟随全局变量

**Rationale**:
- 项目已有 `@media (prefers-color-scheme: dark)` 定义 `--background` / `--foreground`
- FR-011 要求"自动跟随系统暗色模式"，与现有机制一致
- 品牌栏背景色在暗色模式下自动切换为 `#0a0a0a`（跟随 `--background`），文字跟随 `--foreground`
- LOGO SVG 如果是深色系的，需要在暗色模式下有浅色变体，或使用 CSS filter 反转

**Action**: 检查 `logo.svg` 在暗色背景下的可读性；如需调整，可使用 `dark:invert` 或 `dark:brightness-0 dark:invert`

**Alternatives considered**:
- Tailwind `dark:` variant with manual toggle: 不需要手动切换
- Separate dark-mode brand bar styles: 增加维护负担

### 4. SVG Logo Rendering

**Decision**: 使用 `<img>` 标签直接引用 `public/logo.svg`

**Rationale**:
- `public/logo.svg` 已在项目中，无需额外处理
- `<img src="/logo.svg">` 简单直接，Next.js 自动从 public/ 提供静态文件
- 不引入 `next/image`，因为 SVG 很小且不需要优化（resize/format）
- 如果暗色模式下需要变体，可同时引用 `/logo_line.svg`（浅色线条版本）

**Alternatives considered**:
- `next/image`: 对 SVG 过重，增加配置复杂度
- Inline SVG component: 增加维护成本，已有 svg 文件

### 5. Existing Chat Page Migration

**Decision**: ChatUI 组件保持功能不变，仅去除其内联 `<header>`，标题由 PageLayout 的 title prop 传入

**Rationale**:
- FR-008 要求迁移内联 header
- ChatUI.tsx 的第 36-38 行 `<header>` 移除，改为 `export default function ChatPage() { return <PageLayout title="聊天"><ChatUI /></PageLayout> }`
- ChatUI 的背景渐变 (`from-amber-50 to-orange-50`) 移到 PageLayout，确保所有页面一致
- FR-009 要求首页内容在加入品牌栏后布局协调 — 首页背景也由 PageLayout 统一提供

### 6. Component Architecture

**Decision**: 两个组件 — `SiteHeader` (presentational) + `PageLayout` (structural)

```
PageLayout
├── SiteHeader (fixed top)
│   ├── Logo + Brand (Link to /, or span on homepage)
│   └── Page Title (right side, optional)
└── Content Area (flex-1, scrollable)
```

**Component interfaces**:
- `SiteHeader`: `{ title?: string; isHome?: boolean }`
- `PageLayout`: `{ title?: string; children: React.ReactNode }`

PageLayout 通过 isHome 判断是否将 LOGO 渲染为 `<Link>`。
