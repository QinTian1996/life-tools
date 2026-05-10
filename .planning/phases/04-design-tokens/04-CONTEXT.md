# Phase 4: Design Tokens & Specifications - Context

**Gathered:** 2026-05-09
**Status:** Ready for planning

## Phase Boundary

将 Phase 3 的设计理念量化为具体的设计 tokens — 色彩、排版、间距、圆角、阴影的精确数值。产出可直接被 Phase 5（CSS 实现）引用的数值规范。

## Implementation Decisions

### D-1: 色彩体系 — OKLCH + 8级色阶

**格式：** OKLCH（感知均匀，暗色模式下亮度可控）。设计中用 hex 引用，tokens 用 oklch。

**色阶：** 每套色 8 级（50/100/200/300/400/500/600/700/800/900，去掉 950）

**主色 — Amber（暖琥珀）：**
```
amber-50:  oklch(0.98 0.02 85)   →  最浅底色
amber-100: oklch(0.95 0.04 85)
amber-200: oklch(0.90 0.08 85)
amber-300: oklch(0.85 0.12 85)
amber-400: oklch(0.80 0.16 85)   →  暗色模式主色
amber-500: oklch(0.72 0.18 85)   →  亮色模式主色
amber-600: oklch(0.60 0.15 85)   →  hover 加深
amber-700: oklch(0.50 0.12 85)
amber-800: oklch(0.40 0.08 85)
amber-900: oklch(0.30 0.05 85)
```

**辅色 — Warm Stone（暖石灰）：**
```
warm-stone-50:  oklch(0.98 0.01 50)   →  亮色底色
warm-stone-100: oklch(0.96 0.01 50)
warm-stone-200: oklch(0.92 0.02 50)
warm-stone-300: oklch(0.85 0.03 50)
warm-stone-500: oklch(0.55 0.02 50)
warm-stone-700: oklch(0.35 0.02 50)
warm-stone-800: oklch(0.25 0.01 50)   →  暗色表面
warm-stone-900: oklch(0.18 0.01 50)   →  暗色底色
```

### D-2: 语义色 — 11 对（shadcn/ui 风格）

成对命名（`*-foreground` = 该背景上的文字色）：

| Token | 亮色 | 暗色 |
|-------|------|------|
| `background` | warm-stone-50 | warm-stone-900 |
| `foreground` | warm-stone-900 | warm-stone-100 |
| `primary` | amber-500 | amber-400 |
| `primary-foreground` | warm-stone-50 | warm-stone-900 |
| `secondary` | warm-stone-100 | warm-stone-800 |
| `secondary-foreground` | warm-stone-700 | warm-stone-200 |
| `muted` | warm-stone-100 | warm-stone-800 |
| `muted-foreground` | warm-stone-500 | warm-stone-400 |
| `accent` | amber-400 | amber-500 |
| `accent-foreground` | warm-stone-900 | warm-stone-50 |
| `card` | warm-stone-50 | warm-stone-800 |
| `card-foreground` | warm-stone-900 | warm-stone-100 |
| `border` | warm-stone-200 | warm-stone-700 |
| `input` | warm-stone-200 | warm-stone-700 |
| `ring` | amber-400 | amber-400 |
| `destructive` | oklch(0.55 0.2 25) | oklch(0.65 0.18 25) |
| `destructive-foreground` | warm-stone-50 | warm-stone-50 |
| `success` | oklch(0.50 0.15 145) | oklch(0.60 0.12 145) |
| `success-foreground` | warm-stone-50 | warm-stone-50 |

暗色模式下：
- amber 主色向亮偏移 1 级（500→400）
- 背景 surface 不使用纯黑，使用 warm-stone 暖灰
- 暗色层级通过亮度区分（900 最深 → 800 略浅 → 700 更浅）

### D-3: 品牌栏暗色模式

```
background: rgba(28, 25, 23, 0.85)
backdrop-filter: blur(12px)
```

微透+柔化，参考 macOS 顶栏效果。底下内容隐约可见但注意力在上层。

### D-4: 排版体系

**字体族：**
| 角色 | 字体 | 用途 |
|------|------|------|
| 轻松文本 | 霞鹜文楷等宽 (LxgwWenKai Mono) | 品牌名、标题、按钮、轻松场景 |
| 技术文本 | 更纱等距黑体 (Sarasa Gothic Mono) | 代码、技术内容、严肃场景 |
| 系统回退 | system-ui, sans-serif | fallback |

**字号层级（7 级，以 16px body 为基准）：**

| Token | Size | Line Height | Weight | 用途 |
|-------|------|-------------|--------|------|
| `text-xs` | 13px | 1.5 | 400 | Caption、元数据 |
| `text-sm` | 14px | 1.5 | 400/510 | 辅助文字、标签 |
| `text-base` | 16px | 1.5 | 400 | 正文（基准） |
| `text-lg` | 18px | 1.6 | 400 | 引言、强调段落 |
| `text-xl` | 24px | 1.33 | 590 | H3、卡片标题 |
| `text-2xl` | 32px | 1.2 | 590 | H2、大标题 |
| `text-3xl` | 48px | 1.0 | 590 | H1、品牌名 |

字重：400/510/590。510 用于 subtle emphasis（比 400 bold 更克制），590 用于 clear emphasis（标题）。

### D-5: 间距体系（Phase 3 锁定）

8px 基准，倍数体系：4 / 8 / 12 / 16 / 24 / 32 / 48

### D-6: 圆角与阴影（Phase 3 锁定）

| 元素 | 圆角 |
|------|------|
| 按钮、卡片 | 12px |
| 输入框 | 8px |
| 徽章/tag | 6px 或 full |
| 弹窗/模态框 | 16px |

阴影：blur ≤ 4px，暖色调（非纯灰）

### the agent's Discretion

以下留给规划阶段和研究者自主决定：
- amber 和 warm-stone 的具体 oklch 色阶数值微调
- 语义色与原始色阶的精确映射
- 暗色模式下 surface 层级的精确亮度步长
- 霞鹜文楷和更纱黑体的 Next.js font loader 配置
- 行高的精确数值（已给定范围）

## Canonical References

- `.planning/PROJECT.md` — 项目上下文、技术约束
- `.planning/REQUIREMENTS.md` — v2.0 需求 TOKN-01..TOKN-06
- `.planning/ROADMAP.md` — Phase 4 目标与成功标准
- `.planning/phases/03-design-philosophy/03-CONTEXT.md` — Phase 3 的设计原则（色彩、间距、圆角、阴影方向）
- `.planning/design-philosophy.md` — 完整设计理念文档（8 原则 + 反模式）
- `.planning/research/SUMMARY.md` — 设计系统研究（OKLCH、shadcn/ui pattern）
- https://github.com/lxgw/LxgwWenKai — 霞鹜文楷等宽
- https://github.com/be5invis/Sarasa-Gothic — 更纱等距黑体

## Deferred Ideas

None.

---
*Phase: 4-Design Tokens*
*Context gathered: 2026-05-09*
