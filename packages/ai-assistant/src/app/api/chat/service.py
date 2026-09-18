from langchain_core.messages import HumanMessage


class ChatService:
    def __init__(self, agent):
        self.agent = agent

    def process_query(self, message: str, session_id: str = "default_session") -> dict:
        result = self.agent.invoke(
            {"messages": [HumanMessage(content=message)]},
            config={"configurable": {"thread_id": session_id}},
        )
        
        messages = result.get("messages", [])
        final_message = messages[-1].content
        data = None
        
        # Find the last HumanMessage index to only look at tools called in this turn
        last_human_idx = -1
        for i in range(len(messages) - 1, -1, -1):
            if messages[i].type == "human":
                last_human_idx = i
                break
                
        # Extract data from the last ToolMessage in this turn
        if last_human_idx != -1:
            for i in range(len(messages) - 1, last_human_idx, -1):
                if messages[i].type == "tool":
                    import json
                    try:
                        data = json.loads(messages[i].content)
                    except Exception:
                        data = messages[i].content
                    break

        return {
            "message": final_message,
            "data": data
        }