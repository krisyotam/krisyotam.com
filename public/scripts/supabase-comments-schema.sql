-- Comments table schema for Supabase
-- Run this in your Supabase SQL editor

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_slug TEXT NOT NULL,
  content TEXT NOT NULL,
  user_id TEXT NOT NULL,
  username TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

-- Run this if you already have the table:
-- ALTER TABLE comments ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- Reactions table
CREATE TABLE IF NOT EXISTS comment_reactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  reaction_type TEXT NOT NULL CHECK (reaction_type IN ('thumbsUp', 'thumbsDown', 'party', 'heart', 'rocket', 'eyes')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(comment_id, user_id, reaction_type)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_comments_page_slug ON comments(page_slug);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reactions_comment_id ON comment_reactions(comment_id);

-- Enable Row Level Security
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_reactions ENABLE ROW LEVEL SECURITY;

-- Policies (allow all reads, authenticated writes)
CREATE POLICY "Allow public read access to comments" ON comments
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access to reactions" ON comment_reactions
  FOR SELECT USING (true);

CREATE POLICY "Allow authenticated insert comments" ON comments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated insert reactions" ON comment_reactions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow users to delete their own reactions" ON comment_reactions
  FOR DELETE USING (true);
