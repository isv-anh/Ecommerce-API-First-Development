
from app.graph.states.state import AgentState
from app.agents.product_agent import llm_with_tools

def node_process_query(state: AgentState) -> dict:
    response = llm_with_tools.invoke(state["messages"])
    
    return {
        "messages": [response]
    }