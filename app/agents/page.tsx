"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { LandingHeader } from "@/components/landing/header";
import { LandingFooter } from "@/components/landing/footer";
import { AgentsHeader, AgentsGrid } from "@/components/agents";
import { agentsData } from "@/lib/mock/agents-data";
import { partners, footerSections } from "@/lib/mock/landing-data";
import type { AgentFilters } from "@/lib/types/agent";

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
    <div className="min-h-screen bg-[#F8FAFC]">
      <LandingHeader />
      <main className="mx-auto max-w-7xl px-4 pt-24 pb-8 sm:px-6 lg:px-8">
        <AgentsHeader
          totalAgents={agentsData.length}
          activeCount={activeCount}
          inactiveCount={inactiveCount}
          filters={filters}
          onFiltersChange={(f) => { setFilters(f); setCurrentPage(1); }}
        />

        {/* Pagination info */}
        <div className="mb-4 flex items-center justify-between text-sm text-gray-500">
          <p>
            Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, filteredAgents.length)} of {filteredAgents.length} agents
          </p>
          {totalPages > 1 && (
            <p>Page {currentPage} of {totalPages}</p>
          )}
        </div>

        <AgentsGrid agents={paginatedAgents} onViewDetails={handleViewDetails} />

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`h-9 w-9 rounded-lg text-sm font-medium ${
                      currentPage === page
                        ? "bg-[#0247ae] text-white"
                        : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
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
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </main>
      <LandingFooter partners={partners} sections={footerSections} />
    </div>
  );
}
