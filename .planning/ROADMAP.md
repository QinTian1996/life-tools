# Roadmap: 喵十七的工具箱

**Status:** v1.0 ARCHIVED (2026-05-09)
**Active Milestone:** None

---

## v1.0 LLM Chat Entry — ARCHIVED

**Archived:** 2026-05-09 | 2 phases, 4 plans, 4 commits

### Phase 1: API Route + Streaming Backend — ARCHIVED

**Goal:** Server-side DeepSeek streaming proxy with cost controls and error handling.

All client features depend on this API route. Establish the streaming pipeline, security model (server-only key), and cost controls before any UI work. This phase prevents 5 of 7 critical pitfalls from reaching production.

**Requirements:** CHAT-03, CHAT-07, CHAT-08

**Stack:** `ai@6`, `@ai-sdk/deepseek@2`, Next.js Route Handler

**Success Criteria:**
1. POST to `/api/chat` with `{ messages: [{ role: "user", content: "Hello" }] }` returns a streaming SSE response with real-time tokens from DeepSeek `deepseek-v4-flash`
2. API returns non-200 error response when `DEEPSEEK_API_KEY` is missing or DeepSeek API returns an error (no stack traces leaked)
3. API enforces `maxTokens` limit (1024) to prevent unbounded generation cost
4. Conversation history is windowed to last 20 messages to control quadratic cost growth
5. Route Handler uses Node.js runtime (not Edge) with `maxDuration = 60` to prevent deployment timeouts

**Key Pitfalls Addressed:** maxTokens limit, API key exposure, stream errors rendered as text, unbounded conversation cost, function timeout

**Plans:** 2 plans

Plans:
- [x] 01-01-PLAN.md — Install AI SDK packages + create .env.example
- [x] 01-02-PLAN.md — Create /api/chat route handler with POST streaming + GET health

---

### Phase 2: Chat UI + Home Page — ARCHIVED

**Goal:** Client-side chat interface with streaming display and home page navigation.

Build the user-facing chat experience on top of the working API route. The `useChat` hook from `@ai-sdk/react` manages message state, streaming lifecycle, and abort control. UI components are presentational Tailwind work.

**Requirements:** CHAT-01, CHAT-02, CHAT-04, CHAT-05, CHAT-06, HOME-01

**Stack:** `@ai-sdk/react@3` (`useChat` hook), Tailwind CSS 4, React 19

**Success Criteria:**
1. Home page displays "聊天" button styled consistently with existing "八字" and "吃啥" buttons, linking to `/chat`
2. User types a message in textarea, presses Enter (or clicks send button), message appears immediately as user bubble
3. AI response streams token-by-token in real-time, displayed as visually distinct assistant bubble
4. Chat view auto-scrolls to show latest message during and after streaming
5. Loading indicator (spinner/dots) visible while AI is generating response

**Components:** ChatUI, MessageList, MessageBubble, ChatInput

**Plans:** 2/2 plans complete

Plans:
- [x] 02-01-PLAN.md — Create Chat UI components (MessageBubble, MessageList, ChatInput, ChatUI, page)
- [x] 02-02-PLAN.md — Add "聊天" button to home page

**Goal:** Client-side chat interface with streaming display and home page navigation.

Build the user-facing chat experience on top of the working API route. The `useChat` hook from `@ai-sdk/react` manages message state, streaming lifecycle, and abort control. UI components are presentational Tailwind work.

**Requirements:** CHAT-01, CHAT-02, CHAT-04, CHAT-05, CHAT-06, HOME-01

**Stack:** `@ai-sdk/react@3` (`useChat` hook), Tailwind CSS 4, React 19

**Success Criteria:**
1. Home page displays "聊天" button styled consistently with existing "八字" and "吃啥" buttons, linking to `/chat`
2. User types a message in textarea, presses Enter (or clicks send button), message appears immediately as user bubble
3. AI response streams token-by-token in real-time, displayed as visually distinct assistant bubble
4. Chat view auto-scrolls to show latest message during and after streaming
5. Loading indicator (spinner/dots) visible while AI is generating response

**Components:** ChatUI, MessageList, MessageBubble, ChatInput

---

## v2 Deferred

The following are documented in REQUIREMENTS.md as v2 and are NOT part of this roadmap:
- CHAT-09: Markdown rendering
- CHAT-10: Copy message button
- CHAT-11: Clear conversation button
- CHAT-12: Empty state / welcome message
- CHAT-13: Stop generation button

---
*Roadmap created: 2026-05-08*
*Last updated: 2026-05-09 — v1.0 archived*
