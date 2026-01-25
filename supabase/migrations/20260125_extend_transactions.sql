-- Migration: Extend transactions table with new form fields
-- Created: 2026-01-25

-- Add transaction_type enum
CREATE TYPE transaction_type AS ENUM ('preselling', 'resale', 'rental');

-- Add new columns to transactions table
ALTER TABLE transactions
ADD COLUMN project_name TEXT,
ADD COLUMN transaction_type transaction_type DEFAULT 'preselling',
ADD COLUMN unit_address TEXT,
ADD COLUMN client_name TEXT,
ADD COLUMN reservation_number TEXT,
ADD COLUMN lifecycle_step INTEGER DEFAULT 1 CHECK (lifecycle_step >= 1 AND lifecycle_step <= 6);

-- Update property_address to be nullable (we now use project_name + unit_address)
ALTER TABLE transactions
ALTER COLUMN property_address DROP NOT NULL;

-- Add index for lifecycle step queries
CREATE INDEX idx_transactions_lifecycle_step ON transactions(lifecycle_step);

-- Comment for documentation
COMMENT ON COLUMN transactions.project_name IS 'Name of the real estate project (e.g., Mandani Bay)';
COMMENT ON COLUMN transactions.transaction_type IS 'Type of transaction: preselling, resale, or rental';
COMMENT ON COLUMN transactions.unit_address IS 'Specific unit address (e.g., Tower 2, Unit 15-B)';
COMMENT ON COLUMN transactions.client_name IS 'Name of the buyer/client';
COMMENT ON COLUMN transactions.reservation_number IS 'Optional OR number for reservation proof';
COMMENT ON COLUMN transactions.lifecycle_step IS 'Current step in the 6-phase transaction lifecycle (1-6)';
