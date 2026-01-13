import {
  LandingHeader,
  HeroSection,
  AgentListSection,
  LandingFooter,
} from "@/components/landing";
import {
  topAgents,
  partners,
  footerSections,
} from "@/lib/mock/landing-data";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <LandingHeader />
      <main>
        <HeroSection agents={topAgents} />
        <AgentListSection agents={topAgents} />
      </main>
      <LandingFooter partners={partners} sections={footerSections} />
    </div>
  );
}
