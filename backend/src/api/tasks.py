# e:\Python\PIAIC_Hackathon_II\Phase-III\backend\src\api\tasks.py
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from src.services.mcp_server import engine
from src.models.chat import Task
from typing import List

router = APIRouter()

def get_session():
    with Session(engine) as session:
        yield session

@router.get("/{user_id}/tasks", response_model=List[Task])
async def list_tasks_endpoint(user_id: str, session: Session = Depends(get_session)):
    statement = select(Task).where(Task.user_id == user_id).order_by(Task.created_at.desc())
    results = session.exec(statement).all()
    return results

@router.post("/{user_id}/tasks/{task_id}/complete")
async def complete_task_endpoint(user_id: str, task_id: int, session: Session = Depends(get_session)):
    task = session.get(Task, task_id)
    if not task or task.user_id != user_id:
        raise HTTPException(status_code=404, detail="Task not found")
    task.completed = True
    session.add(task)
    session.commit()
    session.refresh(task)
    return task

@router.delete("/{user_id}/tasks/{task_id}")
async def delete_task_endpoint(user_id: str, task_id: int, session: Session = Depends(get_session)):
    task = session.get(Task, task_id)
    if not task or task.user_id != user_id:
        raise HTTPException(status_code=404, detail="Task not found")
    session.delete(task)
    session.commit()
    return {"status": "deleted"}
