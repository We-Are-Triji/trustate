import {
  LandingHeader,
  HeroSection,
  HowItWorksSection,
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
    <div className="min-h-screen">
      <LandingHeader />
      <main>
        <HeroSection agents={topAgents} />
        <HowItWorksSection />
        <AgentListSection agents={topAgents} />
      </main>
      <LandingFooter partners={partners} sections={footerSections} />
    </div>
  );
}
