# Feature: AI Chatbot

## User Stories
- **As a user**, I want to add a task using natural language (e.g., "Add buy milk to my list").
- **As a user**, I want to see my pending tasks by asking the bot (e.g., "What's on my plate today?").
- **As a user**, I want the bot to mark tasks as complete when I say "I've finished the grocery shopping".
- **As a user**, I want to update task details through conversation.

## Acceptance Criteria
- Bot must correctly identify user intent for all CRUD operations.
- Bot must use MCP tools to execute actions.
- Conversations must be persistent and context-aware.
- UI must show loading states and formatted bot responses.

## Agent Behavior Rules
- **Friendly & Concise**: The bot should be helpful but not overly wordy.
- **Clarification**: If an intent is ambiguous, the bot MUST ask for clarification.
- **Confirmation**: Always confirm after performing an action (e.g., "Done! I've added 'Buy milk' to your list.").
- **No Direct DB Access**: Agent must ONLY use provided MCP tools.

## Error Handling
- If a tool fails, the bot should explain the issue to the user gracefully.
- Handle "Task not found" errors by asking the user to list tasks first.
- Handle authentication timeouts by prompting the user to log in again.
