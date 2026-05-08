# Coding Conventions

**Analysis Date:** 2026-05-08

## Naming Patterns

**Files:**
- React components: `PascalCase.tsx` (e.g., `page.tsx`, `layout.tsx`)
- Config files: `camelCase.config.ts` or `kebab-case.config.mjs`
- TypeScript files: `PascalCase.ts` for types, `camelCase.ts` for utilities

**Directories:**
- `app/` - Next.js App Router pages
- Use path aliases: `@/*` maps to `./src/*`

**Functions/Components:**
- React components: `PascalCase` (default exports)
- Hooks: `camelCase` with `use` prefix (e.g., `useState`)
- Utility functions: `camelCase`

## Code Style

**Formatting:**
- Tool: ESLint with `eslint-config-next` (includes Next.js core web vitals rules + TypeScript)
- Tailwind CSS 4 with `@import "tailwindcss"` and `@theme inline` pattern
- No Prettier config detected

**Indentation:** TypeScript standard (2 spaces typical)

**Key ESLint Rules (from `eslint-config-next`):**
- `next/core-web-vitals` - Core web vitals compliance
- `next/typescript` - TypeScript specific rules

## Import Organization

**Order:**
1. Next.js built-ins (`next/font`, `next/image`, etc.)
2. React/React DOM imports
3. External libraries
4. Internal path aliases (`@/*`)
5. Relative imports

**Example:**
```typescript
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
```

**Quotes:** Double quotes for imports and strings

## Error Handling

**Patterns:**
- Not extensively observed in minimal codebase
- TypeScript strict mode enabled (`"strict": true` in tsconfig.json)

**Validation:**
- TypeScript strict checking enforced at build time

## Logging

**Framework:** Console only (no logging library detected)

**Patterns:**
- Minimal logging in current codebase

## Comments

**When to Comment:**
- JSDoc for exported functions/components when needed
- No explicit commenting convention observed

## Function Design

**Component Functions:**
- Default exports
- Arrow function or `function` keyword syntax
- Parameters typed with `Readonly<{ ... }>` for props

**Example:**
```typescript
export default function Home() {
  return (
    <main>...</main>
  );
}
```

## Module Design

**Exports:**
- Default exports for page components
- Named exports for utility functions/types

**Barrel Files:** Not used (minimal codebase)

## TypeScript Conventions

**Strict Mode:** Enabled
```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

**Path Aliases:**
```json
{
  "paths": {
    "@/*": ["./src/*"]
  }
}
```

**JSX:** `react-jsx` transform (React 17+ new JSX transform)

---

*Convention analysis: 2026-05-08*
