-- Goals MVP Schema
-- 목표 관리 커뮤니티를 위한 데이터베이스 스키마

-- Goals table: 사용자의 목표
CREATE TABLE IF NOT EXISTS goals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT '기타',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'abandoned')),
  parent_goal_id UUID REFERENCES goals(id) ON DELETE SET NULL,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  deadline DATE,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Goal relationships: 목표 간의 관계
CREATE TABLE IF NOT EXISTS goal_relationships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  from_goal_id UUID NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
  to_goal_id UUID NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
  relationship_type TEXT NOT NULL CHECK (relationship_type IN ('supports', 'blocks', 'related')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(from_goal_id, to_goal_id)
);

-- Journals: 목표별 일기
CREATE TABLE IF NOT EXISTS journals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  goal_id UUID NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  mood TEXT CHECK (mood IN ('excited', 'happy', 'neutral', 'frustrated', 'sad')),
  progress_update INTEGER CHECK (progress_update >= 0 AND progress_update <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Goal reactions: 커뮤니티 반응
CREATE TABLE IF NOT EXISTS goal_reactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  goal_id UUID NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('like', 'support', 'celebrate', 'advice')),
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(goal_id, user_id, type)
);

-- Indexes for performance
CREATE INDEX idx_goals_user_id ON goals(user_id);
CREATE INDEX idx_goals_status ON goals(status);
CREATE INDEX idx_goals_is_public ON goals(is_public);
CREATE INDEX idx_goals_category ON goals(category);
CREATE INDEX idx_goals_created_at ON goals(created_at DESC);

CREATE INDEX idx_goal_relationships_from ON goal_relationships(from_goal_id);
CREATE INDEX idx_goal_relationships_to ON goal_relationships(to_goal_id);

CREATE INDEX idx_journals_goal_id ON journals(goal_id);
CREATE INDEX idx_journals_user_id ON journals(user_id);
CREATE INDEX idx_journals_created_at ON journals(created_at DESC);

CREATE INDEX idx_goal_reactions_goal_id ON goal_reactions(goal_id);
CREATE INDEX idx_goal_reactions_user_id ON goal_reactions(user_id);

-- Triggers for updated_at
CREATE TRIGGER update_goals_updated_at BEFORE UPDATE ON goals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_journals_updated_at BEFORE UPDATE ON journals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS)
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE goal_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE journals ENABLE ROW LEVEL SECURITY;
ALTER TABLE goal_reactions ENABLE ROW LEVEL SECURITY;

-- Goals policies
CREATE POLICY "Users can view public goals" ON goals
    FOR SELECT USING (is_public = true);

CREATE POLICY "Users can view their own goals" ON goals
    FOR SELECT USING (user_id::text = auth.uid()::text);

CREATE POLICY "Users can create their own goals" ON goals
    FOR INSERT WITH CHECK (user_id::text = auth.uid()::text);

CREATE POLICY "Users can update their own goals" ON goals
    FOR UPDATE USING (user_id::text = auth.uid()::text);

CREATE POLICY "Users can delete their own goals" ON goals
    FOR DELETE USING (user_id::text = auth.uid()::text);

-- Goal relationships policies
CREATE POLICY "Users can view relationships of public goals" ON goal_relationships
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM goals WHERE id = from_goal_id AND is_public = true) OR
        EXISTS (SELECT 1 FROM goals WHERE id = to_goal_id AND is_public = true)
    );

CREATE POLICY "Users can view relationships of their own goals" ON goal_relationships
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM goals WHERE id = from_goal_id AND user_id::text = auth.uid()::text) OR
        EXISTS (SELECT 1 FROM goals WHERE id = to_goal_id AND user_id::text = auth.uid()::text)
    );

CREATE POLICY "Users can create relationships for their own goals" ON goal_relationships
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM goals WHERE id = from_goal_id AND user_id::text = auth.uid()::text)
    );

CREATE POLICY "Users can delete relationships of their own goals" ON goal_relationships
    FOR DELETE USING (
        EXISTS (SELECT 1 FROM goals WHERE id = from_goal_id AND user_id::text = auth.uid()::text)
    );

-- Journals policies
CREATE POLICY "Users can view journals of public goals" ON journals
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM goals WHERE id = goal_id AND is_public = true)
    );

CREATE POLICY "Users can view their own journals" ON journals
    FOR SELECT USING (user_id::text = auth.uid()::text);

CREATE POLICY "Users can create journals for their own goals" ON journals
    FOR INSERT WITH CHECK (
        user_id::text = auth.uid()::text AND
        EXISTS (SELECT 1 FROM goals WHERE id = goal_id AND user_id::text = auth.uid()::text)
    );

CREATE POLICY "Users can update their own journals" ON journals
    FOR UPDATE USING (user_id::text = auth.uid()::text);

CREATE POLICY "Users can delete their own journals" ON journals
    FOR DELETE USING (user_id::text = auth.uid()::text);

-- Goal reactions policies
CREATE POLICY "Users can view reactions on public goals" ON goal_reactions
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM goals WHERE id = goal_id AND is_public = true)
    );

CREATE POLICY "Users can create reactions on public goals" ON goal_reactions
    FOR INSERT WITH CHECK (
        user_id::text = auth.uid()::text AND
        EXISTS (SELECT 1 FROM goals WHERE id = goal_id AND is_public = true)
    );

CREATE POLICY "Users can update their own reactions" ON goal_reactions
    FOR UPDATE USING (user_id::text = auth.uid()::text);

CREATE POLICY "Users can delete their own reactions" ON goal_reactions
    FOR DELETE USING (user_id::text = auth.uid()::text);

-- Views for easier querying
CREATE OR REPLACE VIEW public_goals_with_stats AS
SELECT 
  g.*,
  u.username as author_name,
  COUNT(DISTINCT j.id) as journal_count,
  COUNT(DISTINCT r.id) as reaction_count,
  COUNT(DISTINCT r_likes.id) as like_count,
  COUNT(DISTINCT r_support.id) as support_count
FROM goals g
JOIN users u ON g.user_id = u.id
LEFT JOIN journals j ON g.id = j.goal_id
LEFT JOIN goal_reactions r ON g.id = r.goal_id
LEFT JOIN goal_reactions r_likes ON g.id = r_likes.goal_id AND r_likes.type = 'like'
LEFT JOIN goal_reactions r_support ON g.id = r_support.goal_id AND r_support.type = 'support'
WHERE g.is_public = true
GROUP BY g.id, u.username;