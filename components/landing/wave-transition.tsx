"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useSectionContext } from "@/lib/contexts/section-context";

// Smoother, more natural easing (Sine-like but punchy)
const WAVE_EASE = [0.45, 0, 0.55, 1] as const;
const WAVE_DURATION = 1.4;
const SCROLL_THRESHOLD = 20;
const TRANSITION_COOLDOWN = 2000;

export function WaveTransition() {
  const { currentSection, navigateToSection } = useSectionContext();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isTransitioned, setIsTransitioned] = useState(false);
  const scrollAccumulator = useRef(0);
  const lastScrollTime = useRef(0);
  const prefersReducedMotion = useReducedMotion();

  // Lock body scroll when on Hero section
  useEffect(() => {
    if (currentSection === 0 && !isTransitioned) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    }

    return () => {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, [currentSection, isTransitioned]);

  const triggerTransition = useCallback(() => {
    if (isTransitioning || isTransitioned) return;
    
    const now = Date.now();
    if (now - lastScrollTime.current < TRANSITION_COOLDOWN) return;
    lastScrollTime.current = now;
    
    console.log("🌊 WAVE TRANSITION TRIGGERED!");
    setIsTransitioning(true);
    scrollAccumulator.current = 0;
    
    // Switch content when wave is fully covering the screen (approx 50-60% of duration)
    setTimeout(() => {
      navigateToSection(1);
      setIsTransitioned(true);
    }, 750);
    
    // Reset transitioning state after animation completes
    setTimeout(() => {
      setIsTransitioning(false);
    }, WAVE_DURATION * 1000 + 100);
  }, [isTransitioning, isTransitioned, navigateToSection]);

  // Scroll detection - only active when on Hero and not transitioned
  useEffect(() => {
    if (isTransitioned || currentSection !== 0) {
      return;
    }

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      if (isTransitioning) return;

      scrollAccumulator.current += Math.abs(e.deltaY);

      if (scrollAccumulator.current > SCROLL_THRESHOLD && e.deltaY > 0) {
        triggerTransition();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTransitioning) return;

      if (e.key === "ArrowDown" || e.key === "PageDown" || e.key === " ") {
        e.preventDefault();
        triggerTransition();
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (isTransitioning) return;
      
      const touch = e.touches[0];
      const startY = touch.clientY;
      let hasTrigger = false;

      const handleTouchMove = (moveEvent: TouchEvent) => {
        if (hasTrigger) return;
        
        const currentTouch = moveEvent.touches[0];
        const deltaY = startY - currentTouch.clientY;

        if (Math.abs(deltaY) > 30 && deltaY > 0) {
          moveEvent.preventDefault();
          hasTrigger = true;
          triggerTransition();
          document.removeEventListener("touchmove", handleTouchMove);
        }
      };

      document.addEventListener("touchmove", handleTouchMove, { passive: false });
      
      const handleTouchEnd = () => {
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchEnd);
      };
      
      document.addEventListener("touchend", handleTouchEnd);
    };

    // Decay scroll accumulator
    const decayInterval = setInterval(() => {
      scrollAccumulator.current *= 0.92;
    }, 50);

    document.addEventListener("wheel", handleWheel, { passive: false, capture: true });
    document.addEventListener("keydown", handleKeyDown, { capture: true });
    document.addEventListener("touchstart", handleTouchStart, { passive: false, capture: true });

    return () => {
      clearInterval(decayInterval);
      document.removeEventListener("wheel", handleWheel, { capture: true });
      document.removeEventListener("keydown", handleKeyDown, { capture: true });
      document.removeEventListener("touchstart", handleTouchStart, { capture: true });
    };
  }, [isTransitioned, currentSection, isTransitioning, triggerTransition]);

  // Reset when navigating back to Hero
  useEffect(() => {
    if (currentSection === 0 && isTransitioned) {
      setIsTransitioned(false);
    }
  }, [currentSection, isTransitioned]);

  // --- NEW PATH LOGIC: RISE FROM BOTTOM ---
  // The structure is M(Move) to Bottom-Left -> Curve to Bottom-Right -> Line to Bottom-Right Corner -> Line to Bottom-Left Corner
  // This ensures the wave fills from the bottom up.
  const waveVariants = {
    // Back layer (Darkest/Highlight) - Moves slowest, creates depth
    tertiary: {
      initial: "M0,1200 C480,1200 960,1200 1440,1200 V1200 H0 Z",
      // Rise phase
      mid: "M0,1200 C360,600 1080,800 1440,500 V1200 H0 Z",
      // Cover phase
      final: "M0,-100 C360,-100 1080,-100 1440,-100 V1200 H0 Z",
    },
    // Middle layer - Off-beat wave
    secondary: {
      initial: "M0,1200 C320,1200 1120,1200 1440,1200 V1200 H0 Z",
      // Rise phase (Opposite curve to tertiary for visual interest)
      mid: "M0,1200 C480,700 960,400 1440,650 V1200 H0 Z",
      // Cover phase
      final: "M0,-100 C480,-100 960,-100 1440,-100 V1200 H0 Z",
    },
    // Front layer (Main Blue) - The fastest, main filling action
    primary: {
      initial: "M0,1200 C240,1200 1200,1200 1440,1200 V1200 H0 Z",
      // Rise phase (Big crest in middle)
      mid: "M0,1200 C360,400 1080,200 1440,350 V1200 H0 Z",
      // Cover phase
      final: "M0,-200 C360,-200 1080,-200 1440,-200 V1200 H0 Z",
    },
  };

  if (!isTransitioning || prefersReducedMotion) return null;

  return (
    <motion.div
      key="wave-transition"
      className="fixed inset-0 pointer-events-none z-[100] flex flex-col justify-end"
    >
      <svg
        className="w-full h-full absolute inset-0"
        viewBox="0 0 1440 1200"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="waveGradientPrimary" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0873c9" />
            <stop offset="100%" stopColor="#0247ae" />
          </linearGradient>
          <linearGradient id="waveGradientSecondary" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4facfe" />
            <stop offset="100%" stopColor="#0560d4" />
          </linearGradient>
          <linearGradient id="waveGradientHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00f2fe" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#4facfe" stopOpacity="0.5" />
          </linearGradient>
        </defs>

        {/* Tertiary wave (Background) */}
        <motion.path
          fill="url(#waveGradientHighlight)"
          initial={{ d: waveVariants.tertiary.initial }}
          animate={{ 
            d: [
              waveVariants.tertiary.initial,
              waveVariants.tertiary.mid,
              waveVariants.tertiary.final,
            ]
          }}
          transition={{ 
            duration: WAVE_DURATION,
            ease: WAVE_EASE,
            times: [0, 0.6, 1],
          }}
        />

        {/* Secondary wave (Middle) */}
        <motion.path
          fill="url(#waveGradientSecondary)"
          initial={{ d: waveVariants.secondary.initial }}
          animate={{ 
            d: [
              waveVariants.secondary.initial,
              waveVariants.secondary.mid,
              waveVariants.secondary.final,
            ]
          }}
          transition={{ 
            duration: WAVE_DURATION,
            ease: WAVE_EASE,
            times: [0, 0.6, 1],
            delay: 0.05
          }}
        />

        {/* Primary wave (Front) */}
        <motion.path
          fill="url(#waveGradientPrimary)"
          initial={{ d: waveVariants.primary.initial }}
          animate={{ 
            d: [
              waveVariants.primary.initial,
              waveVariants.primary.mid,
              waveVariants.primary.final,
            ]
          }}
          transition={{ 
            duration: WAVE_DURATION,
            ease: WAVE_EASE,
            times: [0, 0.6, 1],
            delay: 0.1
          }}
        />
      </svg>
    </motion.div>
  );
}