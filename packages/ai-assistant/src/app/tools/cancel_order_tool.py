from langchain_core.tools import tool
from app.clients.order_client import order_client_manager
from app.buf.generated.order.v1 import order_pb2

@tool
def cancel_order_tool(order_id: str, reason: str = "User requested cancellation") -> str:
    """
    Hủy một đơn hàng đã đặt.
    
    Args:
        order_id: Mã đơn hàng cần hủy.
        reason: Lý do hủy đơn.
    """
    client = order_client_manager.get_client()
    try:
        request = order_pb2.CancelOrderRequest(order_id=order_id, reason=reason)
        response = client.CancelOrder(request)
        if response.success:
            return f"Đã hủy đơn hàng {order_id} thành công. Lời nhắn: {response.message}"
        else:
            return f"Không thể hủy đơn hàng {order_id}. Lời nhắn: {response.message}"
    except Exception as e:
        return f"Đã xảy ra lỗi khi hủy đơn hàng: {str(e)}"
