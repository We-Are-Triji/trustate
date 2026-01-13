export interface BasicInfoData {
  firstName: string;
  middleName: string;
  lastName: string;
  dateOfBirth: string;
  mobile: string;
  email: string;
  password: string;
}

export type AccountType = "client" | "agent" | "broker";

export interface RegistrationState {
  step: "account-type" | "basic-info" | "verification" | "id-verification" | "face-verification";
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
