# 喵十七的工具箱 (life-tools) Constitution

## Core Principles

### I. Simplicity First

Keep features simple; prefer YAGNI (You Aren't Gonna Need It) over over-engineering. A simple tool that works is better than a complex tool half-finished. Avoid premature abstraction and over-generalization.

### II. Ship and Iterate

Fast delivery over perfect implementation. Ship early, improve later. It's okay if something isn't perfect — it's better to have it working and iterate based on real usage. Low commitment, high creativity.

### III. Web-Focused

Desktop-first; no mobile unless explicitly requested. Use Next.js App Router and Tailwind CSS 4 as the only frontend stack. Don't introduce alternative frameworks or UI libraries.

### IV. Verify Before Ship

Not TDD-heavy but verify features work before declaring done. Run the app, test the feature manually, ensure no console errors. If it works and looks reasonable, ship it.

### V. Respect Constraints

Don't change the established tech stack: Next.js 16, React 19, Tailwind CSS 4, and DeepSeek API for LLM features. These constraints exist for consistency and were validated in v1.0. Any deviation requires explicit discussion.

## Technology Stack

**Frontend**: Next.js 16 + React 19 + Tailwind CSS 4
**LLM Integration**: DeepSeek API (via AI SDK 6.x with useChat)
**No Backend**: API routes live in `src/app/api/`
**No Auth**: No user accounts or authentication planned

## Development Workflow

- **Exploratory**: No fixed roadmap — add features as ideas come
- **Feature branches**: Use `001-feature-name` sequential naming
- **Milestones**: Track completed features in PROJECT.md
- **No ceremonies**: Skip heavy documentation for small features
- **Iteration**: May go weeks/months between contributions — that's fine

## Governance

This constitution is the baseline for this project. Given its casual nature:
- Amendments should be lightweight — if it helps, do it; if not, skip
- Complex governance processes are unnecessary for a personal hobby project
- Use GSD workflow (`/gsd-*` commands) for structured phases when it adds value
- When in doubt, prefer shipping over planning

**Version**: 1.0.0 | **Ratified**: 2026-05-09 | **Last Amended**: 2026-05-09