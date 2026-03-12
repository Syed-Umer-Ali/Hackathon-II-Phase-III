---
id: 2
title: Initialize Project Constitution
stage: constitution
date: 2026-03-10
surface: agent
model: claude-sonnet-4.6
feature: none
branch: 001-ai-todo-chatbot
user: MTC
command: "/sp.constitution"
labels: ["constitution", "architecture", "standards"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - .specify/memory/constitution.md
tests:
  - N/A
---

## Prompt

You are a senior software architect. Write a PROJECT CONSTITUTION
for a Todo application hackathon project.

Project: "Evolution of Todo" - Phase III (AI Chatbot)
Stack: Next.js frontend, FastAPI backend, OpenAI Agents SDK,
Official MCP SDK, SQLModel, Neon PostgreSQL, Better Auth JWT

The constitution must include:
1. Project Vision & Goals
2. Core Principles (non-negotiable rules)
3. Technology Decisions & Rationale
4. Architecture Overview
5. Code Quality Standards
6. Folder Structure (monorepo)
7. Definition of Done for each phase
8. Constraints & Boundaries

## Response snapshot

Created a comprehensive project constitution at `.specify/memory/constitution.md` incorporating the specified tech stack (Next.js, FastAPI, OpenAI Agents SDK, MCP, etc.) and defining core principles like Spec-Driven Development and Stateless Intelligence.

## Outcome

- ✅ Impact: Established core governance and architectural standards for the project.
- 🧪 Tests: N/A
- 📁 Files: Updated .specify/memory/constitution.md
- 🔁 Next prompts: /sp.specify
- 🧠 Reflection: The constitution successfully captures the "Architecture of Intelligence" vision required for Phase III.

## Evaluation notes (flywheel)

- Failure modes observed: Initial script based PHR creation failed due to missing bash script, fell back to agent-native write.
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): N/A
