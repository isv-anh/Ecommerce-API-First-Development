from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import MemorySaver
from langgraph.prebuilt import ToolNode, tools_condition

from app.graph.states.state import AgentState
from app.graph.nodes.supervisor_node import supervisor_node
from app.graph.nodes.product_node import product_node
from app.graph.nodes.order_node import order_node
from app.graph.nodes.support_node import support_node

from app.tools.get_products import get_products
from app.tools.handle_order import handle_order
from app.tools.get_policy import get_policy

def create_agent_graph():
    builder = StateGraph(AgentState)
    
    # 1. Thêm Nodes Agent
    builder.add_node("supervisor", supervisor_node)
    builder.add_node("product", product_node)
    builder.add_node("order", order_node)
    builder.add_node("support", support_node)
    
    # Tool Node riêng biệt theo nghiệp vụ
    builder.add_node("product_tools", ToolNode([get_products]))
    builder.add_node("order_tools", ToolNode([handle_order]))
    builder.add_node("support_tools", ToolNode([get_policy]))
    
    # 2. Luôn bắt đầu từ Supervisor
    builder.add_edge(START, "supervisor")
    
    # 3. Phân phối từ Supervisor
    builder.add_conditional_edges(
        "supervisor",
        lambda state: state.get("next_node"),
        {
            "product": "product",
            "order": "order",
            "support": "support",
            "FINISH": END,
        }
    )
    
    # 4 & 5. Vòng lặp Agent <-> Tool tương ứng
    agents = [
        ("product", "product_tools"),
        ("order", "order_tools"),
        ("support", "support_tools")
    ]
    
    for agent_node, tool_node in agents:
        builder.add_conditional_edges(
            agent_node,
            tools_condition,
            {
                "tools": tool_node,
                "__end__": "supervisor"  
            }
        )
        builder.add_edge(tool_node, agent_node)
    
    checkpointer = MemorySaver()
    return builder.compile(checkpointer=checkpointer)

agent_app = create_agent_graph()