'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  TrendingUp,
  Zap,
  Brain,
  Calendar,
  Trophy,
  Flame,
  Target,
  Coffee,
  ArrowRight,
  Clock
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Topic } from '@/lib/types';

interface DailyBriefingProps {
  topics: Topic[];
  userName?: string;
}

export function DailyBriefing({ topics, userName = 'Explorer' }: DailyBriefingProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [streak, setStreak] = useState(0);
  const [todayReviewed, setTodayReviewed] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Load streak from localStorage
  useEffect(() => {
    const savedStreak = localStorage.getItem('reviewStreak');
    const lastReviewDate = localStorage.getItem('lastReviewDate');
    const today = new Date().toDateString();

    if (lastReviewDate === today) {
      setStreak(savedStreak ? parseInt(savedStreak) : 0);
    } else if (lastReviewDate === new Date(Date.now() - 86400000).toDateString()) {
      // Yesterday - continue streak
      setStreak(savedStreak ? parseInt(savedStreak) : 0);
    } else {
      // Streak broken
      setStreak(0);
    }

    const todayReviewedCount = localStorage.getItem(`reviewed_${today}`);
    setTodayReviewed(todayReviewedCount ? parseInt(todayReviewedCount) : 0);
  }, []);

  const pendingTopics = topics.filter(t => t.status === 'pending');
  const breakingTopics = pendingTopics.filter(t => t.momentum === 'breaking');
  const highPriorityTopics = pendingTopics.filter(t =>
    (t.viral_potential && t.viral_potential >= 4) || (t.technical_depth && t.technical_depth >= 4)
  );

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return { text: 'Good morning', icon: <Coffee className="h-5 w-5" /> };
    if (hour < 18) return { text: 'Good afternoon', icon: <Sparkles className="h-5 w-5" /> };
    return { text: 'Good evening', icon: <Brain className="h-5 w-5" /> };
  };

  const greeting = getGreeting();

  const motivationalQuotes = [
    "Today's AI breakthroughs are tomorrow's reality",
    "Stay ahead of the curve with today's insights",
    "Knowledge compounds daily - let's build",
    "Your next content hit is waiting in today's topics",
    "Transform AI news into viral content",
  ];

  const todayQuote = motivationalQuotes[new Date().getDay() % motivationalQuotes.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-8"
    >
      <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-purple-900/10 via-blue-900/10 to-pink-900/10 backdrop-blur-xl">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-pink-500/10 animate-gradient-x" />

        <div className="relative p-8">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {/* Greeting */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-2 mb-3"
              >
                {greeting.icon}
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  {greeting.text}, {userName}
                </h1>
              </motion.div>

              {/* Daily Quote */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-muted-foreground mb-6 italic"
              >
                &ldquo;{todayQuote}&rdquo;
              </motion.p>

              {/* Stats Grid */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6"
              >
                {/* Pending Topics */}
                <div className="bg-white/5 rounded-lg p-4 backdrop-blur-sm border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-4 w-4 text-blue-400" />
                    <span className="text-xs text-muted-foreground">To Review</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{pendingTopics.length}</p>
                  <p className="text-xs text-green-400">
                    {breakingTopics.length > 0 && `${breakingTopics.length} breaking`}
                  </p>
                </div>

                {/* Today's Progress */}
                <div className="bg-white/5 rounded-lg p-4 backdrop-blur-sm border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-green-400" />
                    <span className="text-xs text-muted-foreground">Today</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{todayReviewed}</p>
                  <p className="text-xs text-muted-foreground">reviewed</p>
                </div>

                {/* Streak */}
                <div className="bg-white/5 rounded-lg p-4 backdrop-blur-sm border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Flame className="h-4 w-4 text-orange-400" />
                    <span className="text-xs text-muted-foreground">Streak</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{streak}</p>
                  <p className="text-xs text-muted-foreground">days</p>
                </div>

                {/* High Priority */}
                <div className="bg-white/5 rounded-lg p-4 backdrop-blur-sm border border-white/10">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-4 w-4 text-yellow-400" />
                    <span className="text-xs text-muted-foreground">High Priority</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{highPriorityTopics.length}</p>
                  <p className="text-xs text-muted-foreground">topics</p>
                </div>
              </motion.div>

              {/* Breaking News Alert */}
              {breakingTopics.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mb-4"
                >
                  <div className="flex items-center gap-2 p-3 bg-red-500/20 rounded-lg border border-red-500/30">
                    <Zap className="h-5 w-5 text-red-400 animate-pulse" />
                    <span className="text-sm font-medium text-red-300">
                      {breakingTopics.length} breaking {breakingTopics.length === 1 ? 'story' : 'stories'} need{breakingTopics.length === 1 ? 's' : ''} your attention!
                    </span>
                  </div>
                </motion.div>
              )}

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex gap-3"
              >
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                  onClick={() => {
                    const firstPending = pendingTopics[0];
                    if (firstPending) {
                      document.getElementById(`topic-${firstPending.id}`)?.scrollIntoView({
                        behavior: 'smooth'
                      });
                    }
                  }}
                >
                  Start Daily Review
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                {highPriorityTopics.length > 0 && (
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-yellow-500/50 hover:bg-yellow-500/10"
                    onClick={() => {
                      const firstHighPriority = highPriorityTopics[0];
                      if (firstHighPriority) {
                        document.getElementById(`topic-${firstHighPriority.id}`)?.scrollIntoView({
                          behavior: 'smooth'
                        });
                      }
                    }}
                  >
                    <Zap className="mr-2 h-4 w-4 text-yellow-500" />
                    Jump to High Priority
                  </Button>
                )}
              </motion.div>
            </div>

            {/* Daily Achievement Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
              className="hidden lg:block"
            >
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-600/30 to-blue-600/30 flex items-center justify-center">
                    <Trophy className="h-12 w-12 text-yellow-400" />
                  </div>
                </div>
                {streak > 0 && (
                  <Badge className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-orange-500 to-red-500">
                    {streak} Day Streak!
                  </Badge>
                )}
              </div>
            </motion.div>
          </div>

          {/* Time and Date */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-6 flex items-center gap-2 text-sm text-muted-foreground"
          >
            <Calendar className="h-4 w-4" />
            {currentTime.toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
            <span className="mx-2">•</span>
            <Clock className="h-4 w-4" />
            {currentTime.toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
}