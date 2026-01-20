"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, FileText, Settings, ChevronLeft, ChevronRight, LogOut, User, Users, Building2, TrendingUp, MessageSquare, Briefcase } from "lucide-react";
import { useAuth } from "@/lib/hooks/use-auth";
import { signOut } from "@/lib/cognito";
import type { AccountType } from "@/lib/types/registration";

const getNavItems = (accountType: AccountType | null) => {
  const baseItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ];

  if (accountType === "client") {
    return [
      baseItems[0],
      { href: "/dashboard/transactions", label: "My Transactions", icon: FileText },
      { href: "/dashboard/properties", label: "Saved Properties", icon: Building2 },
      { href: "/dashboard/messages", label: "Messages", icon: MessageSquare },
      baseItems[1],
    ];
  }

  if (accountType === "agent") {
    return [
      baseItems[0],
      { href: "/dashboard/transactions", label: "Transactions", icon: FileText },
      { href: "/dashboard/clients", label: "My Clients", icon: Users },
      { href: "/dashboard/listings", label: "Listings", icon: Building2 },
      { href: "/dashboard/messages", label: "Messages", icon: MessageSquare },
      baseItems[1],
    ];
  }

  if (accountType === "broker") {
    return [
      baseItems[0],
      { href: "/dashboard/agents", label: "My Agents", icon: Users },
      { href: "/dashboard/transactions", label: "Transactions", icon: FileText },
      { href: "/dashboard/analytics", label: "Analytics", icon: TrendingUp },
      { href: "/dashboard/firm", label: "Firm Management", icon: Briefcase },
      baseItems[1],
    ];
  }

  return baseItems;
};

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { firstName, lastName, accountType } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const handleSignOut = async () => {
    document.cookie = "accountType=; path=/; max-age=0";
    await signOut();
    router.push("/login");
  };

  const fullName = [firstName, lastName].filter(Boolean).join(" ") || "User";
  const navItems = getNavItems(accountType);

  return (
    <aside className={`bg-white border-r border-gray-200 min-h-screen flex flex-col transition-all duration-300 ${collapsed ? "w-16" : "w-64"}`}>
      <div className={`p-4 border-b border-gray-100 flex items-center ${collapsed ? "justify-center" : "justify-between"}`}>
        {!collapsed && (
          <h1 className="text-xl font-bold text-[#0247ae] font-[family-name:var(--font-arsenal-sc)]">
            TruState
          </h1>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      <nav className="flex-1 p-2">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[#0247ae] text-white"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  } ${collapsed ? "justify-center" : ""}`}
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon size={20} />
                  {!collapsed && item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-gray-100 p-2">
        <div className={`flex items-center gap-3 p-2 rounded-lg bg-gray-50 ${collapsed ? "justify-center" : ""}`}>
          <div className="h-8 w-8 rounded-full bg-[#0247ae]/10 flex items-center justify-center shrink-0">
            <User size={16} className="text-[#0247ae]" />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{fullName}</p>
              <p className="text-xs text-gray-500 capitalize">{accountType}</p>
            </div>
          )}
        </div>
        <button
          onClick={handleSignOut}
          className={`mt-2 w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors ${collapsed ? "justify-center" : ""}`}
          title={collapsed ? "Sign Out" : undefined}
        >
          <LogOut size={20} />
          {!collapsed && "Sign Out"}
        </button>
      </div>
    </aside>
  );
}
