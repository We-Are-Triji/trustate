-- Broker nexus links table
CREATE TABLE broker_nexus (
  broker_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nexus_code TEXT UNIQUE NOT NULL, -- e.g., "abc123xyz"
  totp_secret TEXT NOT NULL, -- Base32 encoded secret for TOTP
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Agent-broker relationship requests
CREATE TABLE agent_broker_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  broker_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, approved, rejected
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

-- Brokers can read their own nexus
CREATE POLICY "Brokers can view own nexus"
  ON broker_nexus FOR SELECT
  USING (auth.uid() = broker_id);

-- Brokers can update their own nexus
CREATE POLICY "Brokers can update own nexus"
  ON broker_nexus FOR UPDATE
  USING (auth.uid() = broker_id);

-- Agents can create requests
CREATE POLICY "Agents can create requests"
  ON agent_broker_requests FOR INSERT
  WITH CHECK (auth.uid() = agent_id);

-- Agents can view their own requests
CREATE POLICY "Agents can view own requests"
  ON agent_broker_requests FOR SELECT
  USING (auth.uid() = agent_id);

-- Brokers can view requests to them
CREATE POLICY "Brokers can view their requests"
  ON agent_broker_requests FOR SELECT
  USING (auth.uid() = broker_id);

-- Brokers can update requests to them
CREATE POLICY "Brokers can respond to requests"
  ON agent_broker_requests FOR UPDATE
  USING (auth.uid() = broker_id);
