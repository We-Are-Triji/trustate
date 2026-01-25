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
    <div className="mb-8">
      <div className="mb-8 flex flex-col gap-6">
        {/* Title and Stats */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-4xl font-extrabold sm:text-5xl lg:text-6xl mb-3 leading-tight font-[family-name:var(--font-arsenal-sc)]">
              <span className="bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent">Browse </span>
              <span className="bg-gradient-to-r from-[#0247ae] to-[#0560d4] bg-clip-text text-transparent">Agents</span>
            </h1>
            <p className="text-lg text-gray-600 font-medium max-w-2xl leading-relaxed">
              Connect with licensed and verified real estate professionals across the Philippines
            </p>
          </div>
          
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-2.5 px-5 py-2.5 rounded-2xl bg-white/90 backdrop-blur-sm border-2 border-emerald-100 shadow-sm hover:shadow-md transition-all duration-300">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-gray-700">Active</span>
              <span className="font-extrabold text-emerald-600 text-base">{activeCount}</span>
            </div>
            <div className="flex items-center gap-2.5 px-5 py-2.5 rounded-2xl bg-white/90 backdrop-blur-sm border-2 border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
              <span className="h-2.5 w-2.5 rounded-full bg-gray-400" />
              <span className="font-bold text-gray-700">Inactive</span>
              <span className="font-extrabold text-gray-600 text-base">{inactiveCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 md:gap-4 lg:flex-row lg:items-center lg:justify-between bg-white/60 backdrop-blur-sm rounded-2xl md:rounded-3xl p-4 md:p-6 border border-gray-100 shadow-sm">
        <div className="relative max-w-md flex-1 group">
          <Search className="absolute left-4 md:left-5 top-1/2 h-4 w-4 md:h-5 md:w-5 -translate-y-1/2 text-gray-400 transition-colors duration-300 group-focus-within:text-[#0247ae]" />
          <Input
            type="text"
            placeholder="Search agents by name..."
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-11 md:pl-14 pr-4 h-11 md:h-14 border-2 border-gray-200 bg-white text-gray-800 placeholder:text-gray-400 text-sm md:text-base rounded-xl md:rounded-2xl focus:bg-white focus:border-[#0247ae] focus:ring-4 focus:ring-[#0247ae]/10 transition-all duration-300 shadow-sm font-medium"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          <div className="relative group">
            <select
              value={filters.status}
              onChange={(e) => handleStatusChange(e.target.value as AgentStatus | "all")}
              className="h-10 md:h-14 appearance-none rounded-xl md:rounded-2xl border-2 border-gray-200 bg-white px-3 md:px-5 pr-9 md:pr-12 text-xs md:text-sm font-bold text-gray-700 hover:border-[#0247ae]/40 focus:border-[#0247ae] focus:outline-none focus:ring-4 focus:ring-[#0247ae]/10 transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="invited">Invited</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 md:right-4 top-1/2 h-4 w-4 md:h-5 md:w-5 -translate-y-1/2 text-gray-400 group-hover:text-[#0247ae] transition-colors" />
          </div>

          <div className="relative group">
            <select
              value={filters.category}
              onChange={(e) => handleCategoryChange(e.target.value as AgentCategory | "all")}
              className="h-10 md:h-14 appearance-none rounded-xl md:rounded-2xl border-2 border-gray-200 bg-white px-3 md:px-5 pr-9 md:pr-12 text-xs md:text-sm font-bold text-gray-700 hover:border-[#0247ae]/40 focus:border-[#0247ae] focus:outline-none focus:ring-4 focus:ring-[#0247ae]/10 transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer"
            >
              <option value="all">All Categories</option>
              <option value="managerial">Managerial</option>
              <option value="non-management">Non-Management</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 md:right-4 top-1/2 h-4 w-4 md:h-5 md:w-5 -translate-y-1/2 text-gray-400 group-hover:text-[#0247ae] transition-colors" />
          </div>

          <div className="relative group">
            <select
              value={filters.employmentType}
              onChange={(e) => handleEmploymentChange(e.target.value as EmploymentType | "all")}
              className="h-10 md:h-14 appearance-none rounded-xl md:rounded-2xl border-2 border-gray-200 bg-white px-3 md:px-5 pr-9 md:pr-12 text-xs md:text-sm font-bold text-gray-700 hover:border-[#0247ae]/40 focus:border-[#0247ae] focus:outline-none focus:ring-4 focus:ring-[#0247ae]/10 transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer"
            >
              <option value="all">All Types</option>
              <option value="fulltime">Fulltime</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 md:right-4 top-1/2 h-4 w-4 md:h-5 md:w-5 -translate-y-1/2 text-gray-400 group-hover:text-[#0247ae] transition-colors" />
          </div>

          <Button
            variant="outline"
            className="h-10 md:h-14 rounded-xl md:rounded-2xl border-2 border-[#0247ae]/20 bg-white text-[#0247ae] text-xs md:text-sm font-bold hover:bg-gradient-to-r hover:from-[#0247ae] hover:to-[#0560d4] hover:text-white hover:border-transparent transition-all duration-300 shadow-sm hover:shadow-lg px-4 md:px-6 relative overflow-hidden group"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
            <SlidersHorizontal className="mr-1.5 md:mr-2 h-3.5 w-3.5 md:h-4 md:w-4 relative" />
            <span className="relative">Advanced Filters</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
