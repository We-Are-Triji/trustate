"use client";

import { useEffect } from "react";
import {
  LandingHeader,
  HeroSection,
  HowItWorksSection,
  AgentListSection,
  LandingFooter,
} from "@/components/landing";
import { SectionProvider } from "@/lib/contexts/section-context";
import { WaveTransition } from "@/components/landing/wave-transition";
import { motion } from "framer-motion";
import { useSectionContext } from "@/lib/contexts/section-context";
import {
  topAgents,
  partners,
  footerSections,
} from "@/lib/mock/landing-data";

function HomeContent() {
  const { currentSection, navigateToSection } = useSectionContext();

  // Simple scroll tracking - only when user is on "How It Works" section
  useEffect(() => {
    // Don't track scroll on Hero (section 0) since it's locked
    if (currentSection === 0) return;

    // Reset scroll to top when transitioning to section 1
    const scrollContainer = document.querySelector('.overflow-y-auto');
    if (scrollContainer && currentSection === 1) {
      scrollContainer.scrollTop = 0;
    }

    const handleScroll = () => {
      const scrollY = window.scrollY;
      
      // If scrolled to very top, go back to Hero
      if (scrollY < 50) {
        navigateToSection(0);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentSection, navigateToSection]);

  return (
    <div className="relative h-screen overflow-hidden">
      <LandingHeader />
      <WaveTransition />
      
      {/* Hero Section - Fixed layer, always on top initially */}
      <motion.div
        className="fixed inset-0 z-20"
        initial={false}
        animate={{
          opacity: currentSection === 0 ? 1 : 0,
          scale: currentSection === 0 ? 1 : 1.05,
          pointerEvents: currentSection === 0 ? "auto" : "none",
        }}
        transition={{
          duration: 0.8,
          ease: [0.25, 0.1, 0.25, 1],
          delay: currentSection === 0 ? 0.8 : 0,
        }}
      >
        <section id="hero" className="h-screen w-screen flex items-center overflow-hidden">
          <HeroSection agents={topAgents} />
        </section>
      </motion.div>
      
      {/* How It Works Section - Revealed underneath, becomes scrollable */}
      <motion.div
        className="absolute inset-0 z-10"
        initial={false}
        animate={{
          opacity: currentSection === 1 ? 1 : 0,
          pointerEvents: currentSection === 1 ? "auto" : "none",
        }}
        transition={{
          duration: 0.8,
          ease: [0.25, 0.1, 0.25, 1],
          delay: currentSection === 1 ? 0.8 : 0,
        }}
      >
        <div className="h-screen overflow-y-auto overflow-x-hidden">
          {/* How It Works Section */}
          <section id="how-it-works" className="min-h-screen">
            <HowItWorksSection />
          </section>
          
          {/* Find Partners Section */}
          <AgentListSection agents={topAgents} />
          
          <LandingFooter partners={partners} sections={footerSections} />
        </div>
      </motion.div>
    </div>
  );
}

export default function Home() {
  return (
    <SectionProvider>
      <HomeContent />
    </SectionProvider>
  );
}
