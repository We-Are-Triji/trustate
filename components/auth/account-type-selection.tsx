"use client";

import Link from "next/link";
import { User, Briefcase, Building2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AccountType } from "@/lib/types/registration";

interface AccountTypeSelectionProps {
  onSelect: (type: AccountType) => void;
  onBack?: () => void;
}

const ACCOUNT_TYPES: { type: AccountType; label: string; description: string; icon: typeof User }[] = [
  {
    type: "client",
    label: "Client",
    description: "Looking to buy, sell, or rent property",
    icon: User,
  },
  {
    type: "agent",
    label: "Agent / Salesperson",
    description: "Licensed real estate salesperson",
    icon: Briefcase,
  },
  {
    type: "broker",
    label: "Broker",
    description: "Licensed real estate broker",
    icon: Building2,
  },
];

export function AccountTypeSelection({ onSelect, onBack }: AccountTypeSelectionProps) {
  return (
    <Card className="w-full max-w-md border-[#E2E8F0] bg-white shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center">
          {onBack && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="mr-2 h-8 w-8 p-0 text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft size={18} />
            </Button>
          )}
          <div className={`flex-1 text-center ${onBack ? "pr-10" : ""}`}>
            <CardTitle className="text-xl font-semibold text-gray-800">
              Choose Account Type
            </CardTitle>
            <p className="text-sm text-gray-500">How will you use Trustate?</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {ACCOUNT_TYPES.map(({ type, label, description, icon: Icon }) => (
          <button
            key={type}
            onClick={() => onSelect(type)}
            className="flex w-full items-center gap-4 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-4 text-left transition-colors hover:border-gray-400 hover:bg-gray-50 active:bg-gray-100"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-800 text-white">
              <Icon size={24} />
            </div>
            <div>
              <p className="font-medium text-gray-800">{label}</p>
              <p className="text-sm text-gray-500">{description}</p>
            </div>
          </button>
        ))}
        {!onBack && (
          <p className="text-center text-sm text-gray-500 pt-2">
            Already have an account?{" "}
            <Link href="/login" className="text-gray-800 hover:underline">
              Sign in
            </Link>
          </p>
        )}
      </CardContent>
    </Card>
  );
}
