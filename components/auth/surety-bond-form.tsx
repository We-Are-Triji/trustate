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
    <Card className="w-full max-w-2xl border-[#E2E8F0] bg-white shadow-sm">
      <CardHeader className="pb-3">
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
            <CardTitle className="text-lg font-semibold text-gray-800">Surety Bond</CardTitle>
            <p className="text-sm text-gray-500">Step 2 of 3 - Required under RA 9646</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label className="text-sm text-gray-600">Policy Number</Label>
            <Input
              value={data.bondPolicyNumber}
              onChange={(e) => setData((prev) => ({ ...prev, bondPolicyNumber: e.target.value }))}
              placeholder="Enter policy number"
              className="border-[#E2E8F0] bg-[#F8FAFC]"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm text-gray-600">Expiry Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={`w-full justify-start text-left font-normal border-[#E2E8F0] ${
                    !data.bondExpiryDate && "text-muted-foreground"
                  } ${data.bondExpiryDate && !isExpiryValid ? "border-red-500" : ""}`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {data.bondExpiryDate ? format(new Date(data.bondExpiryDate), "PP") : "Select"}
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
              <p className="text-xs text-red-500">Must be future date</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label className="text-sm text-gray-600">Provider</Label>
            <Input
              value={data.providerName}
              onChange={(e) => setData((prev) => ({ ...prev, providerName: e.target.value }))}
              placeholder="e.g., GSIS, Pioneer"
              className="border-[#E2E8F0] bg-[#F8FAFC]"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-1 space-y-1.5">
            <Label className="text-sm text-gray-600">Bond Document</Label>
            <label className="flex h-24 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#CBD5E1]">
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
                  <span className="text-xs truncate max-w-[100px]">{data.bondImage.name}</span>
                </div>
              ) : (
                <>
                  <Upload className="h-5 w-5 text-gray-400" />
                  <span className="mt-1 text-xs text-gray-500">Upload</span>
                </>
              )}
            </label>
          </div>
          <div className="col-span-2 flex items-end justify-end gap-2">
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
              className="bg-gray-800 hover:bg-gray-900 active:bg-gray-950"
            >
              Continue
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
