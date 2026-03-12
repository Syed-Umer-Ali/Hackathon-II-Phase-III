# Research: Phase III - AI-Powered Todo Chatbot

## Decision: OpenAI Agents SDK
- **Rationale**: Official SDK provides robust orchestration for tool calling and history management.
- **Alternatives considered**: LangChain (rejected for being too abstract for this specific SDK-native hackathon requirement).

## Decision: Official MCP SDK
- **Rationale**: Standardizes tool definitions and allows the agent to interact with the database in a decoupled way.
- **Alternatives considered**: Custom tool decorators (rejected to follow industry-standard protocol).

## Decision: Stateless History Reload
- **Rationale**: Fetching the last 10 messages from Neon DB per request ensures horizontal scalability and aligns with the constitution.
- **Alternatives considered**: Redis (deferred for simplicity in this phase).

## Decision: Custom Next.js Chat UI
- **Rationale**: Provides full control over the user experience and integration with the existing app theme.
- **Alternatives considered**: ChatKit components (rejected to meet the "custom Next.js UI" requirement).
