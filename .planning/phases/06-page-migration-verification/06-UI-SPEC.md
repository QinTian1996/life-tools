---
phase: 6
slug: page-migration-verification
status: draft
shadcn_initialized: false
preset: none
created: 2026-05-10
---

# Phase 6 — UI Design Contract

> Visual and interaction contract for Phase 6: Page Migration & Verification. This is a **migration phase** — the design system (tokens, colors, typography, spacing, components) is already built in phases 3–5. This contract captures what migrated pages should look like after applying existing tokens and components.

---

## Design System

| Property | Value |
|----------|-------|
| Tool | none |
| Preset | not applicable |
| Component library | custom-ui (Button, Card, Badge, Input in `src/components/ui/`) |
| Icon library | none |
| Font | `--font-brand` (LXGW WenKai) + `--font-mono` (Sarasa Mono SC) |

**Migration principle:** All token references use Tailwind arbitrary-value syntax. No new design decisions — only existing token application.

---

## Spacing Scale

From `.planning/design-tokens.md` — 8px base rhythm, multiples only:

| Token | Value | Usage |
|-------|-------|-------|
| `space-1` | 4px | Icon gaps, inline padding |
| `space-2` | 8px | Component internal spacing, button padding |
| `space-3` | 12px | Compact block spacing |
| `space-4` | 16px | Standard spacing — paragraphs, related elements |
| `space-6` | 24px | Block separation — between content groups |
| `space-8` | 32px | Major block separation — page sections |
| `space-12` | 48px | Page-level breathing — hero area vertical spacing |

Exceptions: none. All spacing must be 8px multiples. No 7px, 13px, 21px.

---

## Typography

From `.planning/design-tokens.md`:

| Role | Size | Weight | Line Height |
|------|------|--------|-------------|
| Display | 48px (3rem) | 590 | 1.0 |
| H2 | 32px (2rem) | 590 | 1.2 |
| H3 | 24px (1.5rem) | 590 | 1.33 |
| Body | 16px (1rem) | 400 | 1.5 |
| Small | 14px (0.875rem) | 400 | 1.5 |
| Caption | 13px (0.8125rem) | 400 | 1.5 |

**Font family:** `font-brand` for all text. No `font-bold` (700) — max weight is 590.

---

## Color

**Migration note:** Colors are already defined in `globals.css` via `@theme` and `@variant dark`. Pages reference them via CSS variable tokens — no hardcoded color values.

### Semantic Token Usage Map

| Token | Light Mode | Dark Mode | Applied To |
|-------|-----------|-----------|------------|
| `--background` | warm-stone-50 | warm-stone-900 | PageLayout background |
| `--primary` | amber-500 | amber-400 | Home link-buttons, send Button, user MessageBubble bg |
| `--primary-foreground` | warm-stone-50 | warm-stone-900 | Text on primary bg |
| `--secondary` | warm-stone-100 | warm-stone-800 | AI MessageBubble bg |
| `--secondary-foreground` | warm-stone-700 | warm-stone-300 | Text on secondary bg |
| `--muted` | warm-stone-100 | warm-stone-800 | Muted surfaces |
| `--muted-foreground` | warm-stone-500 | warm-stone-400 | Muted text |
| `--border` | warm-stone-200 | warm-stone-700 | Borders |
| `--input` | warm-stone-200 | warm-stone-700 | Input/textarea borders |
| `--ring` | amber-400 | amber-400 | Focus rings |
| `--destructive` | oklch(0.55 0.2 25) | oklch(0.65 0.18 25) | Error display on ChatInput |
| `--destructive-foreground` | warm-stone-50 | warm-stone-50 | Text on destructive |

### Color Distribution

| Role | Value | Usage |
|------|-------|-------|
| Dominant (60%) | `var(--background)` | PageLayout, all page backgrounds |
| Secondary (30%) | `var(--card)` + `var(--secondary)` | MessageBubble surfaces |
| Accent (10%) | `var(--primary)` | Home link-buttons, ChatInput send Button, focus rings |
| Destructive | `var(--destructive)` | ChatInput error display only |

**Accent reserved for:** Home page link-buttons, ChatInput send button, focus rings only. NOT for all interactive elements.

### Dark Mode Brand Bar

Per `design-tokens.md` and Phase 4 decisions:

| Property | Value |
|----------|-------|
| Background | `rgba(28, 25, 23, 0.85)` (semi-transparent warm) |
| Foreground | `warm-stone-100` |
| Effect | `backdrop-filter: blur(12px)` |

**Anti-pattern gate:** Brand bar must NOT be pure black `#000000` or near-black. Warm semi-transparent is required.

---

## Migration Contract

### Home Page (`src/app/page.tsx`)

| Element | Migration Action | Token/Component Used |
|---------|-----------------|---------------------|
| Link buttons (算八字, 今天吃什么, 聊天) | Replace `<a>` with `<Button asChild><Link>` | `bg-[var(--primary)]`, `text-[var(--primary-foreground)]` |
| Button hover | Color shift via Button component (built-in) | `hover:opacity-90` or variant-specific |
| Page title | Font: `font-brand`, size: `text-3xl`, weight: 590 | `font-[family-name:var(--font-brand)]` |
| Page subtitle | Font: `font-brand`, size: `text-lg`, weight: 400 | `text-[var(--muted-foreground)]` |
| PageLayout background | Replace `bg-gradient-to-b from-amber-50 to-orange-50` | `bg-[var(--background)]` |

**Primary CTA label:** "聊天" (send message) — already present in ChatInput, not home page.

### Chat Page (`src/components/chat/ChatUI.tsx`, `MessageList.tsx`, `MessageBubble.tsx`, `ChatInput.tsx`)

| Element | Migration Action | Token Used |
|---------|-----------------|------------|
| User MessageBubble bg | Hardcoded → `bg-[var(--primary)]` | `var(--primary)` |
| User MessageBubble text | Hardcoded → `text-[var(--primary-foreground)]` | `var(--primary-foreground)` |
| AI MessageBubble bg | Hardcoded → `bg-[var(--secondary)]` | `var(--secondary)` |
| AI MessageBubble text | Hardcoded → `text-[var(--secondary-foreground)]` | `var(--secondary-foreground)` |
| Loading dots | Hardcoded → `bg-[var(--primary)]` | `var(--primary)` |
| ChatInput send Button | Replace with `<Button variant="primary">` | Button component |
| ChatInput textarea border | Replace hardcoded → `border-[var(--input)]` | `var(--input)` |
| ChatInput textarea focus ring | Replace hardcoded → `focus:ring-[var(--ring)]` | `var(--ring)` |
| ChatInput textarea text | `text-[var(--foreground)]` | `var(--foreground)` |
| ChatInput error bg | Replace `bg-red-50` → `bg-[var(--destructive)]` | `var(--destructive)` |
| ChatInput error text | Replace `text-red-700` → `text-[var(--destructive-foreground)]` | `var(--destructive-foreground)` |
| ChatInput error border | Replace `border-red-200` → `border-[var(--destructive)]` | `var(--destructive)` |

### PageLayout (`src/components/layout/PageLayout.tsx`)

| Element | Migration Action | Token Used |
|---------|-----------------|------------|
| Background | Replace `bg-gradient-to-b from-amber-50 to-orange-50` → `bg-[var(--background)]` | `var(--background)` |
| Padding | `p-6` (space-6 = 24px) | `space-6` |

---

## Interaction States

### Button Component (Home links, ChatInput send)

Per Phase 5 component specs — three variants built-in:

| State | Visual |
|-------|--------|
| Default | `bg-[var(--primary)]`, `text-[var(--primary-foreground)]` |
| Hover | Component handles via `hover:opacity-90` or internal class |
| Focus | `focus-visible:ring-2 focus-visible:ring-[var(--ring)]` (amber-400) |
| Active | `active:scale-[0.98]` per Button component |
| Disabled | `disabled:opacity-50` |

### Textarea (ChatInput)

| State | Visual |
|-------|--------|
| Default | `border-[var(--input)]`, `bg-transparent` |
| Focus | `focus:border-[var(--ring)]`, `focus:ring-2 focus:ring-[var(--ring)]` (amber-400) |
| Error | `bg-[var(--destructive)]`, `border-[var(--destructive)]`, `text-[var(--destructive-foreground)]` |

---

## Copywriting Contract

| Element | Copy | Source |
|---------|------|--------|
| Primary CTA | "聊天" | Already in codebase — no change |
| Home page title | "喵十七的工具箱" | Already in codebase |
| Home page subtitle | Already localized — maintain existing | Existing copy |
| Empty state (no messages) | "还没有消息，开始聊天吧！" | New — use in MessageList empty state |
| Error state | "发送失败，请重试" | New — ChatInput error display |
| Destructive confirmation | none in this phase | Not applicable |

---

## Component Inventory (Migration Targets)

| Component | File | Variants | States Handled |
|-----------|------|----------|---------------|
| `Button` | `src/components/ui/Button.tsx` | primary, secondary, ghost | default, hover, focus, active, disabled, loading |
| `Card` | `src/components/ui/Card.tsx` | default | default, hover |
| `Badge` | `src/components/ui/Badge.tsx` | default | default |
| `Input` | `src/components/ui/Input.tsx` | default | default, focus, error |

**Used by this phase:** `Button` (primary variant for home links + chat send).

---

## Registry Safety

| Registry | Blocks Used | Safety Gate |
|----------|-------------|-------------|
| none | none | not applicable |

**shadcn gate:** SKIPPED — this project uses custom UI components only, not shadcn.

---

## Verification Checklist (Post-Migration)

To be executed after `npm run build` passes:

1. **Brand bar dark mode:** Header is `rgba(28,25,23,0.85)` with blur — NOT pure black
2. **Text readability:** All text uses `var(--foreground)` / `var(--muted-foreground)` — readable in both modes
3. **No hardcoded colors:** Migrated pages use only token references (`bg-[var(--x)]`, `text-[var(--x)]`)
4. **Chat send:** MessageInput send button sends messages, streaming works
5. **Message bubbles:** User = primary bg, AI = secondary bg, correct text colors in both modes
6. **Home page:** Three link-buttons render with Button component, correct variant applied

---

## Checker Sign-Off

- [ ] Dimension 1 Copywriting: PASS (existing copy preserved, new strings defined)
- [ ] Dimension 2 Visuals: PASS (Button, Card, Input components applied)
- [ ] Dimension 3 Color: PASS (tokens applied, no hardcoded values)
- [ ] Dimension 4 Typography: PASS (font-brand, correct sizes/weights)
- [ ] Dimension 5 Spacing: PASS (8px multiples only)
- [ ] Dimension 6 Registry Safety: PASS (no third-party registries)

**Approval:** pending 2026-05-10

---

*Phase: 6-Page Migration & Verification*
*Contract: Migration application of existing tokens/components — no new design decisions*
