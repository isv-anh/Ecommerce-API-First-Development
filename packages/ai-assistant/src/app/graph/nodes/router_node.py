from typing import Literal
from pydantic import BaseModel, Field
from langchain_core.messages import SystemMessage
from langchain_openai import ChatOpenAI
from app.config import settings
from app.graph.states.state import AgentState

class RouteDecision(BaseModel):
    next_node: Literal["product", "order", "support"] = Field(
        description="Chọn agent: 'product' (hỏi giá/sản phẩm), 'order' (đặt/hủy đơn), 'support' (chính sách/khiếu nại/sự cố)."
    )

router_llm = ChatOpenAI(
    model=settings.DEFAULT_MODEL,
    temperature=0.0,
    api_key=settings.DASHSCOPE_API_KEY_AGENT_1, # hoặc key router riêng
    base_url="https://dashscope-intl.aliyuncs.com/compatible-mode/v1",
).with_structured_output(RouteDecision)

def router_node(state: AgentState) -> dict:
    sys_prompt = SystemMessage(
        content="Bạn là bộ định tuyến. Dựa vào nội dung trao đổi, hãy phân loại yêu cầu của khách hàng vào đúng 1 trong 3 agent: 'product', 'order', hoặc 'support'."
    )
    decision = router_llm.invoke([sys_prompt] + list(state["messages"]))
    return {"next_node": decision.next_node}