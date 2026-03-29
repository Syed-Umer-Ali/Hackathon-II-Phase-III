# e:\Python\PIAIC_Hackathon_II\Phase-III\backend\src\api\tasks.py
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from src.services.mcp_server import engine
from src.models.chat import Task
from src.models.user import User
from src.core.security import get_current_user
from typing import List

router = APIRouter()

def get_session():
    with Session(engine) as session:
        yield session

@router.get("/tasks", response_model=List[Task])
async def list_tasks_endpoint(session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    statement = select(Task).where(Task.user_id == current_user.username).order_by(Task.created_at.desc())
    results = session.exec(statement).all()
    return results

@router.post("/tasks/{task_id}/complete")
async def complete_task_endpoint(task_id: int, session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    task = session.get(Task, task_id)
    if not task or task.user_id != current_user.username:
        raise HTTPException(status_code=404, detail="Task not found")
    task.completed = True
    session.add(task)
    session.commit()
    session.refresh(task)
    return task

@router.delete("/tasks/{task_id}")
async def delete_task_endpoint(task_id: int, session: Session = Depends(get_session), current_user: User = Depends(get_current_user)):
    task = session.get(Task, task_id)
    if not task or task.user_id != current_user.username:
        raise HTTPException(status_code=404, detail="Task not found")
    session.delete(task)
    session.commit()
    return {"status": "deleted"}
