from langchain_core.tools import tool
from app.clients.order_client import order_client_manager
from app.buf.generated.order.v1 import order_pb2

@tool
def check_order_tool(order_id: str) -> str:
    """
    Kiểm tra thông tin và trạng thái của một đơn hàng.
    
    Args:
        order_id: Mã đơn hàng cần kiểm tra.
    """
    client = order_client_manager.get_client()
    try:
        request = order_pb2.GetOrderRequest(order_id=order_id)
        response = client.GetOrder(request)
        if response.status == 'NOT_FOUND':
            return f"Không tìm thấy đơn hàng {order_id}."
        
        items_str = ", ".join([f"{item.quantity} x {item.product_id}" for item in response.items])
        return (f"Đơn hàng {order_id} (Khách hàng: {response.customer_id}): "
                f"Trạng thái {response.status}, Tổng tiền {response.total_amount}. "
                f"Sản phẩm: {items_str}")
    except Exception as e:
        return f"Đã xảy ra lỗi khi kiểm tra đơn hàng: {str(e)}"
