'use client';

import { useState } from 'react';
import { Search, Filter, Moon, Sun, RefreshCw, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from '@/components/ui/dropdown-menu';
import { TopicCard } from '@/components/TopicCard';
import { TopicReviewModal } from '@/components/TopicReviewModal';
import { DashboardStatsComponent } from '@/components/DashboardStats';
import { DailyBriefing } from '@/components/DailyBriefing';
import { useTopics } from '@/lib/hooks/useTopics';
import { useTheme } from '@/lib/hooks/useTheme';
import type { Topic, TopicFilters, Momentum } from '@/lib/types';
import { toast, Toaster } from 'sonner';
import { cn } from '@/lib/utils';

export default function Dashboard() {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<TopicFilters>({
    status: ['pending'],
  });
  const [activeTab, setActiveTab] = useState('pending');

  const { theme, toggleTheme } = useTheme();
  const { topics, loading, error, updateTopic, refetch } = useTopics(filters);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    if (value === 'all') {
      setFilters({ ...filters, status: undefined });
    } else if (value === 'pending') {
      setFilters({ ...filters, status: ['pending'] });
    } else if (value === 'approved') {
      setFilters({ ...filters, status: ['approved'] });
    } else if (value === 'archived') {
      setFilters({ ...filters, status: ['archived'] });
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setFilters({ ...filters, searchTerm: value });
  };

  const toggleMomentumFilter = (momentum: Momentum) => {
    const currentMomentum = filters.momentum || [];
    const newMomentum = currentMomentum.includes(momentum)
      ? currentMomentum.filter(m => m !== momentum)
      : [...currentMomentum, momentum];

    setFilters({
      ...filters,
      momentum: newMomentum.length > 0 ? newMomentum : undefined,
    });
  };

  const handleReview = (topic: Topic) => {
    setSelectedTopic(topic);
    setIsReviewModalOpen(true);
  };

  const handleSave = async (topicId: string, commentary: string, hashtags: string[]) => {
    try {
      await updateTopic(topicId, {
        my_commentary: commentary,
        hashtags,
        updated_at: new Date().toISOString(),
      });
      toast.success('Draft saved');

      // Update streak if first review today
      const today = new Date().toDateString();
      const todayReviewed = localStorage.getItem(`reviewed_${today}`);
      if (!todayReviewed || todayReviewed === '0') {
        const streak = parseInt(localStorage.getItem('reviewStreak') || '0');
        localStorage.setItem('reviewStreak', (streak + 1).toString());
        localStorage.setItem('lastReviewDate', today);
      }
      const currentCount = parseInt(localStorage.getItem(`reviewed_${today}`) || '0');
      localStorage.setItem(`reviewed_${today}`, (currentCount + 1).toString());
    } catch (err) {
      toast.error('Failed to save draft');
      throw err;
    }
  };

  const handleApprove = async (topicId: string, commentary: string, hashtags: string[]) => {
    try {
      await updateTopic(topicId, {
        my_commentary: commentary,
        hashtags,
        status: 'approved',
        approved_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      toast.success('Topic approved successfully');
    } catch (err) {
      toast.error('Failed to approve topic');
      throw err;
    }
  };

  const handleArchive = async (topicId: string) => {
    try {
      await updateTopic(topicId, {
        status: 'archived',
        updated_at: new Date().toISOString(),
      });
      toast.success('Topic archived successfully');
      // Topic will be automatically removed from view via real-time subscription
    } catch (err) {
      toast.error('Failed to archive topic');
      throw err;
    }
  };

  const handleQuickApprove = async (topicId: string) => {
    try {
      await updateTopic(topicId, {
        status: 'approved',
        approved_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
      toast.success('Topic approved');
    } catch {
      toast.error('Failed to approve topic');
    }
  };

  const exportTopics = () => {
    const csvContent = [
      ['Title', 'Status', 'Momentum', 'Technical Depth', 'Viral Potential', 'Commentary', 'Hashtags', 'Created At'],
      ...topics.map(topic => [
        topic.title,
        topic.status,
        topic.momentum,
        topic.technical_depth,
        topic.viral_potential,
        topic.my_commentary || '',
        topic.hashtags.join(', '),
        topic.created_at,
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `topics-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Topics exported successfully');
  };

  const pendingTopics = topics.filter(t => t.status === 'pending');
  const approvedTopics = topics.filter(t => t.status === 'approved');

  return (
    <div className={cn('min-h-screen bg-background', theme === 'dark' && 'dark')}>
      <Toaster position="top-right" />

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center px-4">
          <div className="flex flex-1 items-center justify-between">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Daily Dashboard
            </h1>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={refetch}
                disabled={loading}
              >
                <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={exportTopics}
              >
                <Download className="h-4 w-4" />
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={toggleTheme}
              >
                {theme === 'dark' ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-6">
        {/* Daily Briefing */}
        <DailyBriefing topics={topics} userName="Renato" />

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <DashboardStatsComponent />
        </motion.div>

        {/* Search and Filters */}
        <div className="flex gap-2 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search topics..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {filters.momentum && filters.momentum.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {filters.momentum.length}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Momentum</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {(['breaking', 'peaking', 'critical', 'emerging'] as Momentum[]).map(momentum => (
                <DropdownMenuCheckboxItem
                  key={momentum}
                  checked={filters.momentum?.includes(momentum)}
                  onCheckedChange={() => toggleMomentumFilter(momentum)}
                >
                  {momentum.charAt(0).toUpperCase() + momentum.slice(1)}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Topics Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="pending">
              Pending
              {pendingTopics.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {pendingTopics.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="approved">
              Approved
              {approvedTopics.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {approvedTopics.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {loading ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-64 bg-muted rounded-lg animate-pulse" />
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12 text-muted-foreground">
                Error loading topics: {error}
              </div>
            ) : topics.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No topics found
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {topics.map(topic => (
                  <TopicCard
                    key={topic.id}
                    topic={topic}
                    onReview={handleReview}
                    onArchive={handleArchive}
                    onQuickApprove={handleQuickApprove}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Topic Review Modal */}
      <TopicReviewModal
        topic={selectedTopic}
        isOpen={isReviewModalOpen}
        onClose={() => {
          setIsReviewModalOpen(false);
          setSelectedTopic(null);
        }}
        onSave={handleSave}
        onApprove={handleApprove}
        onArchive={handleArchive}
      />
    </div>
  );
}
