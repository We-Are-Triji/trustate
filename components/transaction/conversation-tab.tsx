"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/hooks/use-auth";

interface Message {
  message_id: string;
  sender_id: string;
  sender_name: string;
  sender_role: string;
  content: string;
  created_at: string;
}

interface ConversationTabProps {
  transactionId: string;
}

const WEBSOCKET_URL = process.env.NEXT_PUBLIC_WEBSOCKET_URL;

export function ConversationTab({ transactionId }: ConversationTabProps) {
  const { email, accountType } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isConnecting, setIsConnecting] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    connectWebSocket();
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [transactionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const connectWebSocket = () => {
    if (!WEBSOCKET_URL || !email) return;

    const userId = email; // Using email as userId for now
    const userName = email.split("@")[0];
    const userRole = accountType || "client";

    const ws = new WebSocket(
      `${WEBSOCKET_URL}?transactionId=${transactionId}&userId=${userId}&userName=${userName}&userRole=${userRole}`
    );

    ws.onopen = () => {
      console.log("WebSocket connected");
      setIsConnected(true);
      setIsConnecting(false);
      // Request message history
      ws.send(JSON.stringify({ action: "getMessages", transactionId, limit: 50 }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.action === "messageHistory") {
        setMessages(data.data || []);
      } else if (data.action === "newMessage") {
        setMessages((prev) => [...prev, data.data]);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setIsConnecting(false);
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
      setIsConnected(false);
      // Attempt reconnect after 3 seconds
      setTimeout(() => {
        if (wsRef.current?.readyState === WebSocket.CLOSED) {
          connectWebSocket();
        }
      }, 3000);
    };

    wsRef.current = ws;
  };

  const handleSend = () => {
    if (!input.trim() || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

    wsRef.current.send(
      JSON.stringify({
        action: "sendMessage",
        transactionId,
        content: input.trim(),
      })
    );

    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (isConnecting) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#0247ae] mx-auto mb-2" />
          <p className="text-sm text-gray-500">Connecting to chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-gray-900">Conversation</h2>
          <p className="text-xs text-gray-500">
            {isConnected ? "Connected" : "Disconnected"}
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-gray-500">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isOwnMessage = msg.sender_id === email;
            return (
              <div
                key={msg.message_id}
                className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[70%] ${isOwnMessage ? "items-end" : "items-start"} flex flex-col`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-gray-600">
                      {msg.sender_name}
                    </span>
                    <span className="text-xs text-gray-400 capitalize">
                      {msg.sender_role}
                    </span>
                  </div>
                  <div
                    className={`px-4 py-2 rounded-2xl ${
                      isOwnMessage
                        ? "bg-[#0247ae] text-white rounded-br-sm"
                        : "bg-gray-100 text-gray-800 rounded-bl-sm"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                  <span className="text-xs text-gray-400 mt-1">
                    {new Date(msg.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-100">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            disabled={!isConnected}
            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0247ae] disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || !isConnected}
            className="px-4 py-2 bg-[#0247ae] text-white rounded-lg hover:bg-[#023a8a] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
