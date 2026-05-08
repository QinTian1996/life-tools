---
phase: "02-chat-ui-home-page"
plan: "01"
subsystem: ui
tags: [usechat, streaming, ai-sdk, react, next.js]

requires:
  - phase: "01"
    provides: "/api/chat streaming endpoint with DeepSeek"

provides:
  - Full chat UI at /chat with streaming AI responses
  - User messages right-aligned with amber background
  - AI messages left-aligned with cream background
  - Animated bouncing dots during AI streaming
  - Red error banner above input on API failure
  - Smart auto-scroll (only when near bottom)

affects: [future feature phases consuming AI chat]

tech-stack:
  added: ["@ai-sdk/react", "ai@6.0.176"]
  patterns: ["useChat hook with DefaultChatTransport", "UIMessage parts-based content extraction"]

key-files:
  created:
    - src/app/chat/page.tsx
    - src/components/chat/ChatUI.tsx
    - src/components/chat/MessageList.tsx
    - src/components/chat/MessageBubble.tsx
    - src/components/chat/ChatInput.tsx
  modified:
    - src/app/api/chat/route.ts

key-decisions:
  - "Used DefaultChatTransport({ api: '/api/chat' }) instead of deprecated api: '/api/chat' prop"
  - "UIMessage uses parts[] array (TextUIPart) instead of content string"
  - "status === 'streaming' instead of isLoading boolean"
  - "sendMessage({ text: input }) instead of submit()"

patterns-established:
  - "Chat components live in src/components/chat/ with one component per file"

requirements-completed: ["CHAT-01", "CHAT-02", "CHAT-04", "CHAT-05", "CHAT-06"]

duration: 18min
completed: 2026-05-09
---

# Phase 02 Plan 01: Chat UI with Streaming AI Summary

**Chat UI at /chat consuming Phase 1's streaming /api/chat endpoint with animated dots, smart auto-scroll, and amber/cream bubble styling**

## Performance

- **Duration:** ~18 min
- **Started:** 2026-05-08T18:16:48Z
- **Completed:** 2026-05-09
- **Tasks:** 5
- **Files modified:** 6 (5 created, 1 modified pre-existing route.ts)

## Accomplishments
- Chat page route at `/chat`
- MessageBubble with user right-align/amber and AI left-align/cream styling
- MessageList with smart auto-scroll (only when user near bottom) and animated bouncing dots
- ChatInput with amber send button, Enter-to-submit, red error banner
- ChatUI container wiring useChat → DefaultChatTransport → /api/chat

## Task Commits

1. **All Chat UI tasks** - `d06ed61` (feat: implement Chat UI with streaming AI responses)
   - 5 component files created

2. **Dependency install** - `ffc21d2` (chore: add @ai-sdk/react for useChat hook)

**Plan metadata:** `d06ed61`

## Files Created/Modified

- `src/app/chat/page.tsx` - Route page rendering ChatUI
- `src/components/chat/ChatUI.tsx` - Main container with useChat, transport, input state
- `src/components/chat/MessageList.tsx` - Scrollable list with smart auto-scroll + animated dots
- `src/components/chat/MessageBubble.tsx` - User/AI bubble with conditional amber/cream styling
- `src/components/chat/ChatInput.tsx` - Textarea + amber send button + error banner
- `src/app/api/chat/route.ts` - Fixed pre-existing type errors (maxTokens→maxOutputTokens, ModelMessage cast, onError callback)

## Decisions Made

- Used `@ai-sdk/react@3.0.178` with `DefaultChatTransport` (new AI SDK 6.x architecture)
- `status === 'streaming'` as loading indicator instead of deprecated `isLoading`
- `sendMessage({ text: input })` instead of deprecated `submit()` method
- UIMessage parts extraction for text content (new AI SDK message format)
- Created `transport = useMemo(() => new DefaultChatTransport({ api: '/api/chat' }), [])` to avoid recreation on re-renders

## Deviations from Plan

None - plan executed with necessary API adaptations for newer AI SDK version.

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Pre-existing type errors in route.ts blocked build**
- **Found during:** Verification (build step)
- **Issue:** `maxTokens` → `maxOutputTokens` rename; `windowedMessages` type incompatibility with `ModelMessage[]`; `onError` callback signature mismatch in AI SDK 6.x
- **Fix:** Changed `maxTokens` to `maxOutputTokens`, added `as ModelMessage[]` cast, changed `onError: ({ error }) =>` to `onError: (error: unknown) =>`
- **Files modified:** `src/app/api/chat/route.ts`
- **Verification:** `npm run build` passes
- **Committed in:** `d06ed61` (included in Chat UI commit)

**2. [Rule 3 - Blocking] @ai-sdk/react not installed**
- **Found during:** Type check after file creation
- **Issue:** `Cannot find module '@ai-sdk/react'`
- **Fix:** `npm install @ai-sdk/react`
- **Files modified:** `package.json`, `package-lock.json`
- **Verification:** Type check resolved
- **Committed in:** `ffc21d2`

**3. [Rule 3 - Blocking] useChat API changed in AI SDK 6.x**
- **Found during:** Type check
- **Issue:** `api` prop doesn't exist on `UseChatOptions`; `submit()` method renamed to `sendMessage()`; `isLoading` replaced by `status === 'streaming'`; `input`/`setInput` not in hook return
- **Fix:** Used `DefaultChatTransport({ api })` passed as `transport` option; replaced `submit()` with `sendMessage()`; replaced `isLoading` with `status === 'streaming'`; created local `input`/`setInput` state in ChatUI
- **Files modified:** `ChatUI.tsx`, `ChatInput.tsx`, `MessageList.tsx`, `MessageBubble.tsx`
- **Verification:** `npm run build` passes, all automated checks pass
- **Committed in:** `d06ed61`

**4. [Rule 1 - Bug] MessageBubble used non-existent `content` property**
- **Found during:** Type check
- **Issue:** `UIMessage` has `parts: UIMessagePart[]`, not a flat `content` string
- **Fix:** Created `getTextContent()` helper to extract text from `TextUIPart` parts
- **Files modified:** `MessageBubble.tsx`
- **Verification:** Type check passes
- **Committed in:** `d06ed61`

---

**Total deviations:** 4 auto-fixed (all Rule 3 blocking)
**Impact on plan:** All auto-fixes necessary for build pass and correctness. No scope creep.

## Issues Encountered

- AI SDK 6.x has completely different `useChat` API from the version assumed in plan — adapted all component interfaces accordingly

## Next Phase Readiness

- `/chat` route fully functional and linked from home page
- Build passes with all components
- Ready for next feature phase

---
*Phase: 02-chat-ui-home-page / 01-chat-ui*
*Completed: 2026-05-09*
