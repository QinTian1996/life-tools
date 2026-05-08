# Pitfalls Research

**Domain:** LLM Chat Interface (DeepSeek API, Next.js 16, Server-Sent Events)
**Researched:** 2026-05-08
**Confidence:** HIGH

## Critical Pitfalls

### Pitfall 1: No `maxTokens` — Unbounded Token Generation

**What goes wrong:**
API calls send requests without `max_tokens` limit. A simple question like "yes or no?" can generate 4,000+ tokens. Cost per request becomes unpredictable. A retry loop hitting a verbose model once burned $2,400 in 3 hours.

**Why it happens:**
LLM APIs default to generating until the model decides it's done. Developers test with short responses and never see the problem until a user sends a vague open-ended prompt.

**How to avoid:**
- Set `max_tokens: 1024` (or appropriate limit) on every API call — never omit it
- Validate input length server-side before sending to LLM
- Log token usage per request with estimated cost

**Warning signs:**
- API cost spikes disproportionate to traffic
- Some responses are unexpectedly long (model "rambling")
- No `max_tokens` field visible in the API route handler

**Phase to address:**
Phase 1 (API route + streaming) — set maxTokens from the very first API call

---

### Pitfall 2: Exposing API Key Client-Side

**What goes wrong:**
The LLM API key is accessible from the browser. Anyone can extract it and make requests on your dime. This happens when the key is in a `NEXT_PUBLIC_` env var or accidentally bundled into client components.

**Why it happens:**
Developers put the key in `.env` without the `NEXT_PUBLIC_` prefix distinction. Or they call the LLM API directly from a `"use client"` component instead of routing through a server-side API route.

**How to avoid:**
- API key must be `DEEPSEEK_API_KEY` (no `NEXT_PUBLIC_` prefix)
- ALL LLM calls go through server-side Route Handlers (`src/app/api/chat/route.ts`)
- Client components only call your own API route, never the provider directly
- Verify with `npm run build` — search the output bundle for your key pattern

**Warning signs:**
- `NEXT_PUBLIC_DEEPSEEK_API_KEY` appears anywhere in code
- A `"use client"` component imports or references an LLM SDK
- The API route is missing — client fetches `https://api.deepseek.com/...` directly

**Phase to address:**
Phase 1 (API route) — the Route Handler must exist before any client code calls it

---

### Pitfall 3: Streaming Errors Rendered as Chat Text

**What goes wrong:**
When streaming via SSE/NDJSON, the HTTP response already started with status 200. If the provider hits a rate limit, content filter, or timeout mid-stream, the error gets written into the stream as plain text. The frontend can't distinguish "Rate limit exceeded" from actual AI output, so it renders the error as if the AI said it.

**Why it happens:**
Developers parse the stream body as text without structured event types. Everything that comes through `reader.read()` gets concatenated into the response string.

**How to avoid:**
- Use structured SSE event types: `event: token`, `event: error`, `event: done`
- Client-side: check event type before appending to message
- Vercel AI SDK's `useChat` handles this automatically if you use `streamText` + `toDataStreamResponse`
- If hand-rolling SSE: prefix error messages with a known delimiter, parse on client

**Warning signs:**
- Error messages like "429 Too Many Requests" appearing in chat bubbles
- Partial response followed by raw JSON error text rendered to user
- No `event:` field in SSE data — everything is `data: ...`

**Phase to address:**
Phase 1 (streaming) — error-vs-content distinction must be built into the stream protocol from day one

---

### Pitfall 4: Conversation History Grows Unbounded (Quadratic Cost)

**What goes wrong:**
Every message in the conversation is re-sent with each new request. By turn 30, input tokens can exceed 15,000 per request. Cost grows quadratically — a 50-message conversation sends all 50 messages every time. The monthly bill surprises you.

**Why it happens:**
The simplest implementation passes the full `messages[]` array to the API on every request. It works fine for the first 5 messages during testing. Nobody stress-tests with 30+ message conversations.

**How to avoid:**
- Implement a sliding window: keep only the last N messages (e.g., 20)
- For important early context, consider a system prompt or "memory" summary
- Log conversation depth and token count per request
- Set a hard cap on conversation length (e.g., 50 messages, then reset)

**Warning signs:**
- `messages` array is passed to API without any truncation or windowing
- No limit on how many messages can accumulate
- Token count per request grows linearly with conversation length

**Phase to address:**
Phase 1 (API route) — implement message window in the route handler, not later

---

### Pitfall 5: No Abort/Stop Mechanism

**What goes wrong:**
Users can't stop generation. If the model misunderstands the question and starts rambling, every token after the user mentally checks out is wasted money. The user must wait for the full response before continuing.

**Why it happens:**
The streaming demo works, and nobody thinks about the "I want to stop this" case. AbortController is easy to add retroactively but often forgotten in the initial build.

**How to avoid:**
- Create an `AbortController` on each request, pass `signal` to fetch
- Show a "Stop" button while streaming is active
- On abort: keep the partial response visible, mark it as interrupted
- Allow retry/edit from the partial response

**Warning signs:**
- No "Stop" or "Cancel" button visible during streaming
- `AbortController` is not used anywhere in the fetch call
- User must wait for full generation before sending next message

**Phase to address:**
Phase 2 (chat UI) — the stop button is part of the streaming UI, not an afterthought

---

### Pitfall 6: Function Timeout Kills Streams Silently

**What goes wrong:**
Vercel Hobby tier kills functions after 10s (60s max). Edge runtime caps at 25s. Longer LLM responses (code generation, detailed explanations) get cut off mid-sentence with no error. User sees an incomplete response and no explanation.

**Why it happens:**
Developers test locally where Node.js has no such limits. The timeout only hits in production, and it doesn't throw a catchable error — the connection just closes.

**How to avoid:**
- Use Node.js runtime (not Edge) for the chat API route: no `export const runtime = 'edge'`
- Set `export const maxDuration = 60` in the route handler
- Set `export const dynamic = 'force-dynamic'` to prevent caching
- Send heartbeat events every 15s to prevent idle proxy timeouts
- Handle stream closure gracefully — preserve partial response

**Warning signs:**
- Responses cut off at consistent lengths (10s/25s mark)
- No `maxDuration` export in the API route
- Edge runtime used for long-generation endpoints
- Works locally but streams die in deployed environment

**Phase to address:**
Phase 1 (API route) — set runtime config before any streaming code

---

### Pitfall 7: Split UTF-8 Chunks Corrupt Streaming Text

**What goes wrong:**
Stream chunks can split mid-character for multi-byte UTF-8 (Chinese characters, emoji). The decoder receives half of a UTF-8 sequence, throws or produces garbled text. This is especially relevant for a Chinese-language tool.

**Why it happens:**
TCP chunks and SSE events don't respect character boundaries. A single Chinese character (3 bytes in UTF-8) can arrive as two separate chunks. Naive `TextDecoder` calls without `stream: true` corrupt the output.

**How to avoid:**
- Use `new TextDecoderStream()` (handles stream decoding automatically), OR
- Use a persistent `TextDecoder('utf-8', { stream: true })` — do NOT create a new decoder per chunk
- Never split raw bytes on arbitrary boundaries
- Buffer partial SSE frames, split only on `\n\n` boundaries

**Warning signs:**
- Garbled characters appearing in chat output
- The replacement character (�) showing up
- Bug only appears with Chinese/emoji input, never with ASCII

**Phase to address:**
Phase 1 (streaming) — correct TextDecoder usage from the first streaming implementation

---

## Technical Debt Patterns

Shortcuts that seem reasonable but create long-term problems.

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Full conversation history (no windowing) | Simpler code, perfect context | Quadratic cost growth, API token limit errors | MVP with <10 message cap enforced in UI |
| `dangerouslySetInnerHTML` for markdown rendering | Quick rich-text display | XSS if model output contains `<script>` or malicious HTML | Never — use a proper markdown renderer |
| In-memory rate limiting | Zero dependencies, fast to implement | Resets on deploy, doesn't work across instances | Single-instance hobby deployment only |
| No retry logic on stream failure | Simpler error handling | Users must manually retry, poor UX | MVP — add retry-with-partial immediately after |
| Hardcoded system prompt | Quick to implement | Can't adjust per-use-case, hard to iterate | MVP — extract to config/env before adding features |
| Skip token logging | Less code | No cost visibility until bill arrives | Never — add basic logging from day one |

## Integration Gotchas

Common mistakes when connecting to external services.

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| DeepSeek API | Using Edge runtime — SDK streaming may not work | Use Node.js runtime (`export const runtime = 'nodejs'` or default) |
| DeepSeek API | Omitting `max_tokens` — model generates until internal limit | Always set `max_tokens` (1024–2048 for chat) |
| DeepSeek API | Not handling `Retry-After` header on 429 errors | Parse header, implement exponential backoff with jitter |
| DeepSeek SSE | Parsing `data: ...` without checking for `data: [DONE]` | Check for stream termination signal before parsing JSON |
| Vercel deployment | Not setting `maxDuration` — streams die at 10s default | Set `export const maxDuration = 60` on chat route |
| Vercel deployment | Forgetting `dynamic = 'force-dynamic'` — response gets cached | Always set `export const dynamic = 'force-dynamic'` |
| React state | Calling `setState` on every streaming token — 60fps re-renders | Batch updates, use `requestAnimationFrame`, or use `useChat` from Vercel AI SDK |

## Performance Traps

Patterns that work at small scale but fail as usage grows.

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| setState on every streaming token | UI jank, high CPU, sluggish typing | Batch tokens (accumulate 3–5 before render) or use `requestAnimationFrame` | ~50 tokens/sec on low-end devices |
| Full message history per request | API latency grows with conversation length | Sliding window (last 20 messages) + optional summary | ~15 messages per conversation |
| No connection timeout | Browser hangs indefinitely on dead connections | Set AbortController timeout (30s for first token, 60s total) | First network hiccup |
| Server-side buffering of full response | User sees nothing for 10–40 seconds, then entire response at once | Stream tokens immediately — use `streamText` not `generateText` | Any response >100 tokens |
| Single fetch with no reconnect | Network switch (WiFi→cellular) kills entire conversation | Handle `reader.read()` errors, preserve partial state, allow retry | Mobile users, unstable connections |

## Security Mistakes

Domain-specific security issues beyond general web security.

| Mistake | Risk | Prevention |
|---------|------|------------|
| `NEXT_PUBLIC_` prefixed API key | Anyone can extract key from browser bundle, make requests on your dime | Never prefix LLM API keys with `NEXT_PUBLIC_`; keep server-side only |
| No input validation before LLM call | Prompt injection, excessively long inputs costing real money | Validate input length (<500 chars for chat), strip control characters |
| Rendering LLM output as raw HTML | XSS via model-generated `<script>` or `<img onerror=...>` | Use markdown renderer that sanitizes HTML (react-markdown + rehype-sanitize) |
| No rate limiting on API route | Single user can fire 100 requests/min, burning through API budget | Per-IP rate limit (10 requests/min for personal tool) — even in-memory is fine |
| Client-side API key construction | Key assembled from env vars or hardcoded in client code | All LLM requests go through server Route Handler exclusively |

## UX Pitfalls

Common user experience mistakes in this domain.

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| No "typing" indicator before first token | User thinks nothing happened, clicks send again (duplicate requests) | Show animated dots/spinner immediately on send, replace with streaming text |
| No stop button during generation | User must wait for full response even when model is off-track | Visible "Stop" button replaces "Send" during streaming |
| Error messages shown as chat text | User thinks the AI said "429 Rate Limit Exceeded" | Render errors distinctly (different color, icon, "Retry" button) |
| Blank screen while waiting for first token | Users abandon after 3–5 seconds of nothing | Skeleton/typing animation within 100ms of send |
| Lost conversation on page refresh | All context gone, frustrating re-explanation | Persist messages to `localStorage` or URL state |
| No way to retry failed messages | User must retype the entire prompt | "Retry" button on failed messages, pre-fills the input |
| Truncated response with no explanation | User thinks the AI gave an incomplete answer | Show "Response interrupted" badge + retry button on partial responses |

## "Looks Done But Isn't" Checklist

Things that appear complete but are missing critical pieces.

- [ ] **Streaming UI:** Works with ASCII but garbles Chinese/multi-byte characters — verify with Chinese input text
- [ ] **Error handling:** Handles happy path but not mid-stream failures — verify by disconnecting network during generation
- [ ] **API route:** Works in dev but times out in production — verify `maxDuration` and `dynamic` exports are set
- [ ] **Message display:** Shows text but doesn't render markdown (code blocks, bold, lists look raw) — verify with markdown-heavy response
- [ ] **Cost control:** Has `max_tokens` set but no conversation window — verify token count doesn't grow with conversation length
- [ ] **Stop button:** Present but doesn't actually abort the server-side request — verify AbortController signal is passed to fetch
- [ ] **Empty state:** Chat works but initial load shows nothing — verify welcome message or prompt suggestions appear
- [ ] **Mobile layout:** Works on desktop but input is hidden behind keyboard — verify on mobile viewport

## Recovery Strategies

When pitfalls occur despite prevention, how to recover.

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| API key exposed in bundle | HIGH | 1. Rotate key immediately 2. Remove `NEXT_PUBLIC_` prefix 3. Audit all client components for direct API calls 4. Rebuild and verify key not in bundle |
| Unbounded token costs | MEDIUM | 1. Add `max_tokens` to all API calls 2. Add conversation window 3. Set provider spending limit 4. Review billing logs for anomalous usage |
| Streaming errors shown as text | LOW | 1. Add structured SSE event types 2. Update client parser to handle `event: error` 3. Add error-specific UI (retry button, rate limit countdown) |
| Function timeout killing streams | LOW | 1. Add `maxDuration = 60` export 2. Confirm Node.js runtime (not Edge) 3. Add heartbeat events for long connections |
| UTF-8 corruption in Chinese text | LOW | 1. Replace per-chunk `TextDecoder` with `TextDecoderStream` or `{ stream: true }` 2. Test with Chinese text specifically |
| No rate limiting | MEDIUM | 1. Add per-IP rate limit middleware 2. Return 429 with `Retry-After` header 3. Set provider-side spending cap as backstop |

## Pitfall-to-Phase Mapping

How roadmap phases should address these pitfalls.

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| No maxTokens | Phase 1: API Route + Streaming | Assert `max_tokens` is set in every API call; log token counts |
| Exposed API key | Phase 1: API Route + Streaming | Build bundle, search for key string; grep for `NEXT_PUBLIC_DEEPSEEK` |
| Stream errors as text | Phase 1: API Route + Streaming | Simulate 429 error, verify client renders error badge not chat text |
| Unbounded conversation | Phase 1: API Route + Streaming | Send 30+ messages, verify input tokens stay bounded |
| No stop button | Phase 2: Chat UI | Verify AbortController signal is wired; test stop mid-generation |
| Function timeout | Phase 1: API Route + Streaming | Verify `maxDuration` and `dynamic` exports exist in route handler |
| UTF-8 corruption | Phase 1: API Route + Streaming | Stream Chinese text, verify no garbled characters |
| No rate limiting | Phase 1: API Route + Streaming | Send 20 rapid requests, verify some get rejected with 429 |
| XSS via markdown | Phase 2: Chat UI | Send prompt that returns `<script>alert(1)</script>`, verify sanitized |
| No error/loading states | Phase 2: Chat UI | Disconnect network mid-stream, verify graceful partial + retry |

## Sources

- Fordel Studios: "How to Add Streaming AI to Your Next.js App Without a Surprise API Bill" (2026-04)
- Vladimir Siedykh: "Production AI Streaming Next.js: Bulletproof Patterns" (2025-09)
- Eaures: "Streaming LLM Responses in Next.js with SSE (No Timeouts)" (2025-08)
- TheCodeForge: "Building Production-Grade AI Features in Next.js 16" (2026-04)
- Upstash Blog: "Using SSE to Stream LLM Responses in Next.js" (2024-05)
- Morley Media: "Integrating LLMs into Your Next.js App" (2026-02)
- Masaki Hirokawa / Claude Lab: "Three Hidden Pitfalls When Implementing Claude API Streaming" (2026-04)
- GetStream: "Adding AI Chat Features to a Modern Next.js Application" (2024-11)

---
*Pitfalls research for: LLM Chat Interface (DeepSeek API, Next.js 16)*
*Researched: 2026-05-08*
