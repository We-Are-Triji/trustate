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
import { signUp, confirmSignUp, resendSignUpCode, signIn, updateUserAttributes } from "@/lib/cognito";
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
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const markStepComplete = (stepName: string) => {
    setCompletedSteps((prev) => new Set(prev).add(stepName));
  };

  const getSteps = () => [
    { label: "Basic Info", completed: completedSteps.has("basic-info"), current: step === "basic-info" },
    { label: "Verify Contact", completed: completedSteps.has("otp-verification"), current: step === "otp-verification" || showOtpModal },
    { label: "Account Type", completed: completedSteps.has("account-type"), current: step === "account-type" || step === "verification-prompt" },
  ];

  // Step 1: Basic Info - Create Cognito user
  const handleBasicInfoSubmit = async (data: BasicInfoData) => {
    setBasicInfo(data);
    setError(null);
    setIsLoading(true);

    try {
      await signUp({
        username: data.email,
        password: data.password,
        options: {
          userAttributes: {
            email: data.email,
            phone_number: formatPhoneNumber(data.mobile),
            given_name: data.firstName,
            family_name: data.lastName,
            middle_name: data.middleName || "",
            birthdate: data.dateOfBirth ? new Date(data.dateOfBirth).toISOString().split("T")[0] : "",
            "custom:nationality": data.nationality,
            "custom:status": "registered",
          },
        },
      });
      setShowChoiceModal(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Registration failed";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationMethodSelect = (method: VerificationMethod) => {
    setVerificationMethod(method);
    setShowChoiceModal(false);
    markStepComplete("basic-info");
    setStep("otp-verification");
    setShowOtpModal(true);
  };

  // Step 2: OTP Verification - Confirm Cognito signup
  const handleOtpVerify = async (code: string): Promise<boolean> => {
    if (!basicInfo) return false;
    setError(null);

    try {
      await confirmSignUp({
        username: basicInfo.email,
        confirmationCode: code,
      });

      setShowOtpModal(false);
      markStepComplete("otp-verification");
      setStep("account-type");
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Verification failed";
      setError(message);
      return false;
    }
  };

  const handleResendCode = async () => {
    if (!basicInfo) return;
    setError(null);

    try {
      await resendSignUpCode({ username: basicInfo.email });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to resend code";
      setError(message);
    }
  };

  // Step 3: Account Type - show confirmation modal first
  const handleAccountTypeSelect = (type: AccountType) => {
    setPendingAccountType(type);
    setShowConfirmModal(true);
  };

  const handleAccountTypeConfirm = async () => {
    if (!pendingAccountType || !basicInfo) return;
    setError(null);
    setIsLoading(true);

    try {
      // Sign in the user first to update attributes
      await signIn({
        username: basicInfo.email,
        password: basicInfo.password,
      });

      // Update account type
      await updateUserAttributes({
        userAttributes: {
          "custom:account_type": pendingAccountType,
        },
      });

      setAccountType(pendingAccountType);
      markStepComplete("account-type");
      setShowConfirmModal(false);
      setStep("verification-prompt");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to set account type";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccountTypeCancel = () => {
    setPendingAccountType(null);
    setShowConfirmModal(false);
  };

  // After account type - verification prompt
  const handleStartVerification = () => {
    router.push("/verify");
  };

  const handleSkipToLogin = () => {
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
            {error && (
              <div className="mx-6 mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {step === "basic-info" && (
              <BasicInfoForm
                onSubmit={handleBasicInfoSubmit}
                onDevBypass={handleBasicInfoDevBypass}
                initialData={basicInfo || undefined}
                isLoading={isLoading}
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
        onResend={handleResendCode}
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

function formatPhoneNumber(phone: string): string {
  // Remove all non-digits
  const digits = phone.replace(/\D/g, "");
  // Ensure it starts with +63 for Philippines
  if (digits.startsWith("63")) {
    return `+${digits}`;
  }
  if (digits.startsWith("0")) {
    return `+63${digits.slice(1)}`;
  }
  if (digits.startsWith("9")) {
    return `+63${digits}`;
  }
  return `+${digits}`;
}
