# Phase 10: Download + Polish — Specification

**Created:** 2026-05-11
**Ambiguity score:** 0.20 (gate: ≤ 0.20)
**Requirements:** 4 locked

## Goal

Add HTML report download button, polish report CSS typography and layout to match project design language (warm-minimalist, LXGW WenKai, OKLCH tokens).

## Background

Phase 9 delivered functional report rendering with dual tabs. The HTML rendering works but lacks visual hierarchy — headings, tables, and spacing are inconsistent. No download button exists. This phase adds a client-side HTML download and applies the project's design system to the report content with proper typography, spacing, and color tokens.

## Requirements

1. **HTML download button**: User can download the current report as a self-contained HTML file.
   - Current: No download mechanism exists
   - Target: BaziReport component has a "下载报告" button below the tab bar; clicking it triggers a Blob download of the active tab's content wrapped in a styled HTML template with CDN fonts
   - Acceptance: Clicking download creates a `.html` file that opens in browser with correct rendering and CDN fonts

2. **Report CSS polish**: Report HTML uses project design tokens for typography and layout.
   - Current: Report uses bare HTML tags with minimal styling from `text-[var(--foreground)]` and `leading-relaxed`
   - Target: `<h2>` uses font-brand + text-2xl + primary color; `<h3>` uses font-semibold; `<table>` has borders/headers with border/background tokens; `<p>` has proper line-height and spacing; dark mode compatible via CSS variables
   - Acceptance: Report renders with clear visual hierarchy in both light and dark modes

3. **BaziReportTab styling**: The sanitized HTML content area applies project CSS classes.
   - Current: Content area div uses `space-y-4 text-[var(--foreground)] leading-relaxed`
   - Target: Content area styles `<h2>`, `<h3>`, `<p>`, `<table>`, `<ul>`, `<li>` via descendant CSS selectors or a scoped style block using design tokens
   - Acceptance: All HTML elements in the report content have proper sizing, colors, and spacing matching the project design system

4. **Download template**: Downloaded HTML file includes styled wrapper.
   - Current: No download template exists
   - Target: Downloaded HTML wraps content in a minimal template with `<title>`, `<meta charset>`, CDN font `<link>` (LXGW WenKai from jsDelivr), and inline `<style>` tags mirroring the project design system
   - Acceptance: Downloaded file passes HTML validation and renders correctly in any browser without external dependencies (besides CDN fonts)

## Boundaries

**In scope:**
- Download button on BaziReport
- Client-side Blob download (no server endpoint needed)
- CDN font embedding in download template
- Report CSS polish using project design tokens
- Scoped styles via `<style>` tags for both in-page and download

**Out of scope:**
- PDF download — HTML only, no Puppeteer/Playwright server
- Print-specific styles — download is self-contained HTML
- Report content quality — LLM output quality is Phase 9 concern
- iOS/mobile layout optimization — desktop-first per project conventions

## Constraints

- Fonts: LXGW WenKai from jsDelivr CDN (same as in globals.css)
- Download: Client-side only, no server endpoint
- Design: Must use project's semantic color tokens (--foreground, --primary, --card, --border, etc.)
- TypeScript strict

## Acceptance Criteria

- [ ] Download button visible on report, produces valid .html file
- [ ] Downloaded HTML opens correctly with LXGW WenKai font rendering
- [ ] Report headings (h2/h3) have clear visual hierarchy with primary color
- [ ] Report tables have borders and alternating row styles using design tokens
- [ ] Report renders correctly in dark mode
- [ ] `npm run build` passes with zero TypeScript errors

## Ambiguity Report

| Dimension          | Score | Min  | Status | Notes                              |
|--------------------|-------|------|--------|------------------------------------|
| Goal Clarity       | 0.85  | 0.75 | ✓      | Download + CSS polish              |
| Boundary Clarity   | 0.80  | 0.70 | ✓      | Explicit scope, no PDF             |
| Constraint Clarity | 0.75  | 0.65 | ✓      | CDN fonts, client-side only        |
| Acceptance Criteria| 0.80  | 0.70 | ✓      | 6 pass/fail checks                 |
| **Ambiguity**      | 0.20  | ≤0.20| ✓      |                                    |

---
*Phase: 10-download-polish*
*Spec created: 2026-05-11*
*Next step: /gsd-discuss-phase 10*
