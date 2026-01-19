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
    <div className="min-h-screen bg-[#F8FAFC]">
      <LandingHeader />
      <main className="mx-auto max-w-7xl px-4 pt-24 pb-8 sm:px-6 lg:px-8">
        {/* Back button */}
        <button
          onClick={() => router.push("/agents")}
          className="mb-6 flex items-center gap-2 text-sm text-gray-600 hover:text-[#0247ae]"
        >
          <ArrowLeft size={16} />
          Back to Agents
        </button>

        {/* Main content - two column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Photo */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 sticky top-24">
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

                <div className="flex items-center gap-2 mb-2">
                  <span className={`h-3 w-3 rounded-full ${statusColor}`} />
                  <span className="text-sm font-medium text-gray-600 capitalize">{agent.status}</span>
                </div>

                <h1 className="text-2xl font-bold text-gray-800 text-center">{agent.name}</h1>
                <p className="text-gray-500 mb-4">{agent.title}</p>

                <div className="flex items-center gap-1 mb-6">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-lg font-semibold text-gray-800">{agent.rating}</span>
                  <span className="text-sm text-gray-400">({agent.reviewCount} reviews)</span>
                </div>

                <Button className="w-full bg-[#0247ae] hover:bg-[#023a8a]">
                  Contact Agent
                </Button>
              </div>
            </div>
          </div>

          {/* Right column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Info */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Contact Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0247ae]/10">
                    <Mail className="h-5 w-5 text-[#0247ae]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <a href={`mailto:${agent.email}`} className="text-sm font-medium text-gray-800 hover:text-[#0247ae]">
                      {agent.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0247ae]/10">
                    <Phone className="h-5 w-5 text-[#0247ae]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="text-sm font-medium text-gray-800">{agent.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0247ae]/10">
                    <MapPin className="h-5 w-5 text-[#0247ae]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Location</p>
                    <p className="text-sm font-medium text-gray-800">{agent.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0247ae]/10">
                    <Award className="h-5 w-5 text-[#0247ae]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">License Number</p>
                    <p className="text-sm font-medium text-gray-800">{agent.licenseNumber}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Info */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Professional Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                    <Briefcase className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Department</p>
                    <p className="text-sm font-medium text-gray-800">{agent.department}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                    <Calendar className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Years of Experience</p>
                    <p className="text-sm font-medium text-gray-800">{agent.yearsExperience} years</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                    <User className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Employee Code</p>
                    <p className="text-sm font-medium text-gray-800">{agent.employeeCode}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                    <Calendar className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Joined Date</p>
                    <p className="text-sm font-medium text-gray-800">
                      {new Date(agent.joinedDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Stats */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Performance</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="rounded-xl bg-[#0247ae]/5 p-4 text-center">
                  <Home className="h-6 w-6 text-[#0247ae] mx-auto mb-2" />
                  <p className="text-2xl font-bold text-[#0247ae]">{agent.propertiesSold}</p>
                  <p className="text-xs text-gray-500">Properties Sold</p>
                </div>
                <div className="rounded-xl bg-[#ffce08]/10 p-4 text-center">
                  <DollarSign className="h-6 w-6 text-[#d4a900] mx-auto mb-2" />
                  <p className="text-2xl font-bold text-[#d4a900]">{agent.totalSalesValue}</p>
                  <p className="text-xs text-gray-500">Total Sales Value</p>
                </div>
                <div className="rounded-xl bg-emerald-50 p-4 text-center">
                  <Star className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-emerald-600">{agent.rating}</p>
                  <p className="text-xs text-gray-500">Average Rating</p>
                </div>
              </div>
            </div>

            {/* Specializations */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Specializations</h2>
              <div className="flex flex-wrap gap-2">
                {agent.specializations.map((spec) => (
                  <span
                    key={spec}
                    className="rounded-full bg-[#0247ae]/10 px-4 py-2 text-sm font-medium text-[#0247ae]"
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
