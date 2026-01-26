-- Migration: Add agent details to transactions table
-- Created: 2026-01-26

ALTER TABLE transactions ADD COLUMN IF NOT EXISTS agent_name TEXT;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS agent_email TEXT;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS agent_phone TEXT;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS brokerage_name TEXT;

COMMENT ON COLUMN transactions.agent_name IS 'Name of the agent at the time of transaction creation';
COMMENT ON COLUMN transactions.agent_email IS 'Email of the agent';
COMMENT ON COLUMN transactions.agent_phone IS 'Phone number of the agent';
COMMENT ON COLUMN transactions.brokerage_name IS 'Brokerage firm name';
