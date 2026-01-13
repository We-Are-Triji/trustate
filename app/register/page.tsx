"use client";

import { useState } from "react";
import { BasicInfoForm } from "@/components/auth/basic-info-form";
import { VerificationChoiceModal } from "@/components/auth/verification-choice-modal";
import { OtpVerificationModal } from "@/components/auth/otp-verification-modal";
import { IdVerificationForm } from "@/components/auth/id-verification-form";
import { FaceVerificationForm } from "@/components/auth/face-verification-form";
import type {
  BasicInfoData,
  RegistrationState,
  VerificationMethod,
  PhilippineID,
} from "@/lib/types/registration";

export default function RegisterPage() {
  const [state, setState] = useState<RegistrationState>({
    step: "basic-info",
    basicInfo: {
      firstName: "",
      middleName: "",
      lastName: "",
      dateOfBirth: "",
      mobile: "",
      email: "",
      password: "",
    },
    verificationMethod: null,
    isVerified: false,
  });

  const [idData, setIdData] = useState<{ idType: PhilippineID; idImage: File } | null>(null);
  const [showChoiceModal, setShowChoiceModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);

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

  const handleFaceComplete = async (faceImage: File) => {
    console.log("Registration complete:", { ...idData, faceImage });
  };

  const handleDevBypass = () => {
    setState((prev) => ({
      ...prev,
      isVerified: true,
      step: "id-verification",
    }));
  };

  const handleBackToBasicInfo = () => {
    setState((prev) => ({ ...prev, step: "basic-info" }));
  };

  const handleBackToIdVerification = () => {
    setState((prev) => ({ ...prev, step: "id-verification" }));
  };

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
        <IdVerificationForm onComplete={handleIdComplete} onBack={handleBackToBasicInfo} />
      )}

      {state.step === "face-verification" && (
        <FaceVerificationForm onComplete={handleFaceComplete} onBack={handleBackToIdVerification} />
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
