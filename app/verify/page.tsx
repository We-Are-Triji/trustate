"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, User, Loader2 } from "lucide-react";
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
import { updateUserAttributes } from "@/lib/cognito";
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
  | "pending"
  | "verifying"
  | "success";

export default function VerifyPage() {
  const router = useRouter();
  const { isLoading, isAuthenticated, userStatus, accountType, email, userId } = useAuth();
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

    // Already pending approval, show pending screen
    if (!isLoading && isAuthenticated && userStatus === "pending_approval") {
      setStep("pending");
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
        { label: "PRC", completed: completedSteps.has("prc-details"), current: step === "agent-verification" && !completedSteps.has("prc-details") },
        { label: "Broker", completed: completedSteps.has("agent-verification"), current: step === "agent-verification" && completedSteps.has("prc-details") },
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
  const handleFaceComplete = async (faceImage: File) => {
    console.log("Face image:", faceImage);
    markStepComplete("face-verification");

    if (accountType === "client") {
      setStep("verifying");
      // Simulate verification delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      // Update Cognito status
      try {
        await updateUserAttributes({ userAttributes: { "custom:status": "verified" } });
      } catch (err) {
        console.error("Failed to update status:", err);
      }
      setStep("success");
    } else if (accountType === "agent") {
      setStep("agent-verification");
    } else if (accountType === "broker") {
      setStep("broker-credentials");
    }
  };

  // Agent Verification
  const handleAgentSubmit = async (prcData: PrcData, nexusLink: string) => {
    console.log("Agent data:", { prcData, nexusLink });
    markStepComplete("agent-verification");
    try {
      await updateUserAttributes({ userAttributes: { "custom:status": "pending_approval" } });
    } catch (err) {
      console.error("Failed to update status:", err);
    }
    setStep("pending");
  };

  // Broker Credentials
  const handleBrokerCredentialsSubmit = (licenseData: BrokerLicenseData, bondData: SuretyBondData) => {
    console.log("Broker credentials:", { licenseData, bondData });
    markStepComplete("broker-credentials");
    setStep("broker-type");
  };

  // Broker Type
  const handleBrokerTypeSelect = async (type: BrokerType) => {
    markStepComplete("broker-type");
    if (type === "individual") {
      setStep("verifying");
      await new Promise(resolve => setTimeout(resolve, 3000));
      try {
        await updateUserAttributes({ userAttributes: { "custom:status": "verified" } });
      } catch (err) {
        console.error("Failed to update status:", err);
      }
      setStep("success");
    } else {
      setStep("firm-legitimacy");
    }
  };

  // Firm Legitimacy
  const handleFirmLegitimacyComplete = async (data: FirmLegitimacyData) => {
    console.log("Firm data:", data);
    markStepComplete("firm-legitimacy");
    setStep("verifying");
    await new Promise(resolve => setTimeout(resolve, 3000));
    try {
      await updateUserAttributes({ userAttributes: { "custom:status": "verified" } });
    } catch (err) {
      console.error("Failed to update status:", err);
    }
    setStep("success");
  };

  // Dev bypasses
  const handleIdDevBypass = () => { markStepComplete("id-verification"); setStep("face-verification"); };
  const handleFaceDevBypass = async () => {
    markStepComplete("face-verification");
    if (accountType === "client") {
      setStep("verifying");
      await new Promise(resolve => setTimeout(resolve, 3000));
      try {
        await updateUserAttributes({ userAttributes: { "custom:status": "verified" } });
      } catch (err) {
        console.error("Failed to update status:", err);
      }
      setStep("success");
    }
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
    const handleChangeBroker = async () => {
      if (accountType !== "agent") return;
      
      // Reset broker request
      await fetch("/api/agent/reset-broker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentId: userId }),
      });

      // Go back to agent verification
      setStep("agent-verification");
    };

    return (
      <main className="flex min-h-screen bg-[#0247ae]">
        <AnimatedBackground />
        <div className="relative z-10 flex w-full items-center justify-center p-6">
          <PendingApprovalScreen 
            onChangeBroker={accountType === "agent" ? handleChangeBroker : undefined}
          />
        </div>
      </main>
    );
  }

  // Verifying screen with delay
  if (step === "verifying") {
    return (
      <main className="flex min-h-screen bg-[#0247ae]">
        <AnimatedBackground />
        <div className="relative z-10 flex w-full items-center justify-center p-6">
          <div className="bg-white rounded-2xl p-8 text-center shadow-2xl max-w-md animate-[fadeInScale_0.3s_ease-out]">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-[#0247ae]/10 flex items-center justify-center">
              <Loader2 className="h-10 w-10 text-[#0247ae] animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verifying Your Identity</h2>
            <p className="text-gray-600">Please wait while we process your verification...</p>
          </div>
        </div>
      </main>
    );
  }

  // Success screen for clients and brokers
  if (step === "success") {
    return (
      <main className="flex min-h-screen bg-[#0247ae]">
        <AnimatedBackground />
        <div className="relative z-10 flex w-full items-center justify-center p-6">
          <div className="bg-white rounded-2xl p-8 text-center shadow-2xl max-w-md animate-[fadeInScale_0.3s_ease-out]">
            <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-emerald-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Verification Complete!</h2>
            <p className="text-gray-600 mb-6">
              {accountType === "broker" 
                ? "Your broker account has been successfully verified. You can now access all broker features."
                : "Your account has been successfully verified."}
            </p>
            <button
              onClick={() => router.push("/dashboard")}
              className="w-full py-3 bg-[#0247ae] text-white rounded-lg font-medium hover:bg-[#023a8a] transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </main>
    );
  }

  const AccountBadge = () => (
    <div className="absolute top-4 left-4 z-20 bg-white/95 backdrop-blur rounded-lg px-4 py-2 shadow-lg flex items-center gap-3 max-w-xs">
      <div className="h-8 w-8 rounded-full bg-[#0247ae]/10 flex items-center justify-center shrink-0">
        <User className="h-4 w-4 text-[#0247ae]" />
      </div>
      <div className="text-left min-w-0">
        <p className="text-xs text-gray-500">Verifying</p>
        <p className="text-sm font-medium text-gray-900 break-all">{email}</p>
        <p className="text-xs text-[#0247ae] capitalize">{accountType} Account</p>
      </div>
    </div>
  );

  return (
    <main className="flex min-h-screen bg-[#0247ae]">
      <AnimatedBackground />
      <AccountBadge />
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
                onPrcComplete={() => markStepComplete("prc-details")}
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
