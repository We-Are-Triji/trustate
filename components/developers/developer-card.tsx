"use client";

import Image from "next/image";
import { Building2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Developer } from "@/lib/types/developer";

interface DeveloperCardProps {
  developer: Developer;
  onClick: (developer: Developer) => void;
}

export function DeveloperCard({ developer, onClick }: DeveloperCardProps) {
  return (
    <Card
      className="group cursor-pointer overflow-hidden border-[#E2E8F0] bg-white shadow-sm transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:border-[#0247ae]/30 hover:-translate-y-1 h-full flex flex-col"
      onClick={() => onClick(developer)}
    >
      <CardContent className="p-0 flex flex-col flex-1">
        <div className="p-6 flex flex-col flex-1">
          <div className="mb-6 flex flex-col items-center">
            <div className="relative mb-6 flex h-32 w-full items-center justify-center p-4 transition-all duration-300">
              <Building2 className="h-16 w-16 text-gray-300" />
            </div>

            <h3 className="mb-2 text-center text-xl font-bold text-gray-900 transition-colors group-hover:text-[#0247ae]">
              {developer.name}
            </h3>
            <p className="text-center text-sm font-medium text-gray-500">
              {developer.city}, {developer.country}
            </p>
          </div>

          <p className="mb-6 line-clamp-3 text-center text-sm text-gray-600 leading-relaxed flex-1">
            {developer.description}
          </p>

          <div className="flex items-center justify-center gap-6 border-t border-gray-100 pt-6 mt-auto">
            <div className="text-center">
              <p className="text-2xl font-bold text-[#0247ae]">
                {developer.projectsCompleted}
              </p>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Projects</p>
            </div>
            <div className="h-10 w-px bg-gray-200" />
            <div className="text-center">
              <p className="text-2xl font-bold text-[#0247ae]">
                {developer.yearsInBusiness}+
              </p>
              <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Years</p>
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
