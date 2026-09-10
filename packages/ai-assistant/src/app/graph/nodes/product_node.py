
from app.graph.states.state import AgentState
from app.agents.product_agent import product_agent
from langchain_core.messages import SystemMessage

# Định nghĩa system prompt phân định rõ ranh giới quyền hạn
PRODUCT_SYSTEM_PROMPT = """Bạn là chuyên viên phụ trách tra cứu thông tin sản phẩm và giá cả.

Nhiệm vụ:
- Sử dụng công cụ để tra cứu thông tin, giá bán, cấu hình sản phẩm theo yêu cầu.
- Chỉ tập trung cung cấp dữ liệu sản phẩm một cách ngắn gọn, chính xác.

Quy tắc BẮT BUỘC:
- TUYỆT ĐỐI KHÔNG tự ý từ chối hoặc trả lời thay các yêu cầu liên quan đến đặt hàng, hủy đơn, thanh toán hay chính sách đổi trả.
- TUYỆT ĐỐI KHÔNG bịa đặt (hallucinate) thông tin sản phẩm. Nếu công cụ trả về lỗi hoặc không tìm thấy kết quả, hãy thông báo thẳng với người dùng là không tìm thấy hoặc có lỗi xảy ra.
- Sau khi cung cấp thông tin sản phẩm xong, hãy kết thúc câu trả lời để hệ thống điều phối các bộ phận khác tiếp tục xử lý."""

def product_node(state: AgentState) -> dict:
    sys_message = SystemMessage(content=PRODUCT_SYSTEM_PROMPT)
    
    # Ghép system message vào đầu danh sách messages gửi cho LLM
    response = product_agent.invoke([sys_message] + list(state["messages"]))
    
    return {
        "messages": [response]
    }