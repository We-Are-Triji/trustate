"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Bot, X, Send, Loader2, Copy, Check, ThumbsUp, ThumbsDown, Trash2, Download, Sparkles } from "lucide-react";
import { useAuth } from "@/lib/hooks/use-auth";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  feedback?: "up" | "down";
  actions?: { label: string; href: string }[];
}

const STORAGE_KEY = "trustate_assistant_messages";
const MAX_MESSAGES = 40;
const ASSISTANT_API_URL = process.env.NEXT_PUBLIC_ASSISTANT_API_URL;

const QUICK_ACTIONS = [
  { label: "Verification status", prompt: "What's my verification status?" },
  { label: "View transactions", prompt: "How do I view my transactions?" },
  { label: "Account settings", prompt: "How do I update my account settings?" },
];

const PAGE_CONTEXT: Record<string, string> = {
  "/dashboard": "main dashboard",
  "/dashboard/transactions": "transactions page",
  "/dashboard/settings": "settings page",
};

function parseActions(content: string): { text: string; actions: { label: string; href: string }[] } {
  const actionRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  const actions: { label: string; href: string }[] = [];
  const text = content.replace(actionRegex, (_, label, href) => {
    actions.push({ label, href });
    return "";
  }).trim();
  return { text, actions };
}

function getStoredMessages(): Message[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "[]");
    return parsed.slice(-MAX_MESSAGES).map((m: Message) => ({ ...m, timestamp: new Date(m.timestamp) }));
  } catch {
    return [];
  }
}

function storeMessages(messages: Message[]) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-MAX_MESSAGES)));
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

async function sendToAssistant(
  messages: Message[],
  userContext: { email: string | null; accountType: string | null; currentPage: string }
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
    <button onClick={handleCopy} className="p-1 rounded hover:bg-gray-200 text-gray-400 hover:text-gray-600">
      {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
    </button>
  );
}

function FeedbackButtons({ messageId, feedback, onFeedback }: { messageId: string; feedback?: "up" | "down"; onFeedback: (id: string, fb: "up" | "down") => void }) {
  return (
    <div className="flex gap-0.5">
      <button
        onClick={() => onFeedback(messageId, "up")}
        className={`p-1 rounded hover:bg-gray-200 ${feedback === "up" ? "text-green-500" : "text-gray-400 hover:text-gray-600"}`}
      >
        <ThumbsUp size={12} />
      </button>
      <button
        onClick={() => onFeedback(messageId, "down")}
        className={`p-1 rounded hover:bg-gray-200 ${feedback === "down" ? "text-red-500" : "text-gray-400 hover:text-gray-600"}`}
      >
        <ThumbsDown size={12} />
      </button>
    </div>
  );
}

export function AiAssistantFab() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { email, accountType } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setMessages(getStoredMessages());
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (text?: string) => {
    const content = text || input.trim();
    if (!content || isLoading) return;

    const userMessage: Message = { id: crypto.randomUUID(), role: "user", content, timestamp: new Date() };
    const updatedMessages = [...messages, userMessage].slice(-MAX_MESSAGES);
    setMessages(updatedMessages);
    storeMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    try {
      const currentPage = PAGE_CONTEXT[pathname] || pathname;
      const response = await sendToAssistant(updatedMessages, { email, accountType, currentPage });
      const { text: responseText, actions } = parseActions(response);
      const assistantMessage: Message = { id: crypto.randomUUID(), role: "assistant", content: responseText, timestamp: new Date(), actions };
      const finalMessages = [...updatedMessages, assistantMessage].slice(-MAX_MESSAGES);
      setMessages(finalMessages);
      storeMessages(finalMessages);
    } catch {
      const errorMessage: Message = { id: crypto.randomUUID(), role: "assistant", content: "Sorry, I encountered an error. Please try again.", timestamp: new Date() };
      setMessages([...updatedMessages, errorMessage].slice(-MAX_MESSAGES));
    } finally {
      setIsLoading(false);
    }
  };

  const handleFeedback = (id: string, fb: "up" | "down") => {
    setMessages((prev) => {
      const updated = prev.map((m) => (m.id === id ? { ...m, feedback: m.feedback === fb ? undefined : fb } : m));
      storeMessages(updated);
      return updated;
    });
  };

  const handleClear = () => {
    setMessages([]);
    sessionStorage.removeItem(STORAGE_KEY);
  };

  const handleExport = () => {
    const text = messages.map((m) => `[${formatTime(m.timestamp)}] ${m.role === "user" ? "You" : "Assistant"}: ${m.content}`).join("\n\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `trustate-chat-${new Date().toISOString().split("T")[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
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
        <div className="fixed bottom-24 right-6 w-80 h-[480px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50 animate-[fadeInUp_0.2s_ease-out]">
          <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-[#0247ae] flex items-center justify-center">
                <Bot size={14} className="text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 text-sm">AI Assistant</h3>
            </div>
            <div className="flex items-center gap-1">
              {messages.length > 0 && (
                <>
                  <button onClick={handleExport} className="p-1.5 rounded hover:bg-gray-100 text-gray-400" title="Export chat">
                    <Download size={14} />
                  </button>
                  <button onClick={handleClear} className="p-1.5 rounded hover:bg-gray-100 text-gray-400" title="Clear chat">
                    <Trash2 size={14} />
                  </button>
                </>
              )}
              <button onClick={() => setIsOpen(false)} className="p-1.5 rounded hover:bg-gray-100 text-gray-500">
                <X size={14} />
              </button>
            </div>
          </div>

          <div className="flex-1 px-3 py-2 overflow-y-auto space-y-2">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Bot size={32} className="mb-2 text-gray-300" />
                <p className="text-xs text-gray-500 mb-3">How can I help you?</p>
                <div className="flex flex-wrap gap-1.5 justify-center">
                  {QUICK_ACTIONS.map((action) => (
                    <button
                      key={action.label}
                      onClick={() => handleSend(action.prompt)}
                      className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 hover:bg-[#0247ae] hover:text-white rounded-full transition-colors"
                    >
                      <Sparkles size={10} />
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                  <div className={`group relative max-w-[85%] px-3 py-2 rounded-xl text-[13px] ${
                    msg.role === "user" ? "bg-[#0247ae] text-white rounded-br-sm" : "bg-gray-100 text-gray-800 rounded-bl-sm"
                  }`}>
                    <span className="whitespace-pre-wrap leading-relaxed">{msg.content}</span>
                    {msg.actions && msg.actions.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {msg.actions.map((action, i) => (
                          <button
                            key={i}
                            onClick={() => router.push(action.href)}
                            className="px-2 py-0.5 text-xs bg-[#0247ae] text-white rounded hover:bg-[#023a8a]"
                          >
                            {action.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 mt-0.5 px-1">
                    <span className="text-[10px] text-gray-400">{formatTime(msg.timestamp)}</span>
                    {msg.role === "assistant" && (
                      <>
                        <CopyButton text={msg.content} />
                        <FeedbackButtons messageId={msg.id} feedback={msg.feedback} onFeedback={handleFeedback} />
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex items-start">
                <div className="bg-gray-100 px-3 py-2 rounded-xl rounded-bl-sm flex items-center gap-2">
                  <Loader2 size={12} className="animate-spin text-gray-500" />
                  <span className="text-xs text-gray-500">AI is typing...</span>
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
                onClick={() => handleSend()}
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
