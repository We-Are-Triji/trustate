"use client";

import Link from "next/link";
import { AlertTriangle, ArrowRight } from "lucide-react";

export function VerificationBanner() {
  return (
    <div className="bg-[#ffce08] text-[#0247ae]">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle size={18} />
          <span className="text-sm font-medium">
            Your account is not verified. Complete verification to unlock all features.
          </span>
        </div>
        <Link
          href="/verify"
          className="flex items-center gap-1 text-sm font-semibold hover:underline"
        >
          Verify Now
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
