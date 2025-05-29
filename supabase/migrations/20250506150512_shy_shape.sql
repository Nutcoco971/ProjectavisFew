/*
  # Initial Schema Setup for MonSiteAvis

  1. New Tables
    - `users`
      - Custom user data extending Supabase auth
      - Stores profile information and preferences
    - `contents`
      - Stores all media content (films, series, music, podcasts)
      - Includes metadata and external API references
    - `reviews`
      - Stores user reviews for content
      - Supports anonymous reviews and ephemeral content
    - `lists`
      - User-created content lists
      - Supports tags and visibility settings
    - `list_items`
      - Junction table for contents in lists
    - `tags`
      - Reusable tags for lists and content
    - `admin_queue`
      - Pending content for admin review
      
  2. Security
    - Enable RLS on all tables
    - Set up policies for data access
    
  3. Functions
    - Anonymous review handling
    - Review uniqueness checking
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth)
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  username text UNIQUE NOT NULL,
  display_name text,
  bio text,
  avatar_url text,
  is_admin boolean DEFAULT false,
  favorite_genres text[] DEFAULT '{}',
  emotional_tags text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Content types enum
CREATE TYPE content_type AS ENUM ('film', 'series', 'music', 'podcast');

-- Contents table
CREATE TABLE IF NOT EXISTS contents (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  type content_type NOT NULL,
  title text NOT NULL,
  original_title text,
  year integer,
  description text,
  cover_image_url text,
  creator text,
  external_ids jsonb DEFAULT '{}',
  platforms jsonb DEFAULT '{}',
  genres text[] DEFAULT '{}',
  metadata jsonb DEFAULT '{}',
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_id uuid REFERENCES contents(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  anonymous_id text,
  rating integer CHECK (rating >= 1 AND rating <= 5),
  emoji text,
  keyword text CHECK (char_length(keyword) <= 20),
  text text,
  audio_url text,
  context text,
  has_spoilers boolean DEFAULT false,
  is_ephemeral boolean DEFAULT false,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Lists table
CREATE TABLE IF NOT EXISTS lists (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  is_public boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- List items junction table
CREATE TABLE IF NOT EXISTS list_items (
  list_id uuid REFERENCES lists(id) ON DELETE CASCADE,
  content_id uuid REFERENCES contents(id) ON DELETE CASCADE,
  added_at timestamptz DEFAULT now(),
  PRIMARY KEY (list_id, content_id)
);

-- Tags table
CREATE TABLE IF NOT EXISTS tags (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Admin queue table
CREATE TABLE IF NOT EXISTS admin_queue (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_type content_type NOT NULL,
  raw_data jsonb NOT NULL,
  status text DEFAULT 'pending',
  processed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE list_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_queue ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users policies
CREATE POLICY "Users can read all profiles"
  ON users FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Contents policies
CREATE POLICY "Anyone can read published content"
  ON contents FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

CREATE POLICY "Admins can manage all content"
  ON contents FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid() AND users.is_admin = true
  ));

-- Reviews policies
CREATE POLICY "Anyone can read reviews"
  ON reviews FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Users can create reviews"
  ON reviews FOR INSERT
  TO authenticated
  WITH CHECK (
    NOT EXISTS (
      SELECT 1 FROM reviews
      WHERE content_id = NEW.content_id
      AND (user_id = auth.uid() OR anonymous_id = NEW.anonymous_id)
    )
  );

-- Lists policies
CREATE POLICY "Anyone can read public lists"
  ON lists FOR SELECT
  TO anon, authenticated
  USING (is_public = true);

CREATE POLICY "Users can manage own lists"
  ON lists FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Functions

-- Function to check review uniqueness
CREATE OR REPLACE FUNCTION check_review_uniqueness()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM reviews
    WHERE content_id = NEW.content_id
    AND (
      (user_id IS NOT NULL AND user_id = NEW.user_id)
      OR (anonymous_id IS NOT NULL AND anonymous_id = NEW.anonymous_id)
    )
  ) THEN
    RAISE EXCEPTION 'User has already reviewed this content';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for review uniqueness
CREATE TRIGGER ensure_review_uniqueness
  BEFORE INSERT ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION check_review_uniqueness();

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_contents_type ON contents(type);
CREATE INDEX IF NOT EXISTS idx_reviews_content_id ON reviews(content_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_anonymous_id ON reviews(anonymous_id);
CREATE INDEX IF NOT EXISTS idx_lists_user_id ON lists(user_id);