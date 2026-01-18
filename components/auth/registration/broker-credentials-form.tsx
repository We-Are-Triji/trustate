"use client";

import { useState } from "react";
import { Upload, CheckCircle, ArrowLeft, CalendarIcon, Award, Shield } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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

  const inputClass = (hasError?: boolean) => 
    `h-9 w-full rounded-lg border-2 bg-white px-4 text-gray-700 placeholder:text-gray-400 transition-all duration-200 focus:outline-none ${
      hasError 
        ? "border-red-400 focus:border-red-500" 
        : "border-gray-200 focus:border-[#0247ae] focus:ring-2 focus:ring-[#0247ae]/10"
    }`;

  const renderUpload = (
    label: string,
    file: File | null,
    onChange: (file: File) => void
  ) => (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-600">{label}</label>
      <label className="flex h-9 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-200 bg-gray-50/50 hover:border-[#0247ae] hover:bg-[#0247ae]/5 transition-all duration-200 px-3">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => e.target.files?.[0] && onChange(e.target.files[0])}
          className="hidden"
        />
        {file ? (
          <div className="flex items-center gap-2 text-[#d4a900]">
            <CheckCircle size={14} className="text-[#ffce08]" />
            <span className="text-xs truncate max-w-[100px]">{file.name}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-gray-500">
            <Upload className="h-4 w-4" />
            <span className="text-xs">Upload</span>
          </div>
        )}
      </label>
    </div>
  );

  return (
    <>
      <CardHeader className="pb-1 pt-5 animate-[fadeInUp_0.5s_ease-out]">
        <div className="text-center">
          <CardTitle className="text-2xl font-bold text-[#0247ae] font-[family-name:var(--font-arsenal-sc)]">
            Broker Credentials
          </CardTitle>
          <p className="text-gray-500 text-sm">Professional License and Surety Bond</p>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col px-6 pb-4">
        <div className="grid grid-cols-2 gap-x-8 flex-1">
          {/* Left Column - PRC License */}
          <div className="space-y-3 animate-[fadeInUp_0.5s_ease-out_0.1s_both]">
            <div className="flex items-center gap-2 pb-1 border-b border-gray-100">
              <Award className="h-4 w-4 text-[#0247ae]" />
              <h3 className="font-semibold text-[#0247ae] text-sm">PRC Broker License</h3>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600">PRC Broker License Number (PIC) *</label>
              <input
                value={license.prcBrokerNumber}
                onChange={(e) => setLicense((prev) => ({ ...prev, prcBrokerNumber: e.target.value }))}
                placeholder="Enter PIC number"
                className={inputClass()}
              />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600">Certificate of Registration (COR) Number *</label>
              <input
                value={license.corNumber}
                onChange={(e) => setLicense((prev) => ({ ...prev, corNumber: e.target.value }))}
                placeholder="Enter COR number"
                className={inputClass()}
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

          {/* Right Column - Surety Bond */}
          <div className="space-y-3 animate-[fadeInUp_0.5s_ease-out_0.2s_both]">
            <div className="flex items-center gap-2 pb-1 border-b border-gray-100">
              <Shield className="h-4 w-4 text-[#0247ae]" />
              <h3 className="font-semibold text-[#0247ae] text-sm">Surety Bond (RA 9646)</h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-600">Policy Number *</label>
                <input
                  value={bond.bondPolicyNumber}
                  onChange={(e) => setBond((prev) => ({ ...prev, bondPolicyNumber: e.target.value }))}
                  placeholder="Enter policy number"
                  className={inputClass()}
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-600">Provider *</label>
                <input
                  value={bond.providerName}
                  onChange={(e) => setBond((prev) => ({ ...prev, providerName: e.target.value }))}
                  placeholder="e.g., GSIS, Pioneer"
                  className={inputClass()}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-600">Expiry Date *</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <button
                      type="button"
                      className={`h-9 w-full rounded-lg border-2 bg-white px-4 text-left flex items-center transition-all duration-200 focus:outline-none ${
                        bond.bondExpiryDate && !isExpiryValid 
                          ? "border-red-400" 
                          : "border-gray-200 hover:border-gray-300 focus:border-[#0247ae] focus:ring-2 focus:ring-[#0247ae]/10"
                      } ${!bond.bondExpiryDate ? "text-gray-400" : "text-gray-700"}`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-gray-400" />
                      <span className="text-sm">{bond.bondExpiryDate ? format(new Date(bond.bondExpiryDate), "PP") : "Select"}</span>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={bond.bondExpiryDate ? new Date(bond.bondExpiryDate) : undefined}
                      onSelect={(date) =>
                        date && setBond((prev) => ({ ...prev, bondExpiryDate: format(date, "yyyy-MM-dd") }))
                      }
                      disabled={(date) => date <= new Date()}
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

        <div className="flex items-center justify-between pt-4 mt-3 border-t border-gray-100 animate-[fadeInUp_0.5s_ease-out_0.3s_both]">
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
              disabled={!canSubmit}
              className="bg-[#0247ae] hover:bg-[#023a8a] active:bg-[#022d6e] px-6 h-9 text-sm font-semibold shadow-lg shadow-[#0247ae]/25 hover:shadow-xl hover:shadow-[#0247ae]/30 transition-all duration-200 disabled:opacity-50 disabled:shadow-none"
            >
              Continue
            </Button>
          </div>
        </div>
      </CardContent>
    </>
  );
}
