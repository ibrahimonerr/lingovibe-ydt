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
import LimitReachedModal from '@/components/ui/LimitReachedModal';

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
    const { 
        incrementProgress, prefetchedLabs, isGuestMode, getDailySeed, 
        resetSessionStats, canSolveMore, markAsSolved, solvedIds 
    } = useAppStore();
    
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [limitReached, setLimitReached] = useState(false);

    useEffect(() => {
        const fetchQuestions = async () => {
            if (!canSolveMore('grammar', topic)) {
                setLimitReached(true);
                setLoading(false);
                return;
            }

            resetSessionStats();
            setIsFinished(false);
            const seed = getDailySeed();
            
            setLoading(true);
            setErrorMsg(null);
            try {
                // If we have prefetched labs, use them but filter out solved ones
                if ((!topic || topic === 'Mixed') && prefetchedLabs.grammar && prefetchedLabs.grammar.length > 0) {
                    const allQs = prefetchedLabs.grammar.flatMap(item => item.question || item) as unknown as Question[];
                    const availableQs = allQs.filter(q => !solvedIds.includes(String(q.id)));
                    
                    if (availableQs.length > 0) {
                        const count = isGuestMode ? 3 : 20;
                        setQuestions(availableQs.slice(0, count));
                        setLoading(false);
                        return;
                    }
                }

                let query = supabase.from('grammar_labs').select('*');

                if (topic && topic !== 'Mixed') {
                    query = query.eq('topic', topic);
                }

                // Exclude solved IDs if possible via query or filter locally
                // For simplicity and since ids are in JSONB in some old designs, we filter locally for now
                // but for the new 'one row per question' design in skills, we'll do it better.
                // Grammar labs still uses sets in some cases.
                const { data, error } = await query;

                if (error) throw error;

                if (data && data.length > 0) {
                    // Filter out rows where all questions are solved
                    const availableLabs = data.filter(lab => {
                        const qs = (Array.isArray(lab.question) ? lab.question : [lab.question]) as Question[];
                        return qs.some(q => !solvedIds.includes(String(q.id)));
                    });

                    if (availableLabs.length === 0) {
                        throw new Error("Tüm soruları çözdünüz! Yeni sorular yakında eklenecek.");
                    }

                    const index = isGuestMode ? (seed % availableLabs.length) : Math.floor(Math.random() * availableLabs.length);
                    const selectedLab = availableLabs[index];
                    const qs = (Array.isArray(selectedLab.question) ? selectedLab.question : [selectedLab.question]) as Question[];
                    
                    // Filter out already solved questions from this set
                    const filteredQs = qs.filter(q => !solvedIds.includes(String(q.id)));
                    const count = isGuestMode ? 3 : 20;
                    setQuestions(filteredQs.slice(0, count));
                } else {
                    throw new Error("Veritabanında bu konuya ait soru bulunamadı.");
                }

            } catch (error) {
                console.error("Supabase Fetch Error:", error);
                setErrorMsg(error instanceof Error ? error.message : "Sorular yüklenemedi.");
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, [topic, prefetchedLabs.grammar, isGuestMode, getDailySeed, solvedIds, canSolveMore, resetSessionStats]);

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
        // Mark these questions as solved
        const solvedIdsInSession = questions.map(q => String(q.id));
        markAsSolved(solvedIdsInSession, 'grammar', topic);

        if (isGuestMode) {
            const { markLabAsCompletedByGuest } = useAppStore.getState();
            markLabAsCompletedByGuest('grammar');
        }
        incrementProgress('grammar');
        router.push('/');
    };

    if (limitReached) {
        return <LimitReachedModal type="grammar" isGuest={isGuestMode} />;
    }

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
