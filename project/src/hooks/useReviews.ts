import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';

type Review = Database['public']['Tables']['reviews']['Row'];

export function useReviews(contentId: string) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select(`
            *,
            users (
              username,
              avatar_url
            )
          `)
          .eq('content_id', contentId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setReviews(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();

    // Subscribe to new reviews
    const subscription = supabase
      .channel('reviews')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'reviews',
        filter: `content_id=eq.${contentId}`,
      }, (payload) => {
        setReviews(current => [payload.new as Review, ...current]);
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [contentId]);

  const addReview = async (reviewData: Omit<Review, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert([reviewData])
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (err: any) {
      return { data: null, error: err.message };
    }
  };

  return { reviews, loading, error, addReview };
}