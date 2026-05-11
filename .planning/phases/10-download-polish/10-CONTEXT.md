# Phase 10: Download + Polish - Context

**Gathered:** 2026-05-11
**Status:** Ready for planning
**SPEC:** 4 requirements locked (10-SPEC.md, ambiguity 0.20)

## Phase Boundary

Add HTML report download button, polish report CSS with scoped styles using design tokens, and build download template with CDN fonts.

## Requirements (locked via SPEC.md)

**4 requirements are locked.** See `10-SPEC.md` for full requirements.

**In scope:**
- Download button on BaziReport tab bar
- Scoped `<style>` tag with CSS variable selectors
- Download template with `<meta>`, CDN fonts, styling
- Report visual hierarchy polish

**Out of scope:**
- PDF download
- Print-specific styles
- LLM content quality improvement

## Implementation Decisions

### Download Button

- **D-01:** "下载报告" button in BaziReport's tab bar, right side of 专业版/详解版 tabs
- **D-02:** Client-side Blob download — reads `BaziReportTab` sanitized HTML, wraps in template, triggers download
- **D-03:** Downloads the currently active tab's content

### Report CSS

- **D-04:** BaziReportTab injects a `<style>` tag before the content, scoped to `.bazi-report` class
- **D-05:** Style rules use project CSS variables (`var(--primary)`, `var(--foreground)`, `var(--card)`, `var(--border)`, etc.)
- **D-06:** Target selectors: `h2` (font-brand, text-2xl, primary color), `h3` (font-semibold), `table` (borders, header bg), `p` (line-height), `ul/ol/li`
- **D-07:** Same style block is embedded in download template for offline viewing

### Download Template

- **D-08:** Full HTML document: `<!DOCTYPE html>`, `<meta charset=utf-8>`, `<meta viewport>`, `<title>` from tab name
- **D-09:** CDN font link for LXGW WenKai from jsDelivr
- **D-10:** Inline `<style>` block matching the scoped styles from BaziReportTab
- **D-11:** Footer with "—— 喵十七 · 八字命理" attribution

### the agent's Discretion

- Exact CSS values for heading sizes, table borders, etc.
- Blob download filename format
- Whether to add a version label (专业版/详解版) in the downloaded file

## Canonical References

- `.planning/phases/10-download-polish/10-SPEC.md` — Locked requirements
- `src/components/bazi/BaziReport.tsx` — Tab bar to modify
- `src/components/bazi/BaziReportTab.tsx` — Content renderer to style
- `src/app/globals.css` — Design tokens reference
- `src/app/chat/page.tsx` — Page pattern reference

---
*Phase: 10-Download + Polish*
*Context gathered: 2026-05-11*
