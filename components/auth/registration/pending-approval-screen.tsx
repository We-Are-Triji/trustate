"use client";

import { Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PendingApprovalScreen() {
  return (
    <Card className="w-full max-w-md border-0 bg-white shadow-xl rounded-3xl">
      <CardHeader className="pb-4 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#ffce08]/20">
          <Clock className="h-8 w-8 text-[#0247ae]" />
        </div>
        <CardTitle className="text-2xl font-bold text-[#0247ae] font-[family-name:var(--font-arsenal-sc)]">
          Pending Broker Approval
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-center">
        <p className="text-gray-600">
          Your registration is awaiting confirmation from your supervising broker.
        </p>

        <div className="rounded-lg bg-[#0247ae]/10 p-4 text-sm text-[#0247ae]">
          <p className="font-medium">Please contact your broker</p>
          <p className="mt-1">
            Ask them to accept your registration request from their Trustate account.
          </p>
        </div>

        <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
          <p>
            The broker has <span className="font-medium text-[#0247ae]">3 days</span> to confirm.
            If not confirmed, you will need to register again.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
