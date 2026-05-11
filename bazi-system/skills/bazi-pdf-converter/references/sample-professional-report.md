# 专业版参考范例

> 这是 bazi-pdf-converter skill 的专业版范例。完整 md 源码见 `~/projects/life-tools/`。

## 关键要素速查

- **h1**: `# 命理浅析`（单行，无副标题）
- **引言**: `> 四柱推演，三用合一。字字有据，不求惊人。`
- **基础信息**: 表格必含性别行
- **四柱排盘**: 天干十神表 + 地支藏干表，术语不回避
- **四视角**: 强弱/调候/格局/形象，每个视角有结论句
- **格局评判**: 六条（真假/虚实/清浊/有力无力/有情无情/团结）
- **神煞**: 精选3-5个，每个附含义
- **大运**: 完整表格 + 每运详析，用符号标注吉凶（◎○△▲▼）
- **流年**: 干支 + 与命局互动 + 分领域吉凶
- **结尾**: `*星斗为引，行者自渡。*`（居中）

## 生成命令

```bash
pandoc ~/tmp/命理浅析_专业版_辛未.md \
  -o 命理浅析_专业版.html \
  --template=$HOME/.hermes/skills/knowledge/bazi-pdf-converter/templates/template.html
google-chrome --headless --disable-gpu --no-pdf-header-footer \
  --print-to-pdf=命理浅析_专业版.pdf 命理浅析_专业版.html
```
