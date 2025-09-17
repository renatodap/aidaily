'use client';

import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import {
  Archive,
  CheckCircle
} from 'lucide-react';
import { Card } from '@/components/ui/card';
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

export function TopicCard({ topic, onReview, onArchive, onQuickApprove }: TopicCardProps) {
  const [commentary, setCommentary] = useState(topic.my_commentary || '');
  const [isEditing, setIsEditing] = useState(false);

  const characterCount = commentary.length;

  const handleApprove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (characterCount >= 100 && onQuickApprove) {
      onQuickApprove(topic.id);
    }
  };

  const handleCommentaryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCommentary(e.target.value);
  };

  const handleSaveCommentary = async () => {
    // Save commentary to database
    try {
      const response = await fetch(`/api/topics/${topic.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          my_commentary: commentary,
          updated_at: new Date().toISOString()
        }),
      });
      if (response.ok) {
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Failed to save commentary:', error);
    }
  };

  return (
    <Card
      className={cn(
        'p-4 border transition-all',
        topic.status === 'approved' && 'border-green-500/50 bg-green-500/5',
        topic.status === 'archived' && 'opacity-60'
      )}
      onClick={() => !isEditing && onReview(topic)}
    >
      {/* Header */}
      <div className="mb-3">
        <h3 className="font-semibold text-base mb-1">{topic.title}</h3>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge
            variant="outline"
            className={cn('text-xs', momentumColors[topic.momentum])}
          >
            {topic.momentum}
          </Badge>
          <span className="text-xs text-muted-foreground">
            T:{topic.technical_depth}/5 V:{topic.viral_potential}/5
          </span>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(topic.perplexity_generated_at), { addSuffix: true })}
          </span>
        </div>
      </div>

      {/* Summary */}
      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
        {topic.summary}
      </p>

      {/* Commentary Input */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-medium">Your thoughts:</label>
          <span className={cn(
            "text-xs",
            characterCount >= 100 ? "text-green-600 font-medium" : "text-muted-foreground"
          )}>
            {characterCount}/100 {characterCount >= 100 && "✓"}
          </span>
        </div>
        <textarea
          value={commentary}
          onChange={handleCommentaryChange}
          placeholder="Add your 2 cents here... (minimum 100 characters to approve)"
          className="w-full p-2 text-sm border rounded-md resize-none bg-background"
          rows={3}
          onClick={(e) => {
            e.stopPropagation();
            setIsEditing(true);
          }}
          onBlur={() => handleSaveCommentary()}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        {topic.status === 'pending' && (
          <>
            <Button
              size="sm"
              variant={characterCount >= 100 ? "default" : "outline"}
              onClick={handleApprove}
              disabled={characterCount < 100}
              className={cn(
                "flex-1",
                characterCount >= 100
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "opacity-50 cursor-not-allowed"
              )}
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Approve {characterCount < 100 && `(${100 - characterCount} more chars)`}
            </Button>
            {onArchive && (
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  onArchive(topic.id);
                }}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Archive className="h-4 w-4" />
              </Button>
            )}
          </>
        )}
        {topic.status === 'approved' && (
          <Badge className="w-full justify-center bg-green-600">
            <CheckCircle className="h-4 w-4 mr-1" />
            Approved
          </Badge>
        )}
      </div>
    </Card>
  );
}