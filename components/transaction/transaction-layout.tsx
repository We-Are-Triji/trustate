"use client";

import { ReactNode, useState } from "react";
import { Home, MessageSquare, FileText, Wallet, Bot, Lock, Menu, X, ChevronRight, ChevronLeft, Settings, Activity } from "lucide-react";

interface TransactionLayoutProps {
  children: ReactNode;
  leftMenu: ReactNode;
  rightTools: ReactNode;
}

export function TransactionLayout({ children, leftMenu, rightTools }: TransactionLayoutProps) {
  const [leftDrawerOpen, setLeftDrawerOpen] = useState(false);
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false);

  return (
    <div className="h-screen bg-[#F8FAFC] p-2 md:p-4 overflow-hidden">
      <div className="h-full flex gap-2 md:gap-4">
        {/* Mobile Menu Button */}
        <button
          onClick={() => setLeftDrawerOpen(true)}
          className="md:hidden fixed top-4 left-4 z-50 h-10 w-10 bg-white rounded-xl shadow-lg flex items-center justify-center border border-gray-200"
        >
          <Menu size={20} className="text-gray-600" />
        </button>

        {/* Column A: Navigation - Mobile Drawer / Desktop Fixed */}
        <>
          {/* Mobile Overlay */}
          {leftDrawerOpen && (
            <div
              className="md:hidden fixed inset-0 bg-black/50 z-40"
              onClick={() => setLeftDrawerOpen(false)}
            />
          )}

          {/* Drawer/Sidebar */}
          <div className={`
            fixed md:relative inset-y-0 left-0 z-50 md:z-0
            w-[280px] md:w-[250px] shrink-0
            bg-white rounded-none md:rounded-3xl shadow-xl md:shadow-sm
            border-r md:border border-gray-100
            flex flex-col overflow-hidden
            transform transition-transform duration-300 ease-in-out
            ${leftDrawerOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          `}>
            {/* Mobile Close Button */}
            <button
              onClick={() => setLeftDrawerOpen(false)}
              className="md:hidden absolute top-4 right-4 h-8 w-8 rounded-lg bg-gray-100 flex items-center justify-center"
            >
              <X size={18} className="text-gray-600" />
            </button>
            {leftMenu}
          </div>
        </>

        {/* Column B: The Workspace - Fluid */}
        <div className="flex-1 min-w-0 bg-white rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 overflow-hidden relative ml-0 md:ml-0">
          {children}
        </div>

        {/* Column C: Deal Lifecycle - Collapsible on tablet, hidden on mobile */}
        <div className={`
          hidden md:flex
          ${rightPanelCollapsed ? "w-12" : "w-[300px]"}
          shrink-0 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex-col
          transition-all duration-300 ease-in-out
        `}>
          {/* Collapse Toggle */}
          <button
            onClick={() => setRightPanelCollapsed(!rightPanelCollapsed)}
            className="absolute top-4 -left-3 z-10 h-6 w-6 bg-white border border-gray-200 rounded-full shadow-sm flex items-center justify-center hover:bg-gray-50"
            style={{ position: "relative", marginLeft: rightPanelCollapsed ? "3px" : "-12px", marginTop: "12px" }}
          >
            {rightPanelCollapsed ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
          </button>

          {rightPanelCollapsed ? (
            <div className="h-full flex flex-col items-center justify-center">
              <div className="writing-mode-vertical text-xs text-gray-400 rotate-180" style={{ writingMode: "vertical-rl" }}>
                Deal Lifecycle
              </div>
            </div>
          ) : (
            rightTools
          )}
        </div>

        {/* Mobile Bottom Bar for Lifecycle */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 flex items-center justify-center px-4 z-30">
          <button
            onClick={() => setRightPanelCollapsed(!rightPanelCollapsed)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full text-sm font-medium text-gray-700"
          >
            <span>View Deal Progress</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Mobile Right Panel Overlay */}
      {!rightPanelCollapsed && (
        <div className="md:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setRightPanelCollapsed(true)}>
          <div
            className="absolute right-0 top-0 bottom-16 w-[300px] bg-white shadow-xl overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setRightPanelCollapsed(true)}
              className="absolute top-4 left-4 h-8 w-8 rounded-lg bg-gray-100 flex items-center justify-center"
            >
              <X size={18} className="text-gray-600" />
            </button>
            <div className="pt-14">{rightTools}</div>
          </div>
        </div>
      )}
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
  { id: "activity", label: "Activity", icon: Activity },
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
  const handleTabChange = (tabId: string) => {
    onTabChange(tabId);
    onClose?.(); // Close mobile drawer
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-gray-100 pt-12 md:pt-6">
        <h2 className="font-bold text-[#0247ae] text-lg truncate" title={projectName}>{projectName || "New Transaction"}</h2>
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
