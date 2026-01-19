"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import {
  BrokersHeader,
  BrokeragesGrid,
  IndividualBrokersGrid,
} from "@/components/brokers";
import { brokerageFirms, individualBrokers } from "@/lib/mock/brokers-data";
import { partners, footerSections } from "@/lib/mock/landing-data";
import { SectionProvider } from "@/lib/contexts/section-context";
import type { BrokerFilters, BrokerType, BrokerageFirm } from "@/lib/types/broker";

const LandingHeader = dynamic(
  () => import("@/components/landing/header").then((m) => ({ default: m.LandingHeader })),
  { ssr: false }
);
const LandingFooter = dynamic(
  () => import("@/components/landing/footer").then((m) => ({ default: m.LandingFooter })),
  { ssr: false }
);

const ITEMS_PER_PAGE = 12;

export default function BrokersPage() {
  const router = useRouter();
  const [brokerType, setBrokerType] = useState<BrokerType>("firm");
  const [filters, setFilters] = useState<BrokerFilters>({
    search: "",
    status: "all",
    specialization: "all",
  });
  const [currentPage, setCurrentPage] = useState(1);

  const filteredBrokerages = useMemo(() => {
    return brokerageFirms.filter((brokerage) => {
      const matchesSearch =
        filters.search === "" ||
        brokerage.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        brokerage.city.toLowerCase().includes(filters.search.toLowerCase()) ||
        brokerage.representative.name.toLowerCase().includes(filters.search.toLowerCase());

      const matchesStatus =
        filters.status === "all" || brokerage.status === filters.status;

      return matchesSearch && matchesStatus;
    });
  }, [filters]);

  const filteredIndividualBrokers = useMemo(() => {
    return individualBrokers.filter((broker) => {
      const matchesSearch =
        filters.search === "" ||
        broker.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        broker.email.toLowerCase().includes(filters.search.toLowerCase()) ||
        broker.location.toLowerCase().includes(filters.search.toLowerCase());

      const matchesStatus =
        filters.status === "all" || broker.status === filters.status;

      return matchesSearch && matchesStatus;
    });
  }, [filters]);

  const currentData = brokerType === "firm" ? filteredBrokerages : filteredIndividualBrokers;
  const totalPages = Math.ceil(currentData.length / ITEMS_PER_PAGE);
  const paginatedData = currentData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const activebrokeragesCount = brokerageFirms.filter((b) => b.status === "active").length;
  const activeIndividualCount = individualBrokers.filter((b) => b.status === "active").length;
  const totalActiveCount = brokerType === "firm" ? activebrokeragesCount : activeIndividualCount;

  const handleBrokerTypeChange = (type: BrokerType) => {
    setBrokerType(type);
    setCurrentPage(1);
    setFilters({ search: "", status: "all", specialization: "all" });
  };

  const handleFiltersChange = (newFilters: BrokerFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleBrokerageClick = (brokerage: BrokerageFirm) => {
    router.push(`/brokers/${brokerage.id}`);
  };

  const handleIndividualBrokerClick = (brokerId: string) => {
    router.push(`/brokers/${brokerId}`);
  };

  return (
    <SectionProvider>
      <div className="min-h-screen bg-[#F8FAFC]">
        <LandingHeader />
        <main className="mx-auto max-w-7xl px-4 pb-8 pt-24 sm:px-6 lg:px-8">
          <BrokersHeader
            brokerType={brokerType}
            onBrokerTypeChange={handleBrokerTypeChange}
            totalBrokerages={brokerageFirms.length}
            totalIndividualBrokers={individualBrokers.length}
            activeCount={totalActiveCount}
            filters={filters}
            onFiltersChange={handleFiltersChange}
          />

          {currentData.length > 0 && (
            <div className="mb-4 flex items-center justify-between text-sm text-gray-500">
              <p>
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}-
                {Math.min(currentPage * ITEMS_PER_PAGE, currentData.length)} of{" "}
                {currentData.length} {brokerType === "firm" ? "brokerages" : "brokers"}
              </p>
              {totalPages > 1 && (
                <p>
                  Page {currentPage} of {totalPages}
                </p>
              )}
            </div>
          )}

          {brokerType === "firm" ? (
            <BrokeragesGrid
              brokerages={paginatedData as BrokerageFirm[]}
              onBrokerageClick={handleBrokerageClick}
            />
          ) : (
            <IndividualBrokersGrid
              brokers={paginatedData as typeof individualBrokers}
              onViewDetails={handleIndividualBrokerClick}
            />
          )}

          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
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
                className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </main>
        <LandingFooter partners={partners} sections={footerSections} />
      </div>
    </SectionProvider>
  );
}
