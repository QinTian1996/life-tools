# Phase 1: API Route + Streaming Backend - Context

**Gathered:** 2026-05-08
**Status:** Ready for planning

<domain>
## Phase Boundary

Server-side DeepSeek streaming proxy at `/api/chat` with cost controls and error handling. Delivers streaming SSE responses, strict input validation, structured error responses, and a health check endpoint.
</domain>

<decisions>
## Implementation Decisions

### Error Format + Validation
- **D-01:** Error responses use `{ error: "message", code: "CODE" }` format — includes message + AI-specific error code
- **D-02:** Request validation is **strict** — require valid messages array with role+content, reject malformed requests
- **D-03:** Error codes are **AI-specific**: `INVALID_REQUEST`, `MODEL_ERROR`, `CONTEXT_OVERFLOW`, `RATE_LIMITED`

### SSE + Streaming
- **D-04:** Use **AI SDK standard stream protocol** — text-delta, text-start, text-end events (works with `useChat` out of the box)
- **D-05:** Support **temperature control** from client via request body `{ messages, temperature? }`
- **D-06:** **Cancel stream on client disconnect** — abort DeepSeek request when client disconnects to save resources

### Health Check
- **D-07:** GET `/api/chat` exists for health/liveness probes
- **D-08:** Health check verifies **both key presence AND actual DeepSeek API connectivity** (not just env var check)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### AI SDK Integration
- `/websites/ai-sdk_dev` — AI SDK documentation (Context7) — streaming protocol, streamText API, error handling
- Vercel AI SDK uses Server-Sent Events (SSE) with `x-vercel-ai-ui-message-stream: v1` header

### External References
- No external specs — requirements fully captured in decisions above

</canonical_refs>

<codebase_context>
## Existing Code Insights

### Reusable Assets
- None yet — greenfield API route, no reusable components in `src/app/api/`

### Established Patterns
- Next.js App Router route handler pattern — `export async function POST(req: Request)`
- Tailwind CSS 4 styling system available for future UI work

### Integration Points
- `/api/chat` route connects to Phase 2 chat UI via `useChat` hook from `@ai-sdk/react`
- `DEEPSEEK_API_KEY` environment variable for API authentication
- Home page (`src/app/page.tsx`) will link to `/chat` in Phase 2

</codebase_context>

<specifics>
## Specific Ideas

- AI SDK's `@ai-sdk/deepseek` provider for `deepseek-v4-flash` model
- maxTokens fixed at 1024 (per ROADMAP.md success criteria)
- Conversation history windowed to last 20 messages (per ROADMAP.md)
- Node.js runtime with `maxDuration = 60` (per ROADMAP.md)
</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-API-Route-Streaming-Backend*
*Context gathered: 2026-05-08*