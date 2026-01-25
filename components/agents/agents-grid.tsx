"use client";

import { motion } from "framer-motion";
import { AgentCard } from "./agent-card";
import type { AgentProfile } from "@/lib/types/agent";

interface AgentsGridProps {
  agents: AgentProfile[];
  onViewDetails?: (agentId: string) => void;
}

export function AgentsGrid({ agents, onViewDetails }: AgentsGridProps) {
  if (agents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-gray-200 bg-white/50 backdrop-blur-sm px-6 py-20">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-200">
          <svg
            className="h-10 w-10 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </div>
        <h3 className="mb-2 text-xl font-bold text-gray-800">
          No agents found
        </h3>
        <p className="text-center text-sm text-gray-500 max-w-md">
          Try adjusting your search or filter criteria to find the perfect agent for your needs
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Mobile: Horizontal scroll */}
      <div className="md:hidden overflow-x-auto -mx-4 px-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="flex gap-4 pb-4" style={{ width: 'max-content' }}>
          {agents.map((agent, index) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ 
                duration: 0.4, 
                delay: index * 0.05,
                ease: "easeOut"
              }}
              className="w-[280px] flex-shrink-0"
            >
              <AgentCard agent={agent} onViewDetails={onViewDetails} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Desktop: Grid */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {agents.map((agent, index) => (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ 
              duration: 0.5, 
              delay: index * 0.1,
              ease: "easeOut"
            }}
          >
            <AgentCard agent={agent} onViewDetails={onViewDetails} />
          </motion.div>
        ))}
      </div>
    </>
  );
}
