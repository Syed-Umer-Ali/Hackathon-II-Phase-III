# MCP Tools Specification

The MCP server exposes the following tools to the AI Agent. All tools require `user_id` for isolation.

## Tool: add_task
- **Purpose**: Create a new task.
- **Parameters**:
  - `user_id` (string, required)
  - `title` (string, required)
  - `description` (string, optional)
- **Returns**: Created task object with ID.
- **Example**: `{"user_id": "u1", "title": "Buy milk"}` -> `{"id": 1, "status": "created"}`

## Tool: list_tasks
- **Purpose**: Retrieve tasks.
- **Parameters**:
  - `user_id` (string, required)
  - `status` (string, optional: "all", "pending", "completed")
- **Returns**: Array of task objects.
- **Example**: `{"user_id": "u1", "status": "pending"}`

## Tool: complete_task
- **Purpose**: Mark task as complete.
- **Parameters**:
  - `user_id` (string, required)
  - `task_id` (integer, required)
- **Returns**: Success confirmation.

## Tool: delete_task
- **Purpose**: Remove a task.
- **Parameters**:
  - `user_id` (string, required)
  - `task_id` (integer, required)
- **Returns**: Success confirmation.

## Tool: update_task
- **Purpose**: Modify task details.
- **Parameters**:
  - `user_id` (string, required)
  - `task_id` (integer, required)
  - `title` (string, optional)
  - `description` (string, optional)
- **Returns**: Updated task object.
