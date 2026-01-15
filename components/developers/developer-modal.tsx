"use client";

import Image from "next/image";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  ExternalLink,
  Briefcase,
  Calendar,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Developer } from "@/lib/types/developer";

interface DeveloperModalProps {
  developer: Developer | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DeveloperModal({
  developer,
  isOpen,
  onClose,
}: DeveloperModalProps) {
  if (!developer) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="block max-h-[95vh] w-[95vw] max-w-4xl overflow-y-auto bg-white p-0 sm:block">
        <div className="border-b border-gray-100 bg-white p-6 sm:p-8">
          <DialogHeader className="gap-0 text-center">
            <div className="flex flex-col items-center gap-4">
              <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-xl bg-[#f0f4f8] p-4">
                <Building2 className="h-10 w-10 text-[#4a6fa5]" />
              </div>

              <div className="text-center">
                <DialogTitle className="text-2xl font-bold text-gray-800 sm:text-3xl leading-tight mb-2">
                  {developer.name}
                </DialogTitle>
                <div className="flex items-center justify-center gap-2 text-gray-500">
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  <span>
                    {developer.city}, {developer.country}
                  </span>
                </div>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="p-6 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h4 className="mb-3 text-lg font-semibold text-gray-800">
                About {developer.name}
              </h4>
              <p className="text-sm leading-relaxed text-gray-600">
                {developer.fullDescription}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-gray-200 bg-white p-4 text-center">
                <Briefcase className="mx-auto mb-2 h-6 w-6 text-[#0247ae]" />
                <p className="text-2xl font-bold text-[#0247ae]">
                  {developer.projectsCompleted}
                </p>
                <p className="text-xs text-gray-500">Projects Completed</p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-4 text-center">
                <Calendar className="mx-auto mb-2 h-6 w-6 text-[#0247ae]" />
                <p className="text-2xl font-bold text-[#0247ae]">
                  {developer.yearsInBusiness}+
                </p>
                <p className="text-xs text-gray-500">Years in Business</p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-4 text-center">
                <Phone className="mx-auto mb-2 h-6 w-6 text-gray-600" />
                <p className="text-sm font-semibold text-gray-800">
                  {developer.phone}
                </p>
                <p className="text-xs text-gray-500">Contact</p>
              </div>
              <div className="rounded-xl border border-gray-200 bg-white p-4 text-center">
                <Mail className="mx-auto mb-2 h-6 w-6 text-gray-600" />
                <a 
                  href={`mailto:${developer.email}`}
                  className="block text-sm font-semibold text-[#0247ae] hover:underline"
                >
                  Email
                </a>
                <p className="text-xs text-gray-500">Inquire</p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h4 className="mb-3 text-lg font-semibold text-gray-800">
              Specializations
            </h4>
            <div className="flex flex-wrap gap-2">
              {developer.specializations.map((spec, index) => (
                <span
                  key={index}
                  className="inline-flex items-center rounded-full border border-[#0247ae]/30 bg-white px-4 py-2 text-sm font-medium text-[#0247ae]"
                >
                  {spec}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <Button
              asChild
              className="w-full h-12 bg-[#0247ae] text-white hover:bg-[#023a8a] rounded-lg text-base font-medium"
            >
              <a
                href={developer.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2"
              >
                <Globe className="h-5 w-5" />
                Visit Website
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
