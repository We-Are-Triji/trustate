"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, X, Send, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/hooks/use-auth";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const STORAGE_KEY = "trustate_assistant_messages";
const ASSISTANT_API_URL = process.env.NEXT_PUBLIC_ASSISTANT_API_URL;

function getStoredMessages(): Message[] {
  if (typeof window === "undefined") return [];
  const stored = sessionStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  try {
    const parsed = JSON.parse(stored);
    return parsed.map((m: Message) => ({ ...m, timestamp: new Date(m.timestamp) }));
  } catch {
    return [];
  }
}

function storeMessages(messages: Message[]) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
}

async function sendToAssistant(
  messages: Message[],
  userContext: { email: string | null; accountType: string | null }
): Promise<string> {
  if (!ASSISTANT_API_URL) {
    throw new Error("Assistant API URL not configured");
  }

  const response = await fetch(ASSISTANT_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
      userContext,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to get response");
  }

  const data = await response.json();
  return data.response;
}

export function AiAssistantFab() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { email, accountType } = useAuth();

  useEffect(() => {
    setMessages(getStoredMessages());
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    storeMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await sendToAssistant(updatedMessages, { email, accountType });
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };
      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);
      storeMessages(finalMessages);
    } catch {
      const errorMessage: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      };
      const finalMessages = [...updatedMessages, errorMessage];
      setMessages(finalMessages);
      storeMessages(finalMessages);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50 animate-[fadeInUp_0.2s_ease-out]">
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-[#0247ae] flex items-center justify-center">
                <Bot size={18} className="text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">AI Assistant</h3>
                <p className="text-xs text-gray-500">Account support</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                <Bot size={48} className="mb-3 text-gray-300" />
                <p className="text-sm">How can I help you today?</p>
                <p className="text-xs mt-1">Ask about your account, transactions, or verification.</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm whitespace-pre-wrap ${
                      msg.role === "user"
                        ? "bg-[#0247ae] text-white rounded-br-md"
                        : "bg-gray-100 text-gray-800 rounded-bl-md"
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 px-4 py-2.5 rounded-2xl rounded-bl-md">
                  <Loader2 size={18} className="animate-spin text-gray-500" />
                </div>
              </div>
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
                placeholder="Type your message..."
                disabled={isLoading}
                className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#0247ae] disabled:opacity-50"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="px-4 py-2.5 bg-[#0247ae] text-white rounded-lg hover:bg-[#023a8a] transition-colors disabled:opacity-50"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 z-50 ${
          isOpen
            ? "bg-gray-600 hover:bg-gray-700"
            : "bg-[#0247ae] hover:bg-[#023a8a] hover:scale-105"
        }`}
      >
        {isOpen ? (
          <X size={24} className="text-white" />
        ) : (
          <Bot size={24} className="text-white" />
        )}
      </button>
    </>
  );
}
