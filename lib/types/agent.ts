export type AgentStatus = "active" | "inactive" | "invited";

export type AgentCategory = "managerial" | "non-management";

export type EmploymentType = "fulltime" | "part-time" | "contract";

export interface AgentProfile {
  id: string;
  employeeCode: string;
  name: string;
  email: string;
  phone: string;
  photo: string;
  title: string;
  department: string;
  status: AgentStatus;
  category: AgentCategory;
  employmentType: EmploymentType;
  joinedDate: string;
  specializations: string[];
  location: string;
  licenseNumber: string;
  rating: number;
  reviewCount: number;
  propertiesSold: number;
  totalSalesValue: string;
  yearsExperience: number;
}

export interface AgentFilters {
  search: string;
  status: AgentStatus | "all";
  category: AgentCategory | "all";
  employmentType: EmploymentType | "all";
  specialization: string | "all";
}
