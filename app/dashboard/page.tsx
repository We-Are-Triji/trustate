"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Building2, Users, TrendingUp, FileText, MessageSquare, Briefcase, ArrowRight, ShieldCheck } from "lucide-react";

export default function DashboardPage() {
  const { userStatus, accountType, firstName, lastName } = useAuth();
  const router = useRouter();

  const fullName = [firstName, lastName].filter(Boolean).join(" ") || "User";
  const initials = fullName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  const getQuickActions = () => {
    if (accountType === "client") {
      return [
        { title: "Browse Properties", desc: "Find your dream property", icon: Building2, href: "/properties", disabled: userStatus === "registered" },
        { title: "My Transactions", desc: "View active transactions", icon: FileText, href: "/dashboard/transactions", disabled: userStatus === "registered" },
        { title: "Messages", desc: "Chat with agents", icon: MessageSquare, href: "/dashboard/messages", disabled: userStatus === "registered" },
      ];
    }

    if (accountType === "agent") {
      return [
        { title: "My Clients", desc: "Manage client relationships", icon: Users, href: "/dashboard/clients", disabled: userStatus === "registered" },
        { title: "Transactions", desc: "Track ongoing deals", icon: FileText, href: "/dashboard/transactions", disabled: userStatus === "registered" },
        { title: "Listings", desc: "Manage property listings", icon: Building2, href: "/dashboard/listings", disabled: userStatus === "registered" },
      ];
    }

    if (accountType === "broker") {
      return [
        { title: "My Agents", desc: "Manage your agent network", icon: Users, href: "/dashboard/agents", disabled: userStatus === "registered" },
        { title: "Analytics", desc: "View performance metrics", icon: TrendingUp, href: "/dashboard/analytics", disabled: userStatus === "registered" },
        { title: "Firm Management", desc: "Manage firm operations", icon: Briefcase, href: "/dashboard/firm", disabled: userStatus === "registered" },
      ];
    }

    return [];
  };

  const quickActions = getQuickActions();

  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? "Good morning" : currentHour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-gray-900 transition-colors duration-300">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {greeting}, <span className="text-[#0247ae] dark:text-[#0560d4]">{firstName || "User"}</span>
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {accountType === "client" 
              ? "Manage your real estate journey" 
              : accountType === "agent"
              ? "Track your clients and transactions"
              : "Oversee your team and operations"}
          </p>
        </div>

        {/* Verification Banner */}
        {userStatus === "registered" && (
          <div className="mb-6 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#ffce08] to-[#f5c000]">
                  <ShieldCheck className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">Complete Your Verification</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Unlock all features by verifying your account</p>
                </div>
              </div>
              <Button 
                onClick={() => router.push("/verify")}
                className="bg-[#0247ae] hover:bg-[#0560d4] text-white font-semibold px-5 h-9 rounded-lg text-sm transition-all"
              >
                Start Now
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Welcome Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 mb-6 transition-colors duration-300">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              Welcome to TruState
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {accountType === "client" 
                ? "Start your real estate journey by browsing properties and connecting with verified agents."
                : accountType === "agent"
                ? "Manage your clients, track transactions, and grow your real estate business."
                : "Oversee your team's performance, manage agents, and track firm-wide analytics."}
            </p>
            {userStatus === "registered" && (
              <div className="flex items-start gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
                <ShieldCheck className="h-5 w-5 text-yellow-600 dark:text-yellow-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Verification Required</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Complete your identity verification to access all features and start using the platform.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action) => (
              <div
                key={action.title}
                className={`bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 transition-all duration-200 ${
                  action.disabled 
                    ? "opacity-60 cursor-not-allowed" 
                    : "hover:shadow-lg hover:shadow-[#0247ae]/10 dark:hover:shadow-[#0560d4]/10 hover:-translate-y-1 hover:border-[#0247ae]/30 dark:hover:border-[#0560d4]/30 cursor-pointer"
                }`}
                onClick={() => !action.disabled && router.push(action.href)}
              >
                <div className="flex items-start gap-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-100 dark:border-blue-800 shrink-0 transition-all duration-200 ${
                    !action.disabled && "group-hover:scale-110"
                  }`}>
                    <action.icon className="h-6 w-6 text-[#0247ae] dark:text-[#0560d4]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base font-bold text-gray-900 dark:text-white mb-1">
                      {action.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {action.desc}
                    </p>
                    {!action.disabled && (
                      <div className="flex items-center text-[#0247ae] dark:text-[#0560d4] font-semibold text-sm gap-2">
                        <span>Open</span>
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    )}
                    {action.disabled && (
                      <div className="flex items-center text-gray-400 dark:text-gray-500 text-sm gap-2">
                        <ShieldCheck className="h-4 w-4" />
                        <span className="font-medium">Verification Required</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>


      </div>
    </div>
  );
}
