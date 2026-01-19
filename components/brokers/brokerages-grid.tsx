"use client";

import { Building2 } from "lucide-react";
import { BrokerageCard } from "./brokerage-card";
import type { BrokerageFirm } from "@/lib/types/broker";

interface BrokeragesGridProps {
  brokerages: BrokerageFirm[];
  onBrokerageClick?: (brokerage: BrokerageFirm) => void;
}

export function BrokeragesGrid({ brokerages, onBrokerageClick }: BrokeragesGridProps) {
  if (brokerages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <Building2 className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-gray-800">
          No brokerages found
        </h3>
        <p className="text-sm text-gray-500">
          Try adjusting your search or filter criteria
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {brokerages.map((brokerage) => (
        <BrokerageCard
          key={brokerage.id}
          brokerage={brokerage}
          onClick={onBrokerageClick}
        />
      ))}
    </div>
  );
}
