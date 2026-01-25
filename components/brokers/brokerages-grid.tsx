"use client";

import { motion } from "framer-motion";
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
      <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 bg-white/50 backdrop-blur-sm px-6 py-20">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-200">
          <Building2 className="h-10 w-10 text-gray-400" />
        </div>
        <h3 className="mb-2 text-xl font-bold text-gray-800">
          No brokerages found
        </h3>
        <p className="text-center text-sm text-gray-500 max-w-md">
          Try adjusting your search or filter criteria to find the perfect brokerage for your needs
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Mobile: Horizontal scroll */}
      <div className="md:hidden overflow-x-auto -mx-4 px-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="flex gap-4 pb-4" style={{ width: 'max-content' }}>
          {brokerages.map((brokerage, index) => (
            <motion.div
              key={brokerage.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ 
                duration: 0.4, 
                delay: index * 0.05,
                ease: "easeOut"
              }}
              className="w-[280px] flex-shrink-0"
            >
              <BrokerageCard
                brokerage={brokerage}
                onClick={onBrokerageClick}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Desktop: Grid */}
      <div className="hidden md:grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {brokerages.map((brokerage, index) => (
          <motion.div
            key={brokerage.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ 
              duration: 0.5, 
              delay: index * 0.1,
              ease: "easeOut"
            }}
          >
            <BrokerageCard
              brokerage={brokerage}
              onClick={onBrokerageClick}
            />
          </motion.div>
        ))}
      </div>
    </>
  );
}
