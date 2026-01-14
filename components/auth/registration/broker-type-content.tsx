"use client";

import { User, Building2, ArrowLeft, ArrowRight } from "lucide-react";
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
  return (
    <>
      <CardHeader className="pb-2 pt-8 animate-[fadeInUp_0.5s_ease-out]">
        <div className="text-center">
          <CardTitle className="text-3xl font-bold text-[#0247ae] font-[family-name:var(--font-arsenal-sc)]">
            Business Structure
          </CardTitle>
          <p className="text-gray-500 mt-1">How do you operate?</p>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col px-8 pb-6">
        <div className="grid grid-cols-2 gap-8 w-full max-w-3xl">
          {BROKER_TYPES.map(({ type, label, description, icon: Icon }, index) => (
            <button
              key={type}
              onClick={() => onSelect(type)}
              className="group flex flex-col items-center gap-5 rounded-2xl border-2 border-gray-100 bg-white p-10 text-center transition-all duration-300 hover:border-[#0247ae] hover:shadow-xl hover:shadow-[#0247ae]/10 hover:-translate-y-1 active:translate-y-0 animate-[fadeInUp_0.5s_ease-out_both]"
              style={{ animationDelay: `${0.1 + index * 0.1}s` }}
            >
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0247ae] to-[#0560d4] text-white shadow-lg shadow-[#0247ae]/30 group-hover:scale-110 transition-transform duration-300">
                <Icon size={36} />
              </div>
              <div>
                <p className="font-bold text-[#0247ae] text-xl mb-2">{label}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
              </div>
              <div className="flex items-center gap-1 text-sm font-medium text-[#0247ae] opacity-0 group-hover:opacity-100 transition-opacity">
                Select <ArrowRight size={16} />
              </div>
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 mt-auto border-t border-gray-100 animate-[fadeInUp_0.5s_ease-out_0.3s_both]">
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
          <p className="text-sm text-gray-400">Select an option to continue</p>
        </div>
      </CardContent>
    </>
  );
}
