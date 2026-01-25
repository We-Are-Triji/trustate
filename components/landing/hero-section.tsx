"use client";

import { useState, useEffect, useCallback } from "react";
import { Star, MapPin, ArrowRight, Phone, MessageCircle, CheckCircle, Video, Mail, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { Agent } from "@/lib/types/landing";

// Stock photos for agents
const agentPhotos = [
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&crop=face", 
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop&crop=face", 
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop&crop=face", 
];

interface HeroSectionProps {
  agents: Agent[];
}

export function HeroSection({ agents }: HeroSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  
  // Guard against undefined agents prop
  const safeAgents = agents || [];
  const topThree = safeAgents.slice(0, 3);
  const activeAgent = topThree[activeIndex] || { 
     name: "Loading...", 
     title: "Agent", 
     location: "Loading...", 
     rank: "#", 
     rating: "5.0",
     propertiesSold: "0",
     totalSalesValue: "0M" 
  };

  const nextSlide = useCallback(() => {
    if (topThree.length > 0) {
      setActiveIndex((prev) => (prev + 1) % topThree.length);
    }
  }, [topThree.length]);

  useEffect(() => {
    const interval = setInterval(nextSlide, 4500);
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <section className="relative overflow-hidden min-h-screen lg:max-h-screen flex items-start md:items-center py-4 md:py-4 lg:py-6 w-full lg:w-screen bg-[#f8faff]">
      {/* INJECTED STYLES FOR ENHANCED ANIMATIONS */}
      <style jsx>{`
        @keyframes fluid-morph {
          0% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; transform: translate(0, 0) rotate(0deg); }
          50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; transform: translate(20px, -20px) rotate(10deg); }
          100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; transform: translate(0, 0) rotate(0deg); }
        }
        @keyframes organic-sway {
          0% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(5px, -10px) rotate(2deg); }
          66% { transform: translate(-5px, 5px) rotate(-1deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }
        @keyframes stardust-move {
          0% { background-position: 0 0; }
          100% { background-position: 1000px 1000px; }
        }
        @keyframes gradient-text-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes cursor-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes scroll-flow-down {
          0% { transform: translateY(-4px); opacity: 0; }
          30% { opacity: 1; }
          80% { opacity: 0; }
          100% { transform: translateY(4px); opacity: 0; }
        }
        @keyframes liquid-aurora {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        
        .fluid-blob {
          animation: fluid-morph 15s ease-in-out infinite;
        }
        .animate-organic-sway {
          animation: organic-sway 8s ease-in-out infinite;
        }
        .stardust-bg {
          background-image: radial-gradient(#0247ae 1px, transparent 1px), radial-gradient(#ffce08 1px, transparent 1px);
          background-size: 50px 50px;
          background-position: 0 0, 25px 25px;
          opacity: 0.15;
          animation: stardust-move 120s linear infinite;
        }
        .clean-gradient-text {
          background: linear-gradient(90deg, #0247ae 0%, #0560d4 25%, #4facfe 50%, #0560d4 75%, #0247ae 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: gradient-text-shift 3s linear infinite;
        }
        .cursor-solid {
          animation: cursor-blink 1s step-end infinite;
        }
        .scroll-arrow-anim {
          animation: scroll-flow-down 2s ease-in-out infinite;
        }
        .vibe-gradient {
          background: linear-gradient(270deg, #0247ae, #40c9ff, #ffce08, #0247ae);
          background-size: 300% 300%;
          animation: liquid-aurora 4s ease infinite;
        }
      `}</style>

      {/* --- LAYER 1: Base Gradient --- */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #f0f4ff 0%, #ffffff 50%, #fffbe6 100%)',
        }}
      />

      {/* --- LAYER 2: Moving Stardust/Grid --- */}
      <div className="absolute inset-0 stardust-bg pointer-events-none" />
      
      {/* --- LAYER 3: 3D Perspective Grid --- */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none overflow-hidden">
        <div 
          className="h-[150%] w-full -mt-20"
          style={{
            backgroundImage: `linear-gradient(rgba(2, 71, 174, 1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(2, 71, 174, 1) 1px, transparent 1px)`,
            backgroundSize: '80px 80px',
            transform: 'perspective(1000px) rotateX(25deg)',
            transformOrigin: 'top center',
            animation: 'stardust-move 60s linear infinite reverse' 
          }}
        />
      </div>

      {/* --- LAYER 4: Fluid Blobs --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
         {/* Top Right - Blue/Purple */}
         <div className="absolute -top-[10%] -right-[10%] w-[50vw] h-[50vw] bg-gradient-to-br from-blue-200/40 to-indigo-200/40 mix-blend-multiply filter blur-[60px] fluid-blob" />
         
         {/* Bottom Left - Yellow/Gold */}
         <div className="absolute -bottom-[10%] -left-[10%] w-[45vw] h-[45vw] bg-gradient-to-tr from-yellow-100/50 to-orange-100/30 mix-blend-multiply filter blur-[60px] fluid-blob" style={{ animationDelay: '-5s' }} />
         
         {/* Center Floating - Cyan */}
         <div className="absolute top-[30%] left-[20%] w-[30vw] h-[30vw] bg-cyan-100/30 mix-blend-multiply filter blur-[50px] fluid-blob" style={{ animationDelay: '-10s' }} />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-6 lg:px-8 w-full pt-12 md:pt-0 md:py-2">
        <div className="grid gap-8 md:gap-8 lg:grid-cols-2 lg:gap-10 items-center md:mt-8 lg:mt-12">
          
          {/* --- LEFT CONTENT --- */}
          <div className="animate-[slideInLeft_0.8s_ease-out] text-center lg:text-left mt-4 md:mt-0">

            {/* Clean Badge */}
            <div className="mb-5 md:mb-6 inline-block animate-[fadeInUp_0.8s_ease-out_both]">
               <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3 py-1.5 bg-[#0247ae]/5 rounded-full border border-[#0247ae]/10">
                 <div className="flex items-center justify-center w-4 h-4 sm:w-4 sm:h-4 rounded-full bg-[#0247ae]">
                   <ShieldCheck className="w-2.5 h-2.5 sm:w-2.5 sm:h-2.5 text-white" />
                 </div>
                 <span className="text-[11px] sm:text-xs font-medium text-[#0247ae] uppercase tracking-wide sm:tracking-wider">
                   Transaction Integrity Layer
                 </span>
               </div>
            </div>
            
            <h1 className="mb-4 md:mb-6 text-[26px] leading-[1.25] sm:text-3xl md:text-4xl font-bold tracking-tight lg:text-5xl md:leading-[1.1]">
              <span className="block text-gray-900">Your Trusted Partner in</span>
              <span className="block mt-1.5 sm:mt-1 md:mt-1 bg-gradient-to-r from-[#0247ae] via-[#0560d4] to-[#0247ae] bg-clip-text text-transparent lg:text-6xl">
                Real Estate Excellence
              </span>
            </h1>
            
            <p className="mb-6 md:mb-8 max-w-xl mx-auto lg:mx-0 text-[14px] sm:text-sm md:text-base leading-[1.6] text-gray-600">
              Ensuring transaction integrity through verified, licensed real estate professionals. Connect with trusted agents and brokers who meet our rigorous standards.
            </p>

            <div className="animate-[fadeInUp_1s_ease-out_0.4s_both] flex justify-center lg:justify-start mb-6 md:mb-0">
              <Link href="/register">
                <Button size="lg" className="relative bg-[#0247ae] hover:bg-[#0560d4] text-white font-semibold shadow-lg shadow-[#0247ae]/25 px-8 sm:px-8 md:px-8 rounded-xl h-[52px] md:h-12 text-[15px] md:text-sm transition-all duration-300 hover:shadow-xl hover:shadow-[#0247ae]/40 hover:scale-[1.02] group">
                  <span className="relative">Get Started</span>
                  <ArrowRight className="relative ml-2 h-4 w-4 transition-all duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>

            {/* Communication ways card */}
            <div className="mt-0 md:mt-10 max-w-md mx-auto lg:mx-0 animate-[fadeInUp_1s_ease-out_0.6s_both]">
              <div className="rounded-[24px] md:rounded-3xl bg-gradient-to-br from-[#0247ae] via-[#0560d4] to-[#0873c9] p-5 md:p-5 shadow-2xl shadow-[#0247ae]/40 hover:shadow-[0_30px_70px_-15px_rgba(2,71,174,0.6)] transition-all duration-700 hover:-translate-y-3 hover:rotate-[0.5deg] border border-white/10 backdrop-blur-sm relative overflow-hidden group/comm">
                {/* Animated background effects within card */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover/comm:opacity-100 transition-opacity duration-700"></div>
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-xl group-hover/comm:animate-pulse"></div>
                
                {/* Grid pattern overlay */}
                <div className="absolute inset-0 opacity-[0.03]">
                  <div 
                    className="h-full w-full"
                    style={{
                      backgroundImage: `linear-gradient(rgba(255, 255, 255, 1) 1px, transparent 1px),
                                     linear-gradient(90deg, rgba(255, 255, 255, 1) 1px, transparent 1px)`,
                      backgroundSize: '20px 20px'
                    }}
                  />
                </div>
                
                <p className="relative mb-4 md:mb-4 text-xs sm:text-xs font-bold text-white/90 uppercase tracking-[0.2em] sm:tracking-widest">Communication Ways</p>
                <div className="relative flex flex-row items-center justify-between gap-0">
                  <div className="flex gap-2.5 sm:gap-2.5">
                    <div className="flex h-12 w-12 sm:h-12 sm:w-12 md:h-12 md:w-12 items-center justify-center rounded-[16px] sm:rounded-2xl md:rounded-2xl bg-white shadow-xl shadow-white/20 cursor-pointer hover:scale-110 hover:-rotate-6 hover:shadow-2xl transition-all duration-500 group/icon">
                      <Video className="h-5 w-5 sm:h-5 sm:w-5 md:h-5 md:w-5 text-[#0247ae] group-hover/icon:scale-110 group-hover/icon:text-[#0560d4] transition-all duration-300" />
                    </div>
                    <div className="flex h-12 w-12 sm:h-12 sm:w-12 md:h-12 md:w-12 items-center justify-center rounded-[16px] sm:rounded-2xl md:rounded-2xl bg-gradient-to-br from-[#ffce08] to-[#f5c000] shadow-xl shadow-[#ffce08]/50 cursor-pointer hover:scale-110 hover:-rotate-6 hover:shadow-2xl hover:shadow-[#ffce08]/60 transition-all duration-500 group/icon">
                      <Phone className="h-5 w-5 sm:h-5 sm:w-5 md:h-5 md:w-5 text-[#0247ae] group-hover/icon:scale-110 transition-all duration-300" />
                    </div>
                    <div className="flex h-12 w-12 sm:h-12 sm:w-12 md:h-12 md:w-12 items-center justify-center rounded-[16px] sm:rounded-2xl md:rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 cursor-pointer hover:scale-110 hover:-rotate-6 transition-all duration-500 hover:bg-white/25 hover:border-white/40 group/icon">
                      <MessageCircle className="h-5 w-5 sm:h-5 sm:w-5 md:h-5 md:w-5 text-white group-hover/icon:scale-110 transition-all duration-300" />
                    </div>
                    <div className="flex h-12 w-12 sm:h-12 sm:w-12 md:h-12 md:w-12 items-center justify-center rounded-[16px] sm:rounded-2xl md:rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 cursor-pointer hover:scale-110 hover:-rotate-6 transition-all duration-500 hover:bg-white/25 hover:border-white/40 group/icon">
                      <Mail className="h-5 w-5 sm:h-5 sm:w-5 md:h-5 md:w-5 text-white group-hover/icon:scale-110 transition-all duration-300" />
                    </div>
                  </div>
                  <div className="text-right ml-2 sm:ml-0">
                    <p className="text-xs sm:text-xs text-white/80 font-medium whitespace-nowrap">Video Call</p>
                    <div className="flex items-center gap-1.5 sm:gap-1.5 mt-1 sm:mt-1 justify-end">
                      <div className="relative h-2.5 w-2.5 sm:h-2.5 sm:w-2.5">
                        <div className="absolute inset-0 rounded-full bg-green-400 animate-[pulse_1.5s_ease-in-out_infinite]" />
                        <div className="absolute inset-0 rounded-full bg-green-400 animate-ping" />
                      </div>
                      <span className="text-[10px] sm:text-[10px] font-bold text-green-300">Online</span>
                    </div>
                  </div>
                </div>
                
                {/* Active users */}
                <div className="relative mt-4 md:mt-4 pt-4 md:pt-4 border-t border-white/20 flex items-center justify-between group/users cursor-pointer hover:border-white/30 transition-colors duration-300">
                  <div className="flex -space-x-2 sm:-space-x-3">
                    <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=face" alt="" className="h-9 w-9 sm:h-9 sm:w-9 md:h-9 md:w-9 rounded-full border-2 border-white object-cover shadow-lg transition-all duration-500 hover:scale-130 hover:z-10 hover:-translate-y-1 hover:border-[#ffce08]" />
                    <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" alt="" className="h-9 w-9 sm:h-9 sm:w-9 md:h-9 md:w-9 rounded-full border-2 border-white object-cover shadow-lg transition-all duration-500 hover:scale-130 hover:z-10 hover:-translate-y-1 hover:border-[#ffce08]" />
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" alt="" className="h-9 w-9 sm:h-9 sm:w-9 md:h-9 md:w-9 rounded-full border-2 border-white object-cover shadow-lg transition-all duration-500 hover:scale-130 hover:z-10 hover:-translate-y-1 hover:border-[#ffce08]" />
                    <div className="h-9 w-9 sm:h-9 sm:w-9 md:h-9 md:w-9 rounded-full bg-gradient-to-br from-[#ffce08] to-[#f5c000] border-2 border-white flex items-center justify-center text-[10px] font-extrabold text-[#0247ae] shadow-lg shadow-[#ffce08]/30 transition-all duration-500 hover:scale-130 hover:rotate-12 hover:z-10 hover:-translate-y-1">
                      +99
                    </div>
                  </div>
                  <div className="transition-transform duration-300 group-hover/users:translate-x-1">
                    <p className="text-xs sm:text-xs font-bold text-white">Active Users</p>
                    <p className="text-[10px] sm:text-[10px] text-white/80 font-medium">Join the community</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* --- RIGHT CONTENT: Featured Agent Card --- */}
          <div className="relative animate-[slideInRight_0.8s_ease-out] mt-8 lg:mt-0">
            
            {/* Chat bubbles with Organic Sway */}
            <div className="absolute -left-4 top-[34%] hidden lg:block z-20 animate-organic-sway" style={{ animationDuration: '6s' }}>
              <div className="relative group/bubble">
                <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-l-[12px] border-l-[#0247ae] transition-all duration-300 group-hover/bubble:border-l-[#0560d4]"></div>
                <div className="rounded-2xl p-4 shadow-2xl shadow-[#0247ae]/30 bg-gradient-to-br from-[#0247ae] to-[#0560d4] hover:shadow-[0_20px_40px_-10px_rgba(2,71,174,0.6)] transition-all duration-500 hover:scale-110 hover:-rotate-2 cursor-pointer group max-w-[200px] overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="flex items-start gap-2 relative">
                    <CheckCircle className="h-5 w-5 text-white flex-shrink-0 mt-0.5 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500" />
                    <div>
                      <p className="text-sm font-bold text-white leading-tight">Verified Agent</p>
                      <p className="text-xs text-white/80 mt-1">Licensed & Trusted</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -right-30 top-[1%] hidden lg:block z-20 animate-organic-sway" style={{ animationDuration: '7s', animationDelay: '1s' }}>
              <div className="relative group/bubble">
                <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-0 h-0 border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent border-r-[12px] border-r-[#ffce08] transition-all duration-300 group-hover/bubble:border-r-[#f5c000]"></div>
                <div className="rounded-2xl p-4 shadow-2xl shadow-[#ffce08]/40 bg-gradient-to-br from-[#ffce08] to-[#f5c000] hover:shadow-[0_20px_40px_-10px_rgba(255,206,8,0.7)] transition-all duration-500 hover:scale-110 hover:rotate-2 cursor-pointer group max-w-[200px] overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="flex items-start gap-2 relative">
                    <Star className="h-5 w-5 text-[#0247ae] flex-shrink-0 mt-0.5 fill-[#0247ae] group-hover:scale-125 group-hover:-rotate-12 transition-all duration-500" />
                    <div>
                      <p className="text-sm font-bold text-[#0247ae] leading-tight">Top Rated</p>
                      <p className="text-xs text-[#0247ae]/80 mt-1">High Ratings</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Main featured card */}
            <div className="relative mx-auto max-w-sm lg:ml-auto lg:mr-8 flex flex-col items-center px-0 md:px-0">
              <div className="overflow-hidden rounded-3xl md:rounded-3xl border-0 bg-white/90 backdrop-blur-xl shadow-2xl hover:shadow-[0_30px_70px_-15px_rgba(0,0,0,0.35)] transition-all duration-700 hover:-translate-y-3 group/card w-full relative">
                  {/* Glassmorphism shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-white/30 opacity-0 group-hover/card:opacity-100 transition-opacity duration-700 pointer-events-none z-10"></div>
                  
                  {/* Card header */}
                  <div className="relative bg-gradient-to-br from-[#0247ae] via-[#0560d4] to-[#0873c9] pt-4 md:pt-5 px-4 md:px-5 pb-12 md:pb-14 overflow-hidden">
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
                    
                    {/* Rank badge */}
                    <div className="absolute left-3 md:left-4 top-3 md:top-4 flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-lg md:rounded-xl bg-gradient-to-br from-[#ffce08] to-[#f5c000] font-bold text-[#0247ae] shadow-lg shadow-[#ffce08]/40 text-base md:text-lg transition-all duration-500 group-hover/card:scale-115 group-hover/card:rotate-12 group-hover/card:shadow-xl group-hover/card:shadow-[#ffce08]/60 z-10">
                      {activeAgent.rank}
                    </div>
                    
                    {/* Rating */}
                    <div className="absolute right-3 md:right-4 top-3 md:top-4 flex items-center gap-1 md:gap-1.5 rounded-full bg-white/20 backdrop-blur-md px-2.5 md:px-3 py-1 md:py-1.5 border border-white/20 group-hover/card:bg-white/30 group-hover/card:border-white/40 transition-all duration-500 z-10">
                      <Star className="h-3.5 w-3.5 md:h-4 md:w-4 fill-[#ffce08] text-[#ffce08] group-hover/card:scale-125 group-hover/card:rotate-12 transition-all duration-500" />
                      <span className="text-xs md:text-sm font-bold text-white">{activeAgent.rating}</span>
                    </div>
                  </div>

                  {/* Profile image */}
                  <div className="relative -mt-10 md:-mt-12 flex justify-center">
                    <div className="relative group/avatar">
                      <div className="h-20 w-20 md:h-24 md:w-24 rounded-full border-3 md:border-4 border-white shadow-xl overflow-hidden transition-all duration-700 group-hover/card:scale-115 group-hover/card:border-[#ffce08] group-hover/card:shadow-2xl group-hover/card:shadow-[#ffce08]/30">
                        <img 
                          src={agentPhotos[activeIndex % agentPhotos.length]} 
                          alt={activeAgent.name}
                          className="h-full w-full object-cover group-hover/card:scale-115 transition-transform duration-700"
                          key={activeIndex}
                        />
                      </div>
                      {/* Online indicator */}
                      <div className="absolute bottom-0 right-0 h-5 w-5 md:h-6 md:w-6 rounded-full border-2 border-white bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center group-hover/card:scale-125 transition-all duration-500 shadow-lg shadow-green-500/50">
                        <div className="absolute inset-0 h-5 w-5 md:h-6 md:w-6 rounded-full bg-green-400 animate-ping opacity-60" />
                        <div className="relative h-2 w-2 md:h-2.5 md:w-2.5 rounded-full bg-white" />
                      </div>
                    </div>
                  </div>

                  {/* Agent info */}
                  <div className="px-4 md:px-5 pb-4 md:pb-5 pt-2 md:pt-3 text-center relative">
                    <h3 className="mb-1 text-base md:text-lg font-bold text-gray-900 group-hover/card:text-[#0247ae] transition-colors duration-500">{activeAgent.name}</h3>
                    <p className="mb-2 text-xs font-medium bg-gradient-to-r from-[#0247ae] to-[#0560d4] bg-clip-text text-transparent">{activeAgent.title}</p>
                    
                    <div className="mb-3 md:mb-4 flex items-center justify-center gap-1.5 text-xs text-gray-500">
                      <MapPin className="h-3.5 w-3.5 md:h-4 md:w-4 text-gray-400 group-hover/card:text-[#0247ae] transition-colors duration-500" />
                      <span className="font-medium">{activeAgent.location}</span>
                    </div>

                    {/* Stats */}
                    <div className="mb-3 md:mb-4 grid grid-cols-2 gap-2 md:gap-3 rounded-xl md:rounded-2xl bg-gradient-to-br from-gray-50 via-white to-gray-50 p-3 md:p-4 border border-gray-100 group-hover/card:border-[#0247ae]/20 group-hover/card:shadow-lg group-hover/card:shadow-[#0247ae]/5 transition-all duration-500">
                      <div className="text-center">
                        <p className="text-lg md:text-xl font-bold bg-gradient-to-br from-[#0247ae] to-[#0560d4] bg-clip-text text-transparent">{activeAgent.propertiesSold}</p>
                        <p className="text-[10px] text-gray-500 font-medium">Sold</p>
                      </div>
                      <div className="text-center border-l border-gray-200">
                        <p className="text-lg md:text-xl font-bold bg-gradient-to-br from-[#0247ae] to-[#0560d4] bg-clip-text text-transparent">{activeAgent.totalSalesValue.replace("PHP ", "").replace("M", "")}M</p>
                        <p className="text-[10px] text-gray-500 font-medium">Sales</p>
                      </div>
                    </div>

                    {/* Contact button */}
                    <Button className="w-full rounded-full bg-gradient-to-r from-[#0247ae] via-[#0560d4] to-[#0247ae] hover:from-[#0560d4] hover:via-[#0247ae] hover:to-[#0560d4] font-semibold h-10 md:h-11 text-xs md:text-sm shadow-lg shadow-[#0247ae]/25 transition-all duration-500 hover:shadow-xl hover:shadow-[#0247ae]/40 hover:scale-[1.03] group bg-[length:200%_100%] hover:bg-[length:100%_100%] overflow-hidden relative">
                      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                      <span className="relative">Contact Agent</span>
                      <ArrowRight className="relative ml-1.5 md:ml-2 h-4 w-4 md:h-5 md:w-5 transition-all duration-500 group-hover:translate-x-2" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Carousel indicators */}
              <div className="mt-4 md:mt-5 flex justify-center gap-2 md:gap-3">
                {topThree.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveIndex(index)}
                    className={`h-2 md:h-3 rounded-full transition-all duration-500 hover:scale-125 ${
                      index === activeIndex 
                        ? "w-8 md:w-10 bg-gradient-to-r from-[#0247ae] to-[#0560d4] shadow-lg shadow-[#0247ae]/40" 
                        : "w-2 md:w-3 bg-gray-300/80 hover:bg-[#0247ae]/50"
                    }`}
                    aria-label={`View agent ${index + 1}`}
                  />
                ))}
              </div>
          </div>
        </div>
      </div>

      {/* --- SCROLL INDICATOR (IMPROVED) --- */}
      <div className="absolute bottom-4 md:bottom-8 right-4 md:right-8 z-40 hidden lg:flex flex-col items-center gap-3 animate-[fadeIn_1s_ease-out_1.2s_both]">
        {/* Glass container for text */}
        <div className="py-4 px-2 rounded-full bg-white/30 backdrop-blur-sm border border-white/40 shadow-lg shadow-blue-900/5 hover:bg-white/50 transition-colors duration-300 cursor-pointer group">
           <span className="text-[10px] font-bold tracking-[0.2em] uppercase bg-gradient-to-b from-[#0247ae] to-[#40c9ff] bg-clip-text text-transparent [writing-mode:vertical-rl] rotate-180 group-hover:tracking-[0.25em] transition-all duration-300">
            Scroll to explore
          </span>
        </div>
        
        {/* Animated Arrows Container */}
        <div className="relative flex flex-col -space-y-1 pt-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="relative scroll-arrow-anim"
              style={{ 
                animationDelay: `${i * 0.3}s` 
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0247ae" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="opacity-80 drop-shadow-sm">
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </div>
          ))}
        </div>
        
        {/* Decorative Line */}
        <div className="w-[1.5px] h-12 bg-gradient-to-b from-[#0247ae] to-transparent rounded-full opacity-40" />
      </div>
    </section>
  );
}