# Requirements: 喵十七的工具箱

**Defined:** 2026-05-11
**Core Value:** A place to dump random tools that might be useful someday.
**Milestone:** v3.0 八字命理工具

## v3.0 Requirements

### Calendar & Input (日历与输入)

- [ ] **BZ-01**: 年份、日期分开输入
- [ ] **BZ-02**: 日期支持公历和农历切换
- [ ] **BZ-03**: 时间可精确到半小时、或选时辰（子丑寅卯...）、或"不知道"
- [ ] **BZ-04**: 性别必选（男女）
- [ ] **BZ-05**: 姓名选填，留空时 LLM 生成"〈形容词〉的〈动物〉"格式名
- [ ] **BZ-06**: 首页"算八字"按钮链接到 `/bazi`
- [ ] **BZ-18**: 创建 `/bazi` 页面骨架（PageLayout 包裹）

### Bazi Computation (八字排盘)

- [ ] **BZ-07**: 系统根据输入计算四柱八字（年柱/月柱/日柱/时柱）
- [ ] **BZ-08**: 系统计算大运、十神等基础信息

### Loading Experience (等待体验)

- [ ] **BZ-09**: 提交后显示输入信息回显 + 已计算的八字四柱
- [ ] **BZ-10**: 等待期间吐槽轮播（LLM 生成多条，渐入渐出 5s/条）

### Report Rendering (报告展示)

- [ ] **BZ-11**: LLM 生成命理报告并在页面渲染（可滚动），支持专业版/详解版切换
- [ ] **BZ-12**: 生成完成后底部保留输入栏
- [ ] **BZ-13**: 重新提交时清空旧报告

### Download (下载)

- [x] **BZ-14**: 提供 HTML 报告下载（CDN 字体，无需内嵌）
- [x] **BZ-15**: 下载报告遵循项目设计语言

### Safety & Quality (安全与质量)

- [ ] **BZ-16**: LLM 生成的 HTML 内容经 DOMPurify 消毒
- [ ] **BZ-17**: API 请求支持 AbortController 中止

## Out of Scope

| Feature | Reason |
|---------|--------|
| PDF 报告下载 | HTML 下载已满足需求，PDF 需额外 puppeteer 依赖 |
| 合婚（两个八字对比） | 独立功能，放入未来 milestone |
| 手机端适配 | 桌面优先，保持与项目一致 |
| 用户登录/历史记录 | 项目无认证系统 |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| BZ-01 | Phase 7 | Pending |
| BZ-02 | Phase 7 | Pending |
| BZ-03 | Phase 7 | Pending |
| BZ-04 | Phase 8 | Pending |
| BZ-05 | Phase 8 | Pending |
| BZ-06 | Phase 7 | Pending |
| BZ-07 | Phase 7 | Pending |
| BZ-08 | Phase 7 | Pending |
| BZ-09 | Phase 9 | Pending |
| BZ-10 | Phase 9 | Pending |
| BZ-11 | Phase 9 | Pending |
| BZ-12 | Phase 9 | Pending |
| BZ-13 | Phase 9 | Pending |
| BZ-14 | Phase 10 | Complete |
| BZ-15 | Phase 10 | Complete |
| BZ-16 | Phase 9 | Pending |
| BZ-17 | Phase 9 | Pending |
| BZ-18 | Phase 7 | Pending |

**Coverage:**
- v3.0 requirements: 18 total
- Mapped to phases: 18/18 ✓

---
*Requirements defined: 2026-05-11*
*Last updated: 2026-05-11 — Added BZ-18 (basic /bazi page scaffold) to Phase 7*
