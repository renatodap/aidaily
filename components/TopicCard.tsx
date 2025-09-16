'use client';

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import {
  Clock,
  TrendingUp,
  Star,
  Hash,
  ChevronRight,
  Archive,
  CheckCircle,
  AlertCircle,
  Zap
} from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Topic } from '@/lib/types';

interface TopicCardProps {
  topic: Topic;
  onReview: (topic: Topic) => void;
  onArchive?: (topicId: string) => void;
  onQuickApprove?: (topicId: string) => void;
}

const momentumColors = {
  breaking: 'bg-red-500/10 text-red-500 border-red-500/20',
  peaking: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  critical: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  emerging: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
};

const momentumIcons = {
  breaking: <Zap className="h-3 w-3" />,
  peaking: <TrendingUp className="h-3 w-3" />,
  critical: <AlertCircle className="h-3 w-3" />,
  emerging: <Clock className="h-3 w-3" />,
};

const statusColors = {
  pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  approved: 'bg-green-500/10 text-green-500 border-green-500/20',
  archived: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
};

export function TopicCard({ topic, onReview, onArchive, onQuickApprove }: TopicCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const renderStars = (count: number, max: number = 5) => {
    return Array.from({ length: max }, (_, i) => (
      <Star
        key={i}
        className={cn(
          'h-3 w-3',
          i < count ? 'fill-yellow-500 text-yellow-500' : 'text-gray-400 dark:text-gray-600'
        )}
      />
    ));
  };

  const wordCount = topic.my_commentary
    ? topic.my_commentary.split(' ').filter(word => word.length > 0).length
    : 0;

  return (
    <Card
      className={cn(
        'transition-all duration-200 cursor-pointer',
        'hover:shadow-lg hover:-translate-y-0.5',
        topic.status === 'approved' && 'border-green-500/20',
        topic.status === 'archived' && 'opacity-60'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onReview(topic)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-lg leading-tight flex-1">
            {topic.title}
          </h3>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={cn('capitalize', statusColors[topic.status])}
            >
              {topic.status === 'approved' && <CheckCircle className="h-3 w-3 mr-1" />}
              {topic.status}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <Badge
            variant="outline"
            className={cn('capitalize flex items-center gap-1', momentumColors[topic.momentum])}
          >
            {momentumIcons[topic.momentum]}
            {topic.momentum}
          </Badge>

          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>Technical:</span>
            <div className="flex">{renderStars(topic.technical_depth)}</div>
          </div>

          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>Viral:</span>
            <div className="flex">{renderStars(topic.viral_potential)}</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {topic.summary}
        </p>

        {topic.content_hook && (
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg p-2">
            <p className="text-xs font-medium text-blue-600 dark:text-blue-400">
              Hook: {topic.content_hook}
            </p>
          </div>
        )}

        <div className="text-xs text-muted-foreground">
          {topic.relevance && (
            <p className="line-clamp-1 italic">"{topic.relevance}"</p>
          )}
        </div>

        {topic.hashtags && topic.hashtags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {topic.hashtags.slice(0, 5).map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                <Hash className="h-2 w-2 mr-0.5" />
                {tag}
              </Badge>
            ))}
            {topic.hashtags.length > 5 && (
              <Badge variant="outline" className="text-xs">
                +{topic.hashtags.length - 5} more
              </Badge>
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDistanceToNow(new Date(topic.perplexity_generated_at), { addSuffix: true })}
            </div>

            {topic.my_commentary && (
              <Badge
                variant={wordCount >= 500 ? "default" : "secondary"}
                className="text-xs"
              >
                {wordCount} words
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            {topic.status === 'pending' && (
              <>
                {onArchive && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      onArchive(topic.id);
                    }}
                    className="h-7 px-2"
                  >
                    <Archive className="h-3 w-3" />
                  </Button>
                )}
                {onQuickApprove && wordCount >= 500 && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      onQuickApprove(topic.id);
                    }}
                    className="h-7 px-2 text-green-600 hover:text-green-700"
                  >
                    <CheckCircle className="h-3 w-3" />
                  </Button>
                )}
              </>
            )}
            <Button
              size="sm"
              variant="ghost"
              className={cn(
                'h-7 px-2 transition-all',
                isHovered && 'bg-primary/10'
              )}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}