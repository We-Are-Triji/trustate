"use client";

import { useEffect, useRef, useState } from "react";
import { Search, UserCheck, MessageSquare, Home, Sparkles, ArrowRight, ShieldCheck, Star, Zap } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Browse Verified Professionals",
    description: "Search our network of licensed and verified real estate agents and brokers across the Philippines.",
    gradient: "from-[#0247ae] to-[#0560d4]",
  },
  {
    icon: UserCheck,
    title: "Review Credentials",
    description: "View detailed profiles including PRC licenses, transaction history, and client reviews.",
    gradient: "from-[#ffce08] to-[#f5c000]",
  },
  {
    icon: MessageSquare,
    title: "Connect Securely",
    description: "Reach out to your chosen professional through our secure communication platform.",
    gradient: "from-[#0247ae] to-[#0560d4]",
  },
  {
    icon: Home,
    title: "Transact with Confidence",
    description: "Work with verified professionals who meet our rigorous integrity standards.",
    gradient: "from-[#ffce08] to-[#f5c000]",
  },
];

export function HowItWorksSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Trigger immediately when 10% is visible
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Lock it so it doesn't replay weirdly
        }
      },
      { 
        threshold: 0.1,
        rootMargin: "0px 0px -10% 0px" // Triggers slightly before element enters center screen
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative px-4 py-24 sm:px-6 lg:px-8 overflow-hidden bg-[#f8faff]"
    >
      <style jsx>{`
        /* 1. Heavy Elastic Pop for the House */
        @keyframes heavy-pop {
          0% { transform: scale(0); opacity: 0; }
          40% { transform: scale(1.4); opacity: 1; }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); opacity: 1; }
        }

        /* 2. Rings expanding outward */
        @keyframes shockwave {
          0% { transform: scale(0.8); opacity: 0; border-width: 0px; }
          50% { opacity: 1; border-width: 2px; }
          100% { transform: scale(1); opacity: 1; border-width: 1px; }
        }

        /* 3. Chat bubbles flying in */
        @keyframes fly-in-left {
          0% { transform: translate(-50px, 20px) scale(0.5); opacity: 0; }
          100% { transform: translate(0, 0) scale(1); opacity: 1; }
        }
        @keyframes fly-in-right {
          0% { transform: translate(50px, 20px) scale(0.5); opacity: 0; }
          100% { transform: translate(0, 0) scale(1); opacity: 1; }
        }

        /* 4. Text Slide Up */
        @keyframes slide-up-fade {
          0% { transform: translateY(30px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }

        /* 5. Vibe Coded Gradient Animation */
        @keyframes liquid-aurora {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        /* Continuous Float Animations */
        @keyframes float-gentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .animate-heavy-pop { animation: heavy-pop 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        .animate-shockwave { animation: shockwave 1s ease-out forwards; }
        .animate-fly-left { animation: fly-in-left 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .animate-fly-right { animation: fly-in-right 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .animate-slide-up { animation: slide-up-fade 0.8s ease-out forwards; }
        
        .vibe-gradient {
          background: linear-gradient(270deg, #0247ae, #40c9ff, #ffce08, #0247ae);
          background-size: 300% 300%;
          animation: liquid-aurora 4s ease infinite;
        }
      `}</style>

      {/* --- BACKGROUND LAYERS --- */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-100/30 rounded-full blur-[100px] opacity-40 mix-blend-multiply pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-yellow-100/30 rounded-full blur-[100px] opacity-40 mix-blend-multiply pointer-events-none" />
      
      {/* Grid Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div 
          className="h-full w-full"
          style={{
            backgroundImage: `linear-gradient(#0247ae 1px, transparent 1px), linear-gradient(90deg, #0247ae 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="grid gap-12 sm:gap-16 lg:grid-cols-2 lg:gap-24 items-center">
          
          {/* --- LEFT SIDE: Visuals --- */}
          <div className="relative order-2 lg:order-1">
            <div className="relative mx-auto max-w-md aspect-square flex items-center justify-center px-4">
              
              {/* 1. Outer Ring (Expands AFTER House) */}
              <div 
                className={`absolute w-[85%] h-[85%] rounded-full border border-blue-100 opacity-0 ${isVisible ? 'animate-shockwave' : ''}`} 
                style={{ animationDelay: '0.4s' }} // Delayed
              />
              
              {/* 2. Dashed Ring (Expands AFTER Outer Ring) */}
              <div 
                className={`absolute w-[65%] h-[65%] rounded-full border border-dashed border-yellow-200 opacity-0 ${isVisible ? 'animate-shockwave' : ''}`} 
                style={{ animationDelay: '0.5s' }} // Delayed more
              />
              
              {/* 3. CENTER HOUSE (The Trigger - Pops First) */}
              <div 
                className={`relative z-10 h-28 w-28 sm:h-32 sm:w-32 md:h-36 md:w-36 rounded-full bg-gradient-to-br from-[#0247ae] to-[#0560d4] flex flex-col items-center justify-center shadow-2xl shadow-blue-900/30 opacity-0 ${isVisible ? 'animate-heavy-pop' : ''}`}
                style={{ animationDelay: '0s' }} // Instant
              >
                 {/* Inner Glow */}
                 <div className="absolute inset-0 rounded-full bg-white/10 animate-pulse" />
                 
                 <Home className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 text-white drop-shadow-md mb-1" />
                 
                 <div className="text-center">
                   <p className="text-[9px] sm:text-[10px] font-bold text-blue-200 tracking-widest uppercase mb-0.5">THE</p>
                   <p className="text-xs sm:text-sm font-extrabold text-white leading-none">TRUSTATE</p>
                   <p className="text-[8px] sm:text-[9px] font-medium text-blue-100 mt-1 tracking-wider opacity-80">PROTOCOL</p>
                 </div>
              </div>

              {/* --- FLOATING CHATBOX 1 (Blue/Verified) --- */}
              <div 
                className={`absolute -left-2 sm:-left-6 top-[15%] z-20 w-40 sm:w-48 opacity-0 ${isVisible ? 'animate-fly-left' : ''}`}
                style={{ animationDelay: '0.6s' }}
              >
                <div className="relative group cursor-pointer hover:scale-105 transition-transform duration-300 animate-[float-gentle_4s_ease-in-out_infinite]">
                  <div className="absolute -bottom-2 right-4 sm:right-6 w-3 h-3 sm:w-4 sm:h-4 bg-[#0560d4] rotate-45 transform origin-center"></div>
                  <div className="relative rounded-2xl rounded-br-none bg-gradient-to-br from-[#0247ae] to-[#0560d4] p-3 sm:p-4 shadow-xl shadow-blue-900/20 border border-white/10 backdrop-blur-md">
                    <div className="relative flex items-center gap-2 sm:gap-3">
                      <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white/20">
                        <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                      </div>
                      <div>
                        <p className="text-[9px] sm:text-[10px] uppercase font-bold text-blue-200/80 tracking-wider">Discover</p>
                        <p className="text-xs sm:text-sm font-bold text-white">Browse Agents</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* --- FLOATING CHATBOX 2 (Yellow/Premium) --- */}
              <div 
                className={`absolute -right-2 sm:-right-4 bottom-[20%] z-20 w-40 sm:w-48 opacity-0 ${isVisible ? 'animate-fly-right' : ''}`}
                style={{ animationDelay: '0.7s' }}
              >
                <div className="relative group cursor-pointer hover:scale-105 transition-transform duration-300 animate-[float-gentle_5s_ease-in-out_infinite_1s]">
                  <div className="absolute -top-1 left-4 sm:left-6 w-3 h-3 sm:w-4 sm:h-4 bg-[#ffce08] rotate-45 transform origin-center"></div>
                  <div className="relative rounded-2xl rounded-tl-none bg-gradient-to-br from-[#ffce08] to-[#f5c000] p-3 sm:p-4 shadow-xl shadow-yellow-600/20 border border-white/20 backdrop-blur-md">
                    <div className="relative flex items-center gap-2 sm:gap-3">
                      <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-white/30">
                        <Star className="h-4 w-4 sm:h-5 sm:w-5 text-[#0247ae] fill-[#0247ae]" />
                      </div>
                      <div>
                        <p className="text-[9px] sm:text-[10px] uppercase font-bold text-[#0247ae]/70 tracking-wider">Verify</p>
                        <p className="text-xs sm:text-sm font-bold text-[#0247ae]">Review Profile</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* --- RIGHT SIDE: Content --- */}
          <div className="order-1 lg:order-2">
            
            {/* Clean Badge */}
            <div 
              className={`mb-6 inline-block opacity-0 ${isVisible ? 'animate-slide-up' : ''}`}
              style={{ animationDelay: '0.2s' }}
            >
               <div className="flex items-center gap-2 px-3 py-1.5 bg-[#0247ae]/5 rounded-full border border-[#0247ae]/10">
                 <div className="flex items-center justify-center w-4 h-4 rounded-full bg-[#0247ae]">
                   <Zap className="w-2.5 h-2.5 text-white" />
                 </div>
                 <span className="text-xs font-medium text-[#0247ae] uppercase tracking-wider">
                   Simple Process
                 </span>
               </div>
            </div>

            <div 
              className={`opacity-0 ${isVisible ? 'animate-slide-up' : ''}`}
              style={{ animationDelay: '0.3s' }}
            >
              <h2 className="mb-3 sm:mb-4 text-3xl sm:text-4xl font-bold text-gray-900 leading-tight">
                Connect with Confidence
              </h2>
              <p className="text-base sm:text-lg text-gray-600">
                in 4 Simple Steps
              </p>
            </div>

            <div className="relative space-y-4 sm:space-y-6 mt-8 sm:mt-12">
              {/* Vertical Dashed Line */}
              <div 
                className={`absolute left-[20px] sm:left-[28px] top-4 bottom-4 w-0.5 border-l-2 border-dashed border-gray-200 z-0 transition-all duration-1000 ease-in-out ${isVisible ? 'h-[90%] opacity-100' : 'h-0 opacity-0'}`}
                style={{ transitionDelay: '0.8s' }} 
              />

              {steps.map((step, index) => (
                <div
                  key={step.title}
                  className={`relative z-10 group flex gap-4 sm:gap-6 rounded-2xl p-3 sm:p-4 transition-all duration-500 border border-transparent hover:border-blue-100 hover:bg-white hover:shadow-lg hover:shadow-blue-900/5 opacity-0 ${isVisible ? 'animate-slide-up' : ''}`}
                  style={{ animationDelay: `${500 + (index * 150)}ms` }}
                >
                  {/* Icon Container */}
                  <div className={`flex h-12 w-12 sm:h-14 sm:w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${step.gradient} shadow-lg text-white transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-xl`}>
                    <step.icon className="h-6 w-6 sm:h-7 sm:w-7" />
                  </div>

                  <div className="flex-1 pt-0.5 sm:pt-1">
                    <h3 className="flex items-center gap-2 text-base sm:text-lg font-bold text-gray-900 group-hover:text-[#0247ae] transition-colors">
                      {step.title}
                      <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 text-[#0247ae]" />
                    </h3>
                    <p className="mt-1 text-xs sm:text-sm text-gray-600 leading-relaxed max-w-md">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}