# Chat API Specification

## Endpoint: POST /api/{user_id}/chat

### Request Body
```json
{
  "conversation_id": "uuid (optional)",
  "message": "string (required)"
}
```

### Response Body
```json
{
  "conversation_id": "uuid",
  "response": "string",
  "tool_calls": []
}
```

## Stateless Architecture
The server does not hold any session state in RAM. Every request follows this flow:
1. Receive request with `user_id` and `message`.
2. Load `conversation_id` history from Neon DB.
3. Initialize OpenAI Agent with history.
4. Agent processes message and calls MCP tools.
5. Save new messages (User & Assistant) to DB.
6. Return response to Frontend.

## Conversation Flow (9 Steps)
1. User sends message from Next.js UI.
2. FastAPI validates JWT and extracts `user_id`.
3. System fetches previous 10 messages for the `conversation_id`.
4. OpenAI Agent is initialized with the message history.
5. Agent analyzes intent.
6. Agent executes MCP Tool(s) if needed.
7. MCP Tool interacts with Database.
8. Agent generates human-friendly response.
9. Final state saved and response sent to client.
