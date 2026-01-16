-- Migration: Create transaction tables
-- Created: 2026-01-16

-- Enum types
CREATE TYPE transaction_status AS ENUM (
  'initiated',
  'client_joined',
  'documents_pending',
  'documents_review',
  'payment_pending',
  'payment_held',
  'developer_handoff',
  'completed',
  'cancelled'
);

CREATE TYPE property_type AS ENUM (
  'house_lot',
  'condo',
  'lot',
  'commercial'
);

CREATE TYPE document_type AS ENUM (
  'title',
  'tax_declaration',
  'contract',
  'reservation',
  'id',
  'other'
);

CREATE TYPE document_status AS ENUM (
  'pending',
  'reviewed',
  'flagged',
  'acknowledged'
);

CREATE TYPE participant_role AS ENUM (
  'agent',
  'broker',
  'client'
);

CREATE TYPE actor_role AS ENUM (
  'agent',
  'broker',
  'client',
  'system'
);

-- Transactions table
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  status transaction_status NOT NULL DEFAULT 'initiated',
  agent_id UUID NOT NULL,
  broker_id UUID,
  client_id UUID,
  developer_id UUID,
  property_address TEXT NOT NULL,
  property_type property_type NOT NULL,
  transaction_value DECIMAL(15, 2),
  access_code TEXT NOT NULL,
  access_code_expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transaction documents table
CREATE TABLE transaction_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
  uploaded_by UUID NOT NULL,
  document_type document_type NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  ai_analysis JSONB,
  status document_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transaction activity log table
CREATE TABLE transaction_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
  actor_id UUID NOT NULL,
  actor_role actor_role NOT NULL,
  action TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Transaction participants table
CREATE TABLE transaction_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role participant_role NOT NULL,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(transaction_id, user_id)
);

-- Indexes for performance
CREATE INDEX idx_transactions_agent_id ON transactions(agent_id);
CREATE INDEX idx_transactions_broker_id ON transactions(broker_id);
CREATE INDEX idx_transactions_client_id ON transactions(client_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transaction_documents_transaction_id ON transaction_documents(transaction_id);
CREATE INDEX idx_transaction_logs_transaction_id ON transaction_logs(transaction_id);
CREATE INDEX idx_transaction_logs_created_at ON transaction_logs(created_at);
CREATE INDEX idx_transaction_participants_transaction_id ON transaction_participants(transaction_id);
CREATE INDEX idx_transaction_participants_user_id ON transaction_participants(user_id);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to transactions table
CREATE TRIGGER update_transactions_updated_at
  BEFORE UPDATE ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS)
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_participants ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Participants can access their transactions
CREATE POLICY "Participants can view transactions"
  ON transactions FOR SELECT
  USING (
    id IN (
      SELECT transaction_id FROM transaction_participants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Agents can create transactions"
  ON transactions FOR INSERT
  WITH CHECK (agent_id = auth.uid());

CREATE POLICY "Participants can update transactions"
  ON transactions FOR UPDATE
  USING (
    id IN (
      SELECT transaction_id FROM transaction_participants WHERE user_id = auth.uid()
    )
  );

-- Documents policies
CREATE POLICY "Participants can view documents"
  ON transaction_documents FOR SELECT
  USING (
    transaction_id IN (
      SELECT transaction_id FROM transaction_participants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Participants can upload documents"
  ON transaction_documents FOR INSERT
  WITH CHECK (
    transaction_id IN (
      SELECT transaction_id FROM transaction_participants WHERE user_id = auth.uid()
    )
  );

-- Logs policies
CREATE POLICY "Participants can view logs"
  ON transaction_logs FOR SELECT
  USING (
    transaction_id IN (
      SELECT transaction_id FROM transaction_participants WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "System can insert logs"
  ON transaction_logs FOR INSERT
  WITH CHECK (true);

-- Participants policies
CREATE POLICY "Participants can view participants"
  ON transaction_participants FOR SELECT
  USING (
    transaction_id IN (
      SELECT tp.transaction_id FROM transaction_participants tp WHERE tp.user_id = auth.uid()
    )
  );

CREATE POLICY "Agents can add participants"
  ON transaction_participants FOR INSERT
  WITH CHECK (
    transaction_id IN (
      SELECT id FROM transactions WHERE agent_id = auth.uid()
    )
  );
