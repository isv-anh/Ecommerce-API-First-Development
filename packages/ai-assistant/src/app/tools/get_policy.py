from langchain_core.tools import tool

@tool
def get_policy() -> str:
    """
    Tra cứu chính sách bán hàng của một sản phẩm trong hệ thống cửa hàng.
    """
    # Logic thực tế của bạn (query SQL, gọi API, v.v.)
    fake_database = """
    Chính sách bán hàng:
    1. Chính sách đổi trả: Khách hàng có thể đổi trả sản phẩm trong vòng 7 ngày kể từ ngày mua, với điều kiện sản phẩm còn nguyên vẹn và chưa qua sử dụng.
    2. Chính sách bảo hành: Sản phẩm được bảo hành trong vòng 12 tháng kể từ ngày mua, với điều kiện sản phẩm không bị hư hỏng do người sử dụng.
    3. Chính sách giao hàng: Giao hàng miễn phí cho đơn hàng trên 500.000 VND, thời gian giao hàng từ 3-5 ngày làm việc.
    """
    
    return fake_database