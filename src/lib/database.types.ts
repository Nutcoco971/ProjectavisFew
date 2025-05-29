export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          username: string
          display_name: string | null
          bio: string | null
          avatar_url: string | null
          is_admin: boolean
          favorite_genres: string[]
          emotional_tags: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          display_name?: string | null
          bio?: string | null
          avatar_url?: string | null
          is_admin?: boolean
          favorite_genres?: string[]
          emotional_tags?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          display_name?: string | null
          bio?: string | null
          avatar_url?: string | null
          is_admin?: boolean
          favorite_genres?: string[]
          emotional_tags?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      contents: {
        Row: {
          id: string
          type: 'film' | 'series' | 'music' | 'podcast'
          title: string
          original_title: string | null
          year: number | null
          description: string | null
          cover_image_url: string | null
          creator: string | null
          external_ids: Json
          platforms: Json
          genres: string[]
          metadata: Json
          is_published: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          type: 'film' | 'series' | 'music' | 'podcast'
          title: string
          original_title?: string | null
          year?: number | null
          description?: string | null
          cover_image_url?: string | null
          creator?: string | null
          external_ids?: Json
          platforms?: Json
          genres?: string[]
          metadata?: Json
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          type?: 'film' | 'series' | 'music' | 'podcast'
          title?: string
          original_title?: string | null
          year?: number | null
          description?: string | null
          cover_image_url?: string | null
          creator?: string | null
          external_ids?: Json
          platforms?: Json
          genres?: string[]
          metadata?: Json
          is_published?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          content_id: string | null
          user_id: string | null
          anonymous_id: string | null
          rating: number | null
          emoji: string | null
          keyword: string | null
          text: string | null
          audio_url: string | null
          context: string | null
          has_spoilers: boolean
          is_ephemeral: boolean
          expires_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          content_id?: string | null
          user_id?: string | null
          anonymous_id?: string | null
          rating?: number | null
          emoji?: string | null
          keyword?: string | null
          text?: string | null
          audio_url?: string | null
          context?: string | null
          has_spoilers?: boolean
          is_ephemeral?: boolean
          expires_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          content_id?: string | null
          user_id?: string | null
          anonymous_id?: string | null
          rating?: number | null
          emoji?: string | null
          keyword?: string | null
          text?: string | null
          audio_url?: string | null
          context?: string | null
          has_spoilers?: boolean
          is_ephemeral?: boolean
          expires_at?: string | null
          created_at?: string
        }
      }
      lists: {
        Row: {
          id: string
          user_id: string | null
          title: string
          description: string | null
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          title: string
          description?: string | null
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          title?: string
          description?: string | null
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}