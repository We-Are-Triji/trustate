"use client";

import { motion } from "framer-motion";
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
      <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 bg-white/50 backdrop-blur-sm px-6 py-20">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-200">
          <User className="h-10 w-10 text-gray-400" />
        </div>
        <h3 className="mb-2 text-xl font-bold text-gray-800">
          No brokers found
        </h3>
        <p className="text-center text-sm text-gray-500 max-w-md">
          Try adjusting your search or filter criteria to find the perfect broker for your needs
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {brokers.map((broker, index) => (
        <motion.div
          key={broker.id}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ 
            duration: 0.5, 
            delay: index * 0.1,
            ease: "easeOut"
          }}
        >
          <IndividualBrokerCard
            broker={broker}
            onViewDetails={onViewDetails}
          />
        </motion.div>
      ))}
    </div>
  );
}
