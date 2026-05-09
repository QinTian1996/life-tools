<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:GSD-project-context -->

## GSD Project: 喵十七的工具箱

**Mode:** YOLO (auto-approve, execute directly)
**Granularity:** Standard
**Current Phase:** None (waiting for first feature)

### Quick Reference

| Command | Purpose |
|---------|---------|
| `/gsd-new-milestone [name]` | Start planning a new feature |
| `/gsd-discuss-phase N` | Clarify approach before planning |
| `/gsd-plan-phase N` | Create execution plan |
| `/gsd-execute-phase N` | Execute phase plans |
| `/gsd-progress` | Check project status |

### Active Files

- `.planning/PROJECT.md` — Project context and requirements
- `.planning/STATE.md` — Current phase status
- `.planning/ROADMAP.md` — Phase structure (when created)
- `.planning/REQUIREMENTS.md` — Feature requirements

### Workflow

1. **New Feature:** `/gsd-new-milestone [name]` → discuss → plan → execute → verify
2. **Continue Phase:** `/gsd-plan-phase N` or `/gsd-execute-phase N`
3. **Check Status:** `/gsd-progress`

### Constraints

- Next.js 16 + React 19 + Tailwind CSS 4
- LLM: GLM API (`process.env.GLM_API_KEY`)
- No authentication

<!-- END:GSD-project-context -->

<!-- SPECKIT START -->
For additional context about technologies to be used, project structure,
shell commands, and other important information, read the current plan
at `specs/001-unified-ui-framework/plan.md`.
<!-- SPECKIT END -->
