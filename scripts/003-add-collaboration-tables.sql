-- Add collaboration tables for team features
-- This script adds tables for collaboration sessions, shared files, and analysis results

-- Create collaboration_sessions table
CREATE TABLE IF NOT EXISTS collaboration_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    participants JSONB DEFAULT '[]'::jsonb,
    files JSONB DEFAULT '[]'::jsonb,
    analysis_results JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'archived', 'deleted'))
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_collaboration_sessions_owner ON collaboration_sessions(owner_id);
CREATE INDEX IF NOT EXISTS idx_collaboration_sessions_participants ON collaboration_sessions USING GIN(participants);
CREATE INDEX IF NOT EXISTS idx_collaboration_sessions_status ON collaboration_sessions(status);
CREATE INDEX IF NOT EXISTS idx_collaboration_sessions_updated_at ON collaboration_sessions(updated_at DESC);

-- Create collaboration_comments table for real-time collaboration
CREATE TABLE IF NOT EXISTS collaboration_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES collaboration_sessions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    file_name VARCHAR(255),
    line_number INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for comments
CREATE INDEX IF NOT EXISTS idx_collaboration_comments_session ON collaboration_comments(session_id);
CREATE INDEX IF NOT EXISTS idx_collaboration_comments_user ON collaboration_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_collaboration_comments_created_at ON collaboration_comments(created_at DESC);

-- Create collaboration_activities table for audit trail
CREATE TABLE IF NOT EXISTS collaboration_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES collaboration_sessions(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    activity_type VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for activities
CREATE INDEX IF NOT EXISTS idx_collaboration_activities_session ON collaboration_activities(session_id);
CREATE INDEX IF NOT EXISTS idx_collaboration_activities_user ON collaboration_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_collaboration_activities_type ON collaboration_activities(activity_type);
CREATE INDEX IF NOT EXISTS idx_collaboration_activities_created_at ON collaboration_activities(created_at DESC);

-- Add triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers
DROP TRIGGER IF EXISTS update_collaboration_sessions_updated_at ON collaboration_sessions;
CREATE TRIGGER update_collaboration_sessions_updated_at
    BEFORE UPDATE ON collaboration_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_collaboration_comments_updated_at ON collaboration_comments;
CREATE TRIGGER update_collaboration_comments_updated_at
    BEFORE UPDATE ON collaboration_comments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add RLS (Row Level Security) policies
ALTER TABLE collaboration_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE collaboration_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE collaboration_activities ENABLE ROW LEVEL SECURITY;

-- Policy for collaboration_sessions: users can only see sessions they own or participate in
CREATE POLICY collaboration_sessions_policy ON collaboration_sessions
    FOR ALL TO authenticated
    USING (
        owner_id = auth.uid()::uuid OR 
        participants @> to_jsonb(auth.uid()::text)
    );

-- Policy for collaboration_comments: users can only see comments in sessions they have access to
CREATE POLICY collaboration_comments_policy ON collaboration_comments
    FOR ALL TO authenticated
    USING (
        session_id IN (
            SELECT id FROM collaboration_sessions 
            WHERE owner_id = auth.uid()::uuid OR 
                  participants @> to_jsonb(auth.uid()::text)
        )
    );

-- Policy for collaboration_activities: users can only see activities in sessions they have access to
CREATE POLICY collaboration_activities_policy ON collaboration_activities
    FOR ALL TO authenticated
    USING (
        session_id IN (
            SELECT id FROM collaboration_sessions 
            WHERE owner_id = auth.uid()::uuid OR 
                  participants @> to_jsonb(auth.uid()::text)
        )
    );

-- Grant necessary permissions
GRANT ALL ON collaboration_sessions TO authenticated;
GRANT ALL ON collaboration_comments TO authenticated;
GRANT ALL ON collaboration_activities TO authenticated;

-- Grant sequence permissions
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
