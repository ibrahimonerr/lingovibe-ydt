"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import GrammarLab from '@/components/features/GrammarLab';
import MobileShell from '@/components/layout/MobileShell';
import { Question } from '@/types';
import { RefreshCw } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { supabase } from '@/lib/supabase';

function GrammarLabContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const topic = searchParams.get('topic') || '';

    const [loading, setLoading] = useState(true);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const { incrementProgress, prefetchedLabs } = useAppStore();

    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        const fetchQuestions = async () => {
            // Priority 1: Use prefetched grammar questions if no specific topic filter is enforced
            if ((!topic || topic === 'Mixed') && prefetchedLabs.grammar && prefetchedLabs.grammar.length > 0) {
                const prefetchedItems = prefetchedLabs.grammar.map(item => item.question || item);
                setQuestions(prefetchedItems.slice(0, 5));
                setLoading(false);
                return;
            }

            setLoading(true);
            setErrorMsg(null);
            try {
                let query = supabase.from('grammar_questions').select('*').limit(50);

                if (topic && topic !== 'Mixed') {
                    // Note: Ensure topic filtering matches grammar_questions schema if needed
                }

                const { data, error } = await query;

                if (error) {
                    throw error;
                }

                if (data && data.length > 0) {
                    const shuffled = data.sort(() => 0.5 - Math.random());
                    setQuestions(shuffled.slice(0, 5));
                } else {
                    throw new Error("Veritabanında bu konuya ait soru bulunamadı. Lütfen Admin panelinden üretin.");
                }

            } catch (error) {
                console.error("Supabase Fetch Error:", error);
                setErrorMsg(error instanceof Error ? error.message : "Sorular yüklenemedi. Bağlantıyı kontrol edin.");
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, [topic]);

    const handleNext = () => {
        if (questions && currentIdx < questions.length - 1) {
            setCurrentIdx(c => c + 1);
            setSelectedOption(null);
            setShowFeedback(false);
            setShowHint(false);
        } else {
            incrementProgress('grammar');
            router.push('/');
        }
    };

    if (errorMsg) {
        return (
            <div className="flex flex-col items-center justify-center py-32 text-center px-6">
                <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-4 text-2xl">⚠️</div>
                <p className="font-bold text-slate-800 mb-2">{errorMsg}</p>
                <button onClick={() => window.location.reload()} className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold mt-4 shadow-lg active:scale-95 transition-all">Tekrar Dene</button>
                <button onClick={() => router.push('/')} className="px-6 py-3 text-slate-500 font-bold mt-2 hover:text-indigo-600">Ana Sayfaya Dön</button>
            </div>
        );
    }

    if (loading || questions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-32 animate-pulse">
                <RefreshCw className="animate-spin text-indigo-600 mb-4" size={48} />
                <p className="font-black text-indigo-600 uppercase text-[10px] tracking-widest">Lab Syncing...</p>
            </div>
        );
    }

    return (
        <GrammarLab
            question={questions[currentIdx]}
            mode="grammar"
            handleNext={handleNext}
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
            showFeedback={showFeedback}
            setShowFeedback={setShowFeedback}
            showHint={showHint}
            setShowHint={setShowHint}
        />
    );
}

export default function GrammarLabPage() {
    return (
        <MobileShell>
            <Suspense fallback={<div className="flex justify-center py-20"><RefreshCw className="animate-spin text-indigo-600" /></div>}>
                <GrammarLabContent />
            </Suspense>
        </MobileShell>
    );
}
