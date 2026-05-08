# Technology Stack

**Analysis Date:** 2026-05-08

## Languages

**Primary:**
- TypeScript 5 - All source code (`src/`, `app/`)
- CSS (Tailwind CSS v4 with PostCSS)

**Secondary:**
- None detected

## Runtime

**Environment:**
- Node.js (managed via Next.js)

**Package Manager:**
- npm 10+ (lockfile: `package-lock.json` present)

## Frameworks

**Core:**
- Next.js 16.2.6 - React framework for production builds and dev server
- React 19.2.4 - UI library

**Styling:**
- Tailwind CSS 4 - Utility-first CSS framework
- PostCSS - CSS transformation (via `@tailwindcss/postcss`)

**Testing:**
- Not detected

**Build/Dev:**
- ESLint 9 - Linting with `eslint-config-next`
- TypeScript compiler - Strict mode enabled (`strict: true`)

## Key Dependencies

**Critical:**
- `next` 16.2.6 - Framework core
- `react` 19.2.4 - UI library
- `react-dom` 19.2.4 - React DOM renderer

**Infrastructure:**
- `tailwindcss` 4 - Styling
- `typescript` 5 - Type safety
- `eslint-config-next` 16.2.6 - Next.js linting rules

## Configuration

**Environment:**
- `.env*` - Not detected (no environment files present)
- Next.js config: `next.config.ts`

**Build:**
- TypeScript: `tsconfig.json` (target ES2017, path alias `@/*` → `./src/*`)
- ESLint: `eslint.config.mjs` (Next.js core-web-vitals + TypeScript rules)
- PostCSS: `postcss.config.mjs` (Tailwind CSS plugin)

## Platform Requirements

**Development:**
- Node.js 20+ (peer dep)
- npm 10+

**Production:**
- Node.js 20+ for build
- Edge-compatible (Next.js default)

---

*Stack analysis: 2026-05-08*
