import { Star, MapPin, User, Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Agent } from "@/lib/types/landing";

interface HeroSectionProps {
  agents: Agent[];
}

const cardDistinctions = [
  { 
    border: "border-yellow-400/60 border-2",
    shadow: "shadow-xl shadow-yellow-100/50",
    badge: "bg-gradient-to-br from-yellow-400 to-yellow-600",
    accentBg: "from-yellow-50 to-amber-50",
    showTrophy: true,
    trophyColor: "text-yellow-500",
  },
  { 
    border: "border-gray-300/60 border-2",
    shadow: "shadow-xl shadow-gray-200/50",
    badge: "bg-gradient-to-br from-gray-300 to-gray-500",
    accentBg: "from-gray-50 to-slate-50",
    showTrophy: true,
    trophyColor: "text-gray-400",
  },
  { 
    border: "border-amber-500/60 border-2",
    shadow: "shadow-xl shadow-amber-100/50",
    badge: "bg-gradient-to-br from-amber-500 to-amber-700",
    accentBg: "from-amber-50 to-orange-50",
    showTrophy: true,
    trophyColor: "text-amber-600",
  },
  { 
    border: "border-gray-200",
    shadow: "shadow-lg",
    badge: "bg-gradient-to-br from-gray-500 to-gray-700",
    accentBg: "from-gray-50 to-gray-100",
    showTrophy: false,
    trophyColor: "",
  },
  { 
    border: "border-gray-200",
    shadow: "shadow-lg",
    badge: "bg-gradient-to-br from-gray-500 to-gray-700",
    accentBg: "from-gray-50 to-gray-100",
    showTrophy: false,
    trophyColor: "",
  },
];

export function HeroSection({ agents }: HeroSectionProps) {
  const topFive = agents.slice(0, 5);

  return (
    <section className="bg-gradient-to-b from-[#F8FAFC] to-white px-4 py-10 sm:px-6 sm:py-16 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-2xl font-bold text-gray-800 sm:text-3xl lg:text-5xl">
            Top Agents of the Month
          </h1>
          <div className="mx-auto h-1 w-48 rounded-full bg-gradient-to-r from-gray-600 via-gray-800 to-gray-600 sm:w-80" />
        </div>

        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5 lg:gap-6">
          {topFive.map((agent, index) => {
            const distinction = cardDistinctions[index];
            
            return (
              <Card
                key={agent.id}
                className={`${distinction.border} ${distinction.shadow} group relative overflow-hidden rounded-2xl bg-white transition-all duration-300 hover:shadow-2xl hover:-translate-y-2`}
              >
                <CardContent className="flex h-full flex-col p-0">
                  <div className="relative">
                    <div className={`flex h-36 items-center justify-center bg-gradient-to-br ${distinction.accentBg} sm:h-40`}>
                      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white/80 shadow-inner sm:h-24 sm:w-24">
                        <User className="h-10 w-10 text-gray-400 sm:h-12 sm:w-12" />
                      </div>
                    </div>
                    <div
                      className={`${distinction.badge} absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold text-white shadow-lg sm:h-10 sm:w-10`}
                    >
                      #{agent.rank}
                    </div>
                    {distinction.showTrophy && (
                      <div className="absolute right-4 top-4 rounded-lg bg-white/90 p-1.5 shadow-sm">
                        <Trophy className={`h-5 w-5 ${distinction.trophyColor}`} />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
                    <h3 className="mb-1 text-lg font-semibold text-gray-800">
                      {agent.name}
                    </h3>
                    <p className="mb-3 text-sm text-gray-500 line-clamp-1">
                      {agent.title}
                    </p>

                    <div className="mb-2 flex items-center gap-1.5 text-sm text-gray-600">
                      <MapPin className="h-4 w-4 flex-shrink-0 text-gray-400" />
                      <span className="truncate">{agent.location}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Star className="h-4 w-4 flex-shrink-0 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-semibold text-gray-800">
                        {agent.rating}
                      </span>
                      <span className="text-sm text-gray-400">
                        ({agent.reviewCount} reviews)
                      </span>
                    </div>

                    <div className="mt-auto pt-4">
                      <div className="rounded-xl bg-gray-50 p-3">
                        <div className="grid grid-cols-2 gap-3 text-center">
                          <div>
                            <p className="text-xl font-bold text-gray-800 sm:text-2xl">
                              {agent.propertiesSold}
                            </p>
                            <p className="text-xs font-medium text-gray-500">Properties Sold</p>
                          </div>
                          <div>
                            <p className="text-xl font-bold text-gray-800 sm:text-2xl">
                              {agent.totalSalesValue.replace("PHP ", "")}
                            </p>
                            <p className="text-xs font-medium text-gray-500">Total Sales</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
