"""Retrieve a full description only when the agent needs product details."""

from typing import Annotated

from langchain_core.messages import ToolMessage
from langchain_core.tools import tool
from langgraph.prebuilt import InjectedState

from app.utils.tool_results import tool_payload


@tool
def get_product_details(product_id: str, state: Annotated[dict, InjectedState]) -> dict:
    """Lấy mô tả đầy đủ của sản phẩm đã tra cứu khi cần thông số, size hoặc chất liệu."""
    for message in reversed(state.get("messages", [])):
        if not isinstance(message, ToolMessage) or message.name != "get_products":
            continue
        payload = tool_payload(message)
        products = payload.get("data") if isinstance(payload, dict) else None
        for product in products or []:
            if product.get("productId") == product_id:
                return {key: product[key] for key in (
                    "productId", "productName", "description", "price", "categoryName", "brandName"
                ) if key in product}
    return {"message": "Chưa có dữ liệu sản phẩm này. Hãy tra cứu lại bằng get_products."}
