-- Document Signing and Developer Handoff Tables

-- Document Signing Records
CREATE TABLE IF NOT EXISTS document_signing (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    document_id TEXT NOT NULL,
    document_name TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'preparing', 'sent', 'signed', 'validated')),
    signature_fields JSONB DEFAULT '[]',
    sent_at TIMESTAMPTZ,
    signed_at TIMESTAMPTZ,
    validated_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(transaction_id, document_id)
);

-- Transmittals
CREATE TABLE IF NOT EXISTS transmittals (
    id TEXT PRIMARY KEY,
    transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    developer_name TEXT NOT NULL,
    package_items JSONB DEFAULT '[]',
    transmitted_at TIMESTAMPTZ NOT NULL,
    status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'received', 'accepted', 'rejected')),
    receipt_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add is_locked and transmitted_at to transactions if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'transactions' AND column_name = 'is_locked') THEN
        ALTER TABLE transactions ADD COLUMN is_locked BOOLEAN DEFAULT FALSE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'transactions' AND column_name = 'transmitted_at') THEN
        ALTER TABLE transactions ADD COLUMN transmitted_at TIMESTAMPTZ;
    END IF;
END $$;

-- Enable RLS
ALTER TABLE document_signing ENABLE ROW LEVEL SECURITY;
ALTER TABLE transmittals ENABLE ROW LEVEL SECURITY;

-- Policies for document_signing
CREATE POLICY "Agents can manage document signing"
    ON document_signing FOR ALL
    USING (
        transaction_id IN (
            SELECT id FROM transactions WHERE agent_id = auth.uid()
        )
    );

CREATE POLICY "Clients can view document signing"
    ON document_signing FOR SELECT
    USING (
        transaction_id IN (
            SELECT id FROM transactions WHERE client_id = auth.uid()
        )
    );

-- Policies for transmittals
CREATE POLICY "Agents can manage transmittals"
    ON transmittals FOR ALL
    USING (
        transaction_id IN (
            SELECT id FROM transactions WHERE agent_id = auth.uid()
        )
    );
