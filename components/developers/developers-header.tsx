"use client";

import { Search } from "lucide-react";
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
    <div className="mb-8">
      {/* Filter Container */}
      <div className="rounded-xl md:rounded-2xl bg-white p-4 md:p-6 shadow-md border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 items-start sm:items-center justify-between">
          {/* Stats Badge */}
          <div className="px-3 md:px-4 py-1.5 md:py-2 rounded-lg bg-blue-50 border border-blue-200">
            <span className="text-xs md:text-sm font-bold text-blue-600">
              {totalDevelopers} Developers
            </span>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 h-3.5 md:h-4 w-3.5 md:w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search developers..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full h-10 md:h-11 rounded-lg border border-gray-300 bg-white pl-9 md:pl-10 pr-4 text-xs md:text-sm font-medium placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
