# Quickstart: Phase III - AI-Powered Todo Chatbot

## Prerequisites
- Python 3.13+
- Node.js 18+
- Neon DB connection string in `.env`
- OpenAI API Key in `.env`

## Backend Setup
1. `cd backend`
2. `pip install "mcp[server]" openai-agents fastapi uvicorn sqlmodel psycopg2-binary python-dotenv`
3. `python -m uvicorn src.main:app --reload --port 8000`

## Frontend Setup
1. `cd frontend`
2. `npm install`
3. `npm run dev`

## Verifying the Chatbot
1. Log in to the application.
2. Navigate to `/chat`.
3. Type: "Add a task to buy groceries".
4. Verify the task is added in the main list.
