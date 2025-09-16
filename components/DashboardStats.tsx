'use client';

import { useEffect, useState } from 'react';
import {
  TrendingUp,
  CheckCircle,
  Clock,
  Archive,
  BarChart3,
  Zap,
  Target,
  Brain
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/client';
import type { DashboardStats, Topic } from '@/lib/types';

export function DashboardStatsComponent() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const supabase = createClient();

    try {
      // Fetch all topics for stats
      const { data: topics, error } = await supabase
        .from('topics')
        .select('*')
        .returns<Topic[]>();

      if (error) throw error;

      if (topics && topics.length > 0) {
        const pendingTopics = topics.filter((t: Topic) => t.status === 'pending');
        const approvedTopics = topics.filter(t => t.status === 'approved');
        const archivedTopics = topics.filter(t => t.status === 'archived');

        // Calculate average review time for approved topics
        const reviewTimes = approvedTopics
          .filter(t => t.approved_at && t.created_at)
          .map(t => {
            const created = new Date(t.created_at).getTime();
            const approved = new Date(t.approved_at!).getTime();
            return (approved - created) / (1000 * 60 * 60); // Convert to hours
          });

        const averageReviewTime = reviewTimes.length > 0
          ? reviewTimes.reduce((a, b) => a + b, 0) / reviewTimes.length
          : 0;

        // Calculate momentum breakdown
        const momentumBreakdown = {
          breaking: topics.filter(t => t.momentum === 'breaking').length,
          peaking: topics.filter(t => t.momentum === 'peaking').length,
          critical: topics.filter(t => t.momentum === 'critical').length,
          emerging: topics.filter(t => t.momentum === 'emerging').length,
        };

        // Calculate averages
        const technicalDepthAverage = topics.length > 0
          ? topics.reduce((acc, t) => acc + t.technical_depth, 0) / topics.length
          : 0;

        const viralPotentialAverage = topics.length > 0
          ? topics.reduce((acc, t) => acc + t.viral_potential, 0) / topics.length
          : 0;

        const calculatedStats: DashboardStats = {
          totalTopics: topics.length,
          pendingTopics: pendingTopics.length,
          approvedTopics: approvedTopics.length,
          archivedTopics: archivedTopics.length,
          averageReviewTime,
          approvalRate: topics.length > 0
            ? (approvedTopics.length / (approvedTopics.length + archivedTopics.length)) * 100
            : 0,
          momentumBreakdown,
          technicalDepthAverage,
          viralPotentialAverage,
        };

        setStats(calculatedStats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <div className="h-4 bg-muted rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Topics',
      value: stats.totalTopics,
      icon: <BarChart3 className="h-4 w-4 text-muted-foreground" />,
      color: 'text-blue-600',
    },
    {
      title: 'Pending Review',
      value: stats.pendingTopics,
      icon: <Clock className="h-4 w-4 text-muted-foreground" />,
      color: 'text-yellow-600',
    },
    {
      title: 'Approved',
      value: stats.approvedTopics,
      icon: <CheckCircle className="h-4 w-4 text-muted-foreground" />,
      color: 'text-green-600',
    },
    {
      title: 'Archived',
      value: stats.archivedTopics,
      icon: <Archive className="h-4 w-4 text-muted-foreground" />,
      color: 'text-gray-600',
    },
    {
      title: 'Avg Review Time',
      value: `${stats.averageReviewTime.toFixed(1)}h`,
      icon: <Clock className="h-4 w-4 text-muted-foreground" />,
      color: 'text-purple-600',
    },
    {
      title: 'Approval Rate',
      value: `${stats.approvalRate.toFixed(1)}%`,
      icon: <Target className="h-4 w-4 text-muted-foreground" />,
      color: 'text-indigo-600',
    },
    {
      title: 'Avg Technical Depth',
      value: stats.technicalDepthAverage.toFixed(1),
      icon: <Brain className="h-4 w-4 text-muted-foreground" />,
      color: 'text-orange-600',
    },
    {
      title: 'Avg Viral Potential',
      value: stats.viralPotentialAverage.toFixed(1),
      icon: <TrendingUp className="h-4 w-4 text-muted-foreground" />,
      color: 'text-pink-600',
    },
  ];

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${stat.color}`}>
                {stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Momentum Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Momentum Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {stats.momentumBreakdown.breaking}
              </div>
              <div className="text-sm text-muted-foreground">Breaking</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {stats.momentumBreakdown.peaking}
              </div>
              <div className="text-sm text-muted-foreground">Peaking</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {stats.momentumBreakdown.critical}
              </div>
              <div className="text-sm text-muted-foreground">Critical</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {stats.momentumBreakdown.emerging}
              </div>
              <div className="text-sm text-muted-foreground">Emerging</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}