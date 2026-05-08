# Architecture

**Analysis Date:** 2026-05-08

## System Overview

```text
┌─────────────────────────────────────────────────────────────┐
│                     Browser / Client                         │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Next.js App Router                         │
│                    (src/app/*)                               │
├──────────────────┬──────────────────┬───────────────────────┤
│    Pages/Routes  │   API Routes     │    Layouts/Components │
│  page.tsx        │  (future)         │  layout.tsx            │
│  /bazi, /eat     │  /api/bazi       │  globals.css           │
│                  │  /api/eat        │                        │
└────────┬─────────┴────────┬─────────┴──────────┬────────────┘
         │                    │                     │
         ▼                    ▼                     ▼
┌─────────────────────────────────────────────────────────────┐
│                   React Components                           │
│              (Client-Side Rendering)                          │
└─────────────────────────────────────────────────────────────┘
```

## Component Responsibilities

| Component | Responsibility | File |
|-----------|----------------|------|
| Home Page | Landing page with navigation to tools | `src/app/page.tsx` |
| Root Layout | HTML shell, fonts, metadata | `src/app/layout.tsx` |
| Global Styles | Tailwind CSS, theme variables | `src/app/globals.css` |
| Next Config | Build and runtime configuration | `next.config.ts` |

## Pattern Overview

**Overall:** Next.js App Router with React Server Components

**Key Characteristics:**
- Server-first rendering by default (App Router)
- Client components use `"use client"` directive
- API routes in `src/app/api/` directory
- Path aliases: `@/*` maps to `./src/*`

## Layers

**UI Layer:**
- Purpose: User-facing pages and components
- Location: `src/app/`
- Contains: Pages (`page.tsx`), layouts (`layout.tsx`), styles (`globals.css`)
- Depends on: React, Next.js
- Used by: Browser client

**API Layer (Planned):**
- Purpose: Server-side endpoints for LLM integration
- Location: `src/app/api/`
- Contains: Route handlers (`route.ts`)
- Depends on: External LLM APIs (GLM)
- Used by: Frontend fetch calls

**Static Assets:**
- Purpose: Public files served directly
- Location: `public/`
- Contains: Images, icons

## Data Flow

### Page Request Path

1. **Browser request** → `http://localhost:3000/`
2. **Next.js routing** matches `src/app/page.tsx`
3. **Server component** renders and returns HTML
4. **Browser receives** complete page

### Planned API Flow (Bazi/Eat)

1. **User interaction** triggers client-side fetch
2. **Client component** calls `fetch('/api/bazi')` or `fetch('/api/eat')`
3. **API Route handler** (`src/app/api/*/route.ts`) receives request
4. **Server reads** `process.env.GLM_API_KEY`
5. **Server calls** GLM API (`https://api.z.ai/api/paas/v4`)
6. **Response returned** to client

### Planned Bazi Feature Flow

```
User Input (birthday) → Client calculates chart → /api/bazi → GLM interpretation → Report
     ↑                       (pure TS)                  ↑                   ↑
  Browser                   Frontend              Server reads key     LLM response
```

## Key Abstractions

**Route Handler:**
- Purpose: API endpoint for frontend
- Location: `src/app/api/[feature]/route.ts`
- Pattern: Async function handling GET/POST requests

**Page Component:**
- Purpose: Single page view
- Location: `src/app/[route]/page.tsx`
- Pattern: Default export React component

**Layout:**
- Purpose: Shared UI wrapper
- Location: `src/app/layout.tsx`
- Pattern: Nested layouts compose

## Entry Points

**Home Page:**
- Location: `src/app/page.tsx`
- Triggers: GET `/`
- Responsibilities: Display welcome, navigation links to `/bazi` and `/eat`

**Root Layout:**
- Location: `src/app/layout.tsx`
- Triggers: All page requests
- Responsibilities: HTML shell, font loading, metadata

**Next.js Config:**
- Location: `next.config.ts`
- Triggers: Build/start time
- Responsibilities: Framework configuration

## Architectural Constraints

- **Threading:** Node.js event loop (single-threaded by default)
- **Global state:** None detected (stateless server components)
- **Circular imports:** None detected
- **API Keys:** Server-side only via `process.env` (never exposed to client)

## Anti-Patterns

### No Anti-Patterns Detected

The codebase is minimal and follows standard Next.js App Router patterns correctly.

## Error Handling

**Strategy:** Not implemented yet (early stage)

**Patterns:**
- Error boundaries: Not yet implemented
- API error responses: Not yet implemented

## Cross-Cutting Concerns

**Logging:** Console.log for development (no production logger configured)

**Validation:** Not yet implemented

**Authentication:** Not yet implemented (planned: password/middleware approach)

---

*Architecture analysis: 2026-05-08*
