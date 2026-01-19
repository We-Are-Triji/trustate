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
    <div className="mb-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
            Brokers
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Browse TruState verified brokerages and licensed brokers
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-gray-600">Active {activeCount}</span>
          </span>
        </div>
      </div>

      <div className="mb-6 flex rounded-xl bg-gray-100 p-1.5">
        <button
          onClick={() => onBrokerTypeChange("firm")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
            brokerType === "firm"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <Building2 className="h-4 w-4" />
          <span>Brokerage Firms</span>
          <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-semibold text-gray-600">
            {totalBrokerages}
          </span>
        </button>
        <button
          onClick={() => onBrokerTypeChange("individual")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
            brokerType === "individual"
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <User className="h-4 w-4" />
          <span>Individual Brokers</span>
          <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-semibold text-gray-600">
            {totalIndividualBrokers}
          </span>
        </button>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder={
              brokerType === "firm"
                ? "Search brokerages by name or location..."
                : "Search brokers by name, email, or location..."
            }
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full border-[#E2E8F0] bg-white pl-9 focus:border-gray-300 focus:ring-gray-300"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <select
              value={filters.status}
              onChange={(e) => handleStatusChange(e.target.value as BrokerStatus | "all")}
              className="h-9 appearance-none rounded-md border border-[#E2E8F0] bg-white px-3 pr-8 text-sm text-gray-700 focus:border-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-300"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
}
