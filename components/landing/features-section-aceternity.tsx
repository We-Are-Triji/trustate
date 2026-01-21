"use client";

import { motion } from "framer-motion";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import { Shield, Zap, Users, TrendingUp, Lock, HeadphonesIcon } from "lucide-react";

const features = [
  {
    title: "Verified Professionals",
    description: "Every agent and broker on our platform is thoroughly verified and licensed.",
    icon: <Shield className="h-6 w-6 text-blue-400" />,
    className: "md:col-span-2",
    header: (
      <div className="flex h-full min-h-[6rem] w-full rounded-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/20"></div>
    ),
  },
  {
    title: "Lightning Fast",
    description: "Find your perfect property in minutes, not months.",
    icon: <Zap className="h-6 w-6 text-yellow-400" />,
    className: "md:col-span-1",
    header: (
      <div className="flex h-full min-h-[6rem] w-full rounded-xl bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/20"></div>
    ),
  },
  {
    title: "Trusted Network",
    description: "Join thousands of satisfied property seekers and investors.",
    icon: <Users className="h-6 w-6 text-cyan-400" />,
    className: "md:col-span-1",
    header: (
      <div className="flex h-full min-h-[6rem] w-full rounded-xl bg-gradient-to-br from-cyan-500/20 to-teal-500/20 border border-cyan-500/20"></div>
    ),
  },
  {
    title: "Market Insights",
    description: "Access real-time market data and property trends.",
    icon: <TrendingUp className="h-6 w-6 text-green-400" />,
    className: "md:col-span-2",
    header: (
      <div className="flex h-full min-h-[6rem] w-full rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/20"></div>
    ),
  },
  {
    title: "Secure Transactions",
    description: "Bank-level security for all your property transactions.",
    icon: <Lock className="h-6 w-6 text-purple-400" />,
    className: "md:col-span-1",
    header: (
      <div className="flex h-full min-h-[6rem] w-full rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/20"></div>
    ),
  },
  {
    title: "24/7 Support",
    description: "Our team is always here to help you every step of the way.",
    icon: <HeadphonesIcon className="h-6 w-6 text-pink-400" />,
    className: "md:col-span-2",
    header: (
      <div className="flex h-full min-h-[6rem] w-full rounded-xl bg-gradient-to-br from-pink-500/20 to-rose-500/20 border border-pink-500/20"></div>
    ),
  },
];

export function FeaturesSectionAceternity() {
  return (
    <section className="relative py-24 bg-gradient-to-b from-slate-900 to-slate-950 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Why Choose{" "}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              TruState
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Everything you need to find and secure your dream property
          </p>
        </motion.div>

        {/* Bento Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <BentoGrid className="max-w-7xl mx-auto">
            {features.map((feature, index) => (
              <BentoGridItem
                key={index}
                title={feature.title}
                description={feature.description}
                header={feature.header}
                icon={feature.icon}
                className={`${feature.className} bg-slate-800/50 backdrop-blur-sm border-slate-700/50 hover:border-blue-500/50 transition-all duration-300`}
              />
            ))}
          </BentoGrid>
        </motion.div>
      </div>
    </section>
  );
}
