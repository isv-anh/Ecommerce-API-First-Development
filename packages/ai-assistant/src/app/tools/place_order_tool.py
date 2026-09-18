from langchain_core.tools import tool
from app.clients.order_client import order_client_manager
from app.buf.generated.order.v1 import order_pb2

@tool
def place_order_tool(product_id: str, quantity: int, customer_id: str, payment_method: str, shipping_address: str, phone_number: str) -> str:
    """
    Thực hiện đặt hàng (place order) sau khi đã thu thập ĐẦY ĐỦ thông tin.
    Tất cả các tham số đều là bắt buộc và không được tự bịa ra.
    
    Args:
        product_id: ID hoặc mã của sản phẩm (hoặc variant_id nếu có).
        quantity: Số lượng sản phẩm cần đặt.
        customer_id: ID của khách hàng (có thể hỏi tên khách hàng làm ID).
        payment_method: Phương thức thanh toán (ví dụ: COD, CREDIT_CARD).
        shipping_address: Địa chỉ giao hàng đầy đủ.
        phone_number: Số điện thoại liên hệ.
    """
    client = order_client_manager.get_client()
    try:
        full_address = f"{shipping_address} - SĐT: {phone_number}"
        request = order_pb2.PlaceOrderRequest(
            customer_id=customer_id,
            items=[order_pb2.OrderItem(product_id=product_id, quantity=quantity)],
            payment_method=payment_method,
            shipping_address=full_address
        )
        response = client.PlaceOrder(request)
        return f"Đặt hàng thành công. Mã đơn hàng: {response.order_id}, Trạng thái: {response.status}, Lời nhắn: {response.message}"
    except Exception as e:
        return f"Đã xảy ra lỗi khi đặt hàng: {str(e)}"
