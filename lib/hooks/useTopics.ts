import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Topic, TopicFilters } from '@/lib/types';

export function useTopics(filters?: TopicFilters) {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  const fetchTopics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('topics')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters?.status && filters.status.length > 0) {
        query = query.in('status', filters.status);
      }

      if (filters?.momentum && filters.momentum.length > 0) {
        query = query.in('momentum', filters.momentum);
      }

      if (filters?.technicalDepthMin !== undefined) {
        query = query.gte('technical_depth', filters.technicalDepthMin);
      }

      if (filters?.technicalDepthMax !== undefined) {
        query = query.lte('technical_depth', filters.technicalDepthMax);
      }

      if (filters?.viralPotentialMin !== undefined) {
        query = query.gte('viral_potential', filters.viralPotentialMin);
      }

      if (filters?.viralPotentialMax !== undefined) {
        query = query.lte('viral_potential', filters.viralPotentialMax);
      }

      if (filters?.searchTerm) {
        query = query.or(`title.ilike.%${filters.searchTerm}%,summary.ilike.%${filters.searchTerm}%`);
      }

      if (filters?.dateFrom) {
        query = query.gte('created_at', filters.dateFrom);
      }

      if (filters?.dateTo) {
        query = query.lte('created_at', filters.dateTo);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      setTopics(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch topics');
    } finally {
      setLoading(false);
    }
  }, [filters, supabase]);

  // Set up real-time subscription
  useEffect(() => {
    fetchTopics();

    const channel = supabase
      .channel('topics-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'topics' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setTopics((prev) => [payload.new as Topic, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setTopics((prev) =>
              prev.map((topic) =>
                topic.id === (payload.new as Topic).id
                  ? (payload.new as Topic)
                  : topic
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setTopics((prev) =>
              prev.filter((topic) => topic.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchTopics, supabase]);

  const updateTopic = async (id: string, updates: Partial<Topic>) => {
    // Create a clean update object without id and created_at
    const cleanUpdates: Record<string, unknown> = {};

    Object.keys(updates).forEach(key => {
      if (key !== 'id' && key !== 'created_at') {
        cleanUpdates[key] = (updates as Record<string, unknown>)[key];
      }
    });

    const { error } = await supabase
      .from('topics')
      .update(cleanUpdates)
      .eq('id', id)
      .select();

    if (error) throw error;
  };

  const deleteTopic = async (id: string) => {
    const { error } = await supabase
      .from('topics')
      .delete()
      .eq('id', id);

    if (error) throw error;
  };

  return {
    topics,
    loading,
    error,
    updateTopic,
    deleteTopic,
    refetch: fetchTopics,
  };
}