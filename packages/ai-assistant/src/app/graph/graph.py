from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import MemorySaver
from langgraph.prebuilt import ToolNode, tools_condition

from app.graph.nodes.router_node import router_node
from app.graph.nodes.order_node import order_node
from app.graph.nodes.support_node import support_node

from app.graph.nodes.product_node import product_node
from app.graph.states.state import AgentState
from app.tools.get_product_price import get_product_price
from app.tools.handle_order import handle_order
from app.tools.get_policy import get_policy
from app.graph.conditions import agent_next_step
from app.graph.nodes.supervisor_node import supervisor_node

all_tools = [get_product_price, handle_order, get_policy]

def create_agent_graph():
    builder = StateGraph(AgentState)
    
    # 1. Thêm Nodes
    builder.add_node("supervisor", supervisor_node)
    builder.add_node("product", product_node)
    builder.add_node("order", order_node)
    builder.add_node("support", support_node)
    builder.add_node("tools", ToolNode(all_tools))
    
    # 2. Luôn bắt đầu từ Supervisor
    builder.add_edge(START, "supervisor")
    
    # 3. Phân phối từ Supervisor (Chỉ Supervisor mới có quyền FINISH -> END)
    builder.add_conditional_edges(
        "supervisor",
        lambda state: state["next_node"],
        {
            "product": "product",
            "order": "order",
            "support": "support",
            "FINISH": END,
        }
    )
    
    # 4. Khi Agent chạy: Nếu cần Tool -> sang 'tools', nếu xong việc -> quay về 'supervisor'
    for node_name in ["product", "order", "support"]:
        builder.add_conditional_edges(
            node_name,
            agent_next_step,
            {
                "tools": "tools",
                "supervisor": "supervisor",
            }
        )
    
    # 5. Chạy tool xong -> Trả kết quả về đúng Agent vừa gọi để đọc dữ liệu
    builder.add_conditional_edges(
        "tools",
        lambda state: state["next_node"],
        {
            "product": "product",
            "order": "order",
            "support": "support",
        }
    )
    
    checkpointer = MemorySaver()
    return builder.compile(checkpointer=checkpointer)

agent_app = create_agent_graph()