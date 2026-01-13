"use client";

import { useState } from "react";
import { ArrowLeft, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BrokerLinkFormProps {
  onSubmit: (nexusLink: string) => void;
  onBack: () => void;
}

export function BrokerLinkForm({ onSubmit, onBack }: BrokerLinkFormProps) {
  const [nexusLink, setNexusLink] = useState("");

  const canSubmit = nexusLink.trim().length > 0;

  const handleSubmit = () => {
    if (canSubmit) {
      onSubmit(nexusLink.trim());
    }
  };

  return (
    <Card className="w-full max-w-md border-[#E2E8F0] bg-white shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="mr-2 h-8 w-8 p-0 text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft size={18} />
          </Button>
          <div className="flex-1 text-center pr-10">
            <CardTitle className="text-xl font-semibold text-gray-800">
              Broker Connection
            </CardTitle>
            <p className="text-sm text-gray-500">Step 5 of 5: Link to your supervising broker</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-800">
          <p>
            Request a Nexus Link from your supervising broker. They can generate
            this from their Trustate account.
          </p>
        </div>

        <div className="space-y-2">
          <Label className="text-sm text-gray-600">Broker Nexus Link</Label>
          <div className="relative">
            <LinkIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              value={nexusLink}
              onChange={(e) => setNexusLink(e.target.value)}
              placeholder="Enter broker's nexus link"
              className="border-[#E2E8F0] bg-[#F8FAFC] pl-10"
            />
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="w-full bg-gray-800 hover:bg-gray-900"
        >
          Submit Registration
        </Button>
      </CardContent>
    </Card>
  );
}
