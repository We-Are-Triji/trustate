"use client";

import { useState, useEffect, useCallback } from "react";
import { Star, MapPin, Trophy, ArrowRight, Phone, MessageCircle, CheckCircle, Video, Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Agent } from "@/lib/types/landing";

// Stock photos for agents - matched to agent names by gender
// Order: Maria Santos (F), Juan Dela Cruz (M), Angela Reyes (F)
const agentPhotos = [
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&crop=face", // Female - Maria Santos
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop&crop=face", // Male - Juan Dela Cruz
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop&crop=face", // Female - Angela Reyes
];

interface HeroSectionProps {
  agents: Agent[];
}

export function HeroSection({ agents }: HeroSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const topThree = agents.slice(0, 3);

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % topThree.length);
  }, [topThree.length]);

  useEffect(() => {
    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  const activeAgent = topThree[activeIndex];

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-[#e8e4f5] via-[#f5f3fa] to-[#fefcf0]">
      {/* Background decorative elements - strategically placed */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Yellow blob top right */}
        <div className="absolute -right-20 -top-20 h-[500px] w-[400px] rounded-[40%_60%_70%_30%/40%_50%_60%_50%] bg-[#ffce08]/20 blur-3xl" />
        {/* Blue blob left */}
        <div className="absolute -left-32 top-1/4 h-[400px] w-[300px] rounded-[60%_40%_30%_70%/60%_30%_70%_40%] bg-[#0247ae]/10 blur-3xl" />
        
        {/* Single decorative circle - top left */}
        <div className="absolute left-[8%] top-[25%] h-48 w-48 rounded-full border-2 border-dashed border-[#0247ae]/10" />
        
        {/* Grid dots pattern - bottom left corner */}
        <div className="absolute left-[3%] bottom-[10%] grid grid-cols-4 gap-2">
          {[...Array(16)].map((_, i) => (
            <div key={i} className="h-1.5 w-1.5 rounded-full bg-[#0247ae]/15" />
          ))}
        </div>
        
        {/* Grid dots pattern - top right corner */}
        <div className="absolute right-[3%] top-[10%] grid grid-cols-4 gap-2">
          {[...Array(16)].map((_, i) => (
            <div key={i} className="h-1.5 w-1.5 rounded-full bg-[#ffce08]/30" />
          ))}
        </div>
      </div>

      {/* Strategic accent dots - corners only */}
      <div className="absolute left-[3%] top-[15%] h-3 w-3 rounded-full bg-[#ffce08] shadow-lg shadow-[#ffce08]/50" />
      <div className="absolute left-[5%] top-[18%] h-2 w-2 rounded-full bg-[#0247ae]/60" />
      <div className="absolute right-[3%] bottom-[15%] h-3 w-3 rounded-full bg-[#0247ae] shadow-lg shadow-[#0247ae]/50" />
      <div className="absolute right-[5%] bottom-[18%] h-2 w-2 rounded-full bg-[#ffce08]/60" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-28 pb-16 sm:px-6 sm:pt-36 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          {/* Left content */}
          <div className="animate-[slideInLeft_0.8s_ease-out]">

            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#ffce08]/20 px-5 py-2.5 border border-[#ffce08]/30">
              <span className="h-2 w-2 rounded-full bg-[#ffce08] animate-pulse" />
              <span className="text-sm font-semibold text-[#0247ae] tracking-wide">The Transaction Integrity Layer</span>
            </div>
            
            <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl font-[family-name:var(--font-arsenal-sc)]">
              <span className="text-gray-900">Trusted Real Estate</span>
              <span className="block text-[#0247ae] mt-2">Platform</span>
            </h1>
            
            <p className="mb-10 max-w-xl text-lg leading-relaxed text-gray-600">
              Connect with verified agents and discover premium properties across the Philippines. Your journey to finding the perfect property starts here.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="/register">
                <Button size="lg" className="bg-[#ffce08] text-[#0247ae] font-bold hover:bg-[#e6b800] shadow-lg shadow-[#ffce08]/30 px-8 rounded-full h-12 text-base">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="#how-it-works">
                <Button size="lg" variant="outline" className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 px-8 rounded-full h-12 text-base font-semibold">
                  How It Works
                </Button>
              </Link>
            </div>

            {/* Communication ways card - blue gradient style */}
            <div className="mt-14 max-w-md">
              <div className="rounded-3xl bg-gradient-to-br from-[#0247ae] to-[#0560d4] p-6 shadow-xl shadow-[#0247ae]/30">
                <p className="mb-4 text-sm font-semibold text-white/80 uppercase tracking-wider">Communication Ways</p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-lg cursor-pointer hover:scale-110 transition-transform">
                      <Video className="h-5 w-5 text-[#0247ae]" />
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ffce08] shadow-lg shadow-[#ffce08]/30 cursor-pointer hover:scale-110 transition-transform">
                      <Phone className="h-5 w-5 text-[#0247ae]" />
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm cursor-pointer hover:scale-110 transition-transform">
                      <MessageCircle className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm cursor-pointer hover:scale-110 transition-transform">
                      <Mail className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-white/70">Video Call</p>
                    <div className="flex items-center gap-1 mt-1">
                      <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                      <span className="text-xs font-medium text-green-300">Online</span>
                    </div>
                  </div>
                </div>
                
                {/* Active users */}
                <div className="mt-5 pt-5 border-t border-white/20 flex items-center justify-between">
                  <div className="flex -space-x-3">
                    <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face" alt="" className="h-9 w-9 rounded-full border-2 border-white object-cover" />
                    <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" alt="" className="h-9 w-9 rounded-full border-2 border-white object-cover" />
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" alt="" className="h-9 w-9 rounded-full border-2 border-white object-cover" />
                    <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face" alt="" className="h-9 w-9 rounded-full border-2 border-white object-cover" />
                    <div className="h-9 w-9 rounded-full bg-[#ffce08] border-2 border-white flex items-center justify-center text-xs font-bold text-[#0247ae]">
                      +99
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Active Users</p>
                    <p className="text-xs text-white/70">Join the community</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right content - Featured Agent Card with circular frame */}
          <div className="relative animate-[slideInRight_0.8s_ease-out]">
            {/* Large circular progress ring */}
            <div className="absolute -right-4 top-0 h-[400px] w-[400px] hidden lg:block">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="2" />
                <circle cx="50" cy="50" r="45" fill="none" stroke="#ffce08" strokeWidth="3" strokeLinecap="round" strokeDasharray="200 283" className="animate-[spin_20s_linear_infinite]" />
                <circle cx="50" cy="50" r="38" fill="none" stroke="#0247ae" strokeWidth="2" strokeLinecap="round" strokeDasharray="150 239" className="animate-[spin_15s_linear_infinite_reverse]" />
              </svg>
            </div>
            
            {/* Floating verified badge - left of card */}
            <div className="absolute -left-6 top-[20%] hidden lg:block z-20 animate-[float_4s_ease-in-out_infinite]">
              <div className="relative rounded-2xl p-4 shadow-2xl bg-[#0247ae]">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Verified Agent</p>
                    <p className="text-xs text-white/70">Licensed & Trusted</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Main featured card */}
            <div className="relative mx-auto max-w-sm lg:ml-auto lg:mr-8">
              <Card className="overflow-hidden rounded-3xl border-0 bg-white shadow-2xl">
                <CardContent className="p-0">
                  {/* Agent image area with circular frame */}
                  <div className="relative bg-gradient-to-br from-[#0247ae] to-[#0560d4] p-8 pb-40">
                    <div className="absolute right-4 top-4 rounded-full bg-white/20 backdrop-blur-sm px-4 py-1.5">
                      <span className="text-xs font-bold text-white tracking-wide">Featured</span>
                    </div>
                    
                    {/* Circular image frame with ring */}
                    <div className="relative mx-auto h-36 w-36">
                      {/* Outer animated ring */}
                      <div className="absolute -inset-3">
                        <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(255,206,8,0.3)" strokeWidth="2" />
                          <circle cx="50" cy="50" r="48" fill="none" stroke="#ffce08" strokeWidth="3" strokeLinecap="round" strokeDasharray="200 302" />
                        </svg>
                      </div>
                      <div className="absolute inset-0 rounded-full border-4 border-[#ffce08]" />
                      <img 
                        src={agentPhotos[activeIndex % agentPhotos.length]} 
                        alt={activeAgent.name}
                        className="h-full w-full rounded-full object-cover"
                      />
                      {/* Rank badge */}
                      <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-[#ffce08] text-lg font-bold text-[#0247ae] shadow-lg ring-4 ring-white">
                        #{activeAgent.rank}
                      </div>
                    </div>
                  </div>

                  {/* Agent info */}
                  <div className="relative -mt-4 rounded-t-3xl bg-white px-6 pb-6 pt-10">
                    <div className="mb-4 text-center">
                      <h3 className="text-xl font-bold text-gray-900">{activeAgent.name}</h3>
                      <p className="text-sm font-medium text-[#0247ae]">{activeAgent.title}</p>
                    </div>

                    <div className="mb-4 flex items-center justify-center gap-2 text-sm text-gray-600">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">{activeAgent.location}</span>
                    </div>

                    <div className="mb-6 flex items-center justify-center gap-2">
                      <Star className="h-5 w-5 fill-[#ffce08] text-[#ffce08]" />
                      <span className="font-bold text-gray-900">{activeAgent.rating}</span>
                      <span className="text-gray-500">({activeAgent.reviewCount} reviews)</span>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 rounded-2xl bg-gray-50 p-4 mb-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-[#0247ae]">{activeAgent.propertiesSold}</p>
                        <p className="text-xs font-medium text-gray-500">Properties Sold</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-[#0247ae]">{activeAgent.totalSalesValue.replace("PHP ", "")}</p>
                        <p className="text-xs font-medium text-gray-500">Total Sales</p>
                      </div>
                    </div>

                    {/* Contact button */}
                    <Button className="w-full rounded-full bg-[#0247ae] hover:bg-[#023a8a] h-12 text-base font-semibold">
                      Contact Agent
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Carousel indicators */}
              <div className="mt-6 flex justify-center gap-2">
                {topThree.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      index === activeIndex 
                        ? "w-8 bg-[#0247ae]" 
                        : "w-2.5 bg-gray-300 hover:bg-gray-400"
                    }`}
                    aria-label={`View agent ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Top performer badge - top right of card */}
            <div className="absolute -right-4 -top-6 hidden lg:block z-20 animate-[float_3.5s_ease-in-out_infinite_0.5s]">
              <div className="relative rounded-2xl p-4 shadow-2xl bg-[#ffce08]">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/90">
                    <Trophy className="h-5 w-5 text-[#d4a800]" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#0247ae]">Top Performer</p>
                    <p className="text-xs text-[#0247ae]/70">This Month</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Agents online badge - bottom left of card */}
            <div className="absolute -left-8 bottom-16 hidden lg:block z-20 animate-[float_4.5s_ease-in-out_infinite_0.3s]">
              <div className="rounded-2xl bg-[#ffce08] px-4 py-3 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face" alt="" className="h-7 w-7 rounded-full border-2 border-white object-cover" />
                    <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face" alt="" className="h-7 w-7 rounded-full border-2 border-white object-cover" />
                    <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" alt="" className="h-7 w-7 rounded-full border-2 border-white object-cover" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#0247ae]">+50 online</span>
                    <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
