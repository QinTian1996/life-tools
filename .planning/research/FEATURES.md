# Feature Landscape: 八字命理工具

**Domain:** Bazi (八字) divination web tool
**Researched:** 2026-05-11
**Overall confidence:** HIGH

---

## Executive Summary

A Bazi analysis web tool that transforms birth data (date/time, gender, optional name) into AI-generated fortune reports. The core experience is: user inputs birth details → sees loading animation with their computed 八字 chart and rotating commentary → receives a scrollable dual-version report (专业版 + 详解版) → can download as self-contained HTML. The tool leverages existing DeepSeek API infrastructure from the `/chat` module and follows the warm-minimalist design language established in v2.0.

---

## 1. Calendar UX

### 1.1 Date Input Modes

| Mode | Behavior | Implementation |
|------|----------|----------------|
| **公历 (Gregorian)** | Standard date picker, default | `<input type="date">` with locale formatting |
| **农历 (Lunar)** | Lunar date picker with month/year/day | Requires conversion library (see Lunar Conversion below) |

#### Lunar Conversion Requirements

**Critical technical challenge:** Converting lunar dates to Gregorian for Bazi computation.

- **Best source:** `nongli114.com` — search format `"乙亥(1995)年四月初二"`, description field gives Gregorian directly
- **Backup:** HK Observatory PDF calendar, web search
- **API option:** `https://www.iamwawa.cn/nongli/api/?type=lunar&year=1995&month=4&day=2` (may have limited access)
- **Always verify** with at least two sources when possible
- **腊月 edge case:** 2001年腊月 = 公历 2002年1月左右, NOT 2001年12月

**Recommendation:** Use a lunar calendar library like `lunar-calendar` or `chinese-calendar` for client-side conversion, with nongli114.com as fallback for edge cases.

### 1.2 Time Input

| Field | Range | Notes |
|-------|-------|-------|
| **时辰 (Hour)** | 子时(23-01), 丑时(01-03), ... 亥时(21-23) | 12时辰, 2-hour blocks |
| **Precision** | Select from dropdown, not free text | Avoids invalid times |

**时辰 Selector UX:**
- Dropdown with Chinese names: 子时, 丑时, 寅时, 卯时, 辰时, 巳时, 午时, 未时, 申时, 酉时, 戌时, 亥时
- Each shows time range: 子时 (23:00-00:59)
- Default: none selected (required field)

### 1.3 Gender Selection

| Gender | Required | UI |
|--------|----------|-----|
| 男 (Male) | ✅ Yes | Radio button or segmented control |
| 女 (Female) | ✅ Yes | Radio button or segmented control |

**Critical:** Gender affects 大运 direction (顺排/逆排) and 六亲 analysis. Cannot be optional.

### 1.4 Name Input

| Behavior | Implementation |
|----------|----------------|
| Optional | Empty input shows placeholder |
| LLM-generated default | If empty, generate as `⟨形容词⟩的⟨动物⟩` e.g., "悠闲的狐狸" |
| Passed to LLM | So report can address user directly |

### 1.5 Form Validation

| Field | Validation | Error Message |
|-------|------------|---------------|
| Date | Valid date, not in future (except today) | "出生日期不能是未来" |
| 时辰 | Must select one | "请选择出生时辰" |
| Gender | Must select one | "请选择性别" |
| Name | Max 20 characters if provided | "姓名最多20字" |

---

## 2. Loading State

### 2.1 What to Show During LLM Generation (30-60s wait)

The loading state must be engaging, not a blank screen. Per the milestone context:

**Three-layer loading display:**

| Layer | Content | Timing |
|-------|---------|--------|
| **1. Input echo** | "乙亥年四月初二 巳时 | 男" | Immediate |
| **2. Computed 八字 chart** | 年柱 月柱 日柱 时柱 with stems/branches | Fades in after 1s |
| **3. Rotating roasts** | 吐槽轮播，渐入渐出 5s/条 | Starts immediately, cycles |

### 2.2 八字 Chart Display

```
年柱: 乙亥 (木水)    月柱: 辛巳 (金火)    日柱: 己未 (土土)    时柱: 乙巳 (木火)
```

**Styling:** Monospace or tabular numbers, clear stem-branch pairing, element color hints (optional).

### 2.3 Rotating Commentary (吐槽)

**Content:** Humorous or insightful one-liners about the 八字 being computed. Examples:
- "这八字...说实话，我算过更难的"
- "让我看看...哦豁，这个有意思"
- "等等，让我确认一下这个格局"

**Timing:** Each comment: 5s fade-in-out, cycles through 5-10 pre-loaded options.

**Animation:** CSS transition with opacity, centered below 八字 chart.

### 2.4 Loading State UX Rules

1. **Never block input** — show input values clearly so user knows what was submitted
2. **Show progress** — computed chart validates the system is working
3. **Entertain** — 30-60s is long; roasts reduce abandonment
4. **No spinner-only** — feels broken at this wait time

---

## 3. Report Rendering

### 3.1 Dual-Report Structure

The tool produces **two versions simultaneously**, per the bazi-minimal workflow:

#### 版本 A: 专业版 (Professional)

| Section | Content | Style |
|---------|---------|-------|
| **Header** | 姓名(若提供), 性别, 出生年月时辰 | Simple |
| **引言** | `四柱推演，三用合一。字字有据，不求惊人。` | Italic |
| **四柱表格** | 年柱 月柱 日柱 时柱 with 天干地支 | Table |
| **四视角分析** | 强弱/调候/格局/形象 | Headings |
| **八步法细化** | 逐干逐支、神煞纳音、十干败亡诗 | Mixed |
| **大运表** | 起运年龄, 10步大运 | Table |
| **用神喜忌表** | 五行喜忌 | Table |
| **结论** | Plain language summary | Paragraph |

#### 版本 B: 详解版 (Plain Language)

| Section | Content | Style |
|---------|---------|-------|
| **Header** | Same basic info | Simple |
| **引言** | `不设门槛，不论根基。卷中每词皆有解。` | Italic |
| **性格解读** | What kind of person is this? | Lead section |
| **运势节奏** | How does fortune flow? | Narrative |
| **方向建议** | What should they do? | Actionable |
| **总结** | One-sentence plain language | Bold |

### 3.2 Report Styling

**Typography:**
- Headings: LXGW WenKai (楷体风格), warm serif feel
- Body: LXGW WenKai or system serif
- Tables: Clear borders, alternating row colors (subtle amber tint)

**Colors:**
- Primary: `#8B0000` (deep red) for section markers
- Background: warm off-white (`#fafaf8`)
- Text: `#1a1a1a` (soft black)
- Accent: amber/warm-stone scale from v2.0 design tokens

**Layout:**
- Max-width: ~720px for readability
- Generous line-height (1.9)
- 2em text-indent for paragraphs (formal feel)
- Section dividers: subtle horizontal rules

### 3.3 Report Display Rules

1. **Scrollable** — report area takes remaining viewport height
2. **Bottom input bar** — stays visible for re-submission
3. **Tab toggle** — switch between 专业版/详解版 without scrolling
4. **Re-submit clears** — new submission replaces previous report entirely

---

## 4. Download Experience

### 4.1 HTML Report Download

**Trigger:** "下载报告" button, prominent but not blocking.

**File format:** Self-contained HTML (no external dependencies).

**Filename:** `八字报告_{姓名}_{日期}.html` or `八字报告_{公历日期}.html` if no name.

**Implementation:**
```javascript
// Generate self-contained HTML with inline styles (from report-template.html)
const blob = new Blob([htmlContent], { type: 'text/html' });
const url = URL.createObjectURL(blob);
window.open(url) or trigger download
```

### 4.2 HTML Template Requirements

From `bazi-minimal/templates/report-template.html`:

| Element | Style |
|---------|-------|
| Page | A4, 2cm margins |
| H1 | 楷体, 26pt, centered, `#8B0000`, letter-spacing 6px |
| H2 | Left border 4px solid `#8B0000`, light gray background |
| Tables | Full width, `#999` borders, `#f0f0f0` header |
| Signature | `—— 喵十七` right-aligned |
| Footer | `以上内容仅供了解命理文化参考` centered, gray |

### 4.3 Download UX

| Aspect | Behavior |
|--------|----------|
| **Button state** | Disabled until report is loaded |
| **Feedback** | Brief "正在生成下载..." state |
| **File opens** | In new tab OR downloads based on browser preference |
| **Content** | Both 专业版 and 详解版 in one HTML, separated by page break or clear dividers |

---

## 5. Input State Management

### 5.1 Form State

| State | Behavior |
|-------|----------|
| **Initial** | Empty form, placeholders visible |
| **Filled** | Values retained until cleared |
| **Re-submit** | Clears previous report, resets loading state |
| **Validation error** | Highlight invalid fields, show message |

### 5.2 Re-submit Flow

```
User submits → Loading state starts → Previous report cleared from DOM
→ New report renders → Download button enabled
```

### 5.3 Edge Cases

| Case | Handling |
|------|----------|
| **Unknown 时辰** | User selects "不确定" option. Report notes ⚠️ 时柱信息缺失，桃花/事业/晚运部分不确定 |
| **Same八字 different命运** | Report notes: "时柱为信息盲区，同八字者因时柱不同而命运差异" |
| **Future birth date** | Validation error, cannot submit |
| **API failure** | Show error state: "分析失败，请重试" with retry button |
| **Very long report** | Virtualized scrolling not needed; standard overflow-scroll is fine |

---

## 6. Feature Priority Matrix

### Table Stakes (Must Have)

| Feature | Why Expected | Complexity |
|---------|--------------|------------|
| Gregorian date input | Primary mode for most users | Low |
| Gender selection | Required for 大运 direction + 六亲 | Low |
| Loading animation | 30-60s wait needs engagement | Medium |
| Report rendering | Core output | Medium |
| HTML download | Takeaway value | Low |
| Re-submit clears | Expected behavior | Low |

### Differentiators (Valued)

| Feature | Value Proposition | Complexity |
|---------|---------------------|------------|
| Lunar date input | Full lunar calendar support | High |
| 八字 chart during load | Shows computation is working | Low |
| Rotating 吐槽 | Entertainment during wait | Low |
| Dual-report toggle | Serves both experts and novices | Medium |
| LLM-generated name | Delightful default | Low |
| Warm-minimalist design | Cohesive with project brand | Low |

### Anti-Features (Explicitly Avoid)

| Anti-Feature | Why Avoid | Instead |
|--------------|-----------|---------|
| PDF download | Chromium dependency, complex pipeline | HTML download is self-contained |
| User accounts | No auth planned | Anonymous use |
| Mobile app | Web-first, desktop only | Responsive web |
| Multi-model switching | Single DeepSeek model | Focus on quality of one |

---

## 7. Component Inventory

### 7.1 Input Components

| Component | States | Notes |
|-----------|--------|-------|
| **DatePicker** | default, focused, filled, error | Gregorian mode |
| **LunarDatePicker** | default, focused, filled, error | With lunar month/year/day |
| **CalendarModeToggle** | 公历 selected, 农历 selected | Switches between modes |
| **TimeSelector** | default, open, selected | 时辰 dropdown |
| **GenderSelector** | none, male, female | Required |
| **NameInput** | empty, filled, error | Optional, max 20 chars |

### 7.2 Display Components

| Component | States | Notes |
|-----------|--------|-------|
| **LoadingState** | active | Input echo + 八字 chart + rotating 吐槽 |
| **ReportView** | professional, plain | Tab toggle between versions |
| **ReportSection** | default | H2 + content structure |
| **DataTable** | default | 五行喜忌, 大运, etc. |
| **DownloadButton** | disabled, enabled, loading | Ready when report exists |

### 7.3 Layout Components

| Component | Purpose |
|-----------|---------|
| **SiteHeader** | Dark brand bar (existing from v2.0) |
| **PageLayout** | Unified page wrapper (existing from v2.0) |
| **BaziPageLayout** | Input at top, scrollable report middle, bottom input bar |
| **InputBar** | Fixed at bottom, always visible for re-submit |

---

## 8. Technical Dependencies

### 8.1 New Dependencies

| Library | Purpose | Version |
|---------|---------|---------|
| `lunar-calendar` or similar | Lunar ↔ Gregorian conversion | Latest |
| `dayjs` (if not already) | Date manipulation | Latest |

### 8.2 Existing Reuse

| Module | Source |
|--------|--------|
| DeepSeek API route | `src/app/api/chat/` |
| AI SDK (useChat) | From `/chat` implementation |
| Design tokens | `globals.css` from v2.0 |
| UI components | `src/components/ui/` (Button, Card, Badge, Input) |
| SiteHeader, PageLayout | `src/components/layout/` |

---

## 9. Sources

- `.planning/PROJECT.md` — Project context, constraints, v2.0 design system
- `bazi-minimal/SKILL.md` — Bazi analysis methodology (陆致极 + 韦千里), dual-report format
- `bazi-minimal/rules/三部曲核心框架.md` — Framework details
- `bazi-minimal/templates/report-template.html` — HTML report styling template
