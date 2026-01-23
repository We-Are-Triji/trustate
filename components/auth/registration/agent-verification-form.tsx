"use client";

import { useState } from "react";
import { Upload, CheckCircle, ArrowLeft, Link as LinkIcon, Award, Users, Loader2, User, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PrcData } from "@/lib/types/registration";
import { useAuth } from "@/lib/hooks/use-auth";

const isDev = process.env.NODE_ENV === "development";

interface BrokerInfo {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  picture: string | null;
}

interface AgentVerificationFormProps {
  onSubmit: (prcData: PrcData, nexusLink: string) => void;
  onBack: () => void;
  onDevBypass?: () => void;
  onPrcComplete?: () => void;
}

type Step = "prc-form" | "nexus-validation" | "broker-preview" | "totp-verification";

export function AgentVerificationForm({ onSubmit, onBack, onDevBypass, onPrcComplete }: AgentVerificationFormProps) {
  const { userId } = useAuth();
  const [step, setStep] = useState<Step>("prc-form");
  const [prcNumber, setPrcNumber] = useState("");
  const [prcFrontImage, setPrcFrontImage] = useState<File | null>(null);
  const [prcBackImage, setPrcBackImage] = useState<File | null>(null);
  const [nexusLink, setNexusLink] = useState("");
  const [nexusCode, setNexusCode] = useState("");
  const [brokerInfo, setBrokerInfo] = useState<BrokerInfo | null>(null);
  const [totpCode, setTotpCode] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");

  const canSubmitPrc = prcNumber.trim() && prcFrontImage && prcBackImage;

  const handlePrcContinue = () => {
    if (canSubmitPrc) {
      onPrcComplete?.();
      setStep("nexus-validation");
    }
  };

  const handleDevBypassPrc = () => {
    // Generate unique fake data
    const timestamp = Date.now();
    setPrcNumber(`PRC-${timestamp}`);
    
    // Create fake image files
    const fakeBlob = new Blob(['fake-image-data'], { type: 'image/png' });
    const fakeFront = new File([fakeBlob], `prc-front-${timestamp}.png`, { type: 'image/png' });
    const fakeBack = new File([fakeBlob], `prc-back-${timestamp}.png`, { type: 'image/png' });
    
    setPrcFrontImage(fakeFront);
    setPrcBackImage(fakeBack);
    
    // Auto-continue after a brief moment
    setTimeout(() => {
      onPrcComplete?.();
      setStep("nexus-validation");
    }, 100);
  };

  const handleValidateNexus = async () => {
    if (!nexusLink.trim()) return;

    setIsValidating(true);
    setError("");

    try {
      const res = await fetch("/api/broker/nexus/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nexusLink: nexusLink.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to validate nexus link");
        return;
      }

      setNexusCode(data.nexusCode);
      setBrokerInfo(data.broker);
      setStep("broker-preview");
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsValidating(false);
    }
  };

  const handleConfirmBroker = () => {
    setStep("totp-verification");
  };

  const handleChangeBroker = () => {
    setStep("nexus-validation");
    setBrokerInfo(null);
    setNexusCode("");
    setNexusLink("");
    setError("");
  };

  const handleVerifyCode = async () => {
    if (totpCode.length !== 6) return;

    setIsVerifying(true);
    setError("");

    try {
      const res = await fetch("/api/broker/nexus/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nexusCode,
          totpCode,
          agentId: userId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid verification code");
        return;
      }

      onSubmit(
        { prcNumber: prcNumber.trim(), prcFrontImage, prcBackImage },
        nexusLink.trim()
      );
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const inputClass = "h-9 w-full rounded-lg border-2 border-gray-200 bg-white px-4 text-gray-700 placeholder:text-gray-400 transition-all duration-200 focus:outline-none focus:border-[#0247ae] focus:ring-2 focus:ring-[#0247ae]/10";

  const renderUpload = (label: string, file: File | null, onChange: (file: File) => void) => (
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

  // PRC Form Step
  if (step === "prc-form") {
    return (
      <>
        <CardHeader className="pb-1 pt-5 animate-[fadeInUp_0.5s_ease-out]">
          <div className="text-center">
            <CardTitle className="text-2xl font-bold text-[#0247ae] font-[family-name:var(--font-arsenal-sc)]">
              Agent Verification
            </CardTitle>
            <p className="text-gray-500 text-sm">PRC Accreditation Details</p>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col px-6 pb-4">
          <div className="max-w-md mx-auto w-full space-y-4 flex-1 flex flex-col justify-center">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-100">
              <Award className="h-4 w-4 text-[#0247ae]" />
              <h3 className="font-semibold text-[#0247ae] text-sm">PRC Accreditation</h3>
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-600">PRC Accreditation Number *</label>
              <input
                value={prcNumber}
                onChange={(e) => setPrcNumber(e.target.value)}
                placeholder="Enter your PRC number"
                className={inputClass}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {renderUpload("PRC Card (Front) *", prcFrontImage, setPrcFrontImage)}
              {renderUpload("PRC Card (Back) *", prcBackImage, setPrcBackImage)}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 mt-3 border-t border-gray-100">
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
                  onClick={handleDevBypassPrc}
                  className="border-dashed border-orange-400 text-orange-600 hover:bg-orange-50 h-9"
                >
                  [DEV] Fill & Skip
                </Button>
              )}
              <Button
                onClick={handlePrcContinue}
                disabled={!canSubmitPrc}
                className="bg-[#0247ae] hover:bg-[#023a8a] px-6 h-9"
              >
                Continue
              </Button>
            </div>
          </div>
        </CardContent>
      </>
    );
  }

  // Nexus Validation Step
  if (step === "nexus-validation") {
    return (
      <>
        <CardHeader className="pb-1 pt-5 animate-[fadeInUp_0.5s_ease-out]">
          <div className="text-center">
            <CardTitle className="text-2xl font-bold text-[#0247ae] font-[family-name:var(--font-arsenal-sc)]">
              Connect to Broker
            </CardTitle>
            <p className="text-gray-500 text-sm">Enter your broker's nexus link</p>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col items-center justify-center px-6 pb-4">
          <div className="bg-white border-2 border-gray-200 rounded-xl p-6 max-w-md w-full space-y-4">
            <div className="text-center space-y-2">
              <div className="h-12 w-12 rounded-full bg-[#0247ae]/10 flex items-center justify-center mx-auto">
                <Users size={24} className="text-[#0247ae]" />
              </div>
              <p className="text-sm text-gray-600">
                Request the nexus link from your supervising broker
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">Broker Nexus Link *</label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  value={nexusLink}
                  onChange={(e) => {
                    setNexusLink(e.target.value);
                    setError("");
                  }}
                  placeholder="https://trustate.com/nexus/XXXXXXXX"
                  className="h-10 w-full pl-10 pr-4 rounded-lg border-2 border-gray-200 bg-white focus:outline-none focus:border-[#0247ae] focus:ring-2 focus:ring-[#0247ae]/10"
                />
              </div>
              {error && (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}
            </div>

            <div className="rounded-lg bg-[#0247ae]/5 p-3 border border-[#0247ae]/10">
              <p className="font-semibold text-[#0247ae] mb-1 text-xs">Expected Format</p>
              <p className="text-xs text-gray-600 font-mono">https://trustate.com/nexus/XXXXXXXX</p>
            </div>

            <Button
              onClick={handleValidateNexus}
              disabled={!nexusLink.trim() || isValidating}
              className="w-full bg-[#0247ae] hover:bg-[#023a8a] h-10"
            >
              {isValidating ? (
                <>
                  <Loader2 size={16} className="animate-spin mr-2" />
                  Validating...
                </>
              ) : (
                "Validate Link"
              )}
            </Button>
          </div>

          <Button
            variant="ghost"
            onClick={() => setStep("prc-form")}
            className="mt-4 text-gray-600"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to PRC Details
          </Button>
        </CardContent>
      </>
    );
  }

  // Broker Preview Step
  if (step === "broker-preview" && brokerInfo) {
    return (
      <>
        <CardHeader className="pb-1 pt-5 animate-[fadeInUp_0.5s_ease-out]">
          <div className="text-center">
            <CardTitle className="text-2xl font-bold text-[#0247ae] font-[family-name:var(--font-arsenal-sc)]">
              Confirm Broker
            </CardTitle>
            <p className="text-gray-500 text-sm">Is this your supervising broker?</p>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col items-center justify-center px-6 pb-4">
          <div className="bg-white border-2 border-gray-200 rounded-xl p-6 max-w-md w-full space-y-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-[#0247ae]/10 flex items-center justify-center shrink-0">
                {brokerInfo.picture ? (
                  <img src={brokerInfo.picture} alt="Broker" className="h-16 w-16 rounded-full object-cover" />
                ) : (
                  <User size={32} className="text-[#0247ae]" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-lg font-semibold text-gray-900">
                  {brokerInfo.firstName} {brokerInfo.lastName}
                </p>
                <p className="text-sm text-gray-500">{brokerInfo.email}</p>
                <p className="text-xs text-[#0247ae] font-medium mt-1">Licensed Broker</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button
              variant="outline"
              onClick={handleChangeBroker}
              className="h-9 px-6"
            >
              Change Broker
            </Button>
            <Button
              onClick={handleConfirmBroker}
              className="bg-[#0247ae] hover:bg-[#023a8a] h-9 px-6"
            >
              Yes, Continue
            </Button>
          </div>
        </CardContent>
      </>
    );
  }

  // TOTP Verification Step
  if (step === "totp-verification" && brokerInfo) {
    return (
      <>
        <CardHeader className="pb-1 pt-5 animate-[fadeInUp_0.5s_ease-out]">
          <div className="text-center">
            <CardTitle className="text-2xl font-bold text-[#0247ae] font-[family-name:var(--font-arsenal-sc)]">
              Enter Verification Code
            </CardTitle>
            <p className="text-gray-500 text-sm">Ask {brokerInfo.firstName} for the 6-digit code</p>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col items-center justify-center px-6 pb-4">
          <div className="bg-white border-2 border-gray-200 rounded-xl p-6 max-w-md w-full space-y-4">
            <div className="text-center space-y-2">
              <div className="h-12 w-12 rounded-full bg-[#0247ae]/10 flex items-center justify-center mx-auto">
                <Award size={24} className="text-[#0247ae]" />
              </div>
              <p className="text-sm text-gray-600">
                Your broker will provide a 6-digit code that changes every 30 seconds
              </p>
            </div>

            <div className="space-y-2">
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={totpCode}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  setTotpCode(val);
                  setError("");
                }}
                placeholder="000000"
                className="h-14 w-full text-center text-2xl font-mono tracking-widest rounded-lg border-2 border-gray-200 bg-white focus:outline-none focus:border-[#0247ae] focus:ring-2 focus:ring-[#0247ae]/10"
              />
              {error && (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}
            </div>

            <Button
              onClick={handleVerifyCode}
              disabled={totpCode.length !== 6 || isVerifying}
              className="w-full bg-[#0247ae] hover:bg-[#023a8a] h-10"
            >
              {isVerifying ? (
                <>
                  <Loader2 size={16} className="animate-spin mr-2" />
                  Verifying...
                </>
              ) : (
                "Verify & Submit"
              )}
            </Button>
          </div>

          <Button
            variant="ghost"
            onClick={() => setStep("broker-preview")}
            className="mt-4 text-gray-600"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back
          </Button>
        </CardContent>
      </>
    );
  }

  return null;
}
