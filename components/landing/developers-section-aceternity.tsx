"use client";

import { motion } from "framer-motion";
import { Building2, MapPin, Star, ArrowRight } from "lucide-react";
import Link from "next/link";

const developers = [
  {
    id: 1,
    name: "Ayala Land",
    location: "Makati City",
    projects: 150,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop",
    logo: "https://img.logo.dev/ayalaland.com.ph?token=pk_X-1ZO13GSgeOoUrIuJ6GMQ",
  },
  {
    id: 2,
    name: "SM Development",
    location: "Quezon City",
    projects: 120,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop",
    logo: "https://img.logo.dev/smdevelopmentcorp.com?token=pk_X-1ZO13GSgeOoUrIuJ6GMQ",
  },
  {
    id: 3,
    name: "Megaworld",
    location: "BGC, Taguig",
    projects: 180,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&h=600&fit=crop",
    logo: "https://img.logo.dev/megaworldcorp.com?token=pk_X-1ZO13GSgeOoUrIuJ6GMQ",
  },
];

export function DevelopersSectionAceternity() {
  return (
    <section className="relative py-24 bg-gradient-to-b from-slate-950 to-slate-900 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px]"></div>

      {/* Decorative elements */}
      <div className="absolute left-[8%] top-[15%] h-40 w-40 rounded-full bg-blue-500/5 blur-3xl pointer-events-none" />
      <div className="absolute right-[12%] bottom-[25%] h-48 w-48 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />

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
            Featured{" "}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Developers
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Explore properties from the Philippines' most trusted real estate developers
          </p>
        </motion.div>

        {/* Developers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {developers.map((developer, index) => (
            <motion.div
              key={developer.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="relative h-full bg-slate-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20">
                {/* Developer Image */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={developer.image}
                    alt={developer.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>

                  {/* Logo Badge */}
                  <div className="absolute top-4 left-4 w-16 h-16 rounded-xl bg-white p-2 shadow-lg">
                    <img
                      src={developer.logo}
                      alt={`${developer.name} logo`}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Rating Badge */}
                  <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1.5 rounded-full bg-yellow-500/90 backdrop-blur-sm">
                    <Star className="h-4 w-4 text-white fill-white" />
                    <span className="text-sm font-bold text-white">{developer.rating}</span>
                  </div>
                </div>

                {/* Developer Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                    {developer.name}
                  </h3>

                  <div className="flex items-center gap-2 text-gray-400 mb-4">
                    <MapPin className="h-4 w-4 text-blue-400" />
                    <span className="text-sm">{developer.location}</span>
                  </div>

                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-700">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-cyan-400" />
                      <div>
                        <div className="text-2xl font-bold text-white">{developer.projects}</div>
                        <div className="text-xs text-gray-400">Projects</div>
                      </div>
                    </div>
                  </div>

                  {/* View Button */}
                  <Link href="/developers">
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 text-blue-400 hover:from-blue-500/20 hover:to-cyan-500/20 transition-all duration-300 group/btn">
                      <span className="text-sm font-semibold">View Projects</span>
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center"
        >
          <Link href="/developers">
            <button className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105">
              View All Developers
              <ArrowRight className="h-5 w-5" />
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
