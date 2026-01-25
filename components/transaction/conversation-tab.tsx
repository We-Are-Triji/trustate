"use client";

import { useState, useEffect, useRef } from "react";
import { Send, Loader2, Wifi, WifiOff } from "lucide-react";
import { useAuth } from "@/lib/hooks/use-auth";
import { useTransactionChat } from "@/lib/hooks/use-transaction-chat";
import { Badge } from "@/components/ui/badge";

interface ConversationTabProps {
  transactionId: string;
}

export function ConversationTab({ transactionId }: ConversationTabProps) {
  const { userId, firstName, lastName, accountType } = useAuth();
  const userName = `${firstName} ${lastName}`.trim() || "Unknown User";

  const { messages, sendMessage, status } = useTransactionChat({
    transactionId,
    userId: userId || "",
    userName,
    userRole: accountType || "client"
  });

  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input.trim());
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getRoleColor = (role: string) => {
    switch (role?.toLowerCase()) {
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

  const isConnected = status === "connected";

  return (
    <div className="h-full flex flex-col">
      {/* Status Bar */}
      <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-end">
        <div className="flex items-center gap-2">
          {status === "connecting" && (
            <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">
              <Loader2 size={10} className="mr-1 animate-spin" /> Connecting...
            </Badge>
          )}
          {status === "connected" && (
            <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" /> Live
            </Badge>
          )}
          {status === "disconnected" && (
            <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
              <WifiOff size={10} className="mr-1" /> Disconnected
            </Badge>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-400">
              <p>No messages yet.</p>
              <p className="text-xs">Start the conversation!</p>
            </div>
          </div>
        ) : (
          messages.map((msg) => {
            const isOwnMessage = msg.sender_id === userId;
            const isSystem = msg.sender_role === "system";

            if (isSystem) {
              return (
                <div key={msg.id} className="flex justify-center my-4">
                  <span className="text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
                    {msg.content}
                  </span>
                </div>
              );
            }

            return (
              <div
                key={msg.id}
                className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[70%] ${isOwnMessage ? "items-end" : "items-start"} flex flex-col`}>
                  <div className="flex items-center gap-2 mb-1">
                    {!isOwnMessage && (
                      <span className="text-xs font-medium text-gray-700 mr-1">{msg.sender_name}</span>
                    )}
                    <span className={`text-[10px] font-medium uppercase tracking-wider ${getRoleColor(msg.sender_role)}`}>
                      {msg.sender_role}
                    </span>
                  </div>
                  <div
                    className={`px-4 py-2 rounded-2xl shadow-sm ${isOwnMessage
                      ? "bg-[#0247ae] text-white rounded-br-sm"
                      : "bg-white border border-gray-100 text-gray-800 rounded-bl-sm"
                      }`}
                  >
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  </div>
                  <span className="text-[10px] text-gray-400 mt-1 px-1">
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

      {/* Input Area */}
      <div className="p-4 border-t border-gray-100 bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isConnected ? "Type a message..." : "Reconnecting..."}
            disabled={!isConnected}
            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-[#0247ae] disabled:opacity-50 disabled:bg-gray-50 transition-all font-medium text-gray-700 placeholder:text-gray-400"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || !isConnected}
            className="px-4 py-2 bg-[#0247ae] text-white rounded-lg hover:bg-[#023a8a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
