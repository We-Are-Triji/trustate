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
    <div className="min-h-screen bg-[#f8faff]">
      <LandingHeader />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 md:pt-24 pb-8 md:pb-12">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0247ae]/5 via-transparent to-[#ffce08]/5" />
        
        {/* Decorative Elements */}
        <div className="absolute top-20 right-10 h-72 w-72 rounded-full bg-[#0247ae]/5 blur-3xl" />
        <div className="absolute bottom-0 left-10 h-72 w-72 rounded-full bg-[#ffce08]/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="mb-4 md:mb-6 inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-sm px-4 md:px-6 py-2 md:py-3 border-2 border-[#0247ae]/10 shadow-lg">
              <span className="text-xs md:text-sm font-extrabold text-[#0247ae] tracking-wide uppercase">
                Trusted Partners
              </span>
            </div>
            <h1 className="mb-4 md:mb-6 text-3xl md:text-5xl lg:text-7xl font-[family-name:var(--font-arsenal-sc)] font-bold text-gray-900 leading-tight">
              Our Developer
              <span className="block bg-gradient-to-r from-[#0247ae] to-[#0560d4] bg-clip-text text-transparent">
                Partners
              </span>
            </h1>
            <p className="mx-auto max-w-3xl text-sm md:text-lg text-gray-600 leading-relaxed px-4">
              Discover the Philippines&apos; most trusted real estate developers committed to delivering quality properties and exceptional service.
            </p>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <DevelopersHeader
          totalDevelopers={filteredDevelopers.length}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <DevelopersGrid
          developers={filteredDevelopers}
          onDeveloperClick={handleDeveloperClick}
        />
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
