"use client";

import { useState } from "react";
import { Upload, CheckCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { PH_VALID_IDS, type PhilippineID } from "@/lib/types/registration";

interface IdVerificationFormProps {
  onComplete: (data: { idType: PhilippineID; idImage: File }) => void;
  onBack: () => void;
  stepInfo?: { current: number; total: number };
}

export function IdVerificationForm({ onComplete, onBack, stepInfo }: IdVerificationFormProps) {
  const [idType, setIdType] = useState<PhilippineID | "">("");
  const [idImage, setIdImage] = useState<File | null>(null);

  const handleIdUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setIdImage(file);
  };

  const canSubmit = idType && idImage;

  const handleSubmit = () => {
    if (canSubmit) {
      onComplete({
        idType: idType as PhilippineID,
        idImage: idImage!,
      });
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
              ID Verification
            </CardTitle>
            <p className="text-sm text-gray-500">
              Step {stepInfo?.current ?? 2} of {stepInfo?.total ?? 3}: Upload your government ID
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm text-gray-600">Government ID Type</Label>
          <Select value={idType} onValueChange={(v) => setIdType(v as PhilippineID)}>
            <SelectTrigger className="border-[#E2E8F0] bg-[#F8FAFC]">
              <SelectValue placeholder="Select ID type" />
            </SelectTrigger>
            <SelectContent>
              {PH_VALID_IDS.map((id) => (
                <SelectItem key={id} value={id}>
                  {id}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm text-gray-600">Upload ID Photo</Label>
          <label className="flex h-40 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#CBD5E1]">
            <input type="file" accept="image/*" onChange={handleIdUpload} className="hidden" />
            {idImage ? (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle size={20} />
                <span className="text-sm">{idImage.name}</span>
              </div>
            ) : (
              <>
                <Upload className="h-8 w-8 text-gray-400" />
                <span className="mt-2 text-sm text-gray-500">Click to upload</span>
              </>
            )}
          </label>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="w-full bg-gray-800 hover:bg-gray-900"
        >
          Continue
        </Button>
      </CardContent>
    </Card>
  );
}
