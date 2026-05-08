# Phase 2: Chat UI + Home Page - Context

**Gathered:** 2026-05-09
**Status:** Ready for planning

<domain>
## Phase Boundary

Client-side chat interface with streaming display and home page "聊天" button. Uses `@ai-sdk/react` `useChat` hook to consume the `/api/chat` streaming endpoint from Phase 1. UI components are presentational Tailwind work.
</domain>

<decisions>
## Implementation Decisions

### Message Bubbles
- **D-10:** Left/right aligned bubbles — user messages right-aligned, AI responses left-aligned
- **D-11:** Warm amber style — user bubbles use amber background, AI bubbles use lighter cream/white background, matching the home page aesthetic

### Loading Indicator
- **D-12:** Animated dots — show three bouncing dots while AI is generating a response

### Error Display
- **D-13:** Red banner above input — API errors appear in a red/error colored banner displayed above the input area, not as a chat bubble

### Auto-scroll Behavior
- **D-14:** Smart scroll — only auto-scroll if user is already at or near the bottom of the conversation. Respects user's reading position if they scrolled up to review history.

### Input Area
- **D-15:** Amber send button — textarea with light border + amber-colored "发送" (Send) button, matching the warm amber theme of the home page

### Home Page Button
- **D-16:** "聊天" button styled consistently with existing buttons — use `bg-amber-600` to match "算八字" button styling

### the agent's Discretion
- Exact pixel sizes, padding, border radius values — follow Tailwind conventions
- Animation timing and easing curves for dots and scroll behavior
- Send button disabled state while empty input

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### AI SDK Integration
- `/websites/ai-sdk_dev` — AI SDK documentation — `useChat` hook API, message state management, streaming lifecycle

### Phase 1 Integration
- `.planning/phases/01-api-route-streaming-backend/01-RESEARCH.md` — AI SDK streaming patterns, route handler contract
- `.planning/phases/01-api-route-streaming-backend/01-CONTEXT.md` — D-04: AI SDK standard stream protocol (compatible with `useChat`)

### External References
- No external specs — requirements fully captured in decisions above

</canonical_refs>

<codebase_context>
## Existing Code Insights

### Reusable Assets
- Home page button styles: `px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors` — apply similar amber styling to "聊天" button
- Warm amber/orange color palette already established in the app

### Established Patterns
- Next.js App Router page component pattern — `export default function Chat()` in `src/app/chat/page.tsx`
- Tailwind CSS 4 styling system — use utility classes for all styling
- React 19 with Server Components and Client Components boundary

### Integration Points
- Chat UI connects to Phase 1's `/api/chat` streaming endpoint via `useChat` hook
- Home page (`src/app/page.tsx`) links to `/chat` route
- `DEEPSEEK_API_KEY` environment variable must be configured for API to work

</codebase_context>

<specifics>
## Specific Ideas

- Use `useChat` from `@ai-sdk/react` for message state, streaming lifecycle, and abort control
- Components: `ChatUI` (container), `MessageList` (scrollable message area), `MessageBubble` (individual message), `ChatInput` (textarea + send button)
- Chat page at `src/app/chat/page.tsx` — client component ("use client" directive)
- Loading dots: three bouncing dots with CSS animation
- Error banner: red background above input, disappears on next successful message
</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 02-Chat-UI-Home-Page*
*Context gathered: 2026-05-09*
