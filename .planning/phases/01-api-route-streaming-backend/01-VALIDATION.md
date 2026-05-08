# Phase 1: API Route + Streaming Backend - Validation

**Phase:** 01
**Slug:** api-route-streaming-backend
**Date:** 2026-05-08
**Status:** Ready for validation

## Phase Overview

Implements `/api/chat` server-side streaming proxy using `ai@6` + `@ai-sdk/deepseek@2` with strict validation, error sanitization, cost controls, and health check endpoint.

## Requirements → Test Map

| Req ID | Description | Test Type | Verification Command |
|--------|-------------|-----------|---------------------|
| CHAT-03 | AI responds with streaming text (real-time token display) | Manual/Integration | `curl -X POST /api/chat -H "Content-Type: application/json" -d '{"messages":[{"role":"user","content":"Hi"}]}'` — expect SSE with text-delta events |
| CHAT-07 | Error message shown if API call fails | Manual | POST with missing `messages` key → expect `{"error":"...","code":"INVALID_REQUEST"}` |
| CHAT-08 | `/api/chat` route proxies to DeepSeek API server-side | Integration | POST valid request → expect streaming token response |

## Test Categories

### Wave 0 — Core Implementation

| Task | Verification | Pass Criteria |
|------|-------------|---------------|
| Install `ai` + `@ai-sdk/deepseek` | `npm ls ai @ai-sdk/deepseek` | Both packages present |
| Create `src/app/api/chat/route.ts` | File exists | `src/app/api/chat/route.ts` present |
| POST handler — streaming | `curl` to `/api/chat` | SSE response with `text-delta` events |
| POST handler — error format | Missing `messages` key | `400` + `{"error":"...","code":"INVALID_REQUEST"}` |
| GET handler — healthy | `curl GET /api/chat` (key set) | `200` + `{"status":"healthy"}` |
| GET handler — unhealthy | `curl GET /api/chat` (no key) | `503` + `{"status":"unhealthy",...}` |

### Wave 1 — Cost Controls

| Task | Verification | Pass Criteria |
|------|-------------|---------------|
| maxTokens: 1024 | Long prompt | Response truncates at ~1024 tokens |
| Message windowing (last 20) | 25 messages sent | Only last 20 sent to DeepSeek API |

## Verification Commands

### Manual (cURL)

```bash
# Health check — healthy
curl -X GET http://localhost:3000/api/chat
# Expected: 200 {"status":"healthy"}

# Health check — missing key
DEEPSEEK_API_KEY="" curl -X GET http://localhost:3000/api/chat
# Expected: 503 {"status":"unhealthy",...}

# Streaming request
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Hi"}]}'
# Expected: SSE stream with text-delta events

# Error: missing messages
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{}'
# Expected: 400 {"error":"messages must be a non-empty array","code":"INVALID_REQUEST"}

# Error: empty message array
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[]}'
# Expected: 400 {"error":"messages must be a non-empty array","code":"INVALID_REQUEST"}
```

## Success Criteria

1. POST `/api/chat` with valid request returns streaming SSE with `text-start`, `text-delta`, `text-end` events
2. Invalid requests return `400` with `{"error":"...","code":"INVALID_REQUEST"}` — no stack traces
3. DeepSeek errors return `500` with `{"error":"...","code":"MODEL_ERROR|RATE_LIMITED|CONTEXT_OVERFLOW"}` — no stack traces
4. GET `/api/chat` returns `200 {"status":"healthy"}` when API key is configured and API is reachable
5. GET `/api/chat` returns `503 {"status":"unhealthy",...}` when key is missing or API is unreachable
6. Streaming respects `maxTokens: 1024` limit
7. Message history is windowed to last 20 messages
8. Route uses Node.js runtime with `maxDuration: 60`

## Gaps

- No test framework installed — manual verification only
- DeepSeek API key must be configured (`DEEPSEEK_API_KEY`) before health check passes
