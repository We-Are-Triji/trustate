"use client";

import { Mail, Phone, Star, MapPin, Award, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { IndividualBroker } from "@/lib/types/broker";
import { getPersonPhoto } from "@/lib/utils/photo-utils";

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
  const photoUrl = getPersonPhoto(broker.name);
  
  return (
    <Card className="group overflow-hidden rounded-3xl border-0 bg-white shadow-lg transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgba(2,71,174,0.35)] hover:-translate-y-3">
      <CardContent className="p-0 relative">
        {/* Shine effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10 rounded-3xl"></div>
        
        {/* Card header with gradient */}
        <div className="relative bg-gradient-to-br from-[#0247ae] via-[#0560d4] to-[#0873c9] h-36 overflow-hidden">
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-white -translate-y-1/2 translate-x-1/2 animate-[float_6s_ease-in-out_infinite]" />
            <div className="absolute left-0 bottom-0 h-36 w-36 rounded-full bg-white/50 translate-y-1/2 -translate-x-1/2 animate-[float_5s_ease-in-out_infinite_1s]" />
          </div>
          
          {/* Decorative dots pattern */}
          <div className="absolute inset-0 opacity-10">
            <div 
              className="h-full w-full"
              style={{
                backgroundImage: `radial-gradient(circle, white 1.5px, transparent 1.5px)`,
                backgroundSize: '24px 24px'
              }}
            />
          </div>
          
          {/* Status badge - top left */}
          <div className="absolute left-4 top-4 z-10">
            <div className="flex items-center gap-2 rounded-xl bg-white/95 backdrop-blur-md px-3.5 py-2 shadow-lg border border-white/50">
              <span className={`h-2 w-2 rounded-full ${getStatusColor(broker.status)} ${broker.status === 'active' ? 'animate-pulse' : ''}`} />
              <span className="text-xs font-extrabold text-gray-800">{getStatusLabel(broker.status)}</span>
            </div>
          </div>
          
          {/* Rating badge - top right */}
          <div className="absolute right-4 top-4 z-10">
            <div className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#ffce08] to-[#f5c000] px-3.5 py-2 shadow-lg border border-yellow-300/50">
              <Star className="h-4 w-4 fill-white text-white" />
              <span className="text-xs font-extrabold text-[#0247ae]">{broker.rating}</span>
            </div>
          </div>
        </div>

        {/* Profile image - overlapping header */}
        <div className="relative -mt-20 flex justify-center px-6">
          <div className="relative">
            <div className="h-36 w-36 rounded-3xl border-[5px] border-white shadow-2xl overflow-hidden transition-all duration-500 group-hover:scale-105 group-hover:shadow-[0_25px_50px_-12px_rgba(2,71,174,0.4)] group-hover:border-[#ffce08]">
              <img 
                src={photoUrl} 
                alt={broker.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(broker.name)}&size=400&background=0247ae&color=fff&bold=true`;
                }}
              />
            </div>
            {/* Online indicator */}
            {broker.status === "active" && (
              <div className="absolute -bottom-2 -right-2 h-9 w-9 rounded-full border-[3px] border-white bg-gradient-to-br from-emerald-400 to-emerald-500 flex items-center justify-center shadow-xl">
                <div className="h-4 w-4 rounded-full bg-emerald-400 animate-ping absolute" />
                <div className="h-3 w-3 rounded-full bg-white relative" />
              </div>
            )}
          </div>
        </div>

        {/* Broker info */}
        <div className="px-6 pb-6 pt-8">
          {/* Name and title */}
          <div className="text-center mb-5">
            <h3 className="text-xl font-extrabold text-gray-900 mb-1.5 group-hover:text-[#0247ae] transition-colors duration-300 leading-tight">{broker.name}</h3>
            <p className="text-sm font-bold bg-gradient-to-r from-[#0247ae] to-[#0560d4] bg-clip-text text-transparent mb-1.5">{broker.title}</p>
            <p className="text-xs text-gray-500 font-semibold">{broker.licenseNumber}</p>
          </div>
          
          {/* Location */}
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-5 px-4 py-2 rounded-xl bg-gray-50 border border-gray-100">
            <MapPin className="h-4 w-4 text-[#0247ae]" />
            <span className="font-bold">{broker.location}</span>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-100 transition-all duration-300 hover:border-blue-200 hover:shadow-md">
              <div className="flex items-center justify-center gap-1.5 mb-1.5">
                <Award className="h-4 w-4 text-[#0247ae]" />
                <p className="text-xs font-bold text-gray-600">Sold</p>
              </div>
              <p className="text-xl font-extrabold text-[#0247ae]">{broker.propertiesSold}</p>
            </div>
            <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-100 transition-all duration-300 hover:border-yellow-200 hover:shadow-md">
              <div className="flex items-center justify-center gap-1.5 mb-1.5">
                <TrendingUp className="h-4 w-4 text-[#ffce08]" />
                <p className="text-xs font-bold text-gray-600">Experience</p>
              </div>
              <p className="text-xl font-extrabold text-[#ffce08]">{broker.yearsExperience}+</p>
            </div>
          </div>

          {/* Specializations */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-5">
            {broker.specializations.slice(0, 2).map((spec) => (
              <span
                key={spec}
                className="rounded-xl bg-gradient-to-r from-[#0247ae]/10 to-[#0560d4]/10 px-4 py-2 text-xs font-extrabold text-[#0247ae] border-2 border-[#0247ae]/20 whitespace-nowrap"
              >
                {spec}
              </span>
            ))}
          </div>

          {/* Contact info */}
          <div className="space-y-3 mb-6 p-5 rounded-2xl bg-gradient-to-br from-gray-50 to-white border-2 border-gray-100">
            <div className="flex items-center gap-3 text-xs">
              <div className="flex-shrink-0 h-9 w-9 rounded-xl bg-blue-100 flex items-center justify-center">
                <Mail className="h-4 w-4 text-[#0247ae]" />
              </div>
              <a
                href={`mailto:${broker.email}`}
                className="flex-1 truncate text-gray-700 hover:text-[#0247ae] font-bold transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                {broker.email}
              </a>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <div className="flex-shrink-0 h-9 w-9 rounded-xl bg-green-100 flex items-center justify-center">
                <Phone className="h-4 w-4 text-green-600" />
              </div>
              <span className="text-gray-700 font-bold">{broker.phone}</span>
            </div>
          </div>

          {/* View details button */}
          <Button 
            onClick={() => onViewDetails?.(broker.id)}
            className="w-full rounded-2xl bg-gradient-to-r from-[#0247ae] to-[#0560d4] hover:from-[#0560d4] hover:to-[#0247ae] font-extrabold h-14 text-base shadow-lg shadow-[#0247ae]/30 transition-all duration-300 hover:shadow-xl hover:shadow-[#0247ae]/50 hover:scale-[1.02] relative overflow-hidden group/btn"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></span>
            <span className="relative">View Full Profile</span>
          </Button>
          
          <p className="mt-4 text-center text-xs text-gray-500 font-semibold">
            Member since {formatDate(broker.joinedDate)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
