# Codebase Concerns

**Analysis Date:** 2026-05-08

## Tech Debt

**No Test Coverage:**
- Issue: Project has zero test files (`*.test.*`, `*.spec.*` patterns return no matches)
- Files: Entire codebase
- Impact: Any refactoring or changes could break functionality undetected
- Fix approach: Add unit tests for utility functions, integration tests for API routes, E2E tests for critical user flows

**Incomplete Feature Implementation:**
- Issue: UI links to `/bazi` and `/eat` routes but no API routes exist (`src/app/page.tsx:8-18`)
- Files: `src/app/page.tsx`
- Impact: Navigation to these routes will result in 404 errors
- Fix approach: Implement the API routes and corresponding pages per `docs/architecture.md`

**Empty Configuration:**
- Issue: `next.config.ts` contains only commented placeholder, no actual configuration
- Files: `next.config.ts`
- Impact: Missing optimizations (image optimization, headers, redirects, etc.)
- Fix approach: Add appropriate Next.js configuration as features grow

**Unbounded API Design:**
- Issue: Architecture doc references `/api/bazi` and `/api/eat` but no actual route handlers exist
- Files: `docs/architecture.md` (states the design)
- Impact: No server-side API implementation yet
- Fix approach: Implement route handlers in `src/app/api/` directory

## Known Bugs

**None identified yet** — codebase is too new/minimal to have documented bugs. As features are implemented, bugs should be tracked.

## Security Considerations

**No Access Control:**
- Risk: All routes are publicly accessible with no authentication or rate limiting
- Files: `src/app/**` (entire application)
- Current mitigation: None — architecture doc explicitly states "无限制" (unrestricted)
- Recommendations:
  - Implement password-based access via Next.js middleware (per architecture doc)
  - Add rate limiting for API routes
  - Add input validation/sanitization before any LLM calls

**API Key Exposure Risk:**
- Risk: GLM API key must never reach client-side
- Files: `docs/architecture.md:18-30`
- Current mitigation: Correct pattern — key only in Vercel environment variables, server-side routes
- Recommendations: Continue following this pattern; verify no `process.env` values leak to client components

**No Input Validation:**
- Risk: User inputs to future API routes could be unsanitized before LLM calls
- Files: Future `src/app/api/**` routes
- Current mitigation: None (routes don't exist yet)
- Recommendations: Add Zod/schema validation for all API inputs before processing

## Performance Bottlenecks

**No performance issues identified** — codebase is minimal with only 2 small page components. Performance should be monitored as features grow.

**Future concerns to address:**
- LLM API latency for `/api/eat` and `/api/bazi`
- No caching layer (Redis/in-memory) for repeated queries
- Image optimization not configured

## Fragile Areas

**Minimal Error Handling:**
- Files: `src/app/layout.tsx`, `src/app/page.tsx`
- Why fragile: No error boundaries, no try/catch in components, no loading.tsx
- Safe modification: Add error.tsx and loading.tsx per Next.js App Router conventions
- Test coverage: None — add tests alongside error handling

**Hardcoded UI Strings:**
- Files: `src/app/page.tsx:4-5`
- Why fragile: All text is in Chinese with no i18n support
- Safe modification: Consider next-intl or similar if internationalization needed
- Test coverage: N/A for display strings

**Single Page Architecture:**
- Files: `src/app/page.tsx`
- Why fragile: No dynamic routing implemented yet, only a single static page
- Safe modification: Follow Next.js App Router patterns for new routes
- Test coverage: None

## Scaling Limits

**Database:** None yet — architecture doc shows no persistence layer planned
**Caching:** None — no Redis, Memcached, or in-memory cache configured
**Deployment:** Vercel platform with auto-scaling, but no explicit limits defined

## Dependencies at Risk

**Next.js 16.2.6:**
- Risk: Relatively new major version, potential for unexpected breaking changes
- Impact: Compatibility issues with ecosystem plugins may arise
- Migration plan: Monitor Next.js release notes; test upgrades in preview deployment before production

**React 19.2.4:**
- Risk: Very recent release, some libraries may not yet be compatible
- Impact: Dependency compatibility issues (eslint-plugin-react-hooks etc. may lag)
- Migration plan: Test React updates in preview; defer to stable minor versions if issues arise

**Tailwind CSS v4:**
- Risk: Major version with breaking changes from v3
- Impact: CSS patterns and plugins may need updates
- Migration plan: Review Tailwind v4 migration guide before upgrading

## Missing Critical Features

**No Error Boundary:**
- Problem: No `error.tsx` or `global-error.tsx` to catch React errors
- Blocks: User experience degradation on any unhandled error

**No Loading States:**
- Problem: No `loading.tsx` for Suspense boundaries
- Blocks: No streaming UX while data loads for future API-dependent pages

**No Type Safety Beyond TypeScript:**
- Problem: No Runtime validation (Zod) for API inputs/outputs
- Blocks: Type errors at runtime that TypeScript would catch at compile time

**No Monitoring/Observability:**
- Problem: No error tracking (Sentry), no analytics, no structured logging
- Blocks: Production issues are invisible; no visibility into user behavior

## Test Coverage Gaps

**Unit Tests:**
- What's not tested: Utility functions (none exist yet, but will be needed for bazi calculations)
- Files: N/A
- Risk: Logic errors in date/calendar calculations could produce incorrect results
- Priority: High (for八字 calculations which involve complex date logic)

**Integration Tests:**
- What's not tested: API routes (don't exist yet)
- Files: N/A
- Risk: LLM responses could be malformed, validation could fail silently
- Priority: Medium

**E2E Tests:**
- What's not tested: Entire user flow from page load to API response
- Files: N/A
- Risk: Navigation breaks, routes return unexpected responses
- Priority: Medium

---

*Concerns audit: 2026-05-08*
