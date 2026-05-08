# Feature Research

**Domain:** LLM Chat Interface (personal toolbox)
**Researched:** 2026-05-08
**Confidence:** HIGH

## Context

Simple chat feature for 喵十七的工具箱 — a personal toolbox of casual tools for friends. This is one tool among several (bazi calculator, food picker). No auth. Single model (DeepSeek). Greenfield — no existing API routes or chat code.

**Stack:** Next.js 16 + React 19 + Tailwind CSS 4 + DeepSeek API (`deepseek-v4-flash`)
**AI SDK:** Vercel AI SDK (`ai` + `@ai-sdk/deepseek`) provides `useChat` hook + streaming out of the box.

---

## Feature Landscape

### Table Stakes (Users Expect These)

Features users assume exist. Missing these = product feels broken.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Message input field | Core interaction — no input = no chat | LOW | Textarea, clear on send. AI SDK `useChat` provides `input` + `handleInputChange` |
| Send button + Enter key | Both triggers expected | LOW | Form submit with `handleSubmit` from `useChat` |
| Conversation display | Users need to see what they said and the reply | LOW | Map `messages` array from `useChat` to styled bubbles |
| User vs Assistant styling | Must visually distinguish who said what | LOW | Alignment (right/left), colors, optional avatar |
| Loading/streaming state | Users need feedback that something is happening | LOW | AI SDK `status` field: `'ready'` / `'streaming'`. Show typing indicator or spinner |
| Error handling | API failures happen — users need to know | LOW | AI SDK provides `error` field. Show user-friendly toast/message |
| Server-side API route | API key must NOT be exposed to client | MEDIUM | `src/app/api/chat/route.ts` — proxy to DeepSeek via `@ai-sdk/deepseek` |
| Auto-scroll to latest message | Without this, new messages appear off-screen | LOW | `scrollIntoView` ref on new message. ~5 lines of code |

### Nice-to-Have (Enhance UX, Can Defer)

Features that improve the experience but aren't required for first launch.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Streaming responses | Real-time token display vs staring at blank screen for seconds | LOW* | AI SDK `streamText` handles this natively. *Low with AI SDK, MEDIUM without |
| Markdown rendering | AI responses include lists, bold, headers, code blocks | LOW | `react-markdown` package. Without it, raw `**bold**` looks broken |
| Conversation persistence (localStorage) | Messages survive page refresh | LOW | `useEffect` save/load messages array to `localStorage`. ~20 lines |
| Copy message button | Copy AI response (especially code) in one click | LOW | `navigator.clipboard.writeText()` + icon button |
| Clear conversation | Start fresh without reloading page | LOW | Reset messages array + localStorage |
| Empty state / welcome message | Guides new users on what to do | LOW | Static message or suggestion chips when `messages.length === 0` |
| Code syntax highlighting | Colorized code in AI responses | MEDIUM | `react-syntax-highlighter` or `rehype-pretty-code`. Adds bundle weight (~50KB) |
| Stop generation button | Cancel a long-running response mid-stream | LOW | AI SDK provides `stop()` function. One button |
| Responsive design | Works on mobile devices | LOW | Already using Tailwind — ensure flex layout + proper sizing |
| New conversation button | Reset and start fresh conversation | LOW | Clear messages + localStorage + optionally reset API thread |

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem good but create problems for this project.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Multi-model switching | "Let users pick between GPT/Claude/DeepSeek" | Adds abstraction layer, UI complexity, multiple API keys — for a single-model personal tool | Hardcode single model. Add switching later IF needed |
| User authentication | "Protect the API from abuse" | OAuth/sessions/passwords = massive scope increase for a friends-only tool | Share URL privately. Rate-limit at infra level if needed |
| Message editing | "Let me fix my typos" | Breaks conversation context, adds complex branching state | Just send a new message with correction. LLMs handle this fine |
| Prompt engineering UI | "Temperature sliders, system prompt fields" | Configuration UI for a casual tool — nobody will use it | Hardcode good defaults in the API route |
| Conversation export (PDF/Markdown) | "Save interesting chats" | Adds rendering pipeline for marginal value | Browser print / Ctrl+S if truly needed |
| Chat branching/forking | "Explore different paths from a message" | Exponentially complex state management | Start new conversation instead |
| Shared conversations | "Send a link to a chat" | Requires database, unique URLs, auth | Screenshot or copy-paste |
| Usage analytics | "Track API costs" | Adds tracking infra for a personal tool | Check DeepSeek dashboard directly |
| File/image upload | "Chat with images" | DeepSeek `v4-flash` doesn't support vision. Adds multipart handling | Text-only chat is the right scope |

---

## Feature Dependencies

```
[Server API Route]
    └──required-by──> [Message Input + Send]
                          └──required-by──> [Conversation Display]
                                                └──required-by──> [Auto-Scroll]
                                                └──required-by──> [User/Assistant Styling]

[Streaming Responses] ──requires──> [Server API Route]
                                └──requires──> [@ai-sdk/deepseek package]

[Markdown Rendering] ──enhances──> [Conversation Display]

[Code Syntax Highlighting] ──requires──> [Markdown Rendering]

[Conversation Persistence] ──requires──> [Conversation Display]

[Stop Generation] ──requires──> [Streaming Responses]

[Copy Message] ──requires──> [Conversation Display]

[New Conversation] ──requires──> [Conversation Persistence]
```

### Dependency Notes

- **All features require Server API Route:** The DeepSeek API key must stay server-side. Every client feature depends on having the `/api/chat` route working first.
- **Streaming requires @ai-sdk/deepseek:** Using Vercel AI SDK makes streaming near-zero effort. Without it, you'd manually handle `ReadableStream` + `TextDecoder`.
- **Markdown enhances Display:** Not technically required, but AI responses look terrible without it (raw `**bold**` syntax).
- **Code Highlighting requires Markdown:** Must parse markdown before you can highlight code blocks within it.
- **Stop requires Streaming:** Only meaningful when responses stream in gradually.

---

## MVP Definition

### Launch With (v1)

Minimum viable product — what's needed to validate the concept.

- [ ] **Server API route** (`/api/chat`) — proxy to DeepSeek, keeps API key server-side
- [ ] **Message input + send** — textarea with Enter-to-send and send button
- [ ] **Streaming responses** — AI SDK `streamText` for real-time token display (low effort, high impact)
- [ ] **Conversation display** — scrollable message list with user/assistant distinction
- [ ] **Auto-scroll** — always show latest message
- [ ] **Error handling** — show user-friendly error on API failure
- [ ] **Loading/streaming state** — visual feedback while waiting

### Add After Validation (v1.x)

Features to add once core is working and validated.

- [ ] **Markdown rendering** — `react-markdown` for proper AI response formatting
- [ ] **Conversation persistence** — localStorage to survive page refresh
- [ ] **Copy message button** — one-click copy for AI responses
- [ ] **Clear/new conversation button** — start fresh without page reload
- [ ] **Empty state / welcome message** — guide users on first visit
- [ ] **Stop generation** — cancel mid-stream (AI SDK `stop()`)

### Future Consideration (v2+)

Features to defer until the chat is actually being used regularly.

- [ ] **Code syntax highlighting** — adds bundle weight, only worth it if users frequently ask coding questions
- [ ] **Responsive design polish** — basic Tailwind responsiveness is enough for v1
- [ ] **System prompt configuration** — customize AI behavior (e.g., "you are a helpful assistant that speaks Chinese")

---

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Server API route | HIGH | MEDIUM | P1 |
| Message input + send | HIGH | LOW | P1 |
| Conversation display | HIGH | LOW | P1 |
| Streaming responses | HIGH | LOW (with AI SDK) | P1 |
| User/assistant styling | HIGH | LOW | P1 |
| Auto-scroll to latest | MEDIUM | LOW | P1 |
| Error handling | MEDIUM | LOW | P1 |
| Loading state | MEDIUM | LOW | P1 |
| Markdown rendering | HIGH | LOW | P2 |
| Conversation persistence | MEDIUM | LOW | P2 |
| Copy message button | LOW | LOW | P2 |
| Clear conversation | LOW | LOW | P2 |
| Empty state | LOW | LOW | P2 |
| Stop generation | MEDIUM | LOW | P2 |
| Code syntax highlighting | LOW | MEDIUM | P3 |
| Responsive polish | LOW | LOW | P3 |
| System prompt config | LOW | LOW | P3 |

**Priority key:**
- P1: Must have for launch
- P2: Should have, add when possible
- P3: Nice to have, future consideration

---

## Key Technical Decisions

| Decision | Option A | Option B | Recommendation |
|----------|----------|----------|----------------|
| Chat SDK | Vercel AI SDK (`useChat`) | Hand-rolled fetch + state | **AI SDK** — handles streaming, state, errors out of the box. Saves ~200 lines of boilerplate |
| DeepSeek integration | `@ai-sdk/deepseek` package | Raw `fetch` to DeepSeek API | **@ai-sdk/deepseek** — one-line provider setup, OpenAI-compatible handling |
| State management | `useChat` hook (built-in) | `useState` + custom logic | **`useChat`** — manages messages, loading, errors, streaming |
| Response format | Streaming (`streamText`) | Wait-for-complete (`generateText`) | **Streaming** — dramatically better UX, same implementation cost with AI SDK |
| Persistence | `localStorage` | Database (SQLite/Postgres) | **localStorage** — zero infra, sufficient for personal tool |
| Markdown | `react-markdown` | Raw text | **react-markdown** — AI responses are markdown by default |
| Styling | Tailwind (existing) | Component library (shadcn) | **Tailwind only** — matches existing project style, no new deps |

---

## Competitor Feature Analysis

| Feature | ChatGPT | Claude.ai | Ours (v1) |
|---------|---------|-----------|-----------|
| Message input + send | ✓ | ✓ | ✓ |
| Streaming | ✓ | ✓ | ✓ |
| Conversation history | ✓ (DB) | ✓ (DB) | ✓ (localStorage) |
| Markdown rendering | ✓ | ✓ | P2 |
| Code highlighting | ✓ | ✓ | P3 |
| Multi-model | ✓ | ✓ | ✗ (single DeepSeek) |
| Auth | ✓ | ✓ | ✗ (no auth) |
| Stop generation | ✓ | ✓ | P2 |
| Copy message | ✓ | ✓ | P2 |
| File upload | ✓ | ✓ | ✗ |

**Our approach:** Minimal viable chat. ChatGPT/Claude are full products — we're building a single-feature tool for friends. Match on core interaction (send → stream → display), skip everything that requires infrastructure (auth, DB, multi-model).

---

## Sources

- Vercel AI SDK documentation — `useChat` hook, `streamText`, DeepSeek provider
- `docs/architecture.md` — existing project architecture notes (GLM API approach documented)
- `.planning/PROJECT.md` — current milestone requirements (DeepSeek API, `deepseek-v4-flash`)
- Codebase assessment — greenfield Next.js 16 + React 19 + Tailwind 4, no existing API routes

---
*Feature research for: LLM Chat Interface (喵十七的工具箱)*
*Researched: 2026-05-08*
