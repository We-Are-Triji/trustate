"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Sparkles } from "lucide-react";
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
    <div className="flex-shrink-0 mx-8 group">
      <div className="flex items-center gap-3 transition-all duration-300 hover:opacity-80">
        <Image
          src={partner.logo}
          alt={`${partner.name} logo`}
          width={32}
          height={32}
          className="object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
          unoptimized
        />
        <span className="text-sm font-semibold text-gray-500 whitespace-nowrap group-hover:text-gray-700 transition-colors">
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
      <div className="relative bg-gradient-to-b from-[#f8f9ff] via-[#f5f7ff] to-white py-16 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute left-[5%] top-[20%] h-32 w-32 rounded-full border-2 border-dashed border-[#0247ae]/10 animate-[spin_40s_linear_infinite]" />
        <div className="absolute right-[8%] bottom-[15%] h-24 w-24 rounded-full bg-[#ffce08]/10 animate-[float_6s_ease-in-out_infinite]" />
        
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#0247ae]/10 to-[#0247ae]/5 px-5 py-2.5 border border-[#0247ae]/10">
              <Sparkles className="h-4 w-4 text-[#0247ae]" />
              <span className="text-sm font-semibold text-[#0247ae] tracking-wide">Our Partners</span>
            </div>
            <h3 className="mb-3 text-3xl font-bold text-gray-900 sm:text-4xl">
              Trusted by Leading Developers
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Our platform partners with the Philippines&apos; top real estate developers
            </p>
          </div>
        </div>

        {/* Single line infinite scrolling carousel */}
        <div className="relative">
          {/* Gradient overlays for smooth fade effect */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#f8f9ff] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#f8f9ff] to-transparent z-10 pointer-events-none" />
          
          {/* Single row - scrolling left */}
          <div className="flex overflow-hidden">
            <div className="flex animate-marquee-left">
              {duplicatedPartners.map((partner, index) => (
                <PartnerLogo key={`row1-${partner.id}-${index}`} partner={partner} />
              ))}
            </div>
            <div className="flex animate-marquee-left" aria-hidden="true">
              {duplicatedPartners.map((partner, index) => (
                <PartnerLogo key={`row1-dup-${partner.id}-${index}`} partner={partner} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter section */}
      <div className="bg-gradient-to-r from-[#0247ae] to-[#0873c9] px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h3 className="mb-2 text-2xl font-bold text-white sm:text-3xl">
            Stay Updated
          </h3>
          <p className="mb-6 text-white/80">
            Subscribe to our newsletter for the latest property listings and market insights
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Input
              type="email"
              placeholder="Enter your email"
              className="h-12 rounded-full border-white/20 bg-white/10 px-6 text-white placeholder:text-white/60 focus:bg-white/20 sm:w-80"
            />
            <Button className="h-12 rounded-full bg-[#ffce08] px-8 font-semibold text-[#0247ae] hover:bg-[#ffce08]/90">
              Subscribe
            </Button>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="bg-gray-900 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {/* Brand column */}
            <div className="lg:col-span-1">
              <Link href="/" className="mb-6 inline-block">
                <Image
                  src={trustateLogo}
                  alt="TruState"
                  width={140}
                  height={45}
                  className="brightness-0 invert"
                />
              </Link>
              <p className="mb-6 text-sm text-gray-400 leading-relaxed">
                Your trusted partner in Philippine real estate. Connecting clients
                with verified agents and premium properties.
              </p>
              <div className="flex gap-3">
                <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-[#ffce08] hover:text-[#0247ae]">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-[#ffce08] hover:text-[#0247ae]">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-[#ffce08] hover:text-[#0247ae]">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-[#ffce08] hover:text-[#0247ae]">
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Link columns */}
            {sections.map((section) => (
              <div key={section.title}>
                <h4 className="mb-4 font-semibold text-white">
                  {section.title}
                </h4>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-gray-400 transition-colors hover:text-[#ffce08]"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Contact info */}
          <div className="mb-8 flex flex-wrap justify-center gap-6 border-t border-white/10 pt-8 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-[#ffce08]" />
              <span>support@trustate.ph</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-[#ffce08]" />
              <span>+63 (2) 8888-7777</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-[#ffce08]" />
              <span>Makati City, Philippines</span>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} Trustate. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="text-sm text-gray-500 hover:text-[#ffce08] transition-colors">
                Privacy
              </Link>
              <Link href="/terms" className="text-sm text-gray-500 hover:text-[#ffce08] transition-colors">
                Terms
              </Link>
              <Link href="/cookies" className="text-sm text-gray-500 hover:text-[#ffce08] transition-colors">
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
