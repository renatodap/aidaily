'use client';

import { useState } from 'react';
import { Search, RefreshCw, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TopicCard } from '@/components/TopicCard';
import { TopicReviewModal } from '@/components/TopicReviewModal';
import { useTopics } from '@/lib/hooks/useTopics';
import type { Topic, TopicFilters } from '@/lib/types';
import { toast, Toaster } from 'sonner';

export default function Dashboard() {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<TopicFilters>({
    status: ['pending'],
  });
  const [activeTab, setActiveTab] = useState('pending');

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
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">
              AI Daily
            </h1>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={refetch}
                disabled={loading}
                className="border-gray-200 hover:bg-gray-50"
              >
                <RefreshCw className={loading ? 'h-4 w-4 animate-spin' : 'h-4 w-4'} />
                <span className="ml-2">Refresh</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={exportTopics}
                className="border-gray-200 hover:bg-gray-50"
              >
                <Download className="h-4 w-4" />
                <span className="ml-2">Export</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Bar */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex gap-8">
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">Pending</span>
              <span className="text-2xl font-semibold text-gray-900">{pendingTopics.length}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">Approved</span>
              <span className="text-2xl font-semibold text-green-600">{approvedTopics.length}</span>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search topics..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-12 h-12 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Topics Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1 rounded-lg">
            <TabsTrigger value="pending" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md">Pending</TabsTrigger>
            <TabsTrigger value="approved" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md">Approved</TabsTrigger>
            <TabsTrigger value="archived" className="data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md">Archived</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-16">
                <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <p className="text-gray-500">Error loading topics: {error}</p>
              </div>
            ) : topics.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-500">No topics found</p>
              </div>
            ) : (
              <div className="space-y-4">
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
