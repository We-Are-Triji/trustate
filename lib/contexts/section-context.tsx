"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface SectionContextType {
  currentSection: number;
  navigateToSection: (section: number) => void;
}

const SectionContext = createContext<SectionContextType | undefined>(undefined);

export function SectionProvider({ children }: { children: ReactNode }) {
  const [currentSection, setCurrentSection] = useState(0);

  const navigateToSection = useCallback((section: number) => {
    setCurrentSection(section);
  }, []);

  return (
    <SectionContext.Provider value={{ currentSection, navigateToSection }}>
      {children}
    </SectionContext.Provider>
  );
}

export function useSectionContext() {
  const context = useContext(SectionContext);
  if (!context) {
    throw new Error("useSectionContext must be used within SectionProvider");
  }
  return context;
}
