from langchain_core.tools import tool

@tool
def check_inventory_tool(product_id: str) -> str:
    """
    Kiểm tra tồn kho và các biến thể (variants) của sản phẩm.
    
    Args:
        product_id: ID hoặc mã của sản phẩm.
    """
    # Mock data for inventory check
    variants = [
        {"variant_id": "V1", "color": "Đen", "size": "M", "stock": 50},
        {"variant_id": "V2", "color": "Trắng", "size": "L", "stock": 10},
    ]
    variants_str = ", ".join([f"{v['color']} - Size {v['size']} (còn {v['stock']} chiếc)" for v in variants])
    return f"Sản phẩm {product_id} hiện còn hàng. Các phân loại hiện có: {variants_str}"
