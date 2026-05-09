# Quickstart: Unified UI Framework

**Feature**: 001-unified-ui-framework

## What Changes

- **新增** `src/components/layout/SiteHeader.tsx` — 品牌导航栏
- **新增** `src/components/layout/PageLayout.tsx` — 页面布局框架
- **修改** `src/app/page.tsx` — 首页用 PageLayout 包裹
- **修改** `src/app/chat/page.tsx` — 聊天页用 PageLayout 包裹
- **修改** `src/components/chat/ChatUI.tsx` — 移除内联 header
- **可选修改** `src/app/layout.tsx` — 更新 metadata 标题
- **可选修改** `src/app/globals.css` — 暗色模式下 LOGO 样式

## Key Decisions (from research.md)

| # | Decision | Why |
|---|----------|-----|
| 1 | PageLayout 组件包裹（非嵌套 layout） | 需要向布局传递动态 title |
| 2 | Next.js `<Link>` 替代 `<a>` | SPA 导航，<1s 响应 |
| 3 | CSS 变量跟随 `prefers-color-scheme` | 与现有暗色模式一致 |
| 4 | `<img src="/logo.svg">` | 简单直接，已有文件 |

## Verification

1. `npm run dev` — 启动开发服务器
2. 打开 http://localhost:3000 — 验证首页有品牌栏
3. 点击品牌栏 LOGO — 首页上无反应（hovers 有反馈）
4. 打开 http://localhost:3000/chat — 验证品牌栏显示"聊天"
5. 点击品牌栏 LOGO — 回到首页
6. 检查聊天功能 — 发送消息、接收回复正常
7. 切换系统暗色模式 — 品牌栏跟随变暗
