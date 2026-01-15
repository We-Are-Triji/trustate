export interface BasicInfoData {
  firstName: string;
  middleName: string;
  lastName: string;
  nationality: string;
  dateOfBirth: string;
  mobile: string;
  email: string;
  password: string;
}

export type AccountType = "client" | "agent" | "broker";

export type UserStatus = "registered" | "pending_approval" | "verified";

export interface PrcData {
  prcNumber: string;
  prcFrontImage: File | null;
  prcBackImage: File | null;
}

export interface BrokerLicenseData {
  prcBrokerNumber: string;
  corNumber: string;
  prcFrontImage: File | null;
  prcBackImage: File | null;
}

export interface SuretyBondData {
  bondPolicyNumber: string;
  bondExpiryDate: string;
  providerName: string;
  bondImage: File | null;
}

export type BrokerType = "individual" | "firm";

export type FirmType = "corporation" | "partnership" | "sole-proprietorship";

export interface FirmLegitimacyData {
  firmType: FirmType | null;
  registrationNumber: string;
  registrationDocument: File | null;
  businessPermit: File | null;
  birForm2303: File | null;
  dhsudNumber: string;
  dhsudRegistration: File | null;
  corporateBondImage: File | null;
}

export interface RegistrationState {
  step: 
    | "basic-info" 
    | "id-verification" 
    | "face-verification" 
    | "account-type" 
    | "prc-verification" 
    | "broker-link"
    | "broker-license"
    | "surety-bond"
    | "broker-type"
    | "firm-legitimacy";
  accountType: AccountType | null;
  basicInfo: BasicInfoData;
  verificationMethod: "email" | "mobile" | null;
  isVerified: boolean;
}

export type VerificationMethod = "email" | "mobile";

export const PH_VALID_IDS = [
  "Philippine Passport",
  "Driver's License",
  "SSS ID",
  "GSIS ID",
  "UMID",
  "PhilHealth ID",
  "Voter's ID",
  "PRC ID",
  "Postal ID",
  "National ID (PhilSys)",
  "TIN ID",
  "Senior Citizen ID",
  "OFW ID",
] as const;

export type PhilippineID = (typeof PH_VALID_IDS)[number];
