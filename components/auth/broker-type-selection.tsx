"use client";

import { User, Building2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BrokerType } from "@/lib/types/registration";

interface BrokerTypeSelectionProps {
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
    description: "Operating as a registered company",
    icon: Building2,
  },
];

export function BrokerTypeSelection({ onSelect, onBack }: BrokerTypeSelectionProps) {
  return (
    <Card className="w-full max-w-4xl border-[#E2E8F0] bg-white shadow-sm">
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
            <CardTitle className="text-xl font-semibold text-gray-800">Business Structure</CardTitle>
            <p className="text-sm text-gray-500">Step 3 of 3 - How do you operate?</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-6">
          {BROKER_TYPES.map(({ type, label, description, icon: Icon }) => (
            <button
              key={type}
              onClick={() => onSelect(type)}
              className="flex items-center gap-4 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-6 text-left transition-colors hover:border-gray-400 hover:bg-gray-50 active:bg-gray-100"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-800 text-white">
                <Icon size={28} />
              </div>
              <div>
                <p className="font-medium text-gray-800">{label}</p>
                <p className="text-sm text-gray-500">{description}</p>
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
