export type Momentum = 'breaking' | 'peaking' | 'critical' | 'emerging';
export type Status = 'pending' | 'pending_review' | 'approved' | 'rejected' | 'archived' | 'in_production' | 'published';
export type Platform = 'instagram' | 'twitter' | 'youtube' | 'tiktok' | 'blog';
export type Verdict = 'GO' | 'PASS' | 'PIVOT';
export type Complexity = 'simple' | 'medium' | 'complex';
export type ContentType = 'instagram_carousel' | 'youtube_script' | 'blog_post';
export type ProductionStatus = 'not_started' | 'filming' | 'editing' | 'complete';
export type PerformanceTier = 'viral' | 'high' | 'average' | 'low' | 'failed';

export interface Topic {
  id: string;
  title: string;
  summary?: string;
  relevance?: string;
  content_hook?: string;
  momentum?: Momentum;
  technical_depth?: number;
  viral_potential?: number;
  status: Status;
  my_commentary?: string | null;
  platform_suggestions?: {
    instagram?: string[];
    twitter?: string[];
    youtube?: string[];
  };
  hashtags: string[];
  perplexity_generated_at?: string;
  created_at: string;
  approved_at?: string | null;
  updated_at?: string;

  // Strategic scoring fields
  angle?: string;
  complexity?: Complexity;
  time_sensitive?: boolean;
  test_url?: string | null;
  clickbait_title?: string;
  thumbnail_controversy?: string;
  comment_bait?: string;
  content_goldmine_score?: number;
  first_mover_advantage?: string;
  urgency_score?: number;
  combined_score?: number;
  evidence_urls?: string[];
  viral_hook?: string;
  controversy_level?: 'low' | 'medium' | 'high';
  estimated_interest?: 'niche' | 'broad' | 'viral';

  // Evaluation fields
  verdict?: Verdict;
  reasoning?: string;
  content_potential_score?: number;
  content_strategy?: string;
  execution_status?: string;
  speed_to_market?: string;
  format_recommendations?: Record<string, unknown>;
  video_strategy?: Record<string, unknown>;
  production_plan?: Record<string, unknown>;
  distribution_plan?: Record<string, unknown>;
  repurpose_cascade?: Record<string, unknown>;
  priority?: 'high' | 'medium' | 'low';

  // Timing and production
  optimal_release_day?: string;
  optimal_release_time?: string;
  production_time?: string;
  editing_time?: string;
  views_target?: string;
  engagement_target?: string;
  viral_probability?: string;
  success_indicators?: string[];
  shortcuts_allowed?: string[];
  delegate_options?: string[];
  tags?: string[];
  batch_group?: string;

  // Tracking fields
  discovered_at?: string;
  evaluated_at?: string;
  production_started_at?: string;
  production_completed_at?: string;
  published_at?: string;
  actual_views?: number;
  actual_engagement_rate?: number;
  roi_score?: number;
  day_discovered?: string;
  hour_discovered?: number;
  is_weekday?: boolean;
  is_optimal_time?: boolean;
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
  verdict?: Verdict[];
  minGoldmineScore?: number;
  hasFirstMover?: boolean;
  priority?: ('high' | 'medium' | 'low')[];
}

export interface ContentPiece {
  id: string;
  topic_id?: string;
  content_type?: ContentType;
  title?: string;
  content?: Record<string, unknown>;
  word_count?: number;
  status?: 'draft' | 'reviewed' | 'published';
  production_status?: ProductionStatus;
  platform_metadata?: Record<string, unknown>;
  visual_assets?: Record<string, unknown>;
  generated_at?: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ContentPerformance {
  id: string;
  content_piece_id?: string;
  topic_id?: string;
  platform: Platform;
  format_type: 'long_video' | 'short_video' | 'carousel' | 'post' | 'thread';
  views?: number;
  likes?: number;
  comments?: number;
  shares?: number;
  saves?: number;
  engagement_rate?: number;
  watch_time_average?: number;
  click_through_rate?: number;
  published_at: string;
  checked_at?: string;
  hours_since_publish?: number;
  performance_tier?: PerformanceTier;
  performance_notes?: string;
  created_at: string;
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