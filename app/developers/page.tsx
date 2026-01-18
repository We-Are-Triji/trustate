"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import {
  DevelopersHeader,
  DevelopersGrid,
  DeveloperModal,
} from "@/components/developers";

const LandingHeader = dynamic(() => import("@/components/landing/header").then(m => ({ default: m.LandingHeader })), { ssr: false });
const LandingFooter = dynamic(() => import("@/components/landing/footer").then(m => ({ default: m.LandingFooter })), { ssr: false });
import { developersData } from "@/lib/mock/developers-data";
import { partners, footerSections } from "@/lib/mock/landing-data";
import type { Developer } from "@/lib/types/developer";

export default function DevelopersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDeveloper, setSelectedDeveloper] = useState<Developer | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredDevelopers = useMemo(() => {
    return developersData.filter((developer) => {
      const matchesSearch =
        searchQuery === "" ||
        developer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        developer.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        developer.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSearch;
    });
  }, [searchQuery]);

  const handleDeveloperClick = (developer: Developer) => {
    setSelectedDeveloper(developer);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedDeveloper(null), 200);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f8f9ff] to-white">
      <LandingHeader />

      <main className="mx-auto max-w-7xl px-4 pb-16 pt-24 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#0247ae]/10 to-[#0247ae]/5 px-5 py-2.5 border border-[#0247ae]/10">
            <span className="text-sm font-semibold text-[#0247ae] tracking-wide">
              Trusted Partners
            </span>
          </div>
          <h1 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">
            Our Developer Partners
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Discover the Philippines&apos; most trusted real estate developers.
            Our partners are committed to delivering quality properties and
            exceptional service.
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
          <DevelopersHeader
            totalDevelopers={filteredDevelopers.length}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          <DevelopersGrid
            developers={filteredDevelopers}
            onDeveloperClick={handleDeveloperClick}
          />
        </div>
      </main>

      <LandingFooter partners={partners} sections={footerSections} />

      <DeveloperModal
        developer={selectedDeveloper}
        isOpen={isModalOpen}
        onClose={handleModalClose}
      />
    </div>
  );
}
