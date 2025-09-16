import { createBrowserClient } from '@supabase/ssr';
import type { Topic, TopicMetric } from '@/lib/types';

export interface Database {
  public: {
    Tables: {
      topics: {
        Row: Topic;
        Insert: Omit<Topic, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Topic, 'id' | 'created_at' | 'updated_at'>>;
      };
      topic_metrics: {
        Row: TopicMetric;
        Insert: Omit<TopicMetric, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<TopicMetric, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
}

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}