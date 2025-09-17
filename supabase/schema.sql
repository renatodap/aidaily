-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Topics table for storing AI news topics
CREATE TABLE topics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    relevance TEXT NOT NULL,
    content_hook TEXT NOT NULL,
    momentum TEXT CHECK (momentum IN ('breaking', 'peaking', 'critical', 'emerging')) NOT NULL,
    technical_depth INTEGER CHECK (technical_depth >= 1 AND technical_depth <= 5) NOT NULL,
    viral_potential INTEGER CHECK (viral_potential >= 1 AND viral_potential <= 5) NOT NULL,
    status TEXT CHECK (status IN ('pending', 'approved', 'archived')) DEFAULT 'pending' NOT NULL,
    my_commentary TEXT,
    platform_suggestions JSONB DEFAULT '{"instagram": [], "twitter": [], "youtube": []}'::jsonb,
    hashtags TEXT[] DEFAULT ARRAY[]::TEXT[],
    perplexity_generated_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    approved_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Topic metrics table for tracking performance
CREATE TABLE topic_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    topic_id UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    platform TEXT CHECK (platform IN ('instagram', 'twitter', 'youtube')) NOT NULL,
    posted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    engagement_score INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Indexes for performance
CREATE INDEX idx_topics_status ON topics(status);
CREATE INDEX idx_topics_momentum ON topics(momentum);
CREATE INDEX idx_topics_created_at ON topics(created_at DESC);
CREATE INDEX idx_topics_approved_at ON topics(approved_at DESC);
CREATE INDEX idx_topic_metrics_topic_id ON topic_metrics(topic_id);
CREATE INDEX idx_topic_metrics_platform ON topic_metrics(platform);

-- Row Level Security (RLS) - Enable it
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE topic_metrics ENABLE ROW LEVEL SECURITY;

-- Policies for public access (adjust based on your auth needs)
-- For now, allowing all operations for development
CREATE POLICY "Allow all operations on topics" ON topics
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Allow all operations on topic_metrics" ON topic_metrics
    FOR ALL USING (true) WITH CHECK (true);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_topics_updated_at BEFORE UPDATE
    ON topics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_topic_metrics_updated_at BEFORE UPDATE
    ON topic_metrics FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to validate commentary length (minimum 100 characters)
CREATE OR REPLACE FUNCTION validate_commentary_length()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'approved' AND NEW.my_commentary IS NOT NULL THEN
        IF length(NEW.my_commentary) < 100 THEN
            RAISE EXCEPTION 'Commentary must be at least 100 characters to approve topic';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER validate_commentary_before_approval
    BEFORE UPDATE OF status ON topics
    FOR EACH ROW
    WHEN (NEW.status = 'approved')
    EXECUTE FUNCTION validate_commentary_length();