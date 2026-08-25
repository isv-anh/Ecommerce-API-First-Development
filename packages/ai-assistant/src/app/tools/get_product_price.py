from langchain_core.tools import tool

@tool
def get_product_price(product_name: str, currency: str = "VND") -> str:
    """
    Tra cứu giá bán hiện tại của một sản phẩm trong hệ thống cửa hàng.
    
    Args:
        product_name: Tên sản phẩm cần tìm giá (ví dụ: 'iPhone 15', 'Áo sơ mi').
        currency: Đơn vị tiền tệ (mặc định là 'VND').
    """
    # Logic thực tế của bạn (query SQL, gọi API, v.v.)
    fake_database = {
        "iphone 15": 21000000,
        "áo sơ mi": 350000
    }
    
    price = fake_database.get(product_name.lower())
    if price:
        return f"Sản phẩm {product_name} có giá là {price:,} {currency}."
    return f"Không tìm thấy thông tin giá cho sản phẩm {product_name}."