"use client";

import { useState } from "react";
import { Upload, CheckCircle, ArrowLeft, Building2, Users, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FirmLegitimacyData, FirmType } from "@/lib/types/registration";

const isDev = process.env.NODE_ENV === "development";

interface FirmLegitimacyFormProps {
  onComplete: (data: FirmLegitimacyData) => void;
  onBack: () => void;
  onDevBypass?: () => void;
}

const FIRM_TYPES: { value: FirmType; label: string; regLabel: string; icon: typeof Building2 }[] = [
  { value: "corporation", label: "Corporation", regLabel: "SEC Number", icon: Building2 },
  { value: "partnership", label: "Partnership", regLabel: "SEC Number", icon: Users },
  { value: "sole-proprietorship", label: "Sole Proprietorship", regLabel: "DTI Number", icon: User },
];

export function FirmLegitimacyForm({ onComplete, onBack, onDevBypass }: FirmLegitimacyFormProps) {
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

  const handleSubmit = () => {
    if (canSubmit) onComplete(data);
  };

  const renderUpload = (label: string, file: File | null, field: keyof FirmLegitimacyData) => (
    <div className="space-y-1.5">
      <Label className="text-sm text-gray-600">{label}</Label>
      <label className="flex h-10 cursor-pointer items-center justify-center rounded-md border border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#CBD5E1] px-3">
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
            <CardTitle className="text-xl font-semibold text-gray-800">Firm Legitimacy</CardTitle>
            <p className="text-sm text-gray-500">Corporate Registration and Permits</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {!data.firmType ? (
          <div className="grid grid-cols-3 gap-4">
            {FIRM_TYPES.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => setData((prev) => ({ ...prev, firmType: value }))}
                className="flex flex-col items-center gap-3 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-6 text-center transition-colors hover:border-gray-400 hover:bg-gray-50 active:bg-gray-100"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-800 text-white">
                  <Icon size={24} />
                </div>
                <p className="font-medium text-gray-800">{label}</p>
              </button>
            ))}
          </div>
        ) : (
          <>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Business Type:</span>
              <span className="font-medium text-gray-800">{selectedFirmType?.label}</span>
              <button
                onClick={() => setData((prev) => ({ ...prev, firmType: null }))}
                className="text-blue-600 hover:underline ml-2"
              >
                Change
              </button>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              <div className="space-y-1.5">
                <Label className="text-sm text-gray-600">{selectedFirmType?.regLabel}</Label>
                <Input
                  value={data.registrationNumber}
                  onChange={(e) => setData((prev) => ({ ...prev, registrationNumber: e.target.value }))}
                  placeholder="Enter registration number"
                  className="border-[#E2E8F0] bg-[#F8FAFC]"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-sm text-gray-600">DHSUD Firm Registration Number</Label>
                <Input
                  value={data.dhsudNumber}
                  onChange={(e) => setData((prev) => ({ ...prev, dhsudNumber: e.target.value }))}
                  placeholder="e.g., DHSUD-B-1234"
                  className="border-[#E2E8F0] bg-[#F8FAFC]"
                />
              </div>

              {renderUpload(
                data.firmType === "sole-proprietorship" ? "DTI Certificate" : "SEC Certificate",
                data.registrationDocument,
                "registrationDocument"
              )}
              {renderUpload("Business Permit", data.businessPermit, "businessPermit")}
              {renderUpload("BIR Form 2303", data.birForm2303, "birForm2303")}
              {renderUpload("DHSUD Registration", data.dhsudRegistration, "dhsudRegistration")}
              {renderUpload("Corporate Bond", data.corporateBondImage, "corporateBondImage")}
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
                Complete Registration
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
