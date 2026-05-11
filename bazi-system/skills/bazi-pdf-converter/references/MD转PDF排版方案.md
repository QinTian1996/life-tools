# Markdown 转 PDF 排版方案

## 核心思路

不用 pandoc 直接转 PDF，而是：**md → HTML（带精美模板）→ 浏览器打印为 PDF**

pandoc 原生 PDF 排版能力弱，用 HTML 模板可以完全控制样式。

## 关键文件

```
template.html   # Pandoc HTML 模板（定义所有样式）
style.css       # 旧版样式，可忽略
```

## 转换命令

```bash
# Step 1: md → html（使用模板）
pandoc <输入.md> -o <输出.html> --template=template.html

# Step 2: html → pdf（Chrome headless）
google-chrome --headless --disable-gpu \
  --no-pdf-header-footer \
  --print-to-pdf=<输出.pdf> <输出.html>
```

## template.html 模板说明

### 页面设置
```css
@page { size: A4; margin: 2cm 2.5cm; }
```

### 字体
```css
body {
  font-family: 'KaiTi', 'STKaiti', '楷体', serif;
  font-size: 11.5pt;
  line-height: 2;
}
```

### 标题样式
- **h1**: 26pt，暗红色(#8B0000)，居中，字间距6px
- **h2**: 15pt，左侧 4px 红色竖边（border-left）
- **h3**: 13pt，深灰色

### 其他元素
- **blockquote**: 左侧 3px 灰边框，浅灰背景
- **table**: 边框折叠，表头浅灰背景
- **strong**: 暗红色强调

### 页脚签名
```html
<div class="signature">—— 喵十七</div>
<div class="footer">仅供了解命理文化参考</div>
```

## 模板变量

- `$body$` - 文档正文内容（必放）
- `$title$` - 文档标题（需在 md 文件头部用 yaml metadata 指定）

## 依赖

- `pandoc` - md → html 转换
- `google-chrome` - html → pdf 打印（headless 模式）
