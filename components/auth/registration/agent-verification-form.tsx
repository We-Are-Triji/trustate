"use client";

import { useState } from "react";
import { Upload, CheckCircle, ArrowLeft, Link as LinkIcon, Award, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

  const inputClass = "h-9 w-full rounded-lg border-2 border-gray-200 bg-white px-4 text-gray-700 placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:border-[#0247ae] focus:ring-2 focus:ring-[#0247ae]/10";

  const renderUpload = (label: string, file: File | null, onChange: (file: File) => void) => (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-600">{label}</label>
      <label className="flex h-9 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50/50 hover:border-[#0247ae] hover:bg-[#0247ae]/5 transition-all duration-200 px-3">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files?.[0] && onChange(e.target.files[0])}
          className="hidden"
        />
        {file ? (
          <div className="flex items-center gap-2 text-[#d4a900]">
            <CheckCircle size={14} className="text-[#ffce08]" />
            <span className="text-xs truncate max-w-[100px]">{file.name}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-gray-500">
            <Upload className="h-4 w-4" />
            <span className="text-xs">Upload</span>
          </div>
        )}
      </label>
    </div>
  );

  return (
    <>
      <CardHeader className="pb-1 pt-5 animate-[fadeInUp_0.5s_ease-out]">
        <div className="text-center">
          <CardTitle className="text-2xl font-bold text-[#0247ae] font-[family-name:var(--font-arsenal-sc)]">
            Agent Verification
          </CardTitle>
          <p className="text-gray-500 text-sm">PRC Accreditation and Broker Connection</p>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col px-6 pb-4">
        <div className="grid grid-cols-2 gap-x-8 flex-1">
          {/* Left Column - PRC Accreditation */}
          <div className="space-y-3 animate-[fadeInUp_0.5s_ease-out_0.1s_both]">
            <div className="flex items-center gap-2 pb-1 border-b border-gray-100">
              <Award className="h-4 w-4 text-[#0247ae]" />
              <h3 className="font-semibold text-[#0247ae] text-sm">PRC Accreditation</h3>
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600">PRC Accreditation Number *</label>
              <input
                value={prcNumber}
                onChange={(e) => setPrcNumber(e.target.value)}
                placeholder="Enter your PRC number"
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {renderUpload("PRC Card (Front) *", prcFrontImage, setPrcFrontImage)}
              {renderUpload("PRC Card (Back) *", prcBackImage, setPrcBackImage)}
            </div>
          </div>

          {/* Right Column - Broker Connection */}
          <div className="space-y-3 animate-[fadeInUp_0.5s_ease-out_0.2s_both]">
            <div className="flex items-center gap-2 pb-1 border-b border-gray-100">
              <Users className="h-4 w-4 text-[#0247ae]" />
              <h3 className="font-semibold text-[#0247ae] text-sm">Broker Connection</h3>
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600">Broker Nexus Link *</label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  value={nexusLink}
                  onChange={(e) => setNexusLink(e.target.value)}
                  placeholder="Enter broker's nexus link"
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>

            <div className="rounded-lg bg-[#0247ae]/5 p-3 border border-[#0247ae]/10">
              <p className="font-semibold text-[#0247ae] mb-0.5 text-xs">How to get a Nexus Link?</p>
              <p className="text-xs text-gray-600 leading-relaxed">Request from your supervising broker. They can generate this from their TruState account.</p>
            </div>

            <div className="rounded-lg bg-[#ffce08]/10 p-3 border border-[#ffce08]/20">
              <p className="font-semibold text-[#0247ae] mb-0.5 text-xs">What happens next?</p>
              <p className="text-xs text-gray-600 leading-relaxed">Your broker will receive a confirmation request. They have 3 days to approve.</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 mt-3 border-t border-gray-100 animate-[fadeInUp_0.5s_ease-out_0.3s_both]">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onBack}
            className="h-9 px-4 text-gray-600 hover:text-[#0247ae] hover:border-[#0247ae]"
          >
            <ArrowLeft size={16} className="mr-1" />
            Previous
          </Button>
          <div className="flex gap-2">
            {isDev && onDevBypass && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onDevBypass}
                className="border-dashed border-orange-400 text-orange-600 hover:bg-orange-50 h-9"
              >
                [DEV] Skip
              </Button>
            )}
            <Button
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="bg-[#0247ae] hover:bg-[#023a8a] active:bg-[#022d6e] px-6 h-9 text-sm font-semibold shadow-lg shadow-[#0247ae]/25 hover:shadow-xl hover:shadow-[#0247ae]/30 transition-all duration-200 disabled:opacity-50 disabled:shadow-none"
            >
              Submit Registration
            </Button>
          </div>
        </div>
      </CardContent>
    </>
  );
}
