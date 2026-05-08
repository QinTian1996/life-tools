# Codebase Structure

**Analysis Date:** 2026-05-08

## Directory Layout

```
life-tools/
├── .next/               # Next.js build output (generated)
├── .planning/           # GSD planning documents
│   └── codebase/        # Codebase analysis docs
├── docs/                # Project documentation
├── node_modules/        # Dependencies
├── public/              # Static assets (favicon, images)
├── src/                  # Source code
│   └── app/              # Next.js App Router
│       ├── globals.css   # Global styles + Tailwind
│       ├── layout.tsx     # Root layout
│       ├── page.tsx       # Home page
│       └── favicon.ico    # Site favicon
├── .env*                # Environment variables (NOT committed)
├── eslint.config.mjs     # ESLint configuration
├── next.config.ts        # Next.js configuration
├── package.json           # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── README.md              # Project readme
```

## Directory Purposes

**`.next/`:**
- Purpose: Build artifacts and cached data
- Contains: Compiled output, SWC caches
- Generated: Yes (by `next build`)
- Committed: No (gitignored)

**`.planning/`:**
- Purpose: GSD workflow planning and analysis
- Contains: ROADMAP.md, phase plans, codebase docs
- Location: Project root

**`docs/`:**
- Purpose: Project documentation and ADRs
- Contains: Architecture decisions, guides
- Key files: `docs/architecture.md`

**`node_modules/`:**
- Purpose: Installed npm packages
- Contains: Next.js, React, Tailwind, TypeScript, etc.
- Generated: Yes (by `npm install`)
- Committed: No (gitignored)

**`public/`:**
- Purpose: Static assets served directly
- Contains: favicon.ico, images
- Access: `/favicon.ico` maps to `public/favicon.ico`

**`src/`:**
- Purpose: All application source code
- Contains: App Router pages, components, utilities
- Location: TypeScript source root (`@/*` alias)

**`src/app/`:**
- Purpose: Next.js App Router structure
- Contains: Pages, layouts, API routes, styles
- Pattern: File-system-based routing

## Key File Locations

**Entry Points:**
- `src/app/page.tsx`: Home page (`/`)
- `src/app/layout.tsx`: Root layout (all pages)
- `next.config.ts`: Framework configuration

**Configuration:**
- `package.json`: Dependencies and npm scripts
- `tsconfig.json`: TypeScript compiler options
- `eslint.config.mjs`: Linting rules
- `postcss.config.mjs`: PostCSS/Tailwind configuration

**Core Logic:**
- `src/app/page.tsx`: Home page component (currently the only page)

**Testing:**
- No test directory or test files detected

## Naming Conventions

**Files:**
- PascalCase for React components: `page.tsx`, `layout.tsx`
- kebab-case for directories: `src/app/`, `src/app/api/`
- camelCase for utilities and helpers (when added)

**Directories:**
- kebab-case: `src/app/`, `public/`
- No prefix/suffix convention detected

**TypeScript/React:**
- Files: `*.tsx` for React components, `*.ts` for utilities
- Components: PascalCase function names
- Functions: camelCase

## Where to Add New Code

**New Feature/Page:**
- Primary code: `src/app/[feature-name]/page.tsx`
- Example: `src/app/bazi/page.tsx` for 八字 feature
- Tests: `__tests__/` directory (when added)

**New API Route:**
- Implementation: `src/app/api/[feature]/route.ts`
- Example: `src/app/api/bazi/route.ts` for Bazi API

**New Shared Component:**
- Implementation: `src/components/` (create when needed)

**New Utility/Helper:**
- Implementation: `src/lib/` or `src/utils/` (create when needed)

**Global Styles:**
- `src/app/globals.css`: Tailwind imports and CSS custom properties

## Special Directories

**`.next/`:**
- Purpose: Next.js build output
- Generated: Yes
- Committed: No (.gitignore)

**`public/`:**
- Purpose: Static file serving
- Access: Files directly accessible at root URL
- Example: `public/favicon.ico` → `/favicon.ico`

**API Routes (planned structure):**
```
src/app/api/
├── bazi/
│   └── route.ts      # POST /api/bazi
└── eat/
    └── route.ts      # POST /api/eat
```

---

*Structure analysis: 2026-05-08*
