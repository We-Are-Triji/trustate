"use client";

import { Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { VerificationMethod } from "@/lib/types/registration";

interface VerificationChoiceModalProps {
  open: boolean;
  email: string;
  mobile: string;
  onSelect: (method: VerificationMethod) => void;
}

export function VerificationChoiceModal({
  open,
  email,
  mobile,
  onSelect,
}: VerificationChoiceModalProps) {
  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="text-gray-800">Verify Your Account</DialogTitle>
          <DialogDescription>
            Choose how you want to receive your verification code
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 py-4">
          <Button
            variant="outline"
            className="h-auto justify-start gap-3 p-4 border-[#E2E8F0] hover:bg-[#F8FAFC]"
            onClick={() => onSelect("email")}
          >
            <Mail className="h-5 w-5 text-gray-600" />
            <div className="text-left">
              <p className="font-medium text-gray-800">Email</p>
              <p className="text-sm text-gray-500">{email}</p>
            </div>
          </Button>
          <Button
            variant="outline"
            className="h-auto justify-start gap-3 p-4 border-[#E2E8F0] hover:bg-[#F8FAFC]"
            onClick={() => onSelect("mobile")}
          >
            <Phone className="h-5 w-5 text-gray-600" />
            <div className="text-left">
              <p className="font-medium text-gray-800">Mobile</p>
              <p className="text-sm text-gray-500">{mobile}</p>
            </div>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
