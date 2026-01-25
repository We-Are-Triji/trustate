import { Metadata } from "next";
import AgentsPageClient from "@/components/dashboard/agents/agents-page-client";

export const metadata: Metadata = {
  title: "Agents",
};

export default function AgentsPage() {
  return <AgentsPageClient />;
}
