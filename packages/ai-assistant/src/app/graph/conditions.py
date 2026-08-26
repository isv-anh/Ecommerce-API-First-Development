# app/graph/conditions.py
from app.graph.states.state import AgentState

def agent_next_step(state: AgentState) -> str:
    """
    - Nếu agent đang yêu cầu gọi tool -> đi tiếp vào 'tools'
    - Nếu agent đã hoàn tất câu trả lời của mình -> quay lại 'supervisor'
    """
    last_msg = state["messages"][-1]
    if hasattr(last_msg, "tool_calls") and len(last_msg.tool_calls) > 0:
        return "tools"
    return "supervisor"