"use client";

import { useState, useMemo } from "react";
import { LandingHeader } from "@/components/landing/header";
import { LandingFooter } from "@/components/landing/footer";
import { AgentsHeader, AgentsGrid } from "@/components/agents";
import { agentsData } from "@/lib/mock/agents-data";
import { partners, footerSections } from "@/lib/mock/landing-data";
import type { AgentFilters } from "@/lib/types/agent";

export default function AgentsPage() {
  const [filters, setFilters] = useState<AgentFilters>({
    search: "",
    status: "all",
    category: "all",
    employmentType: "all",
    specialization: "all",
  });

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

  const activeCount = agentsData.filter((a) => a.status === "active").length;
  const inactiveCount = agentsData.filter((a) => a.status === "inactive").length;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <LandingHeader />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <AgentsHeader
          totalAgents={agentsData.length}
          activeCount={activeCount}
          inactiveCount={inactiveCount}
          filters={filters}
          onFiltersChange={setFilters}
        />
        <AgentsGrid agents={filteredAgents} />
      </main>
      <LandingFooter partners={partners} sections={footerSections} />
    </div>
  );
}
