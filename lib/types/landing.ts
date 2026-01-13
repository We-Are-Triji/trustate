export interface Agent {
  id: string;
  name: string;
  photo: string;
  rank: number;
  title: string;
  specialization: string;
  location: string;
  propertiesSold: number;
  totalSalesValue: string;
  rating: number;
  reviewCount: number;
  yearsExperience: number;
  licenseNumber: string;
}

export interface Partner {
  id: string;
  name: string;
  logo: string;
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterSection {
  title: string;
  links: FooterLink[];
}
