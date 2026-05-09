# Phase 3: Design Philosophy & Principles - Context

**Gathered:** 2026-05-09
**Status:** Ready for planning

## Phase Boundary

定义"温暖极简主义"的设计理念和具体原则，产出可操作的设计原则文档作为后续所有视觉决策的"宪法"。不涉及具体 token 数值或 CSS 实现。

## Implementation Decisions

### D-1: 设计原则组织结构 — 三层分层模型

原则按三个维度组织，共 8 条：

**视觉层（4条）** — "看起来怎么样"
1. **暖色调优先** — amber/warm-stone 为主色调，避免蓝/紫等冷色
2. **留白是结构** — 用间距表达层级关系，不依赖边框和阴影来划分区域
3. **圆润亲和** — 6-16px 圆角，避免尖锐直角带来的冷感
4. **平面优先** — 用色彩和间距区分层级，而非阴影模拟 3D 立体感。禁止拟物纹理、多层 shadow、渐变按钮模拟凸起。但半透明磨砂叠加（backdrop-filter）属于"纸的叠加"而非"物的模拟"，允许保留

**行为层（2条）** — "用起来怎么样"
5. **即时反馈** — 所有可交互元素必须覆盖 hover / focus / active 三态
6. **平滑过渡** — 150-200ms transition，不突兀不延迟

**整体层（2条）** — "感觉怎么样"
7. **一致性优先** — 同一元素在所有页面表现一致，不允许"这里圆角 8px 那里圆角 12px"的随意性
8. **做减法** — 每加一个视觉元素都需要有明确的理由。不确定加不加？不加

### D-2: "温暖"的三维度定义

| 维度 | 含义 | 反面 |
|------|------|------|
| 色彩 | 奶油白底(#FAFAF8)、琥珀/焦糖色点缀、暖灰文字(#37352F) | 纯白底(#FFF)、蓝灰色、冷色调 |
| 材质 | 圆角(12-16px)、轻柔阴影(blur≤4px)、半透明毛玻璃质感、8px 呼吸间距 | 直角、硬阴影(blur≥8px)、纯色不透明块、密集排布 |
| 情感 | 低信息密度、轻松不压迫、有"人味"不机械 | 信息堆砌、冷冰冰的工具感 |

关键洞察：温暖和轻松是关联的。高密度→压迫感→不温暖。留白和呼吸感是温暖的必需品。

参考：Notion（暖灰底、emoji 点缀）、Linear（深色暖调、精致但不冷）

### D-3: "简洁"的实操边界

**定义：** 信息清晰但不贫瘠 — 不是因为东西少，而是因为组织得好。

**具体边界：**
- 每个页面核心内容控制在一屏内，避免长滚动
- 首页允许多个功能入口（工具卡片/按钮），但每个子页面内部保持单屏单一任务
- 功能性内容全部可见，辅助性内容可折叠或放二级页面
- 用分组和间距组织信息，而非一次性堆砌所有内容

### the agent's Discretion

以下留给规划阶段和研究者自主决定：
- 8 条原则的具体措辞润色
- 每条原则的"做"和"不做"示例的选取
- 反模式清单的具体条目（代理从已知的研究和代码库模式中提取）

## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project-Level
- `.planning/PROJECT.md` — 项目上下文、核心价值、技术约束
- `.planning/REQUIREMENTS.md` — v2.0 需求，本案对应 DSGN-01, DSGN-02, DSGN-03
- `.planning/ROADMAP.md` — 阶段 3 的目标和成功标准
- `.planning/research/SUMMARY.md` — 设计系统研究总结（暖色暗模式、Token 架构、极简原则）

### Design Phase Context
- `.planning/phases/03-design-philosophy/03-CONTEXT.md` — 本文件

No external specs — requirements fully captured in decisions above.

## Existing Code Insights

### Reusable Assets
- `src/components/layout/SiteHeader.tsx` — 现有品牌导航栏，已使用 CSS 变量 `--header-bg`
- `src/components/layout/PageLayout.tsx` — 现有页面布局框架
- `src/app/globals.css` — 当前 CSS 变量体系，需在后续阶段基于新原则重写

### Established Patterns
- 现有 amber/orange 暖色系已被使用，v2.0 不会推翻而是完善和系统化
- 暗色模式使用 `prefers-color-scheme` 媒体查询

### Integration Points
- 本阶段产出（原则文档）将指导 Phase 4 的 Token 定义和 Phase 5 的 CSS 重写
- 不涉及代码修改，纯文档产出

## Deferred Ideas

None — discussion stayed within phase scope.

---
*Phase: 3-Design Philosophy*
*Context gathered: 2026-05-09*
