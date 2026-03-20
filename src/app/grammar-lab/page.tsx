"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import GrammarLab from '@/components/features/GrammarLab';
import LabResults from '@/components/features/LabResults';
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
    const [isFinished, setIsFinished] = useState(false);
    const { incrementProgress, prefetchedLabs, isGuestMode, getDailySeed, resetSessionStats } = useAppStore();
    
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const limit = isGuestMode ? 3 : 5;

    useEffect(() => {
        const fetchQuestions = async () => {
            resetSessionStats();
            setIsFinished(false);
            const seed = getDailySeed();
            
            // Priority 1: Use prefetched grammar questions if no specific topic filter is enforced
            if ((!topic || topic === 'Mixed') && prefetchedLabs.grammar && prefetchedLabs.grammar.length > 0) {
                const prefetchedItems = prefetchedLabs.grammar.map(item => item.question || item) as unknown as Question[];
                // For guests, use seed for a stable selection
                if (isGuestMode) {
                    const stableIdx = seed % (prefetchedLabs.grammar.length - limit);
                    setQuestions(prefetchedItems.slice(stableIdx, stableIdx + limit) as Question[]);
                } else {
                    setQuestions(prefetchedItems.slice(0, 5) as Question[]);
                }
                setLoading(false);
                return;
            }

            setLoading(true);
            setErrorMsg(null);
            try {
                let query = supabase.from('grammar_labs').select('*').limit(50);

                if (topic && topic !== 'Mixed') {
                    query = query.eq('topic', topic);
                }

                const { data, error } = await query;

                if (error) {
                    throw error;
                }

                if (data && data.length > 0) {
                    // Use seed for guests to always pick the same lab for the day
                    const index = isGuestMode ? (seed % data.length) : Math.floor(Math.random() * data.length);
                    const selectedLab = data[index];
                    const questionSet = isGuestMode ? selectedLab.question.slice(0, 3) : selectedLab.question;
                    setQuestions(questionSet);
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
    }, [topic, prefetchedLabs.grammar, isGuestMode, getDailySeed, limit]);

    const handleNext = () => {
        if (questions && currentIdx < questions.length - 1) {
            setCurrentIdx(prev => prev + 1);
            setSelectedOption(null);
            setShowFeedback(false);
            setShowHint(false);
        } else {
            setIsFinished(true);
        }
    };

    const handleSessionComplete = () => {
        if (isGuestMode) {
            const { markLabAsCompletedByGuest } = useAppStore.getState();
            markLabAsCompletedByGuest('grammar');
        }
        incrementProgress('grammar');
        router.push('/');
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

    if (isFinished) {
        return (
            <LabResults 
                totalQuestions={questions.length} 
                onFinish={handleSessionComplete} 
                labTitle="Grammar Score" 
            />
        );
    }

    return (
        <GrammarLab
            question={questions[currentIdx]}
            currentIdx={currentIdx}
            totalQuestions={questions.length}
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
