"use client";

import { Construction } from "lucide-react";

export default function PropertiesPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-8">
      <div className="text-center max-w-md">
        <div className="mx-auto mb-6 h-20 w-20 rounded-full bg-[#0247ae]/10 flex items-center justify-center">
          <Construction className="h-10 w-10 text-[#0247ae]" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Coming Soon</h2>
        <p className="text-gray-600">
          The Saved Properties feature is currently under development.
        </p>
      </div>
    </div>
  );
}
