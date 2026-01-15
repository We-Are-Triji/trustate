"use client";

import { AlertTriangle } from "lucide-react";
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
}

const ACCOUNT_LABELS: Record<AccountType, string> = {
  client: "Client",
  agent: "Agent / Salesperson",
  broker: "Broker",
};

export function AccountTypeConfirmModal({ open, accountType, onConfirm, onCancel }: AccountTypeConfirmModalProps) {
  if (!accountType) return null;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
            <AlertTriangle className="h-6 w-6 text-amber-600" />
          </div>
          <DialogTitle className="text-center">Confirm Account Type</DialogTitle>
          <DialogDescription className="text-center">
            You selected <span className="font-semibold text-[#0247ae]">{ACCOUNT_LABELS[accountType]}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg bg-red-50 border border-red-200 p-4 my-4">
          <p className="text-sm text-red-700 text-center">
            <span className="font-semibold">This cannot be changed.</span> If you need a different account type later, you&apos;ll need to register again with a new account.
          </p>
        </div>

        <DialogFooter className="flex gap-2 sm:gap-2">
          <Button variant="outline" onClick={onCancel} className="flex-1">
            Go Back
          </Button>
          <Button onClick={onConfirm} className="flex-1 bg-[#0247ae] hover:bg-[#023a8a]">
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
