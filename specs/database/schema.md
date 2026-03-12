# Database Schema

## Table: tasks
- `id`: integer (PK)
- `user_id`: string (FK)
- `title`: string
- `description`: text (nullable)
- `completed`: boolean (default: false)
- `created_at`: timestamp
- `updated_at`: timestamp

## Table: conversations
- `id`: uuid (PK)
- `user_id`: string (FK)
- `title`: string (optional, e.g., first message snippet)
- `created_at`: timestamp
- `updated_at`: timestamp

## Table: messages
- `id`: uuid (PK)
- `conversation_id`: uuid (FK)
- `role`: string (user, assistant, system)
- `content`: text
- `created_at`: timestamp
