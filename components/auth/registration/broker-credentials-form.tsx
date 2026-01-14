"use client";

import { useState } from "react";
import { Upload, CheckCircle, ArrowLeft, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { BrokerLicenseData, SuretyBondData } from "@/lib/types/registration";

const isDev = process.env.NODE_ENV === "development";

interface BrokerCredentialsFormProps {
  onSubmit: (licenseData: BrokerLicenseData, bondData: SuretyBondData) => void;
  onBack: () => void;
  onDevBypass?: () => void;
}

export function BrokerCredentialsForm({ onSubmit, onBack, onDevBypass }: BrokerCredentialsFormProps) {
  const [license, setLicense] = useState<BrokerLicenseData>({
    prcBrokerNumber: "",
    corNumber: "",
    prcFrontImage: null,
    prcBackImage: null,
  });

  const [bond, setBond] = useState<SuretyBondData>({
    bondPolicyNumber: "",
    bondExpiryDate: "",
    providerName: "",
    bondImage: null,
  });

  const isExpiryValid = bond.bondExpiryDate && new Date(bond.bondExpiryDate) > new Date();

  const canSubmit =
    license.prcBrokerNumber.trim() &&
    license.corNumber.trim() &&
    license.prcFrontImage &&
    license.prcBackImage &&
    bond.bondPolicyNumber.trim() &&
    isExpiryValid &&
    bond.providerName.trim() &&
    bond.bondImage;

  const handleSubmit = () => {
    if (canSubmit) onSubmit(license, bond);
  };

  const renderUpload = (
    label: string,
    file: File | null,
    onChange: (file: File) => void
  ) => (
    <div className="space-y-1.5">
      <Label className="text-sm text-gray-600">{label}</Label>
      <label className="flex h-10 cursor-pointer items-center justify-center rounded-md border border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#CBD5E1] px-3">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files?.[0] && onChange(e.target.files[0])}
          className="hidden"
        />
        {file ? (
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle size={16} />
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
    <>
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
            <CardTitle className="text-2xl font-bold text-[#0247ae] font-[family-name:var(--font-arsenal-sc)]">Broker Credentials</CardTitle>
            <p className="text-sm text-gray-500">Professional License and Surety Bond</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="grid grid-cols-2 gap-x-8 gap-y-4 flex-1">
          <div className="space-y-4">
            <h3 className="font-medium text-[#0247ae]">PRC Broker License</h3>

            <div className="space-y-1.5">
              <Label className="text-sm text-gray-600">PRC Broker License Number (PIC) *</Label>
              <Input
                value={license.prcBrokerNumber}
                onChange={(e) => setLicense((prev) => ({ ...prev, prcBrokerNumber: e.target.value }))}
                placeholder="Enter PIC number"
                className="border-[#E2E8F0] bg-[#F8FAFC]"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm text-gray-600">Certificate of Registration (COR) Number *</Label>
              <Input
                value={license.corNumber}
                onChange={(e) => setLicense((prev) => ({ ...prev, corNumber: e.target.value }))}
                placeholder="Enter COR number"
                className="border-[#E2E8F0] bg-[#F8FAFC]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {renderUpload("PRC ID (Front) *", license.prcFrontImage, (f) =>
                setLicense((prev) => ({ ...prev, prcFrontImage: f }))
              )}
              {renderUpload("PRC ID (Back) *", license.prcBackImage, (f) =>
                setLicense((prev) => ({ ...prev, prcBackImage: f }))
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium text-[#0247ae]">Surety Bond (RA 9646)</h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-sm text-gray-600">Policy Number *</Label>
                <Input
                  value={bond.bondPolicyNumber}
                  onChange={(e) => setBond((prev) => ({ ...prev, bondPolicyNumber: e.target.value }))}
                  placeholder="Enter policy number"
                  className="border-[#E2E8F0] bg-[#F8FAFC]"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm text-gray-600">Provider *</Label>
                <Input
                  value={bond.providerName}
                  onChange={(e) => setBond((prev) => ({ ...prev, providerName: e.target.value }))}
                  placeholder="e.g., GSIS, Pioneer"
                  className="border-[#E2E8F0] bg-[#F8FAFC]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-sm text-gray-600">Expiry Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left font-normal border-[#E2E8F0] ${
                        !bond.bondExpiryDate && "text-muted-foreground"
                      } ${bond.bondExpiryDate && !isExpiryValid ? "border-red-500" : ""}`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {bond.bondExpiryDate ? format(new Date(bond.bondExpiryDate), "PP") : "Select"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={bond.bondExpiryDate ? new Date(bond.bondExpiryDate) : undefined}
                      onSelect={(date) =>
                        date && setBond((prev) => ({ ...prev, bondExpiryDate: format(date, "yyyy-MM-dd") }))
                      }
                      disabled={(date) => date <= new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {bond.bondExpiryDate && !isExpiryValid && (
                  <p className="text-xs text-red-500">Must be future date</p>
                )}
              </div>
              {renderUpload("Bond Document *", bond.bondImage, (f) =>
                setBond((prev) => ({ ...prev, bondImage: f }))
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 mt-4 border-t border-gray-100">
          {isDev && onDevBypass && (
            <Button
              type="button"
              variant="outline"
              onClick={onDevBypass}
              className="border-dashed border-orange-400 text-orange-600 hover:bg-orange-50"
            >
              [DEV] Skip
            </Button>
          )}
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="bg-[#0247ae] hover:bg-[#023a8a] active:bg-[#022d6e] px-8"
          >
            Continue
          </Button>
        </div>
      </CardContent>
    </>
  );
}
