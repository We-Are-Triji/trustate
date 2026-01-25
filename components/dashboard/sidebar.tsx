"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { FileText, Settings, LogOut, Users, Building2, TrendingUp, MessageSquare, Briefcase, LayoutDashboard, ChevronLeft, ChevronRight, Sun, Moon } from "lucide-react";
import { useAuth } from "@/lib/hooks/use-auth";
import { signOut } from "@/lib/cognito";
import type { AccountType } from "@/lib/types/registration";
import trustateLogo from "@/app/assets/trustate-logo.png";
import { useSidebar } from "@/lib/contexts/sidebar-context";
import { useTheme } from "@/lib/contexts/theme-context";

const getNavItems = (accountType: AccountType | null, brokerType: "individual" | "firm" | null) => {
  const baseItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ];

  if (accountType === "client") {
    return [
      baseItems[0],
      { href: "/dashboard/transactions", label: "Transactions", icon: FileText },
      { href: "/dashboard/properties", label: "Properties", icon: Building2 },
      { href: "/dashboard/messages", label: "Messages", icon: MessageSquare },
      baseItems[1],
    ];
  }

  if (accountType === "agent") {
    return [
      baseItems[0],
      { href: "/dashboard/transactions", label: "Transactions", icon: FileText },
      { href: "/dashboard/clients", label: "Clients", icon: Users },
      baseItems[1],
    ];
  }

  if (accountType === "broker") {
    const items = [
      baseItems[0],
      { href: "/dashboard/agents", label: "Agents", icon: Users },
    ];

    if (brokerType === "firm") {
      items.push({ href: "/dashboard/firm", label: "Firm", icon: Briefcase });
    }

    items.push(baseItems[1]);
    return items;
  }

  return baseItems;
};

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { firstName, lastName, accountType, brokerType } = useAuth();
  const { collapsed, setCollapsed } = useSidebar();
  const { theme, toggleTheme } = useTheme();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleSignOut = async () => {
    setIsLoggingOut(true);
    try {
      document.cookie = "accountType=; path=/; max-age=0";
      await signOut();
      router.push("/login");
    } catch (error) {
      setIsLoggingOut(false);
    }
  };

  const fullName = [firstName, lastName].filter(Boolean).join(" ") || "User";
  const initials = fullName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  const navItems = getNavItems(accountType, brokerType);

  return (
    <aside
      className={`
        bg-white dark:bg-gray-800
        border-r border-gray-200 dark:border-gray-700
        h-screen flex flex-col fixed left-0 top-0 z-50
        transition-all duration-300
        ${collapsed ? "w-24" : "w-64"}
      `}
    >
      {/* Logo & Toggle */}
      <div className={`p-5 flex ${collapsed ? "flex-col gap-4 justify-center" : "items-center justify-between"} border-b border-gray-100 dark:border-gray-700`}>
        <div className={`flex items-center gap-2 min-w-0 ${!collapsed && "flex-1 mr-2"}`}>
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#0247ae] to-[#0560d4] flex items-center justify-center shrink-0">
            <Image
              src={trustateLogo}
              alt="TruState"
              width={24}
              height={24}
              className="object-contain brightness-0 invert"
            />
          </div>
          {!collapsed && (
            <h1 className="text-xl font-bold bg-gradient-to-r from-[#0247ae] to-[#0560d4] bg-clip-text text-transparent whitespace-nowrap">
              TruState
            </h1>
          )}
        </div>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-all duration-300 hover:scale-110 shrink-0"
        >
          {collapsed ? <ChevronRight size={18} strokeWidth={2} /> : <ChevronLeft size={18} strokeWidth={2} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 overflow-y-auto">
        <ul className="space-y-1 px-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`
                    flex items-center gap-3 h-12 rounded-xl 
                    transition-all duration-300 group relative hover:scale-[1.02]
                    ${collapsed ? "justify-center w-12 mx-auto" : "px-4"}
                    ${isActive
                      ? "bg-[#0247ae] text-white shadow-lg shadow-[#0247ae]/25"
                      : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-[#0247ae] dark:hover:text-[#0560d4]"
                    }
                  `}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon size={20} strokeWidth={2} className="shrink-0" />
                  {!collapsed && (
                    <span className="text-sm font-medium whitespace-nowrap">
                      {item.label}
                    </span>
                  )}

                  {/* Tooltip (only when collapsed) */}
                  {collapsed && (
                    <div className="absolute left-full ml-4 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none">
                      {item.label}
                      <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900 dark:border-r-gray-700" />
                    </div>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile, Theme Toggle & Logout */}
      <div className="border-t border-gray-100 dark:border-gray-700 p-3 space-y-2">
        {/* Theme Toggle */}
        <div className={collapsed ? "flex justify-center" : "px-4"}>
          {collapsed ? (
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center h-12 w-12 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-[#0247ae] dark:hover:text-[#0560d4] transition-all duration-200 group relative"
              title={theme === "light" ? "Dark Mode" : "Light Mode"}
            >
              {theme === "light" ? <Moon size={20} strokeWidth={2} /> : <Sun size={20} strokeWidth={2} />}

              {/* Tooltip */}
              <div className="absolute left-full ml-4 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none">
                {theme === "light" ? "Dark Mode" : "Light Mode"}
                <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900 dark:border-r-gray-700" />
              </div>
            </button>
          ) : (
            <div className="flex items-center justify-between py-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {theme === "light" ? "Light" : "Dark"}
              </span>

              <button
                onClick={toggleTheme}
                className={`
                  relative inline-flex h-7 w-14 items-center rounded-full 
                  transition-colors duration-300 
                  focus:outline-none focus:ring-2 focus:ring-[#0247ae] focus:ring-offset-2 dark:focus:ring-offset-gray-800
                  ${theme === "dark" ? "bg-[#0247ae]" : "bg-gray-300"}
                `}
              >
                <span
                  className={`
                    inline-flex h-6 w-6 items-center justify-center 
                    transform rounded-full bg-white shadow-md 
                    transition-transform duration-300
                    ${theme === "dark" ? "translate-x-7" : "translate-x-1"}
                  `}
                >
                  {theme === "light" ? (
                    <Sun size={14} strokeWidth={2} className="text-gray-700" />
                  ) : (
                    <Moon size={14} strokeWidth={2} className="text-gray-700" />
                  )}
                </span>
              </button>
            </div>
          )}
        </div>

        {/* User Avatar */}
        <div className={`flex items-center gap-3 group relative transition-all duration-300 ${collapsed ? "justify-center" : "p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50"}`}>
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#0247ae] to-[#0560d4] flex items-center justify-center cursor-pointer hover:shadow-lg hover:shadow-[#0247ae]/25 transition-all duration-300 shrink-0 hover:scale-105">
            <span className="text-sm font-bold text-white">{initials}</span>
          </div>

          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{fullName}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{accountType}</p>
            </div>
          )}

          {/* Tooltip (only when collapsed) */}
          {collapsed && (
            <div className="absolute left-full ml-4 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none">
              <div className="font-semibold">{fullName}</div>
              <div className="text-gray-300 dark:text-gray-400 capitalize">{accountType}</div>
              <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900 dark:border-r-gray-700" />
            </div>
          )}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleSignOut}
          disabled={isLoggingOut}
          className={`
            flex items-center gap-3 h-12 rounded-xl 
            text-gray-500 dark:text-gray-400 
            hover:bg-red-50 dark:hover:bg-red-900/20 
            hover:text-red-600 dark:hover:text-red-400 
            transition-all duration-300 group relative w-full hover:scale-[1.02]
            disabled:opacity-50 disabled:cursor-not-allowed
            ${collapsed ? "justify-center" : "px-4"}
          `}
          title={collapsed ? "Sign Out" : undefined}
        >
          <LogOut size={20} strokeWidth={2} className={`shrink-0 ${isLoggingOut ? "animate-pulse" : ""}`} />
          {!collapsed && <span className="text-sm font-medium">{isLoggingOut ? "Signing out..." : "Sign Out"}</span>}

          {/* Tooltip (only when collapsed) */}
          {collapsed && (
            <div className="absolute left-full ml-4 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none">
              Sign Out
              <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900 dark:border-r-gray-700" />
            </div>
          )}
        </button>
      </div>
    </aside>
  );
}
