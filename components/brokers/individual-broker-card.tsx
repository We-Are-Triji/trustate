"use client";

import { User, Mail, Phone, Star, MapPin, Briefcase } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { IndividualBroker } from "@/lib/types/broker";

interface IndividualBrokerCardProps {
  broker: IndividualBroker;
  onViewDetails?: (brokerId: string) => void;
}

function getStatusColor(status: IndividualBroker["status"]) {
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

function getStatusLabel(status: IndividualBroker["status"]) {
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

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function IndividualBrokerCard({ broker, onViewDetails }: IndividualBrokerCardProps) {
  return (
    <Card className="border-[#E2E8F0] bg-white shadow-sm transition-all duration-200 hover:shadow-md">
      <CardContent className="p-0">
        <div className="p-5">
          <div className="mb-4 flex items-start justify-between">
            <div className="flex items-center gap-1.5">
              <span className={`h-2 w-2 rounded-full ${getStatusColor(broker.status)}`} />
              <span className="text-xs font-medium text-gray-600">
                {getStatusLabel(broker.status)}
              </span>
            </div>
            <div className="flex items-center gap-1 rounded-full bg-gray-50 px-2 py-1">
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-semibold text-gray-700">{broker.rating}</span>
            </div>
          </div>

          <div className="mb-4 flex flex-col items-center text-center">
            <div className="mb-3 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-4 border-gray-100 bg-gradient-to-br from-gray-100 to-gray-200 shadow-inner">
              <User className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="mb-0.5 text-base font-semibold text-gray-800">
              {broker.name}
            </h3>
            <p className="text-sm text-gray-500">{broker.title}</p>
          </div>

          <div className="mb-4 flex items-center justify-center gap-1.5 text-sm text-gray-500">
            <MapPin className="h-4 w-4" />
            <span>{broker.location}</span>
          </div>

          <div className="mb-4 flex flex-wrap items-center justify-center gap-1.5">
            {broker.specializations.slice(0, 2).map((spec) => (
              <span
                key={spec}
                className="rounded-full bg-[#0247ae]/5 px-2.5 py-0.5 text-xs font-medium text-[#0247ae]"
              >
                {spec}
              </span>
            ))}
          </div>

          <div className="mb-4 grid grid-cols-2 gap-3 rounded-xl bg-gray-50 p-3">
            <div className="text-center">
              <p className="text-lg font-bold text-gray-800">{broker.propertiesSold}</p>
              <p className="text-xs text-gray-500">Properties Sold</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-gray-800">{broker.yearsExperience}+</p>
              <p className="text-xs text-gray-500">Years Exp.</p>
            </div>
          </div>

          <div className="space-y-2 border-t border-[#E2E8F0] pt-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Mail className="h-4 w-4 flex-shrink-0 text-gray-400" />
              <a
                href={`mailto:${broker.email}`}
                className="truncate text-gray-800 hover:text-[#0247ae] hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                {broker.email}
              </a>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone className="h-4 w-4 flex-shrink-0 text-gray-400" />
              <span className="text-gray-800">{broker.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Briefcase className="h-4 w-4 flex-shrink-0 text-gray-400" />
              <span className="text-gray-600 text-xs">{broker.licenseNumber}</span>
            </div>
          </div>
        </div>

        <div className="border-t border-[#E2E8F0] bg-[#F8FAFC] px-5 py-3">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Joined {formatDate(broker.joinedDate)}</span>
            <button
              onClick={() => onViewDetails?.(broker.id)}
              className="font-medium text-[#0247ae] hover:text-[#0247ae]/80 hover:underline"
            >
              View details
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
