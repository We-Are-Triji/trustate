"use client";

import { Search, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";

interface DevelopersHeaderProps {
  totalDevelopers: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function DevelopersHeader({
  totalDevelopers,
  searchQuery,
  onSearchChange,
}: DevelopersHeaderProps) {
  return (
    <div className="mb-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
            Developer Partners
            <span className="ml-2 text-lg font-normal text-gray-500">
              ({totalDevelopers})
            </span>
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Browse our trusted real estate development partners
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search developers by name or location..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full border-[#E2E8F0] bg-white pl-9 focus:border-gray-300 focus:ring-gray-300"
          />
        </div>
      </div>
    </div>
  );
}
