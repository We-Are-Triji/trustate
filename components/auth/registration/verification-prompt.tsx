"use client";

import { ShieldCheck, ArrowRight, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AccountType } from "@/lib/types/registration";

interface VerificationPromptProps {
  accountType: AccountType;
  onStartVerification: () => void;
  onSkipToLogin: () => void;
}

const VERIFICATION_INFO: Record<AccountType, { title: string; steps: string[] }> = {
  client: {
    title: "Client Verification",
    steps: ["Upload a valid government ID", "Complete face verification"],
  },
  agent: {
    title: "Agent Verification",
    steps: [
      "Upload a valid government ID",
      "Complete face verification",
      "Submit PRC Accreditation details",
      "Connect with your broker via Nexus Link",
    ],
  },
  broker: {
    title: "Broker Verification",
    steps: [
      "Upload a valid government ID",
      "Complete face verification",
      "Submit PRC License & Certificate of Registration",
      "Provide Surety Bond details",
      "Select business structure",
    ],
  },
};

export function VerificationPrompt({ accountType, onStartVerification, onSkipToLogin }: VerificationPromptProps) {
  const info = VERIFICATION_INFO[accountType];

  return (
    <>
      <CardHeader className="pb-2 pt-8">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0247ae] to-[#0560d4] text-white shadow-lg shadow-[#0247ae]/30">
            <ShieldCheck size={32} />
          </div>
          <CardTitle className="text-2xl font-bold text-[#0247ae] font-[family-name:var(--font-arsenal-sc)]">
            {info.title}
          </CardTitle>
          <p className="text-gray-500 text-sm mt-1">Complete verification to unlock all features</p>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col px-8 pb-6">
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-full max-w-md">
            <div className="rounded-xl border-2 border-gray-100 bg-white p-6 mb-6">
              <h3 className="font-semibold text-gray-800 mb-4">Verification Steps:</h3>
              <ol className="space-y-3">
                {info.steps.map((step, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#0247ae]/10 text-xs font-semibold text-[#0247ae]">
                      {index + 1}
                    </span>
                    <span className="text-sm text-gray-600 pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div className="rounded-xl bg-[#ffce08]/10 border border-[#ffce08]/30 p-4 mb-6">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Why verify?</span> Verified accounts can list properties, 
                connect with clients, and access all platform features.
              </p>
            </div>

            <div className="rounded-xl bg-red-50 border border-red-200 p-4 mb-6">
              <p className="text-sm text-red-700">
                <span className="font-semibold">Important:</span> Your account type cannot be changed after registration. 
                If you need a different account type, you&apos;ll need to register again.
              </p>
            </div>

            <div className="space-y-3">
              <Button
                onClick={onStartVerification}
                className="w-full bg-[#0247ae] hover:bg-[#023a8a] h-12 text-base font-semibold shadow-lg shadow-[#0247ae]/25"
              >
                Start Verification
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>

              <button
                onClick={onSkipToLogin}
                className="w-full flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-[#0247ae] transition-colors py-2"
              >
                <LogIn size={16} />
                Skip for now and go to dashboard
              </button>
              <p className="text-xs text-center text-gray-400">
                You can complete verification later from your profile
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </>
  );
}
