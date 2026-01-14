"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Menu, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import trustateLogo from "@/app/assets/trustate.png";

export function LandingHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header 
      className="fixed top-0 z-50 w-full bg-white shadow-md"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 animate-[fadeInUp_0.6s_ease-out]">
          <Image
            src={trustateLogo}
            alt="TruState"
            width={140}
            height={45}
            priority
          />
        </Link>

        <div className="hidden items-center gap-4 md:flex animate-[fadeInUp_0.6s_ease-out_0.2s_both]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search properties, agents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 pl-9 lg:w-80 border-gray-200 bg-white text-gray-800 placeholder:text-gray-400"
            />
          </div>
          <Link href="/login">
            <Button
              className="bg-[#0247ae] text-white hover:bg-[#023a8a]"
            >
              Log In
            </Button>
          </Link>
          <Link href="/register">
            <Button className="bg-[#ffce08] text-[#0247ae] font-semibold hover:bg-[#ffce08]/90 shadow-lg">
              Register
            </Button>
          </Link>
        </div>

        <button
          className="flex h-10 w-10 items-center justify-center rounded-md text-gray-600 hover:bg-gray-100 md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="border-t border-gray-100 bg-white px-4 py-4 md:hidden animate-[fadeInUp_0.3s_ease-out]">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search properties, agents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 border-gray-200 bg-white text-gray-800 placeholder:text-gray-400"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Link href="/login" onClick={() => setIsMenuOpen(false)}>
              <Button
                className="w-full bg-[#0247ae] text-white hover:bg-[#023a8a]"
              >
                Log In
              </Button>
            </Link>
            <Link href="/register" onClick={() => setIsMenuOpen(false)}>
              <Button className="w-full bg-[#ffce08] text-[#0247ae] font-semibold hover:bg-[#ffce08]/90">
                Register
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
