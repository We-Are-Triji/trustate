"use client";

import { motion } from "framer-motion";
import { Star, MapPin, Phone, Mail, Award, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Agent } from "@/lib/types/landing";

const agentPhotos = [
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&h=300&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
];

interface AgentListAceternityProps {
  agents: Agent[];
}

export function AgentListAceternity({ agents }: AgentListAceternityProps) {
  const displayAgents = agents.slice(0, 6);

  return (
    <section className="relative py-24 bg-gradient-to-b from-slate-950 to-slate-900 overflow-hidden">
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
            Meet Our <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Top Agents</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Connect with verified professionals who will help you find your perfect property
          </p>
        </motion.div>

        {/* Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayAgents.map((agent, index) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="relative h-full bg-slate-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-slate-700/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/20">
                {/* Agent Photo */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={agentPhotos[index % agentPhotos.length]}
                    alt={agent.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent"></div>
                  
                  {/* Rating Badge */}
                  <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1.5 rounded-full bg-yellow-500/90 backdrop-blur-sm">
                    <Star className="h-4 w-4 text-white fill-white" />
                    <span className="text-sm font-bold text-white">{agent.rating}</span>
                  </div>

                  {/* Verified Badge */}
                  <div className="absolute top-4 left-4 flex items-center gap-1 px-3 py-1.5 rounded-full bg-green-500/90 backdrop-blur-sm">
                    <Award className="h-4 w-4 text-white" />
                    <span className="text-xs font-bold text-white">Verified</span>
                  </div>
                </div>

                {/* Agent Info */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                    {agent.name}
                  </h3>
                  
                  <div className="flex items-center gap-2 text-gray-400 mb-4">
                    <MapPin className="h-4 w-4 text-blue-400" />
                    <span className="text-sm">{agent.location}</span>
                  </div>

                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-700">
                    <div>
                      <div className="text-2xl font-bold text-white">{agent.propertiesSold}</div>
                      <div className="text-xs text-gray-400">Properties Sold</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">{agent.yearsExperience}</div>
                      <div className="text-xs text-gray-400">Years Exp.</div>
                    </div>
                  </div>

                  {/* Contact Buttons */}
                  <div className="grid grid-cols-2 gap-3">
                    <button className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 transition-all duration-300">
                      <Phone className="h-4 w-4" />
                      <span className="text-sm font-semibold">Call</span>
                    </button>
                    <button className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20 transition-all duration-300">
                      <Mail className="h-4 w-4" />
                      <span className="text-sm font-semibold">Email</span>
                    </button>
                  </div>
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
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-16"
        >
          <Link href="/agents">
            <button className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-semibold hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105">
              View All Agents
              <ArrowRight className="h-5 w-5" />
            </button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
