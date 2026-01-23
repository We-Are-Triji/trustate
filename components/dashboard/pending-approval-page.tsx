"use client";

import { Clock, CheckCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";

interface PendingApprovalPageProps {
  accountType: "agent" | "broker";
}

export function PendingApprovalPage({ accountType }: PendingApprovalPageProps) {
  const router = useRouter();
  const { userId } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  const handleReset = async () => {
    try {
      const res = await fetch("/api/agent/reset-broker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentId: userId }),
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Failed to change broker");
        return;
      }

      // Redirect to verify page to re-enter details
      router.push("/verify");
    } catch (error) {
      console.error("Reset error:", error);
      alert("An unexpected error occurred");
    }
  };

  const message = accountType === "agent"
    ? "Your broker needs to accept your Nexus Link request before you can access the platform."
    : "Your documents are being reviewed. This usually takes 1-2 business days.";

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#ffce08]/20">
          <Clock size={40} className="text-[#0247ae]" />
        </div>

        <h1 className="text-2xl font-bold text-[#0247ae] mb-2">
          Pending Approval
        </h1>

        <p className="text-gray-600 mb-6">{message}</p>

        <div className="rounded-xl border border-gray-200 bg-white p-4 mb-6">
          <h3 className="font-medium text-gray-800 mb-3">What happens next?</h3>
          <ul className="space-y-2 text-sm text-gray-600 text-left">
            <li className="flex items-start gap-2">
              <CheckCircle size={16} className="text-green-500 mt-0.5 shrink-0" />
              <span>You&apos;ll receive an email once approved</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle size={16} className="text-green-500 mt-0.5 shrink-0" />
              <span>Full platform access will be granted</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle size={16} className="text-green-500 mt-0.5 shrink-0" />
              <span>You can start listing properties</span>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          {accountType === "agent" && (
            <Button
              variant="outline"
              onClick={handleReset}
              className="w-full border-[#0247ae] text-[#0247ae] hover:bg-[#0247ae]/5"
            >
              <RefreshCw size={16} className="mr-2" />
              Change Broker
            </Button>
          )}

          <Button
            variant="ghost"
            onClick={handleSignOut}
            className="text-gray-600 w-full"
          >
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}
