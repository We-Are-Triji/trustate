"use client";

import { Building2, MapPin, Star } from "lucide-react";
import type { Developer } from "@/lib/types/developer";

interface DeveloperCardProps {
  developer: Developer;
  onClick: (developer: Developer) => void;
}

// Real estate/corporate building photos for developers - unique for each developer
const developerPhotos: Record<string, string> = {
  "1": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop", // Modern glass building
  "2": "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop", // Tall skyscraper
  "3": "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=400&h=300&fit=crop", // Urban architecture
  "4": "https://images.unsplash.com/photo-1577495508048-b635879837f1?w=400&h=300&fit=crop", // Corporate building
  "5": "https://images.unsplash.com/photo-1565008576549-57569a49371d?w=400&h=300&fit=crop", // Residential towers
  "6": "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=300&fit=crop", // Modern complex
  "7": "https://images.unsplash.com/photo-1554469384-e58fac16e23a?w=400&h=300&fit=crop", // Premium building
  "8": "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&h=300&fit=crop", // Luxury tower
  "9": "https://images.unsplash.com/photo-1556761175-b413da4baf72?w=400&h=300&fit=crop", // High-rise
  "10": "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=400&h=300&fit=crop", // Contemporary building
  "11": "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop", // Office tower
  "12": "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=300&fit=crop", // Exclusive property
};

function getDeveloperPhoto(id: string): string {
  return developerPhotos[id] || developerPhotos["1"];
}

export function DeveloperCard({ developer, onClick }: DeveloperCardProps) {
  const tierConfig = {
    gold: {
      badge: "bg-gradient-to-r from-amber-400 to-yellow-500 text-white",
      overlay: "from-amber-500/20 to-orange-500/20",
    },
    silver: {
      badge: "bg-gradient-to-r from-gray-400 to-slate-500 text-white",
      overlay: "from-gray-500/20 to-slate-500/20",
    },
    bronze: {
      badge: "bg-gradient-to-r from-orange-500 to-red-500 text-white",
      overlay: "from-orange-500/20 to-red-500/20",
    },
  };

  const config = tierConfig[developer.partnerTier as keyof typeof tierConfig];

  return (
    <div
      className="group cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md transition-all duration-300 hover:shadow-xl hover:border-blue-300 hover:-translate-y-1 flex flex-col"
      onClick={() => onClick(developer)}
    >
      {/* Header with photo */}
      <div className="relative h-44 overflow-hidden bg-gray-100">
        <img 
          src={getDeveloperPhoto(developer.id)} 
          alt={developer.name}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className={`absolute inset-0 bg-gradient-to-br ${config.overlay}`} />
        
        {/* Tier Badge */}
        <div className="absolute top-3 right-3">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${config.badge} backdrop-blur-sm font-bold text-xs uppercase tracking-wide shadow-lg`}>
            <Star className="h-3 w-3 fill-current" />
            {developer.partnerTier}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        {/* Company Name */}
        <h3 className="mb-2 text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-tight">
          {developer.name}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-2 mb-3 text-gray-600">
          <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
          <span className="text-xs font-medium">{developer.city}</span>
        </div>

        {/* Description */}
        <p className="mb-4 line-clamp-2 text-sm text-gray-600 leading-relaxed flex-1">
          {developer.description}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="rounded-lg bg-blue-50 border border-blue-100 p-2.5 text-center">
            <p className="text-lg font-bold text-blue-600">{developer.projectsCompleted}</p>
            <p className="text-[10px] font-semibold text-gray-600 uppercase">Projects</p>
          </div>
          <div className="rounded-lg bg-emerald-50 border border-emerald-100 p-2.5 text-center">
            <p className="text-lg font-bold text-emerald-600">{developer.yearsInBusiness}+</p>
            <p className="text-[10px] font-semibold text-gray-600 uppercase">Years</p>
          </div>
        </div>

        {/* View Details Button */}
        <button className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 py-2.5 text-center font-semibold text-sm text-white transition-all duration-300 hover:shadow-md hover:from-blue-700 hover:to-blue-800">
          View Details
        </button>
      </div>
    </div>
  );
}
