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
}

type Step = "form" | "broker-preview" | "totp-verification";

export function AgentVerificationForm({ onSubmit, onBack, onDevBypass }: AgentVerificationFormProps) {
  const { userId } = useAuth();
  const [step, setStep] = useState<Step>("form");
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

  const canSubmit = prcNumber.trim() && prcFrontImage && prcBackImage && nexusLink.trim();

  const handleValidateNexus = async () => {
    if (!canSubmit) return;

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
              onClick={() => {
                setStep("form");
                setBrokerInfo(null);
                setNexusCode("");
              }}
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

  return (
    <>
      <CardHeader className="pb-1 pt-5 animate-[fadeInUp_0.5s_ease-out]">
        <div className="text-center">
          <CardTitle className="text-2xl font-bold text-[#0247ae] font-[family-name:var(--font-arsenal-sc)]">
            Agent Verification
          </CardTitle>
          <p className="text-gray-500 text-sm">PRC Accreditation and Broker Connection</p>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col px-6 pb-4">
        <div className="grid grid-cols-2 gap-x-8 flex-1">
          {/* Left Column - PRC Accreditation */}
          <div className="space-y-3 animate-[fadeInUp_0.5s_ease-out_0.1s_both]">
            <div className="flex items-center gap-2 pb-1 border-b border-gray-100">
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

          {/* Right Column - Broker Connection */}
          <div className="space-y-3 animate-[fadeInUp_0.5s_ease-out_0.2s_both]">
            <div className="flex items-center gap-2 pb-1 border-b border-gray-100">
              <Users className="h-4 w-4 text-[#0247ae]" />
              <h3 className="font-semibold text-[#0247ae] text-sm">Broker Connection</h3>
            </div>
            
            <div className="space-y-1">
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
                  className={`${inputClass} pl-10`}
                />
              </div>
              {error && (
                <div className="flex items-center gap-1 text-red-600 text-xs mt-1">
                  <AlertCircle size={12} />
                  <span>{error}</span>
                </div>
              )}
            </div>

            <div className="rounded-lg bg-[#0247ae]/5 p-3 border border-[#0247ae]/10">
              <p className="font-semibold text-[#0247ae] mb-0.5 text-xs">Link Format</p>
              <p className="text-xs text-gray-600 leading-relaxed font-mono">https://trustate.com/nexus/XXXXXXXX</p>
            </div>

            <div className="rounded-lg bg-[#ffce08]/10 p-3 border border-[#ffce08]/20">
              <p className="font-semibold text-[#0247ae] mb-0.5 text-xs">What happens next?</p>
              <p className="text-xs text-gray-600 leading-relaxed">You'll confirm the broker and enter a verification code they provide.</p>
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
              onClick={handleValidateNexus}
              disabled={!canSubmit || isValidating}
              className="bg-[#0247ae] hover:bg-[#023a8a] active:bg-[#022d6e] px-6 h-9 text-sm font-semibold shadow-lg shadow-[#0247ae]/25 hover:shadow-xl hover:shadow-[#0247ae]/30 transition-all duration-200 disabled:opacity-50 disabled:shadow-none"
            >
              {isValidating ? (
                <>
                  <Loader2 size={16} className="animate-spin mr-2" />
                  Validating...
                </>
              ) : (
                "Continue"
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </>
  );
}
