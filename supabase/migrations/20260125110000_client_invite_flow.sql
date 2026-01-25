-- Add client status and invite fields to transactions
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS client_status TEXT DEFAULT 'none' CHECK (client_status IN ('none', 'pending', 'approved', 'rejected'));
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS client_invite_code TEXT;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS client_invite_expires_at TIMESTAMPTZ;
ALTER TABLE transactions ADD COLUMN IF NOT EXISTS developer_id TEXT;

-- Update existing transactions to have a default client_status
UPDATE transactions 
SET client_status = CASE 
    WHEN client_id IS NOT NULL THEN 'approved' 
    ELSE 'none' 
END;

-- Add comment
COMMENT ON COLUMN transactions.client_status IS 'Status of the client in the transaction: none, pending, approved, rejected';
