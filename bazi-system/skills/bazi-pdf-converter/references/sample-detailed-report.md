# 详解版参考范例

> 这是 bazi-pdf-converter skill 的详解版范例。完整 md 源码见 `~/projects/life-tools/`。

## 关键要素速查

- **h1**: `# 命理浅析（详解版）`
- **引言**: `> 不设门槛，不论根基。卷中每词皆有解。读罢，可知其人、识其运、明其向。`
- **基础信息**: 表格必含性别行
- **关键词科普**: 3个以内（八字/五行/生克），用生活类比
- **性格**: 先讲「是什么人」，用日常行为场景描述
- **核心矛盾**: 比喻（如「土太多=身上堆了四层棉被」）
- **运势**: 每阶段讲「感觉」而非「术语」，标注当前运
- **方向建议**: 行业 + 生活习惯 + 穿衣颜色
- **流年**: 大白话，分好坏两方面说
- **一句话总结**: 收束全文
- **结尾**: `*星斗为引，行者自渡。*`（居中）
- **零术语原则**: 全文不出一个五行生克专业词

## 生成命令

```bash
pandoc ~/tmp/命理浅析_详解版_辛未.md \
  -o 命理浅析_详解版.html \
  --template=$HOME/.hermes/skills/knowledge/bazi-pdf-converter/templates/template.html
google-chrome --headless --disable-gpu --no-pdf-header-footer \
  --print-to-pdf=命理浅析_详解版.pdf 命理浅析_详解版.html
```
