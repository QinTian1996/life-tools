# Project Research Summary

**Project:** 喵十七的工具箱 — AI Chat Feature
**Domain:** LLM Chat Interface (personal toolbox, friends-only, single model)
**Researched:** 2026-05-08
**Confidence:** HIGH

## Executive Summary

This research covers adding an LLM-powered chat feature to 喵十七的工具箱, a personal toolbox web app built with Next.js 16 + React 19 + Tailwind CSS 4. The feature connects to DeepSeek's `deepseek-v4-flash` model via streaming SSE, providing a real-time chat experience. The project is greenfield — no existing API routes or chat code — which means a clean implementation following proven patterns from day one.

The recommended approach uses Vercel AI SDK v6 (`ai` + `@ai-sdk/react` + `@ai-sdk/deepseek`) which provides the `useChat` hook for client-side state management and `streamText` for server-side streaming. This eliminates ~200 lines of boilerplate (manual SSE parsing, state lifecycle, error handling) and handles UTF-8 streaming, abort controllers, and structured error events automatically. The architecture is straightforward: a server-side API route proxies to DeepSeek (keeping the API key server-only), streams tokens back to the client via SSE, and the `useChat` hook renders them in real-time.

Key risks are well-understood and addressable in Phase 1: unbounded token generation (set `maxTokens`), API key exposure (server-only env var), conversation cost growth (sliding window), function timeouts on deployment platforms (`maxDuration` config), and UTF-8 corruption with Chinese text (AI SDK handles this, but hand-rolled approaches fail). All critical pitfalls have documented prevention strategies aligned to the build phases.

## Key Findings

### Recommended Stack

The Vercel AI SDK v6 ecosystem is purpose-built for this exact pattern — streaming LLM chat in Next.js App Router. It provides `streamText` for server-side streaming, `useChat` for client-side state, and `@ai-sdk/deepseek` as a dedicated provider that calls the correct DeepSeek endpoint (avoiding a known bug where the OpenAI provider routes to wrong endpoints). No separate chat UI library needed; Tailwind handles styling.

**Core technologies:**
- **AI SDK (`ai@6`):** `streamText` + `toUIMessageStreamResponse` — server-side streaming orchestration with zero plumbing
- **`@ai-sdk/react@3`:** `useChat` hook — manages messages, input, streaming state (`submitted → streaming → ready → error`), and API communication
- **`@ai-sdk/deepseek@2`:** DeepSeek provider — model instantiation with correct endpoint, reads `DEEPSEEK_API_KEY` automatically

**Installation:** `npm install ai @ai-sdk/react @ai-sdk/deepseek` — three packages, no dev dependencies.

### Expected Features

See [FEATURES.md](./FEATURES.md) for full breakdown.

**Must have (table stakes — P1):**
- Server API route (`/api/chat`) — proxies to DeepSeek, keeps API key server-side
- Message input + send — textarea with Enter-to-send and send button
- Streaming responses — real-time token display via `streamText`
- Conversation display — scrollable message list with user/assistant visual distinction
- Auto-scroll — always show latest message
- Error handling + loading state — user feedback on API failure and during generation

**Should have (competitive — P2):**
- Markdown rendering — `react-markdown` for AI response formatting (without it, raw `**bold**` looks broken)
- Conversation persistence — localStorage to survive page refresh
- Stop generation button — abort mid-stream (AI SDK provides `stop()`)
- Copy message button — one-click copy for AI responses
- Clear/new conversation — start fresh without page reload
- Empty state / welcome message — guide new users

**Defer (v2+):**
- Code syntax highlighting — adds ~50KB bundle weight, only worth it for coding-heavy usage
- System prompt configuration — hardcode good defaults for MVP
- Responsive design polish — basic Tailwind responsiveness sufficient for v1

**Anti-features (explicitly excluded):**
- Multi-model switching, user authentication, message editing, prompt engineering UI, file/image upload — all add complexity disproportionate to value for a personal friends-only tool

### Architecture Approach

The architecture follows a server-side proxy pattern: client → Next.js Route Handler → DeepSeek API. The API route at `src/app/api/chat/route.ts` receives the conversation history, calls DeepSeek with streaming enabled, and pipes the SSE response back to the client. The `useChat` hook (from `@ai-sdk/react`) manages all client-side state — message array, streaming status, error state, and abort control. No global state management needed; single chat session, in-memory state.

See [ARCHITECTURE.md](./ARCHITECTURE.md) for full data flow diagrams and component design.

**Major components:**
1. **API Route** (`src/app/api/chat/route.ts`) — server-side proxy to DeepSeek, validates input, sets `maxTokens`, implements message window, streams response
2. **ChatUI** (`src/components/chat/ChatUI.tsx`) — client component orchestrating message list, input, and hook integration
3. **useChat hook** (`@ai-sdk/react`) — manages messages, streaming lifecycle, error state, abort control — replaces hand-rolled state + fetch logic

**Project structure:**
```
src/
├── app/
│   ├── chat/page.tsx          # RSC wrapper
│   └── api/chat/route.ts      # DeepSeek streaming proxy
├── components/chat/
│   ├── ChatUI.tsx             # Main client component
│   ├── MessageList.tsx        # Scrollable message display
│   ├── MessageBubble.tsx      # Single message rendering
│   └── ChatInput.tsx          # Text input + send button
```

### Critical Pitfalls

See [PITFALLS.md](./PITFALLS.md) for full analysis with recovery strategies.

1. **No `maxTokens` limit** — A vague prompt can generate 4,000+ tokens at unpredictable cost. Set `maxTokens: 1024` on every API call from day one.
2. **API key exposed client-side** — `NEXT_PUBLIC_` prefix or direct client calls leak the key. All LLM calls must go through server Route Handler exclusively. Verify with `npm run build` bundle inspection.
3. **Streaming errors rendered as chat text** — Mid-stream 429/timeout errors appear as AI output if using naive stream parsing. AI SDK's `toUIMessageStreamResponse` handles this automatically; hand-rolled approaches need structured SSE event types.
4. **Unbounded conversation history (quadratic cost)** — Every message re-sent per request. Cost grows quadratically by turn 30+. Implement sliding window (last 20 messages) in the API route.
5. **Function timeout kills streams in production** — Works locally, dies silently in deployment (10s default). Set `maxDuration = 60` and use Node.js runtime (not Edge).

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: API Route + Streaming Core
**Rationale:** All client features depend on the server-side API route existing. Must establish the streaming pipeline, security model (server-only key), and cost controls before any UI work. This phase prevents 5 of 7 critical pitfalls from reaching production.
**Delivers:** Working streaming endpoint that accepts messages, calls DeepSeek, and returns token-by-token responses with proper error handling.
**Addresses:** Server API route, streaming responses, error handling (P1 features)
**Avoids:** Pitfalls 1 (maxTokens), 2 (API key exposure), 3 (stream errors as text), 4 (unbounded conversation), 6 (function timeout), 7 (UTF-8 corruption)
**Stack:** `ai@6`, `@ai-sdk/deepseek@2`, Next.js Route Handler

### Phase 2: Chat UI
**Rationale:** With the streaming API working, build the client-side interface that consumes it. The `useChat` hook from `@ai-sdk/react` handles most state management complexity. UI components are presentational Tailwind work.
**Delivers:** Full chat interface — message input, conversation display, user/assistant styling, auto-scroll, loading states, stop button.
**Uses:** `@ai-sdk/react@3` (`useChat` hook), Tailwind CSS 4
**Implements:** ChatUI, MessageList, MessageBubble, ChatInput components from architecture
**Addresses:** Message input + send, conversation display, auto-scroll, loading/streaming state, stop generation (P1 + P2 features)
**Avoids:** Pitfall 5 (no stop mechanism)

### Phase 3: Polish + Persistence
**Rationale:** After core chat works end-to-end, add quality-of-life features that improve daily usage. Markdown rendering is high-value since AI responses are markdown by default. localStorage persistence prevents lost conversations.
**Delivers:** Markdown rendering, conversation persistence, copy message, clear/new conversation, empty state welcome message.
**Addresses:** P2 features — markdown rendering, conversation persistence, copy message, clear conversation, empty state
**Stack additions:** `react-markdown` (+ optional `rehype-sanitize` for XSS prevention)

### Phase Ordering Rationale

- **Phase 1 before Phase 2:** All client features require the API route. Building UI without a working endpoint means mocking and rework. The streaming pipeline must be validated with real DeepSeek responses before UI consumption patterns are locked in.
- **Phase 2 before Phase 3:** Core interaction (send → stream → display) must be solid before adding enhancements. Persistence and markdown are useless if the streaming pipeline is fragile.
- **Phase 1 groups security + cost controls:** maxTokens, API key protection, message windowing, and timeout config are all server-side concerns best addressed in one pass during API route implementation.
- **Pitfall-driven ordering:** 6 of 7 critical pitfalls are addressed in Phase 1, preventing them from compounding through later phases.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 1:** AI SDK v6 `streamText` + `convertToModelMessages` API surface — the SDK is actively evolving and v6 has breaking changes from v5 (e.g., `sendMessage` vs `handleSubmit`). Verify exact API against `node_modules/next/dist/docs/` per project rules.
- **Phase 1:** DeepSeek `deepseek-v4-flash` model behavior with Chinese input — verify token limits and streaming behavior with CJK characters specifically.

Phases with standard patterns (skip deep research):
- **Phase 2:** React component patterns with `useChat` — well-documented, established patterns
- **Phase 3:** `react-markdown` integration + localStorage — standard patterns, no domain complexity

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | AI SDK v6 + DeepSeek provider verified against official docs and npm registry. Version compatibility matrix confirmed. |
| Features | HIGH | Standard chat feature landscape. MVP vs. enhancement distinction is clear. Anti-features well-justified for personal tool scope. |
| Architecture | HIGH | Standard Next.js App Router pattern with server-side proxy. Well-documented streaming approach. AI SDK handles most complexity. |
| Pitfalls | HIGH | 7 critical pitfalls sourced from production experience reports (2024-2026). Each has concrete prevention and recovery strategy. |

**Overall confidence:** HIGH

### Gaps to Address

- **AI SDK v6 exact API surface:** The `useChat` hook API changed between v5 and v6 (`handleSubmit` → `sendMessage`, `DefaultChatTransport` introduction). Verify exact imports and function signatures against installed package during Phase 1 planning. The `node_modules/next/dist/docs/` directory should be consulted per project AGENTS.md rules.
- **DeepSeek `deepseek-v4-flash` vs `deepseek-chat` naming:** STACK.md recommends `deepseek-v4-flash` (current), ARCHITECTURE.md references `deepseek-chat` (deprecated after 2026-07-24). Use `deepseek-v4-flash` — the discrepancy reflects the model rename timeline.
- **AI SDK vs hand-rolled hook:** ARCHITECTURE.md shows a manual `useChat` implementation while STACK.md recommends the AI SDK's built-in `useChat` from `@ai-sdk/react`. **Use the AI SDK version** — it handles SSE parsing, UTF-8 streaming, abort control, and error states automatically. The manual implementation is valuable as a reference for understanding the internals.

## Sources

### Primary (HIGH confidence)
- Vercel AI SDK official docs (`ai-sdk.dev`) — `useChat`, `streamText`, `toUIMessageStreamResponse`, DeepSeek provider configuration
- DeepSeek API docs (`api-docs.deepseek.com`) — endpoint, model IDs, SSE streaming format
- npm registry — verified latest versions: `ai@6.0.176`, `@ai-sdk/react@3.0.178`, `@ai-sdk/deepseek@2.0.34`

### Secondary (MEDIUM confidence)
- Fordel Studios (2026-04): Streaming AI in Next.js without surprise bills
- TheCodeForge (2026-04): Production-grade AI features in Next.js 16
- Eaures (2025-08): SSE streaming LLM responses with no timeouts
- Vladimir Siedykh (2025-09): Bulletproof production AI streaming patterns

### Tertiary (LOW confidence)
- Morley Media (2026-02): General LLM integration patterns
- GetStream (2024-11): AI chat features in modern Next.js — older patterns, pre-AI-SDK-v6

---
*Research completed: 2026-05-08*
*Ready for roadmap: yes*
