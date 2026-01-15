"use client";

import { useState } from "react";
import { Upload, CheckCircle, ArrowLeft, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PH_VALID_IDS, type PhilippineID } from "@/lib/types/registration";

const isDev = process.env.NODE_ENV === "development";

interface IdVerificationFormProps {
  onSubmit: (data: { idType: PhilippineID; idImage: File }) => void;
  onBack: () => void;
  onDevBypass?: () => void;
}

export function IdVerificationForm({ onSubmit, onBack, onDevBypass }: IdVerificationFormProps) {
  const [idType, setIdType] = useState<PhilippineID | "">("");
  const [idImage, setIdImage] = useState<File | null>(null);

  const handleSubmit = () => {
    if (idType && idImage) {
      onSubmit({ idType: idType as PhilippineID, idImage });
    }
  };

  return (
    <>
      <CardHeader className="pb-2 pt-6">
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
            <CardTitle className="text-2xl font-bold text-[#0247ae] font-[family-name:var(--font-arsenal-sc)]">
              ID Verification
            </CardTitle>
            <p className="text-gray-500 text-sm">Upload a valid government-issued ID</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col px-6 pb-4">
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-lg space-y-6">
            <div className="rounded-xl bg-blue-50 p-4 text-sm text-blue-800">
              <p className="font-medium mb-1">Accepted IDs</p>
              <p>Philippine Passport, Driver&apos;s License, UMID, National ID (PhilSys), and other government-issued IDs.</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">Select ID Type *</label>
              <Select value={idType} onValueChange={(v) => setIdType(v as PhilippineID)}>
                <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-[#0247ae]">
                  <SelectValue placeholder="Choose your ID type" />
                </SelectTrigger>
                <SelectContent>
                  {PH_VALID_IDS.map((id) => (
                    <SelectItem key={id} value={id}>{id}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">
                Upload {idType || "ID"} *
              </label>
              <label className={`flex h-40 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed bg-gray-50/50 transition-all duration-200 ${!idType ? "border-gray-200 opacity-50 pointer-events-none" : "border-gray-200 hover:border-[#0247ae] hover:bg-[#0247ae]/5"}`}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && setIdImage(e.target.files[0])}
                  className="hidden"
                  disabled={!idType}
                />
                {idImage ? (
                  <div className="flex flex-col items-center gap-2 text-green-600">
                    <CheckCircle size={32} />
                    <span className="text-sm font-medium">{idImage.name}</span>
                    <span className="text-xs text-gray-500">Click to change</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-gray-500">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gray-100">
                      <CreditCard size={28} className="text-gray-400" />
                    </div>
                    <span className="text-sm font-medium">Click to upload</span>
                    <span className="text-xs">PNG, JPG up to 10MB</span>
                  </div>
                )}
              </label>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-100">
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
              disabled={!idType || !idImage}
              className="bg-[#0247ae] hover:bg-[#023a8a] px-6 h-9 text-sm font-semibold disabled:opacity-50"
            >
              Continue
            </Button>
          </div>
        </div>
      </CardContent>
    </>
  );
}
