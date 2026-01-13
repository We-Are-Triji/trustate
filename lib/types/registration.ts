export interface BasicInfoData {
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
  mobile: string;
  email: string;
  password: string;
}

export interface RegistrationState {
  step: "basic-info" | "verification" | "identity";
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
