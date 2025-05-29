import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';

type Content = Database['public']['Tables']['contents']['Row'];

export function useContent(contentId?: string) {
  const [content, setContent] = useState<Content | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!contentId) {
      setLoading(false);
      return;
    }

    const fetchContent = async () => {
      try {
        const { data, error } = await supabase
          .from('contents')
          .select('*')
          .eq('id', contentId)
          .single();

        if (error) throw error;
        setContent(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [contentId]);

  const updateContent = async (updates: Partial<Content>) => {
    if (!contentId) return { error: 'No content ID provided' };

    try {
      const { data, error } = await supabase
        .from('contents')
        .update(updates)
        .eq('id', contentId)
        .select()
        .single();

      if (error) throw error;
      setContent(data);
      return { data, error: null };
    } catch (err: any) {
      return { data: null, error: err.message };
    }
  };

  return { content, loading, error, updateContent };
}