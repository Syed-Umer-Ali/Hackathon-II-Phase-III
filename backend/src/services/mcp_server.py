from mcp.server.fastmcp import FastMCP
from mcp.types import Tool, TextContent
from src.models.chat import Task
from sqlmodel import Session, select, create_engine
import os

# Database setup (simplification for MCP)
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://localhost/todo")
engine = create_engine(DATABASE_URL)

mcp_server = FastMCP(name="todo-mcp")

@mcp_server.tool()
async def add_task(user_id: str, title: str, description: str = None) -> str:
    with Session(engine) as session:
        task = Task(user_id=user_id, title=title, description=description)
        session.add(task)
        session.commit()
        session.refresh(task)
        return f"Task created with ID: {task.id}"

@mcp_server.tool()
async def list_tasks(user_id: str, status: str = "all") -> str:
    with Session(engine) as session:
        statement = select(Task).where(Task.user_id == user_id)
        if status == "pending":
            statement = statement.where(Task.completed == False)
        elif status == "completed":
            statement = statement.where(Task.completed == True)

        results = session.exec(statement).all()
        if not results:
            return "No tasks found."

        output = []
        for t in results:
            status_icon = "✅" if t.completed else "❌"
            output.append(f"{status_icon} [{t.id}] {t.title}")
        return "\n".join(output)

@mcp_server.tool()
async def complete_task(user_id: str, task_id: int) -> str:
    with Session(engine) as session:
        task = session.get(Task, task_id)
        if not task or task.user_id != user_id:
            return "Task not found or unauthorized."
        task.completed = True
        session.add(task)
        session.commit()
        return f"Task {task_id} marked as completed."

@mcp_server.tool()
async def delete_task(user_id: str, task_id: int) -> str:
    with Session(engine) as session:
        task = session.get(Task, task_id)
        if not task or task.user_id != user_id:
            return "Task not found or unauthorized."
        session.delete(task)
        session.commit()
        return f"Task {task_id} deleted."

@mcp_server.tool()
async def update_task(user_id: str, task_id: int, title: str = None, description: str = None) -> str:
    with Session(engine) as session:
        task = session.get(Task, task_id)
        if not task or task.user_id != user_id:
            return "Task not found or unauthorized."
        if title: task.title = title
        if description: task.description = description
        session.add(task)
        session.commit()
        return f"Task {task_id} updated."
