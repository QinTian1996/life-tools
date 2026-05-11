---
name: bazi-analysis
description: "Systematic Bazi (八字) analysis using 韦千里's Eight-Step Evaluation Method (八步法), with compatibility (合婚) and plain-language conclusion generation"
version: 1.1.0
author: 喵十七
trigger: user provides birth details (year/month/day/time, gender) for Bazi analysis
---

# Bazi Analysis — 陆致极定调 × 杂家细化的综合评断

## Overview

Analyze a Bazi (四柱八字) using an **integrated two-layer methodology:**

1. **陆致极四视角框架** (定调层) — 强弱/调候/格局/形象，四大视角叠加，量化工具辅助
2. **韦千里八步法 + 杂家经验** (细化层) — 逐干逐支分析、应期判断、神煞纳音、太岁征验

**原则：陆致极给你望远镜，杂家给你手术刀。先用框架定调定方向，再用杂家抠细节。**

**Knowledge base references:**
- `~/knowledge_base/命理/陆致极三部曲/` — 陆致极体系（基础教程/进阶教程/纲要）
- `~/knowledge_base/命理/古籍/` — 杂家古籍（千里命稿/子平真诠/渊海子平/命理探源/三命通会）

### 神煞纳音使用原则（用户偏好）
- 保留在工具箱中，分析时该用就用
- 如果实际判断中某个神煞/纳音不够准确或不相关，**单独拆出来说明原因**，而非直接跳过
- 只取最有用的3-5个核心神煞（天乙贵人/华盖/驿马/桃花/阳刃），不上百个全部铺开
- 纳音作为辅助参考，不作为主判断依据

### 5. 陆致极图片使用原则（用户偏好）
- 讲解概念时，可以从知识库中调取陆致极三部曲的 `images/` 目录下的图片辅助说明
- 图片位于 `~/knowledge_base/命理/陆致极三部曲/{书名}/images/{hash}.jpg`

---

## Output: Dual-Report Standard（用户偏好 — 核心工作流）

用户明确要求每次命理分析都出**两个版本，同等重要**：

### 版本 A：专业版

| 要素 | 要求 |
|------|------|
| **基础信息** | ⚠️ **性别必填**，不可遗漏 |
| 引言 | `四柱推演，三用合一。字字有据，不求惊人。` |
| 框架 | 陆致极四视角（强弱/调候/格局/形象）+ 三用合一判定 |
| 细化 | 韦千里八步法 + 杂家经验（神煞纳音、十干败亡诗、征太岁等） |
| 语言 | 使用术语（得令/得地/格局/用神等），可不解释 |
| 表格 | 数据密集处用表格（大运表、喜忌表、六条评判表等） |
| 受众 | 懂命理的人 |

### 版本 B：详解版

| 要素 | 要求 |
|------|------|
| **基础信息** | ⚠️ **性别必填**，不可遗漏 |
| 引言 | `不设门槛，不论根基。卷中每词皆有解。读罢，可知其人、识其运、明其向。` |
| 框架 | 去掉所有术语。一个都不留，全部用人话翻译。 |
| 语言 | 用类比、比喻、故事：如"土太多=身上堆了四层棉被"、"缺木=树缺主干" |
| 结构 | 先讲这个人是什么性格（最关心的）→ 再讲运势节奏 → 再讲方向建议 |
| 排版 | 楷体标题 + 喵十七署名 + 无页脚URL |
| 受众 | 零基础普通人 |

---

## PDF 生成工作流

最终以 PDF 形式交付。标准流水线：

```
pandoc 命理分析报告.md \
  --template=template.html \
  --metadata title="..." \
  -o 命理分析报告.html \
  --self-contained

chromium --headless --disable-gpu --no-sandbox \
  --print-to-pdf=命理分析报告.pdf \
  file:///path/to/命理分析报告.html
```

步骤：
1. 书写 Markdown 内容（纯文本，含表格/列表等 markdown 语法）
2. pandoc + 自定义模板 → HTML（pandoc 负责解析 markdown，模板负责排版）
3. chromium headless → PDF（注意不加 `--no-margins` 等无效参数）

**已知坑**：
- pandoc + xelatex 直出 PDF 需要 `texlive-xetex` 包（含 xeCJK.sty），否则报 `File 'xeCJK.sty' not found`
- chromium 默认会在页脚显示文件路径，用 `@page` CSS 中的 `content: none` 抑制
- 标题字体用楷体（`KaiTi`/`楷体`），隶书在 Linux 系统默认未安装
- 末尾署名：`—— 喵十七`

### 模板位置

专业版模板与详解版模板共用排版风格（楷体标题、喵十七署名、无页脚），差异只在内容语言。

模板文件位于本 skill 的 `templates/report-template.html`。

---

## Integrated Analysis Workflow

**陆致极定调 → 杂家细化 → 综合结论**

### Phase 1 — 陆致极四视角定调

| 视角 | 层面对 | 核心工具 | 产出 |
|------|--------|---------|------|
| **强弱** | 五行旺衰 | 得令/得地/得助三步法 + 九级强弱（极强→极弱） | 扶抑用神 |
| **调候** | 气候寒暖 | 寒暖燥湿计分系统（±6分中和阈值） | 调候用神 |
| **格局** | 十神取格 | 月令透干取格 + 六条高低评判（真假/虚实/清浊/有力无力/有情无情/团结） | 格局用神 |
| **形象** | 全局气势 | 专旺/从旺/强势/制局检查 | 顺势用神 |

#### 三用合一判定法

首先分别找出三类用神（扶抑、调候、格局），然后看是否重合。**重合越多，用神越真。**

> 例：老大八字 丙子 辛卯 己未 乙亥 → 丙火 = 扶抑（生身）+ 调候（暖局）+ 格局（杀印相生的印），三用合一，为核心用神

#### 调候计分速查表

**天干计分**（暖燥+，寒湿-）：
| 甲 | 乙 | 丙 | 丁 | 戊 | 己 | 庚 | 辛 | 壬 | 癸 |
|+3 | +1 | +6 | +4 | +5 | -4 | -1 | -3 | -5 | -6 |

**地支计分**：
| 寅 | 卯 | 辰 | 巳 | 午 | 未 | 申 | 酉 | 戌 | 亥 | 子 | 丑 |
|+3 | +1 | -4 | +5 | +6 | +3 | -2 | -3 | +4 | -5 | -6 | -4 |

**月令加分**：寅(0) 卯(+1) 辰(+2) 巳(+3) 午(+4) 未(+3) 申(0) 酉(-1) 戌(-2) 亥(-3) 子(-4) 丑(-4)

**判断标准**：总分 +6 到 -6 = 基本中和；超出即偏颇。

### Phase 2 — 杂家八步法细化

Use the Eight-Step Method below for detailed layer, but now informed by Phase 1's framework.

Key杂家 tools to layer on top of the 陆致极 framework:

| 杂家工具 | 适用场景 |
|---------|---------|
| 韦千里逐干逐支分析 | 每个天干地支的独立作用 |
| 征太岁/晦气判断 | 流年凶吉细化 |
| 十干败亡诗 | 弱日主绝地检查（身弱七杀最忌走绝地） |
| 格局取运（子平真诠） | 各格局走什么运吉/凶 |
| 神煞（精选3-5个） | 天乙贵人/华盖/驿马/桃花/阳刃 |
| 纳音参考 | 辅助五行生克判断 |
| 连环式刑冲 | 大凶组合检查 |
| 拱夹法则 | "向实寻虚，从无取有" |
| 第六步大运死关 | 50-70岁冲提运 |

### Phase 3 — 综合结论

Combine Phase 1 (structural) + Phase 2 (detailed) into a coherent conclusion.

### Date Conversion

- **Lunar (农历) input:** Convert to Gregorian first. Use reliable references.
  - **Best source:** `nongli114.com` — search `"乙亥(1995)年四月初二"` format, the description field directly states the Gregorian date
  - **Backup:** HK Observatory PDF calendar (hko.gov.hk), web search for `"1995年四月初二 公历"`
  - **API:** `https://www.iamwawa.cn/nongli/api/?type=lunar&year=1995&month=4&day=2` (may have limited access)
  - Verify with at least two sources when possible
- **Solar term (节气) check:** Always verify the year/month boundary against solar terms (立春 for year, 节气 for months).
- **Ambiguous time:** Note the limitation clearly in the output. Do NOT fabricate a 时柱.
- **腊月注意:** 2001年腊月 = 2001农历年的第12个月 = 公历2002年1月左右 (NOT 公历2001年12月). Check `nongli114.com` for `辛巳(2001)年腊月初一` to find the solar date range.
- **每年农历生日提醒:** Lunar birthdays shift ~10-12 days each year in the solar calendar. For cron job birthday reminders, search the CURRENT YEAR's lunar date and set as a one-time job (`repeat: 1`), not perpetual. Note to the user that it needs yearly renewal.
  - **Lookup pattern:** For 2027年农历四月初二 → search `"2027年农历四月初二 公历"` or `"丙午(2027)年四月初二"` on nongli114.com
  - **For multiple years:** Can pre-compute 5 years ahead by searching each year individually. Create separate cron jobs with year-specific names.

### Gender Rule for 大运

- **阳年男命 / 阴年女命** → 顺排大运
- **阴年男命 / 阳年女命** → 逆排大运

### ⚠️ 起运计算 — 数节不数气 (Critical Pitfall)

**This is the most common error in 大运 calculation. I made this mistake in session 2026-05-06 and got the 起运 age off by 5 years.**

**Correct method:**
1. Find the **nearest previous 节** (NOT 中气) before/after the birth date, depending on 顺排/逆排
2. Count the days between birth date and that 节
3. Divide by 3 → 起运年龄

**The 12 节的列表：**

| 月 | 节 | 中气 (Do NOT use) |
|:---:|:---|:---:|
| 寅月 | **立春** | ~~雨水~~ |
| 卯月 | **惊蛰** | ~~春分~~ |
| 辰月 | **清明** | ~~谷雨~~ |
| 巳月 | **立夏** | ~~小满~~ |
| 午月 | **芒种** | ~~夏至~~ |
| 未月 | **小暑** | ~~大暑~~ |
| 申月 | **立秋** | ~~处暑~~ |
| 酉月 | **白露** | ~~秋分~~ |
| 戌月 | **寒露** | ~~霜降~~ |
| 亥月 | **立冬** | ~~小雪~~ |
| 子月 | **大雪** | ~~冬至~~ |
| 丑月 | **小寒** | ~~大寒~~ |

**Self-check:** After calculating 起运年龄, cross-reference against the 大运 table. If the 大运 years shift oddly from what apps show, the most likely cause is using a 中气 instead of 节.

**Verified example 1 (1999年3月1日 巳时, 男, 逆排):**
- 逆排 → 找上一个节
- 上一个节 = 立春 (2月4日) ← ✅ 正确
- 错用 雨水 (2月19日) = 10天 → 3岁4个月 ❌
- 正确用 立春 (2月4日) = 25天 → 8岁4个月 ✅
- 25天 ÷ 3 = 8.33年 = 8岁4个月起运

**Verified example 2 (1996年3月23日 亥时, 男, 顺排):**
- 丙子年阳年男命 → 顺排 → 找下一个节
- 下一个节 = 清明 (4月4日) ← ✅
- 错用 中气春分 (3月20日) = 3天 → 1岁 ❌（方向对但类型错）
- 错用 上一个节惊蛰 (3月5日) = 18天 → 6岁 ❌（逆排逻辑误用）
- 正确用 清明 (4月4日) = 12天 → 4岁 ✅
- 12天 ÷ 3 = 4岁起运
- ⚠️ 前次分析（2026-04-26）误算为8岁，导致大运年龄全部后移4年。大运干支序列不变，仅起始年龄提前。

---

## The Eight-Step Method (八步法)

### Step 1: 看强弱 (Assess Strength)

Judge 日主 strength based on:
- **得令** — born in the season of the element (旺/相/休/囚/死)
- **得地** — strong root in 地支 (especially 日支 and 月支)
- **得势** — help from 天干 (same element 比劫 or generative element 印)
- **克泄耗** — how many elements restrict/drain the 日主

**Verdict:** 身强 / 中和偏强 / 中和 / 中和偏弱 / 身弱

### Step 2: 定格局 (Determine Pattern)

Based on **月支** (month branch). Key principle: **"有杀先论杀"** (if 七杀 is present, prioritize it).

Common patterns: 正官格, 七杀格, 正印格, 偏印格, 正财格, 偏财格, 伤官格, 食神格, 建禄格, 月刃格, plus special 外格.

### Step 3: 取用神 (Select 用神)

The element/stem that best balances the 日主. Two axes:
- **扶抑** (strengthening/weakening) — primary
- **调候** (climate regulation) — important for extreme heat/cold/dry/wet

### Step 4: 论喜忌 (Discuss Likes/Dislikes)

| 五行 | 喜/忌 | Reason |
|:---:|:---:|:---|
| 🔥火/💧水/💎金/etc | ❤️喜/💔忌/⚠️中平 | Clear reasoning tied to 用神 |

### Step 5: 查岁运 (Examine 大运 & 流年)

- List 大运 in order (10 years each, first 运 starts at 起运年龄)
- Mark **current 大运** explicitly
- Analyze **current year 流年** in detail
- Cross-reference 流年 with 大运 and 原局 (刑冲合害)

### Step 6: 推六亲 (Deduce Family Relationships)

- Male: 正财=wife, 七杀=sons, 正官=daughters
- Female: 正官=husband, 七杀=other partners, 伤官=sons, 食神=daughters
- 年柱=父母, 月柱=手足/环境, 日支=配偶, 时柱=子女/晚运

### Step 7: 评性情 (Assess Personality)

Based on 日主 element + 格局 + prominent 十神. Use concrete behavioral descriptions, not vague fortune-telling tropes.

### Step 8: 断事业 (Career Guidance)

- Based on 用神 and 喜忌
- Recommend specific industries (by 五行)
- Map career stages to 大运 phases
- **Always include a one-sentence summary in plain language at the end.**

---

## Step 9 (Optional): 日常应用 (Daily Life Guidance)

When the user asks for practical advice (clothing colors, lifestyle, decoration, etc.) based on 五行喜忌:

### 核心原则：落地到用户的真实身份

**⚠️ Critical: 建议必须贴合用户的实际身份（年龄、性别、职业、生活方式），不能只给抽象的颜色列表。**

#### 错误做法（用户已纠正）：
```
"推荐红色/橙色/紫色/粉色/酒红色的上衣"
→ 对一位30岁男性程序员来说，这个列表大部分不实用
```

#### 正确做法：
```
"推荐酒红色/陶土色/锈红色的重磅纯棉T恤或卫衣
→ 好买、好搭、不扎眼，程序员穿也合适"
```

### 颜色推荐框架

| 五行 | 色系 | 推荐 | 避坑 |
|:---:|:---|:---|:---|
| 🔥 火 | 红/橙/紫/粉/酒红 | **低饱和度版本**：酒红、砖红、焦糖、陶土、暗紫 | ❌ 亮红、亮橙、荧光色、粉色 |
| 🟫 土 | 米/卡其/棕/驼 | 随便穿，怎么都行 | — |
| ⬜ 金(中平) | 白/灰/藏青 | 过渡色，可做主色但别喧宾 | 不用特别避 |
| 💧 水(忌) | 黑/深蓝 | 少穿，别一身黑 | 加红色/暖色配饰平衡 |
| 🌿 木(忌) | 绿/军绿 | 少穿 | 如果穿，用红色配饰缓冲 |

### 穿搭实用公式

```
土打底 + 火点睛 + 金过渡
= 米色/卡其为主 + 酒红/橙色小面积 + 白灰做衔接
```

注意：饱和度越低越能穿得出去（酒红>正红，砖红>亮橙，陶土>荧光）。

### 其他日常应用思路

- **配饰**：红绳手链、棕色皮带/包/鞋
- **家居**：暖色调灯光（丙火）
- **环境**：多待在暖色空间，少待在全黑/冷色环境
- **饮食**：暖性食物（类似火土属性的）

---

## Output Format Rules ⭐️ — User Preferences

> These rules encode user feedback. Follow them strictly.

### 1. Structure
- Complete 八步法 analysis first (technical, detailed)
- Then provide a **"普通人的简洁版"** or **"一句话总结"** section at the very end
- Use tables for data-heavy sections (五行旺衰, 大运, 喜忌)

### 2. Language Tone
- **After technical analysis, summarize in PLAIN LANGUAGE** — the user said "总结普通人能看懂的结论" and "用简洁易懂的语言"
- Use analogies (e.g., "像一片森林"/"像烈日下的土"/"一株好苗子")
- Minimize jargon in the final summary section
- Be direct — no flowery or overly ornate descriptions

### 3. 合婚 (Compatibility Analysis) Format
- Compare: 日干关系, 日柱关系 (⚠️ critical — highlight 刑冲合害), 年柱, 月柱
- 五行互补 analysis
- **通关** (五行流通) analysis — can one person's element bridge the other's?
- Give a score out of 100
- List concrete advice for the relationship

### 4. Special Cases
- **未知时柱:** Explicitly note ⚠️ missing info, list what's uncertain (婚姻宫, 子女, 晚运)
- **双胞胎/同八字不同命:** Note that 时柱 determines the final 20% of nuance
- **流月分析:** Provide month-by-month for the current ~6 months when asked

### 5. Pacing
- Start with the full 八步法, then the plain-language wrap-up
- When user asks for just a summary midway, skip to the plain-language section

---

## References

This skill relies on the following knowledge base resources:

- **千里命稿_韦千里.md** — `~/knowledge_base/命理/古籍/` — contains the complete 八步法 text,评断之程序, and评断之标准 (lines ~2780-2799), plus example cases
- **其他古籍** in `~/knowledge_base/命理/古籍/` — 子平真诠, 渊海子平, 三命通会 for cross-referencing

See `references/eight-step-method.md` for the exact 韦千里 text quoted from the source.

See `references/compatibility-analysis.md` for 合婚 methodology notes and session-specific examples.

See `references/lujizhi-vs-zajia.md` for the full comparison table and integrated methodology from session 2026-05-08.

See `references/verified-qintian-bazi.md` for 覃天的 verified birth data, corrected 起运 calculation, and report history. Use this to avoid re-searching birth details in future sessions.
