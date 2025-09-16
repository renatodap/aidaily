export type Momentum = 'breaking' | 'peaking' | 'critical' | 'emerging';
export type Status = 'pending' | 'approved' | 'archived';
export type Platform = 'instagram' | 'twitter' | 'youtube';

export interface Topic {
  id: string;
  title: string;
  summary: string;
  relevance: string;
  content_hook: string;
  momentum: Momentum;
  technical_depth: number;
  viral_potential: number;
  status: Status;
  my_commentary?: string | null;
  platform_suggestions: {
    instagram: string[];
    twitter: string[];
    youtube: string[];
  };
  hashtags: string[];
  perplexity_generated_at: string;
  created_at: string;
  approved_at?: string | null;
  updated_at: string;
}

export interface TopicMetric {
  id: string;
  topic_id: string;
  platform: Platform;
  posted_at: string;
  engagement_score?: number | null;
  created_at: string;
  updated_at: string;
}

export interface TopicWithMetrics extends Topic {
  metrics?: TopicMetric[];
}

export interface DashboardStats {
  totalTopics: number;
  pendingTopics: number;
  approvedTopics: number;
  archivedTopics: number;
  averageReviewTime: number;
  approvalRate: number;
  momentumBreakdown: {
    breaking: number;
    peaking: number;
    critical: number;
    emerging: number;
  };
  technicalDepthAverage: number;
  viralPotentialAverage: number;
}

export interface TopicFilters {
  status?: Status[];
  momentum?: Momentum[];
  technicalDepthMin?: number;
  technicalDepthMax?: number;
  viralPotentialMin?: number;
  viralPotentialMax?: number;
  searchTerm?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface N8nTopicPayload {
  title: string;
  summary: string;
  relevance: string;
  content_hook: string;
  momentum: Momentum;
  technical_depth: number;
  viral_potential: number;
  platform_suggestions?: {
    instagram: string[];
    twitter: string[];
    youtube: string[];
  };
  hashtags?: string[];
  perplexity_generated_at: string;
}