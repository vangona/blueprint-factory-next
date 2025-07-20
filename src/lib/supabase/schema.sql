-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (simple auth for MVP)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT UNIQUE NOT NULL,
  email TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Blueprints table
CREATE TABLE IF NOT EXISTS blueprints (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  nodes JSONB NOT NULL DEFAULT '[]',
  edges JSONB NOT NULL DEFAULT '[]',
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  privacy TEXT NOT NULL DEFAULT 'private' CHECK (privacy IN ('private', 'unlisted', 'public')),
  category TEXT NOT NULL DEFAULT '기타',
  thumbnail TEXT,
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Blueprint gallery view (for efficient public blueprint queries)
CREATE OR REPLACE VIEW blueprint_gallery AS
SELECT 
  b.id,
  b.title,
  b.description,
  b.author_id,
  u.username as author_name,
  b.privacy,
  b.category,
  b.thumbnail,
  b.view_count,
  b.like_count,
  b.created_at,
  b.updated_at,
  jsonb_array_length(b.nodes) as node_count,
  COALESCE(
    (SELECT AVG((node->>'progress')::numeric) 
     FROM jsonb_array_elements(b.nodes) as node
     WHERE node->>'progress' IS NOT NULL), 
    0
  ) as progress
FROM blueprints b
JOIN users u ON b.author_id = u.id
WHERE b.privacy = 'public';

-- Indexes for performance
CREATE INDEX idx_blueprints_author_id ON blueprints(author_id);
CREATE INDEX idx_blueprints_privacy ON blueprints(privacy);
CREATE INDEX idx_blueprints_category ON blueprints(category);
CREATE INDEX idx_blueprints_created_at ON blueprints(created_at DESC);
CREATE INDEX idx_blueprints_view_count ON blueprints(view_count DESC);
CREATE INDEX idx_blueprints_like_count ON blueprints(like_count DESC);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blueprints_updated_at BEFORE UPDATE ON blueprints
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE blueprints ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (auth.uid()::text = id::text);

-- Blueprints policies
CREATE POLICY "Anyone can view public blueprints" ON blueprints
    FOR SELECT USING (privacy = 'public');

CREATE POLICY "Anyone can view unlisted blueprints" ON blueprints
    FOR SELECT USING (privacy = 'unlisted');

CREATE POLICY "Users can view their own private blueprints" ON blueprints
    FOR SELECT USING (author_id::text = auth.uid()::text AND privacy = 'private');

CREATE POLICY "Users can create their own blueprints" ON blueprints
    FOR INSERT WITH CHECK (author_id::text = auth.uid()::text);

CREATE POLICY "Users can update their own blueprints" ON blueprints
    FOR UPDATE USING (author_id::text = auth.uid()::text);

CREATE POLICY "Users can delete their own blueprints" ON blueprints
    FOR DELETE USING (author_id::text = auth.uid()::text);

-- Function to increment view count
CREATE OR REPLACE FUNCTION increment_view_count(blueprint_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE blueprints
    SET view_count = view_count + 1
    WHERE id = blueprint_id;
END;
$$ LANGUAGE plpgsql;