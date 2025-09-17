'use client';

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import {
  Archive,
  CheckCircle,
  XCircle,
  Zap,
  Clock,
  AlertTriangle,
  Rocket,
  Eye,
  MessageSquare
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Topic } from '@/lib/types';

interface StrategicTopicCardProps {
  topic: Topic;
  onReview: (topic: Topic) => void;
  onApprove?: (topicId: string) => void;
  onReject?: (topicId: string) => void;
  onArchive?: (topicId: string) => void;
}

const verdictColors = {
  GO: 'bg-green-100 text-green-700 border-green-300',
  PASS: 'bg-red-100 text-red-700 border-red-300',
  PIVOT: 'bg-amber-100 text-amber-700 border-amber-300',
};

const priorityColors = {
  high: 'bg-purple-100 text-purple-700',
  medium: 'bg-blue-100 text-blue-700',
  low: 'bg-gray-100 text-gray-700',
};

export function StrategicTopicCard({
  topic,
  onReview,
  onApprove,
  onReject,
  onArchive
}: StrategicTopicCardProps) {
  const [commentary, setCommentary] = useState(topic.my_commentary || '');
  const characterCount = commentary.length;

  const handleCommentaryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCommentary(e.target.value);
  };

  const handleSaveCommentary = async () => {
    try {
      const response = await fetch(`/api/topics/${topic.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          my_commentary: commentary,
          updated_at: new Date().toISOString()
        }),
      });
      if (!response.ok) {
        console.error('Failed to save commentary');
      }
    } catch (error) {
      console.error('Failed to save commentary:', error);
    }
  };

  const getScoreColor = (score?: number, max: number = 10) => {
    if (!score) return 'text-gray-400';
    const percentage = (score / max) * 100;
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    if (percentage >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const showStrategicData = topic.verdict || topic.content_goldmine_score || topic.urgency_score;

  return (
    <Card
      className={cn(
        'p-6 bg-white border border-gray-200 hover:border-gray-300 transition-all duration-200',
        topic.status === 'approved' && 'border-green-200 bg-green-50',
        topic.status === 'rejected' && 'border-red-200 bg-red-50',
        topic.verdict === 'GO' && 'ring-2 ring-green-400',
        topic.first_mover_advantage === 'yes' && 'animate-pulse'
      )}
      onClick={() => onReview(topic)}
    >
      {/* Header with Title and Verdict */}
      <div className="mb-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg text-gray-900 leading-tight flex-1 mr-3">
            {topic.clickbait_title || topic.title}
          </h3>
          {topic.verdict && (
            <Badge
              variant="outline"
              className={cn('text-sm font-bold', verdictColors[topic.verdict])}
            >
              {topic.verdict}
            </Badge>
          )}
        </div>

        {/* Subtitle/Angle */}
        {topic.angle && (
          <p className="text-sm text-gray-600 italic mb-2">&ldquo;{topic.angle}&rdquo;</p>
        )}

        {/* Strategic Badges Row */}
        <div className="flex flex-wrap gap-2 mt-3">
          {topic.first_mover_advantage === 'yes' && (
            <Badge className="bg-purple-600 text-white">
              <Rocket className="h-3 w-3 mr-1" />
              First Mover
            </Badge>
          )}

          {topic.time_sensitive && (
            <Badge className="bg-red-600 text-white">
              <Clock className="h-3 w-3 mr-1" />
              Time Sensitive
            </Badge>
          )}

          {topic.priority && (
            <Badge className={priorityColors[topic.priority]}>
              {topic.priority.toUpperCase()} Priority
            </Badge>
          )}

          {topic.complexity && (
            <Badge variant="outline" className="text-xs">
              {topic.complexity} complexity
            </Badge>
          )}

          {topic.speed_to_market && (
            <Badge variant="outline" className="text-xs">
              {topic.speed_to_market} to market
            </Badge>
          )}
        </div>
      </div>

      {/* Strategic Scoring Grid */}
      {showStrategicData && (
        <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-1">Goldmine</div>
            <div className={cn('text-2xl font-bold', getScoreColor(topic.content_goldmine_score))}>
              {topic.content_goldmine_score || '-'}/10
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-1">Urgency</div>
            <div className={cn('text-2xl font-bold', getScoreColor(topic.urgency_score))}>
              {topic.urgency_score || '-'}/10
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500 mb-1">Potential</div>
            <div className={cn('text-2xl font-bold', getScoreColor(topic.content_potential_score))}>
              {topic.content_potential_score || '-'}/10
            </div>
          </div>
        </div>
      )}

      {/* Viral Hook */}
      {topic.viral_hook && (
        <div className="mb-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
          <p className="text-sm font-medium text-purple-900">
            <Zap className="h-4 w-4 inline mr-1" />
            {topic.viral_hook}
          </p>
        </div>
      )}

      {/* Summary */}
      {topic.summary && (
        <p className="text-sm text-gray-600 mb-4 leading-relaxed line-clamp-2">
          {topic.summary}
        </p>
      )}

      {/* Content Strategy */}
      {topic.content_strategy && (
        <div className="mb-4">
          <span className="text-xs text-gray-500">Content Strategy:</span>
          <span className="ml-2 font-medium text-sm">{topic.content_strategy}</span>
        </div>
      )}

      {/* Performance Targets */}
      {(topic.views_target || topic.engagement_target) && (
        <div className="flex gap-4 mb-4 text-xs">
          {topic.views_target && (
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3 text-gray-400" />
              <span>Target: {topic.views_target}</span>
            </div>
          )}
          {topic.engagement_target && (
            <div className="flex items-center gap-1">
              <MessageSquare className="h-3 w-3 text-gray-400" />
              <span>{topic.engagement_target}</span>
            </div>
          )}
          {topic.viral_probability && (
            <Badge variant="outline" className="text-xs">
              {topic.viral_probability} viral chance
            </Badge>
          )}
        </div>
      )}

      {/* Commentary Section (for pending topics without verdict) */}
      {topic.status === 'pending' && !topic.verdict && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Your Analysis</label>
            <span className={cn(
              "text-xs font-medium",
              characterCount >= 100 ? "text-green-600" : "text-gray-400"
            )}>
              {characterCount}/100 {characterCount >= 100 && "✓"}
            </span>
          </div>
          <textarea
            value={commentary}
            onChange={handleCommentaryChange}
            placeholder="Add your strategic analysis... (minimum 100 characters to approve)"
            className="w-full p-3 text-sm border border-gray-200 rounded-lg resize-none bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            rows={3}
            onClick={(e) => e.stopPropagation()}
            onBlur={() => handleSaveCommentary()}
          />
        </div>
      )}

      {/* Reasoning (for evaluated topics) */}
      {topic.reasoning && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-900">
            <strong>AI Analysis:</strong> {topic.reasoning}
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        {topic.verdict === 'GO' && topic.status !== 'approved' && (
          <Button
            size="default"
            onClick={(e) => {
              e.stopPropagation();
              onApprove?.(topic.id);
            }}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Execute Strategy
          </Button>
        )}

        {topic.verdict === 'PASS' && topic.status !== 'rejected' && (
          <Button
            size="default"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              onReject?.(topic.id);
            }}
            className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
          >
            <XCircle className="h-4 w-4 mr-2" />
            Reject
          </Button>
        )}

        {topic.verdict === 'PIVOT' && (
          <Button
            size="default"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              onReview(topic);
            }}
            className="flex-1 border-amber-200 text-amber-600 hover:bg-amber-50"
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            Review Pivot
          </Button>
        )}

        {topic.status === 'pending' && !topic.verdict && characterCount >= 100 && (
          <Button
            size="default"
            onClick={(e) => {
              e.stopPropagation();
              onApprove?.(topic.id);
            }}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Approve
          </Button>
        )}

        {onArchive && topic.status !== 'archived' && (
          <Button
            size="default"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              onArchive(topic.id);
            }}
            className="border-gray-200 text-gray-600 hover:text-red-600 hover:bg-red-50 hover:border-red-200"
          >
            <Archive className="h-4 w-4" />
          </Button>
        )}

        {(topic.status === 'approved' || topic.status === 'in_production') && (
          <div className="flex-1 py-2 px-4 bg-green-100 text-green-700 font-medium text-center rounded-lg">
            <CheckCircle className="h-4 w-4 inline mr-2" />
            {topic.status === 'in_production' ? 'In Production' : 'Approved'}
          </div>
        )}

        {topic.status === 'published' && (
          <div className="flex-1 py-2 px-4 bg-blue-100 text-blue-700 font-medium text-center rounded-lg">
            <Eye className="h-4 w-4 inline mr-2" />
            Published
          </div>
        )}
      </div>

      {/* Metadata Footer */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500">
        <div className="flex items-center gap-4">
          {topic.discovered_at && (
            <span>
              Discovered {formatDistanceToNow(new Date(topic.discovered_at), { addSuffix: true })}
            </span>
          )}
          {topic.evaluated_at && (
            <span>
              Evaluated {formatDistanceToNow(new Date(topic.evaluated_at), { addSuffix: true })}
            </span>
          )}
        </div>
        {topic.execution_status && (
          <Badge variant="outline" className="text-xs">
            {topic.execution_status}
          </Badge>
        )}
      </div>
    </Card>
  );
}