"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { Star, MapPin, ChevronRight, ChevronLeft, Phone, Mail, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Agent } from "@/lib/types/landing";

// Stock photos for agents
const agentPhotos = [
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&crop=face", 
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop&crop=face", 
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop&crop=face", 
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face", 
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face", 
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face", 
];

interface AgentListSectionProps {
  agents: Agent[];
}

export function AgentListSection({ agents }: AgentListSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  
  // Guard against undefined/empty agents prop
  const safeAgents = agents || [];
  const displayAgents = safeAgents.slice(0, 6);
  const itemsPerView = 3;
  const maxIndex = Math.max(0, displayAgents.length - itemsPerView);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const prevSlide = () => {
    setActiveIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <section 
      id="find-partners"
      ref={sectionRef}
      className="relative py-28 overflow-x-clip bg-[#f8faff]"
    >
      <style jsx>{`
        @keyframes liquid-aurora {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .vibe-gradient {
          background: linear-gradient(270deg, #0247ae, #40c9ff, #ffce08, #0247ae);
          background-size: 300% 300%;
          animation: liquid-aurora 4s ease infinite;
        }
      `}</style>

      {/* Animated background */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, #ffffff 0%, #f8f9ff 20%, #f5f7ff 50%, #f8f9ff 80%, #ffffff 100%)',
        }}
      />

      {/* Animated gradient overlay */}
      <div 
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 80% 20%, rgba(255, 206, 8, 0.12) 0%, transparent 50%), radial-gradient(ellipse at 20% 80%, rgba(2, 71, 174, 0.08) 0%, transparent 50%)',
          animation: 'meshMove 20s ease-in-out infinite'
        }}
      />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <div 
          className="h-full w-full"
          style={{
            backgroundImage: `linear-gradient(rgba(2, 71, 174, 1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(2, 71, 174, 1) 1px, transparent 1px)`,
            backgroundSize: '80px 80px'
          }}
        />
      </div>

      {/* Background Orbs & Decorations */}
      <div className="absolute right-0 top-0 h-[600px] w-[600px] rounded-full bg-gradient-to-br from-[#ffce08]/15 via-[#f5c000]/10 to-transparent blur-3xl animate-[floatBlob_25s_ease-in-out_infinite] pointer-events-none" />
      <div className="absolute left-0 bottom-0 h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-[#0247ae]/12 via-[#0560d4]/8 to-transparent blur-3xl animate-[floatBlob_30s_ease-in-out_infinite_reverse] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className={`mb-14 flex flex-col items-center justify-between gap-6 sm:flex-row transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div>
            
            {/* Clean Badge */}
            <div className="mb-4 inline-block">
               <div className="flex items-center gap-2 px-3 py-1.5 bg-[#0247ae]/5 rounded-full border border-[#0247ae]/10">
                 <div className="flex items-center justify-center w-4 h-4 rounded-full bg-[#0247ae]">
                   <Award className="w-2.5 h-2.5 text-white" />
                 </div>
                 <span className="text-xs font-medium text-[#0247ae] uppercase tracking-wider">
                   Top Performers
                 </span>
               </div>
            </div>

            <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl text-gray-900">
              Find Your Perfect Partner
            </h2>
            <p className="mt-3 text-gray-600 text-lg">
              Connect with our top-rated real estate agents
            </p>
          </div>
          
          {/* Navigation buttons */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={prevSlide}
              className="h-14 w-14 rounded-full border-2 border-[#0247ae]/20 hover:bg-gradient-to-br hover:from-[#0247ae] hover:to-[#0560d4] hover:border-transparent hover:text-white transition-all duration-500 group shadow-lg shadow-transparent hover:shadow-[#0247ae]/20 hover:scale-105"
            >
              <ChevronLeft className="h-6 w-6 text-[#0247ae] group-hover:text-white transition-colors" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={nextSlide}
              className="h-14 w-14 rounded-full border-2 border-[#0247ae]/20 hover:bg-gradient-to-br hover:from-[#0247ae] hover:to-[#0560d4] hover:border-transparent hover:text-white transition-all duration-500 group shadow-lg shadow-transparent hover:shadow-[#0247ae]/20 hover:scale-105"
            >
              <ChevronRight className="h-6 w-6 text-[#0247ae] group-hover:text-white transition-colors" />
            </Button>
          </div>
        </div>

        {/* Agent cards carousel */}
        <div className="relative -mx-8 sm:-mx-12 lg:-mx-16">
          <div className="overflow-hidden px-12 sm:px-16 lg:px-20 py-8">
            <div 
              className="flex gap-6 transition-transform duration-700 ease-out"
              style={{ transform: `translateX(calc(-${activeIndex} * (33.333% + 8px)))` }}
            >
            {displayAgents.map((agent, index) => (
              <Card
                key={agent.id || index}
                className={`w-[calc(33.333%-16px)] flex-shrink-0 overflow-hidden rounded-3xl border-0 bg-white/90 backdrop-blur-xl shadow-xl transition-all duration-700 hover:shadow-[0_30px_70px_-15px_rgba(0,0,0,0.25)] hover:-translate-y-4 group p-0 gap-0 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
                style={{ transitionDelay: `${200 + index * 100}ms` }}
              >
                <CardContent className="p-0 relative">
                  {/* Glassmorphism shine effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-10 rounded-3xl"></div>
                  
                  {/* Card header with gradient */}
                  <div className="relative bg-gradient-to-br from-[#0247ae] via-[#0560d4] to-[#0873c9] pt-6 px-6 pb-16 overflow-hidden">
                    {/* Grid pattern overlay */}
                    <div className="absolute inset-0 opacity-[0.05]">
                      <div 
                        className="h-full w-full"
                        style={{
                          backgroundImage: `linear-gradient(rgba(255, 255, 255, 1) 1px, transparent 1px),
                                           linear-gradient(90deg, rgba(255, 255, 255, 1) 1px, transparent 1px)`,
                          backgroundSize: '25px 25px'
                        }}
                      />
                    </div>
                    
                    {/* Animated background pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-white -translate-y-1/2 translate-x-1/2 animate-[float_6s_ease-in-out_infinite] group-hover:scale-125 transition-transform duration-700" />
                      <div className="absolute left-0 bottom-0 h-36 w-36 rounded-full bg-white translate-y-1/2 -translate-x-1/2 animate-[float_5s_ease-in-out_infinite_1s] group-hover:scale-125 transition-transform duration-700" />
                      <div className="absolute right-1/4 top-1/2 h-20 w-20 rounded-full bg-[#ffce08]/30 animate-[float_4s_ease-in-out_infinite_0.5s]" />
                    </div>
                    
                    {/* Rank badge */}
                    <div className="absolute left-4 top-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#ffce08] to-[#f5c000] font-bold text-[#0247ae] shadow-lg shadow-[#ffce08]/40 text-lg transition-all duration-500 group-hover:scale-115 group-hover:rotate-12 z-10">
                      #{agent.rank || index + 1}
                    </div>
                    
                    {/* Rating */}
                    <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-md px-3 py-1.5 border border-white/20 group-hover:bg-white/30 transition-all duration-500 z-10">
                      <Star className="h-4 w-4 fill-[#ffce08] text-[#ffce08] group-hover:scale-125 group-hover:rotate-12 transition-all duration-500" />
                      <span className="text-sm font-bold text-white">{agent.rating}</span>
                    </div>
                  </div>

                  {/* Profile image - overlapping */}
                  <div className="relative -mt-14 flex justify-center">
                    <div className="relative group/avatar">
                      <div className="h-28 w-28 rounded-full border-4 border-white shadow-xl overflow-hidden transition-all duration-700 group-hover:scale-110 group-hover:border-[#ffce08] group-hover:shadow-2xl group-hover:shadow-[#ffce08]/30">
                        <img 
                          src={agentPhotos[index % agentPhotos.length]} 
                          alt={agent.name}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-115"
                        />
                      </div>
                      {/* Online indicator with pulse */}
                      <div className="absolute bottom-1 right-1 h-6 w-6 rounded-full border-2 border-white bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center shadow-lg shadow-green-500/50 group-hover:scale-125 transition-all duration-500">
                        <div className="h-3 w-3 rounded-full bg-green-400 animate-ping absolute" />
                        <div className="h-2.5 w-2.5 rounded-full bg-white relative" />
                      </div>
                    </div>
                  </div>

                  {/* Agent info */}
                  <div className="px-6 pb-6 pt-4 text-center">
                    <h3 className="mb-1 text-xl font-bold text-gray-900 group-hover:text-[#0247ae] transition-colors duration-500">{agent.name}</h3>
                    <p className="mb-3 text-sm font-medium bg-gradient-to-r from-[#0247ae] to-[#0560d4] bg-clip-text text-transparent">{agent.title}</p>
                    
                    <div className="mb-5 flex items-center justify-center gap-1.5 text-sm text-gray-500">
                      <MapPin className="h-4 w-4 text-gray-400 group-hover:text-[#0247ae] transition-colors duration-500" />
                      <span className="font-medium">{agent.location}</span>
                    </div>

                    {/* Stats */}
                    <div className="mb-5 grid grid-cols-2 gap-4 rounded-2xl bg-gradient-to-br from-gray-50 via-white to-gray-50 p-5 border border-gray-100 group-hover:border-[#0247ae]/20 group-hover:shadow-lg group-hover:shadow-[#0247ae]/5 transition-all duration-500">
                      <div className="text-center">
                        <p className="text-2xl font-bold bg-gradient-to-br from-[#0247ae] to-[#0560d4] bg-clip-text text-transparent">{agent.propertiesSold}</p>
                        <p className="text-xs text-gray-500 font-medium">Sold</p>
                      </div>
                      <div className="text-center border-l border-gray-200">
                        <p className="text-2xl font-bold bg-gradient-to-br from-[#0247ae] to-[#0560d4] bg-clip-text text-transparent">{agent.totalSalesValue.replace("PHP ", "").replace("M", "")}M</p>
                        <p className="text-xs text-gray-500 font-medium">Sales</p>
                      </div>
                    </div>

                    {/* Contact buttons */}
                    <div className="flex gap-3">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 rounded-full border-2 border-[#0247ae]/20 text-[#0247ae] font-semibold hover:bg-[#0247ae]/5 hover:border-[#0247ae]/40 h-11 transition-all duration-500 hover:scale-[1.02]"
                      >
                        <Phone className="mr-1.5 h-4 w-4" />
                        Call
                      </Button>
                      <Button 
                        size="sm" 
                        className="flex-1 rounded-full bg-gradient-to-r from-[#0247ae] via-[#0560d4] to-[#0247ae] hover:from-[#0560d4] hover:via-[#0247ae] hover:to-[#0560d4] font-semibold h-11 shadow-lg shadow-[#0247ae]/25 transition-all duration-500 hover:shadow-xl hover:shadow-[#0247ae]/40 hover:scale-[1.02] bg-[length:200%_100%] hover:bg-[length:100%_100%] overflow-hidden relative group/btn"
                      >
                        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></span>
                        <Mail className="mr-1.5 h-4 w-4 relative" />
                        <span className="relative">Message</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            </div>
          </div>
        </div>

        {/* Carousel indicators */}
        <div className={`mt-10 flex justify-center gap-3 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`h-3 rounded-full transition-all duration-500 hover:scale-125 ${
                index === activeIndex 
                  ? "w-12 bg-gradient-to-r from-[#0247ae] to-[#0560d4] shadow-lg shadow-[#0247ae]/40" 
                  : "w-3 bg-[#0247ae]/20 hover:bg-[#0247ae]/40"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* View all button */}
        <div className={`mt-12 text-center transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <Link href="/agents">
            <Button 
              variant="outline" 
              size="lg"
              className="relative rounded-full border-2 border-[#0247ae] text-[#0247ae] font-bold hover:bg-gradient-to-r hover:from-[#0247ae] hover:to-[#0560d4] hover:text-white hover:border-transparent px-10 h-14 text-base transition-all duration-500 hover:shadow-2xl hover:shadow-[#0247ae]/30 group hover:scale-105 overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 opacity-0 group-hover:opacity-100"></span>
              <span className="relative">View All Agents</span>
              <ChevronRight className="relative ml-2 h-5 w-5 transition-transform duration-500 group-hover:translate-x-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}