# Technology Stack — 八字命理工具

**Project:** 喵十七的工具箱 — v3.0 八字命理工具
**Researched:** 2026-05-11
**Confidence:** HIGH

---

## Recommended Stack Additions

### 1. Calendar & Bazi Computation

| Library | Version | Purpose | Why |
|---------|---------|---------|-----|
| **lunisolar** | `^2.6.0` | Gregorian↔Lunar conversion + Bazi 四柱计算 | Built-in `char8` provides year/month/day/hour pillars directly. Solar terms (节气) support. Actively maintained (Aug 2025). No plugin needed for basic Bazi. |

**lunisolar capabilities used:**
```typescript
import lunisolar from 'lunisolar'

const lsr = lunisolar('2024-02-10 14:30')
lsr.char8.toString()        // '壬寅 丁未 壬申 丁未'
lsr.char8.year.stem         // 壬 (Heavenly Stem)
lsr.char8.month.branch      // 未 (Earthly Branch)
lsr.solarTerm?.toString()   // 节气 if applicable
```

**For extended Bazi features (神煞, 十神, 纳音):**
```typescript
import lunisolar from 'lunisolar'
import char8ex from 'lunisolar/plugins/char8ex'
lunisolar.extend(char8ex)

const c8ex = lunisolar('2023-01-15 12:26').char8ex(1) // 1 = male
c8ex.year.stemTenGod.name   // 劫財
c8ex.year.gods.map(i => i.name) // ['文昌貴人', '金輿', ...]
```

**Decision:** Use `lunisolar` (no plugin) for MVP. Add `char8ex` plugin only if user requests 神煞/十神/纳音 analysis.

---

### 2. LLM Integration — Already Exists

Reuse existing chat module pattern:

| Package | Status | Notes |
|---------|--------|-------|
| `ai` | Already installed (^6.0.176) | streaming UI support |
| `@ai-sdk/react` | Already installed (^3.0.178) | `useChat` hook for streaming |
| `@ai-sdk/deepseek` | Already installed (^2.0.34) | DeepSeek model adapter |

**Integration:** Copy pattern from `src/app/chat/page.tsx` and `src/app/api/chat/`.

---

### 3. HTML Report Download — No New Library

Use native browser APIs:

```typescript
// No library needed — pure browser APIs
const html = `<html>...${reportContent}...</html>`
const blob = new Blob([html], { type: 'text/html' })
const url = URL.createObjectURL(blob)
const a = document.createElement('a')
a.href = url
a.download = `命理报告_${Date.now()}.html`
a.click()
URL.revokeObjectURL(url)
```

**Why not html2canvas/pdf:** The bazi-minimal used pandoc+chromium for CLI PDF generation. This is a web app — HTML download is sufficient and simpler.

---

### 4. Carousel/Rotating Text Animation — No New Library

Use CSS animations (already have Tailwind CSS 4):

```tsx
// Pure CSS animation, no library needed
<div className="animate-fade-in animate-fade-out animation-duration-[5000ms]">
  {jokes[currentIndex]}
</div>
```

Or implement a simple custom hook with `setInterval` and CSS transitions.

**Why not framer-motion:** Not in project, adds bundle size. Simple CSS suffices for rotating text.

---

## What NOT to Add

| Library | Why Not |
|---------|---------|
| **lunar-calendar** | Older (2014), less maintained. lunisolar is superior. |
| **chinese-lunar** | Limited features, older. lunisolar covers all needs. |
| **js-calendar-converter** | GPL license, larger bundle. lunisolar is MIT and more capable. |
| **pandoc / chromium** | CLI tools for PDF generation in bazi-minimal. Not applicable to web app. |
| **html2canvas / jspdf** | Overkill for HTML download. Native Blob API sufficient. |
| **framer-motion** | Adds bundle size. CSS animations sufficient for simple carousel. |
| **char8ex plugin** | Defer until user explicitly requests 神煞/十神/纳音 analysis. MVP uses only basic `char8`. |

---

## Complete Installation

```bash
# Single new dependency
npm install lunisolar

# Dev dependencies (if needed for char8ex later)
npm install -D @types/lunisolar
```

**Note:** lunisolar has 0 dependencies and works in Node.js, browsers, Edge Runtime, and Web Workers.

---

## Integration Points

### Existing Files to Reuse

| File | Purpose | Integration |
|------|---------|-------------|
| `src/app/chat/page.tsx` | Chat UI pattern | Copy streaming pattern for Bazi |
| `src/app/api/chat/route.ts` | DeepSeek API route | Copy and adapt for Bazi prompts |
| `src/components/ui/{Button,Card,Badge,Input}` | UI components | Use for Bazi form/report |
| `src/app/globals.css` | Design tokens | Already has 温暖极简 tokens |

### New Files to Create

| File | Purpose |
|------|---------|
| `src/app/bazi/page.tsx` | Main Bazi tool page |
| `src/app/api/bazi/route.ts` | Bazi API route (optional, or do client-side) |
| `src/components/bazi/BaziForm.tsx` | Input form (date/time, gender, name) |
| `src/components/bazi/BaziReport.tsx` | Report rendering |
| `src/components/bazi/JokeCarousel.tsx` | Rotating text animation |

---

## Sources

- [lunisolar npm](https://www.npmjs.com/package/lunisolar) — HIGH confidence
- [lunisolar GitHub](https://github.com/waterbeside/lunisolar) — HIGH confidence
- [Context7 lunisolar docs](https://context7.com/waterbeside/lunisolar) — HIGH confidence
- [char8ex plugin docs](https://github.com/waterbeside/lunisolar/blob/main/docs/char8ex.md) — HIGH confidence
