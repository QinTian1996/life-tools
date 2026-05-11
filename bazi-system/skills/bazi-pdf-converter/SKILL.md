---
name: bazi-pdf-converter
description: 命理分析报告 md → PDF 转换工作流。使用 pandoc + 专用 HTML 模板 + Chrome headless 打印，生成带楷体排版的中式风格 PDF。
triggers:
  - 把命理报告转成 PDF
  - md 转 pdf 命理
  - 生成命理报告 PDF
---

# 命理分析报告 PDF 转换工作流

## 核心思路

不用 pandoc 直接转 PDF（排版弱），而是：**md → HTML（带精美模板）→ Chrome headless 打印为 PDF**。

## 关键文件

```
templates/template.html   # Pandoc HTML 模板（定义所有样式），已内嵌在 skill 目录中
```

## 依赖

- `pandoc` — md → HTML 转换
- `google-chrome` — HTML → PDF 打印（headless 模式）

## 标题命名规则

详解版报告统一使用「**命理浅析**」为标题基础：

| 场景 | md 文件 h1 | 文件名示例 |
|------|-----------|-----------|
| 有人名/代号 | `# 命理浅析 · 覃天` | 命理浅析_覃天.pdf |
| 没有人名/代号 | `# 命理浅析` | 命理浅析.pdf |

模板 `<title>` 标签已固定为「命理浅析」。

## 转换命令

```bash
# Step 1: md → html（使用模板）
# 模板路径：本 skill 的 templates/template.html（或 skill_view 查看当前路径）
pandoc <输入.md> -o <输出.html> --template=$HOME/.hermes/skills/knowledge/bazi-pdf-converter/templates/template.html

# Step 2: html → pdf（Chrome headless）
google-chrome --headless --disable-gpu \
  --no-pdf-header-footer \
  --print-to-pdf=<输出.pdf> <输出.html>
```

## 模板属性

### 页面设置
- A4 纸张，页边距 2cm × 2.5cm

### 字体
- 楷体优先（KaiTi / STKaiti），11.5pt，行高 2 倍

### 标题样式
- **h1**: 26pt，暗红色(#8B0000)，居中，字间距 6px
- **h2**: 15pt，左侧 4px 红色竖边（border-left）
- **h3**: 13pt，深灰色

### 其他元素
- **blockquote**: 左侧 3px 灰边框，浅灰背景
- **table**: 边框折叠，表头浅灰背景
- **strong**: 暗红色强调
- **页脚**: 签名"—— 喵十七" + "仅供了解命理文化参考"

## 排版约定

- 引言：blockquote，无作者署名
- 正文末句：「星斗为引，行者自渡。」居中（CSS: `hr + p { text-align: center; }`）
- 全文仅文末一个「——喵十七」落款
- **禁用 ghostscript 裁剪 PDF 底边**（用户反馈效果极差）

## 注意事项

- pandoc 的 `--template` 参数在 WSL 下需要用 `$HOME` 而非 `~`（shell 展开问题）
- Chrome headless 的 shared_memory_switch 报错可忽略
- 如果 md 文件无 yaml metadata 标题，pandoc 会自动取文件名

## ⚠️ 大忌

- **绝对不要用 ghostscript 裁剪 PDF 底边**。效果非常垃圾。要改内容，从源头上改 md 或模板，不要事后修补。
- **署名叫模板管**。`template.html` 中的 `<div class="signature">—— 喵十七</div>` 已设 `text-align: right`。MD 正文里不要再写署名，否则重复。
- **模板 footer ≠ 正文语气**。模板里的 `<div class="footer">仅供了解命理文化参考</div>` 是结构性免责声明，保持不动。要改 closing message 的语气/内容，改的是 md 正文末尾的段落（例如 `*星斗为引，行者自渡。*`），不是模板。

## 内容风格约定

### 引言（blockquote）
- **详解版**：古风简语，欢迎入门。`不设门槛，不论根基。卷中每词皆有解。读罢，可知其人、识其运、明其向。`
- **专业版**：专业自信，不卑不亢。`四柱推演，三用合一。字字有据，不求惊人。`

### 结尾
正文末用古风短句收束，居中。`*星斗为引，行者自渡。*`

### 基础信息
⚠️ 性别必填，不可遗漏。专业版和详解版的基础信息段都必须包含性别字段。

## 参考范例

完整的两版报告范例（辛未年1991男命）可供参照：
- `references/sample-professional-report.md` — 专业版完整范例
- `references/sample-detailed-report.md` — 详解版完整范例
