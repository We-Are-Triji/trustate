export type TransactionStatus =
  | "initiated"
  | "client_joined"
  | "documents_pending"
  | "documents_review"
  | "payment_pending"
  | "payment_held"
  | "developer_handoff"
  | "completed"
  | "cancelled";

export type PropertyType = "house_lot" | "condo" | "lot" | "commercial";

export type DocumentType = "title" | "tax_declaration" | "contract" | "reservation" | "id" | "other";

export type DocumentStatus = "pending" | "reviewed" | "flagged" | "acknowledged";

export type ParticipantRole = "agent" | "broker" | "client";

export type ActorRole = "agent" | "broker" | "client" | "system";

export interface Transaction {
  id: string;
  status: TransactionStatus;
  agent_id: string;
  broker_id?: string;
  client_id?: string;
  developer_id?: string;
  property_address: string;
  property_type: PropertyType;
  transaction_value?: number;
  access_code: string;
  access_code_expires_at: string;
  created_at: string;
  updated_at: string;
}

export interface TransactionDocument {
  id: string;
  transaction_id: string;
  uploaded_by: string;
  document_type: DocumentType;
  file_name: string;
  file_url: string;
  ai_analysis?: Record<string, unknown>;
  status: DocumentStatus;
  created_at: string;
}

export interface TransactionLog {
  id: string;
  transaction_id: string;
  actor_id: string;
  actor_role: ActorRole;
  action: string;
  details?: Record<string, unknown>;
  created_at: string;
}

export interface TransactionParticipant {
  id: string;
  transaction_id: string;
  user_id: string;
  role: ParticipantRole;
  joined_at: string;
  last_seen_at: string;
}

export interface CreateTransactionInput {
  property_address: string;
  property_type: PropertyType;
  transaction_value?: number;
  broker_id?: string;
}
