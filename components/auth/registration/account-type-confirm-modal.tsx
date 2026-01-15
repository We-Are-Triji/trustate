"use client";

import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { AccountType } from "@/lib/types/registration";

interface AccountTypeConfirmModalProps {
  open: boolean;
  accountType: AccountType | null;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const ACCOUNT_LABELS: Record<AccountType, string> = {
  client: "Client",
  agent: "Agent / Salesperson",
  broker: "Broker",
};

export function AccountTypeConfirmModal({ open, accountType, onConfirm, onCancel, isLoading }: AccountTypeConfirmModalProps) {
  if (!accountType) return null;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && !isLoading && onCancel()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0247ae] to-[#0560d4] shadow-lg shadow-[#0247ae]/30">
            <ShieldCheck className="h-8 w-8 text-white" />
          </div>
          <DialogTitle className="text-center text-xl">Join the TruState Community</DialogTitle>
          <DialogDescription className="text-center">
            You&apos;re registering as a <span className="font-semibold text-[#0247ae]">{ACCOUNT_LABELS[accountType]}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 my-4">
          <div className="rounded-xl bg-[#0247ae]/5 border border-[#0247ae]/20 p-4">
            <p className="text-sm text-gray-700 text-center">
              By confirming, you agree to uphold <span className="font-semibold text-[#0247ae]">TruState&apos;s Community Standards</span> for trusted real estate transactions.
            </p>
          </div>
          
          <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
            <p className="text-sm text-amber-800 text-center">
              <span className="font-semibold">Note:</span> Account type cannot be changed after confirmation.
            </p>
          </div>
        </div>

        <DialogFooter className="flex gap-2 sm:gap-2">
          <Button variant="outline" onClick={onCancel} disabled={isLoading} className="flex-1">
            Go Back
          </Button>
          <Button 
            onClick={onConfirm} 
            disabled={isLoading}
            className="flex-1 bg-[#0247ae] hover:bg-[#023a8a]"
          >
            {isLoading ? "Confirming..." : "Confirm & Continue"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
