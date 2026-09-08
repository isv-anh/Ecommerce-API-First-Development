from typing import Annotated, List, Optional
from typing_extensions import TypedDict
from langchain_core.messages import BaseMessage
from langgraph.graph.message import add_messages
from app.typed_dict.product import ProductDict


from app.typed_dict.product import SearchProductFilter


class AgentState(TypedDict):
    messages: Annotated[list[BaseMessage], add_messages]
    next_node: Optional[str]

    search_params: Optional[SearchProductFilter]
    search_results: Optional[List[ProductDict]]
    selected_product: Optional[ProductDict]