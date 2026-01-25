"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/hooks/use-auth";

interface Message {
  id: string;
  sender_id: string;
  sender_role: string;
  content: string;
  timestamp: string;
}

interface ConversationTabProps {
  transactionId: string;
}

export function ConversationTab({ transactionId }: ConversationTabProps) {
  const { email, accountType } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();
  }, [transactionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/transactions/${transactionId}/messages`, {
        headers: { "x-user-id": email || "demo-user" },
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isSending) return;

    setIsSending(true);
    const content = input.trim();
    setInput("");

    // Optimistic update
    const tempMessage: Message = {
      id: `temp-${Date.now()}`,
      sender_id: email || "demo-user",
      sender_role: accountType || "agent",
      content,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempMessage]);

    try {
      const response = await fetch(`/api/transactions/${transactionId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": email || "demo-user",
        },
        body: JSON.stringify({ content }),
      });

      if (response.ok) {
        const data = await response.json();
        // Replace temp message with real one
        setMessages((prev) =>
          prev.map((m) => (m.id === tempMessage.id ? data.message : m))
        );
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "agent":
        return "text-blue-600";
      case "broker":
        return "text-purple-600";
      case "client":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#0247ae] mx-auto mb-2" />
          <p className="text-sm text-gray-500">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-gray-900">Messages</h2>
          <p className="text-xs text-gray-500">{messages.length} messages</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-gray-500">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isOwnMessage = msg.sender_id === email || msg.sender_id === "demo-user";
            return (
              <div
                key={msg.id}
                className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[70%] ${isOwnMessage ? "items-end" : "items-start"} flex flex-col`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-medium capitalize ${getRoleColor(msg.sender_role)}`}>
                      {msg.sender_role}
                    </span>
                  </div>
                  <div
                    className={`px-4 py-2 rounded-2xl ${isOwnMessage
                        ? "bg-[#0247ae] text-white rounded-br-sm"
                        : "bg-gray-100 text-gray-800 rounded-bl-sm"
                      }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                  <span className="text-xs text-gray-400 mt-1">
                    {new Date(msg.timestamp).toLocaleTimeString([], {
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
            disabled={isSending}
            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0247ae] disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isSending}
            className="px-4 py-2 bg-[#0247ae] text-white rounded-lg hover:bg-[#023a8a] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
}
