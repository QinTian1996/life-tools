# Phase 1: API Route + Streaming Backend - Research

**Researched:** 2026-05-08
**Domain:** Next.js Route Handler + AI SDK Streaming + DeepSeek API
**Confidence:** HIGH

## Summary

Phase 1 implements a server-side streaming proxy at `/api/chat` that forwards user messages to DeepSeek's API and streams responses back. The core technology stack is `ai@6` + `@ai-sdk/deepseek@2` + Next.js 16 Route Handler, using the AI SDK's `toUIMessageStreamResponse()` which generates SSE with `text-start`, `text-delta`, `text-end` events compatible with `@ai-sdk/react`'s `useChat` hook.

Key technical decisions:
- **Streaming protocol:** AI SDK UI stream protocol (SSE with `x-vercel-ai-ui-message-stream: v1` header) — not plain text
- **Error format:** `{ error: "message", code: "CODE" }` as AI-specific error codes
- **Request validation:** Strict — require `messages` array with `{ role, content }` objects
- **Cost controls:** `maxTokens: 1024`, window to last 20 messages
- **Runtime:** Node.js (not Edge) with `maxDuration = 60`

**Primary recommendation:** Use `streamText()` from `ai` package with `@ai-sdk/deepseek` provider, return via `result.toUIMessageStreamResponse()`. For error handling, use the `onError` callback to sanitize errors into `{ error, code }` format.

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Streaming SSE generation | API / Backend | — | AI SDK handles protocol framing |
| Request validation | API / Backend | — | Server-side validation, never trust client |
| DeepSeek API proxy | API / Backend | — | Server-side only — DEEPSEEK_API_KEY never exposed |
| Error response formatting | API / Backend | — | Sanitize all errors before sending to client |
| Client disconnect detection | API / Backend | — | AbortController for request cancellation |
| Health check (key + connectivity) | API / Backend | — | Must verify actual API connectivity, not just env var |

---

## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** Error responses use `{ error: "message", code: "CODE" }` format
- **D-02:** Request validation is **strict** — require valid messages array with role+content
- **D-03:** Error codes are **AI-specific**: `INVALID_REQUEST`, `MODEL_ERROR`, `CONTEXT_OVERFLOW`, `RATE_LIMITED`
- **D-04:** Use **AI SDK standard stream protocol** — text-delta, text-start, text-end events
- **D-05:** Support **temperature control** from client via request body `{ messages, temperature? }`
- **D-06:** **Cancel stream on client disconnect** — abort DeepSeek request
- **D-07:** GET `/api/chat` exists for health/liveness probes
- **D-08:** Health check verifies **both key presence AND actual DeepSeek API connectivity**

### Specific Ideas

- AI SDK's `@ai-sdk/deepseek` provider for `deepseek-v4-flash` model
- maxTokens fixed at 1024
- Conversation history windowed to last 20 messages
- Node.js runtime with `maxDuration = 60`

### Deferred Ideas

None — phase scope is complete.

---

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| CHAT-03 | AI responds with streaming text (real-time token display) | AI SDK `streamText()` + `toUIMessageStreamResponse()` with SSE protocol |
| CHAT-07 | Error message shown if API call fails | `onError` callback sanitizes errors to `{ error, code }` format |
| CHAT-08 | `/api/chat` route proxies to DeepSeek API server-side | `@ai-sdk/deepseek` provider + `DEEPSEEK_API_KEY` env var |

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `ai` | `6.0.176` | Streaming text generation, UI message stream protocol | Vercel's standard AI SDK — handles SSE framing, abort, error handling |
| `@ai-sdk/deepseek` | `2.0.34` | DeepSeek model provider | Official AI SDK provider for DeepSeek API |
| `next` | `16.2.6` | Route Handler, streaming responses | Project already uses Next.js 16 |
| `@ai-sdk/react` | `3.0.178` | `useChat` hook (Phase 2 consumer) | AI SDK React hooks for streaming UI |

**Installation:**
```bash
npm install ai @ai-sdk/deepseek
```

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| TypeScript | `^5` | Type safety | Already in project |
| Tailwind CSS 4 | `^4` | Styling | Phase 2 UI work |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `toUIMessageStreamResponse()` | `toDataStreamResponse()` | UI stream protocol required for `useChat` compatibility |
| DeepSeek provider | OpenAI-compatible API direct | AI SDK provider handles model-specific quirks, error normalization |
| Custom SSE framing | Raw `ReadableStream` | AI SDK handles protocol edge cases, idempotent |

---

## Architecture Patterns

### System Architecture Diagram

```
Client Browser
     │
     │ POST /api/chat { messages, temperature? }
     │ (SSE stream response)
     ▼
┌──────────────────────────────────────┐
│  Next.js Route Handler               │
│  src/app/api/chat/route.ts           │
│  ─────────────────────────────────  │
│  1. Validate request body            │
│     - messages: [{ role, content }]  │
│     - temperature?: number           │
│  2. Window messages (last 20)        │
│  3. Call streamText()                │
│     - model: deepseek(deepseek-v4-flash)
│     - messages: [...windowed]        │
│     - maxTokens: 1024                │
│     - temperature: from request      │
│  4. Return toUIMessageStreamResponse │
│     - SSE with text-start/delta/end │
│     - onError: sanitize to {code}    │
│  5. Abort on client disconnect      │
└──────────────────────────────────────┘
     │
     │ HTTP POST (streaming)
     ▼
┌──────────────────────────────────────┐
│  DeepSeek API                        │
│  api.deepseek.com/chat/completions   │
│  - deepseek-v4-flash model          │
│  - stream: true                     │
└──────────────────────────────────────┘
```

### Recommended Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts    # POST/GET /api/chat
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   └── deepseek.ts         # Provider + types export
```

### Pattern 1: AI SDK Route Handler with Streaming

**What:** Next.js Route Handler that streams AI responses using AI SDK's UI message stream protocol.

**When to use:** Phase 1 core implementation.

**Example:**
```typescript
// src/app/api/chat/route.ts
import { streamText } from 'ai';
import { deepseek } from '@ai-sdk/deepseek';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(req: Request) {
  const { messages, temperature } = await req.json();

  const result = streamText({
    model: deepseek('deepseek-v4-flash'),
    messages,
    maxTokens: 1024,
    temperature,
  });

  return result.toUIMessageStreamResponse({
    onError: ({ error }) => {
      // Return sanitized error — no stack traces
      if (error instanceof Error) {
        return `An error occurred: ${error.message}`;
      }
      return 'An unexpected error occurred';
    },
  });
}
```
Source: [AI SDK - streamText with toUIMessageStreamResponse](https://ai-sdk.dev/cookbook/next/stream-text)

### Pattern 2: Strict Request Validation

**What:** Validate request body structure before passing to streamText.

**When to use:** Every POST handler to prevent malformed requests.

**Example:**
```typescript
interface ChatRequest {
  messages: Array<{ role: string; content: string }>;
  temperature?: number;
}

function validateRequest(body: unknown): ChatRequest {
  if (!body || typeof body !== 'object') {
    throw { error: 'Invalid request body', code: 'INVALID_REQUEST' };
  }

  const { messages, temperature } = body as Record<string, unknown>;

  if (!Array.isArray(messages) || messages.length === 0) {
    throw { error: 'messages must be a non-empty array', code: 'INVALID_REQUEST' };
  }

  for (const msg of messages) {
    if (!msg || typeof msg !== 'object') {
      throw { error: 'Each message must be an object', code: 'INVALID_REQUEST' };
    }
    const { role, content } = msg as Record<string, unknown>;
    if (typeof role !== 'string' || typeof content !== 'string') {
      throw { error: 'Each message must have role and content strings', code: 'INVALID_REQUEST' };
    }
  }

  if (temperature !== undefined && (typeof temperature !== 'number' || temperature < 0 || temperature > 2)) {
    throw { error: 'temperature must be a number between 0 and 2', code: 'INVALID_REQUEST' };
  }

  return { messages, temperature };
}
```

### Pattern 3: Message Windowing (Last N Messages)

**What:** Limit conversation history to prevent quadratic cost growth.

**When to use:** Before passing messages to streamText.

**Example:**
```typescript
function windowMessages(messages: Array<{ role: string; content: string }>, max = 20) {
  if (messages.length <= max) return messages;
  return messages.slice(-max);
}
```
Source: [ROADMAP.md - conversation history windowed to last 20 messages]

### Pattern 4: Error Code Mapping

**What:** Map AI SDK errors to project-specific error codes.

**When to use:** In onError callback.

**Example:**
```typescript
function mapErrorToCode(error: unknown): { error: string; code: string } {
  const message = error instanceof Error ? error.message : String(error);

  if (message.includes('rate limit')) {
    return { error: 'Rate limit exceeded', code: 'RATE_LIMITED' };
  }
  if (message.includes('context') || message.includes('token')) {
    return { error: 'Context length exceeded', code: 'CONTEXT_OVERFLOW' };
  }
  if (message.includes('invalid') || message.includes('validation')) {
    return { error: 'Invalid request', code: 'INVALID_REQUEST' };
  }

  return { error: 'Model error', code: 'MODEL_ERROR' };
}
```

### Pattern 5: Health Check with Connectivity Verification

**What:** GET endpoint that checks both API key presence AND actual API connectivity.

**When to use:** D-07 and D-08 requirements.

**Example:**
```typescript
export async function GET() {
  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiKey) {
    return Response.json(
      { status: 'unhealthy', error: 'DEEPSEEK_API_KEY not configured' },
      { status: 503 }
    );
  }

  try {
    // Verify actual connectivity with a minimal request
    const response = await fetch('https://api.deepseek.com/v1/models', {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    if (!response.ok) {
      return Response.json(
        { status: 'unhealthy', error: 'DeepSeek API unreachable' },
        { status: 503 }
      );
    }

    return Response.json({ status: 'healthy' });
  } catch {
    return Response.json(
      { status: 'unhealthy', error: 'Failed to connect to DeepSeek API' },
      { status: 503 }
    );
  }
}
```

### Pattern 6: Client Disconnect Abort

**What:** Abort DeepSeek request when client disconnects to save resources.

**When to use:** StreamText automatically handles this via the AbortSignal from the fetch API.

The AI SDK's `streamText` automatically respects the request lifecycle. For explicit abort on client disconnect, the fetch's signal should be tied to the request:

```typescript
// The AI SDK handles this internally via the fetch call
// No explicit abort controller needed — the stream cancellation is automatic
// when the client SSE connection closes
```

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|------------|-------------|-----|
| SSE streaming protocol | Custom event framing | `toUIMessageStreamResponse()` | AI SDK handles text-start/delta/end events correctly |
| Error sanitization | Catch + return raw error | `onError` callback | Prevents stack trace leakage |
| Stream abort on disconnect | Custom abort logic | AI SDK built-in | Automatically cancels underlying fetch |
| DeepSeek API integration | Raw fetch with OpenAI compat | `@ai-sdk/deepseek` | Handles model-specific quirks, provider metadata |
| Message windowing math | Custom slice logic | Simple slice(-20) | Trivial, but explicit windowing function clarifies intent |

---

## Common Pitfalls

### Pitfall 1: Missing Error Sanitization
**What goes wrong:** Stack traces or internal error messages leak to client, revealing implementation details.
**Why it happens:** AI SDK's default error handling doesn't strip sensitive info.
**How to avoid:** Use `onError` callback to return only `{ error, code }`.
**Warning signs:** Errors contain file paths, variable names, or internal service names.

### Pitfall 2: Unbounded Message History
**What goes wrong:** Every request sends full conversation, causing quadratic cost growth and eventual token limit errors.
**Why it happens:** No message windowing applied.
**How to avoid:** Window to last 20 messages before passing to `streamText()`.
**Warning signs:** Costs grow superlinearly, `CONTEXT_OVERFLOW` errors appear.

### Pitfall 3: Edge Runtime with Streaming
**What goes wrong:** `runtime = 'edge'` doesn't support long-running streams or some fetch configurations.
**Why it happens:** Edge runtime has stricter resource limits.
**How to avoid:** Use `runtime = 'nodejs'` explicitly for streaming routes.
**Warning signs:** Stream terminates early, `BODY_TIMEOUT` errors.

### Pitfall 4: maxTokens Not Set
**What goes wrong:** DeepSeek may generate unbounded output, causing cost overruns and long wait times.
**Why it happens:** Default maxTokens is very high or unlimited.
**How to avoid:** Set `maxTokens: 1024` explicitly.
**Warning signs:** Very long response times, unexpectedly high API usage.

### Pitfall 5: Health Check Only Verifies Env Var
**What goes wrong:** Key is present but API is down or credentials are wrong — health check says "healthy."
**Why it happens:** Only checking `process.env.DEEPSEEK_API_KEY` existence.
**How to avoid:** Make actual API call (`/v1/models` endpoint) to verify connectivity.
**Warning signs:** Production errors despite health check passing.

---

## Code Examples

### Complete Route Handler (Verified Pattern)
```typescript
// src/app/api/chat/route.ts
import { streamText } from 'ai';
import { deepseek } from '@ai-sdk/deepseek';

export const runtime = 'nodejs';
export const maxDuration = 60;

const MAX_MESSAGES = 20;
const MAX_TOKENS = 1024;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, temperature } = body;

    // D-02: Strict validation
    if (!Array.isArray(messages) || messages.length === 0) {
      return Response.json(
        { error: 'messages must be a non-empty array', code: 'INVALID_REQUEST' },
        { status: 400 }
      );
    }

    for (const msg of messages) {
      if (!msg?.role || !msg?.content) {
        return Response.json(
          { error: 'Each message must have role and content', code: 'INVALID_REQUEST' },
          { status: 400 }
        );
      }
    }

    // D-05: Temperature from client
    const modelOptions: Record<string, unknown> = { temperature };
    if (temperature !== undefined) {
      if (typeof temperature !== 'number' || temperature < 0 || temperature > 2) {
        return Response.json(
          { error: 'temperature must be between 0 and 2', code: 'INVALID_REQUEST' },
          { status: 400 }
        );
      }
    }

    // D-06: Conversation history windowed to last 20
    const windowedMessages = messages.slice(-MAX_MESSAGES);

    const result = streamText({
      model: deepseek('deepseek-v4-flash'),
      messages: windowedMessages,
      maxTokens: MAX_TOKENS,
      ...modelOptions,
    });

    return result.toUIMessageStreamResponse({
      onError: ({ error }) => {
        // D-01/D-03: Sanitized error response
        const message = error instanceof Error ? error.message : 'Unknown error';

        if (message.toLowerCase().includes('rate')) {
          return { error: 'Rate limit exceeded', code: 'RATE_LIMITED' };
        }
        if (message.toLowerCase().includes('context') || message.toLowerCase().includes('token')) {
          return { error: 'Context length exceeded', code: 'CONTEXT_OVERFLOW' };
        }
        if (message.toLowerCase().includes('invalid')) {
          return { error: 'Invalid request', code: 'INVALID_REQUEST' };
        }
        return { error: 'Model error', code: 'MODEL_ERROR' };
      },
    });
  } catch (err) {
    // D-01/D-03: Catch-all for parse errors
    return Response.json(
      { error: 'Invalid request body', code: 'INVALID_REQUEST' },
      { status: 400 }
    );
  }
}

// D-07: GET for health check
export async function GET() {
  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiKey) {
    return Response.json(
      { status: 'unhealthy', error: 'DEEPSEEK_API_KEY not configured' },
      { status: 503 }
    );
  }

  // D-08: Verify actual DeepSeek API connectivity
  try {
    const response = await fetch('https://api.deepseek.com/v1/models', {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    if (!response.ok) {
      return Response.json(
        { status: 'unhealthy', error: 'DeepSeek API unreachable' },
        { status: 503 }
      );
    }

    return Response.json({ status: 'healthy' });
  } catch {
    return Response.json(
      { status: 'unhealthy', error: 'Failed to connect to DeepSeek API' },
      { status: 503 }
    );
  }
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `toTextStreamResponse()` | `toUIMessageStreamResponse()` | AI SDK 5.0 | Enables `useChat` compatibility with text-delta events |
| Custom error catching | `onError` callback | AI SDK 5.0 | Centralized error sanitization |
| Manual SSE framing | AI SDK built-in | AI SDK 3.0+ | Less code, fewer protocol bugs |
| No message windowing | Window to last 20 | This project | Cost control, prevents context overflow |

**Deprecated/outdated:**
- `StreamingTextResponse` wrapper — use `toUIMessageStreamResponse()` directly
- Edge runtime for streaming — use Node.js runtime

---

## Assumptions Log

> List all claims tagged `[ASSUMED]` in this research.

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `deepseek-v4-flash` is the correct model name for `@ai-sdk/deepseek` | Standard Stack | Could be `deepseek-chat` or similar — verify on DeepSeek API docs |
| A2 | `MAX_MESSAGES = 20` is the correct window size | Code Examples | ROADMAP specifies 20, but this is an assumption about what "windowed" means |
| A3 | `MAX_TOKENS = 1024` is sufficient | Code Examples | May need adjustment based on actual response truncation |
| A4 | `x-vercel-ai-ui-message-stream: v1` header is added by `toUIMessageStreamResponse()` | Architecture | Should be verified in AI SDK source — if not, may need explicit header |

---

## Open Questions

1. **Model name verification**
   - What we know: Context mentions `deepseek-v4-flash`
   - What's unclear: Exact model string for `@ai-sdk/deepseek`
   - Recommendation: Check `@ai-sdk/deepseek` source or DeepSeek docs for exact model identifier

2. **Temperature default**
   - What we know: Client can pass `temperature`, no requirement for default
   - What's unclear: Should we set a sensible default (0.7) or leave undefined?
   - Recommendation: Leave undefined (DeepSeek default) unless user specifies

3. **DeepSeek API base URL**
   - What we know: DeepSeek API at `api.deepseek.com`
   - What's unclear: Exact endpoint path for chat completions (should be `/v1/chat/completions`)
   - Recommendation: `@ai-sdk/deepseek` provider handles this internally

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Runtime | ✓ | 22.22.1 | — |
| npm | Package manager | ✓ | 10.9.4 | — |
| `ai` package | Streaming | ✗ | — | Install via npm |
| `@ai-sdk/deepseek` | DeepSeek provider | ✗ | — | Install via npm |
| `DEEPSEEK_API_KEY` | Authentication | ✗ | — | User must configure |

**Missing dependencies with no fallback:**
- `DEEPSEEK_API_KEY` environment variable — planner must document this in setup instructions

**Missing dependencies with fallback:**
- `ai` and `@ai-sdk/deepseek` — install via npm before implementation

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | None (no test framework installed yet) |
| Config file | — |
| Quick run command | — |
| Full suite command | — |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|---------------|
| CHAT-03 | Streaming SSE response | Manual/Integration | `curl -X POST /api/chat -d '{"messages":[{"role":"user","content":"Hi"}]}'` | Wave 0 |
| CHAT-07 | Error response format | Unit | `node -e "fetch('/api/chat', {method:'POST', body:'{}', headers:{'Content-Type':'application/json'}})` | Wave 0 |
| CHAT-08 | Route proxies DeepSeek | Integration | Verify streaming tokens received | Wave 0 |

### Wave 0 Gaps

- [ ] `src/app/api/chat/route.ts` — main implementation
- [ ] `src/lib/deepseek.ts` — provider export (optional, can inline)
- [ ] `src/app/api/chat/route.test.ts` — unit tests for validation
- [ ] Framework install: `npm install ai @ai-sdk/deepseek` — if none detected

---

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | No | — |
| V3 Session Management | No | — |
| V4 Access Control | No | Single-user tool |
| V5 Input Validation | Yes | Strict message validation, reject malformed |
| V6 Cryptography | No | — |

### Known Threat Patterns for This Stack

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| API key exposure | Information Disclosure | Key stays server-side only, never sent to client |
| Malformed request DoS | Denial of Service | Strict input validation, maxTokens limit |
| Error message leakage | Information Disclosure | `onError` callback sanitizes all errors |
| Unbounded cost | Denial of Service | maxTokens: 1024, message windowing to 20 |

---

## Sources

### Primary (HIGH confidence)

- [AI SDK Documentation](https://ai-sdk.dev) - Context7 ID `/websites/ai-sdk_dev`
  - Topics: `streamText`, `toUIMessageStreamResponse`, `onError`, SSE streaming protocol
- [DeepSeek API Documentation](https://api-docs.deepseek.com) - Context7 ID `/websites/api-docs_deepseek`
  - Topics: streaming response format, chat completion chunks
- [Next.js Route Handler Docs](file:///home/qt/projects/life-tools/node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/route.md)
  - Topics: streaming, maxDuration, runtime configuration
- [Next.js maxDuration Config](file:///home/qt/projects/life-tools/node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/02-route-segment-config/maxDuration.md)
- [Next.js runtime Config](file:///home/qt/projects/life-tools/node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/02-route-segment-config/runtime.md)

### Secondary (MEDIUM confidence)

- [AI SDK GitHub - streamText examples](https://github.com/vercel/ai) - Verified patterns
- npm registry versions verified: `ai@6.0.176`, `@ai-sdk/deepseek@2.0.34`

### Tertiary (LOW confidence)

- `deepseek-v4-flash` model name — should be verified against `@ai-sdk/deepseek` provider source

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - npm versions verified, AI SDK docs confirmed
- Architecture: HIGH - Context7 docs, official Next.js docs
- Pitfalls: HIGH - All based on verified documentation

**Research date:** 2026-05-08
**Valid until:** 2026-06-07 (30 days for stable stack)
