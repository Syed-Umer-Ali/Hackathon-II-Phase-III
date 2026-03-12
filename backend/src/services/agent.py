from agents import Agent, Runner
from agents.tool import _build_wrapped_function_tool, _build_handled_function_tool_error_handler
from agents.tool_context import ToolContext
from src.services.mcp_server import mcp_server
import os
import json

class TodoAgent:
    def __init__(self):
        self.agent = None
        self.runner = Runner()

    async def _ensure_initialized(self):
        if self.agent is None:
            # List tools from FastMCP
            mcp_tools = await mcp_server.list_tools()
            wrapped_tools = []
            for tool in mcp_tools:
                # Get the actual tool function from FastMCP
                original_tool = mcp_server._tool_manager.get_tool(tool.name)
                original_func = original_tool.fn
                
                # Copy and clean the schema to remove user_id
                import copy
                schema = copy.deepcopy(tool.inputSchema)
                if "properties" in schema and "user_id" in schema["properties"]:
                    del schema["properties"]["user_id"]
                if "required" in schema and "user_id" in schema["required"]:
                    schema["required"] = [r for r in schema["required"] if r != "user_id"]

                # Define invocation wrapper
                async def invoke_tool_impl(ctx: ToolContext, input_json: str, func=original_func, tool_name=tool.name):
                    try:
                        # Parse arguments from LLM
                        arguments = json.loads(input_json) if input_json else {}
                        
                        # Remove user_id from arguments if LLM somehow passed it
                        arguments.pop("user_id", None)
                        
                        # Inject user_id from the context passed to agent.run
                        user_id = ctx.context.get("user_id")
                        
                        # Call the original MCP tool function
                        return await func(user_id=user_id, **arguments)
                    except Exception as e:
                        print(f"DEBUG: Error in tool {tool_name}: {e}")
                        import traceback
                        traceback.print_exc()
                        raise

                # Construct FunctionTool explicitly using cleaned schema
                wrapped_tool = _build_wrapped_function_tool(
                    name=tool.name,
                    description=tool.description or "",
                    params_json_schema=schema,
                    invoke_tool_impl=invoke_tool_impl,
                    on_handled_error=_build_handled_function_tool_error_handler(
                        span_message="Error running tool",
                        log_label="MCP tool",
                    ),
                    strict_json_schema=False 
                )
                
                wrapped_tools.append(wrapped_tool)

            self.agent = Agent(
                name="TodoAssistant",
                instructions="""
                You are a helpful Todo assistant. You can add, list, update, delete, and complete tasks.
                Always confirm actions with a friendly response.
                If user intent is ambiguous, ask for clarification.
                Use the provided tools for all database operations.
                """,
                tools=wrapped_tools
            )

    async def run(self, message: str, user_id: str, history: list = None):
        await self._ensure_initialized()
        
        # Combine history and current message into a single input list
        input_messages = []
        if history:
            input_messages.extend(history)
        
        input_messages.append({"role": "user", "content": message})
        
        # Pass user_id via context so the tools can access it
        response = await self.runner.run(
            self.agent, 
            input_messages,
            context={"user_id": user_id}
        )
        return response
