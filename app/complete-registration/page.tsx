"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { RegistrationContainer } from "@/components/auth/registration/registration-container";
import { AccountTypeContent } from "@/components/auth/registration/account-type-content";
import { AccountTypeConfirmModal } from "@/components/auth/registration/account-type-confirm-modal";
import { VerificationPrompt } from "@/components/auth/registration/verification-prompt";
import { AnimatedBackground } from "@/components/auth/registration/animated-background";
import { getCurrentUser, updateUserAttributes } from "@/lib/cognito";
import type { AccountType } from "@/lib/types/registration";

type Step = "account-type" | "verification-prompt";

export default function CompleteRegistrationPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("account-type");
  const [accountType, setAccountType] = useState<AccountType | null>(null);
  const [pendingAccountType, setPendingAccountType] = useState<AccountType | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      await getCurrentUser();
      setIsCheckingAuth(false);
    } catch {
      router.push("/login");
    }
  };

  const handleAccountTypeSelect = (type: AccountType) => {
    setPendingAccountType(type);
    setShowConfirmModal(true);
  };

  const handleAccountTypeConfirm = async () => {
    if (!pendingAccountType) return;
    setError(null);
    setIsLoading(true);

    try {
      await updateUserAttributes({
        userAttributes: {
          "custom:account_type": pendingAccountType,
        },
      });

      setAccountType(pendingAccountType);
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

  const handleStartVerification = () => {
    router.push("/verify");
  };

  const handleSkipToLogin = () => {
    router.push("/dashboard");
  };

  const handleBackToAccountType = () => {
    setStep("account-type");
    setAccountType(null);
  };

  if (isCheckingAuth) {
    return (
      <main className="flex min-h-screen bg-[#0247ae]">
        <AnimatedBackground />
        <div className="relative z-10 flex w-full items-center justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-white border-t-transparent rounded-full" />
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen bg-[#0247ae]">
      <AnimatedBackground />
      <div className="relative z-10 flex w-full items-center justify-center p-6 py-12">
        <div className="w-full max-w-5xl animate-[fadeInScale_0.6s_ease-out_0.2s_both]">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-white">Complete Your Registration</h1>
            <p className="text-white/70 text-sm mt-1">Just one more step to get started</p>
          </div>
          
          <RegistrationContainer>
            {error && (
              <div className="mx-6 mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {step === "account-type" && (
              <AccountTypeContent onSelect={handleAccountTypeSelect} />
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

      <AccountTypeConfirmModal
        open={showConfirmModal}
        accountType={pendingAccountType}
        onConfirm={handleAccountTypeConfirm}
        onCancel={handleAccountTypeCancel}
        isLoading={isLoading}
      />
    </main>
  );
}
