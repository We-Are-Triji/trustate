"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Star, MapPin, ChevronRight, ChevronLeft, Phone, Mail, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Agent } from "@/lib/types/landing";

// Stock photos for agents - matched to agent names by gender
// Order: Maria (F), Juan (M), Angela (F), Carlos (M), Patricia (F), Roberto (M)
const agentPhotos = [
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&crop=face", // Female - Maria Santos
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop&crop=face", // Male - Juan Dela Cruz
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop&crop=face", // Female - Angela Reyes
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face", // Male - Carlos Mendoza
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face", // Female - Patricia Lim
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face", // Male - Roberto Garcia
];

interface AgentListSectionProps {
  agents: Agent[];
}

export function AgentListSection({ agents }: AgentListSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const displayAgents = agents.slice(0, 6);
  const itemsPerView = 3;
  const maxIndex = Math.max(0, displayAgents.length - itemsPerView);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
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

  // Auto-slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <section 
      ref={sectionRef}
      className="relative bg-gradient-to-b from-white via-[#f8f9ff] to-[#f5f7ff] py-24 overflow-x-clip"
    >
      {/* Decorative elements */}
      <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-[#ffce08]/10 to-transparent blur-3xl" />
      <div className="absolute left-0 bottom-0 h-[400px] w-[400px] rounded-full bg-gradient-to-tr from-[#0247ae]/10 to-transparent blur-3xl" />
      
      {/* Animated circles */}
      <div className="absolute right-[10%] top-[15%] h-32 w-32 rounded-full border-2 border-dashed border-[#ffce08]/20 animate-[spin_50s_linear_infinite]" />
      <div className="absolute left-[8%] bottom-[20%] h-24 w-24 rounded-full border-2 border-[#0247ae]/10 animate-[spin_40s_linear_infinite_reverse]" />
      
      {/* Floating dots */}
      <div className="absolute left-[15%] top-[30%] h-3 w-3 rounded-full bg-[#ffce08] animate-[float_4s_ease-in-out_infinite]" />
      <div className="absolute right-[20%] top-[25%] h-2 w-2 rounded-full bg-[#0247ae]/40 animate-[float_3s_ease-in-out_infinite_0.5s]" />
      <div className="absolute left-[25%] bottom-[35%] h-4 w-4 rounded-full bg-[#ffce08]/30 animate-[float_5s_ease-in-out_infinite_1s]" />
      
      {/* Dot patterns */}
      <div className="absolute left-[5%] top-[20%] grid grid-cols-4 gap-2">
        {[...Array(16)].map((_, i) => (
          <div key={i} className="h-1.5 w-1.5 rounded-full bg-[#0247ae]/10" />
        ))}
      </div>
      <div className="absolute right-[8%] bottom-[15%] grid grid-cols-3 gap-2">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="h-1.5 w-1.5 rounded-full bg-[#ffce08]/30" />
        ))}
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className={`mb-14 flex flex-col items-center justify-between gap-6 sm:flex-row transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#ffce08]/20 to-[#ffce08]/10 px-5 py-2.5 border border-[#ffce08]/20">
              <Award className="h-4 w-4 text-[#d4a800]" />
              <span className="text-sm font-semibold text-[#0247ae] tracking-wide">Top Performers</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">
              Find Partners
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
              className="h-14 w-14 rounded-full border-2 border-[#0247ae]/20 hover:bg-[#0247ae] hover:border-[#0247ae] hover:text-white transition-all duration-300 group"
            >
              <ChevronLeft className="h-6 w-6 text-[#0247ae] group-hover:text-white transition-colors" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={nextSlide}
              className="h-14 w-14 rounded-full border-2 border-[#0247ae]/20 hover:bg-[#0247ae] hover:border-[#0247ae] hover:text-white transition-all duration-300 group"
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
                key={agent.id}
                className={`w-[calc(33.333%-16px)] flex-shrink-0 overflow-hidden rounded-3xl border-0 bg-white shadow-xl transition-all duration-700 hover:shadow-2xl hover:-translate-y-3 group p-0 gap-0 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}
                style={{ transitionDelay: `${200 + index * 100}ms` }}
              >
                <CardContent className="p-0">
                  {/* Card header with gradient */}
                  <div className="relative bg-gradient-to-br from-[#0247ae] via-[#0560d4] to-[#0873c9] pt-6 px-6 pb-16 overflow-hidden">
                    {/* Animated background pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-white -translate-y-1/2 translate-x-1/2 animate-[float_6s_ease-in-out_infinite]" />
                      <div className="absolute left-0 bottom-0 h-32 w-32 rounded-full bg-white translate-y-1/2 -translate-x-1/2 animate-[float_5s_ease-in-out_infinite_1s]" />
                    </div>
                    
                    {/* Rank badge */}
                    <div className="absolute left-4 top-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#ffce08] to-[#f5c000] font-bold text-[#0247ae] shadow-lg text-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                      #{agent.rank}
                    </div>
                    
                    {/* Rating */}
                    <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur-sm px-3 py-1.5 border border-white/10">
                      <Star className="h-4 w-4 fill-[#ffce08] text-[#ffce08]" />
                      <span className="text-sm font-bold text-white">{agent.rating}</span>
                    </div>
                  </div>

                  {/* Profile image - overlapping */}
                  <div className="relative -mt-14 flex justify-center">
                    <div className="relative group/avatar">
                      <div className="h-28 w-28 rounded-full border-4 border-white shadow-xl overflow-hidden transition-transform duration-300 group-hover:scale-105">
                        <img 
                          src={agentPhotos[index % agentPhotos.length]} 
                          alt={agent.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      {/* Online indicator with pulse */}
                      <div className="absolute bottom-1 right-1 h-6 w-6 rounded-full border-3 border-white bg-green-500 flex items-center justify-center">
                        <div className="h-3 w-3 rounded-full bg-green-400 animate-ping" />
                      </div>
                    </div>
                  </div>

                  {/* Agent info */}
                  <div className="px-6 pb-6 pt-4 text-center">
                    <h3 className="mb-1 text-xl font-bold text-gray-900 group-hover:text-[#0247ae] transition-colors">{agent.name}</h3>
                    <p className="mb-3 text-sm font-medium text-[#0247ae]">{agent.specialization}</p>
                    
                    <div className="mb-5 flex items-center justify-center gap-1.5 text-sm text-gray-500">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">{agent.location}</span>
                    </div>

                    {/* Stats */}
                    <div className="mb-5 grid grid-cols-2 gap-4 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100/50 p-5 border border-gray-100">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-[#0247ae]">{agent.propertiesSold}</p>
                        <p className="text-xs text-gray-500 font-medium">Sold</p>
                      </div>
                      <div className="text-center border-l border-gray-200">
                        <p className="text-2xl font-bold text-[#0247ae]">{agent.totalSalesValue.replace("PHP ", "").replace("M", "")}M</p>
                        <p className="text-xs text-gray-500 font-medium">Sales</p>
                      </div>
                    </div>

                    {/* Contact buttons */}
                    <div className="flex gap-3">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 rounded-full border-2 border-[#0247ae]/20 text-[#0247ae] font-semibold hover:bg-[#0247ae]/10 hover:border-[#0247ae]/30 h-11 transition-all duration-300"
                      >
                        <Phone className="mr-1.5 h-4 w-4" />
                        Call
                      </Button>
                      <Button 
                        size="sm" 
                        className="flex-1 rounded-full bg-gradient-to-r from-[#0247ae] to-[#0560d4] hover:from-[#023a8a] hover:to-[#0247ae] font-semibold h-11 shadow-lg shadow-[#0247ae]/20 transition-all duration-300 hover:shadow-xl hover:shadow-[#0247ae]/30"
                      >
                        <Mail className="mr-1.5 h-4 w-4" />
                        Message
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
        <div className={`mt-10 flex justify-center gap-2 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`h-2.5 rounded-full transition-all duration-500 ${
                index === activeIndex 
                  ? "w-10 bg-gradient-to-r from-[#0247ae] to-[#0560d4]" 
                  : "w-2.5 bg-[#0247ae]/20 hover:bg-[#0247ae]/40"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* View all button */}
        <div className={`mt-12 text-center transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <Button 
            variant="outline" 
            size="lg"
            className="rounded-full border-2 border-[#0247ae] text-[#0247ae] font-bold hover:bg-[#0247ae] hover:text-white px-10 h-14 text-base transition-all duration-300 hover:shadow-xl hover:shadow-[#0247ae]/20 group"
          >
            View All Agents
            <ChevronRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </section>
  );
}
