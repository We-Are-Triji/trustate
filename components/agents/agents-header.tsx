"use client";

import { Search, SlidersHorizontal, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { AgentFilters, AgentStatus, AgentCategory, EmploymentType } from "@/lib/types/agent";

interface AgentsHeaderProps {
  totalAgents: number;
  activeCount: number;
  inactiveCount: number;
  filters: AgentFilters;
  onFiltersChange: (filters: AgentFilters) => void;
}

export function AgentsHeader({
  totalAgents,
  activeCount,
  inactiveCount,
  filters,
  onFiltersChange,
}: AgentsHeaderProps) {
  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value });
  };

  const handleStatusChange = (status: AgentStatus | "all") => {
    onFiltersChange({ ...filters, status });
  };

  const handleCategoryChange = (category: AgentCategory | "all") => {
    onFiltersChange({ ...filters, category });
  };

  const handleEmploymentChange = (employmentType: EmploymentType | "all") => {
    onFiltersChange({ ...filters, employmentType });
  };

  return (
    <div className="mb-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
            Agents
            <span className="ml-2 text-lg font-normal text-gray-500">
              ({totalAgents})
            </span>
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Browse verified TruState agents ready to help you
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-gray-600">Active {activeCount}</span>
          </span>
          <span className="text-gray-300">-</span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-gray-400" />
            <span className="text-gray-600">Inactive {inactiveCount}</span>
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search agents by name, email, or location..."
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full border-[#E2E8F0] bg-white pl-9 focus:border-gray-300 focus:ring-gray-300"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <select
              value={filters.status}
              onChange={(e) => handleStatusChange(e.target.value as AgentStatus | "all")}
              className="h-9 appearance-none rounded-md border border-[#E2E8F0] bg-white px-3 pr-8 text-sm text-gray-700 focus:border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-300"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="invited">Invited</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          </div>

          <div className="relative">
            <select
              value={filters.category}
              onChange={(e) => handleCategoryChange(e.target.value as AgentCategory | "all")}
              className="h-9 appearance-none rounded-md border border-[#E2E8F0] bg-white px-3 pr-8 text-sm text-gray-700 focus:border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-300"
            >
              <option value="all">All Categories</option>
              <option value="managerial">Managerial</option>
              <option value="non-management">Non-Management</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          </div>

          <div className="relative">
            <select
              value={filters.employmentType}
              onChange={(e) => handleEmploymentChange(e.target.value as EmploymentType | "all")}
              className="h-9 appearance-none rounded-md border border-[#E2E8F0] bg-white px-3 pr-8 text-sm text-gray-700 focus:border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-300"
            >
              <option value="all">All Types</option>
              <option value="fulltime">Fulltime</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          </div>

          <Button
            variant="outline"
            className="border-[#E2E8F0] text-gray-600 hover:bg-gray-50"
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Advance Filter
          </Button>
        </div>
      </div>
    </div>
  );
}
