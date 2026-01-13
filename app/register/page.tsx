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
import { BrokerLicenseForm } from "@/components/auth/broker-license-form";
import { SuretyBondForm } from "@/components/auth/surety-bond-form";
import { BrokerTypeSelection } from "@/components/auth/broker-type-selection";
import { FirmLegitimacyForm } from "@/components/auth/firm-legitimacy-form";
import { PendingApprovalScreen } from "@/components/auth/pending-approval-screen";
import type {
  AccountType,
  BasicInfoData,
  BrokerLicenseData,
  BrokerType,
  FirmLegitimacyData,
  PrcData,
  RegistrationState,
  SuretyBondData,
  VerificationMethod,
  PhilippineID,
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
  const [brokerLicenseData, setBrokerLicenseData] = useState<BrokerLicenseData | null>(null);
  const [suretyBondData, setSuretyBondData] = useState<SuretyBondData | null>(null);
  const [brokerType, setBrokerType] = useState<BrokerType | null>(null);
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
    } else if (type === "agent") {
      setState((prev) => ({ ...prev, step: "prc-verification" }));
    } else if (type === "broker") {
      setState((prev) => ({ ...prev, step: "broker-license" }));
    }
  };

  // Agent flow
  const handlePrcComplete = (data: PrcData) => {
    setPrcData(data);
    setState((prev) => ({ ...prev, step: "broker-link" }));
  };

  const handleBrokerLinkSubmit = async (nexusLink: string) => {
    console.log("Agent registration submitted:", { basicInfo: state.basicInfo, idData, faceData, prcData, nexusLink });
    setIsPending(true);
  };

  // Broker flow
  const handleBrokerLicenseComplete = (data: BrokerLicenseData) => {
    setBrokerLicenseData(data);
    setState((prev) => ({ ...prev, step: "surety-bond" }));
  };

  const handleSuretyBondComplete = (data: SuretyBondData) => {
    setSuretyBondData(data);
    setState((prev) => ({ ...prev, step: "broker-type" }));
  };

  const handleBrokerTypeSelect = (type: BrokerType) => {
    setBrokerType(type);
    if (type === "individual") {
      console.log("Individual broker registration complete:", {
        basicInfo: state.basicInfo,
        idData,
        faceData,
        brokerLicenseData,
        suretyBondData,
      });
    } else {
      setState((prev) => ({ ...prev, step: "firm-legitimacy" }));
    }
  };

  const handleFirmLegitimacyComplete = (data: FirmLegitimacyData) => {
    console.log("Brokerage firm registration complete:", {
      basicInfo: state.basicInfo,
      idData,
      faceData,
      brokerLicenseData,
      suretyBondData,
      firmData: data,
    });
  };

  // Dev bypasses
  const handleDevBypass = () => {
    setState((prev) => ({ ...prev, isVerified: true, step: "id-verification" }));
  };

  const handleIdDevBypass = () => {
    setState((prev) => ({ ...prev, step: "face-verification" }));
  };

  const handleFaceDevBypass = () => {
    setState((prev) => ({ ...prev, step: "account-type" }));
  };

  const handlePrcDevBypass = () => {
    setState((prev) => ({ ...prev, step: "broker-link" }));
  };

  const handleBrokerLinkDevBypass = () => {
    setIsPending(true);
  };

  const handleBrokerLicenseDevBypass = () => {
    setState((prev) => ({ ...prev, step: "surety-bond" }));
  };

  const handleSuretyBondDevBypass = () => {
    setState((prev) => ({ ...prev, step: "broker-type" }));
  };

  const handleFirmLegitimacyDevBypass = () => {
    console.log("Firm registration complete (dev bypass)");
  };

  // Back handlers
  const handleBackToBasicInfo = () => setState((prev) => ({ ...prev, step: "basic-info" }));
  const handleBackToIdVerification = () => setState((prev) => ({ ...prev, step: "id-verification" }));
  const handleBackToFaceVerification = () => setState((prev) => ({ ...prev, step: "face-verification" }));
  const handleBackToAccountType = () => setState((prev) => ({ ...prev, step: "account-type", accountType: null }));
  const handleBackToPrcVerification = () => setState((prev) => ({ ...prev, step: "prc-verification" }));
  const handleBackToBrokerLicense = () => setState((prev) => ({ ...prev, step: "broker-license" }));
  const handleBackToSuretyBond = () => setState((prev) => ({ ...prev, step: "surety-bond" }));
  const handleBackToBrokerType = () => setState((prev) => ({ ...prev, step: "broker-type" }));

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

      {/* Agent flow */}
      {state.step === "prc-verification" && (
        <PrcVerificationForm
          onComplete={handlePrcComplete}
          onBack={handleBackToAccountType}
          onDevBypass={handlePrcDevBypass}
        />
      )}

      {state.step === "broker-link" && (
        <BrokerLinkForm
          onSubmit={handleBrokerLinkSubmit}
          onBack={handleBackToPrcVerification}
          onDevBypass={handleBrokerLinkDevBypass}
        />
      )}

      {/* Broker flow */}
      {state.step === "broker-license" && (
        <BrokerLicenseForm
          onComplete={handleBrokerLicenseComplete}
          onBack={handleBackToAccountType}
          onDevBypass={handleBrokerLicenseDevBypass}
        />
      )}

      {state.step === "surety-bond" && (
        <SuretyBondForm
          onComplete={handleSuretyBondComplete}
          onBack={handleBackToBrokerLicense}
          onDevBypass={handleSuretyBondDevBypass}
        />
      )}

      {state.step === "broker-type" && (
        <BrokerTypeSelection onSelect={handleBrokerTypeSelect} onBack={handleBackToSuretyBond} />
      )}

      {state.step === "firm-legitimacy" && (
        <FirmLegitimacyForm
          onComplete={handleFirmLegitimacyComplete}
          onBack={handleBackToBrokerType}
          onDevBypass={handleFirmLegitimacyDevBypass}
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
