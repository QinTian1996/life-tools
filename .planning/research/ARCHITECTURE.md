# Architecture: 八字命理工具 (Bazi Feature)

**Domain:** Bazi (八字) fortune-telling tool with LLM-powered report generation
**Project:** life-tools (喵十七的工具箱)
**Date:** 2026-05-11
**Confidence:** HIGH (based on existing codebase analysis)

---

## Executive Summary

The Bazi feature integrates with the existing Next.js 16 + React 19 + Tailwind CSS 4 stack using a **form → API → report** data flow. The API route computes 四柱八字 (Four Pillars) and 大运 (Decade Luck Cycles), then generates dual-format reports (professional + plain-language) via DeepSeek LLM. The existing chat streaming pattern is **not reused** directly; instead, a non-streaming API route handles the longer Bazi report generation, while a separate client-side timer drives the "吐槽轮播" loading animation.

---

## Integration Points

### Existing Infrastructure to Reuse

| Component | Path | Reuse Pattern |
|-----------|------|---------------|
| PageLayout | `src/components/layout/PageLayout.tsx` | Wrap Bazi page content |
| SiteHeader | `src/components/layout/SiteHeader.tsx` | Already included in PageLayout |
| Button | `src/components/ui/Button.tsx` | Form submit button, download button |
| Card | `src/components/ui/Card.tsx` | Report container |
| Input | `src/components/ui/Input.tsx` | Form fields |
| Design tokens | `src/app/globals.css` | CSS variables for theming |
| DeepSeek API | `src/app/api/chat/route.ts` pattern | `@ai-sdk/deepseek` provider |

### New Files Required

```
src/
├── app/
│   ├── bazi/
│   │   └── page.tsx                    # Bazi page component
│   └── api/
│       └── bazi/
│           └── route.ts                # Bazi computation + LLM report API
├── components/
│   └── bazi/
│       ├── BaziForm.tsx                # Input form (birth date, time, gender, name)
│       ├── BaziReport.tsx              # Report display (scrollable)
│       ├── BaziLoading.tsx             # Loading animation (吐槽轮播)
│       └── BaziDownload.tsx             # HTML download button
└── lib/
    └── bazi/
        ├── calendar.ts                 # Gregorian ↔ Lunar conversion
        ├── calculator.ts                # 四柱排盘 + 大运计算
        └── prompt.ts                    # LLM prompt templates (专业版/详解版)
```

---

## Data Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           USER FLOW                                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌──────────┐     ┌──────────────┐     ┌─────────────────────────────┐  │
│  │  Form    │────▶│  API Route   │────▶│  Report State               │  │
│  │  Input   │     │  /api/bazi   │     │  (dual-format content)      │  │
│  └──────────┘     └──────────────┘     └─────────────────────────────┘  │
│       │                   │                           │                 │
│       │                   │                           ▼                 │
│       │                   │              ┌─────────────────────────┐     │
│       │                   │              │  BaziReport Component   │     │
│       │                   │              │  (scrollable main area) │     │
│       │                   │              └─────────────────────────┘     │
│       │                   │                           │                   │
│       │                   │                           ▼                   │
│       │                   │              ┌─────────────────────────┐     │
│       │                   │              │  Re-submit clears old  │     │
│       │                   │              │  report, shows form    │     │
│       │                   │              └─────────────────────────┘     │
│       │                   │                                                │
│       │                   ▼                                                │
│       │         ┌──────────────────┐                                      │
│       │         │   DeepSeek LLM   │                                      │
│       │         │  (streamText)     │                                      │
│       │         └──────────────────┘                                      │
│       │                   │                                                │
│       ▼                   ▼                                                │
│  ┌──────────────────────────────┐                                        │
│  │     BaziLoading State        │                                        │
│  │  • Input echo                │                                        │
│  │  • 四柱 display              │                                        │
│  │  • 吐槽轮播 (5s intervals)  │                                        │
│  └──────────────────────────────┘                                        │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

### API Route Design: `/api/bazi`

**Decision: Non-streaming API route**

Rationale:
- Bazi report is a long-form document (~2000-4000 tokens), not a conversation
- The "吐槽轮播" loading animation runs client-side via `setInterval`
- Server doesn't need to stream chunks; complete report in one response
- Simpler error handling and retry logic

**Request:**
```typescript
interface BaziRequest {
  birthDate: string;        // "1995-04-02" (Gregorian)
  birthTime: string;        // "09:30" (24-hour format)
  calendarType: "solar" | "lunar";
  gender: "male" | "female";
  name?: string;             // Optional, LLM generates if missing
}
```

**Response:**
```typescript
interface BaziResponse {
  // Computed Bazi data
  四柱: {
    年柱: string;  // e.g., "乙亥"
    月柱: string;  // e.g., "庚辰"
    日柱: string;  // e.g., "丙午"
    时柱: string;  // e.g., "甲午"
  };
  大运: Array<{ age: number; ganZhi: string }>;

  // LLM-generated reports
  reports: {
    professional: string;   // Markdown, full technical analysis
    plain: string;           // Markdown, plain language for普通人
  };

  // Metadata
  input: BaziRequest;
  generatedAt: string;
}
```

---

## Component Tree

```
src/app/bazi/page.tsx
├── PageLayout
│   └── BaziPage (client component, 'use client')
│       ├── State: { status: 'form' | 'loading' | 'report' }
│       ├── State: { formData, baziData, reports }
│       │
│       ├── [status === 'form']
│       │   └── BaziForm
│       │       ├── CalendarTypeToggle (公历/农历 switch)
│       │       ├── DateInput (date picker)
│       │       ├── TimeInput (time picker)
│       │       ├── GenderSelect (男/女)
│       │       ├── NameInput (optional)
│       │       └── SubmitButton → triggers API call + status change
│       │
│       ├── [status === 'loading']
│       │   └── BaziLoading
│       │       ├── InputEcho (回显用户输入)
│       │       ├── SiZhuDisplay (四柱初步结果)
│       │       └── TouCaoCarousel (吐槽轮播, setInterval-driven)
│       │
│       └── [status === 'report']
│           └── BaziReport
│               ├── ReportTabs (专业版 | 详解版)
│               ├── ReportContent (scrollable markdown)
│               ├── DownloadButton (HTML download)
│               └── NewAnalysisButton (重新分析 → status = 'form')
```

---

## State Management

### React State (useState, no external library needed)

```typescript
// Simple linear state machine
type Status = 'form' | 'loading' | 'report';

const [status, setStatus] = useState<Status>('form');
const [formData, setFormData] = useState<BaziRequest | null>(null);
const [baziResult, setBaziResult] = useState<BaziResponse | null>(null);
const [error, setError] = useState<string | null>(null);

// Flow:
// 1. User fills form → setFormData
// 2. Submit → setStatus('loading'), call API
// 3. API returns → setBaziResult, setStatus('report')
// 4. Re-submit → setStatus('form'), clear baziResult
```

**Why no Zustand/Redux:**
- Linear data flow (form → loading → report)
- No complex cross-component state sharing
- React state sufficient for this use case

---

## HTML Download: Server-Side Generation

**Decision: Generate HTML in API route, return as downloadable file**

```typescript
// In /api/bazi/route.ts
export async function POST(req: Request) {
  // 1. Compute 四柱 + 大运
  // 2. Generate reports via LLM (streamText, wait for completion)
  // 3. Convert markdown → HTML using simple transformer
  // 4. Return as Response with Content-Disposition header

  const html = generateHtmlReport(reports, metadata);

  return new Response(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Content-Disposition': `attachment; filename="八字报告_${name}_${date}.html"`,
    },
  });
}
```

**Alternative considered: Client-side Blob download**
- Rejected because server-side allows consistent styling via template
- The skill's pandoc workflow suggests server-side is the intended approach
- Simpler to debug and test

**HTML Template Strategy:**
- Use a simple HTML template with embedded CSS (warm minimalist theme)
- No external dependencies (no pandoc needed for HTML, only for PDF)
- 楷体/KaiTi font for headings, proper Chinese character support

---

## Loading Animation: Client-Side Timer

The "吐槽轮播" (joke rotation) runs client-side during the API call:

```typescript
// In BaziLoading component
const [currentJoke, setCurrentJoke] = useState(0);

useEffect(() => {
  const interval = setInterval(() => {
    setCurrentJoke((prev) => (prev + 1) % jokes.length);
  }, 5000);

  return () => clearInterval(interval);
}, []);
```

**Why client-side:**
- Timer doesn't need server coordination
- Creates smooth UX independent of API latency variance
- Allows fade-in/fade-out CSS transitions

---

## Calendar Conversion Utility

**Location:** `src/lib/bazi/calendar.ts`

**Requirements:**
- Gregorian → Lunar conversion
- Lunar → Gregorian conversion
- Solar term (节气) awareness for month boundaries

**Implementation approach:**
- Use `lunar-converter` or similar npm package if available
- Fallback: API calls to `nongli114.com` or `iamwanna.cn` (see skill doc)
- Solar term lookup table hardcoded (24 节气)

**Public API:**
```typescript
interface CalendarConverter {
  lunarToGregorian(year: number, month: number, day: number): Date;
  gregorianToLunar(date: Date): { year: number; month: number; day: number };
  getSolarTerm(year: number, month: number): string | null; // e.g., "立春"
  isLeapMonth(year: number, month: number): boolean;
}
```

---

## Bazi Calculator Core

**Location:** `src/lib/bazi/calculator.ts`

**Computations required:**
1. 四柱排盘 (年柱、月柱、日柱、时柱)
2. 大运计算 (起运年龄、顺逆排)
3. 十神判定
4. 调候计分

**Public API:**
```typescript
interface BaziCalculator {
  computeSiZhu(birthDate: Date, birthHour: number): SiZhu;
  computeDaYun(siZhu: SiZhu, gender: 'male' | 'female'): DaYun[];
  computeStrength(siZhu: SiZhu): StrengthAnalysis;
  computePattern(siZhu: SiZhu): PatternInfo;
}

interface SiZhu {
  年柱: { gan: string; zhi: string };
  月柱: { gan: string; zhi: string };
  日柱: { gan: string; zhi: string };
  时柱: { gan: string; zhi: string };
}

interface DaYun {
  age: number;
  ganZhi: string;
  startYear: number;
}
```

---

## LLM Prompt Strategy

**Location:** `src/lib/bazi/prompt.ts`

Follow the skill's dual-report standard:

```typescript
const SYSTEM_PROMPT = `你是一个专业的八字命理分析师，使用陆致极四视角框架和韦千里八步法进行分析。...`;

const professionalReportPrompt = (baziData, userProfile) => `
[四柱信息]
${baziData.四柱}

[用户信息]
性别: ${userProfile.gender}
${userProfile.name ? `姓名: ${userProfile.name}` : ''}

请生成专业版报告，...
`;

const plainReportPrompt = (baziData, userProfile) => `
...
请生成详解版报告，用通俗易懂的语言，...
`;
```

**API call:**
```typescript
const result = streamText({
  model: deepseek('deepseek-v4-flash'),
  system: SYSTEM_PROMPT,
  prompt: reportPrompt,
  maxOutputTokens: 4000,
});
// Wait for completion, return full text (non-streaming to client)
```

---

## Build Order

### Phase 1: Foundation (Low Risk)

1. **Calendar utility** (`src/lib/bazi/calendar.ts`)
   - Pure function, no side effects
   - Easy to test in isolation
   - No UI dependencies

2. **Bazi calculator** (`src/lib/bazi/calculator.ts`)
   - Core computation logic
   - Can be unit tested with known examples from skill doc
   - No external dependencies

3. **API route skeleton** (`src/app/api/bazi/route.ts`)
   - Input validation
   - Error handling
   - Stub response until LLM integrated

### Phase 2: UI Shell

4. **Bazi page** (`src/app/bazi/page.tsx`)
   - PageLayout wrapper
   - Status state machine
   - Form/Loading/Report conditional rendering

5. **BaziForm component** (`src/components/bazi/BaziForm.tsx`)
   - All input fields
   - Validation
   - Submit handler (calls API, sets status)

### Phase 3: Loading & Report

6. **BaziLoading component** (`src/components/bazi/BaziLoading.tsx`)
   - Input echo display
   - 吐槽轮播 animation
   - 四柱 display after calculation

7. **BaziReport component** (`src/components/bazi/BaziReport.tsx`)
   - Tab switching (专业版/详解版)
   - Scrollable content area
   - Markdown rendering

8. **HTML download** (`src/components/bazi/BaziDownload.tsx`)
   - Download button
   - Server-side HTML generation in API route

### Phase 4: LLM Integration

9. **Prompt templates** (`src/lib/bazi/prompt.ts`)
   - System prompt
   - Professional report prompt
   - Plain language report prompt

10. **Full API route** with LLM calls
    - Compute Bazi
    - Generate both reports
    - Return combined response

---

## Key Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| API streaming | Non-streaming | Long-form report, simpler error handling |
| State management | React useState | Linear flow, no complex state sharing needed |
| HTML generation | Server-side | Consistent styling, easier testing |
| Calendar conversion | npm package + fallback | `lunar-converter` or similar |
| LLM provider | DeepSeek (existing) | Same as chat feature, consistent |
| Loading animation | Client-side timer | Independent of API latency |

---

## Anti-Patterns to Avoid

### Don't Reuse Chat's Streaming Pattern Directly

The existing `/api/chat` route uses `streamText().toUIMessageStreamResponse()` for conversational streaming. Bazi reports are:
- Single long response, not a back-and-forth
- Require post-processing (dual-format splitting)
- Need to compute Bazi before LLM call

**Instead:** Use `streamText()` but await the full result before returning.

### Don't Put Calendar Logic in UI Components

Calendar conversion (Gregorian ↔ Lunar) is complex and testable in isolation. Keep in `src/lib/bazi/calendar.ts`, not in the Form component.

### Don't Generate HTML Client-Side

Client-side HTML generation leads to inconsistent styling and harder debugging. Generate on server in API route.

---

## Scalability Considerations

| Scale | Concern | Approach |
|-------|---------|----------|
| 10 users/day | None | Current design handles easily |
| 100 users/day | API rate limits | DeepSeek rate limiting awareness |
| 1000 users/day | Cost | Token usage monitoring |
| Concurrent requests | LLM context | Single streamText call per request |

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| API route design | HIGH | Clear requirements, existing patterns to follow |
| Component structure | HIGH | Follows existing project conventions |
| State management | HIGH | Simple linear flow, React state sufficient |
| Calendar conversion | MEDIUM | Need to verify npm package availability |
| LLM integration | HIGH | Same provider as existing chat feature |
| HTML download | MEDIUM | Server-side approach, need to implement template |

---

## Open Questions

1. **Calendar library:** Need to verify `lunar-converter` or similar package works with Next.js 16
2. **Loading duration:** How long does LLM report generation typically take? May need skeleton screens
3. **Error handling:** What happens if LLM fails mid-generation? Need retry logic
4. **Download format:** User requested HTML, but skill mentions PDF. Should both be offered?
