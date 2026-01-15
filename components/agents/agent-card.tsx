"use client";

import { User, Mail, Phone, MoreHorizontal, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { AgentProfile } from "@/lib/types/agent";

interface AgentCardProps {
  agent: AgentProfile;
  onViewDetails?: (agentId: string) => void;
}

function getStatusColor(status: AgentProfile["status"]) {
  switch (status) {
    case "active":
      return "bg-emerald-500";
    case "inactive":
      return "bg-gray-400";
    case "invited":
      return "bg-amber-500";
    default:
      return "bg-gray-400";
  }
}

function getStatusLabel(status: AgentProfile["status"]) {
  switch (status) {
    case "active":
      return "Active";
    case "inactive":
      return "Inactive";
    case "invited":
      return "Invited";
    default:
      return status;
  }
}

function getCategoryLabel(category: AgentProfile["category"]) {
  switch (category) {
    case "managerial":
      return "Managerial";
    case "non-management":
      return "Non-Management";
    default:
      return category;
  }
}

function getEmploymentLabel(type: AgentProfile["employmentType"]) {
  switch (type) {
    case "fulltime":
      return "Fulltime";
    case "part-time":
      return "Part-time";
    case "contract":
      return "Contract";
    default:
      return type;
  }
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function AgentCard({ agent, onViewDetails }: AgentCardProps) {
  return (
    <Card className="border-[#E2E8F0] bg-white shadow-sm transition-all duration-200 hover:shadow-md">
      <CardContent className="p-0">
        <div className="p-5">
          <div className="mb-4 flex items-start justify-between">
            <div className="flex items-center gap-1.5">
              <span
                className={`h-2 w-2 rounded-full ${getStatusColor(agent.status)}`}
              />
              <span className="text-xs font-medium text-gray-600">
                {getStatusLabel(agent.status)}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon-sm"
              className="h-7 w-7 text-gray-400 hover:text-gray-600"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>

          <div className="mb-4 flex flex-col items-center text-center">
            <div className="mb-3 flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-4 border-gray-100 bg-gradient-to-br from-gray-100 to-gray-200 shadow-inner">
              <User className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="mb-0.5 text-base font-semibold text-gray-800">
              {agent.name}
            </h3>
            <p className="text-sm text-gray-500">{agent.title}</p>
          </div>

          <div className="mb-4 flex items-center justify-center gap-1.5">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm font-semibold text-gray-800">
              {agent.rating}
            </span>
            <span className="text-xs text-gray-400">
              ({agent.reviewCount} reviews)
            </span>
          </div>

          <div className="mb-4 space-y-1.5 text-center">
            <p className="text-xs text-gray-500">
              <span className="font-medium text-gray-700">
                {agent.employeeCode}
              </span>
            </p>
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                {getCategoryLabel(agent.category)}
              </span>
              <span className="text-gray-300">-</span>
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                {getEmploymentLabel(agent.employmentType)}
              </span>
            </div>
          </div>

          <div className="space-y-2 border-t border-[#E2E8F0] pt-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Mail className="h-4 w-4 flex-shrink-0 text-gray-400" />
              <a
                href={`mailto:${agent.email}`}
                className="truncate text-gray-800 hover:text-gray-600 hover:underline"
              >
                {agent.email}
              </a>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone className="h-4 w-4 flex-shrink-0 text-gray-400" />
              <span className="text-gray-800">{agent.phone}</span>
            </div>
          </div>
        </div>

        <div className="border-t border-[#E2E8F0] bg-[#F8FAFC] px-5 py-3">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Joined at {formatDate(agent.joinedDate)}</span>
            <button 
              onClick={() => onViewDetails?.(agent.id)}
              className="font-medium text-gray-700 hover:text-gray-900 hover:underline"
            >
              View details
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
