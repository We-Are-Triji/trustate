"use client";

import { Building2, Star, Users, MapPin, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { BrokerageFirm } from "@/lib/types/broker";

interface BrokerageCardProps {
  brokerage: BrokerageFirm;
  onClick?: (brokerage: BrokerageFirm) => void;
}

function getStatusColor(status: BrokerageFirm["status"]) {
  switch (status) {
    case "active":
      return "bg-emerald-500";
    case "inactive":
      return "bg-gray-400";
    case "pending":
      return "bg-amber-500";
    default:
      return "bg-gray-400";
  }
}

function getStatusLabel(status: BrokerageFirm["status"]) {
  switch (status) {
    case "active":
      return "Active";
    case "inactive":
      return "Inactive";
    case "pending":
      return "Pending";
    default:
      return status;
  }
}

export function BrokerageCard({ brokerage, onClick }: BrokerageCardProps) {
  return (
    <Card
      className="group cursor-pointer overflow-hidden border-[#E2E8F0] bg-white shadow-sm transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:border-[#0247ae]/30 hover:-translate-y-1 h-full flex flex-col"
      onClick={() => onClick?.(brokerage)}
    >
      <CardContent className="p-0 flex flex-col flex-1">
        <div className="p-6 flex flex-col flex-1">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className={`h-2 w-2 rounded-full ${getStatusColor(brokerage.status)}`} />
              <span className="text-xs font-medium text-gray-500">
                {getStatusLabel(brokerage.status)}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-semibold text-gray-800">{brokerage.rating}</span>
            </div>
          </div>

          <div className="mb-5 flex flex-col items-center">
            <div className="relative mb-4 flex h-24 w-full items-center justify-center rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 p-4 transition-all duration-300">
              <Building2 className="h-12 w-12 text-gray-300" />
            </div>

            <h3 className="mb-1 text-center text-lg font-bold text-gray-900 transition-colors group-hover:text-[#0247ae]">
              {brokerage.name}
            </h3>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <MapPin className="h-3.5 w-3.5" />
              <span>{brokerage.city}</span>
            </div>
          </div>

          <p className="mb-5 line-clamp-2 text-center text-sm text-gray-600 leading-relaxed flex-1">
            {brokerage.description}
          </p>

          <div className="mb-5 flex items-center justify-center gap-4 text-center">
            <div>
              <p className="text-xl font-bold text-[#0247ae]">{brokerage.agentCount}</p>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Agents</p>
            </div>
            <div className="h-8 w-px bg-gray-200" />
            <div>
              <p className="text-xl font-bold text-[#0247ae]">{brokerage.propertiesListed}</p>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Listings</p>
            </div>
            <div className="h-8 w-px bg-gray-200" />
            <div>
              <p className="text-xl font-bold text-[#0247ae]">{brokerage.yearsInBusiness}+</p>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Years</p>
            </div>
          </div>

          <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 mt-auto">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
              Account Manager
            </p>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#0247ae]/10 to-[#0247ae]/5 border border-[#0247ae]/10">
                <User className="h-5 w-5 text-[#0247ae]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {brokerage.representative.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {brokerage.representative.title}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-[#0247ae] to-[#0873c9] py-3 text-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 mt-auto">
          <span className="text-sm font-bold text-white tracking-wide">
            View Details
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
