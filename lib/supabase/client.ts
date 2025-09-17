import { createBrowserClient } from '@supabase/ssr';

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
      topics: {
        Row: {
          id: string
          title: string
          summary: string
          relevance: string
          content_hook: string
          momentum: 'breaking' | 'peaking' | 'critical' | 'emerging'
          technical_depth: number
          viral_potential: number
          status: 'pending' | 'approved' | 'archived'
          my_commentary: string | null
          platform_suggestions: Json
          hashtags: string[]
          perplexity_generated_at: string
          created_at: string
          approved_at: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          summary: string
          relevance: string
          content_hook: string
          momentum: 'breaking' | 'peaking' | 'critical' | 'emerging'
          technical_depth: number
          viral_potential: number
          status?: 'pending' | 'approved' | 'archived'
          my_commentary?: string | null
          platform_suggestions?: Json
          hashtags?: string[]
          perplexity_generated_at: string
          created_at?: string
          approved_at?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          summary?: string
          relevance?: string
          content_hook?: string
          momentum?: 'breaking' | 'peaking' | 'critical' | 'emerging'
          technical_depth?: number
          viral_potential?: number
          status?: 'pending' | 'approved' | 'archived'
          my_commentary?: string | null
          platform_suggestions?: Json
          hashtags?: string[]
          perplexity_generated_at?: string
          created_at?: string
          approved_at?: string | null
          updated_at?: string
        }
      }
      topic_metrics: {
        Row: {
          id: string
          topic_id: string
          platform: 'instagram' | 'twitter' | 'youtube'
          posted_at: string
          engagement_score: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          topic_id: string
          platform: 'instagram' | 'twitter' | 'youtube'
          posted_at?: string
          engagement_score?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          topic_id?: string
          platform?: 'instagram' | 'twitter' | 'youtube'
          posted_at?: string
          engagement_score?: number | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}