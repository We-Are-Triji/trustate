"use client";

import { User } from "lucide-react";
import { IndividualBrokerCard } from "./individual-broker-card";
import type { IndividualBroker } from "@/lib/types/broker";

interface IndividualBrokersGridProps {
  brokers: IndividualBroker[];
  onViewDetails?: (brokerId: string) => void;
}

export function IndividualBrokersGrid({ brokers, onViewDetails }: IndividualBrokersGridProps) {
  if (brokers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <User className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-gray-800">
          No brokers found
        </h3>
        <p className="text-sm text-gray-500">
          Try adjusting your search or filter criteria
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {brokers.map((broker) => (
        <IndividualBrokerCard
          key={broker.id}
          broker={broker}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
}
