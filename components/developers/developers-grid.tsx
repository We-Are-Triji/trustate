"use client";

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
          Try adjusting your search or filter criteria
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {developers.map((developer) => (
        <DeveloperCard
          key={developer.id}
          developer={developer}
          onClick={onDeveloperClick}
        />
      ))}
    </div>
  );
}
