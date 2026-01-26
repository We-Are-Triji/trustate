-- Transaction Step Progress Tracking
-- Tracks completion of sub-steps within each phase

CREATE TABLE IF NOT EXISTS transaction_step_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    
    -- Step 1: Reservation & Escrow sub-steps
    documents_uploaded BOOLEAN DEFAULT FALSE,
    ra_uploaded BOOLEAN DEFAULT FALSE,
    bis_uploaded BOOLEAN DEFAULT FALSE,
    client_joined BOOLEAN DEFAULT FALSE,
    payment_confirmed BOOLEAN DEFAULT FALSE,
    
    -- Step 2: KYC & Identity
    kyc_completed BOOLEAN DEFAULT FALSE,
    
    -- Step 3: Document Assembly
    documents_signed BOOLEAN DEFAULT FALSE,
    
    -- Step 4: Developer Handoff
    developer_accepted BOOLEAN DEFAULT FALSE,
    
    -- Step 5: Commission Release
    commission_released BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(transaction_id)
);

-- Enable RLS
ALTER TABLE transaction_step_progress ENABLE ROW LEVEL SECURITY;

-- Policy: Agents can manage their transaction progress
CREATE POLICY "Agents can manage step progress"
    ON transaction_step_progress
    FOR ALL
    USING (
        transaction_id IN (
            SELECT id FROM transactions WHERE agent_id = auth.uid()
        )
    );

-- Policy: Clients can view step progress for their transactions
CREATE POLICY "Clients can view step progress"
    ON transaction_step_progress
    FOR SELECT
    USING (
        transaction_id IN (
            SELECT id FROM transactions WHERE client_id = auth.uid()
        )
    );

-- Function to auto-create progress record when transaction is created
CREATE OR REPLACE FUNCTION create_step_progress()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO transaction_step_progress (transaction_id)
    VALUES (NEW.id)
    ON CONFLICT (transaction_id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-create progress record
DROP TRIGGER IF EXISTS trigger_create_step_progress ON transactions;
CREATE TRIGGER trigger_create_step_progress
    AFTER INSERT ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION create_step_progress();

-- Function to update lifecycle_step based on progress
CREATE OR REPLACE FUNCTION update_lifecycle_step()
RETURNS TRIGGER AS $$
BEGIN
    -- If commission released, step 5
    IF NEW.commission_released THEN
        UPDATE transactions SET lifecycle_step = 5 WHERE id = NEW.transaction_id;
    -- If developer accepted, step 4
    ELSIF NEW.developer_accepted THEN
        UPDATE transactions SET lifecycle_step = 4 WHERE id = NEW.transaction_id;
    -- If documents signed, step 3
    ELSIF NEW.documents_signed THEN
        UPDATE transactions SET lifecycle_step = 3 WHERE id = NEW.transaction_id;
    -- If KYC completed, step 2
    ELSIF NEW.kyc_completed THEN
        UPDATE transactions SET lifecycle_step = 2 WHERE id = NEW.transaction_id;
    -- If payment confirmed (all Step 1 sub-steps done), move to step 2
    ELSIF NEW.payment_confirmed THEN
        UPDATE transactions SET lifecycle_step = 2 WHERE id = NEW.transaction_id;
    END IF;
    
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update lifecycle step on progress change
DROP TRIGGER IF EXISTS trigger_update_lifecycle_step ON transaction_step_progress;
CREATE TRIGGER trigger_update_lifecycle_step
    BEFORE UPDATE ON transaction_step_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_lifecycle_step();

-- Create progress records for existing transactions
INSERT INTO transaction_step_progress (transaction_id)
SELECT id FROM transactions
ON CONFLICT (transaction_id) DO NOTHING;
