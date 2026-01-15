"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { RegistrationContainer } from "@/components/auth/registration/registration-container";
import { RegistrationStepper } from "@/components/auth/registration/registration-stepper";
import { IdVerificationForm } from "@/components/auth/registration/id-verification-form";
import { FaceVerificationContent } from "@/components/auth/registration/face-verification-content";
import { AgentVerificationForm } from "@/components/auth/registration/agent-verification-form";
import { BrokerCredentialsForm } from "@/components/auth/registration/broker-credentials-form";
import { BrokerTypeContent } from "@/components/auth/registration/broker-type-content";
import { FirmLegitimacyContent } from "@/components/auth/registration/firm-legitimacy-content";
import { PendingApprovalScreen } from "@/components/auth/registration/pending-approval-screen";
import { AnimatedBackground } from "@/components/auth/registration/animated-background";
import { useAuth } from "@/lib/hooks/use-auth";
import type {
  BrokerLicenseData,
  BrokerType,
  FirmLegitimacyData,
  PrcData,
  SuretyBondData,
  PhilippineID,
} from "@/lib/types/registration";

type Step =
  | "id-verification"
  | "face-verification"
  | "agent-verification"
  | "broker-credentials"
  | "broker-type"
  | "firm-legitimacy"
  | "pending";

export default function VerifyPage() {
  const router = useRouter();
  const { isLoading, isAuthenticated, userStatus, accountType } = useAuth();
  const [step, setStep] = useState<Step>("id-verification");
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [showRedirectMessage, setShowRedirectMessage] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setShowRedirectMessage(true);
      const timer = setTimeout(() => {
        // Store intended destination
        sessionStorage.setItem("redirectAfterLogin", "/verify");
        router.push("/login");
      }, 2000);
      return () => clearTimeout(timer);
    }

    // Already verified, redirect to app
    if (!isLoading && isAuthenticated && userStatus === "verified") {
      router.push("/dashboard");
    }
  }, [isLoading, isAuthenticated, userStatus, router]);

  const markStepComplete = (stepName: string) => {
    setCompletedSteps((prev) => new Set(prev).add(stepName));
  };

  const getSteps = () => {
    const baseSteps = [
      { label: "ID", completed: completedSteps.has("id-verification"), current: step === "id-verification" },
      { label: "Face", completed: completedSteps.has("face-verification"), current: step === "face-verification" },
    ];

    if (accountType === "client") {
      return baseSteps;
    }

    if (accountType === "agent") {
      return [
        ...baseSteps,
        { label: "PRC & Nexus", completed: completedSteps.has("agent-verification"), current: step === "agent-verification" },
      ];
    }

    if (accountType === "broker") {
      return [
        ...baseSteps,
        { label: "Credentials", completed: completedSteps.has("broker-credentials"), current: step === "broker-credentials" },
        { label: "Structure", completed: completedSteps.has("broker-type"), current: step === "broker-type" || step === "firm-legitimacy" },
      ];
    }

    return baseSteps;
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
      // TODO: Update Cognito status to "verified"
      router.push("/dashboard");
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
    setStep("pending");
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
      setStep("pending");
    } else {
      setStep("firm-legitimacy");
    }
  };

  // Firm Legitimacy
  const handleFirmLegitimacyComplete = (data: FirmLegitimacyData) => {
    console.log("Firm data:", data);
    markStepComplete("firm-legitimacy");
    // TODO: Update Cognito status to "pending_approval"
    setStep("pending");
  };

  // Dev bypasses
  const handleIdDevBypass = () => { markStepComplete("id-verification"); setStep("face-verification"); };
  const handleFaceDevBypass = () => {
    markStepComplete("face-verification");
    if (accountType === "client") router.push("/dashboard");
    else if (accountType === "agent") setStep("agent-verification");
    else setStep("broker-credentials");
  };
  const handleAgentDevBypass = () => { markStepComplete("agent-verification"); setStep("pending"); };
  const handleBrokerCredentialsDevBypass = () => { markStepComplete("broker-credentials"); setStep("broker-type"); };
  const handleFirmDevBypass = () => { markStepComplete("firm-legitimacy"); setStep("pending"); };

  // Back handlers
  const handleBackToId = () => setStep("id-verification");
  const handleBackToFace = () => setStep("face-verification");
  const handleBackToBrokerCredentials = () => setStep("broker-credentials");
  const handleBackToBrokerType = () => setStep("broker-type");

  // Show redirect message if not authenticated
  if (showRedirectMessage) {
    return (
      <main className="flex min-h-screen bg-[#0247ae]">
        <AnimatedBackground />
        <div className="relative z-10 flex w-full items-center justify-center p-6">
          <div className="bg-white rounded-2xl p-8 text-center shadow-2xl animate-[fadeInScale_0.3s_ease-out]">
            <p className="text-lg text-gray-700">Please login first to access verification.</p>
            <p className="text-sm text-gray-500 mt-2">Redirecting to login...</p>
          </div>
        </div>
      </main>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <main className="flex min-h-screen bg-[#0247ae]">
        <AnimatedBackground />
        <div className="relative z-10 flex w-full items-center justify-center">
          <div className="animate-spin h-8 w-8 border-4 border-white border-t-transparent rounded-full" />
        </div>
      </main>
    );
  }

  // Pending approval screen
  if (step === "pending") {
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
            {step === "id-verification" && (
              <IdVerificationForm
                onSubmit={handleIdSubmit}
                onBack={() => router.push("/dashboard")}
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
    </main>
  );
}
