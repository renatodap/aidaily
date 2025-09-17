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
  breaking: 'bg-red-50 text-red-700 border-red-200',
  peaking: 'bg-amber-50 text-amber-700 border-amber-200',
  critical: 'bg-purple-50 text-purple-700 border-purple-200',
  emerging: 'bg-blue-50 text-blue-700 border-blue-200',
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
        'p-6 bg-white border border-gray-200 hover:border-gray-300 transition-all duration-200 shadow-sm hover:shadow-md',
        topic.status === 'approved' && 'border-green-200 bg-green-50',
        topic.status === 'archived' && 'opacity-50'
      )}
      onClick={() => !isEditing && onReview(topic)}
    >
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold text-lg text-gray-900 leading-tight flex-1 mr-3">
            {topic.title}
          </h3>
          {topic.momentum && (
            <Badge
              variant="outline"
              className={cn('text-xs font-medium shrink-0', momentumColors[topic.momentum])}
            >
              {topic.momentum}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-4 text-xs text-gray-500">
          {topic.technical_depth && (
            <div className="flex items-center gap-1">
              <span>Technical:</span>
              <span className="font-medium text-gray-700">{topic.technical_depth}/5</span>
            </div>
          )}
          {topic.viral_potential && (
            <div className="flex items-center gap-1">
              <span>Viral:</span>
              <span className="font-medium text-gray-700">{topic.viral_potential}/5</span>
            </div>
          )}
          {topic.perplexity_generated_at && (
            <div className="flex items-center gap-1">
              <span>{formatDistanceToNow(new Date(topic.perplexity_generated_at), { addSuffix: true })}</span>
            </div>
          )}
        </div>
      </div>

      {/* Summary */}
      <p className="text-sm text-gray-600 mb-4 leading-relaxed line-clamp-2">
        {topic.summary}
      </p>

      {/* Commentary Input */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">Your thoughts</label>
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
          placeholder="Add your commentary here... (minimum 100 characters to approve)"
          className="w-full p-3 text-sm border border-gray-200 rounded-lg resize-none bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
          rows={3}
          onClick={(e) => {
            e.stopPropagation();
            setIsEditing(true);
          }}
          onBlur={() => handleSaveCommentary()}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        {topic.status === 'pending' && (
          <>
            <Button
              size="default"
              variant={characterCount >= 100 ? "default" : "outline"}
              onClick={handleApprove}
              disabled={characterCount < 100}
              className={cn(
                "flex-1 font-medium",
                characterCount >= 100
                  ? "bg-green-600 hover:bg-green-700 text-white border-0"
                  : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
              )}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              {characterCount >= 100 ? 'Approve' : `Need ${100 - characterCount} more characters`}
            </Button>
            {onArchive && (
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
          </>
        )}
        {topic.status === 'approved' && (
          <div className="w-full py-2 px-4 bg-green-100 text-green-700 font-medium text-center rounded-lg flex items-center justify-center">
            <CheckCircle className="h-4 w-4 mr-2" />
            Approved
          </div>
        )}
      </div>
    </Card>
  );
}