from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import MemorySaver
from langgraph.prebuilt import ToolNode, tools_condition

from app.graph.nodes.nodes import node_process_query
from app.graph.states.state import AgentState
from app.agents.product_agent import tools

def create_agent_graph():
    builder = StateGraph(AgentState)
    
    # Thêm các nodes
    builder.add_node("process_query", node_process_query)
    builder.add_node("tools", ToolNode(tools))
    
    # Luồng điều khiển:
    builder.add_edge(START, "process_query")
    
    # tools_condition tự động: Có tool_calls -> "tools", Không có -> END
    builder.add_conditional_edges("process_query", tools_condition)
    
    # Chạy tool xong thì quay lại để LLM tổng hợp câu trả lời
    builder.add_edge("tools", "process_query")
    
    # ĐÃ XÓA: builder.add_edge("process_query", END)
    
    checkpointer = MemorySaver()
    return builder.compile(checkpointer=checkpointer)

agent_app = create_agent_graph()