"use client";

import { useState } from "react";
import { Upload, CheckCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { BrokerLicenseData } from "@/lib/types/registration";

interface BrokerLicenseFormProps {
  onComplete: (data: BrokerLicenseData) => void;
  onBack: () => void;
}

export function BrokerLicenseForm({ onComplete, onBack }: BrokerLicenseFormProps) {
  const [data, setData] = useState<BrokerLicenseData>({
    prcBrokerNumber: "",
    corNumber: "",
    prcFrontImage: null,
    prcBackImage: null,
  });

  const canSubmit =
    data.prcBrokerNumber.trim() &&
    data.corNumber.trim() &&
    data.prcFrontImage &&
    data.prcBackImage;

  const handleSubmit = () => {
    if (canSubmit) onComplete(data);
  };

  const renderUpload = (
    label: string,
    file: File | null,
    field: "prcFrontImage" | "prcBackImage"
  ) => (
    <div className="space-y-2">
      <Label className="text-sm text-gray-600">{label}</Label>
      <label className="flex h-28 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#CBD5E1]">
        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            e.target.files?.[0] && setData((prev) => ({ ...prev, [field]: e.target.files![0] }))
          }
          className="hidden"
        />
        {file ? (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle size={18} />
            <span className="text-sm truncate max-w-[180px]">{file.name}</span>
          </div>
        ) : (
          <>
            <Upload className="h-5 w-5 text-gray-400" />
            <span className="mt-1 text-xs text-gray-500">Click to upload</span>
          </>
        )}
      </label>
    </div>
  );

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
              Professional License
            </CardTitle>
            <p className="text-sm text-gray-500">Step 1 of 3: PRC Broker Credentials</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm text-gray-600">PRC Broker License Number (PIC)</Label>
          <Input
            value={data.prcBrokerNumber}
            onChange={(e) => setData((prev) => ({ ...prev, prcBrokerNumber: e.target.value }))}
            placeholder="Enter PIC number"
            className="border-[#E2E8F0] bg-[#F8FAFC]"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm text-gray-600">Certificate of Registration (COR) Number</Label>
          <Input
            value={data.corNumber}
            onChange={(e) => setData((prev) => ({ ...prev, corNumber: e.target.value }))}
            placeholder="Enter COR number"
            className="border-[#E2E8F0] bg-[#F8FAFC]"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {renderUpload("PRC ID (Front)", data.prcFrontImage, "prcFrontImage")}
          {renderUpload("PRC ID (Back)", data.prcBackImage, "prcBackImage")}
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="w-full bg-gray-800 hover:bg-gray-900 active:bg-gray-950"
        >
          Continue
        </Button>
      </CardContent>
    </Card>
  );
}
