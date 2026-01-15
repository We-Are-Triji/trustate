"use client";

import { useState } from "react";
import { CheckCircle, Mail, Phone } from "lucide-react";
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
  const [verified, setVerified] = useState(false);

  const handleVerify = async () => {
    if (code.length !== 6) {
      setError("Enter 6-digit code");
      return;
    }
    setLoading(true);
    setError("");
    const success = await onVerify(code);
    if (success) {
      setVerified(true);
      setTimeout(() => {
        setVerified(false);
        setCode("");
      }, 1500);
    } else {
      setError("Invalid code. Please try again.");
    }
    setLoading(false);
  };

  const handleResend = () => {
    setCode("");
    setError("");
    onResend();
  };

  const Icon = method === "email" ? Mail : Phone;

  return (
    <Dialog open={open} onOpenChange={(o) => !o && !loading && !verified && onClose()}>
      <DialogContent className="sm:max-w-sm">
        {verified ? (
          <div className="py-8 flex flex-col items-center animate-[fadeInScale_0.3s_ease-out]">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle className="h-8 w-8 text-emerald-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Verified!</h3>
            <p className="text-sm text-gray-500 mt-1">Your {method} has been confirmed</p>
          </div>
        ) : (
          <>
            <DialogHeader>
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#0247ae]/10">
                <Icon className="h-6 w-6 text-[#0247ae]" />
              </div>
              <DialogTitle className="text-center text-gray-800">Verify Your {method === "email" ? "Email" : "Phone"}</DialogTitle>
              <DialogDescription className="text-center">
                We sent a 6-digit code to<br />
                <span className="font-medium text-gray-700">{destination}</span>
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="000000"
                className="text-center text-2xl tracking-widest border-[#E2E8F0] bg-[#F8FAFC] h-14"
                maxLength={6}
                autoFocus
              />
              {error && <p className="text-sm text-red-500 text-center">{error}</p>}
              <Button
                onClick={handleVerify}
                disabled={loading || code.length !== 6}
                className="w-full bg-[#0247ae] hover:bg-[#023a8a] h-11"
              >
                {loading ? "Verifying..." : "Verify Code"}
              </Button>
              <p className="text-center text-sm text-gray-500">
                Didn&apos;t receive the code?{" "}
                <button
                  type="button"
                  onClick={handleResend}
                  className="font-medium text-[#0247ae] hover:text-[#023a8a]"
                >
                  Resend
                </button>
              </p>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
