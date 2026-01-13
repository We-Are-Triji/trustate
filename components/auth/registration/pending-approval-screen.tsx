"use client";

import { Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PendingApprovalScreen() {
  return (
    <Card className="w-full max-w-md border-[#E2E8F0] bg-white shadow-sm">
      <CardHeader className="pb-4 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
          <Clock className="h-8 w-8 text-amber-600" />
        </div>
        <CardTitle className="text-xl font-semibold text-gray-800">
          Pending Broker Approval
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-center">
        <p className="text-gray-600">
          Your registration is awaiting confirmation from your supervising broker.
        </p>

        <div className="rounded-lg bg-amber-50 p-4 text-sm text-amber-800">
          <p className="font-medium">Please contact your broker</p>
          <p className="mt-1">
            Ask them to accept your registration request from their Trustate account.
          </p>
        </div>

        <div className="rounded-lg bg-gray-50 p-3 text-sm text-gray-600">
          <p>
            The broker has <span className="font-medium">3 days</span> to confirm.
            If not confirmed, you will need to register again.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
