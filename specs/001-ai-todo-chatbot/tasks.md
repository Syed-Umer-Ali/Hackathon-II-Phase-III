# Tasks: AI-Powered Todo Chatbot (Phase III)

**Input**: Design documents from `/specs/001-ai-todo-chatbot/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel
- **[Story]**: Which user story this task belongs to (US1, US2, US3)

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Create project structure for backend/ and frontend/ per implementation plan
- [ ] T002 Initialize Python 3.13 backend with FastAPI, SQLModel, and OpenAI SDK dependencies
- [ ] T003 [P] Initialize Next.js 14 frontend with Tailwind CSS and Better Auth client

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [ ] T004 Setup Neon PostgreSQL database schema and migrations for Conversation and Message tables in backend/src/models/
- [ ] T005 [P] Implement Better Auth JWT verification middleware in backend/src/api/middleware.py
- [ ] T006 [P] Configure environment variables for OpenAI, Neon DB, and Better Auth secrets

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Natural Language Task Management (Priority: P1) 🎯 MVP

**Goal**: Enable basic CRUD operations via chat using MCP tools.

**Independent Test**: Send a message to the bot and verify the corresponding task operation is executed.

- [ ] T007 [P] [US1] Create Conversation and Message SQLModel entities in backend/src/models/chat.py
- [ ] T008 [P] [US1] Implement Official MCP SDK server setup in backend/src/services/mcp_server.py
- [ ] T009 [US1] Implement add_task MCP tool with user_id isolation in backend/src/services/mcp_tools.py
- [ ] T010 [US1] Implement list_tasks MCP tool with user_id isolation in backend/src/services/mcp_tools.py
- [ ] T011 [US1] Implement complete_task MCP tool with user_id isolation in backend/src/services/mcp_tools.py
- [ ] T012 [US1] Implement delete_task MCP tool with user_id isolation in backend/src/services/mcp_tools.py
- [ ] T013 [US1] Implement update_task MCP tool with user_id isolation in backend/src/services/mcp_tools.py
- [ ] T014 [US1] Configure OpenAI Agent with Agents SDK and MCP tools in backend/src/services/agent.py
- [ ] T015 [US1] Create POST /api/{user_id}/chat endpoint with stateless history reload in backend/src/api/chat.py

**Checkpoint**: User Story 1 backend logic and tools are fully functional.

---

## Phase 4: User Story 3 - Custom Next.js Chat UI (Priority: P1)

**Goal**: Provide a responsive chat interface for user interaction.

**Independent Test**: Navigate to /chat and exchange messages with the bot.

- [ ] T016 [P] [US3] Create Chat UI component with message bubbles and input area in frontend/src/components/Chat/
- [ ] T017 [US3] Implement chat service to communicate with backend API in frontend/src/services/chatService.ts
- [ ] T018 [US3] Create chat page route and integrate state management for messages in frontend/src/pages/chat.tsx

**Checkpoint**: Chat UI is integrated and communicates with the backend.

---

## Phase 5: User Story 2 - Context-Aware Conversations (Priority: P2)

**Goal**: Maintain conversational context across multiple turns.

**Independent Test**: Refer to a previous message (e.g., "Do that") and verify the bot understands.

- [ ] T019 [US2] Enhance agent prompt to handle relative references in backend/src/services/agent.py
- [ ] T020 [US2] Verify stateless context reconstruction from DB history in backend/src/api/chat.py

---

## Phase 6: Integration & Testing

- [ ] T021 [P] Create integration tests for the full chat-to-task flow in backend/tests/test_chat_flow.py
- [ ] T022 Run end-to-end verification of all CRUD operations via Chat UI

---

## Task Details (Claude Code Prompts)

## Task T001: Setup Project Structure
- Depends on: None
- Spec: @specs/overview.md
- Claude Code Prompt:
  """
  Create the following directory structure at the repository root:
  - backend/src/models/
  - backend/src/services/
  - backend/src/api/
  - frontend/src/components/Chat/
  - frontend/src/services/
  - frontend/src/pages/
  Refer to the monorepo structure in @specs/001-ai-todo-chatbot/plan.md.
  """

## Task T004: Setup Database Schema
- Depends on: T001
- Spec: @specs/001-ai-todo-chatbot/data-model.md
- Claude Code Prompt:
  """
  Implement Conversation and Message SQLModel classes in backend/src/models/chat.py based on @specs/001-ai-todo-chatbot/data-model.md.
  Include fields for user_id, content, role, and timestamps.
  """

## Task T008: MCP Server Setup
- Depends on: T002
- Spec: @specs/001-ai-todo-chatbot/contracts/mcp.yaml
- Claude Code Prompt:
  """
  Initialize the official MCP SDK server in backend/src/services/mcp_server.py.
  Expose the task CRUD operations as tools as defined in @specs/001-ai-todo-chatbot/contracts/mcp.yaml.
  Ensure user_id is required for every tool call.
  """

## Task T014: OpenAI Agent Configuration
- Depends on: T008, T009-T013
- Spec: @specs/001-ai-todo-chatbot/spec.md
- Claude Code Prompt:
  """
  Configure the OpenAI Agent using the OpenAI Agents SDK in backend/src/services/agent.py.
  Integrate the MCP tools from backend/src/services/mcp_tools.py.
  Set the system prompt to follow the 'Agent Behavior Rules' in @specs/001-ai-todo-chatbot/spec.md.
  """

## Task T015: Chat API Endpoint
- Depends on: T014, T007
- Spec: @specs/001-ai-todo-chatbot/api/chat-endpoint.md
- Claude Code Prompt:
  """
  Implement the POST /api/{user_id}/chat endpoint in backend/src/api/chat.py.
  Follow the 9-step 'Conversation Flow' defined in @specs/001-ai-todo-chatbot/api/chat-endpoint.md.
  Ensure history is loaded from the database and saved back after each response.
  """

## Task T018: Next.js Chat UI
- Depends on: T016, T017
- Spec: @specs/001-ai-todo-chatbot/spec.md
- Claude Code Prompt:
  """
  Implement the chat page in frontend/src/pages/chat.tsx using the components in frontend/src/components/Chat/.
  Integrate with chatService.ts to send messages to the backend.
  Include loading states and handle message display as per User Story 3 in @specs/001-ai-todo-chatbot/spec.md.
  """

## Dependencies & Execution Order

1. **Setup (T001-T003)**: Can start immediately.
2. **Foundational (T004-T006)**: Depends on Setup.
3. **Task CRUD (T009-T013)**: Can run in parallel after Foundational.
4. **Agent & API (T014-T015)**: Depends on MCP tools.
5. **Frontend (T016-T018)**: Can start after API setup.
6. **Integration (T019-T022)**: Final stage.
