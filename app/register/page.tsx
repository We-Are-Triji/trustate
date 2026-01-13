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

  const getSteps = () => {
    const baseSteps = [
      { label: "Info & ID", completed: !!basicInfo && !!idData, current: step === "basic-info-id" },
      { label: "Face", completed: !!faceData, current: step === "face-verification" },
      { label: "Account", completed: !!accountType, current: step === "account-type" },
    ];

    if (accountType === "agent") {
      return [...baseSteps, { label: "Verification", completed: false, current: step === "agent-verification" }];
    }

    if (accountType === "broker") {
      const brokerSteps = [
        { label: "Credentials", completed: step === "broker-type" || step === "firm-legitimacy", current: step === "broker-credentials" },
        { label: "Structure", completed: step === "firm-legitimacy", current: step === "broker-type" },
      ];
      return [...baseSteps, ...brokerSteps];
    }

    return baseSteps;
  };

  const handleBasicInfoIdSubmit = (info: BasicInfoData, id: { idType: PhilippineID; idImage: File }) => {
    setBasicInfo(info);
    setIdData(id);
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
    setStep("account-type");
  };

  const handleAccountTypeSelect = (type: AccountType) => {
    setAccountType(type);
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
    setIsPending(true);
  };

  const handleBrokerCredentialsSubmit = (licenseData: BrokerLicenseData, bondData: SuretyBondData) => {
    console.log("Broker credentials:", { licenseData, bondData });
    setStep("broker-type");
  };

  const handleBrokerTypeSelect = (type: BrokerType) => {
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
  const handleBasicInfoDevBypass = () => setStep("face-verification");
  const handleFaceDevBypass = () => setStep("account-type");
  const handleAgentDevBypass = () => setIsPending(true);
  const handleBrokerCredentialsDevBypass = () => setStep("broker-type");
  const handleFirmDevBypass = () => console.log("Firm registration complete (dev)");

  // Back handlers
  const handleBackToBasicInfo = () => setStep("basic-info-id");
  const handleBackToFace = () => setStep("face-verification");
  const handleBackToAccountType = () => { setStep("account-type"); setAccountType(null); };
  const handleBackToBrokerCredentials = () => setStep("broker-credentials");
  const handleBackToBrokerType = () => setStep("broker-type");

  if (isPending) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8FAFC] p-6">
        <PendingApprovalScreen />
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8FAFC] p-6">
      <div className="w-full max-w-5xl">
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
