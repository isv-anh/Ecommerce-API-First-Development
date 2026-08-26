
from app.graph.states.state import AgentState
from app.agents.order_agent import order_agent

def order_node(state: AgentState) -> dict:
    response = order_agent.invoke(state["messages"])
    
    return {
        "messages": [response]
    }