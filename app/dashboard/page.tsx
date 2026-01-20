"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Building2, Users, TrendingUp, FileText, MessageSquare, Briefcase } from "lucide-react";

export default function DashboardPage() {
  const { userStatus, accountType, firstName } = useAuth();
  const router = useRouter();

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

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500">
          Welcome back, {firstName || "User"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quickActions.map((action) => (
          <div
            key={action.title}
            className={`rounded-xl border bg-white p-6 ${action.disabled ? "opacity-50 pointer-events-none" : ""}`}
          >
            <div className="mb-4 h-12 w-12 rounded-lg bg-[#0247ae]/10 flex items-center justify-center">
              <action.icon className="h-6 w-6 text-[#0247ae]" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">{action.title}</h3>
            <p className="text-sm text-gray-500 mb-4">{action.desc}</p>
            <Button
              disabled={action.disabled}
              onClick={() => router.push(action.href)}
              className="w-full bg-[#0247ae]"
            >
              Open
            </Button>
          </div>
        ))}
      </div>

      {userStatus === "registered" && (
        <div className="mt-8 rounded-xl border-2 border-dashed border-[#ffce08] bg-[#ffce08]/5 p-6 text-center">
          <p className="text-gray-700 mb-2">Complete verification to unlock all features</p>
          <Button className="bg-[#0247ae]" onClick={() => router.push("/verify")}>
            Start Verification
          </Button>
        </div>
      )}
    </div>
  );
}
