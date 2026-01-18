"use client";

import { ReactNode } from "react";
import { Home, MessageSquare, FileText, Wallet, Activity } from "lucide-react";

interface TransactionLayoutProps {
  children: ReactNode;
  leftMenu: ReactNode;
  rightTools: ReactNode;
}

export function TransactionLayout({ children, leftMenu, rightTools }: TransactionLayoutProps) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4">
      <div className="h-[calc(100vh-2rem)] flex gap-4">
        {/* Left Column - Menu */}
        <div className="w-64 bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
          {leftMenu}
        </div>

        {/* Middle Column - Content */}
        <div className="flex-1 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {children}
        </div>

        {/* Right Column - Tools */}
        <div className="w-80 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {rightTools}
        </div>
      </div>
    </div>
  );
}

interface MenuItem {
  id: string;
  label: string;
  icon: typeof Home;
}

const menuItems: MenuItem[] = [
  { id: "overview", label: "Overview", icon: Home },
  { id: "conversation", label: "Conversation", icon: MessageSquare },
  { id: "documents", label: "Documents", icon: FileText },
  { id: "escrow", label: "Escrow", icon: Wallet },
  { id: "activity", label: "Activity Log", icon: Activity },
];

interface TransactionMenuProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  transactionId: string;
}

export function TransactionMenu({ activeTab, onTabChange, transactionId }: TransactionMenuProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-100">
        <h2 className="font-bold text-[#0247ae] text-lg">Transaction</h2>
        <p className="text-xs text-gray-500 truncate">{transactionId}</p>
      </div>
      <nav className="flex-1 p-3">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[#0247ae] text-white"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
