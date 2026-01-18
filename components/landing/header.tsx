"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Menu, X, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import trustateLogo from "@/app/assets/trustate.png";
import { useSectionContext } from "@/lib/contexts/section-context";

export function LandingHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const { currentSection, navigateToSection } = useSectionContext();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 z-50 w-full transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/90 backdrop-blur-xl shadow-lg shadow-black/5 border-b border-gray-100/50' 
          : 'bg-white/70 backdrop-blur-md'
      }`}
    >
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center gap-6 animate-[fadeInUp_0.6s_ease-out]">
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src={trustateLogo}
              alt="TruState"
              width={140}
              height={45}
              priority
              className="transition-transform duration-300 group-hover:scale-105"
            />
          </Link>
          
          {/* Navigation Links - beside logo */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => navigateToSection(0)}
              className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-500 relative overflow-hidden group ${
                currentSection === 0
                  ? 'text-[#0247ae] bg-[#0247ae]/10'
                  : 'text-gray-600 hover:text-[#0247ae] hover:bg-[#0247ae]/5'
              }`}
            >
              <span className="relative z-10">Home</span>
              {currentSection !== 0 && (
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0247ae]/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
              )}
            </button>
            <Link href="#how-it-works">
              <button
                onClick={() => {
                  if (currentSection === 0) {
                    navigateToSection(1);
                  }
                }}
                className={`px-4 py-2 text-sm font-semibold rounded-full transition-all duration-500 relative overflow-hidden group ${
                  currentSection === 1
                    ? 'text-[#0247ae] bg-[#0247ae]/10'
                    : 'text-gray-600 hover:text-[#0247ae] hover:bg-[#0247ae]/5'
                }`}
              >
                <span className="relative z-10">How It Works</span>
                {currentSection !== 1 && (
                  <span className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0247ae]/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
                )}
              </button>
            </Link>
            <Link href="#find-partners">
              <button
                onClick={() => {
                  if (currentSection === 0) {
                    navigateToSection(1);
                  }
                }}
                className="px-4 py-2 text-sm font-semibold rounded-full transition-all duration-500 text-gray-600 hover:text-[#0247ae] hover:bg-[#0247ae]/5 relative overflow-hidden group"
              >
                <span className="relative z-10">Find Partners</span>
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0247ae]/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
              </button>
            </Link>
          </nav>
        </div>

        <div className="hidden items-center gap-4 md:flex animate-[fadeInUp_0.6s_ease-out_0.2s_both]">
          <div className="relative group">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 transition-colors duration-300 group-focus-within:text-[#0247ae]" />
            <Input
              type="text"
              placeholder="Search agents, brokers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 pl-10 lg:w-80 border-gray-200/80 bg-gray-50/80 text-gray-800 placeholder:text-gray-400 rounded-full h-11 focus:bg-white focus:border-[#0247ae]/30 focus:ring-2 focus:ring-[#0247ae]/10 transition-all duration-300"
            />
          </div>
          <Link href="/login">
            <Button
              variant="ghost"
              className="text-gray-700 hover:text-[#0247ae] hover:bg-[#0247ae]/5 font-semibold h-11 px-6 rounded-full transition-all duration-300"
            >
              Log In
            </Button>
          </Link>
          <Link href="/register">
            <Button className="relative bg-gradient-to-r from-[#ffce08] via-[#f5c000] to-[#ffce08] text-[#0247ae] font-bold hover:from-[#f5c000] hover:via-[#ffce08] hover:to-[#f5c000] shadow-lg shadow-[#ffce08]/30 px-6 rounded-full h-11 transition-all duration-500 hover:shadow-xl hover:shadow-[#ffce08]/40 hover:scale-105 group overflow-hidden bg-[length:200%_100%] hover:bg-[length:100%_100%]">
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
              <span className="relative">Register</span>
              <ArrowRight className="relative ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        <button
          className="flex h-11 w-11 items-center justify-center rounded-full text-gray-600 hover:bg-[#0247ae]/5 hover:text-[#0247ae] md:hidden transition-all duration-300"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="border-t border-gray-100/50 bg-white/95 backdrop-blur-xl px-4 py-5 md:hidden animate-[fadeInUp_0.3s_ease-out]">
          <div className="relative mb-4">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search agents, brokers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 border-gray-200 bg-gray-50 text-gray-800 placeholder:text-gray-400 rounded-full h-12"
            />
          </div>
          
          {/* Mobile Navigation Links */}
          <nav className="flex flex-col gap-2 mb-4">
            <button
              onClick={() => {
                navigateToSection(0);
                setIsMenuOpen(false);
              }}
              className={`w-full px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-300 text-left ${
                currentSection === 0
                  ? 'text-[#0247ae] bg-[#0247ae]/10'
                  : 'text-gray-600 hover:text-[#0247ae] hover:bg-[#0247ae]/5'
              }`}
            >
              Home
            </button>
            <Link href="#how-it-works" className="w-full">
              <button
                onClick={() => {
                  if (currentSection === 0) {
                    navigateToSection(1);
                  }
                  setIsMenuOpen(false);
                }}
                className={`w-full px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-300 text-left ${
                  currentSection === 1
                    ? 'text-[#0247ae] bg-[#0247ae]/10'
                    : 'text-gray-600 hover:text-[#0247ae] hover:bg-[#0247ae]/5'
                }`}
              >
                How It Works
              </button>
            </Link>
            <Link href="#find-partners" className="w-full">
              <button
                onClick={() => {
                  if (currentSection === 0) {
                    navigateToSection(1);
                  }
                  setIsMenuOpen(false);
                }}
                className="w-full px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-300 text-left text-gray-600 hover:text-[#0247ae] hover:bg-[#0247ae]/5"
              >
                Find Partners
              </button>
            </Link>
          </nav>
          
          <div className="flex flex-col gap-3">
            <Link href="/login" onClick={() => setIsMenuOpen(false)}>
              <Button
                variant="outline"
                className="w-full border-2 border-[#0247ae]/20 text-[#0247ae] hover:bg-[#0247ae]/5 font-semibold h-12 rounded-full"
              >
                Log In
              </Button>
            </Link>
            <Link href="/register" onClick={() => setIsMenuOpen(false)}>
              <Button className="w-full bg-gradient-to-r from-[#ffce08] to-[#f5c000] text-[#0247ae] font-bold hover:from-[#f5c000] hover:to-[#e6b800] h-12 rounded-full shadow-lg shadow-[#ffce08]/30">
                Register
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
