"use client";

import { useState } from "react";
import { RegistrationContainer } from "@/components/auth/registration/registration-container";
import { RegistrationStepper } from "@/components/auth/registration/registration-stepper";
import { BasicInfoIdForm } from "@/components/auth/registration/basic-info-id-form";
import { FaceVerificationContent } from "@/components/auth/registration/face-verification-content";
import { AccountTypeContent } from "@/components/auth/registration/account-type-content";
import { AgentVerificationForm } from "@/components/auth/registration/agent-verification-form";
import { BrokerCredentialsForm } from "@/components/auth/registration/broker-credentials-form";
import { BrokerTypeContent } from "@/components/auth/registration/broker-type-content";
import { FirmLegitimacyContent } from "@/components/auth/registration/firm-legitimacy-content";
import { PendingApprovalScreen } from "@/components/auth/registration/pending-approval-screen";
import { VerificationChoiceModal } from "@/components/auth/registration/verification-choice-modal";
import { OtpVerificationModal } from "@/components/auth/registration/otp-verification-modal";
import type {
  AccountType,
  BasicInfoData,
  BrokerLicenseData,
  BrokerType,
  FirmLegitimacyData,
  PrcData,
  SuretyBondData,
  VerificationMethod,
  PhilippineID,
} from "@/lib/types/registration";

type Step = 
  | "basic-info-id"
  | "face-verification"
  | "account-type"
  | "agent-verification"
  | "broker-credentials"
  | "broker-type"
  | "firm-legitimacy";

export default function RegisterPage() {
  const [step, setStep] = useState<Step>("basic-info-id");
  const [accountType, setAccountType] = useState<AccountType | null>(null);
  const [basicInfo, setBasicInfo] = useState<BasicInfoData | null>(null);
  const [idData, setIdData] = useState<{ idType: PhilippineID; idImage: File } | null>(null);
  const [faceData, setFaceData] = useState<File | null>(null);
  const [verificationMethod, setVerificationMethod] = useState<VerificationMethod | null>(null);
  const [showChoiceModal, setShowChoiceModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  const markStepComplete = (stepName: string) => {
    setCompletedSteps(prev => new Set(prev).add(stepName));
  };

  const getSteps = () => {
    const baseSteps = [
      { label: "Info & ID", completed: completedSteps.has("basic-info-id"), current: step === "basic-info-id" },
      { label: "Face", completed: completedSteps.has("face-verification"), current: step === "face-verification" },
      { label: "Account", completed: completedSteps.has("account-type"), current: step === "account-type" },
    ];

    if (accountType === "agent") {
      return [...baseSteps, { label: "Verification", completed: completedSteps.has("agent-verification"), current: step === "agent-verification" }];
    }

    if (accountType === "broker") {
      const brokerSteps = [
        { label: "Credentials", completed: completedSteps.has("broker-credentials"), current: step === "broker-credentials" },
        { label: "Structure", completed: completedSteps.has("broker-type"), current: step === "broker-type" },
      ];
      return [...baseSteps, ...brokerSteps];
    }

    return baseSteps;
  };

  const handleBasicInfoIdSubmit = (info: BasicInfoData, id: { idType: PhilippineID; idImage: File }) => {
    setBasicInfo(info);
    setIdData(id);
    markStepComplete("basic-info-id");
    setShowChoiceModal(true);
  };

  const handleVerificationMethodSelect = (method: VerificationMethod) => {
    setVerificationMethod(method);
    setShowChoiceModal(false);
    setShowOtpModal(true);
  };

  const handleOtpVerify = async (code: string): Promise<boolean> => {
    await new Promise((r) => setTimeout(r, 1000));
    const success = code === "123456";
    if (success) {
      setShowOtpModal(false);
      setStep("face-verification");
    }
    return success;
  };

  const handleFaceComplete = (faceImage: File) => {
    setFaceData(faceImage);
    markStepComplete("face-verification");
    setStep("account-type");
  };

  const handleAccountTypeSelect = (type: AccountType) => {
    setAccountType(type);
    markStepComplete("account-type");
    if (type === "client") {
      console.log("Client registration complete:", { basicInfo, idData, faceData });
    } else if (type === "agent") {
      setStep("agent-verification");
    } else if (type === "broker") {
      setStep("broker-credentials");
    }
  };

  const handleAgentSubmit = (prcData: PrcData, nexusLink: string) => {
    console.log("Agent registration submitted:", { basicInfo, idData, faceData, prcData, nexusLink });
    markStepComplete("agent-verification");
    setIsPending(true);
  };

  const handleBrokerCredentialsSubmit = (licenseData: BrokerLicenseData, bondData: SuretyBondData) => {
    console.log("Broker credentials:", { licenseData, bondData });
    markStepComplete("broker-credentials");
    setStep("broker-type");
  };

  const handleBrokerTypeSelect = (type: BrokerType) => {
    markStepComplete("broker-type");
    if (type === "individual") {
      console.log("Individual broker registration complete");
    } else {
      setStep("firm-legitimacy");
    }
  };

  const handleFirmLegitimacyComplete = (data: FirmLegitimacyData) => {
    console.log("Firm registration complete:", data);
  };

  // Dev bypasses
  const handleBasicInfoDevBypass = () => { markStepComplete("basic-info-id"); setStep("face-verification"); };
  const handleFaceDevBypass = () => { markStepComplete("face-verification"); setStep("account-type"); };
  const handleAgentDevBypass = () => { markStepComplete("agent-verification"); setIsPending(true); };
  const handleBrokerCredentialsDevBypass = () => { markStepComplete("broker-credentials"); setStep("broker-type"); };
  const handleFirmDevBypass = () => { markStepComplete("firm-legitimacy"); console.log("Firm registration complete (dev)"); };

  // Back handlers
  const handleBackToBasicInfo = () => setStep("basic-info-id");
  const handleBackToFace = () => setStep("face-verification");
  const handleBackToAccountType = () => { setStep("account-type"); setAccountType(null); };
  const handleBackToBrokerCredentials = () => setStep("broker-credentials");
  const handleBackToBrokerType = () => setStep("broker-type");

  if (isPending) {
    return (
      <main className="flex min-h-screen bg-[#0247ae]">
        {/* Full-screen animated background */}
        <div 
          className="fixed inset-0 overflow-hidden"
          style={{
            background: 'linear-gradient(120deg, #0247ae 0%, #0873c9 20%, #0247ae 40%, #0873c9 60%, #0247ae 80%, #0873c9 100%)',
            backgroundSize: '300% 100%',
            animation: 'waveGradient 30s ease-in-out infinite'
          }}
        >
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 opacity-[0.07]">
            <div className="h-full w-full" style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px),
                               linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`,
              backgroundSize: '50px 50px'
            }} />
          </div>

          {/* Bottom waves */}
          <svg 
            className="absolute -bottom-2 -left-20 w-[150%] h-80" 
            viewBox="0 0 800 320" 
            preserveAspectRatio="none"
            style={{ animation: 'waveMove 4s ease-in-out infinite' }}
          >
            <path d="M0 200 Q200 120 400 170 Q600 220 800 150 L800 320 L0 320 Z" fill="rgba(255,255,255,0.15)" />
          </svg>
          <svg 
            className="absolute -bottom-2 -left-10 w-[140%] h-80" 
            viewBox="0 0 800 320" 
            preserveAspectRatio="none"
            style={{ animation: 'waveMove2 5s ease-in-out infinite' }}
          >
            <path d="M0 240 Q200 180 400 220 Q600 260 800 200 L800 320 L0 320 Z" fill="rgba(255,255,255,0.10)" />
          </svg>

          {/* Floating circles */}
          <div className="absolute left-[10%] top-[15%] h-20 w-20 rounded-full bg-white/10 animate-[float_3s_ease-in-out_infinite]" />
          <div className="absolute left-[25%] top-[8%] h-8 w-8 rounded-full bg-white/15 animate-[float_2.5s_ease-in-out_infinite_0.3s]" />
          <div className="absolute right-[30%] top-[20%] h-14 w-14 rounded-full border-2 border-white/20 animate-[float_3.5s_ease-in-out_infinite_0.5s]" />
          <div className="absolute right-[15%] top-[35%] h-10 w-10 rounded-full bg-[#ffce08]/25 animate-[float_4s_ease-in-out_infinite_0.2s]" />
          <div className="absolute left-[15%] top-[45%] h-6 w-6 rounded-full bg-white/20 animate-[float_2.5s_ease-in-out_infinite_0.8s]" />
          <div className="absolute right-[40%] top-[12%] h-4 w-4 rounded-full bg-white/25 animate-[float_3s_ease-in-out_infinite_1s]" />
          <div className="absolute left-[40%] top-[30%] h-12 w-12 rounded-full border border-white/15 animate-[float_3.5s_ease-in-out_infinite_0.4s]" />
          <div className="absolute right-[20%] top-[55%] h-5 w-5 rounded-full bg-white/15 animate-[float_2.5s_ease-in-out_infinite_0.6s]" />
          <div className="absolute left-[8%] top-[65%] h-16 w-16 rounded-full border-2 border-white/10 animate-[float_4s_ease-in-out_infinite_0.3s]" />
          <div className="absolute right-[8%] top-[70%] h-12 w-12 rounded-full bg-white/10 animate-[float_3s_ease-in-out_infinite_0.7s]" />
          <div className="absolute left-[60%] top-[60%] h-8 w-8 rounded-full border border-white/20 animate-[float_3.5s_ease-in-out_infinite_0.9s]" />

          {/* Small dots */}
          <div className="absolute left-[50%] top-[18%] h-2 w-2 rounded-full bg-white/35 animate-[pulse_1.5s_ease-in-out_infinite]" />
          <div className="absolute left-[60%] top-[40%] h-2 w-2 rounded-full bg-white/30 animate-[pulse_2s_ease-in-out_infinite_0.3s]" />
          <div className="absolute left-[30%] top-[55%] h-2 w-2 rounded-full bg-[#ffce08]/50 animate-[pulse_1.5s_ease-in-out_infinite_0.5s]" />
          <div className="absolute right-[25%] top-[65%] h-2 w-2 rounded-full bg-white/30 animate-[pulse_2s_ease-in-out_infinite_0.7s]" />
        </div>

        {/* Centered pending approval card */}
        <div className="relative z-10 flex w-full items-center justify-center p-6">
          <PendingApprovalScreen />
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen bg-[#0247ae]">
      {/* Full-screen animated background */}
      <div 
        className="fixed inset-0 overflow-hidden"
        style={{
          background: 'linear-gradient(120deg, #0247ae 0%, #0873c9 20%, #0247ae 40%, #0873c9 60%, #0247ae 80%, #0873c9 100%)',
          backgroundSize: '300% 100%',
          animation: 'waveGradient 30s ease-in-out infinite'
        }}
      >
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.07]">
          <div className="h-full w-full" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }} />
        </div>

        {/* Bottom waves */}
        <svg 
          className="absolute -bottom-2 -left-20 w-[150%] h-80" 
          viewBox="0 0 800 320" 
          preserveAspectRatio="none"
          style={{ animation: 'waveMove 4s ease-in-out infinite' }}
        >
          <path d="M0 200 Q200 120 400 170 Q600 220 800 150 L800 320 L0 320 Z" fill="rgba(255,255,255,0.15)" />
        </svg>
        <svg 
          className="absolute -bottom-2 -left-10 w-[140%] h-80" 
          viewBox="0 0 800 320" 
          preserveAspectRatio="none"
          style={{ animation: 'waveMove2 5s ease-in-out infinite' }}
        >
          <path d="M0 240 Q200 180 400 220 Q600 260 800 200 L800 320 L0 320 Z" fill="rgba(255,255,255,0.10)" />
        </svg>

        {/* Floating circles */}
        <div className="absolute left-[10%] top-[15%] h-20 w-20 rounded-full bg-white/10 animate-[float_3s_ease-in-out_infinite]" />
        <div className="absolute left-[25%] top-[8%] h-8 w-8 rounded-full bg-white/15 animate-[float_2.5s_ease-in-out_infinite_0.3s]" />
        <div className="absolute right-[30%] top-[20%] h-14 w-14 rounded-full border-2 border-white/20 animate-[float_3.5s_ease-in-out_infinite_0.5s]" />
        <div className="absolute right-[15%] top-[35%] h-10 w-10 rounded-full bg-[#ffce08]/25 animate-[float_4s_ease-in-out_infinite_0.2s]" />
        <div className="absolute left-[15%] top-[45%] h-6 w-6 rounded-full bg-white/20 animate-[float_2.5s_ease-in-out_infinite_0.8s]" />
        <div className="absolute right-[40%] top-[12%] h-4 w-4 rounded-full bg-white/25 animate-[float_3s_ease-in-out_infinite_1s]" />
        <div className="absolute left-[40%] top-[30%] h-12 w-12 rounded-full border border-white/15 animate-[float_3.5s_ease-in-out_infinite_0.4s]" />
        <div className="absolute right-[20%] top-[55%] h-5 w-5 rounded-full bg-white/15 animate-[float_2.5s_ease-in-out_infinite_0.6s]" />
        <div className="absolute left-[8%] top-[65%] h-16 w-16 rounded-full border-2 border-white/10 animate-[float_4s_ease-in-out_infinite_0.3s]" />
        <div className="absolute right-[8%] top-[70%] h-12 w-12 rounded-full bg-white/10 animate-[float_3s_ease-in-out_infinite_0.7s]" />
        <div className="absolute left-[60%] top-[60%] h-8 w-8 rounded-full border border-white/20 animate-[float_3.5s_ease-in-out_infinite_0.9s]" />

        {/* Small dots */}
        <div className="absolute left-[50%] top-[18%] h-2 w-2 rounded-full bg-white/35 animate-[pulse_1.5s_ease-in-out_infinite]" />
        <div className="absolute left-[60%] top-[40%] h-2 w-2 rounded-full bg-white/30 animate-[pulse_2s_ease-in-out_infinite_0.3s]" />
        <div className="absolute left-[30%] top-[55%] h-2 w-2 rounded-full bg-[#ffce08]/50 animate-[pulse_1.5s_ease-in-out_infinite_0.5s]" />
        <div className="absolute right-[25%] top-[65%] h-2 w-2 rounded-full bg-white/30 animate-[pulse_2s_ease-in-out_infinite_0.7s]" />
      </div>

      {/* Centered registration card */}
      <div className="relative z-10 flex w-full items-center justify-center p-6 py-12">
        <div className="w-full max-w-5xl animate-[fadeInScale_0.6s_ease-out_0.2s_both]">
          <RegistrationStepper steps={getSteps()} />
          <RegistrationContainer>
            {step === "basic-info-id" && (
              <BasicInfoIdForm
                onSubmit={handleBasicInfoIdSubmit}
                onDevBypass={handleBasicInfoDevBypass}
                initialBasicInfo={basicInfo || undefined}
              />
            )}

            {step === "face-verification" && (
              <FaceVerificationContent
                onComplete={handleFaceComplete}
                onBack={handleBackToBasicInfo}
                onDevBypass={handleFaceDevBypass}
              />
            )}

            {step === "account-type" && (
              <AccountTypeContent
                onSelect={handleAccountTypeSelect}
                onBack={handleBackToFace}
              />
            )}

            {step === "agent-verification" && (
              <AgentVerificationForm
                onSubmit={handleAgentSubmit}
                onBack={handleBackToAccountType}
                onDevBypass={handleAgentDevBypass}
              />
            )}

            {step === "broker-credentials" && (
              <BrokerCredentialsForm
                onSubmit={handleBrokerCredentialsSubmit}
                onBack={handleBackToAccountType}
                onDevBypass={handleBrokerCredentialsDevBypass}
              />
            )}

            {step === "broker-type" && (
              <BrokerTypeContent
                onSelect={handleBrokerTypeSelect}
                onBack={handleBackToBrokerCredentials}
              />
            )}

            {step === "firm-legitimacy" && (
              <FirmLegitimacyContent
                onComplete={handleFirmLegitimacyComplete}
                onBack={handleBackToBrokerType}
                onDevBypass={handleFirmDevBypass}
              />
            )}
          </RegistrationContainer>
        </div>
      </div>

      <VerificationChoiceModal
        open={showChoiceModal}
        email={basicInfo?.email || ""}
        mobile={basicInfo?.mobile || ""}
        onSelect={handleVerificationMethodSelect}
      />

      <OtpVerificationModal
        open={showOtpModal}
        method={verificationMethod || "email"}
        destination={verificationMethod === "mobile" ? basicInfo?.mobile || "" : basicInfo?.email || ""}
        onVerify={handleOtpVerify}
        onResend={() => {}}
        onClose={() => setShowOtpModal(false)}
      />
    </main>
  );
}
