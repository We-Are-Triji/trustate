"use client";

import { motion } from "framer-motion";
import { Button as MovingBorderButton } from "@/components/ui/moving-border";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { ArrowRight, Home, TrendingUp, Shield } from "lucide-react";
import Link from "next/link";

export function HeroSectionAceternity() {
  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-slate-950 via-blue-950 to-slate-900 flex items-center justify-center overflow-hidden">
      <BackgroundBeams />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur-sm mb-8"
          >
            <Shield className="h-4 w-4 text-blue-400" />
            <span className="text-sm font-semibold text-blue-300">
              Trusted by 10,000+ Property Seekers
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
          >
            Find Your Dream
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
              Property in the Philippines
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto"
          >
            Connect with verified agents, brokers, and developers. Your journey to homeownership starts here.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link href="/register">
              <MovingBorderButton
                borderRadius="1.75rem"
                className="bg-slate-900 text-white border-slate-800 px-8 py-4"
                containerClassName="h-14"
                borderClassName="bg-[radial-gradient(var(--blue-500)_40%,transparent_60%)]"
              >
                <span className="flex items-center gap-2 font-semibold">
                  Get Started Free
                  <ArrowRight className="h-5 w-5" />
                </span>
              </MovingBorderButton>
            </Link>

            <Link href="/developers">
              <button className="h-14 px-8 py-4 rounded-3xl bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold hover:bg-white/20 transition-all duration-300 flex items-center gap-2">
                <Home className="h-5 w-5" />
                Browse Properties
              </button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 max-w-4xl mx-auto"
          >
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Home className="h-6 w-6 text-blue-400" />
              </div>
              <div className="text-4xl font-bold text-white mb-1">5,000+</div>
              <div className="text-gray-400 text-sm">Properties Listed</div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingUp className="h-6 w-6 text-cyan-400" />
              </div>
              <div className="text-4xl font-bold text-white mb-1">98%</div>
              <div className="text-gray-400 text-sm">Success Rate</div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Shield className="h-6 w-6 text-teal-400" />
              </div>
              <div className="text-4xl font-bold text-white mb-1">100%</div>
              <div className="text-gray-400 text-sm">Verified Agents</div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
