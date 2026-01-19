"use client";

import { useEffect, useRef } from "react";
import {
  LandingHeader,
  HeroSection,
  HowItWorksSection,
  AgentListSection,
  LandingFooter,
} from "@/components/landing";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  topAgents,
  partners,
  footerSections,
} from "@/lib/mock/landing-data";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  
  // Optimized parallax effects - removed blur and reduced complexity
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -80]);

  useEffect(() => {
    // Smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    return () => {
      document.documentElement.style.scrollBehavior = '';
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <LandingHeader />
      
      {/* Hero Section with optimized parallax */}
      <motion.div
        style={{ 
          opacity: heroOpacity,
          y: heroY
        }}
        className="relative z-10 will-change-transform"
      >
        <section id="hero" className="min-h-screen flex items-center overflow-hidden">
          <HeroSection agents={topAgents} />
        </section>
      </motion.div>
      
      {/* Content sections with optimized scroll animations */}
      <div className="relative z-20 bg-[#f8faff]">
        {/* How It Works Section */}
        <motion.section
          id="how-it-works"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2, margin: "0px 0px -100px 0px" }}
          transition={{ 
            duration: 0.7, 
            ease: [0.25, 0.1, 0.25, 1]
          }}
        >
          <HowItWorksSection />
        </motion.section>
        
        {/* Agent List Section */}
        <motion.section
          id="find-partners"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2, margin: "0px 0px -100px 0px" }}
          transition={{ 
            duration: 0.7, 
            ease: [0.25, 0.1, 0.25, 1]
          }}
        >
          <AgentListSection agents={topAgents} />
        </motion.section>
        
        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1, margin: "0px 0px -50px 0px" }}
          transition={{ 
            duration: 0.6, 
            ease: [0.25, 0.1, 0.25, 1]
          }}
        >
          <LandingFooter partners={partners} sections={footerSections} />
        </motion.div>
      </div>
    </div>
  );
}
