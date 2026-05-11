---
phase: "7"
phase_name: "Foundation"
project: "喵十七的工具箱"
generated: "2026-05-11"
counts:
  decisions: 3
  lessons: 2
  patterns: 2
  surprises: 2
missing_artifacts: []
---

# Phase 7 Learnings: Foundation

## Decisions

### lunisolar API quirk: Stem/Branch are objects not strings
lunisolar 的 `char8.year.stem` 返回的是 `Stem` 对象，不是 `string`。必须用 `.toString()` 才能拿到天干地支字符。类型定义里是 `Stem` class 不是 `string`。

**Rationale:** TypeScript 严格类型检查暴露了这个问题，build 时报错。
**Source:** 07-01-PLAN.md execution logs

### Lunar month encoding: leap months are month+100
lunisolar 的 `lunar.month` 在闰月时返回 `month + 100`（闰六月 → 106）。`lunar.isLeapMonth` 才是闰月布尔值。之前用的 `lunar.month.isLeap` 不存在。

**Rationale:** build 时报 `Property 'isLeap' does not exist on type 'number'`，修正为 `lunar.isLeapMonth`。
**Source:** calendar.ts implementation

### fromLunar returns Lunisolar instance, not plain object
`lunisolar.fromLunar()` 返回 `Lunisolar` 实例，没有 `.date` 属性。需要用 `.format('YYYY-MM-DD')` 获取日期字符串。

**Rationale:** build 时报 `Property 'date' does not exist on type 'Lunisolar'`。
**Source:** calendar.ts toSolar function

## Lessons

### 先 build 再 commit
lunisolar 的 API 和文档/计划有差异，写代码时以为直接就能用，实际有 3 处类型不匹配。如果没有 `npm run build` 验证就直接 commit，后续阶段会踩坑。

**Context:** 执行计划时按照 SPEC/CONTEXT 中描述的 API 写了代码，但实际库的 API 略有不同。
**Source:** 07-01 task execution

### 第三方库的类型定义要预先读
lunisolar 有 `.d.ts` 文件，但不一定会被 IDE 自动加载（`typings/` 目录）。应该在开始写代码之前先 `find node_modules/lunisolar -name "*.d.ts"` 看一下。

**Context:** 写 calculator.ts 时假设 `stem` 是 string，实际是 class。
**Source:** types.ts + calculator.ts implementation

## Patterns

### PageLayout + 内联 JSX 页面模式
Phase 7 的 /bazi 页面沿用了 chat 页面的 PageLayout 包裹模式。内部表单用内联 JSX（未抽取组件），Phase 8 会重构为独立组件。这是项目规定的渐进式组件化模式。

**When to use:** 新页面初始阶段先用内联 JSX 验证功能，后续阶段抽取组件。
**Source:** page.tsx, chat/page.tsx pattern

### 纯函数 lib + 客户端页面调用模式
`src/lib/bazi/` 下放纯函数（无 React 依赖），`src/app/bazi/page.tsx` 作为客户端组件调用。分离关注点：lib 可独立测试，页面只负责 UI。

**When to use:** 计算逻辑和 UI 分离的场景。
**Source:** 07-CONTEXT.md D-01, D-04

## Surprises

### lunisolar 日期范围只到 2100 年
lunisolar 的 lunar calendar 计算从 1900 年到 2100 年。超过这个范围会返回错误。对于历史人物八字（如古代皇帝），需要其他方案。

**Impact:** SPEC 中 "范围 1900-2100" 的约束现在得到了验证。
**Source:** lunisolar README

### npm install 顺手删了之前装的 `wait-on` 和 `systeminformation`
`npm install lunisolar` 时 `removed 4 packages`。可能是 npm 自动 dedupe 或清理了不再引用的包。需要确认没有功能受影响。

**Impact:** build 依然通过，但后续如果用到这些包会报错。
**Source:** npm install output
