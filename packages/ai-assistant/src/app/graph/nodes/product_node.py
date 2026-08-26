
from app.graph.states.state import AgentState
from app.agents.product_agent import product_agent

def product_node(state: AgentState) -> dict:
    response = product_agent.invoke(state["messages"])
    
    return {
        "messages": [response]
    }