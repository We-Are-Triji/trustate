"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { AgentsHeader, AgentsGrid } from "@/components/agents";
import { agentsData } from "@/lib/mock/agents-data";
import { partners, footerSections } from "@/lib/mock/landing-data";
import type { AgentFilters } from "@/lib/types/agent";

const LandingHeader = dynamic(() => import("@/components/landing/header").then(m => ({ default: m.LandingHeader })), { ssr: false });
const LandingFooter = dynamic(() => import("@/components/landing/footer").then(m => ({ default: m.LandingFooter })), { ssr: false });

const ITEMS_PER_PAGE = 12;

export default function AgentsPage() {
  const router = useRouter();
  const [filters, setFilters] = useState<AgentFilters>({
    search: "",
    status: "all",
    category: "all",
    employmentType: "all",
    specialization: "all",
  });
  const [currentPage, setCurrentPage] = useState(1);

  const filteredAgents = useMemo(() => {
    return agentsData.filter((agent) => {
      const matchesSearch =
        filters.search === "" ||
        agent.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        agent.email.toLowerCase().includes(filters.search.toLowerCase()) ||
        agent.location.toLowerCase().includes(filters.search.toLowerCase()) ||
        agent.title.toLowerCase().includes(filters.search.toLowerCase());

      const matchesStatus =
        filters.status === "all" || agent.status === filters.status;

      const matchesCategory =
        filters.category === "all" || agent.category === filters.category;

      const matchesEmployment =
        filters.employmentType === "all" ||
        agent.employmentType === filters.employmentType;

      const matchesSpecialization =
        filters.specialization === "all" ||
        agent.specializations.includes(filters.specialization);

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCategory &&
        matchesEmployment &&
        matchesSpecialization
      );
    });
  }, [filters]);

  const totalPages = Math.ceil(filteredAgents.length / ITEMS_PER_PAGE);
  const paginatedAgents = filteredAgents.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const activeCount = agentsData.filter((a) => a.status === "active").length;
  const inactiveCount = agentsData.filter((a) => a.status === "inactive").length;

  const handleViewDetails = (agentId: string) => {
    router.push(`/agents/${agentId}`);
  };

  return (
    <div className="min-h-screen bg-[#f8faff]">
      <LandingHeader />
      
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden bg-gradient-to-br from-[#f8faff] via-white to-[#f5f7ff] pt-24 pb-12"
      >
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-[#0247ae]/10 via-[#0560d4]/5 to-transparent blur-3xl" />
          <div className="absolute left-0 bottom-0 h-[400px] w-[400px] rounded-full bg-gradient-to-tr from-[#ffce08]/10 via-[#f5c000]/5 to-transparent blur-3xl" />
        </div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
          <div 
            className="h-full w-full"
            style={{
              backgroundImage: `linear-gradient(rgba(2, 71, 174, 1) 1px, transparent 1px),
                               linear-gradient(90deg, rgba(2, 71, 174, 1) 1px, transparent 1px)`,
              backgroundSize: '80px 80px'
            }}
          />
        </div>
        
        <main className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <AgentsHeader
            totalAgents={agentsData.length}
            activeCount={activeCount}
            inactiveCount={inactiveCount}
            filters={filters}
            onFiltersChange={(f) => { setFilters(f); setCurrentPage(1); }}
          />
        </main>
      </motion.div>

      {/* Main Content */}
      <main className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Pagination info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6 flex items-center justify-between text-sm text-gray-600"
        >
          <p className="font-medium">
            Showing <span className="text-[#0247ae]">{((currentPage - 1) * ITEMS_PER_PAGE) + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, filteredAgents.length)}</span> of <span className="text-[#0247ae]">{filteredAgents.length}</span> agents
          </p>
          {totalPages > 1 && (
            <p>Page <span className="font-semibold text-[#0247ae]">{currentPage}</span> of {totalPages}</p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <AgentsGrid agents={paginatedAgents} onViewDetails={handleViewDetails} />
        </motion.div>

        {/* Pagination controls */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-10 flex items-center justify-center gap-2"
          >
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="rounded-full border-2 border-[#0247ae]/20 bg-white px-6 py-2.5 text-sm font-semibold text-[#0247ae] hover:bg-[#0247ae] hover:text-white hover:border-[#0247ae] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-[#0247ae] transition-all duration-300 shadow-sm hover:shadow-lg"
            >
              Previous
            </button>
            <div className="flex gap-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`h-11 w-11 rounded-full text-sm font-bold transition-all duration-300 ${
                      currentPage === page
                        ? "bg-gradient-to-br from-[#0247ae] to-[#0560d4] text-white shadow-lg shadow-[#0247ae]/30 scale-110"
                        : "border-2 border-[#0247ae]/20 bg-white text-[#0247ae] hover:bg-[#0247ae]/5 hover:border-[#0247ae]/40 hover:scale-105"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="rounded-full border-2 border-[#0247ae]/20 bg-white px-6 py-2.5 text-sm font-semibold text-[#0247ae] hover:bg-[#0247ae] hover:text-white hover:border-[#0247ae] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-[#0247ae] transition-all duration-300 shadow-sm hover:shadow-lg"
            >
              Next
            </button>
          </motion.div>
        )}
      </main>
      
      <LandingFooter partners={partners} sections={footerSections} />
    </div>
  );
}
