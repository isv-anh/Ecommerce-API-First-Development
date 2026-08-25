from langchain_core.messages import HumanMessage


class ChatService:
    def __init__(self, agent):
        self.agent = agent

    def process_query(self, message: str, session_id: str = "default_session") -> str:
        result = self.agent.invoke(
            {"messages": [HumanMessage(content=message)]},
            config={"configurable": {"thread_id": session_id}},
        )
        return result["messages"][-1].content