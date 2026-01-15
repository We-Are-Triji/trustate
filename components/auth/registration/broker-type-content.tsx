"use client";

import { useState } from "react";
import { User, Building2, ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BrokerType } from "@/lib/types/registration";

interface BrokerTypeContentProps {
  onSelect: (type: BrokerType) => void;
  onBack: () => void;
}

const BROKER_TYPES: { type: BrokerType; label: string; description: string; icon: typeof User }[] = [
  {
    type: "individual",
    label: "Individual Practitioner",
    description: "Operating as a solo licensed broker",
    icon: User,
  },
  {
    type: "firm",
    label: "Brokerage Firm",
    description: "Operating as a registered company with SEC/DTI",
    icon: Building2,
  },
];

export function BrokerTypeContent({ onSelect, onBack }: BrokerTypeContentProps) {
  const [selected, setSelected] = useState<BrokerType | null>(null);

  const handleContinue = () => {
    if (selected) onSelect(selected);
  };

  return (
    <>
      <CardHeader className="pb-1 pt-5 animate-[fadeInUp_0.5s_ease-out]">
        <div className="text-center">
          <CardTitle className="text-2xl font-bold text-[#0247ae] font-[family-name:var(--font-arsenal-sc)]">
            Business Structure
          </CardTitle>
          <p className="text-gray-500 text-sm">How do you operate?</p>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col px-6 pb-4">
        <div className="flex-1 flex items-center justify-center">
          <div className="grid grid-cols-2 gap-6 w-full max-w-2xl">
            {BROKER_TYPES.map(({ type, label, description, icon: Icon }, index) => (
              <button
                key={type}
                onClick={() => setSelected(type)}
                className={`group flex flex-col items-center gap-4 rounded-xl border-2 bg-white p-6 text-center transition-all duration-300 hover:-translate-y-1 active:translate-y-0 animate-[fadeInUp_0.5s_ease-out_both] ${
                  selected === type
                    ? "border-[#0247ae] shadow-lg shadow-[#0247ae]/20 ring-2 ring-[#0247ae]/20"
                    : "border-gray-100 hover:border-[#0247ae] hover:shadow-lg hover:shadow-[#0247ae]/10"
                }`}
                style={{ animationDelay: `${0.1 + index * 0.1}s` }}
              >
                <div className={`flex h-16 w-16 items-center justify-center rounded-xl text-white shadow-lg transition-transform duration-300 ${
                  selected === type
                    ? "bg-gradient-to-br from-[#0247ae] to-[#0560d4] shadow-[#0247ae]/30 scale-110"
                    : "bg-gradient-to-br from-[#0247ae] to-[#0560d4] shadow-[#0247ae]/30 group-hover:scale-110"
                }`}>
                  <Icon size={32} />
                </div>
                <div>
                  <p className="font-bold text-[#0247ae] text-lg mb-1">{label}</p>
                  <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium transition-opacity ${
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
