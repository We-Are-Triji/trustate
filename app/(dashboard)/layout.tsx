"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/use-auth";
import { VerificationBanner } from "@/components/dashboard/verification-banner";
import { PendingApprovalPage } from "@/components/dashboard/pending-approval-page";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isLoading, isAuthenticated, userStatus, accountType } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-[#0247ae] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (userStatus === "pending_approval" && (accountType === "agent" || accountType === "broker")) {
    return <PendingApprovalPage accountType={accountType} />;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {userStatus === "registered" && <VerificationBanner />}
      {children}
    </div>
  );
}
