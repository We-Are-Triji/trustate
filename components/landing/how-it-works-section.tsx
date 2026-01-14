"use client";

import { useEffect, useRef, useState } from "react";
import { Search, UserCheck, MessageSquare, Home, Sparkles } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Search Properties",
    description: "Browse through our extensive collection of verified properties across the Philippines.",
    color: "bg-gradient-to-br from-[#0247ae] to-[#0560d4]",
    iconColor: "text-white",
    shadowColor: "shadow-[#0247ae]/30",
  },
  {
    icon: UserCheck,
    title: "Find an Agent",
    description: "Connect with licensed and verified real estate agents in your preferred location.",
    color: "bg-gradient-to-br from-[#ffce08] to-[#f5c000]",
    iconColor: "text-[#0247ae]",
    shadowColor: "shadow-[#ffce08]/30",
  },
  {
    icon: MessageSquare,
    title: "Schedule a Meeting",
    description: "Book a video call or in-person meeting with your chosen agent at your convenience.",
    color: "bg-gradient-to-br from-[#0247ae] to-[#0560d4]",
    iconColor: "text-white",
    shadowColor: "shadow-[#0247ae]/30",
  },
  {
    icon: Home,
    title: "Close the Deal",
    description: "Complete your transaction with confidence through our secure platform.",
    color: "bg-gradient-to-br from-[#ffce08] to-[#f5c000]",
    iconColor: "text-[#0247ae]",
    shadowColor: "shadow-[#ffce08]/30",
  },
];

export function HowItWorksSection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef}
      id="how-it-works" 
      className="relative bg-gradient-to-b from-white via-[#fafbff] to-white px-4 py-24 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Decorative elements - repositioned to not block text */}
      <div className="absolute left-0 top-0 h-full w-1/3 bg-gradient-to-r from-[#0247ae]/5 to-transparent pointer-events-none" />
      <div className="absolute right-[5%] top-[5%] h-32 w-32 rounded-full border-2 border-dashed border-[#ffce08]/15 animate-[spin_60s_linear_infinite] pointer-events-none" />
      <div className="absolute left-[3%] bottom-[10%] h-20 w-20 rounded-full border-2 border-[#0247ae]/10 animate-[spin_50s_linear_infinite_reverse] pointer-events-none" />
      
      {/* Subtle floating accents - positioned away from content */}
      <div className="absolute right-[3%] top-[15%] h-3 w-3 rounded-full bg-[#ffce08]/50 animate-[float_4s_ease-in-out_infinite] pointer-events-none" />
      <div className="absolute right-[2%] bottom-[20%] h-4 w-4 rounded-full bg-[#ffce08]/30 animate-[float_5s_ease-in-out_infinite_1s] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-20 items-center">
          {/* Left side - Illustration area */}
          <div className={`relative order-2 lg:order-1 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'}`}>
            <div className="relative mx-auto max-w-md">
              {/* Main circular frame with animation */}
              <div className="relative aspect-square">
                <div className="absolute inset-0 rounded-full border-[6px] border-[#ffce08] animate-[spin_30s_linear_infinite]" />
                <div className="absolute inset-4 rounded-full border-2 border-dashed border-[#0247ae]/20 animate-[spin_40s_linear_infinite_reverse]" />
                <div className="absolute inset-8 rounded-full bg-gradient-to-br from-[#0247ae] via-[#0560d4] to-[#0873c9] flex items-center justify-center shadow-2xl shadow-[#0247ae]/30 animate-[glowPulse_4s_ease-in-out_infinite]">
                  <div className="text-center text-white p-8">
                    <div className="relative">
                      <Home className="mx-auto h-16 w-16 mb-4 animate-[bounce_3s_ease-in-out_infinite]" />
                      <div className="absolute -top-2 -right-2">
                        <Sparkles className="h-6 w-6 text-[#ffce08] animate-[float_2s_ease-in-out_infinite]" />
                      </div>
                    </div>
                    <p className="text-xl font-bold">Find Your Dream Home</p>
                    <p className="text-sm text-white/80 mt-2">With TruState</p>
                  </div>
                </div>
              </div>

              {/* Floating elements with enhanced animations */}
              <div className="absolute -left-8 top-1/4 rounded-2xl bg-white p-4 shadow-xl border border-gray-100 animate-[float_4s_ease-in-out_infinite] hover:shadow-2xl transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#ffce08] to-[#f5c000] shadow-lg">
                    <Search className="h-6 w-6 text-[#0247ae]" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-lg">1000+</p>
                    <p className="text-xs text-gray-500 font-medium">Properties</p>
                  </div>
                </div>
              </div>

              <div className="absolute -right-4 bottom-1/4 rounded-2xl bg-white p-4 shadow-xl border border-gray-100 animate-[float_3.5s_ease-in-out_infinite_0.5s] hover:shadow-2xl transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#0247ae] to-[#0560d4] shadow-lg">
                    <UserCheck className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-lg">500+</p>
                    <p className="text-xs text-gray-500 font-medium">Verified Agents</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Content */}
          <div className={`order-1 lg:order-2 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'}`}>
            <div className="mb-10">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#0247ae]/10 to-[#0247ae]/5 px-5 py-2.5 border border-[#0247ae]/10">
                <Sparkles className="h-4 w-4 text-[#0247ae]" />
                <span className="text-sm font-semibold text-[#0247ae] tracking-wide">Simple Process</span>
              </div>
              <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">
                How It Works
              </h2>
              <p className="text-gray-600 text-lg">
                Getting started with TruState is easy. Follow these simple steps to find your perfect property or connect with top agents.
              </p>
            </div>

            <div className="space-y-5">
              {steps.map((step, index) => (
                <div
                  key={step.title}
                  className={`group flex gap-5 rounded-2xl bg-white p-5 border border-gray-100 transition-all duration-500 hover:shadow-xl hover:border-[#0247ae]/20 hover:-translate-y-1 cursor-pointer ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                  style={{ transitionDelay: `${400 + index * 100}ms` }}
                >
                  <div className={`flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl ${step.color} shadow-lg ${step.shadowColor} transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                    <step.icon className={`h-8 w-8 ${step.iconColor}`} />
                  </div>
                  <div className="flex-1">
                    <div className="mb-1.5 flex items-center gap-2">
                      <span className="text-xs font-bold text-[#0247ae] bg-[#0247ae]/10 px-2 py-0.5 rounded-full">STEP {index + 1}</span>
                    </div>
                    <h3 className="mb-1.5 text-lg font-bold text-gray-900 group-hover:text-[#0247ae] transition-colors">{step.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
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
