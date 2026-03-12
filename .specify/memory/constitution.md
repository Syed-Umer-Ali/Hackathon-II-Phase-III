<!--
Sync Impact Report:
- Version change: [INITIAL_VERSION] → 1.0.0
- List of modified principles:
  - Project Vision & Goals (Created)
  - Core Principles (Created)
  - Technology Decisions & Rationale (Created)
  - Architecture Overview (Created)
  - Code Quality Standards (Created)
  - Folder Structure (Created)
  - Definition of Done (Created)
  - Constraints & Boundaries (Created)
- Added sections: All
- Removed sections: Templates
- Templates requiring updates (⚠ pending):
  - .specify/templates/plan-template.md
  - .specify/templates/spec-template.md
  - .specify/templates/tasks-template.md
- Follow-up TODOs: Initial ratification date unknown, set to today.
-->

# Evolution of Todo Constitution

This document defines the governing principles, architecture, and standards for the Evolution of Todo project, specifically for Phase III: AI Chatbot.

## 1. Project Vision & Goals

The vision is to evolve a simple Todo application into a sophisticated, AI-native, and cloud-native distributed system. Phase III focuses on the "Architecture of Intelligence," transitioning from a standard CRUD web app to an AI-powered conversational interface that manages task life cycles through natural language.

**Goals:**
- Implement a conversational interface that replaces or augments traditional forms.
- Demonstrate "Stateless Intelligence" where the AI agent maintains context via persistence.
- Leverage the Model Context Protocol (MCP) for standardized tool execution.
- Maintain high performance and reliability in a distributed AI system.

## 2. Core Principles

### I. Spec-Driven Development (SDD) (NON-NEGOTIABLE)
All implementation MUST be driven by a verified specification. You cannot write code manually; you must refine the Spec until the AI generates the correct output. Every feature requires a Constitution, Spec, Plan, and Tasks.

### II. AI-First Interaction
The application should prioritize natural language for complex task management. User intent is captured via chat, and the system executes actions through tools rather than direct UI-to-DB calls.

### III. Stateless Intelligence
The backend and AI agents must be stateless. Conversation history and session state must be persisted to the database (Neon PostgreSQL) and reloaded per request to ensure horizontal scalability and resilience.

### IV. Standardized Tooling (MCP)
All AI-driven operations (CRUD on tasks) must be exposed via the Model Context Protocol (MCP). This decouples the AI orchestration from the business logic.

### V. Test-First Implementation
Every task in the implementation phase must be accompanied by an automated test. A feature is not complete until its integration tests (verifying agent behavior and tool calls) pass.

### VI. Smallest Viable Diff
Maintain a focus on incremental changes. Do not refactor unrelated code. Each pull request should address a specific, scoped task defined in the tasks.md.

## 3. Technology Decisions & Rationale

| Component | Technology | Rationale |
|-----------|------------|-----------|
| Frontend | Next.js (App Router) | High performance, SEO-friendly, and standard for modern web apps. |
| Backend | FastAPI | High-performance Python framework with native async support, ideal for AI SDKs. |
| AI SDK | OpenAI Agents SDK | Official SDK for building resilient and steerable AI agents. |
| Tool Protocol | Official MCP SDK | Standardized way to connect AI to data and systems. |
| Database | Neon PostgreSQL | Serverless SQL with branching, perfect for iterative development. |
| ORM | SQLModel | Combines SQLAlchemy and Pydantic for clean, type-safe data models. |
| Auth | Better Auth (JWT) | Secure, developer-friendly authentication that bridges Next.js and FastAPI. |

## 4. Architecture Overview

Phase III follows a distributed architecture:
- **Frontend (Next.js)**: Custom chat UI communicates with the backend via REST.
- **Backend (FastAPI)**: Hosts the AI Runner and the MCP Server.
- **AI Agent (OpenAI)**: Processes user messages, utilizes history from DB, and calls MCP tools.
- **MCP Server**: Executes task operations (CRUD) against the Neon DB using SQLModel.
- **Auth (Better Auth)**: Next.js issues JWTs; FastAPI verifies them to enforce user isolation.

## 5. Code Quality Standards

- **Type Safety**: TypeScript on frontend, Type hints on Python backend.
- **Clean Code**: Follow PEP 8 for Python and standard ESLint rules for Next.js.
- **Documentation**: All public APIs must be documented. Spec files serve as the primary requirement documentation.
- **Error Handling**: Use structured error responses. AI should communicate errors gracefully to the user.
- **Security**: Never expose the database directly to the frontend. All data access must be through the API with JWT validation.

## 6. Folder Structure (Monorepo)

```text
hackathon-todo/
├── .specify/             # Spec-Kit templates and project memory
├── specs/                # Feature-specific SDD artifacts (Spec, Plan, Tasks)
├── history/              # Prompt History Records (PHRs) and ADRs
├── frontend/             # Next.js application
├── backend/              # FastAPI application + MCP Server
├── docker-compose.yml    # Local development orchestration
└── CLAUDE.md             # Project-specific AI instructions
```

## 7. Definition of Done (Phase III)

- [ ] Next.js Chat UI implemented and responsive.
- [ ] FastAPI endpoint `/api/chat` handles messages and history persistence.
- [ ] OpenAI Agent successfully uses MCP tools to Add, List, Update, Delete, and Complete tasks.
- [ ] Better Auth JWT integration secures all task and chat operations.
- [ ] All integration tests for the chat flow pass.
- [ ] Documentation (Spec, Plan, Tasks, PHRs) is complete and up to date.

## 8. Constraints & Boundaries

- **In Scope**: Natural language task management, stateless history, custom Next.js UI, MCP tools.
- **Out of Scope**: Local LLMs (use OpenAI), browser notifications (Phase IV), multi-language support (Bonus).
- **Boundaries**: The AI Agent MUST NOT have direct database access; it must use the MCP tools.

## Governance

- The Constitution supersedes all other project practices.
- Amendments require a version bump (SemVer) and a Sync Impact Report.
- All tasks must be validated against these principles before implementation.

**Version**: 1.0.0 | **Ratified**: 2026-03-10 | **Last Amended**: 2026-03-10
