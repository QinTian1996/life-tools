# Research Summary: Warm Minimal Design System

**Milestone**: v2.0 UI Design System & Visual Language
**Date**: 2026-05-09

## Key Findings

### 1. Design Token Architecture

**Scope for small projects**: 15-25 tokens across 5 categories (colors, typography, spacing, radii, shadows). Two-tier: primitives (raw values) + semantics (purpose-based names).

**Recommended structure**: Single `globals.css` using Tailwind CSS 4's CSS-first approach:
- `@theme` for utility-class tokens
- `@custom-variant dark` for dark mode
- `@variant dark { }` blocks for dark mode overrides
- `@layer components` for shared component styles (NOT `@apply`)

**Color space**: Use OKLCH for perceptually uniform palette generation.

### 2. Warm Dark Mode

**Core fix**: The "ugly black header" problem is that `--header-bg: #0a0a0a` in dark mode. Solution:
- Use warm dark grays (`#1C1917` stone-900, not `#0a0a0a`)
- Semi-transparent warm surface: `rgba(28, 25, 23, 0.85)` + `backdrop-filter: blur(12px)`
- Shift amber accents lighter in dark mode (400-300 instead of 600-500)
- Surface elevation via lighter warm surfaces (not shadows)

**Palette reference**:

| Token | Light | Dark |
|-------|-------|------|
| bg-base | warm off-white | warm stone-900 |
| primary | amber-600 | amber-400 |
| text | warm near-black | warm off-white |
| border | warm subtle | warm amber-tinted |

### 3. Minimal Design Principles

**"Warm Minimalism"** — avoids the cold/clinical feel:
- Cream/off-white backgrounds instead of pure white
- Weight 510 for emphasis (subtler than bold)
- 8px spacing rhythm
- One accent color used sparingly
- Organic shapes: 12-16px border-radius

**Anti-patterns**: Pure black text, hidden navigation, low contrast, decorative gradients.

### 4. Implementation Pattern (Tailwind CSS 4)

```css
@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));

:root {
  --radius: 0.5rem;
  --background: oklch(0.985 0.005 85);
  --foreground: oklch(0.205 0.01 60);
  --primary: oklch(0.55 0.12 70);
  /* ... semantic tokens */
}

@variant dark {
  --background: oklch(0.18 0.01 60);
  --foreground: oklch(0.95 0.005 85);
  --primary: oklch(0.65 0.14 70);
  /* ... dark mode overrides */
}
```

**Component approach**: CSS variables + `@layer components`, no `@apply`.

## Sources

- Radix Colors / shadcn/ui: CSS variable + semantic token pattern
- Tailwind CSS 4 docs: `@theme` directive, `@variant` blocks
- Notion dark mode: warm undertones instead of pure black
- Linear.app / Raycast: minimal design with engineering precision
