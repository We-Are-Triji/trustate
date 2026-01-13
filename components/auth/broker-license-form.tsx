"use client";

import { useState } from "react";
import { Upload, CheckCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { BrokerLicenseData } from "@/lib/types/registration";

const isDev = process.env.NODE_ENV === "development";

interface BrokerLicenseFormProps {
  onComplete: (data: BrokerLicenseData) => void;
  onBack: () => void;
  onDevBypass?: () => void;
}

export function BrokerLicenseForm({ onComplete, onBack, onDevBypass }: BrokerLicenseFormProps) {
  const [data, setData] = useState<BrokerLicenseData>({
    prcBrokerNumber: "",
    corNumber: "",
    prcFrontImage: null,
    prcBackImage: null,
  });

  const canSubmit =
    data.prcBrokerNumber.trim() && data.corNumber.trim() && data.prcFrontImage && data.prcBackImage;

  const handleSubmit = () => {
    if (canSubmit) onComplete(data);
  };

  const renderUpload = (label: string, file: File | null, field: "prcFrontImage" | "prcBackImage") => (
    <div className="space-y-1.5">
      <Label className="text-sm text-gray-600">{label}</Label>
      <label className="flex h-10 cursor-pointer items-center justify-center rounded-md border border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#CBD5E1] px-3">
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
            <CheckCircle size={16} />
            <span className="text-sm truncate max-w-[200px]">{file.name}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-gray-500">
            <Upload className="h-4 w-4" />
            <span className="text-sm">Upload image</span>
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
            <CardTitle className="text-xl font-semibold text-gray-800">Professional License</CardTitle>
            <p className="text-sm text-gray-500">Step 1 of 3 - PRC Broker Credentials</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          <div className="space-y-1.5">
            <Label className="text-sm text-gray-600">PRC Broker License Number (PIC)</Label>
            <Input
              value={data.prcBrokerNumber}
              onChange={(e) => setData((prev) => ({ ...prev, prcBrokerNumber: e.target.value }))}
              placeholder="Enter PIC number"
              className="border-[#E2E8F0] bg-[#F8FAFC]"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm text-gray-600">Certificate of Registration (COR) Number</Label>
            <Input
              value={data.corNumber}
              onChange={(e) => setData((prev) => ({ ...prev, corNumber: e.target.value }))}
              placeholder="Enter COR number"
              className="border-[#E2E8F0] bg-[#F8FAFC]"
            />
          </div>

          {renderUpload("PRC ID Card (Front)", data.prcFrontImage, "prcFrontImage")}
          {renderUpload("PRC ID Card (Back)", data.prcBackImage, "prcBackImage")}
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
            Continue
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
