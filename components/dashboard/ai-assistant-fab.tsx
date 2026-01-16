"use client";

import { useState } from "react";
import { Bot, X, Send } from "lucide-react";

export function AiAssistantFab() {
  const [isOpen, setIsOpen] = useState(false);

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
                <p className="text-xs text-gray-500">Ask me anything</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex-1 p-4 overflow-y-auto">
            <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
              <Bot size={48} className="mb-3 text-gray-300" />
              <p className="text-sm">How can I help you today?</p>
              <p className="text-xs mt-1">Ask about properties, transactions, or get assistance.</p>
            </div>
          </div>

          <div className="p-4 border-t border-gray-100">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#0247ae]"
              />
              <button className="px-4 py-2.5 bg-[#0247ae] text-white rounded-lg hover:bg-[#023a8a] transition-colors">
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
