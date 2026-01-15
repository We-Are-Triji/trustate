"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RegistrationContainer } from "@/components/auth/registration/registration-container";
import { RegistrationStepper } from "@/components/auth/registration/registration-stepper";
import { BasicInfoForm } from "@/components/auth/registration/basic-info-form";
import { AccountTypeContent } from "@/components/auth/registration/account-type-content";
import { AccountTypeConfirmModal } from "@/components/auth/registration/account-type-confirm-modal";
import { VerificationPrompt } from "@/components/auth/registration/verification-prompt";
import { VerificationChoiceModal } from "@/components/auth/registration/verification-choice-modal";
import { OtpVerificationModal } from "@/components/auth/registration/otp-verification-modal";
import { AnimatedBackground } from "@/components/auth/registration/animated-background";
import type { AccountType, BasicInfoData, VerificationMethod } from "@/lib/types/registration";

type Step = "basic-info" | "otp-verification" | "account-type" | "verification-prompt";

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("basic-info");
  const [accountType, setAccountType] = useState<AccountType | null>(null);
  const [pendingAccountType, setPendingAccountType] = useState<AccountType | null>(null);
  const [basicInfo, setBasicInfo] = useState<BasicInfoData | null>(null);
  const [verificationMethod, setVerificationMethod] = useState<VerificationMethod | null>(null);
  const [showChoiceModal, setShowChoiceModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  const markStepComplete = (stepName: string) => {
    setCompletedSteps((prev) => new Set(prev).add(stepName));
  };

  const getSteps = () => [
    { label: "Basic Info", completed: completedSteps.has("basic-info"), current: step === "basic-info" },
    { label: "Verify Contact", completed: completedSteps.has("otp-verification"), current: step === "otp-verification" || showOtpModal },
    { label: "Account Type", completed: completedSteps.has("account-type"), current: step === "account-type" || step === "verification-prompt" },
  ];

  // Step 1: Basic Info
  const handleBasicInfoSubmit = (data: BasicInfoData) => {
    setBasicInfo(data);
    setShowChoiceModal(true);
  };

  const handleVerificationMethodSelect = (method: VerificationMethod) => {
    setVerificationMethod(method);
    setShowChoiceModal(false);
    markStepComplete("basic-info");
    setStep("otp-verification");
    setShowOtpModal(true);
  };

  // Step 2: OTP Verification
  const handleOtpVerify = async (code: string): Promise<boolean> => {
    await new Promise((r) => setTimeout(r, 1000));
    const success = code === "123456";
    if (success) {
      setShowOtpModal(false);
      markStepComplete("otp-verification");
      setStep("account-type");
      // TODO: Create Cognito user here with status="registered"
    }
    return success;
  };

  // Step 3: Account Type - show confirmation modal first
  const handleAccountTypeSelect = (type: AccountType) => {
    setPendingAccountType(type);
    setShowConfirmModal(true);
  };

  const handleAccountTypeConfirm = () => {
    if (pendingAccountType) {
      setAccountType(pendingAccountType);
      markStepComplete("account-type");
      setShowConfirmModal(false);
      setStep("verification-prompt");
      // TODO: Update Cognito user with account_type
    }
  };

  const handleAccountTypeCancel = () => {
    setPendingAccountType(null);
    setShowConfirmModal(false);
  };

  // After account type - verification prompt
  const handleStartVerification = () => {
    // TODO: Sign in the user first, then redirect
    router.push("/verify");
  };

  const handleSkipToLogin = () => {
    // TODO: Sign in the user, then redirect
    router.push("/app");
  };

  // Dev bypass
  const handleBasicInfoDevBypass = () => {
    markStepComplete("basic-info");
    markStepComplete("otp-verification");
    setStep("account-type");
  };

  // Back handlers
  const handleBackToBasicInfo = () => setStep("basic-info");
  const handleBackToAccountType = () => {
    setStep("account-type");
    setAccountType(null);
  };

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
                onBack={handleBackToAccountType}
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

      <AccountTypeConfirmModal
        open={showConfirmModal}
        accountType={pendingAccountType}
        onConfirm={handleAccountTypeConfirm}
        onCancel={handleAccountTypeCancel}
      />
    </main>
  );
}
