# Phase 5: CSS Implementation & Component Library - Context

**Gathered:** 2026-05-09
**Status:** Ready for planning
**SPEC:** 7 requirements locked (05-SPEC.md, ambiguity 0.147)

## Phase Boundary

将 Phase 4 的设计 Token 规范和 Phase 3 的设计理念落地为可运行的代码：重写 globals.css，修复品牌栏暗色模式，建立 4 个基础 UI 组件。

## Implementation Decisions

### D-1: 组件 Props API 模式

所有组件使用统一模式：

```typescript
// extend 原生 HTML 属性 + forwardRef
interface ButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'default' | 'sm';
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'default', loading, className, children, disabled, ...props }, ref) => {
    // clsx merge: component defaults first, user className last (can override)
    const classes = clsx(baseClasses, variantClasses[variant], sizeClasses[size], className);
    return <button ref={ref} className={classes} disabled={disabled || loading} {...props}>{children}</button>;
  }
);
```

**模式要点:**
- Extend `React.ComponentPropsWithoutRef<'element'>` — 自动继承所有 HTML 属性
- `forwardRef` — 支持 ref 传递
- className 合并: `clsx(defaults, variant, size, userClassName)` — 用户 className 在后可覆盖
- Component display name 设置: `Button.displayName = 'Button'`

**clsx 依赖:** `npm install clsx`（零依赖，~0.5KB gzipped）

**所有 4 个组件统一使用此模式:**
- `Button` extends `ComponentPropsWithoutRef<'button'>`
- `Card` extends `ComponentPropsWithoutRef<'div'>`
- `Badge` extends `ComponentPropsWithoutRef<'span'>`
- `Input` extends `ComponentPropsWithoutRef<'input'>`

### D-2: globals.css 完整替换策略

直接使用 `.planning/design-tokens.md` 的完整配置块替换现有 35 行 globals.css：

**替换内容:**
1. `@import "tailwindcss"` — 保留
2. `@custom-variant dark (&:where(.dark, .dark *))` — 新增（替代旧的 @media prefers-color-scheme）
3. `@theme { }` 块 — 完整 Token 映射（所有语义色 + 原始色 + radius + shadow + font）
4. `:root { }` 块 — 亮色模式值（19 对语义色 + header 变量）
5. `@variant dark { }` 块 — 暗色模式值（19 对语义色 + header 半透明暖色）
6. `header[data-site-header]` — backdrop-filter 规则
7. `@layer base { }` — body 基础样式

**保留项:**
- `body` 基础样式（background, color, font-family）
- 不保留旧的 `@media (prefers-color-scheme: dark)` — 完全替换为 `@variant dark { }`

### D-3: 组件文件结构

```
src/components/ui/
├── Button.tsx    # <Button variant="primary" size="default">
├── Card.tsx      # <Card padding="default">
├── Badge.tsx     # <Badge variant="default">
└── Input.tsx     # <Input placeholder="...">
```

组件直接从 `src/components/ui/Button` 导入（不使用 barrel index.ts）。

### D-4: 品牌栏暗色模式修复

**SiteHeader 修改（最小化）:**
- 添加 `data-site-header` 属性到 `<header>` 元素
- 不改变其他逻辑（Link/span 切换保持不变）

**globals.css 修复:**
```css
header[data-site-header] {
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
```

暗色模式下 `--header-bg: rgba(28, 25, 23, 0.85)` 已在 `@variant dark { }` 中定义——SiteHeader 通过 `var(--header-bg)` 自动获得新值。

### the agent's Discretion

以下留给规划阶段和研究者决定：
- Button loading spinner 的具体实现（简化的 CSS spinner 即可）
- Card 的 padding prop 具体值（default: p-6, compact: p-4）
- 组件文件内是否添加 JSDoc 注释

## Canonical References

- `.planning/phases/05-css-components/05-SPEC.md` — **Locked requirements** — MUST read before planning
- `.planning/design-tokens.md` — 完整 Token 规范（@theme 配置块）
- `.planning/design-philosophy.md` — 设计理念（P4 平面优先，P5 三态反馈，P6 150ms 过渡）
- `.planning/REQUIREMENTS.md` — v2.0 需求 IMPL-01..IMPL-07
- `.planning/ROADMAP.md` — Phase 5 目标与成功标准
- `src/app/globals.css` — 当前 CSS（将被完全替换）
- `src/components/layout/SiteHeader.tsx` — 当前品牌栏（需添加 data-site-header）

## Deferred Ideas

None.

---
*Phase: 5-CSS Components*
*Context gathered: 2026-05-09*
