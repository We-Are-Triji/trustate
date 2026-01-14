"use client";

import { useState } from "react";
import { User, Briefcase, Building2, ArrowLeft, Check } from "lucide-react";
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
  const [selected, setSelected] = useState<AccountType | null>(null);

  const handleContinue = () => {
    if (selected) {
      onSelect(selected);
    }
  };

  return (
    <>
      <CardHeader className="pb-1 pt-5 animate-[fadeInUp_0.5s_ease-out]">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <CardTitle className="text-2xl font-bold text-[#0247ae] font-[family-name:var(--font-arsenal-sc)]">
              Choose Account Type
            </CardTitle>
            <p className="text-gray-500 text-sm">How will you use TruState?</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col px-6 pb-4">
        <div className="flex-1 flex items-center justify-center">
          <div className="grid grid-cols-3 gap-4 w-full max-w-3xl">
            {ACCOUNT_TYPES.map(({ type, label, description, icon: Icon }, index) => (
              <button
                key={type}
                onClick={() => setSelected(type)}
                className={`group flex flex-col items-center gap-3 rounded-xl border-2 bg-white p-5 text-center transition-all duration-300 hover:-translate-y-1 active:translate-y-0 animate-[fadeInUp_0.5s_ease-out_both] ${
                  selected === type
                    ? "border-[#0247ae] shadow-lg shadow-[#0247ae]/20 ring-2 ring-[#0247ae]/20"
                    : "border-gray-100 hover:border-[#0247ae] hover:shadow-lg hover:shadow-[#0247ae]/10"
                }`}
                style={{ animationDelay: `${0.1 + index * 0.1}s` }}
              >
                <div className={`flex h-14 w-14 items-center justify-center rounded-xl text-white shadow-lg transition-transform duration-300 ${
                  selected === type
                    ? "bg-gradient-to-br from-[#0247ae] to-[#0560d4] shadow-[#0247ae]/30 scale-110"
                    : "bg-gradient-to-br from-[#0247ae] to-[#0560d4] shadow-[#0247ae]/30 group-hover:scale-110"
                }`}>
                  <Icon size={28} />
                </div>
                <div>
                  <p className="font-bold text-[#0247ae] text-base mb-1">{label}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
                </div>
                <div className={`flex items-center gap-1 text-xs font-medium transition-opacity ${
                  selected === type
                    ? "text-[#d4a900] opacity-100"
                    : "text-[#0247ae] opacity-0 group-hover:opacity-100"
                }`}>
                  {selected === type ? (
                    <>
                      <Check size={14} className="text-[#ffce08]" />
                      Selected
                    </>
                  ) : (
                    "Click to select"
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 mt-3 border-t border-gray-100 animate-[fadeInUp_0.5s_ease-out_0.3s_both]">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onBack}
            className="h-9 px-4 text-gray-600 hover:text-[#0247ae] hover:border-[#0247ae]"
          >
            <ArrowLeft size={16} className="mr-1" />
            Previous
          </Button>
          <Button
            onClick={handleContinue}
            disabled={!selected}
            className="bg-[#0247ae] hover:bg-[#023a8a] active:bg-[#022d6e] px-6 h-9 text-sm font-semibold shadow-lg shadow-[#0247ae]/25 hover:shadow-xl hover:shadow-[#0247ae]/30 transition-all duration-200 disabled:opacity-50 disabled:shadow-none"
          >
            Continue
          </Button>
        </div>
      </CardContent>
    </>
  );
}
