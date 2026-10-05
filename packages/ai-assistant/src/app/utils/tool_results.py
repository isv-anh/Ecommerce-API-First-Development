"""Keep complete tool payloads in checkpoints and small payloads in LLM context."""

import json
from typing import Any

from langchain_core.messages import ToolMessage


def tool_payload(message: ToolMessage) -> Any:
    """Read the original payload, including messages from older checkpoints."""
    if message.artifact is not None:
        return message.artifact
    try:
        return json.loads(message.content)
    except (TypeError, ValueError):
        return message.content


def product_summary(product: dict) -> dict:
    """Keep identifiers and useful facts, marking shortened descriptions explicitly."""
    result = {key: product[key] for key in (
        "productId", "productName", "price", "categoryName", "brandName"
    ) if key in product}
    description = product.get("description", "")
    if description:
        result["description"] = description[:240]
        if len(description) > 240:
            result["description_truncated"] = True
    return result


def compact_payload(name: str, payload: Any) -> Any:
    """Remove presentation fields without discarding errors or business identifiers."""
    if not isinstance(payload, dict):
        return payload
    if name == "get_products" and isinstance(payload.get("data"), list):
        return {**payload, "data": [product_summary(p) for p in payload["data"]]}
    if name == "check_order_tool":
        return {key: value for key, value in payload.items() if key != "customer_id"}
    return payload


def compact_tool_message(message: ToolMessage) -> ToolMessage:
    """Preserve tool call linkage and attach full data outside model-visible content."""
    payload = tool_payload(message)
    compact = compact_payload(message.name or "", payload)
    content = compact if isinstance(compact, str) else json.dumps(
        compact, ensure_ascii=False, separators=(",", ":")
    )
    return message.model_copy(update={"content": content, "artifact": payload})
