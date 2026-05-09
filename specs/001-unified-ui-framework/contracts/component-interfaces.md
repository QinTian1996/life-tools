# Component Interface Contracts

**Feature**: 001-unified-ui-framework
**Date**: 2026-05-09

## Components

### SiteHeader

```typescript
// src/components/layout/SiteHeader.tsx

interface SiteHeaderProps {
  /** 当前页面标题，显示在品牌栏右侧。不传则仅显示 LOGO + 品牌文字 */
  title?: string;
  /** 是否在首页。true 时 LOGO 为纯展示（不可点击），false 时为 Link to "/" */
  isHome?: boolean;
}

/**
 * 品牌导航栏 — 固定在页面顶部
 * 
 * Layout:
 * ┌─────────────────────────────────────────────────┐
 * │ [🐱 logo.svg] 喵十七              [title]       │
 * └─────────────────────────────────────────────────┘
 * 
 * Behavior:
 * - 子页面：左侧 LOGO+文字 为 <Link href="/"> → 点击回首页
 * - 首页：  左侧 LOGO+文字 为 <span> → 无操作（hover 视觉反馈）
 * - 暗色模式：跟随全局 CSS 变量自动切换背景色
 */
export default function SiteHeader(props: SiteHeaderProps): JSX.Element;
```

### PageLayout

```typescript
// src/components/layout/PageLayout.tsx

interface PageLayoutProps {
  /** 当前页面标题，传递给 SiteHeader */
  title?: string;
  /** 页面内容 */
  children: React.ReactNode;
}

/**
 * 页面布局框架 — 所有页面的外层容器
 * 
 * Structure:
 * ┌──────────────────────────────────┐
 * │  SiteHeader (fixed, z-10)        │
 * ├──────────────────────────────────┤
 * │                                  │
 * │  Content Area (flex-1, scroll)   │
 * │  {children}                      │
 * │                                  │
 * └──────────────────────────────────┘
 * 
 * Visual:
 * - 背景：bg-gradient-to-b from-amber-50 to-orange-50
 * - 暗色模式：跟随 --background CSS 变量
 * - 最小高度：min-h-screen
 */
export default function PageLayout(props: PageLayoutProps): JSX.Element;
```

## Usage Examples

### 首页

```tsx
// src/app/page.tsx
export default function Home() {
  return (
    <PageLayout>
      <h1 className="text-4xl font-bold">喵十七的工具箱 🔧</h1>
      {/* 现有内容不变 */}
    </PageLayout>
  );
}
```

### 子页面（聊天）

```tsx
// src/app/chat/page.tsx
export default function ChatPage() {
  return (
    <PageLayout title="聊天">
      <ChatUI />
    </PageLayout>
  );
}
```

### 未来新页面

```tsx
// src/app/eat/page.tsx (示例)
export default function EatPage() {
  return (
    <PageLayout title="今天吃什么">
      <EatContent />
    </PageLayout>
  );
}
```
