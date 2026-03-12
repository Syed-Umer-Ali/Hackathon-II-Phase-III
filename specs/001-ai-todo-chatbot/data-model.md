# Data Model: Phase III - AI-Powered Todo Chatbot

## Entities

### Task (Existing)
- `id`: Integer (PK)
- `user_id`: String (FK)
- `title`: String
- `description`: Text
- `completed`: Boolean
- `created_at`: DateTime
- `updated_at`: DateTime

### Conversation
- `id`: UUID (PK)
- `user_id`: String (FK)
- `title`: String (Auto-generated from first message)
- `created_at`: DateTime
- `updated_at`: DateTime

### Message
- `id`: UUID (PK)
- `conversation_id`: UUID (FK)
- `role`: String (Enum: user, assistant, system)
- `content`: Text
- `created_at`: DateTime

## Relationships
- `User` has many `Conversations`.
- `Conversation` has many `Messages`.
- `User` has many `Tasks`.
- `Agent` manages `Tasks` via MCP tools on behalf of a `User`.
