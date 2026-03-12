# Implementation Plan: Phase III - AI-Powered Todo Chatbot

**Branch**: `001-ai-todo-chatbot` | **Date**: 2026-03-10 | **Spec**: [specs/001-ai-todo-chatbot/spec.md](spec.md)
**Input**: Feature specification for a custom Next.js UI, FastAPI backend, OpenAI Agents SDK, and MCP-driven task management.

## Summary

This plan outlines the implementation of Phase III: AI-Powered Todo Chatbot. The approach involves building a stateless FastAPI backend that uses the OpenAI Agents SDK to orchestrate task management via MCP tools. The frontend will be a custom Next.js chat interface. Data persistence for both tasks and conversation history will be handled by Neon PostgreSQL.

## Technical Context

**Language/Version**: Python 3.13+, TypeScript (Next.js 14+)
**Primary Dependencies**: FastAPI, OpenAI Agents SDK, Official MCP SDK, Next.js, SQLModel
**Storage**: Neon Serverless PostgreSQL
**Testing**: Pytest (Backend), Jest/Playwright (Frontend)
**Target Platform**: Local development with Docker/Minikube support
**Project Type**: Web application (Monorepo)
**Performance Goals**: < 3s AI response latency (excluding generation)
**Constraints**: Stateless backend, JWT-based user isolation
**Scale/Scope**: Multi-user support with persistent chat history

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **SDD Compliant?** Yes. Specification is verified.
- **AI-First Interaction?** Yes. Core feature is a chatbot.
- **Stateless Intelligence?** Yes. History persisted to DB and reloaded per request.
- **Standardized Tooling (MCP)?** Yes. All task operations exposed via MCP.
- **Smallest Viable Diff?** Yes. Focused solely on Phase III requirements.

## Project Structure

### Documentation (this feature)

```text
specs/001-ai-todo-chatbot/
├── plan.md              # This file
├── research.md          # Research findings (Phase 0)
├── data-model.md        # DB schema and entity relationships (Phase 1)
├── quickstart.md        # Setup instructions (Phase 1)
└── contracts/           # API and MCP tool definitions (Phase 1)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── models/          # SQLModel definitions (Tasks, Conversations, Messages)
│   ├── services/        # AI Agent and MCP Server logic
│   └── api/             # FastAPI routes (Chat endpoint)
└── tests/

frontend/
├── src/
│   ├── components/      # Chat UI components
│   ├── pages/chat/      # Chat page
│   └── services/        # API client for chat
└── tests/
```

**Structure Decision**: Option 2: Web application monorepo structure.

## Implementation Order

### Milestone 1: Database & Models (Data Foundation)
- **What**: Create SQLModel classes for `Conversation` and `Message`. Update `Task` model if needed for Phase III.
- **Why**: Foundation for persistence required by all subsequent milestones.
- **Verification**: Run migrations and verify tables exist in Neon DB.
- **Command**: `cd backend && python -m src.scripts.verify_db`

### Milestone 2: MCP Server (Tool Logic)
- **What**: Implement the MCP Server using the Official SDK to expose task CRUD operations as tools.
- **Why**: Standardizes how the AI interacts with the database.
- **Verification**: Test tools independently using a mock agent or MCP inspector.
- **Command**: `cd backend && pytest tests/test_mcp_tools.py`

### Milestone 3: Agent Setup (Intelligence)
- **What**: Configure the OpenAI Agent with the Agents SDK, integrating the MCP tools and defining behavior rules.
- **Why**: Core logic for intent recognition and tool orchestration.
- **Verification**: Feed text input to the agent and verify tool calls.
- **Command**: `cd backend && python src/debug_agent.py "Add buy milk"`

### Milestone 4: Chat Endpoint (Integration)
- **What**: Create the `POST /api/{user_id}/chat` endpoint. Implement stateless history loading/saving.
- **Why**: Connects the frontend to the AI logic.
- **Verification**: CURL request with JWT should return a structured response and save to DB.
- **Command**: `curl -X POST http://localhost:8000/api/user123/chat -d '{"message": "hi"}'`

### Milestone 5: Frontend Chat UI (User Interface)
- **What**: Build the custom Next.js chat interface.
- **Why**: Final deliverable for user interaction.
- **Verification**: Open `/chat` in browser, login, and chat with the bot.
- **Command**: `cd frontend && npm run dev`

## Risk Areas & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| OpenAI Latency | High | Implement streaming responses (if possible) and UI loading states. |
| Context Window Limits | Medium | Limit history reload to last N messages (e.g., 10-20). |
| MCP SDK Complexity | Medium | Use official examples and start with simple tool implementations. |
| JWT Sync Issues | Low | Ensure `BETTER_AUTH_SECRET` is identical across Next.js and FastAPI. |

## Testing Checkpoints

1. **Unit Tests**: Test MCP tools logic and database models.
2. **Integration Tests**: Verify AI Agent correctly parses intent and calls tools.
3. **End-to-End Tests**: Full chat flow from UI to DB and back.
4. **Security Tests**: Ensure a user cannot access another user's tasks or chat history via API.
