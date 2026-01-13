"use client";

import { useState } from "react";
import { AccountTypeSelection } from "@/components/auth/account-type-selection";
import { BasicInfoForm } from "@/components/auth/basic-info-form";
import { VerificationChoiceModal } from "@/components/auth/verification-choice-modal";
import { OtpVerificationModal } from "@/components/auth/otp-verification-modal";
import { IdVerificationForm } from "@/components/auth/id-verification-form";
import { FaceVerificationForm } from "@/components/auth/face-verification-form";
import { PrcVerificationForm } from "@/components/auth/prc-verification-form";
import { BrokerLinkForm } from "@/components/auth/broker-link-form";
import { PendingApprovalScreen } from "@/components/auth/pending-approval-screen";
import type {
  AccountType,
  BasicInfoData,
  RegistrationState,
  VerificationMethod,
  PhilippineID,
  PrcData,
} from "@/lib/types/registration";

export default function RegisterPage() {
  const [state, setState] = useState<RegistrationState>({
    step: "basic-info",
    accountType: null,
    basicInfo: {
      firstName: "",
      middleName: "",
      lastName: "",
      nationality: "",
      dateOfBirth: "",
      mobile: "",
      email: "",
      password: "",
    },
    verificationMethod: null,
    isVerified: false,
  });

  const [idData, setIdData] = useState<{ idType: PhilippineID; idImage: File } | null>(null);
  const [faceData, setFaceData] = useState<File | null>(null);
  const [prcData, setPrcData] = useState<PrcData | null>(null);
  const [showChoiceModal, setShowChoiceModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleBasicInfoSubmit = (data: BasicInfoData) => {
    setState((prev) => ({ ...prev, basicInfo: data }));
    setShowChoiceModal(true);
  };

  const handleVerificationMethodSelect = (method: VerificationMethod) => {
    setState((prev) => ({ ...prev, verificationMethod: method }));
    setShowChoiceModal(false);
    sendVerificationCode(method);
    setShowOtpModal(true);
  };

  const sendVerificationCode = async (method: VerificationMethod) => {
    const destination = method === "email" ? state.basicInfo.email : state.basicInfo.mobile;
    console.log(`Sending code to ${method}: ${destination}`);
  };

  const handleOtpVerify = async (code: string): Promise<boolean> => {
    console.log(`Verifying code: ${code}`);
    await new Promise((r) => setTimeout(r, 1000));
    const success = code === "123456";
    if (success) {
      setState((prev) => ({ ...prev, isVerified: true, step: "id-verification" }));
      setShowOtpModal(false);
    }
    return success;
  };

  const handleIdComplete = (data: { idType: PhilippineID; idImage: File }) => {
    setIdData(data);
    setState((prev) => ({ ...prev, step: "face-verification" }));
  };

  const handleFaceComplete = (faceImage: File) => {
    setFaceData(faceImage);
    setState((prev) => ({ ...prev, step: "account-type" }));
  };

  const handleAccountTypeSelect = (type: AccountType) => {
    setState((prev) => ({ ...prev, accountType: type }));

    if (type === "client") {
      console.log("Client registration complete:", { basicInfo: state.basicInfo, idData, faceData });
      // TODO: Navigate to main screen
    } else if (type === "agent") {
      setState((prev) => ({ ...prev, step: "prc-verification" }));
    } else if (type === "broker") {
      // TODO: Broker professional verification
      console.log("Broker flow - to be implemented");
    }
  };

  const handlePrcComplete = (data: PrcData) => {
    setPrcData(data);
    setState((prev) => ({ ...prev, step: "broker-link" }));
  };

  const handleBrokerLinkSubmit = async (nexusLink: string) => {
    console.log("Agent registration submitted:", {
      basicInfo: state.basicInfo,
      idData,
      faceData,
      prcData,
      nexusLink,
    });
    setIsPending(true);
  };

  const handleDevBypass = () => {
    setState((prev) => ({ ...prev, isVerified: true, step: "id-verification" }));
  };

  const handleIdDevBypass = () => {
    setState((prev) => ({ ...prev, step: "face-verification" }));
  };

  const handleFaceDevBypass = () => {
    setState((prev) => ({ ...prev, step: "account-type" }));
  };

  const handleBackToBasicInfo = () => {
    setState((prev) => ({ ...prev, step: "basic-info" }));
  };

  const handleBackToIdVerification = () => {
    setState((prev) => ({ ...prev, step: "id-verification" }));
  };

  const handleBackToFaceVerification = () => {
    setState((prev) => ({ ...prev, step: "face-verification" }));
  };

  const handleBackToAccountType = () => {
    setState((prev) => ({ ...prev, step: "account-type", accountType: null }));
  };

  const handleBackToPrcVerification = () => {
    setState((prev) => ({ ...prev, step: "prc-verification" }));
  };

  if (isPending) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F8FAFC] p-4">
        <PendingApprovalScreen />
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8FAFC] p-4">
      {state.step === "basic-info" && (
        <BasicInfoForm
          onSubmit={handleBasicInfoSubmit}
          onDevBypass={handleDevBypass}
          initialData={state.basicInfo}
        />
      )}

      {state.step === "id-verification" && (
        <IdVerificationForm
          onComplete={handleIdComplete}
          onBack={handleBackToBasicInfo}
          onDevBypass={handleIdDevBypass}
        />
      )}

      {state.step === "face-verification" && (
        <FaceVerificationForm
          onComplete={handleFaceComplete}
          onBack={handleBackToIdVerification}
          onDevBypass={handleFaceDevBypass}
        />
      )}

      {state.step === "account-type" && (
        <AccountTypeSelection
          onSelect={handleAccountTypeSelect}
          onBack={handleBackToFaceVerification}
        />
      )}

      {state.step === "prc-verification" && (
        <PrcVerificationForm
          onComplete={handlePrcComplete}
          onBack={handleBackToAccountType}
        />
      )}

      {state.step === "broker-link" && (
        <BrokerLinkForm
          onSubmit={handleBrokerLinkSubmit}
          onBack={handleBackToPrcVerification}
        />
      )}

      <VerificationChoiceModal
        open={showChoiceModal}
        email={state.basicInfo.email}
        mobile={state.basicInfo.mobile}
        onSelect={handleVerificationMethodSelect}
      />

      <OtpVerificationModal
        open={showOtpModal}
        method={state.verificationMethod || "email"}
        destination={
          state.verificationMethod === "mobile" ? state.basicInfo.mobile : state.basicInfo.email
        }
        onVerify={handleOtpVerify}
        onResend={() => sendVerificationCode(state.verificationMethod!)}
        onClose={() => setShowOtpModal(false)}
      />
    </main>
  );
}
