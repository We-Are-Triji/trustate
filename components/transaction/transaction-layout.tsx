"use client";

import { ReactNode } from "react";
import { Home, MessageSquare, FileText, Wallet, Bot, Lock } from "lucide-react";

interface TransactionLayoutProps {
  children: ReactNode;
  leftMenu: ReactNode;
  rightTools: ReactNode;
}

export function TransactionLayout({ children, leftMenu, rightTools }: TransactionLayoutProps) {
  return (
    <div className="h-screen bg-[#F8FAFC] p-4 overflow-hidden">
      <div className="h-full flex gap-4">
        {/* Column A: Navigation & Toolkit - Fixed 250px */}
        <div className="w-[250px] shrink-0 bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
          {leftMenu}
        </div>

        {/* Column B: The Workspace - Fluid/Flex-1 */}
        <div className="flex-1 min-w-0 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden relative">
          {children}
        </div>

        {/* Column C: Deal Lifecycle - Fixed 300px */}
        <div className="w-[300px] shrink-0 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
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
  { id: "messages", label: "Message Center", icon: MessageSquare },
  { id: "documents", label: "Document Vault", icon: FileText },
  { id: "escrow", label: "Escrow & Payments", icon: Wallet },
  { id: "assistant", label: "Smart Assistant", icon: Bot },
];

interface TransactionMenuProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  transactionId: string;
  projectName?: string;
  lockedTabs?: string[];
}

export function TransactionMenu({ activeTab, onTabChange, transactionId, projectName = "Unit 101 - Avida", lockedTabs = [] }: TransactionMenuProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-gray-100">
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
                  onClick={() => !isLocked && onTabChange(item.id)}
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

      {/* Footer / User Profile could go here */}
      <div className="p-4 mt-auto border-t border-gray-100/50">
        <div className="text-xs text-center text-gray-400">
          Trustate Workbench v1.0
        </div>
      </div>
    </div>
  );
}
