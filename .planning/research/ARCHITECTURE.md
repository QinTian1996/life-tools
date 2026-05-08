# Architecture Research

**Domain:** LLM Chat Feature (DeepSeek) in Next.js App Router
**Researched:** 2026-05-08
**Confidence:** HIGH

## Standard Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser / Client                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐       │
│  │  ChatPage     │  │  ChatUI      │  │  useChat      │       │
│  │  (RSC entry)  │  │  (client)    │  │  (hook)       │       │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘       │
│         │                  │                  │               │
│         │     useState/useRef for messages    │               │
│         └──────────────────┴──────────────────┘               │
└─────────────────────────────┬───────────────────────────────┘
                              │ POST /api/chat (SSE stream)
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   Next.js API Route                          │
│              src/app/api/chat/route.ts                       │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────┐    │
│  │  POST handler:                                       │    │
│  │  1. Parse messages from request body                  │    │
│  │  2. Call DeepSeek API (stream: true)                  │    │
│  │  3. Pipe SSE chunks → ReadableStream → Response       │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────┬───────────────────────────────┘
                              │ HTTPS (streaming)
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    DeepSeek API                               │
│            https://api.deepseek.com/chat/completions          │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  OpenAI-compatible chat endpoint                      │    │
│  │  Auth: Bearer DEEPSEEK_API_KEY                        │    │
│  │  SSE: data: {...}\n\n  →  data: [DONE]               │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Implementation |
|-----------|----------------|----------------|
| `ChatPage` | Route entry, loads client shell | Server Component at `src/app/chat/page.tsx` |
| `ChatUI` | Message list + input + send button | Client Component (`"use client"`) |
| `useChat` | Chat state, fetch, stream parsing | Custom React hook |
| `API Route` | Proxy to DeepSeek, stream forward | `src/app/api/chat/route.ts` POST handler |
| DeepSeek API | LLM inference, streaming response | External service, server-side only |

## Recommended Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout (existing)
│   ├── page.tsx                # Home page (existing, add /chat link)
│   ├── globals.css             # Global styles (existing)
│   ├── chat/
│   │   └── page.tsx            # Chat page (thin RSC wrapper)
│   └── api/
│       └── chat/
│           └── route.ts        # DeepSeek streaming proxy
├── components/
│   └── chat/
│       ├── ChatUI.tsx          # Main chat client component
│       ├── MessageList.tsx     # Scrollable message display
│       ├── MessageBubble.tsx   # Single message rendering
│       └── ChatInput.tsx       # Text input + send button
└── hooks/
    └── useChat.ts              # Chat state & streaming logic
```

### Structure Rationale

- **`app/chat/page.tsx`:** Minimal server component — just renders `<ChatUI />`. Keeps the page as a thin shell per Next.js convention.
- **`components/chat/`:** All UI components are client components. Grouped by feature (`chat/`) for cohesion.
- **`hooks/useChat.ts`:** Extracts all streaming/state logic from UI. The hook owns message array, loading state, error state, and the fetch-stream pipeline.
- **`app/api/chat/route.ts`:** Single API route. No service layer needed — this is a simple proxy. If logic grows, extract to `lib/deepseek.ts`.

## Architectural Patterns

### Pattern 1: Server-Side API Proxy

**What:** The API route acts as a proxy between client and DeepSeek. The client never sees the API key.

**When to use:** Always. API keys must stay server-side. The route also allows adding rate limiting, logging, or request transformation later.

**Trade-offs:** Extra network hop (client → Next.js → DeepSeek) adds ~50ms latency. Acceptable for chat UX since streaming masks this.

```typescript
// app/api/chat/route.ts
export async function POST(request: Request) {
  const { messages } = await request.json()

  // Validate before streaming — status code can't change once stream starts
  if (!messages || !Array.isArray(messages)) {
    return Response.json({ error: "messages required" }, { status: 400 })
  }

  const response = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages,
      stream: true,
    }),
  })

  // Forward DeepSeek's SSE stream directly — no parsing needed server-side
  return new Response(response.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
    },
  })
}
```

### Pattern 2: Client-Side Stream Consumption via Custom Hook

**What:** A `useChat` hook encapsulates all streaming logic — fetch, parse SSE chunks, update state. Components just consume the hook's return value.

**When to use:** Any streaming chat UI. Keeps components pure and testable.

**Trade-offs:** Hook becomes the "god object" for chat state. For this project's scope (single chat, no history persistence), this is fine. If multi-conversation support is added later, extract to a context/store.

```typescript
// hooks/useChat.ts — simplified core logic
export function useChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isStreaming, setIsStreaming] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  const send = useCallback(async (content: string) => {
    const userMessage: Message = { role: "user", content }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setIsStreaming(true)

    const assistantMessage: Message = { role: "assistant", content: "" }
    setMessages([...updatedMessages, assistantMessage])

    const abortController = new AbortController()
    abortRef.current = abortController

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
        signal: abortController.signal,
      })

      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      if (!response.body) throw new Error("No response body")

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split("\n")
        buffer = lines.pop() ?? ""

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue
          const data = line.slice(6)
          if (data === "[DONE]") break

          try {
            const parsed = JSON.parse(data)
            const delta = parsed.choices?.[0]?.delta?.content
            if (delta) {
              assistantMessage.content += delta
              setMessages([...updatedMessages, { ...assistantMessage }])
            }
          } catch { /* skip malformed chunks */ }
        }
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return
      // Handle error state
    } finally {
      setIsStreaming(false)
    }
  }, [messages])

  const stop = useCallback(() => abortRef.current?.abort(), [])

  return { messages, isStreaming, send, stop }
}
```

### Pattern 3: Direct Stream Forwarding (No Server-Side Parse)

**What:** The API route pipes DeepSeek's raw SSE response directly to the client without parsing. Only the client parses SSE chunks.

**When to use:** Simple proxy scenarios where no server-side transformation is needed.

**Trade-offs:** Client must handle DeepSeek's specific SSE format. If you later need server-side logging of tokens or content filtering, you'll need to parse server-side (switch to Pattern 4).

### Pattern 4: Server-Side Stream Transform (Future)

**What:** Server parses DeepSeek SSE chunks, transforms/reformats, then streams to client.

**When to use:** When you need server-side content filtering, logging, token counting, or reformatting (e.g., stripping `reasoning_content` from DeepSeek thinking mode).

**Trade-offs:** Higher server CPU/memory. More complex error handling (must handle errors in both upstream and downstream).

## Data Flow

### Chat Message Flow

```
User types message
       ↓
ChatInput calls send(content)
       ↓
useChat hook:
  1. Appends user message to state
  2. Appends empty assistant message
  3. POST /api/chat { messages: [...] }
       ↓
API Route (server):
  1. Validates request
  2. Reads DEEPSEEK_API_KEY from env
  3. POST https://api.deepseek.com/chat/completions
       ↓
DeepSeek responds with SSE stream:
  data: {"choices":[{"delta":{"content":"Hello"}}]}
  data: {"choices":[{"delta":{"content":" world"}}]}
  data: [DONE]
       ↓
API Route forwards stream to client
       ↓
useChat hook:
  1. Reads chunks via ReadableStream reader
  2. Parses SSE lines (data: prefix)
  3. Extracts delta.content from each chunk
  4. Appends to assistant message → triggers re-render
       ↓
MessageList displays updated messages
```

### State Management

```
useChat hook (local state)
  ├── messages: Message[]          ← append-only, immutable updates
  ├── isStreaming: boolean         ← loading indicator
  ├── abortRef: AbortController    ← cancel in-flight request
  └── error: string | null         ← display errors

No global state needed — single chat session, no persistence.
```

### Key Data Flows

1. **User → Assistant:** User types → `send()` → API route → DeepSeek → SSE stream → hook parses → state update → re-render
2. **Stream Cancellation:** User clicks stop → `abortRef.current.abort()` → fetch cancels → reader stops → `isStreaming = false`
3. **Error Path:** DeepSeek API error → API route returns error JSON (before stream) OR stream contains error → hook catches → sets error state → UI shows error

## Component Design for Downstream Consumer

### Page Component: `src/app/chat/page.tsx`

```typescript
import { ChatUI } from "@/components/chat/ChatUI"

export default function ChatPage() {
  return (
    <main className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-slate-100">
      <ChatUI />
    </main>
  )
}
```

### Main Client Component: `src/components/chat/ChatUI.tsx`

```typescript
"use client"

import { useChat } from "@/hooks/useChat"
import { MessageList } from "./MessageList"
import { ChatInput } from "./ChatInput"

export function ChatUI() {
  const { messages, isStreaming, send, stop } = useChat()

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto">
      <header className="p-4 border-b">喵十七聊天助手</header>
      <MessageList messages={messages} isStreaming={isStreaming} />
      <ChatInput onSend={send} onStop={stop} isStreaming={isStreaming} />
    </div>
  )
}
```

### Message Types

```typescript
// hooks/useChat.ts
export interface Message {
  role: "user" | "assistant" | "system"
  content: string
}
```

## Build Order (Dependency-Aware)

| Order | Component | Depends On | Reason |
|-------|-----------|------------|--------|
| 1 | `types` (Message interface) | None | Foundation type used everywhere |
| 2 | `useChat` hook | types | Core logic — can test independently |
| 3 | `MessageBubble` | types | Pure presentational, no deps |
| 4 | `MessageList` | MessageBubble | Renders list of bubbles |
| 5 | `ChatInput` | None | Pure presentational with callback |
| 6 | `ChatUI` | useChat, MessageList, ChatInput | Assembles all pieces |
| 7 | `api/chat/route.ts` | None | Server-side, independent |
| 8 | `chat/page.tsx` | ChatUI | RSC wrapper, last to build |
| 9 | Home page update | None | Add /chat link to existing page |

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| 1-10 concurrent users | Current architecture is fine. No changes needed. |
| 10-100 concurrent users | Add request timeout (30s) to API route. Consider `maxDuration` config. |
| 100+ concurrent users | Add rate limiting middleware. Consider queue for DeepSeek requests. |

### Scaling Priorities

1. **First bottleneck:** DeepSeek API rate limits. Fix: Add client-side debounce, server-side rate limiting.
2. **Second bottleneck:** Long conversations exceed token limits. Fix: Implement message truncation or summarization in the API route.

## Anti-Patterns

### Anti-Pattern 1: Exposing API Key to Client

**What people do:** Call DeepSeek directly from the browser with the API key in a `REACT_APP_` or `NEXT_PUBLIC_` env var.
**Why it's wrong:** Anyone can steal the key from browser dev tools.
**Do this instead:** Always route through `/api/chat` server-side. Keep `DEEPSEEK_API_KEY` server-only (no `NEXT_PUBLIC_` prefix).

### Anti-Pattern 2: Buffering the Full Response Before Displaying

**What people do:** `await response.json()` the full DeepSeek response, then display it all at once.
**Why it's wrong:** Users stare at a loading spinner for 5-30 seconds while the full response generates.
**Do this instead:** Stream the response. Show each token as it arrives. Use `ReadableStream` + `TextDecoder` on the client.

### Anti-Pattern 3: Using `EventSource` for POST Requests

**What people do:** Use `new EventSource('/api/chat')` for SSE consumption.
**Why it's wrong:** `EventSource` only supports GET requests. Chat needs POST to send message history in the body.
**Do this instead:** Use `fetch()` with `response.body.getReader()` — supports POST + streaming.

### Anti-Pattern 4: Stale Closure in Streaming State Updates

**What people do:** Mutate state directly inside the streaming loop (`messages.push(newMsg)`).
**Why it's wrong:** React won't detect the mutation. The UI won't update.
**Do this instead:** Create new array references each time: `setMessages([...prev, updated])`. Use the functional form `setMessages(prev => [...])` for safety.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| DeepSeek API | Server-side fetch (OpenAI-compatible) | Base URL: `https://api.deepseek.com`. Bearer token auth. SSE streaming via `stream: true`. |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| ChatUI ↔ useChat | Hook return value (state + callbacks) | Unidirectional data flow — UI never mutates state directly |
| useChat ↔ API Route | `fetch` POST with SSE response | Standard HTTP, no WebSocket needed |
| API Route ↔ DeepSeek | Server-side `fetch` with Bearer auth | API key never leaves server |
| Home Page ↔ Chat Page | `<a href="/chat">` link | Standard Next.js navigation, no shared state |

## Key Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Streaming approach | Raw `fetch` + `ReadableStream` | No external deps. Next.js route handlers support Web Streams natively. |
| State management | Local state via `useChat` hook | Single chat session, no persistence. No need for Zustand/Redux. |
| DeepSeek model | `deepseek-chat` | Cheapest, fastest. Can upgrade to `deepseek-reasoner` for complex queries later. |
| Message history | In-memory only (useState) | No persistence requirement for MVP. History lost on page refresh. |
| Auto-scroll | `useRef` + `scrollIntoView` | Scroll to bottom on new message. Essential for chat UX. |

## Sources

- [Next.js Route Handler Streaming](https://nextjs.org/docs/app/api-reference/file-conventions/route#streaming) — Official docs for `ReadableStream` in route handlers
- [Next.js Streaming Guide](https://nextjs.org/docs/app/guides/streaming) — Streaming architecture concepts
- [DeepSeek API Docs](https://api-docs.deepseek.com/) — OpenAI-compatible chat completions API
- Web Streams API — `ReadableStream`, `TextEncoder`, `TextDecoder` (standard browser/Node APIs)
- Project codebase: `.planning/codebase/ARCHITECTURE.md`, `.planning/codebase/CONVENTIONS.md`

---
*Architecture research for: LLM Chat Feature (DeepSeek) in Next.js*
*Researched: 2026-05-08*
