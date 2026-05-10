# Phase 6: Page Migration & Verification - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-10
**Phase:** 6-Page Migration & Verification
**Areas discussed:** Migration Depth, PageLayout Background, Chat Message Colors, Verification Standard

---

## Migration Depth

### Home Page Link-Buttons

| Option | Description | Selected |
|--------|-------------|----------|
| Use Button component | Replace with `<Button asChild><Link>` — full component adoption | ✓ |
| Token-only swap | Keep as `<Link>` but replace colors with design tokens | |

**User's choice:** Use Button component — adopt all variant/size/focus states from the new system.

### ChatInput (textarea + send button)

| Option | Description | Selected |
|--------|-------------|----------|
| Button + token-styled textarea | Send button → `<Button>`, textarea → token replacement on existing `<textarea>` | ✓ |
| Create TextareaInput + Button | New TextareaInput component in `src/components/ui/` + Button | |

**User's choice:** Button component for send, token-only for textarea. Deferred idea: "评估组件库设计" — evaluate component library design (including textarea component) in a future phase.

### Chat Message Colors

| Option | Description | Selected |
|--------|-------------|----------|
| Semantic token mapping | User → `var(--primary)` + `var(--primary-foreground)`, AI → `var(--secondary)` + `var(--secondary-foreground)` | ✓ |
| Keep hardcoded + dark overrides | Keep `bg-amber-500`/`bg-orange-50` with `@variant dark` overrides | |
| Don't touch | Leave message styling as-is | |

**User's choice:** Semantic token mapping — light/dark auto-switch via existing token system.

### Error Display & Loading Dots

| Option | Description | Selected |
|--------|-------------|----------|
| Token replacement | Error → `var(--destructive)`, loading dots → `var(--primary)`. Structure unchanged. | ✓ |
| Badge component for errors | Use Phase 5 `<Badge variant="destructive">` for error display | |

**User's choice:** Token replacement only — no structural changes to error or loading elements.

---

## PageLayout Background

| Option | Description | Selected |
|--------|-------------|----------|
| Solid var(--background) | Replace gradient with flat `var(--background)` token | ✓ |
| Keep gradient, swap colors | Keep `bg-gradient-to-b` structure, update colors to design tokens | |
| the agent's discretion | Let planner/researcher decide | |

**User's choice:** Replace with solid `var(--background)`. Aligns with Phase 3 "平面优先" (flat design) principle.

---

## Chat Message Colors

**Covered in Migration Depth** — semantic token mapping (`--primary` for user, `--secondary` for assistant) handles both light and dark mode automatically. No separate discussion needed.

---

## Verification Standard

| Option | Description | Selected |
|--------|-------------|----------|
| Build + visual checklist | `npm run build` passes + manual visual checklist | ✓ |
| Build only | `npm run build` passes → done | |
| Full QA | Build + checklist + manual screenshot comparison | |

**User's choice:** Build + visual checklist. Checklist covers: brand bar warm in dark mode, text readable both modes, no hardcoded colors, chat functionality intact.

---

## the agent's Discretion

- Exact CSS class strings for token replacements
- Migration file order
- Whether chat-specific tokens are needed or existing ones suffice
- Visual checklist format and location

## Deferred Ideas

- **评估组件库设计** — Evaluate component library coverage and taxonomy (textarea, select, etc.). Future phase after current migration is complete.
