"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, FileSearch, Calculator, HelpCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}

interface SmartAssistantProps {
    transactionId: string;
}

const quickActions = [
    { icon: FileSearch, label: "Analyze Documents", prompt: "Analyze the uploaded documents for this transaction" },
    { icon: Calculator, label: "Calculate Fees", prompt: "Calculate all applicable fees and taxes for this transaction" },
    { icon: HelpCircle, label: "Transaction Status", prompt: "Give me a summary of this transaction's current status" },
];

export function SmartAssistant({ transactionId }: SmartAssistantProps) {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome",
            role: "assistant",
            content: "Hello! I'm your Smart Assistant for this transaction. I can help you analyze documents, calculate fees, answer questions about the process, and more. How can I help you today?",
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (messageText?: string) => {
        const text = messageText || input;
        if (!text.trim()) return;

        const userMessage: Message = {
            id: `user-${Date.now()}`,
            role: "user",
            content: text,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsTyping(true);

        // Simulate AI response
        setTimeout(() => {
            const responses = [
                "I've analyzed your request. Based on the transaction details, here's what I found...",
                "Great question! Let me help you with that. For this type of transaction, you'll need to consider...",
                "I've reviewed the available information. Here's a summary of the current status and next steps...",
                "Based on the documents uploaded, I can see that the transaction is progressing well. The next milestone is...",
            ];

            const assistantMessage: Message = {
                id: `assistant-${Date.now()}`,
                role: "assistant",
                content: responses[Math.floor(Math.random() * responses.length)],
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, assistantMessage]);
            setIsTyping(false);
        }, 1500);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#0247ae] to-[#0560d4] flex items-center justify-center">
                        <Sparkles size={20} className="text-white" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Smart Assistant</h2>
                        <p className="text-sm text-gray-500">AI-powered transaction helper</p>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <p className="text-xs font-medium text-gray-500 mb-3">Quick Actions</p>
                <div className="flex gap-2 flex-wrap">
                    {quickActions.map((action, index) => {
                        const Icon = action.icon;
                        return (
                            <button
                                key={index}
                                onClick={() => handleSend(action.prompt)}
                                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-gray-200 text-sm text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all"
                            >
                                <Icon size={14} className="text-[#0247ae]" />
                                {action.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                        {message.role === "assistant" && (
                            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#0247ae] to-[#0560d4] flex items-center justify-center shrink-0">
                                <Bot size={16} className="text-white" />
                            </div>
                        )}
                        <div
                            className={`max-w-[80%] rounded-2xl px-4 py-3 ${message.role === "user"
                                    ? "bg-[#0247ae] text-white rounded-br-md"
                                    : "bg-gray-100 text-gray-900 rounded-bl-md"
                                }`}
                        >
                            <p className="text-sm leading-relaxed">{message.content}</p>
                            <p className={`text-[10px] mt-2 ${message.role === "user" ? "text-blue-200" : "text-gray-400"}`}>
                                {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </p>
                        </div>
                        {message.role === "user" && (
                            <div className="h-8 w-8 rounded-lg bg-gray-200 flex items-center justify-center shrink-0">
                                <User size={16} className="text-gray-600" />
                            </div>
                        )}
                    </div>
                ))}

                {isTyping && (
                    <div className="flex gap-3">
                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#0247ae] to-[#0560d4] flex items-center justify-center shrink-0">
                            <Bot size={16} className="text-white" />
                        </div>
                        <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
                            <div className="flex items-center gap-2">
                                <Loader2 size={14} className="animate-spin text-gray-500" />
                                <span className="text-sm text-gray-500">Thinking...</span>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-100 bg-white">
                <div className="flex gap-3">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask me anything about this transaction..."
                        className="flex-1"
                    />
                    <Button
                        onClick={() => handleSend()}
                        disabled={!input.trim() || isTyping}
                        className="bg-[#0247ae] hover:bg-[#0560d4] text-white"
                    >
                        <Send size={18} />
                    </Button>
                </div>
                <p className="text-[10px] text-gray-400 text-center mt-2">
                    AI responses are for guidance only. Always verify important information.
                </p>
            </div>
        </div>
    );
}
