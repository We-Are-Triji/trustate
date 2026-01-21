"use client";

import { motion } from "framer-motion";
import { Button as MovingBorderButton } from "@/components/ui/moving-border";
import { Spotlight } from "@/components/ui/spotlight";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export function CTASectionAceternity() {
  return (
    <section className="relative py-32 bg-gradient-to-b from-slate-900 via-blue-950 to-slate-950 overflow-hidden">
      {/* Spotlight Effect */}
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="blue" />

      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div>

      {/* Decorative Blobs */}
      <div className="absolute left-[5%] top-[20%] h-64 w-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute right-[10%] bottom-[20%] h-80 w-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none animate-pulse" style={{ animationDelay: "1s" }} />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-8 inline-block"
        >
          <div className="relative group">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 blur opacity-25 group-hover:opacity-60 transition duration-500"></div>
            <div className="relative flex items-center gap-3 px-6 py-2 bg-slate-800/80 backdrop-blur-xl rounded-full border border-slate-700/50 shadow-sm overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
              <div className="relative flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 text-white">
                <Sparkles className="w-3 h-3" />
              </div>
              <span className="text-sm font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 uppercase">
                Start Your Journey Today
              </span>
            </div>
          </div>
        </motion.div>

        {/* Main Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight"
        >
          Ready to Find Your
          <br />
          <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent">
            Dream Property?
          </span>
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto"
        >
          Join thousands of satisfied clients who found their perfect home through TruState
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link href="/register">
            <MovingBorderButton
              borderRadius="1.75rem"
              className="bg-slate-900 text-white border-slate-800 px-10 py-5 text-lg"
              containerClassName="h-16"
              borderClassName="bg-[radial-gradient(var(--blue-500)_40%,transparent_60%)]"
            >
              <span className="flex items-center gap-2 font-bold">
                Get Started Free
                <ArrowRight className="h-5 w-5" />
              </span>
            </MovingBorderButton>
          </Link>

          <Link href="/agents">
            <button className="h-16 px-10 py-5 rounded-3xl bg-white/10 backdrop-blur-sm border border-white/20 text-white text-lg font-bold hover:bg-white/20 transition-all duration-300">
              Browse Agents
            </button>
          </Link>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-16 flex flex-wrap justify-center gap-8 text-gray-400 text-sm"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400"></div>
            <span>No Credit Card Required</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-400"></div>
            <span>100% Verified Agents</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
            <span>Free to Browse</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
