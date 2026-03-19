"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import ReadingLab from '@/components/features/ReadingLab';
import MobileShell from '@/components/layout/MobileShell';
import { Question } from '@/types';
import { RefreshCw } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { supabase } from '@/lib/supabase';

function ReadingLabContent() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [readingPassage, setReadingPassage] = useState<string | null>(null);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [isTextExpanded, setIsTextExpanded] = useState(true);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const { incrementProgress, prefetchedLabs, isGuestMode, getDailySeed } = useAppStore();

    useEffect(() => {
        const fetchReading = async () => {
            const seed = getDailySeed();

            if (prefetchedLabs.reading && prefetchedLabs.reading.length > 0) {
                const index = isGuestMode ? (seed % prefetchedLabs.reading.length) : Math.floor(Math.random() * prefetchedLabs.reading.length);
                const selectedLab = prefetchedLabs.reading[index];
                setReadingPassage(selectedLab.passage ?? null);
                const qs = (selectedLab.questions ?? []) as unknown as Question[];
                setQuestions(isGuestMode ? qs.slice(0, 3) : qs);
                setLoading(false);
                return;
            }

            setLoading(true);
            setErrorMsg(null);
            try {
                const { data, error } = await supabase
                    .from('reading_labs')
                    .select('*')
                    .limit(50);

                if (error) {
                    throw error;
                }

                if (data && data.length > 0) {
                    const index = isGuestMode ? (seed % data.length) : Math.floor(Math.random() * data.length);
                    const selectedLab = data[index];

                    setReadingPassage(selectedLab.passage);
                    setQuestions(isGuestMode ? selectedLab.questions.slice(0, 3) : selectedLab.questions);
                } else {
                    throw new Error("No reading passages found in database. Please generate some from the Admin Panel.");
                }

            } catch (error) {
                console.error("Supabase Fetch Error:", error);
                setErrorMsg(error instanceof Error ? error.message : "Okuma parçası yüklenemedi. Veritabanı bağlantısını kontrol edin.");
            } finally {
                setLoading(false);
            }
        };

        fetchReading();
    }, [prefetchedLabs.reading, isGuestMode, getDailySeed]);

    const handleNext = () => {
        if (questions && currentIdx < questions.length - 1) {
            setCurrentIdx(prev => prev + 1);
            setSelectedOption(null);
            setShowFeedback(false);
            setShowHint(false);
        } else {
            // Finished
            if (isGuestMode) {
                const { markLabAsCompletedByGuest } = useAppStore.getState();
                markLabAsCompletedByGuest('reading');
            }
            incrementProgress('reading');
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
        <ReadingLab
            questions={questions}
            currentIdx={currentIdx}
            readingPassage={readingPassage || ''}
            isTextExpanded={isTextExpanded}
            setIsTextExpanded={setIsTextExpanded}
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

export default function ReadingLabPage() {
    return (
        <MobileShell>
            <Suspense fallback={<div className="flex justify-center py-20"><RefreshCw className="animate-spin text-indigo-600" /></div>}>
                <ReadingLabContent />
            </Suspense>
        </MobileShell>
    );
}
