-- Drop existing tables
DROP TABLE IF EXISTS agent_broker_requests;
DROP TABLE IF EXISTS broker_nexus;

-- Recreate without foreign key constraints (using Cognito, not Supabase Auth)
CREATE TABLE broker_nexus (
  broker_id TEXT PRIMARY KEY,
  nexus_code TEXT UNIQUE NOT NULL,
  totp_secret TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE agent_broker_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id TEXT NOT NULL,
  broker_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  responded_at TIMESTAMPTZ,
  UNIQUE(agent_id, broker_id)
);

-- Indexes
CREATE INDEX idx_agent_broker_requests_agent ON agent_broker_requests(agent_id);
CREATE INDEX idx_agent_broker_requests_broker ON agent_broker_requests(broker_id);
CREATE INDEX idx_agent_broker_requests_status ON agent_broker_requests(status);

-- RLS Policies
ALTER TABLE broker_nexus ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_broker_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Brokers can view own nexus"
  ON broker_nexus FOR SELECT
  USING (true);

CREATE POLICY "Brokers can update own nexus"
  ON broker_nexus FOR UPDATE
  USING (true);

CREATE POLICY "Brokers can insert own nexus"
  ON broker_nexus FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Agents can create requests"
  ON agent_broker_requests FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Agents can view own requests"
  ON agent_broker_requests FOR SELECT
  USING (true);

CREATE POLICY "Brokers can respond to requests"
  ON agent_broker_requests FOR UPDATE
  USING (true);
