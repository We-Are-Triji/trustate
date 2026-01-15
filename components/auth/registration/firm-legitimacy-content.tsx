"use client";

import { useState } from "react";
import { Upload, CheckCircle, ArrowLeft, Building2, Users, User, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { FirmLegitimacyData, FirmType } from "@/lib/types/registration";

const isDev = process.env.NODE_ENV === "development";

interface FirmLegitimacyContentProps {
  onComplete: (data: FirmLegitimacyData) => void;
  onBack: () => void;
  onDevBypass?: () => void;
}

const FIRM_TYPES: { value: FirmType; label: string; regLabel: string; icon: typeof Building2 }[] = [
  { value: "corporation", label: "Corporation", regLabel: "SEC Number", icon: Building2 },
  { value: "partnership", label: "Partnership", regLabel: "SEC Number", icon: Users },
  { value: "sole-proprietorship", label: "Sole Proprietorship", regLabel: "DTI Number", icon: User },
];

export function FirmLegitimacyContent({ onComplete, onBack, onDevBypass }: FirmLegitimacyContentProps) {
  const [selectedType, setSelectedType] = useState<FirmType | null>(null);
  const [data, setData] = useState<FirmLegitimacyData>({
    firmType: null,
    registrationNumber: "",
    registrationDocument: null,
    businessPermit: null,
    birForm2303: null,
    dhsudNumber: "",
    dhsudRegistration: null,
    corporateBondImage: null,
  });

  const selectedFirmType = FIRM_TYPES.find((f) => f.value === data.firmType);

  const canSubmit =
    data.firmType &&
    data.registrationNumber.trim() &&
    data.registrationDocument &&
    data.businessPermit &&
    data.birForm2303 &&
    data.dhsudNumber.trim() &&
    data.dhsudRegistration &&
    data.corporateBondImage;

  const handleContinueToForm = () => {
    if (selectedType) setData((prev) => ({ ...prev, firmType: selectedType }));
  };

  const handleSubmit = () => {
    if (canSubmit) onComplete(data);
  };

  const inputClass = "h-11 w-full rounded-lg border-2 border-gray-200 bg-white px-4 text-gray-700 placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:border-[#0247ae] focus:ring-2 focus:ring-[#0247ae]/10";

  const renderUpload = (label: string, file: File | null, field: keyof FirmLegitimacyData) => (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-gray-600">{label}</label>
      <label className="flex h-11 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50/50 hover:border-[#0247ae] hover:bg-[#0247ae]/5 transition-all duration-200 px-3">
        <input
          type="file"
          accept="image/*,.pdf"
          onChange={(e) =>
            e.target.files?.[0] && setData((prev) => ({ ...prev, [field]: e.target.files![0] }))
          }
          className="hidden"
        />
        {file ? (
          <div className="flex items-center gap-1.5 text-green-600">
            <CheckCircle size={14} />
            <span className="text-sm truncate max-w-[100px]">{file.name}</span>
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
      <CardHeader className="pb-2 pt-8 animate-[fadeInUp_0.5s_ease-out]">
        <div className="text-center">
          <CardTitle className="text-3xl font-bold text-[#0247ae] font-[family-name:var(--font-arsenal-sc)]">
            Firm Legitimacy
          </CardTitle>
          <p className="text-gray-500 mt-1">Corporate Registration and Permits</p>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col px-8 pb-6">
        {!data.firmType ? (
          <div className="flex-1 flex flex-col">
            <div className="flex-1 flex items-center justify-center">
              <div className="grid grid-cols-3 gap-6 w-full max-w-4xl">
              {FIRM_TYPES.map(({ value, label, icon: Icon }, index) => (
                <button
                  key={value}
                  onClick={() => setSelectedType(value)}
                  className={`group flex flex-col items-center gap-4 rounded-xl border-2 bg-white p-6 text-center transition-all duration-300 hover:-translate-y-1 active:translate-y-0 animate-[fadeInUp_0.5s_ease-out_both] ${
                    selectedType === value
                      ? "border-[#0247ae] shadow-lg shadow-[#0247ae]/20 ring-2 ring-[#0247ae]/20"
                      : "border-gray-100 hover:border-[#0247ae] hover:shadow-lg hover:shadow-[#0247ae]/10"
                  }`}
                  style={{ animationDelay: `${0.1 + index * 0.1}s` }}
                >
                  <div className={`flex h-14 w-14 items-center justify-center rounded-xl text-white shadow-lg transition-transform duration-300 ${
                    selectedType === value
                      ? "bg-gradient-to-br from-[#0247ae] to-[#0560d4] shadow-[#0247ae]/30 scale-110"
                      : "bg-gradient-to-br from-[#0247ae] to-[#0560d4] shadow-[#0247ae]/30 group-hover:scale-110"
                  }`}>
                    <Icon size={28} />
                  </div>
                  <p className="font-bold text-[#0247ae] text-base">{label}</p>
                  <div className={`flex items-center gap-1 text-sm font-medium transition-opacity ${
                    selectedType === value
                      ? "text-[#d4a900] opacity-100"
                      : "text-[#0247ae] opacity-0 group-hover:opacity-100"
                  }`}>
                    {selectedType === value ? (
                      <>
                        <CheckCircle size={14} className="text-[#ffce08]" />
                        Selected
                      </>
                    ) : (
                      "Click to select"
                    )}
                  </div>
                </button>
              ))}
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
              <Button
                onClick={handleContinueToForm}
                disabled={!selectedType}
                className="bg-[#0247ae] hover:bg-[#023a8a] active:bg-[#022d6e] px-6 h-9 text-sm font-semibold shadow-lg shadow-[#0247ae]/25 hover:shadow-xl hover:shadow-[#0247ae]/30 transition-all duration-200 disabled:opacity-50 disabled:shadow-none"
              >
                Continue
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-6 animate-[fadeInUp_0.3s_ease-out]">
              <div className="h-10 w-10 rounded-xl bg-[#0247ae]/10 flex items-center justify-center">
                {selectedFirmType && <selectedFirmType.icon className="h-5 w-5 text-[#0247ae]" />}
              </div>
              <div>
                <span className="text-sm text-gray-500">Business Type:</span>
                <span className="font-semibold text-[#0247ae] ml-2">{selectedFirmType?.label}</span>
              </div>
              <button
                onClick={() => { setSelectedType(null); setData((prev) => ({ ...prev, firmType: null })); }}
                className="text-sm font-medium text-[#0247ae] hover:text-[#ffce08] transition-colors ml-auto"
              >
                Change
              </button>
            </div>

            <div className="grid grid-cols-2 gap-x-10 flex-1">
              {/* Left Column */}
              <div className="space-y-5 animate-[fadeInUp_0.5s_ease-out_0.1s_both]">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                  <Building2 className="h-5 w-5 text-[#0247ae]" />
                  <h3 className="font-semibold text-[#0247ae]">Business Registration</h3>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-600">{selectedFirmType?.regLabel} *</label>
                  <input
                    value={data.registrationNumber}
                    onChange={(e) => setData((prev) => ({ ...prev, registrationNumber: e.target.value }))}
                    placeholder="Enter registration number"
                    className={inputClass}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-600">DHSUD Firm Registration Number *</label>
                  <input
                    value={data.dhsudNumber}
                    onChange={(e) => setData((prev) => ({ ...prev, dhsudNumber: e.target.value }))}
                    placeholder="e.g., DHSUD-B-1234"
                    className={inputClass}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {renderUpload(
                    data.firmType === "sole-proprietorship" ? "DTI Certificate *" : "SEC Certificate *",
                    data.registrationDocument,
                    "registrationDocument"
                  )}
                  {renderUpload("Business Permit *", data.businessPermit, "businessPermit")}
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-5 animate-[fadeInUp_0.5s_ease-out_0.2s_both]">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
                  <FileText className="h-5 w-5 text-[#0247ae]" />
                  <h3 className="font-semibold text-[#0247ae]">Required Documents</h3>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {renderUpload("BIR Form 2303 *", data.birForm2303, "birForm2303")}
                  {renderUpload("DHSUD Registration *", data.dhsudRegistration, "dhsudRegistration")}
                </div>

                {renderUpload("Corporate Surety Bond *", data.corporateBondImage, "corporateBondImage")}

                <div className="rounded-xl bg-[#0247ae]/5 p-4 border border-[#0247ae]/10">
                  <p className="text-sm text-gray-600">Corporate bond amount is typically higher than individual bond.</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 mt-6 border-t border-gray-100 animate-[fadeInUp_0.5s_ease-out_0.3s_both]">
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
                  Complete Registration
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </>
  );
}
