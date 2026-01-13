"use client";

import { useState } from "react";
import { Upload, CheckCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { PrcData } from "@/lib/types/registration";

const isDev = process.env.NODE_ENV === "development";

interface PrcVerificationFormProps {
  onComplete: (data: PrcData) => void;
  onBack: () => void;
  onDevBypass?: () => void;
}

export function PrcVerificationForm({ onComplete, onBack, onDevBypass }: PrcVerificationFormProps) {
  const [prcNumber, setPrcNumber] = useState("");
  const [prcFrontImage, setPrcFrontImage] = useState<File | null>(null);
  const [prcBackImage, setPrcBackImage] = useState<File | null>(null);

  const canSubmit = prcNumber.trim() && prcFrontImage && prcBackImage;

  const handleSubmit = () => {
    if (canSubmit) {
      onComplete({ prcNumber: prcNumber.trim(), prcFrontImage, prcBackImage });
    }
  };

  const renderUpload = (
    label: string,
    file: File | null,
    onChange: (file: File) => void
  ) => (
    <div className="space-y-2">
      <Label className="text-sm text-gray-600">{label}</Label>
      <label className="flex h-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#CBD5E1]">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files?.[0] && onChange(e.target.files[0])}
          className="hidden"
        />
        {file ? (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle size={20} />
            <span className="text-sm truncate max-w-[200px]">{file.name}</span>
          </div>
        ) : (
          <>
            <Upload className="h-6 w-6 text-gray-400" />
            <span className="mt-1 text-sm text-gray-500">Click to upload</span>
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
              PRC Accreditation
            </CardTitle>
            <p className="text-sm text-gray-500">Step 1 of 2: Enter your PRC details</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm text-gray-600">PRC Accreditation Number</Label>
          <Input
            value={prcNumber}
            onChange={(e) => setPrcNumber(e.target.value)}
            placeholder="Enter your PRC number"
            className="border-[#E2E8F0] bg-[#F8FAFC]"
          />
        </div>

        {renderUpload("PRC Card (Front)", prcFrontImage, setPrcFrontImage)}
        {renderUpload("PRC Card (Back)", prcBackImage, setPrcBackImage)}

        <Button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="w-full bg-gray-800 hover:bg-gray-900 active:bg-gray-950"
        >
          Continue
        </Button>

        {isDev && onDevBypass && (
          <Button
            type="button"
            variant="outline"
            onClick={onDevBypass}
            className="w-full border-dashed border-orange-400 text-orange-600 hover:bg-orange-50 active:bg-orange-100"
          >
            [DEV] Skip PRC Verification
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
