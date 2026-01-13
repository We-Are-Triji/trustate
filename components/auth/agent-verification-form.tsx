"use client";

import { useState } from "react";
import { Upload, CheckCircle, ArrowLeft, Link as LinkIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { PrcData } from "@/lib/types/registration";

const isDev = process.env.NODE_ENV === "development";

interface AgentVerificationFormProps {
  onSubmit: (prcData: PrcData, nexusLink: string) => void;
  onBack: () => void;
  onDevBypass?: () => void;
}

export function AgentVerificationForm({ onSubmit, onBack, onDevBypass }: AgentVerificationFormProps) {
  const [prcNumber, setPrcNumber] = useState("");
  const [prcFrontImage, setPrcFrontImage] = useState<File | null>(null);
  const [prcBackImage, setPrcBackImage] = useState<File | null>(null);
  const [nexusLink, setNexusLink] = useState("");

  const canSubmit = prcNumber.trim() && prcFrontImage && prcBackImage && nexusLink.trim();

  const handleSubmit = () => {
    if (canSubmit) {
      onSubmit(
        { prcNumber: prcNumber.trim(), prcFrontImage, prcBackImage },
        nexusLink.trim()
      );
    }
  };

  const renderUpload = (label: string, file: File | null, onChange: (file: File) => void) => (
    <div className="space-y-1.5">
      <Label className="text-sm text-gray-600">{label}</Label>
      <label className="flex h-10 cursor-pointer items-center justify-center rounded-md border border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#CBD5E1] px-3">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files?.[0] && onChange(e.target.files[0])}
          className="hidden"
        />
        {file ? (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle size={16} />
            <span className="text-sm truncate max-w-[150px]">{file.name}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-gray-500">
            <Upload className="h-4 w-4" />
            <span className="text-sm">Upload</span>
          </div>
        )}
      </label>
    </div>
  );

  return (
    <>
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
            <CardTitle className="text-xl font-semibold text-gray-800">Agent Verification</CardTitle>
            <p className="text-sm text-gray-500">PRC Accreditation and Broker Connection</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="grid grid-cols-2 gap-x-8 gap-y-4 flex-1">
          <div className="space-y-4">
            <h3 className="font-medium text-gray-800">PRC Accreditation</h3>
            
            <div className="space-y-1.5">
              <Label className="text-sm text-gray-600">PRC Accreditation Number *</Label>
              <Input
                value={prcNumber}
                onChange={(e) => setPrcNumber(e.target.value)}
                placeholder="Enter your PRC number"
                className="border-[#E2E8F0] bg-[#F8FAFC]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {renderUpload("PRC Card (Front) *", prcFrontImage, setPrcFrontImage)}
              {renderUpload("PRC Card (Back) *", prcBackImage, setPrcBackImage)}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-gray-800">Broker Connection</h3>
            
            <div className="space-y-1.5">
              <Label className="text-sm text-gray-600">Broker Nexus Link *</Label>
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

            <div className="rounded-lg bg-blue-50 p-3 text-sm text-blue-800">
              <p className="font-medium mb-1">How to get a Nexus Link?</p>
              <p>Request a Nexus Link from your supervising broker. They can generate this from their Trustate account.</p>
            </div>

            <div className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
              <p className="font-medium mb-1">What happens next?</p>
              <p>After submission, your broker will receive a confirmation request. They have 3 days to approve your registration.</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 mt-4 border-t border-gray-100">
          {isDev && onDevBypass && (
            <Button
              type="button"
              variant="outline"
              onClick={onDevBypass}
              className="border-dashed border-orange-400 text-orange-600 hover:bg-orange-50"
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
    </>
  );
}
