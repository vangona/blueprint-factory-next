-- Migration: Add privacy enum constraint
-- This ensures type safety for the privacy column

-- Step 1: Create enum type for privacy
DO $$ BEGIN
    CREATE TYPE privacy_level AS ENUM ('private', 'unlisted', 'public');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Step 2: Drop RLS policies that depend on the privacy column
DROP POLICY IF EXISTS "Anyone can view public blueprints" ON blueprints;
DROP POLICY IF EXISTS "Anyone can view unlisted blueprints" ON blueprints;
DROP POLICY IF EXISTS "Users can view their own private blueprints" ON blueprints;

-- Step 3: Drop views that depend on the privacy column
DROP VIEW IF EXISTS blueprint_gallery;

-- Step 4: Update existing data to ensure consistency
UPDATE blueprints 
SET privacy = 'private' 
WHERE privacy NOT IN ('private', 'unlisted', 'public');

-- Step 5: Drop existing default value first
ALTER TABLE blueprints 
ALTER COLUMN privacy DROP DEFAULT;

-- Step 6: Alter column to use enum type
ALTER TABLE blueprints 
ALTER COLUMN privacy TYPE privacy_level 
USING privacy::privacy_level;

-- Step 7: Set new default value
ALTER TABLE blueprints 
ALTER COLUMN privacy SET DEFAULT 'private'::privacy_level;

-- Step 8: Recreate the view with enum type

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

-- Step 9: Recreate RLS policies with enum type

CREATE POLICY "Anyone can view public blueprints" ON blueprints
    FOR SELECT USING (privacy = 'public'::privacy_level);

CREATE POLICY "Anyone can view unlisted blueprints" ON blueprints
    FOR SELECT USING (privacy = 'unlisted'::privacy_level);

CREATE POLICY "Users can view their own private blueprints" ON blueprints
    FOR SELECT USING (author_id::text = auth.uid()::text AND privacy = 'private'::privacy_level);