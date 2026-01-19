export type BrokerType = "firm" | "individual";

export type BrokerStatus = "active" | "inactive" | "pending";

export interface BrokerageRepresentative {
  id: string;
  name: string;
  email: string;
  phone: string;
  photo: string;
  title: string;
  licenseNumber: string;
}

export interface BrokerageFirm {
  id: string;
  type: "firm";
  name: string;
  logo: string;
  description: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  city: string;
  status: BrokerStatus;
  representative: BrokerageRepresentative;
  specializations: string[];
  agentCount: number;
  propertiesListed: number;
  totalSalesValue: string;
  yearsInBusiness: number;
  rating: number;
  reviewCount: number;
  joinedDate: string;
}

export interface IndividualBroker {
  id: string;
  type: "individual";
  name: string;
  email: string;
  phone: string;
  photo: string;
  title: string;
  status: BrokerStatus;
  licenseNumber: string;
  specializations: string[];
  location: string;
  propertiesSold: number;
  totalSalesValue: string;
  yearsExperience: number;
  rating: number;
  reviewCount: number;
  joinedDate: string;
}

export type Broker = BrokerageFirm | IndividualBroker;

export interface BrokerFilters {
  search: string;
  status: BrokerStatus | "all";
  specialization: string | "all";
}
