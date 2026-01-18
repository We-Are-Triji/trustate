"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Sparkles, ArrowRight, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Partner, FooterSection } from "@/lib/types/landing";
import trustateLogo from "@/app/assets/trustate.png";

interface LandingFooterProps {
  partners: Partner[];
  sections: FooterSection[];
}

// Partner logo component - plain style with logo image and name
function PartnerLogo({ partner }: { partner: Partner }) {
  return (
    <div className="flex-shrink-0 px-8 group cursor-pointer">
      <div className="flex items-center gap-3 transition-all duration-500 hover:scale-110 opacity-60 hover:opacity-100">
        <Image
          src={partner.logo}
          alt={`${partner.name} logo`}
          width={36}
          height={36}
          className="object-contain grayscale group-hover:grayscale-0 transition-all duration-500 flex-shrink-0"
          unoptimized
        />
        <span className="text-sm font-semibold text-gray-600 whitespace-nowrap group-hover:text-[#0247ae] transition-colors duration-500">
          {partner.name}
        </span>
      </div>
    </div>
  );
}

export function LandingFooter({ partners, sections }: LandingFooterProps) {
  // Double the partners array for seamless infinite scroll
  const duplicatedPartners = [...partners, ...partners];

  return (
    <footer className="relative overflow-hidden">
      {/* Partners section with infinite carousel */}
      <div className="relative py-20 overflow-hidden">
        {/* Animated background */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, #ffffff 0%, #f8f9ff 30%, #f5f7ff 70%, #ffffff 100%)',
          }}
        />
        
        {/* Animated gradient overlay */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: 'radial-gradient(ellipse at 30% 50%, rgba(2, 71, 174, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 70% 50%, rgba(255, 206, 8, 0.1) 0%, transparent 50%)',
            animation: 'meshMove 20s ease-in-out infinite'
          }}
        />

        {/* Grid pattern */}
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

        {/* Decorative elements */}
        <div className="absolute left-[5%] top-[20%] h-40 w-40 rounded-full border-2 border-dashed border-[#0247ae]/10 animate-[spin_50s_linear_infinite] pointer-events-none" />
        <div className="absolute right-[8%] bottom-[15%] h-32 w-32 rounded-full bg-[#ffce08]/8 animate-[float_6s_ease-in-out_infinite] pointer-events-none" />
        <div className="absolute left-[15%] bottom-[30%] h-12 w-12 rounded-full bg-[#0247ae]/5 animate-[float_5s_ease-in-out_infinite_0.5s] pointer-events-none" />
        <div className="absolute right-[20%] top-[25%] h-8 w-8 rounded-full border border-[#ffce08]/20 animate-[float_4s_ease-in-out_infinite_1s] pointer-events-none" />
        
        {/* Floating dots with glow */}
        <div className="absolute left-[10%] top-[15%] h-3 w-3 rounded-full bg-gradient-to-br from-[#ffce08] to-[#f5c000] shadow-lg shadow-[#ffce08]/50 animate-[float_4s_ease-in-out_infinite] pointer-events-none" />
        <div className="absolute right-[12%] top-[20%] h-3 w-3 rounded-full bg-gradient-to-br from-[#0247ae] to-[#0560d4] shadow-lg shadow-[#0247ae]/50 animate-[float_5s_ease-in-out_infinite_0.5s] pointer-events-none" />
        
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            {/* Our Partners Badge - Matching Simple Process style */}
            <div className="mb-8 inline-block">
              <div className="relative group">
                {/* The Glow Aura */}
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#0247ae] to-[#0560d4] blur opacity-25 group-hover:opacity-60 transition duration-500"></div>
                
                {/* The Glass Container */}
                <div className="relative flex items-center gap-3 px-6 py-2 bg-white/80 backdrop-blur-xl rounded-full border border-white/50 shadow-sm overflow-hidden">
                  {/* Moving Shine Effect on surface */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/80 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                  
                  <div className="relative flex items-center justify-center w-5 h-5 rounded-full bg-[#0247ae] text-white">
                    <Sparkles className="w-3 h-3" />
                  </div>
                  <span className="text-sm font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#0247ae] to-[#0560d4] uppercase">
                    Our Partners
                  </span>
                </div>
              </div>
            </div>
            
            <h3 className="mb-3 text-3xl font-bold sm:text-4xl">
              <span className="bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent">Trusted by </span>
              <span className="bg-gradient-to-r from-[#0247ae] to-[#0560d4] bg-clip-text text-transparent">Leading Developers</span>
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Our platform partners with the Philippines&apos; top real estate developers
            </p>
          </div>
        </div>

        {/* Single line infinite scrolling carousel */}
        <div className="relative py-6">
          {/* Gradient overlays for smooth fade effect */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white via-white/90 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white via-white/90 to-transparent z-10 pointer-events-none" />
          
          {/* Single row - scrolling left */}
          <div className="flex overflow-hidden">
            <div className="flex animate-marquee-left items-center gap-0">
              {duplicatedPartners.map((partner, index) => (
                <PartnerLogo key={`row1-${partner.id}-${index}`} partner={partner} />
              ))}
            </div>
            <div className="flex animate-marquee-left items-center gap-0" aria-hidden="true">
              {duplicatedPartners.map((partner, index) => (
                <PartnerLogo key={`row1-dup-${partner.id}-${index}`} partner={partner} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter section - enhanced */}
      <div className="relative overflow-hidden">
        {/* Animated gradient background */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, #0247ae 0%, #0560d4 25%, #0873c9 50%, #0560d4 75%, #0247ae 100%)',
            backgroundSize: '400% 400%',
            animation: 'gradientShift 15s ease infinite'
          }}
        />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.05]">
          <div 
            className="h-full w-full"
            style={{
              backgroundImage: `linear-gradient(rgba(255, 255, 255, 1) 1px, transparent 1px),
                               linear-gradient(90deg, rgba(255, 255, 255, 1) 1px, transparent 1px)`,
              backgroundSize: '40px 40px'
            }}
          />
        </div>

        {/* Animated wave at top */}
        <svg 
          className="absolute top-0 left-0 w-full h-16 -translate-y-[98%]" 
          viewBox="0 0 800 64" 
          preserveAspectRatio="none"
        >
          <path
            d="M0 64 Q200 20 400 40 Q600 60 800 30 L800 64 L0 64 Z"
            fill="#0247ae"
          />
        </svg>

        {/* Floating elements */}
        <div className="absolute left-[5%] top-[20%] h-20 w-20 rounded-full bg-white/5 animate-[float_5s_ease-in-out_infinite] pointer-events-none" />
        <div className="absolute right-[8%] bottom-[20%] h-16 w-16 rounded-full border border-white/10 animate-[float_4s_ease-in-out_infinite_0.5s] pointer-events-none" />
        <div className="absolute left-[20%] bottom-[30%] h-10 w-10 rounded-full bg-[#ffce08]/10 animate-[float_4.5s_ease-in-out_infinite_1s] pointer-events-none" />
        <div className="absolute right-[25%] top-[30%] h-8 w-8 rounded-full bg-white/8 animate-[float_5s_ease-in-out_infinite_0.8s] pointer-events-none" />
        
        <div className="relative z-10 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            {/* Newsletter Badge - Matching Simple Process style */}
            <div className="mb-8 inline-block">
              <div className="relative group">
                {/* The Glow Aura */}
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-white/50 to-white/30 blur opacity-25 group-hover:opacity-60 transition duration-500"></div>
                
                {/* The Glass Container */}
                <div className="relative flex items-center gap-3 px-6 py-2 bg-white/20 backdrop-blur-xl rounded-full border border-white/30 shadow-sm overflow-hidden">
                  {/* Moving Shine Effect on surface */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                  
                  <div className="relative flex items-center justify-center w-5 h-5 rounded-full bg-white text-[#0247ae]">
                    <Mail className="w-3 h-3" />
                  </div>
                  <span className="text-sm font-black tracking-wide text-white uppercase">
                    Newsletter
                  </span>
                </div>
              </div>
            </div>
            
            <h3 className="mb-3 text-2xl font-bold text-white sm:text-4xl">
              Stay Updated
            </h3>
            <p className="mb-8 text-white/80 text-lg max-w-xl mx-auto">
              Get updates on verified agents, platform features, and real estate industry insights
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center max-w-lg mx-auto">
              <div className="relative flex-1">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50" />
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="h-14 rounded-full border-white/20 bg-white/10 backdrop-blur-md pl-12 pr-6 text-white placeholder:text-white/50 focus:bg-white/20 focus:border-white/40 transition-all duration-300 w-full"
                />
              </div>
              <Button className="h-14 rounded-full bg-gradient-to-r from-[#ffce08] to-[#f5c000] px-8 font-bold text-[#0247ae] hover:from-[#f5c000] hover:to-[#ffce08] shadow-xl shadow-[#ffce08]/30 transition-all duration-500 hover:shadow-2xl hover:shadow-[#ffce08]/50 hover:scale-105 group overflow-hidden relative">
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                <span className="relative">Subscribe</span>
                <Send className="relative ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer - enhanced */}
      <div className="relative bg-gray-900 px-4 py-16 sm:px-6 sm:py-20 lg:px-8 overflow-hidden">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950" />
        
        {/* Decorative elements */}
        <div className="absolute right-[10%] top-[15%] h-40 w-40 rounded-full bg-[#0247ae]/5 blur-3xl pointer-events-none" />
        <div className="absolute left-[5%] bottom-[20%] h-32 w-32 rounded-full bg-[#ffce08]/5 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="mb-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
            {/* Brand column */}
            <div className="lg:col-span-1">
              <Link href="/" className="mb-6 inline-block group">
                <Image
                  src={trustateLogo}
                  alt="TruState"
                  width={140}
                  height={45}
                  className="brightness-0 invert transition-transform duration-300 group-hover:scale-105"
                />
              </Link>
              <p className="mb-6 text-sm text-gray-400 leading-relaxed">
                Your trusted partner in Philippine real estate. The Transaction Integrity Layer connecting clients with verified, licensed agents and brokers.
              </p>
              <div className="flex gap-3">
                {[
                  { icon: Facebook, label: 'Facebook' },
                  { icon: Twitter, label: 'Twitter' },
                  { icon: Instagram, label: 'Instagram' },
                  { icon: Linkedin, label: 'LinkedIn' },
                ].map(({ icon: Icon, label }) => (
                  <a 
                    key={label}
                    href="#" 
                    aria-label={label}
                    className="flex h-11 w-11 items-center justify-center rounded-full bg-white/5 text-white transition-all duration-500 hover:bg-gradient-to-br hover:from-[#ffce08] hover:to-[#f5c000] hover:text-[#0247ae] hover:scale-110 hover:shadow-lg hover:shadow-[#ffce08]/20 group/social"
                  >
                    <Icon className="h-5 w-5 transition-transform duration-300 group-hover/social:scale-110" />
                  </a>
                ))}
              </div>
            </div>

            {/* Link columns */}
            {sections.map((section, sectionIndex) => (
              <div key={section.title}>
                <h4 className="mb-5 font-bold text-white text-lg">
                  {section.title}
                </h4>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="group/link flex items-center text-sm text-gray-400 transition-all duration-300 hover:text-[#ffce08] hover:translate-x-1"
                      >
                        <ArrowRight className="h-3 w-3 mr-2 opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all duration-300" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Contact info */}
          <div className="mb-10 flex flex-wrap justify-center gap-8 border-t border-white/10 pt-10 text-sm text-gray-400">
            {[
              { icon: Mail, text: 'support@trustate.ph' },
              { icon: Phone, text: '+63 (2) 8888-7777' },
              { icon: MapPin, text: 'Makati City, Philippines' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2.5 group/contact cursor-pointer hover:text-white transition-colors duration-300">
                <div className="p-2 rounded-full bg-[#ffce08]/10 group-hover/contact:bg-[#ffce08]/20 transition-colors duration-300">
                  <Icon className="h-4 w-4 text-[#ffce08]" />
                </div>
                <span>{text}</span>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Trustate. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              {['Privacy', 'Terms', 'Cookies'].map((item) => (
                <Link 
                  key={item}
                  href={`/${item.toLowerCase()}`} 
                  className="text-sm text-gray-500 hover:text-[#ffce08] transition-all duration-300 hover:underline underline-offset-4"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
