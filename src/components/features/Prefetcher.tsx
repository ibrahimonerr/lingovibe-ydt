"use client";

import { useEffect, useRef } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { supabase } from '@/lib/supabase';

export default function Prefetcher() {
    const hasPrefetchedRef = useRef(false);

    useEffect(() => {
        if (typeof window === 'undefined' || hasPrefetchedRef.current) return;

        const prefetchData = async () => {
            try {
                console.log('[Prefetcher] Starting background data load...');

                // Read state directly from store to avoid dependency array issues
                const { prefetchedLabs, setPrefetchedLabs } = useAppStore.getState();

                if (prefetchedLabs.reading.length === 0) {
                    const { data } = await supabase.from('reading_labs').select('*').limit(3).order('id', { ascending: false });
                    if (data && data.length > 0) setPrefetchedLabs('reading', data);
                }

                if (prefetchedLabs.vocab.length === 0) {
                    const { data } = await supabase.from('vocab_labs').select('*').limit(5).order('id', { ascending: false });
                    if (data && data.length > 0) setPrefetchedLabs('vocab', data);
                }

                if (prefetchedLabs.grammar.length === 0) {
                    const { data } = await supabase.from('grammar_labs').select('*').limit(5).order('id', { ascending: false });
                    if (data && data.length > 0) setPrefetchedLabs('grammar', data);
                }

                if (prefetchedLabs.skills.length === 0) {
                    const { data } = await supabase.from('skills_labs').select('*').limit(3).order('id', { ascending: false });
                    if (data && data.length > 0) setPrefetchedLabs('skills', data);
                }

                console.log('[Prefetcher] Background load complete.');
                hasPrefetchedRef.current = true;
            } catch (error) {
                console.warn('[Prefetcher] Error loading background data:', error);
            }
        };

        // Idle callback to avoid blocking main thread on startup
        if ('requestIdleCallback' in window) {
            window.requestIdleCallback(() => prefetchData(), { timeout: 2000 });
        } else {
            setTimeout(prefetchData, 2000);
        }

    }, []);

    return null;
}
