"use client";

import { User, Briefcase, Building2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AccountType } from "@/lib/types/registration";

interface AccountTypeContentProps {
  onSelect: (type: AccountType) => void;
  onBack: () => void;
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
    description: "Licensed real estate salesperson with PRC accreditation",
    icon: Briefcase,
  },
  {
    type: "broker",
    label: "Broker",
    description: "Licensed real estate broker with PRC license",
    icon: Building2,
  },
];

export function AccountTypeContent({ onSelect, onBack }: AccountTypeContentProps) {
  return (
    <>
      <CardHeader className="pb-4">
        <div className="flex items-center">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="mr-2 h-8 w-8 p-0 text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft size={18} />
          </Button>
          <div className="flex-1 text-center pr-10">
            <CardTitle className="text-xl font-semibold text-gray-800">Choose Account Type</CardTitle>
            <p className="text-sm text-gray-500">How will you use Trustate?</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center">
        <div className="grid grid-cols-3 gap-6 w-full max-w-3xl">
          {ACCOUNT_TYPES.map(({ type, label, description, icon: Icon }) => (
            <button
              key={type}
              onClick={() => onSelect(type)}
              className="flex flex-col items-center gap-4 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-8 text-center transition-colors hover:border-gray-400 hover:bg-gray-50 active:bg-gray-100"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-800 text-white">
                <Icon size={32} />
              </div>
              <div>
                <p className="font-medium text-gray-800 text-lg">{label}</p>
                <p className="text-sm text-gray-500 mt-1">{description}</p>
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </>
  );
}
