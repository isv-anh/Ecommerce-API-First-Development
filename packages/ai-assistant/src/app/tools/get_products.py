import grpc
from typing import Optional, List, Dict, Any
from langchain_core.tools import tool
from google.protobuf.json_format import MessageToDict

from app.buf.generated.product.v1 import product_pb2
from app.clients.product_client import product_client_manager


@tool
def get_products(
    keyword: Optional[str] = None,
    category_name: Optional[str] = None,
    brand_name: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    page: int = 1,
    page_size: int = 5,
    sort: Optional[str] = None,
) -> List[Dict[str, Any]]:
    """
    Tra cứu danh sách sản phẩm trong kho theo các điều kiện lọc (tên, hãng, danh mục, khoảng giá).
    Trả về danh sách các đối tượng Product chứa đầy đủ thông tin: productId, productName, description, price, categoryName, thumbnailUrl, brandName, slug.
    
    Args:
        keyword: Từ khóa tìm kiếm hoặc tên sản phẩm (ví dụ: 'iPhone 15', 'Áo polo').
        category_name: Tên danh mục lọc sản phẩm (ví dụ: 'Điện thoại', 'Thời trang').
        brand_name: Tên thương hiệu/hãng (ví dụ: 'Apple', 'Nike').
        min_price: Mức giá thấp nhất cần lọc.
        max_price: Mức giá cao nhất cần lọc.
        page: Số trang truy vấn (mặc định 1).
        page_size: Số lượng sản phẩm trên mỗi trang (mặc định 5).
        sort: Chuỗi sắp xếp theo mẫu 'field_name:asc' hoặc 'field_name:desc' (ví dụ: 'price:asc').
    """
    try:
        client = product_client_manager.get_client()

        # Tạo request protobuf khớp với SearchProductRequest
        request = product_pb2.SearchProductRequest(
            keyword=keyword,
            categoryName=category_name,
            brandName=brand_name,
            minPrice=min_price,
            maxPrice=max_price,
            page=page,
            pageSize=page_size,
            sort=sort,
        )

        response = client.SearchProduct(request, timeout=5.0)

        # Chuyển đổi protobuf message sang List[Dict] chuẩn Python
        # preserving_proto_field_name=False giúp giữ nguyên định dạng camelCase như proto (productId, productName,...)
        data = MessageToDict(response, preserving_proto_field_name=False)
        
        # Trả về danh sách products đúng theo schema của proto
        return data.get("products", [])

    except grpc.RpcError as e:
        return [{"error": f"gRPC Error ({e.code().name}): {e.details()}"}]
    except Exception as e:
        return [{"error": f"Unexpected error: {str(e)}"}]