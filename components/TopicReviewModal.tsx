'use client';

import { useState, useEffect, useCallback } from 'react';
import { formatDistanceToNow } from 'date-fns';
import {
  X,
  Save,
  CheckCircle,
  Archive,
  Copy,
  Instagram,
  Twitter,
  Youtube,
  Hash,
  TrendingUp,
  Clock,
  Star,
  AlertCircle,
  Zap,
  Sparkles
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import type { Topic } from '@/lib/types';
import { toast } from 'sonner';

interface TopicReviewModalProps {
  topic: Topic | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (topicId: string, commentary: string, hashtags: string[]) => Promise<void>;
  onApprove: (topicId: string, commentary: string, hashtags: string[]) => Promise<void>;
  onArchive: (topicId: string) => Promise<void>;
}

const momentumColors = {
  breaking: 'text-red-500',
  peaking: 'text-orange-500',
  critical: 'text-purple-500',
  emerging: 'text-blue-500',
};

const momentumIcons = {
  breaking: <Zap className="h-4 w-4" />,
  peaking: <TrendingUp className="h-4 w-4" />,
  critical: <AlertCircle className="h-4 w-4" />,
  emerging: <Clock className="h-4 w-4" />,
};

export function TopicReviewModal({
  topic,
  isOpen,
  onClose,
  onSave,
  onApprove,
  onArchive,
}: TopicReviewModalProps) {
  const [commentary, setCommentary] = useState('');
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [hashtagInput, setHashtagInput] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    if (topic) {
      setCommentary(topic.my_commentary || '');
      setHashtags(topic.hashtags || []);
    }
  }, [topic]);

  // Auto-save every 30 seconds
  useEffect(() => {
    if (!topic || !commentary || commentary === topic.my_commentary) return;

    const timer = setTimeout(async () => {
      setIsSaving(true);
      try {
        await onSave(topic.id, commentary, hashtags);
        setLastSaved(new Date());
        toast.success('Draft saved');
      } catch {
        toast.error('Failed to save draft');
      } finally {
        setIsSaving(false);
      }
    }, 30000); // 30 seconds

    return () => clearTimeout(timer);
  }, [commentary, hashtags, topic, onSave]);

  const characterCount = commentary.length;
  const canApprove = characterCount >= 100;

  const handleSaveDraft = useCallback(async () => {
    if (!topic) return;
    setIsSaving(true);
    try {
      await onSave(topic.id, commentary, hashtags);
      setLastSaved(new Date());
      toast.success('Draft saved successfully');
    } catch {
      toast.error('Failed to save draft');
    } finally {
      setIsSaving(false);
    }
  }, [topic, commentary, hashtags, onSave]);

  const handleApprove = useCallback(async () => {
    if (!topic) return;
    if (characterCount < 100) {
      toast.error('Commentary must be at least 100 characters');
      return;
    }
    setIsSaving(true);
    try {
      await onApprove(topic.id, commentary, hashtags);
      toast.success('Topic approved successfully');
      onClose();
    } catch {
      toast.error('Failed to approve topic');
    } finally {
      setIsSaving(false);
    }
  }, [topic, characterCount, commentary, hashtags, onApprove, onClose]);

  const handleArchive = async () => {
    if (!topic) return;
    try {
      await onArchive(topic.id);
      toast.success('Topic archived');
      onClose();
    } catch {
      toast.error('Failed to archive topic');
    }
  };

  const addHashtag = () => {
    if (hashtagInput && !hashtags.includes(hashtagInput)) {
      setHashtags([...hashtags, hashtagInput.replace('#', '')]);
      setHashtagInput('');
    }
  };

  const removeHashtag = (tag: string) => {
    setHashtags(hashtags.filter(t => t !== tag));
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const renderStars = (count: number, max: number = 5) => {
    return Array.from({ length: max }, (_, i) => (
      <Star
        key={i}
        className={cn(
          'h-3 w-3',
          i < count ? 'fill-yellow-500 text-yellow-500' : 'text-gray-400'
        )}
      />
    ));
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen || !topic) return;

      // Cmd/Ctrl + S to save
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        handleSaveDraft();
      }

      // Cmd/Ctrl + Enter to approve
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && canApprove) {
        e.preventDefault();
        handleApprove();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, topic, canApprove, handleSaveDraft, handleApprove]);

  if (!topic) return null;

  const getPlatformPreview = (platform: 'instagram' | 'twitter' | 'youtube') => {
    const suggestions = topic.platform_suggestions?.[platform] || [];

    switch (platform) {
      case 'instagram':
        return {
          icon: <Instagram className="h-4 w-4" />,
          title: 'Instagram Post',
          preview: `📱 ${topic.title}\n\n${commentary.slice(0, 300)}...\n\n${hashtags.map(tag => `#${tag}`).join(' ')}`,
          suggestions
        };
      case 'twitter':
        return {
          icon: <Twitter className="h-4 w-4" />,
          title: 'Twitter Thread',
          preview: `🧵 ${topic.title}\n\n${topic.content_hook}\n\n${commentary.slice(0, 240)}...`,
          suggestions
        };
      case 'youtube':
        return {
          icon: <Youtube className="h-4 w-4" />,
          title: 'YouTube Description',
          preview: `${topic.title}\n\n${commentary}\n\nTimestamps:\n00:00 Introduction\n...\n\nTags: ${hashtags.join(', ')}`,
          suggestions
        };
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] p-0 flex flex-col">
        <DialogHeader className="px-6 pt-6 pb-4 flex-shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold">
                {topic.title}
              </DialogTitle>
              <DialogDescription className="mt-2">
                Add your commentary and prepare content for multiple platforms
              </DialogDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="ml-4"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2 mt-3">
            <Badge
              variant="outline"
              className={cn('capitalize flex items-center gap-1', momentumColors[topic.momentum])}
            >
              {momentumIcons[topic.momentum]}
              {topic.momentum}
            </Badge>
            <div className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground">Technical:</span>
              {renderStars(topic.technical_depth)}
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground">Viral:</span>
              {renderStars(topic.viral_potential)}
            </div>
            <Badge variant="secondary" className="text-xs">
              <Clock className="h-3 w-3 mr-1" />
              {formatDistanceToNow(new Date(topic.perplexity_generated_at), { addSuffix: true })}
            </Badge>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6">
          <div className="space-y-6 pb-6">
            {/* Topic Details */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Topic Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Summary</Label>
                  <p className="text-sm text-muted-foreground mt-1">{topic.summary}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Relevance</Label>
                  <p className="text-sm text-muted-foreground mt-1">{topic.relevance}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Content Hook</Label>
                  <p className="text-sm text-muted-foreground mt-1">{topic.content_hook}</p>
                </div>
              </CardContent>
            </Card>

            {/* Commentary Editor */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  <span>Your Commentary</span>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={canApprove ? "default" : "secondary"}
                      className={cn(
                        "transition-colors",
                        canApprove && "bg-green-500/10 text-green-600 border-green-500/20"
                      )}
                    >
                      {characterCount} / 100 characters
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={commentary}
                  onChange={(e) => setCommentary(e.target.value)}
                  placeholder="Add your quick insights (minimum 100 characters)..."
                  className="min-h-[150px] font-mono"
                />
                {characterCount < 100 && (
                  <p className="text-sm text-amber-600 dark:text-amber-400 mt-2">
                    <AlertCircle className="h-3 w-3 inline mr-1" />
                    {100 - characterCount} more characters needed to approve
                  </p>
                )}
                {lastSaved && (
                  <p className="text-xs text-muted-foreground mt-2">
                    Last saved {formatDistanceToNow(lastSaved, { addSuffix: true })}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Hashtags */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Hashtags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-3">
                  {hashtags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => removeHashtag(tag)}
                    >
                      <Hash className="h-3 w-3 mr-1" />
                      {tag}
                      <X className="h-3 w-3 ml-1" />
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={hashtagInput}
                    onChange={(e) => setHashtagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addHashtag()}
                    placeholder="Add hashtag..."
                    className="flex-1"
                  />
                  <Button onClick={addHashtag} size="sm">
                    Add
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Platform Previews */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Platform Previews</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="instagram" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="instagram">Instagram</TabsTrigger>
                    <TabsTrigger value="twitter">Twitter</TabsTrigger>
                    <TabsTrigger value="youtube">YouTube</TabsTrigger>
                  </TabsList>
                  {(['instagram', 'twitter', 'youtube'] as const).map(platform => {
                    const preview = getPlatformPreview(platform);
                    return (
                      <TabsContent key={platform} value={platform} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {preview.icon}
                            <span className="font-medium">{preview.title}</span>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(preview.preview)}
                          >
                            <Copy className="h-3 w-3 mr-1" />
                            Copy
                          </Button>
                        </div>
                        <div className="bg-muted rounded-lg p-4">
                          <pre className="text-sm whitespace-pre-wrap font-sans">
                            {preview.preview}
                          </pre>
                        </div>
                        {preview.suggestions.length > 0 && (
                          <div>
                            <Label className="text-sm">Platform Suggestions</Label>
                            <ul className="mt-1 space-y-1">
                              {preview.suggestions.map((suggestion, index) => (
                                <li key={index} className="text-sm text-muted-foreground flex items-start">
                                  <Sparkles className="h-3 w-3 mr-1 mt-0.5 flex-shrink-0" />
                                  {suggestion}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </TabsContent>
                    );
                  })}
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>

        <Separator />

        <div className="px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <Button
              variant="destructive"
              onClick={handleArchive}
              disabled={isSaving}
            >
              <Archive className="h-4 w-4 mr-2" />
              Archive
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-xs text-muted-foreground mr-4">
              Press <kbd className="px-1 py-0.5 text-xs bg-muted rounded">⌘</kbd>+<kbd className="px-1 py-0.5 text-xs bg-muted rounded">S</kbd> to save
            </div>
            <Button
              variant="outline"
              onClick={handleSaveDraft}
              disabled={isSaving}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
            <Button
              onClick={handleApprove}
              disabled={isSaving || !canApprove}
              className={cn(
                "transition-all",
                canApprove ? "bg-green-600 hover:bg-green-700" : "opacity-50"
              )}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              {canApprove ? "Approve & Move" : `Need ${100 - characterCount} chars`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}