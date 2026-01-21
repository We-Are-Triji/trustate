"use client";

import { motion } from "framer-motion";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import { Star } from "lucide-react";

const testimonials = [
  {
    quote:
      "TruState made finding my dream condo so easy! The agents were professional and the process was seamless. Highly recommended!",
    name: "Maria Santos",
    title: "First-time Homebuyer",
  },
  {
    quote:
      "As an investor, I appreciate the verified listings and transparent process. TruState has become my go-to platform for property investments.",
    name: "John Reyes",
    title: "Property Investor",
  },
  {
    quote:
      "The platform is user-friendly and the agents are knowledgeable. Found my perfect family home in just 2 weeks!",
    name: "Anna Cruz",
    title: "Homeowner",
  },
  {
    quote:
      "Excellent service from start to finish. The verification process gave me peace of mind knowing I was working with licensed professionals.",
    name: "Michael Tan",
    title: "Business Owner",
  },
  {
    quote:
      "TruState connected me with the best broker in Manila. The entire transaction was smooth and professional. 5 stars!",
    name: "Sofia Garcia",
    title: "Property Buyer",
  },
  {
    quote:
      "I've used other platforms before, but TruState stands out with its verified agents and excellent customer support.",
    name: "David Lim",
    title: "Real Estate Enthusiast",
  },
];

export function TestimonialsSectionAceternity() {
  return (
    <section className="relative py-24 bg-gradient-to-b from-slate-950 to-slate-900 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div>

      {/* Decorative elements */}
      <div className="absolute left-[10%] top-[20%] h-32 w-32 rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />
      <div className="absolute right-[15%] bottom-[30%] h-40 w-40 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          {/* Rating Badge */}
          <div className="mb-8 inline-block">
            <div className="relative group">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 blur opacity-25 group-hover:opacity-60 transition duration-500"></div>
              <div className="relative flex items-center gap-3 px-6 py-2 bg-slate-800/80 backdrop-blur-xl rounded-full border border-slate-700/50 shadow-sm overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
                <div className="relative flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <span className="text-sm font-black tracking-wide text-white uppercase">
                  4.9/5 Rating
                </span>
              </div>
            </div>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            What Our{" "}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Clients Say
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Join thousands of satisfied property seekers who found their dream homes
          </p>
        </motion.div>

        {/* Infinite Moving Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col items-center"
        >
          <InfiniteMovingCards
            items={testimonials}
            direction="left"
            speed="slow"
            pauseOnHover={true}
            className="py-8"
          />
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 max-w-4xl mx-auto"
        >
          {[
            { value: "10,000+", label: "Happy Clients" },
            { value: "5,000+", label: "Properties Sold" },
            { value: "500+", label: "Verified Agents" },
            { value: "4.9/5", label: "Average Rating" },
          ].map((stat, index) => (
            <div
              key={index}
              className="text-center bg-slate-800/30 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/30"
            >
              <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                {stat.value}
              </div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
