"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, X, Send, Loader2, Copy, Check } from "lucide-react";
import { useAuth } from "@/lib/hooks/use-auth";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const STORAGE_KEY = "trustate_assistant_messages";
const MAX_MESSAGES = 40;
const ASSISTANT_API_URL = process.env.NEXT_PUBLIC_ASSISTANT_API_URL;

function getStoredMessages(): Message[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "[]");
    return parsed.slice(-MAX_MESSAGES);
  } catch {
    return [];
  }
}

function storeMessages(messages: Message[]) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-MAX_MESSAGES)));
}

async function sendToAssistant(
  messages: Message[],
  userContext: { email: string | null; accountType: string | null }
): Promise<string> {
  if (!ASSISTANT_API_URL) throw new Error("API not configured");

  const response = await fetch(ASSISTANT_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: messages.slice(-10).map((m) => ({ role: m.role, content: m.content })),
      userContext,
    }),
  });

  if (!response.ok) throw new Error("Failed to get response");
  const data = await response.json();
  return data.response;
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      onClick={handleCopy}
      className="opacity-0 group-hover:opacity-100 absolute -right-1 -top-1 p-1 rounded bg-white shadow border border-gray-200 text-gray-500 hover:text-[#0247ae] transition-all"
    >
      {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
    </button>
  );
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

    const userMessage: Message = { id: crypto.randomUUID(), role: "user", content: input.trim() };
    const updatedMessages = [...messages, userMessage].slice(-MAX_MESSAGES);
    setMessages(updatedMessages);
    storeMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await sendToAssistant(updatedMessages, { email, accountType });
      const assistantMessage: Message = { id: crypto.randomUUID(), role: "assistant", content: response };
      const finalMessages = [...updatedMessages, assistantMessage].slice(-MAX_MESSAGES);
      setMessages(finalMessages);
      storeMessages(finalMessages);
    } catch {
      const errorMessage: Message = { id: crypto.randomUUID(), role: "assistant", content: "Sorry, I encountered an error. Please try again." };
      const finalMessages = [...updatedMessages, errorMessage].slice(-MAX_MESSAGES);
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
        <div className="fixed bottom-24 right-6 w-80 h-[450px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50 animate-[fadeInUp_0.2s_ease-out]">
          <div className="flex items-center justify-between px-3 py-2.5 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-[#0247ae] flex items-center justify-center">
                <Bot size={14} className="text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">AI Assistant</h3>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-1 rounded hover:bg-gray-100 text-gray-500">
              <X size={16} />
            </button>
          </div>

          <div className="flex-1 px-3 py-2 overflow-y-auto space-y-2">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                <Bot size={36} className="mb-2 text-gray-300" />
                <p className="text-xs">How can I help you today?</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`relative group max-w-[85%] px-3 py-2 rounded-xl text-sm ${
                    msg.role === "user"
                      ? "bg-[#0247ae] text-white rounded-br-sm"
                      : "bg-gray-100 text-gray-800 rounded-bl-sm"
                  }`}>
                    {msg.role === "assistant" && <CopyButton text={msg.content} />}
                    <span className="whitespace-pre-wrap text-[13px] leading-relaxed">{msg.content}</span>
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 px-3 py-2 rounded-xl rounded-bl-sm">
                  <Loader2 size={14} className="animate-spin text-gray-500" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="px-3 py-2 border-t border-gray-100">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask something..."
                disabled={isLoading}
                className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#0247ae] disabled:opacity-50"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="px-3 py-2 bg-[#0247ae] text-white rounded-lg hover:bg-[#023a8a] transition-colors disabled:opacity-50"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 h-12 w-12 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 z-50 ${
          isOpen ? "bg-gray-600 hover:bg-gray-700" : "bg-[#0247ae] hover:bg-[#023a8a] hover:scale-105"
        }`}
      >
        {isOpen ? <X size={20} className="text-white" /> : <Bot size={20} className="text-white" />}
      </button>
    </>
  );
}
