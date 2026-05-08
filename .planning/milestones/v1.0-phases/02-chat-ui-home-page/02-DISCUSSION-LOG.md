# Phase 2: Chat UI + Home Page - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-05-09
**Phase:** 02-Chat-UI-Home-Page
**Areas discussed:** Message bubbles + styling, Loading + typing indicator, Error display, Auto-scroll behavior, Input area

---

## Message Bubbles

| Option | Description | Selected |
|--------|-------------|----------|
| Aligned left (AI) vs right (user) | Classic chat bubble pattern — user messages right-aligned in one color, AI left-aligned in another | ✓ |
| Same style, different color | Both bubbles same shape, different background colors to distinguish roles | |
| Minimal — text only, no bubbles | Simple text list, no box/bubble styling, just clear role indicators | |

**User's choice:** Aligned left (AI) vs right (user)
**Notes:** Classic chat pattern

---

## Bubble Colors

| Option | Description | Selected |
|--------|-------------|----------|
| Warm style (amber bg) | Match the home page's amber theme — user bubbles amber, AI bubbles lighter cream/white | ✓ |
| Clean contrast | User bubbles blue or green, AI bubbles neutral gray/white — clear visual distinction | |
| Subtle gray tones | Both muted — user gray bg, AI white bg — doesn't distract from conversation | |

**User's choice:** Warm style (amber bg)
**Notes:** Match the home page's amber theme

---

## Loading Indicator

| Option | Description | Selected |
|--------|-------------|----------|
| Animated dots | Three bouncing/dotting dots like most chat apps — simple, clear | ✓ |
| Blinking cursor | A single blinking cursor or underscore — minimal, matches terminal aesthetic | |
| Skeleton bubble | Empty bubble with animated background — shows where the message will appear | |

**User's choice:** Animated dots
**Notes:** Simple and clear

---

## Error Display

| Option | Description | Selected |
|--------|-------------|----------|
| Inline error in chat | Show error message directly in the chat as a system message — user sees it in context | |
| Red banner above input | Error appears in a colored banner/bar at the top of the chat area, not as a bubble | ✓ |
| Red text below input | Small error text appears below the input field — minimal, non-intrusive | |

**User's choice:** Red banner above input
**Notes:** Non-intrusive but visible

---

## Auto-scroll Behavior

| Option | Description | Selected |
|--------|-------------|----------|
| Always scroll to bottom | Chat always scrolls to newest message, even if user manually scrolled up | |
| Smart scroll | Only auto-scroll if user is already at or near the bottom — respects user's reading position | ✓ |
| Smooth scroll animation | Same as one of above, but with smooth animation instead of instant jump | |

**User's choice:** Smart scroll
**Notes:** Respects user's reading position

---

## Input Area

| Option | Description | Selected |
|--------|-------------|----------|
| Amber send button | Textarea with light border, amber '发送' (Send) button matching home page style | ✓ |
| Minimal — icon only | Small send icon/arrow instead of text button, textarea fills width | |
| Full-width submit | Wide textarea + full-width send button below it | |

**User's choice:** Amber send button
**Notes:** Matching warm theme

---

## the agent's Discretion

- Exact pixel sizes, padding, border radius values — follow Tailwind conventions
- Animation timing and easing curves for dots and scroll behavior
- Send button disabled state while empty input

## Deferred Ideas

None
