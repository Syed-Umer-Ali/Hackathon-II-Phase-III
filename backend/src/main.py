from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel, create_engine
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

from src.api.chat import router as chat_router
from src.api.tasks import router as tasks_router
from src.models.chat import Task, Conversation, Message # Import to register with SQLModel

app = FastAPI(title="Evolution of Todo - Phase III")

# 1. CORS Configuration (Next.js communication ke liye)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Production mein isay restrict karna hoga
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Database Engine
DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)

# 3. Create Tables on Startup
@app.on_event("startup")
def on_startup():
    SQLModel.metadata.create_all(engine)

# 4. Include Routers
app.include_router(chat_router)
app.include_router(tasks_router, prefix="/api", tags=["tasks"])

@app.get("/")
def read_root():
    return {"status": "Backend is running", "phase": "III - AI Chatbot"}

@app.get("/api/health")
def health_check():
    return {"status": "ok"}
