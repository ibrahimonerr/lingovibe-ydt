"use client";

import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { supabase } from '@/lib/supabase';

export default function Prefetcher() {
    const { prefetchedLabs, setPrefetchedLabs } = useAppStore();
    const [hasPrefetched, setHasPrefetched] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined' || hasPrefetched) return;

        // Sadece idle zamanlarda prefetch işlemi yap, cihazın açılış süresini engellememek için.
        const prefetchData = async () => {
            try {
                console.log('[Prefetcher] Starting background data load...');

                // Sadece elimizde veri olmayan modüller için ön yükleme yap
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
                setHasPrefetched(true);
            } catch (error) {
                console.warn('[Prefetcher] Error loading background data:', error);
            }
        };

        // Idle callback ile ana thread'i boğmadan sessiz arka plan yüklemesi
        if ('requestIdleCallback' in window) {
            window.requestIdleCallback(() => prefetchData(), { timeout: 2000 });
        } else {
            setTimeout(prefetchData, 2000);
        }

    }, [hasPrefetched, prefetchedLabs, setPrefetchedLabs]);

    return null;
}
