# 八字命理分析系统 — 标准包

> 打包日期：2026-05-11
> 版本：1.0.0
> 总大小：~3.9 MB（纯文本，不含图片）

## 包内容

### skills/ — 分析控制逻辑（~38 KB）

| 文件 | 大小 | 说明 |
|:---|:---|:---|
| `skills/bazi-analysis/SKILL.md` | 17 KB | 陆致极四视角框架 + 韦千里八步法 + 三用合一判定 + 双报告输出规范 |
| `skills/bazi-analysis/references/` | 8.8 KB | 起运验证数据 / 八步法速查 / 陆致极vs杂家对比 / 合婚方法论 |
| `skills/bazi-analysis/templates/report-template.html` | 1.9 KB | PDF 排版模板（楷体标题、喵十七署名） |
| `skills/bazi-pdf-converter/SKILL.md` | 3.9 KB | MD→HTML→PDF 转换流水线（pandoc + chromium headless） |
| `skills/bazi-pdf-converter/references/` | 4.1 KB | 排版方案说明 + 示例报告 |
| `skills/bazi-pdf-converter/templates/template.html` | 1.6 KB | HTML 模板 |
| `skills/knowledge-base-index.md` | 6.9 KB | 知识库索引，命理分析时定位参考材料 |

### knowledge/ — 参考知识库（~3.9 MB）

#### knowledge/古籍/（1.55 MB）

| 文件 | 大小 | 说明 |
|:---|:---|:---|
| `千里命稿_韦千里.md` | 303 KB | 韦千里经典，含八步法原文 |
| `子平真诠评注_沈孝瞻.md` | 307 KB | 格局派经典 |
| `渊海子平.md` | 175 KB | 八字开山之作 |
| `三命通会_万民英.md` | 591 KB | 集大成工具书 |
| `命理探源_袁树珊.md` | 157 KB | 入门通论 |
| `三命通会_目录索引.md` | 18 KB | 三命通会章节导航 |

#### knowledge/陆致极三部曲/（2.3 MB）

| 文件 | 大小 | 说明 |
|:---|:---|:---|
| `基础教程/基础教程_原文.md` | 482 KB | 陆致极基础教程（8325行） |
| `基础教程/基础教程_第9-13章_核心提取.md` | 13 KB | 实务章节精华 |
| `进阶教程/进阶教程_原文.md` | 478 KB | 陆致极进阶教程（8028行） |
| `进阶教程/进阶教程_精华提取.md` | 17 KB | 进阶要点摘要 |
| `纲要/纲要_原文.md` | 444 KB | 陆致极纲要（6127行） |
| `纲要/纲要_差异化内容提取.md` | 12 KB | 纲要独有内容标注 |
| `摘要/三部曲核心框架.md` | 18 KB | 三本书的框架抽象，不用翻原文就能速查核心 |
| `核心框架.md` | 8.7 KB | 框架速览 |

### templates/ — PDF 模板

| 文件 | 大小 | 说明 |
|:---|:---|:---|
| `template.html` | 1.6 KB | pandoc HTML 模板 |
| `report-template.html` | 1.9 KB | 命理报告专用模板 |

## 使用方式

### 作为 RAG 知识库

将 `knowledge/` 目录下的 MD 文件索引化，分析时检索相关段落注入 prompt。

### 作为 Agent Skill

将 `skills/bazi-analysis/SKILL.md` 作为 system prompt 注入，配合 `knowledge/` 做 RAG 检索。

### PDF 生成

```bash
pandoc 分析报告.md \
  --template=templates/report-template.html \
  --metadata title="命理分析报告" \
  -o 分析报告.html --self-contained

chromium --headless --disable-gpu --no-sandbox \
  --print-to-pdf=分析报告.pdf \
  file:///path/to/分析报告.html
```

## Token 预估

- 完整分析（双报告 + 古籍引用）：40-80K tokens
- 精简分析（单报告 + 核心框架引用）：25-50K tokens
- 最简分析（排盘+用神+一句话）：15-25K tokens

## 依赖

- **运行时**：Python 3.x（排盘逻辑）、pandoc + chromium-headless（PDF 生成）
- **可选**：农历转公历 API（或用内置对照表替代）

## 已知限制

- 陆致极三部曲的图片（776张/17MB）未包含，仅文本
- 图片在需讲解概念时可从原始知识库调取
- 古籍编码为 UTF-8，QQ 发送的原始文件需先转码
