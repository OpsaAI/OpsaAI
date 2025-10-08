-- Add additional indexes for better performance
CREATE INDEX IF NOT EXISTS idx_chat_history_session_name ON chat_history(session_name);
CREATE INDEX IF NOT EXISTS idx_chat_history_user_session ON chat_history(user_id, session_name);
CREATE INDEX IF NOT EXISTS idx_chat_history_message_id ON chat_history(message_id);

-- Add constraint to ensure message_id is unique
ALTER TABLE chat_history ADD CONSTRAINT unique_message_id UNIQUE (message_id);

-- Add user preferences table for storing UI settings
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  theme VARCHAR(20) DEFAULT 'dark',
  language VARCHAR(10) DEFAULT 'en',
  notifications_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Add trigger for user_preferences updated_at
CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add file_uploads table to track uploaded files
CREATE TABLE IF NOT EXISTS file_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  filename VARCHAR(255) NOT NULL,
  file_type VARCHAR(100),
  file_size INTEGER,
  content_hash VARCHAR(64),
  upload_path TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_file_uploads_user_id ON file_uploads(user_id);
CREATE INDEX IF NOT EXISTS idx_file_uploads_content_hash ON file_uploads(content_hash);
