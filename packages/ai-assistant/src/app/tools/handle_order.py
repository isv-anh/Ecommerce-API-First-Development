from langchain_core.tools import tool

@tool
def handle_order(product_name: str, quantity: int) -> str:
    """
    Thực hiện đặt hàng, dựa trên thông tin sản phẩm và số lượng được cung cấp.
    
    Args:
        product_name: Tên sản phẩm cần tìm giá (ví dụ: 'iPhone 15', 'Áo sơ mi').
        quantity: Số lượng cần đặt hàng.
    """
    # Logic thực tế của bạn (query SQL, gọi API, v.v.)
    fake_database = {
        "iphone 15": 21000000,
        "áo sơ mi": 350000
    }
    
    price = fake_database.get(product_name.lower())
    if price:
        total_price = price * quantity
        return f"Sản phẩm {product_name} có giá là {price:,} VND, số lượng đặt hàng là {quantity}, tổng cộng là {total_price:,} VND."
    return f"Không tìm thấy thông tin giá cho sản phẩm {product_name}."