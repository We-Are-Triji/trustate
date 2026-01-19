"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, User, Mail, Phone, MapPin, Star, Calendar, Briefcase, Award, Home, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LandingHeader } from "@/components/landing/header";
import { LandingFooter } from "@/components/landing/footer";
import { agentsData } from "@/lib/mock/agents-data";
import { partners, footerSections } from "@/lib/mock/landing-data";
import { getAgentPhoto } from "@/components/agents/agent-card";

interface AgentDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function AgentDetailPage({ params }: AgentDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const agent = agentsData.find((a) => a.id === id);

  if (!agent) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <LandingHeader />
        <main className="mx-auto max-w-7xl px-4 pt-24 pb-8">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold text-gray-800">Agent not found</h1>
            <Button onClick={() => router.push("/agents")} className="mt-4">
              Back to Agents
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const statusColor = agent.status === "active" ? "bg-emerald-500" : agent.status === "invited" ? "bg-amber-500" : "bg-gray-400";
  const photoUrl = getAgentPhoto(agent.name);

  return (
    <div className="min-h-screen bg-[#f8faff]">
      <LandingHeader />
      <main className="mx-auto max-w-7xl px-4 pt-24 pb-8 sm:px-6 lg:px-8">
        {/* Back button */}
        <button
          onClick={() => router.push("/agents")}
          className="mb-6 flex items-center gap-2 text-sm text-gray-600 hover:text-[#0247ae] transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Agents
        </button>

        {/* Main content - balanced layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left column - Photo and Quick Info */}
          <div className="lg:col-span-2">
            <div className="rounded-3xl border-2 border-gray-200 bg-white p-8 sticky top-24 shadow-lg">
              <div className="flex flex-col items-center">
                <div className="mb-4 flex h-48 w-48 items-center justify-center overflow-hidden rounded-full border-4 border-gray-100 bg-gradient-to-br from-gray-100 to-gray-200 shadow-lg">
                  <img 
                    src={photoUrl} 
                    alt={agent.name} 
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(agent.name)}&size=400&background=0247ae&color=fff&bold=true`;
                    }}
                  />
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <span className={`h-3 w-3 rounded-full ${statusColor} ${agent.status === 'active' ? 'animate-pulse' : ''}`} />
                  <span className="text-sm font-bold text-gray-600 capitalize">{agent.status}</span>
                </div>

                <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-2 leading-tight">{agent.name}</h1>
                <p className="text-gray-600 mb-4 font-semibold text-center">{agent.title}</p>

                <div className="flex items-center gap-2 mb-6 px-4 py-2 rounded-xl bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-100">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-xl font-extrabold text-gray-900">{agent.rating}</span>
                  <span className="text-sm text-gray-500 font-semibold">({agent.reviewCount} reviews)</span>
                </div>

                <Button className="w-full bg-gradient-to-r from-[#0247ae] to-[#0560d4] hover:from-[#0560d4] hover:to-[#0247ae] rounded-2xl h-14 font-extrabold text-base shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] mb-6">
                  Contact Agent
                </Button>

                {/* Quick Stats */}
                <div className="w-full space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-100">
                    <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Location</span>
                    <span className="text-sm font-extrabold text-[#0247ae]">{agent.location}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-100">
                    <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Member Since</span>
                    <span className="text-sm font-extrabold text-emerald-600">
                      {new Date(agent.joinedDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right column - Detailed Information */}
          <div className="lg:col-span-3 space-y-6">
            {/* Contact Info */}
            <div className="rounded-3xl border-2 border-gray-200 bg-white p-6 shadow-lg">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0247ae]/10">
                    <Mail className="h-5 w-5 text-[#0247ae]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-semibold">Email</p>
                    <a href={`mailto:${agent.email}`} className="text-sm font-bold text-gray-800 hover:text-[#0247ae] transition-colors">
                      {agent.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0247ae]/10">
                    <Phone className="h-5 w-5 text-[#0247ae]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-semibold">Phone</p>
                    <p className="text-sm font-bold text-gray-800">{agent.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0247ae]/10">
                    <MapPin className="h-5 w-5 text-[#0247ae]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-semibold">Location</p>
                    <p className="text-sm font-bold text-gray-800">{agent.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0247ae]/10">
                    <User className="h-5 w-5 text-[#0247ae]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-semibold">Linked to Broker</p>
                    <p className="text-sm font-bold text-gray-800">{agent.brokerName}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Info */}
            <div className="rounded-3xl border-2 border-gray-200 bg-white p-6 shadow-lg">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Professional Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
                    <Briefcase className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-semibold">Department</p>
                    <p className="text-sm font-bold text-gray-800">{agent.department}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
                    <Calendar className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-semibold">Years of Experience</p>
                    <p className="text-sm font-bold text-gray-800">{agent.yearsExperience} years</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
                    <User className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-semibold">Employee Code</p>
                    <p className="text-sm font-bold text-gray-800">{agent.employeeCode}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
                    <Calendar className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-semibold">Joined Date</p>
                    <p className="text-sm font-bold text-gray-800">
                      {new Date(agent.joinedDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Linked Broker */}
            <div className="rounded-3xl border-2 border-gray-200 bg-white p-6 shadow-lg">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Linked to Broker</h2>
              <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0247ae]/20">
                    <User className="h-6 w-6 text-[#0247ae]" />
                  </div>
                  <div>
                    <p className="text-base font-extrabold text-gray-900">{agent.brokerName}</p>
                    <p className="text-xs text-gray-500 font-semibold">Licensed Real Estate Broker</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 pl-15">
                  <Award className="h-4 w-4 text-[#0247ae]" />
                  <p className="text-xs text-gray-600 font-semibold">PRC License: <span className="font-extrabold text-[#0247ae]">{agent.brokerLicense}</span></p>
                </div>
              </div>
            </div>

            {/* Performance Stats */}
            <div className="rounded-3xl border-2 border-gray-200 bg-white p-6 shadow-lg">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Performance</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-100 p-4 text-center">
                  <Home className="h-6 w-6 text-[#0247ae] mx-auto mb-2" />
                  <p className="text-2xl font-bold text-[#0247ae]">{agent.propertiesSold}</p>
                  <p className="text-xs text-gray-600 font-semibold">Properties Sold</p>
                </div>
                <div className="rounded-2xl bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-100 p-4 text-center">
                  <DollarSign className="h-6 w-6 text-[#ffce08] mx-auto mb-2" />
                  <p className="text-2xl font-bold text-[#ffce08]">{agent.totalSalesValue}</p>
                  <p className="text-xs text-gray-600 font-semibold">Total Sales Value</p>
                </div>
                <div className="rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-100 p-4 text-center">
                  <Star className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-emerald-600">{agent.rating}</p>
                  <p className="text-xs text-gray-600 font-semibold">Average Rating</p>
                </div>
              </div>
            </div>

            {/* Specializations */}
            <div className="rounded-3xl border-2 border-gray-200 bg-white p-6 shadow-lg">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Specializations</h2>
              <div className="flex flex-wrap gap-2">
                {agent.specializations.map((spec) => (
                  <span
                    key={spec}
                    className="rounded-xl bg-gradient-to-r from-[#0247ae]/10 to-[#0560d4]/10 px-4 py-2 text-sm font-bold text-[#0247ae] border-2 border-[#0247ae]/20"
                  >
                    {spec}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <LandingFooter partners={partners} sections={footerSections} />
    </div>
  );
}
