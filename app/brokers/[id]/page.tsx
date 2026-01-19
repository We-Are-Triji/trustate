"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Building2, Mail, Phone, MapPin, Star, Calendar, Users, Award, Home, DollarSign, Globe, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LandingHeader } from "@/components/landing/header";
import { LandingFooter } from "@/components/landing/footer";
import { brokerageFirms, individualBrokers } from "@/lib/mock/brokers-data";
import { partners, footerSections } from "@/lib/mock/landing-data";
import { getPersonPhoto } from "@/lib/utils/photo-utils";

interface BrokerDetailPageProps {
  params: Promise<{ id: string }>;
}

// Real estate property photos for brokerages
const brokeragePhotos = [
  "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1600047509358-9dc75507daeb?w=400&h=400&fit=crop",
];

function getBrokeragePhoto(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    const char = name.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  hash = Math.abs(hash);
  const photoIndex = hash % brokeragePhotos.length;
  return brokeragePhotos[photoIndex];
}

export default function BrokerDetailPage({ params }: BrokerDetailPageProps) {
  const { id } = use(params);
  const router = useRouter();
  
  // Check if it's a brokerage firm or individual broker
  const brokerage = brokerageFirms.find((b) => b.id === id);
  const individualBroker = individualBrokers.find((b) => b.id === id);
  
  const broker = brokerage || individualBroker;

  if (!broker) {
    return (
      <div className="min-h-screen bg-[#f8faff]">
        <LandingHeader />
        <main className="mx-auto max-w-7xl px-4 pt-24 pb-8">
          <div className="text-center py-16">
            <h1 className="text-2xl font-bold text-gray-800">Broker not found</h1>
            <Button onClick={() => router.push("/brokers")} className="mt-4">
              Back to Brokers
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const isBrokerage = brokerage !== undefined;
  const statusColor = broker.status === "active" ? "bg-emerald-500" : broker.status === "pending" ? "bg-amber-500" : "bg-gray-400";

  // Type-safe access to broker properties
  const brokerLocation = isBrokerage && brokerage ? brokerage.city : individualBroker?.location;
  const brokerTitle = !isBrokerage && individualBroker ? individualBroker.title : undefined;
  const brokerLicense = !isBrokerage && individualBroker ? individualBroker.licenseNumber : undefined;
  const brokerYearsExp = !isBrokerage && individualBroker ? individualBroker.yearsExperience : undefined;

  return (
    <div className="min-h-screen bg-[#f8faff]">
      <LandingHeader />
      <main className="mx-auto max-w-7xl px-4 pt-24 pb-8 sm:px-6 lg:px-8">
        {/* Back button */}
        <button
          onClick={() => router.push("/brokers")}
          className="mb-6 flex items-center gap-2 text-sm text-gray-600 hover:text-[#0247ae] transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Brokers
        </button>

        {/* Main content - balanced layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left column - Photo/Image and Quick Info */}
          <div className="lg:col-span-2">
            <div className="rounded-3xl border-2 border-gray-200 bg-white p-8 sticky top-24 shadow-lg">
              <div className="flex flex-col items-center">
                {isBrokerage ? (
                  // Brokerage property image
                  <div className="mb-6 w-full h-64 overflow-hidden rounded-2xl border-4 border-gray-100 shadow-lg">
                    <img 
                      src={getBrokeragePhoto(broker.name)} 
                      alt={broker.name} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  // Individual broker photo
                  <div className="mb-6 flex h-56 w-56 items-center justify-center overflow-hidden rounded-full border-4 border-gray-100 bg-gradient-to-br from-gray-100 to-gray-200 shadow-lg">
                    <img 
                      src={getPersonPhoto(broker.name)} 
                      alt={broker.name} 
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(broker.name)}&size=400&background=0247ae&color=fff&bold=true`;
                      }}
                    />
                  </div>
                )}

                <div className="flex items-center gap-2 mb-3">
                  <span className={`h-3 w-3 rounded-full ${statusColor} ${broker.status === 'active' ? 'animate-pulse' : ''}`} />
                  <span className="text-sm font-bold text-gray-600 capitalize">{broker.status}</span>
                </div>

                <h1 className="text-3xl font-extrabold text-gray-900 text-center mb-2 leading-tight">{broker.name}</h1>
                {isBrokerage ? (
                  <p className="text-gray-500 mb-4 flex items-center gap-2 font-semibold">
                    <Building2 className="h-5 w-5" />
                    Brokerage Firm
                  </p>
                ) : (
                  <p className="text-gray-600 mb-4 font-semibold text-center">{brokerTitle}</p>
                )}

                <div className="flex items-center gap-2 mb-6 px-4 py-2 rounded-xl bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-100">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="text-xl font-extrabold text-gray-900">{broker.rating}</span>
                  <span className="text-sm text-gray-500 font-semibold">({broker.reviewCount} reviews)</span>
                </div>

                <Button className="w-full bg-gradient-to-r from-[#0247ae] to-[#0560d4] hover:from-[#0560d4] hover:to-[#0247ae] rounded-2xl h-14 font-extrabold text-base shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] mb-6">
                  {isBrokerage ? 'Contact Brokerage' : 'Contact Broker'}
                </Button>

                {/* Quick Stats */}
                <div className="w-full space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-100">
                    <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Location</span>
                    <span className="text-sm font-extrabold text-[#0247ae]">{brokerLocation}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-100">
                    <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Member Since</span>
                    <span className="text-sm font-extrabold text-emerald-600">
                      {new Date(broker.joinedDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
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
                    <a href={`mailto:${broker.email}`} className="text-sm font-bold text-gray-800 hover:text-[#0247ae] transition-colors">
                      {broker.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0247ae]/10">
                    <Phone className="h-5 w-5 text-[#0247ae]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-semibold">Phone</p>
                    <p className="text-sm font-bold text-gray-800">{broker.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0247ae]/10">
                    <MapPin className="h-5 w-5 text-[#0247ae]" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-semibold">Location</p>
                    <p className="text-sm font-bold text-gray-800">{brokerLocation}</p>
                  </div>
                </div>
                {isBrokerage && brokerage?.website && (
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0247ae]/10">
                      <Globe className="h-5 w-5 text-[#0247ae]" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-semibold">Website</p>
                      <a 
                        href={brokerage.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm font-bold text-[#0247ae] hover:underline"
                      >
                        Visit Website
                      </a>
                    </div>
                  </div>
                )}
                {!isBrokerage && brokerLicense && (
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0247ae]/10">
                      <Award className="h-5 w-5 text-[#0247ae]" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-semibold">License Number</p>
                      <p className="text-sm font-bold text-gray-800">{brokerLicense}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Professional/Business Info */}
            {isBrokerage && brokerage ? (
              <>
                {/* Brokerage Description */}
                <div className="rounded-3xl border-2 border-gray-200 bg-white p-6 shadow-lg">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">About</h2>
                  <p className="text-gray-600 leading-relaxed">{brokerage.description}</p>
                </div>

                {/* Account Manager */}
                <div className="rounded-3xl border-2 border-gray-200 bg-white p-6 shadow-lg">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Account Manager</h2>
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-white border-2 border-gray-100">
                    <div className="flex-shrink-0 h-16 w-16 rounded-full border-[3px] border-[#0247ae]/20 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shadow-md">
                      <img 
                        src={getPersonPhoto(brokerage.representative.name)} 
                        alt={brokerage.representative.name}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(brokerage.representative.name)}&size=100&background=0247ae&color=fff&bold=true`;
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-base font-extrabold text-gray-800">{brokerage.representative.name}</p>
                      <p className="text-sm text-gray-500 font-semibold mb-2">{brokerage.representative.title}</p>
                      <div className="flex flex-col gap-1 text-xs">
                        <a href={`mailto:${brokerage.representative.email}`} className="text-[#0247ae] hover:underline font-semibold">
                          {brokerage.representative.email}
                        </a>
                        <p className="text-gray-600 font-semibold">{brokerage.representative.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : individualBroker && (
              <div className="rounded-3xl border-2 border-gray-200 bg-white p-6 shadow-lg">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Professional Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
                      <Calendar className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-semibold">Years of Experience</p>
                      <p className="text-sm font-bold text-gray-800">{brokerYearsExp} years</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
                      <Calendar className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-semibold">Joined Date</p>
                      <p className="text-sm font-bold text-gray-800">
                        {new Date(broker.joinedDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Performance Stats */}
            <div className="rounded-3xl border-2 border-gray-200 bg-white p-6 shadow-lg">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Performance</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {isBrokerage && brokerage ? (
                  <>
                    <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-100 p-4 text-center">
                      <Users className="h-6 w-6 text-[#0247ae] mx-auto mb-2" />
                      <p className="text-2xl font-bold text-[#0247ae]">{brokerage.agentCount}</p>
                      <p className="text-xs text-gray-600 font-semibold">Agents</p>
                    </div>
                    <div className="rounded-2xl bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-100 p-4 text-center">
                      <Home className="h-6 w-6 text-[#ffce08] mx-auto mb-2" />
                      <p className="text-2xl font-bold text-[#ffce08]">{brokerage.propertiesListed}</p>
                      <p className="text-xs text-gray-600 font-semibold">Properties Listed</p>
                    </div>
                    <div className="rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-100 p-4 text-center">
                      <Award className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-emerald-600">{brokerage.yearsInBusiness}+</p>
                      <p className="text-xs text-gray-600 font-semibold">Years in Business</p>
                    </div>
                  </>
                ) : individualBroker && (
                  <>
                    <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-100 p-4 text-center">
                      <Home className="h-6 w-6 text-[#0247ae] mx-auto mb-2" />
                      <p className="text-2xl font-bold text-[#0247ae]">{individualBroker.propertiesSold}</p>
                      <p className="text-xs text-gray-600 font-semibold">Properties Sold</p>
                    </div>
                    <div className="rounded-2xl bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-100 p-4 text-center">
                      <DollarSign className="h-6 w-6 text-[#ffce08] mx-auto mb-2" />
                      <p className="text-2xl font-bold text-[#ffce08]">{individualBroker.totalSalesValue}</p>
                      <p className="text-xs text-gray-600 font-semibold">Total Sales Value</p>
                    </div>
                    <div className="rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-100 p-4 text-center">
                      <Star className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-emerald-600">{broker.rating}</p>
                      <p className="text-xs text-gray-600 font-semibold">Average Rating</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Specializations */}
            {broker.specializations && broker.specializations.length > 0 && (
              <div className="rounded-3xl border-2 border-gray-200 bg-white p-6 shadow-lg">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">Specializations</h2>
                <div className="flex flex-wrap gap-2">
                  {broker.specializations.map((spec) => (
                    <span
                      key={spec}
                      className="rounded-xl bg-gradient-to-r from-[#0247ae]/10 to-[#0560d4]/10 px-4 py-2 text-sm font-bold text-[#0247ae] border-2 border-[#0247ae]/20"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <LandingFooter partners={partners} sections={footerSections} />
    </div>
  );
}
