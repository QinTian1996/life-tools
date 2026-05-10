# 喵十七的工具箱 — 设计 Token 规范

**版本:** v2.0
**创建:** 2026-05-09
**基于:** `.planning/design-philosophy.md`（设计理念文档）
**下游:** Phase 5 CSS 实现 & 组件库

---

## 色彩体系

### 原始色（Primitives）

所有原始色使用 **OKLCH** 色彩空间。Oklch 提供感知均匀性——等步长的 L（亮度）变化在视觉上产生等步长的亮度差异。

#### Amber（主色 — 暖琥珀）

色相 ~85°，作为主要的交互色和强调色。

| Token | Oklch | 用途 |
|-------|-------|------|
| `amber-50` | `oklch(0.98 0.02 85)` | 最浅背景、hover 浮层 |
| `amber-100` | `oklch(0.95 0.04 85)` | 浅背景 |
| `amber-200` | `oklch(0.90 0.08 85)` | 柔和强调 |
| `amber-300` | `oklch(0.85 0.12 85)` | 高亮、标签 |
| `amber-400` | `oklch(0.80 0.16 85)` | **暗色模式主色**、亮色模式 accent |
| `amber-500` | `oklch(0.72 0.18 85)` | **亮色模式主色** |
| `amber-600` | `oklch(0.60 0.15 85)` | Hover 加深 |
| `amber-700` | `oklch(0.50 0.12 85)` | Active 按压态 |
| `amber-800` | `oklch(0.40 0.08 85)` | 深色背景上的文字 |
| `amber-900` | `oklch(0.30 0.05 85)` | 最深色（少用） |

#### Warm Stone（辅色 — 暖石灰）

色相 ~50°，作为中性色和背景色体系。暖色底色，不是冷灰。

| Token | Oklch | 用途 |
|-------|-------|------|
| `warm-stone-50` | `oklch(0.98 0.01 50)` | **亮色模式页面底色** |
| `warm-stone-100` | `oklch(0.96 0.01 50)` | 亮色模式次要表面 |
| `warm-stone-200` | `oklch(0.92 0.02 50)` | 亮色模式边框 |
| `warm-stone-300` | `oklch(0.85 0.03 50)` | 亮色模式 disabled 态 |
| `warm-stone-400` | `oklch(0.70 0.02 50)` | 过渡色（少用） |
| `warm-stone-500` | `oklch(0.55 0.02 50)` | Muted 文字（亮色） |
| `warm-stone-600` | `oklch(0.42 0.02 50)` | 过渡色（少用） |
| `warm-stone-700` | `oklch(0.35 0.02 50)` | 次要文字（亮色）、暗色边框 |
| `warm-stone-800` | `oklch(0.25 0.01 50)` | **暗色模式表面色** |
| `warm-stone-900` | `oklch(0.18 0.01 50)` | **暗色模式底色**（非纯黑！） |

### 语义色（Semantics）

语义色用于定义"用途"而非"具体颜色值"。亮色和暗色模式使用**同一套语义 token**，但底层映射到不同的原始色。

#### 亮色模式 (Light Mode)

| Token | 值 | 用途 |
|-------|-----|------|
| `background` | `warm-stone-50` | 页面背景 |
| `foreground` | `warm-stone-900` | 主要文字 |
| `primary` | `amber-500` | 主要交互元素 |
| `primary-foreground` | `warm-stone-50` | primary 上的文字 |
| `secondary` | `warm-stone-100` | 次要表面 |
| `secondary-foreground` | `warm-stone-700` | 次要表面上的文字 |
| `muted` | `warm-stone-100` | 柔和背景 |
| `muted-foreground` | `warm-stone-500` | 柔和文字 |
| `accent` | `amber-400` | 强调色 |
| `accent-foreground` | `warm-stone-900` | 强调色上的文字 |
| `card` | `warm-stone-50` | 卡片背景 |
| `card-foreground` | `warm-stone-900` | 卡片文字 |
| `border` | `warm-stone-200` | 边框、分割线 |
| `input` | `warm-stone-200` | 输入框边框 |
| `ring` | `amber-400` | Focus ring |
| `destructive` | `oklch(0.55 0.2 25)` | 错误/危险操作 |
| `destructive-foreground` | `warm-stone-50` | destructive 上的文字 |
| `success` | `oklch(0.50 0.15 145)` | 成功/确认状态 |
| `success-foreground` | `warm-stone-50` | success 上的文字 |

#### 暗色模式 (Dark Mode)

暗色模式**不使用纯黑**。使用 warm-stone-900 (~L=0.18) 作为底色——肉眼可见是"暗"的，但保留了暖色调。表面层级通过亮度递增来区分（暗处越亮的表面越"高"）。

| Token | 值 | 用途 | 变化说明 |
|-------|-----|------|----------|
| `background` | `warm-stone-900` | 页面背景 | 50→900，亮→暗 |
| `foreground` | `warm-stone-100` | 主要文字 | 900→100，暗→亮 |
| `primary` | `amber-400` | 主要交互元素 | **amber 向亮偏移 1 级** |
| `primary-foreground` | `warm-stone-900` | primary 上的文字 | 50→900 |
| `secondary` | `warm-stone-800` | 次要表面 | 100→800 |
| `secondary-foreground` | `warm-stone-300` | 次要表面上的文字 | 700→300 |
| `muted` | `warm-stone-800` | 柔和背景 | 100→800 |
| `muted-foreground` | `warm-stone-400` | 柔和文字 | 500→400 |
| `accent` | `amber-500` | 强调色 | 400→500 |
| `accent-foreground` | `warm-stone-50` | 强调色上的文字 | 900→50 |
| `card` | `warm-stone-800` | 卡片背景 | 50→800 |
| `card-foreground` | `warm-stone-100` | 卡片文字 | 900→100 |
| `border` | `warm-stone-700` | 边框 | 200→700 |
| `input` | `warm-stone-700` | 输入框边框 | 200→700 |
| `ring` | `amber-400` | Focus ring | 不变 |
| `destructive` | `oklch(0.65 0.18 25)` | 错误/危险 | L 向亮偏移 0.1 |
| `destructive-foreground` | `warm-stone-50` | destructive 上的文字 | 不变 |
| `success` | `oklch(0.60 0.12 145)` | 成功/确认 | L 向亮偏移 0.1 |
| `success-foreground` | `warm-stone-50` | success 上的文字 | 不变 |

**暗色模式表面层级逻辑：**
```
background (stone-900, L=0.18) ← 最深，页面底
card      (stone-800, L=0.25) ← 卡片"浮"在底上
secondary (stone-800, L=0.25) ← 同 card
border    (stone-700, L=0.35) ← 边框更亮，可见
muted-fg  (stone-400, L=0.70) ← 文字清晰可读
foreground (stone-100, L=0.96) ← 主文字接近白色
```

### 品牌栏配色

| 模式 | 背景 | 文字 | 特效 |
|------|------|------|------|
| 亮色 | `amber-500` | `warm-stone-50` | — |
| 暗色 | `rgba(28,25,23,0.85)` | `warm-stone-100` | `backdrop-filter: blur(12px)` |

暗色模式品牌栏：半透明暖灰底色 + 毛玻璃模糊。底下内容隐约可见但不分散注意力。参考 macOS 顶栏效果。

---

## 排版体系

### 字体族

| Token | 字体 | Fallback | 用途 | 调性 |
|-------|------|----------|------|------|
| `font-brand` | 霞鹜文楷等宽 (LxgwWenKai Mono) | `system-ui, sans-serif` | 品牌名、标题、轻松文本 | 温暖、手写感 |
| `font-mono` | 更纱等距黑体 (Sarasa Gothic Mono SC) | `ui-monospace, monospace` | 代码、技术内容、严肃文本 | 清晰、专业 |

### 字体安装

**霞鹜文楷等宽** — npm 安装：
```bash
npm install @fontsource/lxgw-wenkai
```
在 `app/layout.tsx` 中导入：
```typescript
import "@fontsource/lxgw-wenkai/400.css";
import "@fontsource/lxgw-wenkai/700.css";
```

**更纱等距黑体** — 从 GitHub Releases 下载 TTF 后使用 `next/font/local`：
```bash
# 下载 SarasaMonoSC-TTF-Unhinted-*.7z
# 解压到 public/fonts/SarasaMonoSC/
```
```typescript
// app/fonts.ts
import localFont from "next/font/local";

export const sarasaMono = localFont({
  src: "./fonts/SarasaMonoSC/SarasaMonoSC-Regular.ttf",
  variable: "--font-sarasa-mono",
  display: "swap",
  preload: false,
  fallback: ["ui-monospace", "monospace"],
});
```

**⚠️ 生产环境注意事项：** CJK 字体文件极大（霞鹜文楷 ~53MB，更纱等距 ~48MB）。上线前应考虑 subsetting（提取仅需要的字符集），可将体积缩减到 2-5MB。使用 `fonttools pyftsubset` 或 Cloudflare Fonts。
```bash
pip install fonttools brotli
pyftsubset SarasaMonoSC-Regular.ttf \
  --unicodes="U+0000-00FF,U+3000-303F,U+4E00-9FFF,U+FF00-FFEF" \
  --output-file=SarasaMonoSC-Subset.woff2 \
  --flavor=woff2
```

### 字号层级

以 **16px = 1rem** 为基准。共 7 级：

| Token | Size | Line Height | Weight | 用途 |
|-------|------|-------------|--------|------|
| `text-xs` | 13px (0.8125rem) | 1.5 | 400 | Caption、元数据、时间戳 |
| `text-sm` | 14px (0.875rem) | 1.5 | 400 | 辅助文字、标签、署名 |
| `text-base` | 16px (1rem) | 1.5 | 400 | **正文（基准）** |
| `text-lg` | 18px (1.125rem) | 1.6 | 400 | 引言、段落强调 |
| `text-xl` | 24px (1.5rem) | 1.33 | 590 | H3、卡片标题 |
| `text-2xl` | 32px (2rem) | 1.2 | 590 | H2、大标题 |
| `text-3xl` | 48px (3rem) | 1.0 | 590 | H1、品牌名展示 |

### 字重

| Token | Weight | 用途 | 说明 |
|-------|--------|------|------|
| `font-normal` | 400 | Body、caption、small text | 默认正文 |
| `font-medium` | 510 | Subtle emphasis | 比 400 更突出但不到 bold，用于 nav/标签 |
| `font-semibold` | 590 | Clear emphasis | 标题、需要明确突出的文字 |

不使用 `font-bold` (700) — 590 weight 已足够产生清晰的强调效果，且与温暖轻松的调性更匹配。

---

## 间距体系

基于 **8px** 基准的节奏体系。所有间距都应是 8px 的倍数或半倍（4px 用于微间距）。

| Token | Value | UX 用途 |
|-------|-------|---------|
| `space-1` | 4px (0.25rem) | 微间距 — icon 与文字之间 |
| `space-2` | 8px (0.5rem) | 组件内部间距 — button padding、表单元素间 |
| `space-3` | 12px (0.75rem) | 紧凑区块间距 — card 内部 padding |
| `space-4` | 16px (1rem) | **标准间距** — 段落间、相关元素间 |
| `space-6` | 24px (1.5rem) | 区块分隔 — 不同内容组之间 |
| `space-8` | 32px (2rem) | 大区块分隔 — 页面 section 之间 |
| `space-12` | 48px (3rem) | 页面级呼吸 — hero 区上下、大段留白 |

**使用原则：**
- 组件内部：`space-2` (8px) 为主
- 区块之间：`space-6` (24px) 为主
- 不用非 8px 倍数的间距（7px, 13px, 21px）——破坏节奏
- 不用 `space-0` — 0px 间距不是"留白"，是"不留白"

---

## 圆角

圆角让界面柔和亲切。不同元素类型使用不同圆角值。

| Token | Value | 适用元素 |
|-------|-------|----------|
| `radius-sm` | 6px (0.375rem) | 小标签、Badge、Tooltip |
| `radius-md` | 8px (0.5rem) | 输入框 (Input)、文本域 |
| `radius-lg` | 12px (0.75rem) | **按钮、卡片**（默认） |
| `radius-xl` | 16px (1rem) | 弹窗 (Modal)、对话框 |
| `radius-full` | 9999px | 胶囊形（Pill）、头像 |

**使用原则：**
- 所有可交互元素必须有圆角——不允许 `0px`（直角）出现在按钮/输入框/卡片上
- 不同页面之间圆角值必须一致——不允许"这里 8px 那里 12px"
- 同类型元素 → 同圆角值。按钮永远是 12px

---

## 阴影

遵循"平面优先"原则（P4），阴影使用极度克制。默认为**无阴影**。

| Token | Value | 适用场景 |
|-------|-------|----------|
| `shadow-none` | `none` | **默认** — 所有元素默认为平面 |
| `shadow-sm` | `0 1px 2px oklch(0.15 0.01 50 / 0.05)` | 仅用于绝对需要"浮起"的场景：弹窗、下拉菜单 |

**注意：** 以下 shadow token **有意不定义**，因为它们违反了 P4（平面优先）原则：
- ❌ `shadow-md` — blur ≥ 4px 产生立体感
- ❌ `shadow-lg` — 多层阴影模拟物体厚度
- ❌ `shadow-xl` — 硬阴影模拟 3D 投影
- ❌ `shadow-inner` — 内阴影模拟凹陷

**替代方案：** 用色块亮度区分层级（暗色模式下更亮的表面表示更高的层级），而非依赖阴影。

---

## Tailwind CSS 4 完整配置

以下是将所有 token 映射为 Tailwind CSS 4 的完整配置，可直接用于 `src/app/globals.css`：

```css
@import "tailwindcss";

@custom-variant dark (&:where(.dark, .dark *));

/* ===== DESIGN TOKENS ===== */
@theme {
  /* Fonts */
  --font-brand: "LXGW WenKai", system-ui, sans-serif;
  --font-mono: "Sarasa Mono SC", var(--font-sarasa-mono), ui-monospace, monospace;

  /* Semantic colors — mapped to CSS variables */
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-success: var(--success);
  --color-success-foreground: var(--success-foreground);

  /* Primitive colors (raw oklch values) */
  --color-amber-50: oklch(0.98 0.02 85);
  --color-amber-100: oklch(0.95 0.04 85);
  --color-amber-200: oklch(0.90 0.08 85);
  --color-amber-300: oklch(0.85 0.12 85);
  --color-amber-400: oklch(0.80 0.16 85);
  --color-amber-500: oklch(0.72 0.18 85);
  --color-amber-600: oklch(0.60 0.15 85);
  --color-amber-700: oklch(0.50 0.12 85);
  --color-amber-800: oklch(0.40 0.08 85);
  --color-amber-900: oklch(0.30 0.05 85);

  --color-warm-stone-50: oklch(0.98 0.01 50);
  --color-warm-stone-100: oklch(0.96 0.01 50);
  --color-warm-stone-200: oklch(0.92 0.02 50);
  --color-warm-stone-300: oklch(0.85 0.03 50);
  --color-warm-stone-400: oklch(0.70 0.02 50);
  --color-warm-stone-500: oklch(0.55 0.02 50);
  --color-warm-stone-600: oklch(0.42 0.02 50);
  --color-warm-stone-700: oklch(0.35 0.02 50);
  --color-warm-stone-800: oklch(0.25 0.01 50);
  --color-warm-stone-900: oklch(0.18 0.01 50);

  /* Radius */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  --radius-full: 9999px;

  /* Shadow */
  --shadow-sm: 0 1px 2px oklch(0.15 0.01 50 / 0.05);
}

/* ===== LIGHT MODE ===== */
:root {
  --background: oklch(0.98 0.01 50);
  --foreground: oklch(0.18 0.01 50);
  --primary: oklch(0.72 0.18 85);
  --primary-foreground: oklch(0.98 0.01 50);
  --secondary: oklch(0.96 0.01 50);
  --secondary-foreground: oklch(0.35 0.02 50);
  --muted: oklch(0.96 0.01 50);
  --muted-foreground: oklch(0.55 0.02 50);
  --accent: oklch(0.80 0.16 85);
  --accent-foreground: oklch(0.18 0.01 50);
  --card: oklch(0.98 0.01 50);
  --card-foreground: oklch(0.18 0.01 50);
  --border: oklch(0.92 0.02 50);
  --input: oklch(0.92 0.02 50);
  --ring: oklch(0.80 0.16 85);
  --destructive: oklch(0.55 0.2 25);
  --destructive-foreground: oklch(0.98 0.01 50);
  --success: oklch(0.50 0.15 145);
  --success-foreground: oklch(0.98 0.01 50);

  /* Brand bar (light) */
  --header-bg: oklch(0.72 0.18 85);
  --header-fg: oklch(0.98 0.01 50);
}

/* ===== DARK MODE ===== */
@variant dark {
  --background: oklch(0.18 0.01 50);
  --foreground: oklch(0.96 0.01 50);
  --primary: oklch(0.80 0.16 85);
  --primary-foreground: oklch(0.18 0.01 50);
  --secondary: oklch(0.25 0.01 50);
  --secondary-foreground: oklch(0.85 0.03 50);
  --muted: oklch(0.25 0.01 50);
  --muted-foreground: oklch(0.70 0.02 50);
  --accent: oklch(0.72 0.18 85);
  --accent-foreground: oklch(0.96 0.01 50);
  --card: oklch(0.25 0.01 50);
  --card-foreground: oklch(0.96 0.01 50);
  --border: oklch(0.35 0.02 50);
  --input: oklch(0.35 0.02 50);
  --ring: oklch(0.80 0.16 85);
  --destructive: oklch(0.65 0.18 25);
  --destructive-foreground: oklch(0.98 0.01 50);
  --success: oklch(0.60 0.12 145);
  --success-foreground: oklch(0.98 0.01 50);

  /* Brand bar (dark) — semi-transparent warm + glass */
  --header-bg: rgba(28, 25, 23, 0.85);
  --header-fg: oklch(0.96 0.01 50);
}

/* ===== BRAND BAR BACKDROP ===== */
header[data-site-header] {
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

/* ===== BASE STYLES ===== */
@layer base {
  * {
    border-color: var(--border);
  }
  body {
    background: var(--background);
    color: var(--foreground);
    font-family: var(--font-brand);
  }
}
```

---
*Last updated: 2026-05-09*
