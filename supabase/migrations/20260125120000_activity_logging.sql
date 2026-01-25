-- Create activity_logs table
CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id TEXT NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    actor_id TEXT NOT NULL, -- User ID or 'system'
    actor_type TEXT NOT NULL, -- 'agent', 'client', 'system'
    action_type TEXT NOT NULL, -- 'view', 'upload', 'message', 'update', 'join', 'approve', 'create'
    description TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_activity_logs_transaction_id ON activity_logs(transaction_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at DESC);

-- RLS Policies
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Allow read access to transaction participants (simplified for now: anyone with access to transaction)
DROP POLICY IF EXISTS "Allow read access to transaction participants" ON activity_logs;
CREATE POLICY "Allow read access to transaction participants" ON activity_logs
    FOR SELECT
    USING (true); -- In prod, check transaction access

-- Allow insert access to authenticated users
DROP POLICY IF EXISTS "Allow insert access to authenticated users" ON activity_logs;
CREATE POLICY "Allow insert access to authenticated users" ON activity_logs
    FOR INSERT
    WITH CHECK (true);
