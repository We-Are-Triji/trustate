"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { VerificationMethod } from "@/lib/types/registration";

interface OtpVerificationModalProps {
  open: boolean;
  method: VerificationMethod;
  destination: string;
  onVerify: (code: string) => Promise<boolean>;
  onResend: () => void;
  onClose: () => void;
}

export function OtpVerificationModal({
  open,
  method,
  destination,
  onVerify,
  onResend,
  onClose,
}: OtpVerificationModalProps) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (code.length !== 6) {
      setError("Enter 6-digit code");
      return;
    }
    setLoading(true);
    setError("");
    const success = await onVerify(code);
    if (!success) {
      setError("Invalid code");
    }
    setLoading(false);
  };

  const handleResend = () => {
    setCode("");
    setError("");
    onResend();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-gray-800">Enter Verification Code</DialogTitle>
          <DialogDescription>
            We sent a 6-digit code to your {method === "email" ? "email" : "mobile"}:{" "}
            <span className="font-medium">{destination}</span>
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Input
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="000000"
            className="text-center text-2xl tracking-widest border-[#E2E8F0] bg-[#F8FAFC]"
            maxLength={6}
          />
          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          <Button
            onClick={handleVerify}
            disabled={loading || code.length !== 6}
            className="w-full bg-gray-800 hover:bg-gray-900"
          >
            {loading ? "Verifying..." : "Verify"}
          </Button>
          <button
            type="button"
            onClick={handleResend}
            className="w-full text-sm text-gray-500 hover:text-gray-700"
          >
            Resend code
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
