"use client";

import { Search, ChevronDown, Building2, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { BrokerFilters, BrokerStatus, BrokerType } from "@/lib/types/broker";

interface BrokersHeaderProps {
  brokerType: BrokerType;
  onBrokerTypeChange: (type: BrokerType) => void;
  totalBrokerages: number;
  totalIndividualBrokers: number;
  activeCount: number;
  filters: BrokerFilters;
  onFiltersChange: (filters: BrokerFilters) => void;
}

export function BrokersHeader({
  brokerType,
  onBrokerTypeChange,
  totalBrokerages,
  totalIndividualBrokers,
  activeCount,
  filters,
  onFiltersChange,
}: BrokersHeaderProps) {
  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, search: value });
  };

  const handleStatusChange = (status: BrokerStatus | "all") => {
    onFiltersChange({ ...filters, status });
  };

  return (
    <div className="mb-8">
      <div className="mb-8 flex flex-col gap-6">
        {/* Title and Stats */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-4xl font-extrabold sm:text-5xl lg:text-6xl mb-3 leading-tight font-[family-name:var(--font-arsenal-sc)]">
              <span className="bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent">Browse </span>
              <span className="bg-gradient-to-r from-[#0247ae] to-[#0560d4] bg-clip-text text-transparent">Brokers</span>
            </h1>
            <p className="text-lg text-gray-600 font-medium max-w-2xl leading-relaxed">
              Connect with verified brokerages and licensed real estate brokers across the Philippines
            </p>
          </div>
          
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center gap-2.5 px-5 py-2.5 rounded-2xl bg-white/90 backdrop-blur-sm border-2 border-emerald-100 shadow-sm hover:shadow-md transition-all duration-300">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-gray-700">Active</span>
              <span className="font-extrabold text-emerald-600 text-base">{activeCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Broker Type Toggle */}
      <div className="mb-4 md:mb-6 flex rounded-xl md:rounded-2xl bg-white/60 backdrop-blur-sm p-1.5 md:p-2 border border-gray-100 shadow-sm">
        <button
          onClick={() => onBrokerTypeChange("firm")}
          className={`flex flex-1 items-center justify-center gap-1.5 md:gap-2 rounded-lg md:rounded-xl px-3 md:px-6 py-2.5 md:py-3.5 text-xs md:text-sm font-bold transition-all duration-300 ${
            brokerType === "firm"
              ? "bg-gradient-to-r from-[#0247ae] to-[#0560d4] text-white shadow-lg shadow-[#0247ae]/20"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          }`}
        >
          <Building2 className="h-4 md:h-5 w-4 md:w-5" />
          <span className="hidden sm:inline">Brokerage Firms</span>
          <span className="sm:hidden">Firms</span>
          <span className={`rounded-full px-2 md:px-2.5 py-0.5 md:py-1 text-[10px] md:text-xs font-extrabold ${
            brokerType === "firm" 
              ? "bg-white/20 text-white" 
              : "bg-gray-200 text-gray-600"
          }`}>
            {totalBrokerages}
          </span>
        </button>
        <button
          onClick={() => onBrokerTypeChange("individual")}
          className={`flex flex-1 items-center justify-center gap-1.5 md:gap-2 rounded-lg md:rounded-xl px-3 md:px-6 py-2.5 md:py-3.5 text-xs md:text-sm font-bold transition-all duration-300 ${
            brokerType === "individual"
              ? "bg-gradient-to-r from-[#0247ae] to-[#0560d4] text-white shadow-lg shadow-[#0247ae]/20"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          }`}
        >
          <User className="h-4 md:h-5 w-4 md:w-5" />
          <span className="hidden sm:inline">Individual Brokers</span>
          <span className="sm:hidden">Individual</span>
          <span className={`rounded-full px-2 md:px-2.5 py-0.5 md:py-1 text-[10px] md:text-xs font-extrabold ${
            brokerType === "individual" 
              ? "bg-white/20 text-white" 
              : "bg-gray-200 text-gray-600"
          }`}>
            {totalIndividualBrokers}
          </span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 md:gap-4 lg:flex-row lg:items-center lg:justify-between bg-white/60 backdrop-blur-sm rounded-2xl md:rounded-3xl p-4 md:p-6 border border-gray-100 shadow-sm">
        <div className="relative max-w-md flex-1 group">
          <Search className="absolute left-4 md:left-5 top-1/2 h-4 w-4 md:h-5 md:w-5 -translate-y-1/2 text-gray-400 transition-colors duration-300 group-focus-within:text-[#0247ae]" />
          <Input
            type="text"
            placeholder={
              brokerType === "firm"
                ? "Search brokerages..."
                : "Search brokers..."
            }
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-11 md:pl-14 pr-4 h-11 md:h-14 border-2 border-gray-200 bg-white text-gray-800 placeholder:text-gray-400 text-sm md:text-base rounded-xl md:rounded-2xl focus:bg-white focus:border-[#0247ae] focus:ring-4 focus:ring-[#0247ae]/10 transition-all duration-300 shadow-sm font-medium"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          <div className="relative group">
            <select
              value={filters.status}
              onChange={(e) => handleStatusChange(e.target.value as BrokerStatus | "all")}
              className="h-10 md:h-14 appearance-none rounded-xl md:rounded-2xl border-2 border-gray-200 bg-white px-3 md:px-5 pr-9 md:pr-12 text-xs md:text-sm font-bold text-gray-700 hover:border-[#0247ae]/40 focus:border-[#0247ae] focus:outline-none focus:ring-4 focus:ring-[#0247ae]/10 transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 md:right-4 top-1/2 h-4 w-4 md:h-5 md:w-5 -translate-y-1/2 text-gray-400 group-hover:text-[#0247ae] transition-colors" />
          </div>
        </div>
      </div>
    </div>
  );
}
