"use client";

import { useRouter } from "next/navigation";
import { signOut } from "@/lib/cognito";
import { useAuth } from "@/lib/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function DashboardPage() {
  const { userStatus, accountType, email } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500">
            {email} · {accountType ? `${accountType.charAt(0).toUpperCase() + accountType.slice(1)}` : "User"}
            {userStatus === "registered" && " · Unverified"}
          </p>
        </div>
        <Button variant="outline" onClick={handleSignOut} className="gap-2">
          <LogOut size={16} />
          Sign Out
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className={`rounded-xl border bg-white p-6 ${userStatus === "registered" ? "opacity-50 pointer-events-none" : ""}`}>
          <h3 className="font-semibold text-gray-900 mb-2">My Listings</h3>
          <p className="text-sm text-gray-500 mb-4">Manage your property listings</p>
          <Button disabled={userStatus === "registered"} className="w-full bg-[#0247ae]">
            View Listings
          </Button>
        </div>

        <div className={`rounded-xl border bg-white p-6 ${userStatus === "registered" ? "opacity-50 pointer-events-none" : ""}`}>
          <h3 className="font-semibold text-gray-900 mb-2">Messages</h3>
          <p className="text-sm text-gray-500 mb-4">Chat with clients and agents</p>
          <Button disabled={userStatus === "registered"} className="w-full bg-[#0247ae]">
            Open Messages
          </Button>
        </div>

        <div className={`rounded-xl border bg-white p-6 ${userStatus === "registered" ? "opacity-50 pointer-events-none" : ""}`}>
          <h3 className="font-semibold text-gray-900 mb-2">Analytics</h3>
          <p className="text-sm text-gray-500 mb-4">View your performance metrics</p>
          <Button disabled={userStatus === "registered"} className="w-full bg-[#0247ae]">
            View Analytics
          </Button>
        </div>
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
