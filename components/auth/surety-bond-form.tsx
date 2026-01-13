"use client";

import { useState } from "react";
import { Upload, CheckCircle, ArrowLeft, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { SuretyBondData } from "@/lib/types/registration";

const isDev = process.env.NODE_ENV === "development";

interface SuretyBondFormProps {
  onComplete: (data: SuretyBondData) => void;
  onBack: () => void;
  onDevBypass?: () => void;
}

export function SuretyBondForm({ onComplete, onBack, onDevBypass }: SuretyBondFormProps) {
  const [data, setData] = useState<SuretyBondData>({
    bondPolicyNumber: "",
    bondExpiryDate: "",
    providerName: "",
    bondImage: null,
  });

  const isExpiryValid = data.bondExpiryDate && new Date(data.bondExpiryDate) > new Date();

  const canSubmit =
    data.bondPolicyNumber.trim() && isExpiryValid && data.providerName.trim() && data.bondImage;

  const handleSubmit = () => {
    if (canSubmit) onComplete(data);
  };

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
            <CardTitle className="text-xl font-semibold text-gray-800">Surety Bond</CardTitle>
            <p className="text-sm text-gray-500">Step 2 of 3 - Required under RA 9646</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          <div className="space-y-1.5">
            <Label className="text-sm text-gray-600">Bond Policy Number</Label>
            <Input
              value={data.bondPolicyNumber}
              onChange={(e) => setData((prev) => ({ ...prev, bondPolicyNumber: e.target.value }))}
              placeholder="Enter policy number"
              className="border-[#E2E8F0] bg-[#F8FAFC]"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm text-gray-600">Bond Expiry Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`w-full justify-start text-left font-normal border-[#E2E8F0] ${
                    !data.bondExpiryDate && "text-muted-foreground"
                  } ${data.bondExpiryDate && !isExpiryValid ? "border-red-500" : ""}`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {data.bondExpiryDate ? format(new Date(data.bondExpiryDate), "PPP") : "Select expiry date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={data.bondExpiryDate ? new Date(data.bondExpiryDate) : undefined}
                  onSelect={(date) => {
                    if (date) setData((prev) => ({ ...prev, bondExpiryDate: format(date, "yyyy-MM-dd") }));
                  }}
                  disabled={(date) => date <= new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {data.bondExpiryDate && !isExpiryValid && (
              <p className="text-xs text-red-500">Expiry date must be in the future</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm text-gray-600">Provider Name</Label>
            <Input
              value={data.providerName}
              onChange={(e) => setData((prev) => ({ ...prev, providerName: e.target.value }))}
              placeholder="e.g., GSIS, Pioneer, etc."
              className="border-[#E2E8F0] bg-[#F8FAFC]"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm text-gray-600">Surety Bond Document</Label>
            <label className="flex h-10 cursor-pointer items-center justify-center rounded-md border border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#CBD5E1] px-3">
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  e.target.files?.[0] && setData((prev) => ({ ...prev, bondImage: e.target.files![0] }))
                }
                className="hidden"
              />
              {data.bondImage ? (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle size={16} />
                  <span className="text-sm truncate max-w-[200px]">{data.bondImage.name}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-gray-500">
                  <Upload className="h-4 w-4" />
                  <span className="text-sm">Upload document</span>
                </div>
              )}
            </label>
          </div>
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
