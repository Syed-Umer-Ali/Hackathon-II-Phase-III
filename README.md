# 🚀 Hackathon II — Phase III: Spec-Driven Todo App

> A full-stack Todo application built using **Spec-Driven Development (SDD)** methodology, powered by **Claude Code** as the agentic AI backbone. This project demonstrates how AI-assisted development workflows, structured specs, and architectural discipline can be combined to ship production-quality software.

---

## 📌 Table of Contents

- [Overview](#overview)
- [Methodology: Spec-Driven Development](#methodology-spec-driven-development)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Architectural Decision Records (ADRs)](#architectural-decision-records-adrs)
- [Prompt History Records (PHRs)](#prompt-history-records-phrs)
- [Code Standards](#code-standards)
- [Contributing](#contributing)

---

## Overview

This project is the third phase of Hackathon II, focused on demonstrating **agentic AI-assisted software engineering** using a structured, spec-first approach. The application is a Todo manager built with a Python backend and a TypeScript/JavaScript frontend, with development guided entirely by Claude Code following Spec-Driven Development principles.

The goal is not just to ship a Todo app — it's to showcase a **repeatable, auditable, AI-native development process** that any engineering team can adopt.

---

## Methodology: Spec-Driven Development

Every feature in this project follows a strict **SDD lifecycle**:

```
Constitution → Spec → Plan → Tasks → Red → Green → Refactor
```

| Stage | Description |
|---|---|
| **Constitution** | Project-wide principles, constraints, and non-goals |
| **Spec** | Feature-level requirements and acceptance criteria |
| **Plan** | Architectural decisions and API contracts |
| **Tasks** | Granular, testable implementation tasks |
| **Red** | Write failing tests first (TDD) |
| **Green** | Implement the minimum code to pass tests |
| **Refactor** | Clean up while keeping tests green |

All decisions are tracked via **Architectural Decision Records (ADRs)** and every agent prompt is logged as a **Prompt History Record (PHR)**.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | TypeScript, JavaScript, CSS |
| **Backend** | Python |
| **AI Agent** | Claude Code (Anthropic) |
| **Dev Methodology** | Spec-Driven Development via SpecKit Plus |
| **Scripting** | PowerShell |
| **Spec Format** | Markdown + YAML frontmatter |

---

## Project Structure

```
Hackathon-II-Phase-III/
│
├── .claude/
│   └── commands/          # Claude Code custom slash commands (e.g. /sp.phr, /sp.adr)
│
├── .specify/
│   ├── memory/
│   │   └── constitution.md    # Project-wide principles and code standards
│   ├── templates/
│   │   └── phr-template.prompt.md  # PHR template
│   └── scripts/
│       └── bash/          # Automation scripts (PHR creation, etc.)
│
├── specs/
│   └── <feature>/
│       ├── spec.md        # Feature requirements & acceptance criteria
│       ├── plan.md        # Architecture plan & API contracts
│       └── tasks.md       # Testable task breakdown
│
├── history/
│   ├── prompts/
│   │   ├── constitution/  # Constitution-level PHRs
│   │   ├── general/       # General PHRs
│   │   └── <feature>/     # Feature-specific PHRs
│   └── adr/               # Architecture Decision Records
│
├── backend/               # Python backend (API server)
├── frontend/              # TypeScript/JS frontend (UI)
│
├── CLAUDE.md              # Claude Code agent rules and SDD guidelines
└── Hackathon II - Todo Spec-Driven Development.md  # Hackathon brief
```

---

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- Claude Code CLI (`npm install -g @anthropic-ai/claude-code`)

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
python main.py
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Environment Variables

Create a `.env` file in the project root (never commit secrets):

```env
ANTHROPIC_API_KEY=your_key_here
# Add other required vars per backend/frontend .env.example
```

---

## Development Workflow

This project uses Claude Code with a set of custom slash commands. Open Claude Code at the project root and use:

| Command | Description |
|---|---|
| `/sp.spec <feature>` | Generate a feature spec |
| `/sp.plan <feature>` | Generate an architectural plan |
| `/sp.tasks <feature>` | Break plan into testable tasks |
| `/sp.adr <title>` | Document an architectural decision |
| `/sp.phr` | Manually create a Prompt History Record |

Claude Code will automatically create a PHR after every significant interaction. All PHRs are stored under `history/prompts/`.

---

## Architectural Decision Records (ADRs)

ADRs are stored in `history/adr/`. They document significant architectural decisions including:

- Options considered
- Trade-offs evaluated
- Final rationale

ADRs are **never auto-created** — they require explicit user consent via `/sp.adr <title>` to ensure intentional, reviewed documentation.

---

## Prompt History Records (PHRs)

Every user prompt to the Claude Code agent is recorded as a PHR. PHRs are structured Markdown files with YAML frontmatter capturing:

- Full verbatim user input
- Agent response summary
- Stage, feature, branch, model info
- Files created/modified
- Tests run or added

PHRs create a complete, auditable trail of the entire development history — useful for retrospectives, onboarding, and compliance.

---

## Code Standards

Defined in `.specify/memory/constitution.md`. Key principles:

- **Smallest viable diff** — no unrelated refactors
- **No hardcoded secrets** — always use `.env`
- **Test-first** — acceptance criteria defined before implementation
- **Explicit error paths** — every feature spec must include failure cases
- **No invented APIs** — all contracts verified before implementation

---

## Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/<name>`
3. Follow the SDD lifecycle: Spec → Plan → Tasks → Red → Green → Refactor
4. Ensure all tests pass
5. Submit a PR with a link to the relevant spec and ADR (if applicable)

---

## Author

**Syed Umer Ali** — [GitHub](https://github.com/Syed-Umer-Ali)

Built as part of **Hackathon II — Phase III**, demonstrating agentic AI-powered, spec-driven software development with Claude Code.

---

> *"Good software starts with a good spec. Great software starts with a great process."*
