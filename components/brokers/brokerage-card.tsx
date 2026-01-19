"use client";

import { Building2, Star, Users, MapPin, User, Award, TrendingUp, Home } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { BrokerageFirm } from "@/lib/types/broker";
import { getPersonPhoto } from "@/lib/utils/photo-utils";

interface BrokerageCardProps {
  brokerage: BrokerageFirm;
  onClick?: (brokerage: BrokerageFirm) => void;
}

// Real estate property photos for brokerages
const brokeragePhotos = [
  "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=400&h=400&fit=crop",
];

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

function getBrokeragePhoto(name: string): string {
  // Generate consistent hash from brokerage name
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    const char = name.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  hash = Math.abs(hash);
  
  const photoIndex = hash % brokeragePhotos.length;
  return brokeragePhotos[photoIndex];
}

export function BrokerageCard({ brokerage, onClick }: BrokerageCardProps) {
  const representativePhoto = getPersonPhoto(brokerage.representative.name);
  const brokeragePhoto = getBrokeragePhoto(brokerage.name);
  
  return (
    <Card
      className="group cursor-pointer overflow-hidden rounded-3xl border-0 bg-white shadow-lg transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgba(2,71,174,0.35)] hover:-translate-y-3"
      onClick={() => onClick?.(brokerage)}
    >
      <CardContent className="p-0 relative">
        {/* Shine effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-10 rounded-3xl"></div>
        
        {/* Property image header */}
        <div className="relative h-48 overflow-hidden">
          <img 
            src={brokeragePhoto}
            alt={brokerage.name}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
          
          {/* Status badge - top left */}
          <div className="absolute left-4 top-4 z-10">
            <div className="flex items-center gap-2 rounded-xl bg-white/95 backdrop-blur-md px-3.5 py-2 shadow-lg border border-white/50">
              <span className={`h-2 w-2 rounded-full ${getStatusColor(brokerage.status)} ${brokerage.status === 'active' ? 'animate-pulse' : ''}`} />
              <span className="text-xs font-extrabold text-gray-800">{getStatusLabel(brokerage.status)}</span>
            </div>
          </div>
          
          {/* Rating badge - top right */}
          <div className="absolute right-4 top-4 z-10">
            <div className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#ffce08] to-[#f5c000] px-3.5 py-2 shadow-lg border border-yellow-300/50">
              <Star className="h-4 w-4 fill-white text-white" />
              <span className="text-xs font-extrabold text-[#0247ae]">{brokerage.rating}</span>
              <span className="text-xs font-bold text-[#0247ae]">({brokerage.reviewCount})</span>
            </div>
          </div>
          
          {/* Brokerage name overlay at bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
            <h3 className="text-xl font-extrabold text-white mb-1 leading-tight drop-shadow-lg">{brokerage.name}</h3>
            <div className="flex items-center gap-2 text-sm text-white/90">
              <MapPin className="h-4 w-4" />
              <span className="font-bold drop-shadow">{brokerage.city}</span>
            </div>
          </div>
        </div>

        {/* Brokerage info */}
        <div className="px-6 pb-6 pt-6">
          {/* Description */}
          <p className="text-sm text-gray-600 mb-5 line-clamp-2 leading-relaxed">
            {brokerage.description}
          </p>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-100 transition-all duration-300 hover:border-blue-200 hover:shadow-md">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Users className="h-4 w-4 text-[#0247ae]" />
              </div>
              <p className="text-2xl font-extrabold text-[#0247ae] mb-0.5">{brokerage.agentCount}</p>
              <p className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">Agents</p>
            </div>
            <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-100 transition-all duration-300 hover:border-yellow-200 hover:shadow-md">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Home className="h-4 w-4 text-[#ffce08]" />
              </div>
              <p className="text-2xl font-extrabold text-[#ffce08] mb-0.5">{brokerage.propertiesListed}</p>
              <p className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">Listings</p>
            </div>
            <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-100 transition-all duration-300 hover:border-green-200 hover:shadow-md">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Award className="h-4 w-4 text-emerald-600" />
              </div>
              <p className="text-2xl font-extrabold text-emerald-600 mb-0.5">{brokerage.yearsInBusiness}+</p>
              <p className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">Years</p>
            </div>
          </div>

          {/* Specializations */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-5">
            {brokerage.specializations.slice(0, 3).map((spec) => (
              <span
                key={spec}
                className="rounded-xl bg-gradient-to-r from-[#0247ae]/10 to-[#0560d4]/10 px-3 py-1.5 text-xs font-extrabold text-[#0247ae] border-2 border-[#0247ae]/20 whitespace-nowrap"
              >
                {spec}
              </span>
            ))}
          </div>

          {/* Account Manager */}
          <div className="mb-6 p-5 rounded-2xl bg-gradient-to-br from-gray-50 to-white border-2 border-gray-100">
            <p className="mb-3 text-xs font-extrabold uppercase tracking-wider text-gray-500 text-center">
              Account Manager
            </p>
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 h-14 w-14 rounded-full border-[3px] border-[#0247ae]/20 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shadow-md transition-all duration-300 group-hover:border-[#ffce08] group-hover:scale-105">
                <img 
                  src={representativePhoto} 
                  alt={brokerage.representative.name}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(brokerage.representative.name)}&size=100&background=0247ae&color=fff&bold=true`;
                  }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-extrabold text-gray-800 truncate">
                  {brokerage.representative.name}
                </p>
                <p className="text-xs text-gray-500 truncate font-semibold">
                  {brokerage.representative.title}
                </p>
              </div>
            </div>
          </div>

          {/* View details button */}
          <Button 
            className="w-full rounded-2xl bg-gradient-to-r from-[#0247ae] to-[#0560d4] hover:from-[#0560d4] hover:to-[#0247ae] font-extrabold h-14 text-base shadow-lg shadow-[#0247ae]/30 transition-all duration-300 hover:shadow-xl hover:shadow-[#0247ae]/50 hover:scale-[1.02] relative overflow-hidden group/btn"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></span>
            <span className="relative">View Brokerage</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
