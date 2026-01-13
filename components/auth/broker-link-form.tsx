"use client";

import { useState } from "react";
import { ArrowLeft, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const isDev = process.env.NODE_ENV === "development";

interface BrokerLinkFormProps {
  onSubmit: (nexusLink: string) => void;
  onBack: () => void;
  onDevBypass?: () => void;
}

export function BrokerLinkForm({ onSubmit, onBack, onDevBypass }: BrokerLinkFormProps) {
  const [nexusLink, setNexusLink] = useState("");

  const canSubmit = nexusLink.trim().length > 0;

  const handleSubmit = () => {
    if (canSubmit) onSubmit(nexusLink.trim());
  };

  return (
    <Card className="w-full max-w-4xl border-[#E2E8F0] bg-white shadow-sm">
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
            <CardTitle className="text-xl font-semibold text-gray-800">Broker Connection</CardTitle>
            <p className="text-sm text-gray-500">Step 2 of 2 - Link to your supervising broker</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          <div className="space-y-1.5">
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

          <div className="flex items-end">
            <p className="text-sm text-gray-500">
              Request a Nexus Link from your supervising broker. They can generate this from their Trustate account.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          {isDev && onDevBypass && (
            <Button
              type="button"
              variant="outline"
              onClick={onDevBypass}
              className="border-dashed border-orange-400 text-orange-600 hover:bg-orange-50 active:bg-orange-100"
            >
              [DEV] Skip
            </Button>
          )}
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="bg-gray-800 hover:bg-gray-900 active:bg-gray-950 px-8"
          >
            Submit Registration
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
