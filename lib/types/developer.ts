export interface Developer {
  id: string;
  name: string;
  logo: string;
  description: string;
  fullDescription: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  city: string;
  country: string;
  partnerTier: "gold" | "silver" | "bronze";
  specializations: string[];
  projectsCompleted: number;
  yearsInBusiness: number;
  featured: boolean;
}
