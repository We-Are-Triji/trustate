"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RegistrationContainer } from "@/components/auth/registration/registration-container";
import { RegistrationStepper } from "@/components/auth/registration/registration-stepper";
import { BasicInfoForm } from "@/components/auth/registration/basic-info-form";
import { AccountTypeContent } from "@/components/auth/registration/account-type-content";
import { VerificationPrompt } from "@/components/auth/registration/verification-prompt";
import { IdVerificationForm } from "@/components/auth/registration/id-verification-form";
import { FaceVerificationContent } from "@/components/auth/registration/face-verification-content";
import { AgentVerificationForm } from "@/components/auth/registration/agent-verification-form";
import { BrokerCredentialsForm } from "@/components/auth/registration/broker-credentials-form";
import { BrokerTypeContent } from "@/components/auth/registration/broker-type-content";
import { FirmLegitimacyContent } from "@/components/auth/registration/firm-legitimacy-content";
import { PendingApprovalScreen } from "@/components/auth/registration/pending-approval-screen";
import { VerificationChoiceModal } from "@/components/auth/registration/verification-choice-modal";
import { OtpVerificationModal } from "@/components/auth/registration/otp-verification-modal";
import { AnimatedBackground } from "@/components/auth/registration/animated-background";
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
  | "basic-info"
  | "account-type"
  | "verification-prompt"
  | "id-verification"
  | "face-verification"
  | "agent-verification"
  | "broker-credentials"
  | "broker-type"
  | "firm-legitimacy";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("basic-info");
  const [accountType, setAccountType] = useState<AccountType | null>(null);
  const [basicInfo, setBasicInfo] = useState<BasicInfoData | null>(null);
  const [verificationMethod, setVerificationMethod] = useState<VerificationMethod | null>(null);
  const [showChoiceModal, setShowChoiceModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  const markStepComplete = (stepName: string) => {
    setCompletedSteps((prev) => new Set(prev).add(stepName));
  };

  const getSteps = () => {
    // Registration steps (before verification)
    if (step === "basic-info" || step === "account-type" || step === "verification-prompt") {
      return [
        { label: "Basic Info", completed: completedSteps.has("basic-info"), current: step === "basic-info" },
        { label: "Account Type", completed: completedSteps.has("account-type"), current: step === "account-type" || step === "verification-prompt" },
      ];
    }

    // Verification steps
    const verificationSteps = [
      { label: "ID", completed: completedSteps.has("id-verification"), current: step === "id-verification" },
      { label: "Face", completed: completedSteps.has("face-verification"), current: step === "face-verification" },
    ];

    if (accountType === "client") {
      return verificationSteps;
    }

    if (accountType === "agent") {
      return [...verificationSteps, { label: "PRC & Nexus", completed: completedSteps.has("agent-verification"), current: step === "agent-verification" }];
    }

    if (accountType === "broker") {
      return [
        ...verificationSteps,
        { label: "Credentials", completed: completedSteps.has("broker-credentials"), current: step === "broker-credentials" },
        { label: "Structure", completed: completedSteps.has("broker-type"), current: step === "broker-type" || step === "firm-legitimacy" },
      ];
    }

    return verificationSteps;
  };

  // Step 1: Basic Info
  const handleBasicInfoSubmit = (data: BasicInfoData) => {
    setBasicInfo(data);
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
      markStepComplete("basic-info");
      setStep("account-type");
      // TODO: Create Cognito user here with status="registered"
    }
    return success;
  };

  // Step 2: Account Type
  const handleAccountTypeSelect = (type: AccountType) => {
    setAccountType(type);
    markStepComplete("account-type");
    setStep("verification-prompt");
    // TODO: Update Cognito user with account_type
  };

  // Verification Prompt
  const handleStartVerification = () => {
    setStep("id-verification");
  };

  const handleSkipToLogin = () => {
    router.push("/app");
  };

  // ID Verification
  const handleIdSubmit = (data: { idType: PhilippineID; idImage: File }) => {
    console.log("ID data:", data);
    markStepComplete("id-verification");
    setStep("face-verification");
  };

  // Face Verification
  const handleFaceComplete = (faceImage: File) => {
    console.log("Face image:", faceImage);
    markStepComplete("face-verification");

    if (accountType === "client") {
      // Client is verified after face
      // TODO: Update Cognito status to "verified"
      router.push("/app");
    } else if (accountType === "agent") {
      setStep("agent-verification");
    } else if (accountType === "broker") {
      setStep("broker-credentials");
    }
  };

  // Agent Verification
  const handleAgentSubmit = (prcData: PrcData, nexusLink: string) => {
    console.log("Agent data:", { prcData, nexusLink });
    markStepComplete("agent-verification");
    // TODO: Update Cognito status to "pending_approval"
    setIsPending(true);
  };

  // Broker Credentials
  const handleBrokerCredentialsSubmit = (licenseData: BrokerLicenseData, bondData: SuretyBondData) => {
    console.log("Broker credentials:", { licenseData, bondData });
    markStepComplete("broker-credentials");
    setStep("broker-type");
  };

  // Broker Type
  const handleBrokerTypeSelect = (type: BrokerType) => {
    markStepComplete("broker-type");
    if (type === "individual") {
      // TODO: Update Cognito status to "pending_approval"
      setIsPending(true);
    } else {
      setStep("firm-legitimacy");
    }
  };

  // Firm Legitimacy
  const handleFirmLegitimacyComplete = (data: FirmLegitimacyData) => {
    console.log("Firm data:", data);
    markStepComplete("firm-legitimacy");
    // TODO: Update Cognito status to "pending_approval"
    setIsPending(true);
  };

  // Dev bypasses
  const handleBasicInfoDevBypass = () => { markStepComplete("basic-info"); setStep("account-type"); };
  const handleIdDevBypass = () => { markStepComplete("id-verification"); setStep("face-verification"); };
  const handleFaceDevBypass = () => { markStepComplete("face-verification"); setStep(accountType === "agent" ? "agent-verification" : "broker-credentials"); };
  const handleAgentDevBypass = () => { markStepComplete("agent-verification"); setIsPending(true); };
  const handleBrokerCredentialsDevBypass = () => { markStepComplete("broker-credentials"); setStep("broker-type"); };
  const handleFirmDevBypass = () => { markStepComplete("firm-legitimacy"); setIsPending(true); };

  // Back handlers
  const handleBackToBasicInfo = () => setStep("basic-info");
  const handleBackToAccountType = () => { setStep("account-type"); setAccountType(null); };
  const handleBackToVerificationPrompt = () => setStep("verification-prompt");
  const handleBackToId = () => setStep("id-verification");
  const handleBackToFace = () => setStep("face-verification");
  const handleBackToBrokerCredentials = () => setStep("broker-credentials");
  const handleBackToBrokerType = () => setStep("broker-type");

  if (isPending) {
    return (
      <main className="flex min-h-screen bg-[#0247ae]">
        <AnimatedBackground />
        <div className="relative z-10 flex w-full items-center justify-center p-6">
          <PendingApprovalScreen />
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen bg-[#0247ae]">
      <AnimatedBackground />
      <div className="relative z-10 flex w-full items-center justify-center p-6 py-12">
        <div className="w-full max-w-5xl animate-[fadeInScale_0.6s_ease-out_0.2s_both]">
          <RegistrationStepper steps={getSteps()} />
          <RegistrationContainer>
            {step === "basic-info" && (
              <BasicInfoForm
                onSubmit={handleBasicInfoSubmit}
                onDevBypass={handleBasicInfoDevBypass}
                initialData={basicInfo || undefined}
              />
            )}

            {step === "account-type" && (
              <AccountTypeContent
                onSelect={handleAccountTypeSelect}
                onBack={handleBackToBasicInfo}
              />
            )}

            {step === "verification-prompt" && accountType && (
              <VerificationPrompt
                accountType={accountType}
                onStartVerification={handleStartVerification}
                onSkipToLogin={handleSkipToLogin}
              />
            )}

            {step === "id-verification" && (
              <IdVerificationForm
                onSubmit={handleIdSubmit}
                onBack={handleBackToVerificationPrompt}
                onDevBypass={handleIdDevBypass}
              />
            )}

            {step === "face-verification" && (
              <FaceVerificationContent
                onComplete={handleFaceComplete}
                onBack={handleBackToId}
                onDevBypass={handleFaceDevBypass}
              />
            )}

            {step === "agent-verification" && (
              <AgentVerificationForm
                onSubmit={handleAgentSubmit}
                onBack={handleBackToFace}
                onDevBypass={handleAgentDevBypass}
              />
            )}

            {step === "broker-credentials" && (
              <BrokerCredentialsForm
                onSubmit={handleBrokerCredentialsSubmit}
                onBack={handleBackToFace}
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
