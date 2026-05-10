# Phase 6: Page Migration & Verification - Context

**Gathered:** 2026-05-10
**Status:** Ready for planning

## Phase Boundary

Migrate the home page (`src/app/page.tsx`) and chat page (`src/app/chat/page.tsx` + `src/components/chat/*`) to use the new design tokens (Phase 4) and UI components (Phase 5). Then verify light/dark mode visual consistency via build + checklist.

The design system is built — tokens live in `globals.css`, four UI components exist in `src/components/ui/`, and the brand bar dark mode fix is applied. The pages still use raw Tailwind classes and hardcoded colors. This phase bridges that gap.

## Implementation Decisions

### Migration Depth

- **D-01:** Home page link-buttons (算八字, 今天吃什么, 聊天) → use `<Button>` component with `asChild` + `<Link>`. Full component adoption — variant/size/focus states from Phase 5.
- **D-02:** ChatInput → send button uses `<Button>` component; textarea keeps its `<textarea>` element but replaces hardcoded colors with design tokens (`var(--input)`, `var(--ring)`, `var(--foreground)`, etc.). No new `TextareaInput` component — use the existing `Input` component's token pattern directly on the `<textarea>` element.
- **D-03:** MessageBubble → map user messages to `var(--primary)` background + `var(--primary-foreground)` text; AI messages to `var(--secondary)` background + `var(--secondary-foreground)` text. Light/dark mode switching is automatic via the existing token system.
- **D-04:** ChatInput error display → replace hardcoded `bg-red-50`/`border-red-200`/`text-red-700` with `var(--destructive)`/`var(--destructive-foreground)` tokens.
- **D-05:** MessageList loading dots → use `var(--primary)` token.

### PageLayout Background

- **D-06:** Replace current hardcoded gradient `bg-gradient-to-b from-amber-50 to-orange-50` with solid `var(--background)`. This aligns with Phase 3's "平面优先" (flat design) principle. The `var(--background)` token is already warm-stone-50 in light mode and warm-stone-900 in dark mode — no warmth is lost.

### Verification

- **D-07:** Build check (`npm run build` must pass) + visual checklist covering:
  - Brand bar is semi-transparent warm (not pure black) in dark mode
  - Text is readable in both light and dark modes
  - No hardcoded color values remain on migrated pages (use tokens/utility classes)
  - Chat functionality is unaffected (send messages, streaming works)

### the agent's Discretion

The following are left to the planner and researcher:
- Exact CSS class strings for the token replacements
- Migration order (which file to tackle first)
- Whether to add chat-specific semantic tokens to `globals.css` or use existing ones
- How detailed the visual checklist should be and where to put it

## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Design System (Phases 3-5)
- `.planning/design-philosophy.md` — 8 design principles + anti-patterns (P4: 平面优先, P5: 三态反馈, P6: 150ms transition)
- `.planning/design-tokens.md` — Full token spec (OKLCH colors, typography, spacing, shadows)
- `.planning/phases/03-design-philosophy/03-CONTEXT.md` — Phase 3 decisions (warm minimalism framework)
- `.planning/phases/04-design-tokens/04-CONTEXT.md` — Phase 4 decisions (semantic token pairs, brand bar dark mode)
- `.planning/phases/05-css-components/05-CONTEXT.md` — Phase 5 decisions (component Props API, clsx pattern, globals.css structure)

### Project & Requirements
- `.planning/PROJECT.md` — Project context, constraints, key decisions
- `.planning/REQUIREMENTS.md` — v2.0 requirements MIGR-01..MIGR-04
- `.planning/ROADMAP.md` — Phase 6 goal and success criteria

### Source Files (targets for migration)
- `src/app/globals.css` — Design token system (DO NOT modify — this is the target standard)
- `src/components/ui/Button.tsx` — Button component (primary/secondary/ghost variants)
- `src/components/ui/Card.tsx` — Card component
- `src/components/ui/Input.tsx` — Input component (pattern reference for textarea token swap)
- `src/components/ui/Badge.tsx` — Badge component
- `src/components/layout/SiteHeader.tsx` — Brand bar (already migrated, data-site-header applied)
- `src/components/layout/PageLayout.tsx` — Page wrapper (needs gradient → solid migration)
- `src/app/page.tsx` — Home page (needs Button component + token migration)
- `src/components/chat/ChatUI.tsx` — Chat orchestrator (state management stays, visual tokens update)
- `src/components/chat/ChatInput.tsx` — Chat input (Button for send, token swap for textarea)
- `src/components/chat/MessageBubble.tsx` — Message bubbles (hardcoded colors → semantic tokens)
- `src/components/chat/MessageList.tsx` — Message list (loading dots → token, scroll behavior unchanged)

## Existing Code Insights

### Reusable Assets
- **`Button` component** (`src/components/ui/Button.tsx`): 3 variants (primary/secondary/ghost), 2 sizes (default/sm), loading spinner, focus ring, active scale — ready to replace home page links and chat send button
- **Design tokens** (`src/app/globals.css`): Full `@theme` + `:root` + `@variant dark` setup. Semantic tokens (`--primary`, `--secondary`, `--background`, `--foreground`, `--border`, `--input`, `--ring`, `--destructive`) cover all migration needs
- **`clsx` utility** (`src/lib/utils.ts`): Used by all UI components for className merging — available for token-based styling

### Established Patterns
- **Component Props API** (Phase 5 D-1): `extends ComponentPropsWithoutRef<'element'>` + `forwardRef` + `clsx(defaults, variant, size, userClass)`. Migration follows this for any component usage, not creation
- **Token reference style**: Tailwind arbitrary values — `bg-[var(--primary)]`, `text-[var(--foreground)]`, `border-[var(--border)]`
- **Dark mode**: `@custom-variant dark (&:where(.dark, .dark *))` — tokens auto-switch, no manual dark mode handling needed in code

### Integration Points
- **PageLayout** wraps both pages — changing its background affects everything below it
- **Chat page** uses `PageLayout title="聊天"` → `ChatUI` — migration touches both layers
- **globals.css** is the single source of truth for tokens — pages reference it via Tailwind utility classes, no direct CSS modifications needed

## Deferred Ideas

- **评估组件库设计**: Evaluate whether textarea (and potentially other input variants) should have proper UI components. This surfaced during ChatInput migration discussion — the current approach is token-only for textarea. Future phase: assess the UI component library's coverage and decide on a systematic component taxonomy.

---

*Phase: 6-Page Migration & Verification*
*Context gathered: 2026-05-10*
