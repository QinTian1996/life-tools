# Stack Research

**Domain:** LLM Chat Interface with DeepSeek API
**Researched:** 2026-05-08
**Confidence:** HIGH

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| AI SDK (`ai`) | ^6.0 | Server-side streaming, `streamText` for LLM calls, response orchestration | Official Vercel toolkit built for exactly this use case. Handles SSE streaming, message format conversion, and error handling out of the box. Zero plumbing. |
| `@ai-sdk/react` | ^3.0 | `useChat` hook — manages messages, input, streaming state, and API communication | Replaces 200+ lines of manual fetch/stream/state code with one hook. Handles `submitted → streaming → ready → error` lifecycle. Built for React 19. |
| `@ai-sdk/deepseek` | ^2.0 | DeepSeek API provider — model instantiation, auth, base URL | Official dedicated provider for DeepSeek. Defaults to `https://api.deepseek.com` and `DEEPSEEK_API_KEY` env var. Supports `deepseek-v4-flash` directly. No manual API configuration needed. |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Tailwind CSS 4 | ^4 (existing) | Styling the chat UI | Already in project. Use for message bubbles, input bar, layout. No new dependency. |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| Next.js 16 Route Handlers | API endpoint at `src/app/api/chat/route.ts` | Uses Web `Request`/`Response` API. Supports streaming via `ReadableStream` natively. No extra setup. |

## Installation

```bash
# Core — all three are required
npm install ai @ai-sdk/react @ai-sdk/deepseek
```

No dev dependencies needed. No separate chat UI library needed.

## Architecture

```
User types message
       ↓
useChat hook (client) — manages state, sends POST to /api/chat
       ↓
Route Handler (server) — streamText({ model: deepseek('deepseek-v4-flash'), ... })
       ↓
DeepSeek API — SSE stream with token deltas
       ↓
toUIMessageStreamResponse() — converts to UI message stream protocol
       ↓
useChat hook — appends chunks, re-renders in real-time
```

### Server: `src/app/api/chat/route.ts`

```typescript
import { deepseek } from '@ai-sdk/deepseek';
import { streamText } from 'ai';
import { convertToModelMessages } from 'ai';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: deepseek('deepseek-v4-flash'),
    system: '你是喵十七工具箱的AI助手，友好简洁地回答问题。',
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
```

### Client: `src/app/chat/page.tsx`

```tsx
'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useState } from 'react';

export default function ChatPage() {
  const [input, setInput] = useState('');
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: '/api/chat' }),
  });

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div key={msg.id} className={/* Tailwind classes for bubbles */}>
            {msg.parts.map((part, i) =>
              part.type === 'text' ? <span key={i}>{part.text}</span> : null
            )}
          </div>
        ))}
      </div>
      <form onSubmit={(e) => {
        e.preventDefault();
        if (input.trim()) { sendMessage({ text: input }); setInput(''); }
      }} className="p-4 border-t flex gap-2">
        <input value={input} onChange={(e) => setInput(e.target.value)} />
        <button type="submit" disabled={status !== 'ready'}>发送</button>
      </form>
    </div>
  );
}
```

### Environment

```
DEEPSEEK_API_KEY=your-key-here
```

The `@ai-sdk/deepseek` provider reads `DEEPSEEK_API_KEY` automatically.

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| `@ai-sdk/deepseek` (dedicated provider) | `@ai-sdk/openai-compatible` with `createOpenAICompatible` | Only if you need to swap providers at runtime or use a non-standard endpoint. The dedicated provider is simpler and less error-prone. |
| `@ai-sdk/deepseek` (dedicated provider) | Raw `fetch()` to DeepSeek API | Only if you want zero dependencies and are willing to manually handle SSE parsing, stream conversion, and error states. ~3-5x more code for the same result. |
| AI SDK `useChat` (headless hook) | Pre-built chat UI lib (e.g., AI Elements, chatscope) | Only if you need heavy UI features (markdown rendering, code highlighting, file upload) out of the box. For a simple chat, `useChat` + Tailwind is cleaner and matches existing project style. |
| Route Handler (`route.ts`) | Server Actions | Server Actions eliminate the separate endpoint file but add complexity for streaming. Route Handlers are the standard path for `useChat` — less setup, more examples, cleaner separation. |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| `@ai-sdk/openai` with `createOpenAI({ baseURL: 'https://api.deepseek.com' })` | The OpenAI provider may route to `/v1/responses` (new OpenAI endpoint) instead of `/v1/chat/completions`, causing 404 errors with DeepSeek. Confirmed bug in production apps. | `@ai-sdk/deepseek` — dedicated provider that always calls the correct endpoint. |
| `openai` npm package (official OpenAI SDK) | Adds ~2MB dependency for a single API call. The AI SDK is lighter and integrates with React hooks natively. | `@ai-sdk/deepseek` + `ai` — purpose-built for this pattern. |
| AI SDK v4 (`ai/react` import path) | v4 API is deprecated. `useChat` moved to `@ai-sdk/react` in v5+. Old import path will break. | AI SDK v6 with `@ai-sdk/react` package. |
| WebSocket-based chat | DeepSeek API uses SSE (Server-Sent Events), not WebSockets. Adding WS adds complexity for no benefit. | SSE streaming via AI SDK — the standard approach. |
| `deepseek-chat` / `deepseek-reasoner` model names | Deprecated — will stop working after 2026-07-24. | `deepseek-v4-flash` — current model ID. |

## Stack Patterns by Variant

**If adding thinking/reasoning mode later:**
- Add `thinking: { type: 'enabled' }` and `reasoning_effort: 'high'` to `streamText` options
- The AI SDK handles `reasoning_content` in the streamed response
- Use `msg.parts` to separate reasoning from content in the UI
- Because DeepSeek V4 supports reasoning as a request parameter on both flash and pro models

**If adding more LLM providers later (e.g., GLM):**
- Add the corresponding `@ai-sdk/*` provider package
- Use AI SDK's `createProviderRegistry` to register multiple providers
- Swap models in `streamText` without changing the client

**If needing persistence (chat history):**
- `useChat` accepts `id` and `initialMessages` props
- Store messages in localStorage or a database
- Load on mount via `initialMessages`

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| `ai@6` | `@ai-sdk/react@3` | v6 is the current stable. v5 API is different (uses `handleSubmit` instead of `sendMessage`). |
| `ai@6` | `@ai-sdk/deepseek@2` | Dedicated DeepSeek provider for v6. |
| `ai@6` | Next.js 16 | Route Handlers work with Web Streams API. No issues. |
| `ai@6` | React 19 | `@ai-sdk/react@3` supports React 19. |
| `ai@6` | Tailwind CSS 4 | No interaction — styling is independent. |

## Sources

- `/vercel/ai` — AI SDK useChat, streamText, DeepSeek provider configuration
- https://api-docs.deepseek.com/ — DeepSeek API endpoint, model IDs (`deepseek-v4-flash`), SSE streaming format
- https://ai-sdk.dev/providers/ai-sdk-providers/deepseek — Official `@ai-sdk/deepseek` provider docs
- https://ai-sdk.dev/v7/providers/openai-compatible-providers — OpenAI-compatible provider (alternative approach)
- https://nextjs.org/docs/app/guides/streaming — Next.js 16 streaming in Route Handlers
- npm registry — verified latest versions: `ai@6.0.176`, `@ai-sdk/react@3.0.178`, `@ai-sdk/deepseek@2.0.34`

---
*Stack research for: LLM Chat with DeepSeek API*
*Researched: 2026-05-08*
