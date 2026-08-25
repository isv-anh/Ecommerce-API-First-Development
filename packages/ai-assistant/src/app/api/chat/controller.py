from flask import Blueprint, request, jsonify
from app.api.chat.service import ChatService
from app.graph.graph import agent_app

chat_controller = Blueprint("chat", __name__)

# Khởi tạo instance của ChatService với LLM
chat_service = ChatService(agent_app)

@chat_controller.post("/api/chat")
def chat():
    # 1. Kiểm tra định dạng JSON
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid request. JSON body is required."}), 400

    # 2. Lấy và validate input
    message = data.get("message")
    if not message or not str(message).strip():
        return jsonify({"error": "Field 'message' is required and cannot be empty."}), 422

    # Lấy thông tin user / session từ Headers (do Gateway truyền vào) hoặc từ body
    session_id = request.headers.get("x-session-id") or data.get("session_id", "default_session")
    user_id = request.headers.get("x-user-id") or data.get("user_id", "default_user")

    try:
        # 3. Gọi hàm xử lý của ChatService
        # (Truyền thêm session_id / user_id nếu service của bạn dùng Memory/LangGraph)
        ai_response = chat_service.process_query(message, session_id)

        # 4. Trả kết quả chuẩn JSON
        return jsonify({
            "message": message,
            "response": ai_response,
            "session_id": session_id
        }), 200

    except Exception as e:
        # Bắt lỗi nếu gọi LLM/Database thất bại
        return jsonify({
            "error": "Failed to process chat query.",
            "details": str(e)
        }), 500