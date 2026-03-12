from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List
import uuid
from sqlmodel import Session, select, create_engine
from src.models.chat import Conversation, Message
from src.services.agent import TodoAgent
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

router = APIRouter()
agent = TodoAgent()
engine = create_engine(os.getenv("DATABASE_URL"))

class ChatRequest(BaseModel):
    conversation_id: Optional[uuid.UUID] = None
    message: str

class ChatResponse(BaseModel):
    conversation_id: uuid.UUID
    response: str

@router.post("/api/{user_id}/chat", response_model=ChatResponse)
async def chat_endpoint(user_id: str, request: ChatRequest):
    with Session(engine) as session:
        # 1. Handle Conversation
        if not request.conversation_id:
            db_conv = Conversation(user_id=user_id)
            session.add(db_conv)
            session.commit()
            session.refresh(db_conv)
            conv_id = db_conv.id
        else:
            conv_id = request.conversation_id

        # 2. Load History
        history_stmt = select(Message).where(Message.conversation_id == conv_id).order_by(Message.created_at.desc()).limit(10)
        history_objs = session.exec(history_stmt).all()
        history_formatted = [{"role": m.role, "content": m.content} for m in reversed(history_objs)]

        # 3. Store User Message
        user_msg = Message(conversation_id=conv_id, role="user", content=request.message)
        session.add(user_msg)
        session.commit()

        # 4. Run Agent
        ai_resp_obj = await agent.run(request.message, user_id=user_id, history=history_formatted)
        ai_content = str(ai_resp_obj.final_output)

        # 5. Store Assistant Message
        assistant_msg = Message(conversation_id=conv_id, role="assistant", content=ai_content)
        session.add(assistant_msg)
        session.commit()

        return ChatResponse(conversation_id=conv_id, response=ai_content)
