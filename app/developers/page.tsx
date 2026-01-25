import { Metadata } from "next";
import DevelopersPageClient from "@/components/developers/developers-page-client";

export const metadata: Metadata = {
  title: "Developers",
};

export default function DevelopersPage() {
  return <DevelopersPageClient />;
}
