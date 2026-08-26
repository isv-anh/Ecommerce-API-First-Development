
from app.graph.states.state import AgentState
from app.agents.support_agent import support_agent

def support_node(state: AgentState) -> dict:
    response = support_agent.invoke(state["messages"])
    
    return {
        "messages": [response]
    }