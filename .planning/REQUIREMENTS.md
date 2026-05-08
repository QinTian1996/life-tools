# Requirements: 喵十七的工具箱

**Defined:** 2026-05-08
**Core Value:** A place to dump random tools that might be useful someday. Low commitment, high creativity.
**Milestone:** v1.0 LLM Chat Entry

## v1 Requirements

Requirements for milestone v1.0. Each maps to roadmap phases.

### Chat

- [x] **CHAT-01**: User can send a message via textarea (Enter to send)
- [x] **CHAT-02**: User can see their messages displayed as user bubbles
- [x] **CHAT-03**: AI responds with streaming text (real-time token display)
- [x] **CHAT-04**: User can see AI responses displayed as assistant bubbles
- [x] **CHAT-05**: Chat interface auto-scrolls to latest message
- [x] **CHAT-06**: Loading indicator shown while AI is responding
- [x] **CHAT-07**: Error message shown if API call fails
- [x] **CHAT-08**: `/api/chat` route proxies to DeepSeek API server-side

### Home Page

- [x] **HOME-01**: Home page displays a "聊天" button (style consistent with existing buttons)

**Status:** 9/9 requirements complete ✓

## v2 Requirements

Deferred to future release.

### Chat

- **CHAT-09**: Markdown rendering for AI responses
- **CHAT-10**: Copy message button
- **CHAT-11**: Clear conversation button
- **CHAT-12**: Empty state / welcome message
- **CHAT-13**: Stop generation button

## Out of Scope

| Feature | Reason |
|---------|--------|
| Multi-model switching | Single DeepSeek model, no switching needed |
| User authentication | Personal tool for friends, no auth needed |
| Conversation persistence | In-memory only, lost on refresh |
| Code syntax highlighting | Adds complexity, defer to v2 |
| System prompt configuration | Hardcoded defaults |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| CHAT-01 | Phase 2 | Complete |
| CHAT-02 | Phase 2 | Complete |
| CHAT-03 | Phase 1 | Complete |
| CHAT-04 | Phase 2 | Complete |
| CHAT-05 | Phase 2 | Complete |
| CHAT-06 | Phase 2 | Complete |
| CHAT-07 | Phase 1 | Complete |
| CHAT-08 | Phase 1 | Complete |
| HOME-01 | Phase 2 | Complete |

**Coverage:**
- v1 requirements: 9 total
- Mapped to phases: 9
- Unmapped: 0 ✓
- Complete: 9/9 ✓
- Phase 1: 3 requirements (CHAT-03, CHAT-07, CHAT-08)
- Phase 2: 6 requirements (CHAT-01, CHAT-02, CHAT-04, CHAT-05, CHAT-06, HOME-01)

---
*Requirements defined: 2026-05-08*
*Last updated: 2026-05-09 after v1.0 completion*