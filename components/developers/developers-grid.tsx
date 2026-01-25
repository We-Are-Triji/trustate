"use client";

import { motion } from "framer-motion";
import { DeveloperCard } from "./developer-card";
import type { Developer } from "@/lib/types/developer";

interface DevelopersGridProps {
  developers: Developer[];
  onDeveloperClick: (developer: Developer) => void;
}

export function DevelopersGrid({
  developers,
  onDeveloperClick,
}: DevelopersGridProps) {
  if (developers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <svg
            className="h-8 w-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
        </div>
        <h3 className="mb-2 text-lg font-semibold text-gray-800">
          No developers found
        </h3>
        <p className="text-sm text-gray-500">
          Try adjusting your search criteria
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Mobile: Horizontal scroll */}
      <div className="md:hidden overflow-x-auto -mx-4 px-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="flex gap-4 pb-4" style={{ width: 'max-content' }}>
          {developers.map((developer, index) => (
            <motion.div
              key={developer.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ 
                duration: 0.4, 
                delay: index * 0.05,
                ease: "easeOut"
              }}
              className="w-[280px] flex-shrink-0"
            >
              <DeveloperCard
                developer={developer}
                onClick={onDeveloperClick}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Desktop: Grid */}
      <div className="hidden md:grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {developers.map((developer, index) => (
          <motion.div
            key={developer.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
          >
            <DeveloperCard
              developer={developer}
              onClick={onDeveloperClick}
            />
          </motion.div>
        ))}
      </div>
    </>
  );
}
