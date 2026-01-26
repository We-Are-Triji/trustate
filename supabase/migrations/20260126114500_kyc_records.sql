-- KYC Records Table

CREATE TABLE IF NOT EXISTS kyc_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'id_uploaded', 'selfie_uploaded', 'analyzing', 'passed', 'approved', 'failed')),
    id_document_url TEXT,
    selfie_url TEXT,
    analysis_score INTEGER,
    analysis_complete BOOLEAN DEFAULT FALSE,
    agent_approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(transaction_id)
);

-- Enable RLS
ALTER TABLE kyc_records ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their KYC records"
    ON kyc_records FOR SELECT
    USING (
        transaction_id IN (
            SELECT id FROM transactions 
            WHERE agent_id = auth.uid() OR client_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their KYC records"
    ON kyc_records FOR ALL
    USING (
        transaction_id IN (
            SELECT id FROM transactions 
            WHERE agent_id = auth.uid() OR client_id = auth.uid()
        )
    );
