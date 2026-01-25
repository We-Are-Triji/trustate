import { Metadata } from "next";
import BrokersPageClient from "@/components/brokers/brokers-page-client";

export const metadata: Metadata = {
  title: "Brokers",
};

export default function BrokersPage() {
  return <BrokersPageClient />;
}
