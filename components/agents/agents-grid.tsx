"use client";

import { AgentCard } from "./agent-card";
import type { AgentProfile } from "@/lib/types/agent";

interface AgentsGridProps {
  agents: AgentProfile[];
  onViewDetails?: (agentId: string) => void;
}

export function AgentsGrid({ agents, onViewDetails }: AgentsGridProps) {
  if (agents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-[#E2E8F0] bg-white px-6 py-16">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <svg
            className="h-8 w-8 text-gray-400"
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
        <h3 className="mb-1 text-lg font-semibold text-gray-800">
          No agents found
        </h3>
        <p className="text-center text-sm text-gray-500">
          Try adjusting your search or filter criteria
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {agents.map((agent) => (
        <AgentCard key={agent.id} agent={agent} onViewDetails={onViewDetails} />
      ))}
    </div>
  );
}
