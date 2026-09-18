"use client";

import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useAiRoutesChat } from "@e-commerce/api-client/endpoints/system";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import Fab from "@mui/material/Fab";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  data?: any;
}

const JSON_INDENT = 2;

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { token, isInitialized } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      sender: "ai",
      text: "Xin chào! Tôi có thể giúp gì cho bạn?",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const chatMutation = useAiRoutesChat();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || chatMutation.isPending) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: inputValue,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    try {
      const response = await chatMutation.mutateAsync({
        data: { message: userMessage.text },
      });
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: response.message,
        data: response.data ? JSON.parse(response.data) : null,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Chat error", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  if (!isInitialized) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] font-sans">
      {!isOpen && (
        <Fab
          color="primary"
          aria-label="chat"
          onClick={() => setIsOpen(true)}
          sx={{
            boxShadow: "0 4px 14px 0 rgba(0,118,255,0.39)",
            "&:hover": {
              boxShadow: "0 6px 20px rgba(0,118,255,0.23)",
            },
          }}
        >
          <ChatIcon />
        </Fab>
      )}

      {isOpen && (
        <div className="w-[350px] sm:w-[400px] h-[500px] max-h-[80vh] flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100 transition-all duration-300">
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <ChatIcon />
              <span className="font-semibold text-lg">AI Assistant</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors"
            >
              <CloseIcon />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 bg-gray-50 overflow-y-auto p-4 space-y-4">
            {!token ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 text-center px-4">
                <ChatIcon sx={{ fontSize: 48, color: "#ccc", mb: 2 }} />
                <p>Bạn phải đăng nhập để thực hiện chức năng này</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      msg.sender === "user"
                        ? "bg-blue-600 text-white rounded-tr-sm"
                        : "bg-white text-gray-800 border border-gray-100 shadow-sm rounded-tl-sm"
                    }`}
                  >
                    <p className="text-sm">{msg.text}</p>
                    {msg.data && (
                      <div className="mt-2 text-xs bg-gray-50 p-2 rounded-lg border border-gray-100 text-gray-600">
                        <pre className="whitespace-pre-wrap font-mono">
                          {JSON.stringify(msg.data, null, JSON_INDENT)}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer */}
          {token && (
            <div className="p-3 bg-white border-t border-gray-100">
              <form
                onSubmit={handleSend}
                className="flex items-center gap-2 bg-gray-50 rounded-full pr-2 pl-4 py-1"
              >
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 outline-none"
                  disabled={chatMutation.isPending}
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || chatMutation.isPending}
                  className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 transition-colors"
                >
                  <SendIcon sx={{ fontSize: 16, ml: "2px" }} />
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
