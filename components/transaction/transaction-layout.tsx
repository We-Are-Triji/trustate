"use client";

import { ReactNode, useState } from "react";
import { Home, MessageSquare, FileText, Wallet, Bot, Lock, Menu, X, ChevronRight, ChevronLeft, Settings } from "lucide-react";

// ... (lines 6-128 unchanged)

const menuItems: MenuItem[] = [
  { id: "overview", label: "Overview", icon: Home },
  { id: "messages", label: "Message Center", icon: MessageSquare },
  { id: "documents", label: "Document Vault", icon: FileText },
  { id: "escrow", label: "Escrow & Payments", icon: Wallet },
  { id: "assistant", label: "Smart Assistant", icon: Bot },
  { id: "settings", label: "Settings", icon: Settings },
];

interface TransactionMenuProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  transactionId: string;
  projectName?: string;
  lockedTabs?: string[];
  onClose?: () => void;
}

export function TransactionMenu({ activeTab, onTabChange, transactionId, projectName, lockedTabs = [], onClose }: TransactionMenuProps) {
  // ...
  const handleTabChange = (tabId: string) => {
    onTabChange(tabId);
    onClose?.(); // Close mobile drawer
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-gray-100 pt-12 md:pt-6">
        <h2 className="font-bold text-[#0247ae] text-lg truncate" title={projectName}>{projectName}</h2>
        <p className="text-xs text-gray-500 font-mono mt-1">ID: {transactionId}</p>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const isLocked = lockedTabs.includes(item.id);

            return (
              <li key={item.id}>
                <button
                  onClick={() => !isLocked && handleTabChange(item.id)}
                  disabled={isLocked}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${isActive
                    ? "bg-[#0247ae] text-white shadow-md shadow-blue-900/10"
                    : isLocked
                      ? "text-gray-300 cursor-not-allowed bg-gray-50/50"
                      : "text-gray-600 hover:bg-gray-50 hover:text-[#0247ae]"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} className={isActive ? "text-white" : isLocked ? "text-gray-300" : "text-gray-500 group-hover:text-[#0247ae]"} />
                    {item.label}
                  </div>
                  {isLocked && <Lock size={14} className="text-gray-300" />}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 mt-auto border-t border-gray-100/50">
        <div className="text-xs text-center text-gray-400">
          Trustate Workbench v1.0
        </div>
      </div>
    </div>
  );
}
