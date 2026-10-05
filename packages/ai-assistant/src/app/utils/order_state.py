"""Record proposed sensitive calls separately from customer confirmation."""


def proposed_order_state(response) -> dict:
    """Replace previous proposals with the exact calls produced by the order agent."""
    pending = [{"tool_call_id": call["id"], "name": call["name"], "args": dict(call["args"])}
               for call in response.tool_calls
               if call["name"] in ("place_order_tool", "cancel_order_tool")]
    if not pending:
        return {}
    return {
        "pending_actions": pending,
        "action_status": "awaiting_confirmation",
        "order_draft": next((action["args"] for action in pending
                             if action["name"] == "place_order_tool"), None),
    }
