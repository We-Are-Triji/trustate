"use client";

import { useState } from "react";
import { CheckCircle, X, CreditCard, Camera, Sun, FileCheck } from "lucide-react";
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
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const handleSubmit = () => {
    if (idType && idImage) {
      onSubmit({ idType: idType as PhilippineID, idImage });
    }
  };

  const handleDevBypass = () => {
    const timestamp = Date.now();
    setIdType("Philippine Passport");
    
    const fakeBlob = new Blob(['fake-id-image'], { type: 'image/png' });
    const fakeId = new File([fakeBlob], `id-${timestamp}.png`, { type: 'image/png' });
    setIdImage(fakeId);
    
    setTimeout(() => {
      onSubmit({ idType: "Philippine Passport", idImage: fakeId });
    }, 100);
  };

  const handleClose = () => {
    if (idType || idImage) {
      setShowExitConfirm(true);
    } else {
      onBack();
    }
  };

  return (
    <>
      <CardHeader className="pb-2 pt-6">
        <div className="flex items-center">
          <button
            type="button"
            onClick={handleClose}
            className="mr-2 h-8 w-8 p-0 text-gray-500 hover:text-gray-700 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            <X size={18} />
          </button>
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
          <div className="w-full max-w-3xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
                <p className="font-medium mb-2">Tips for a clear photo</p>
                <ul className="space-y-1.5">
                  <li className="flex items-center gap-2">
                    <Camera size={14} className="shrink-0" />
                    <span>Ensure all text is readable</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Sun size={14} className="shrink-0" />
                    <span>Use good lighting, avoid glare</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <FileCheck size={14} className="shrink-0" />
                    <span>Capture all four corners</span>
                  </li>
                </ul>
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

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-600">
                  Upload {idType || "ID"} *
                </label>
                <label className={`flex h-32 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed bg-gray-50/50 transition-all duration-200 ${!idType ? "border-gray-200 opacity-50 pointer-events-none" : "border-gray-200 hover:border-[#0247ae] hover:bg-[#0247ae]/5"}`}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && setIdImage(e.target.files[0])}
                    className="hidden"
                    disabled={!idType}
                  />
                  {idImage ? (
                    <div className="flex flex-col items-center gap-1 text-green-600">
                      <CheckCircle size={28} />
                      <span className="text-sm font-medium">{idImage.name}</span>
                      <span className="text-xs text-gray-500">Click to change</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4 text-gray-500">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100">
                        <CreditCard size={24} className="text-gray-400" />
                      </div>
                      <div>
                        <span className="text-sm font-medium block">Click to upload</span>
                        <span className="text-xs">PNG, JPG up to 10MB</span>
                      </div>
                    </div>
                  )}
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end pt-4 mt-4 border-t border-gray-100">
          <div className="flex gap-2">
            {isDev && onDevBypass && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleDevBypass}
                className="border-dashed border-orange-400 text-orange-600 hover:bg-orange-50 h-9"
              >
                [DEV] Fill & Skip
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

      {showExitConfirm && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 rounded-2xl">
          <div className="bg-white rounded-xl p-6 max-w-sm mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Exit Verification?</h3>
            <p className="text-sm text-gray-600 mb-4">Your progress will not be saved. Are you sure you want to exit?</p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowExitConfirm(false)}
              >
                Continue
              </Button>
              <Button
                className="flex-1 bg-red-600 hover:bg-red-700"
                onClick={onBack}
              >
                Exit
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
