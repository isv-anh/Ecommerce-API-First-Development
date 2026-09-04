# app/graph/nodes/supervisor_node.py
from typing import Literal
from pydantic import BaseModel, Field
from langchain_core.messages import SystemMessage
from langchain_openai import ChatOpenAI
from app.config import settings
from app.graph.states.state import AgentState

class SupervisorDecision(BaseModel):
    next_node: Literal["product", "order", "support", "FINISH"] = Field(
        description="Chọn agent tiếp theo cần thực thi, hoặc 'FINISH' nếu đã hoàn thành toàn bộ yêu cầu của khách."
    )

supervisor_llm = ChatOpenAI(
    model=settings.DEFAULT_MODEL,
    temperature=0.0,
    api_key=settings.DASHSCOPE_API_KEY_AGENT_1,
    base_url="https://dashscope-intl.aliyuncs.com/compatible-mode/v1",
).with_structured_output(SupervisorDecision)

def supervisor_node(state: AgentState) -> dict:
    sys_prompt = SystemMessage(
        content=(
            "Bạn là Supervisor điều phối trung tâm. Khách hàng có thể hỏi gộp nhiều việc trong 1 câu.\n"
            "Dựa vào toàn bộ lịch sử trao đổi, hãy kiểm tra xem còn tác vụ nào chưa được hoàn thành:\n"
            "- 'product': Nếu khách hỏi thông tin/giá sản phẩm và CHƯA có dữ liệu tra cứu.\n"
            "- 'order': Nếu khách muốn đặt/hủy/sửa đơn hàng và CHƯA được thực thi.\n"
            "- 'support': Nếu khách hỏi chính sách/bảo hành/sự cố và CHƯA được giải đáp.\n"
            "- 'FINISH': Khi TẤT CẢ các ý của khách đã được các agent xử lý xong đầy đủ."
        )
    )
    decision = supervisor_llm.invoke([sys_prompt] + list(state["messages"]))
    return {"next_node": decision.next_node}