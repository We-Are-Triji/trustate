import { Star, MapPin, ChevronRight, Award } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Agent } from "@/lib/types/landing";

interface AgentListSectionProps {
  agents: Agent[];
}

export function AgentListSection({ agents }: AgentListSectionProps) {
  const topSixToTen = agents.slice(5, 10);

  return (
    <section className="bg-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Card className="border-[#E2E8F0] bg-white shadow-sm">
          <CardHeader className="border-b border-[#E2E8F0] pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100">
                  <Award className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <CardTitle className="text-xl font-semibold text-gray-800">
                    Rising Stars
                  </CardTitle>
                  <p className="text-sm text-gray-500">
                    Agents ranked 6-10 this month
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                className="hidden text-gray-600 hover:text-gray-800 sm:flex"
              >
                View All Agents
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y divide-[#E2E8F0]">
              {topSixToTen.map((agent) => (
                <li
                  key={agent.id}
                  className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-[#F8FAFC]"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 font-semibold text-gray-600">
                      #{agent.rank}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-800">
                        {agent.name}
                      </h4>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>{agent.specialization}</span>
                        <span className="text-gray-300">|</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {agent.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="hidden text-right sm:block">
                      <p className="font-semibold text-gray-800">
                        {agent.propertiesSold} properties
                      </p>
                      <p className="text-sm text-gray-500">
                        {agent.totalSalesValue} in sales
                      </p>
                    </div>
                    <div className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1">
                      <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                      <span className="font-medium text-gray-800">
                        {agent.rating}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-[#E2E8F0] p-4 sm:hidden">
              <Button
                variant="outline"
                className="w-full border-gray-300 text-gray-600"
              >
                View All Agents
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
