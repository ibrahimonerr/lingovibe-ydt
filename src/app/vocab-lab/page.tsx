"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import VocabLab from '@/components/features/VocabLab';
import LabResults from '@/components/features/LabResults';
import WordMap from '@/components/features/WordMap';
import MobileShell from '@/components/layout/MobileShell';
import { 
    Repeat, Split, Search, Copy, Flame, ChevronRight, 
    RefreshCw, Target, Sparkles, Skull, Map as MapIcon 
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { supabase } from '@/lib/supabase';
import { Question } from '@/types';
import { YDT_VOCAB_DB } from '@/data/ydtVocab';
import LimitReachedModal from '@/components/ui/LimitReachedModal';

function VocabLabContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const vocabSubMode = searchParams.get('mode');

    const [loading, setLoading] = useState(false);
    const [questions, setQuestions] = useState<any[]>([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [isFlipped, setIsFlipped] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const { 
        incrementProgress, isGuestMode, getDailySeed, 
        resetSessionStats, learnedWordIds, toggleLearnedWord,
        canSolveMore, markAsSolved, solvedIds
    } = useAppStore();
    const [limitReached, setLimitReached] = useState(false);

    useEffect(() => {
        if (!vocabSubMode) {
            setLoading(false);
            return;
        }

        // Reset all state when mode changes
        setCurrentIdx(0);
        setSelectedOption(null);
        setShowFeedback(false);
        setIsFlipped(false);
        setIsFinished(false);

        const fetchVocab = async () => {
            if (vocabSubMode && !canSolveMore('vocab', vocabSubMode)) {
                setLimitReached(true);
                return;
            }

            resetSessionStats();
            const seed = getDailySeed();
            
            if (vocabSubMode === 'wordmap') {
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const countLimit = isGuestMode ? (vocabSubMode === 'loop' ? 10 : 5) : (vocabSubMode === 'loop' ? 10 : 20);

                const { data, error } = await supabase
                    .from('vocab_labs')
                    .select('*')
                    .eq('mode', vocabSubMode);

                if (error) throw error;

                if (data && data.length > 0) {
                    // Filter out already solved words/questions
                    const availableData = data.filter(item => !solvedIds.includes(String(item.id)));
                    
                    if (availableData.length === 0) {
                        // If everything is solved, and it's flashcards, maybe reset or show message
                        if (vocabSubMode === 'loop') {
                            setQuestions([]); // Will show "No Content"
                        } else {
                            throw new Error("Bu modüldeki tüm soruları çözdünüz!");
                        }
                    }

                    // Stable shuffle for guests using seed
                    const sortedData = [...availableData].sort((a, b) => {
                        const valA = (String(a.id).charCodeAt(0) + seed) % 1000;
                        const valB = (String(b.id).charCodeAt(0) + seed) % 1000;
                        return valA - valB;
                    });
                    
                    const selectedModeQuestions = sortedData.slice(0, countLimit).map(item => ({
                        ...item.question,
                        id: item.id
                    }));
                    setQuestions(selectedModeQuestions);
                } else if (vocabSubMode === 'loop') {
                    // Fallback to local DB for LOOP if Supabase is empty, filtering out learned words AND solved IDs
                    const localItems = YDT_VOCAB_DB
                        .filter(item => !learnedWordIds.includes(item.id) && !solvedIds.includes(item.id))
                        .sort((a,b) => (Number(a.id) + seed) % 100 - (Number(b.id) + seed) % 100)
                        .slice(0, countLimit);
                        
                    const loopQuestions = localItems.map(item => ({
                        id: item.id,
                        word: item.word,
                        question: item.word,
                        explanation: `ANLAM:${item.meaning}|SYNONYM:${item.synonyms.join(', ')}|MNEMONIC:${item.mnemonic}`
                    }));
                    setQuestions(loopQuestions);
                } else {
                    setQuestions([]);
                }
            } catch (error) {
                console.error("Supabase Fetch Error:", error);
                setQuestions([]);
            } finally {
                setLoading(false);
            }
        };

        fetchVocab();
    }, [vocabSubMode, getDailySeed, isGuestMode, solvedIds, learnedWordIds, canSolveMore]);

    if (limitReached) {
        return <LimitReachedModal type="vocab" isGuest={isGuestMode} />;
    }

    if (!vocabSubMode) {
        return (
            <div className="p-4 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="pt-8 pb-4 text-center">
                    <h1 className="text-3xl font-black text-slate-800 dark:text-white mb-2 italic tracking-tighter uppercase">Vocab Lab</h1>
                    <p className="text-slate-500 dark:text-slate-400 font-bold text-[11px] uppercase tracking-widest bg-slate-100 dark:bg-white/5 inline-block px-4 py-1.5 rounded-full border border-slate-200 dark:border-white/5">Select Your Mission</p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {[
                        { title: 'Vocab Loop', desc: 'Sonsuz Döngü: Flashcard Etüt Modu', mode: 'loop', icon: <Repeat />, color: 'from-violet-600 to-fuchsia-600', bg: 'bg-white dark:bg-[#1a1c25]', iconColor: 'text-indigo-600 dark:text-indigo-400' },
                        { title: 'Word Map', desc: 'Kelime Haritası: İlişki Avı (Daily)', mode: 'wordmap', icon: <MapIcon />, color: 'from-rose-500 to-orange-500', bg: 'bg-white dark:bg-[#1a1c25]', iconColor: 'text-rose-600 dark:text-rose-400' },
                        { title: 'Meaning Shifter', desc: 'Yol Ayrımı: Phrasal Verbs & Prepositions', mode: 'meaning_shifter', icon: <Split />, color: 'from-blue-500 to-cyan-600', bg: 'bg-white dark:bg-[#1a1c25]', iconColor: 'text-blue-600 dark:text-blue-400' },
                        { title: 'Definition Hunt', desc: 'Tanım Avı: Find the target lexical unit', mode: 'definition_hunt', icon: <Search />, color: 'from-amber-500 to-orange-600', bg: 'bg-white dark:bg-[#1a1c25]', iconColor: 'text-amber-600 dark:text-amber-400' },
                        { title: 'Synonym Hunt', desc: 'Eş Anlam Avı: Hunt for structural synonyms', mode: 'synonym_hunt', icon: <Copy />, color: 'from-emerald-500 to-teal-600', bg: 'bg-white dark:bg-[#1a1c25]', iconColor: 'text-emerald-600 dark:text-emerald-400' },
                        { title: 'Antonym Hunt', desc: 'Zıt Anlam Avı: Contrast Mastery', mode: 'antonym_hunt', icon: <Flame />, color: 'from-rose-500 to-pink-600', bg: 'bg-white dark:bg-[#1a1c25]', iconColor: 'text-rose-600 dark:text-rose-400' }
                    ].map((m) => (
                        <button
                            key={m.mode}
                            onClick={() => router.push(`/vocab-lab?mode=${m.mode}`)}
                            className={`group relative overflow-hidden p-6 rounded-[2.5rem] ${m.bg} border-2 border-slate-100 dark:border-white/5 shadow-xl hover:shadow-indigo-500/10 transition-all active:scale-[0.98] text-left`}
                        >
                            <div className={`absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r ${m.color} opacity-30`} />
                            <div className="flex items-center gap-5 relative z-10">
                                <div className={`w-14 h-14 rounded-2xl bg-slate-50 dark:bg-white/5 flex items-center justify-center ${m.iconColor} shadow-inner`}>
                                    {React.cloneElement(m.icon as React.ReactElement<{ size?: number; strokeWidth?: number }>, { size: 32, strokeWidth: 2.5 })}
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-slate-800 dark:text-white uppercase tracking-tight italic">{m.title}</h3>
                                    <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 leading-tight opacity-70">{m.desc}</p>
                                </div>
                                <ChevronRight className="ml-auto text-slate-300 dark:text-white/20" size={20} />
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    if (vocabSubMode === 'wordmap') {
        return <WordMap onComplete={() => router.push('/vocab-lab')} />;
    }

    const handleNext = () => {
        if (questions && currentIdx < questions.length - 1) {
            setCurrentIdx(prev => prev + 1);
            setSelectedOption(null);
            setShowFeedback(false);
            setIsFlipped(false);
        } else {
            setIsFinished(true);
        }
    };

    const handleSessionComplete = () => {
        if (vocabSubMode !== 'loop') {
            const solvedIdsInSession = questions.map(q => q.id).filter(id => !!id);
            markAsSolved(solvedIdsInSession, 'vocab', vocabSubMode || undefined);
        }

        if (isGuestMode) {
            const { markLabAsCompletedByGuest } = useAppStore.getState();
            markLabAsCompletedByGuest('vocab');
        }
        incrementProgress('vocab');
        router.push('/');
    };

    const handleSwipe = (learned: boolean) => {
        if (questions[currentIdx]) {
            const wordId = questions[currentIdx].id;
            if (learned) {
                toggleLearnedWord(wordId);
            }
            // Mark as solved for daily limits
            markAsSolved([String(wordId)], 'vocab', 'loop');
        }
        handleNext();
    };

    if (loading) {
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
                labTitle="Vocab Score" 
            />
        );
    }

    if (questions.length === 0) {
        return (
            <div className="p-8 text-center pt-24">
                <div className="w-20 h-20 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Skull className="text-slate-400" size={40} />
                </div>
                <h2 className="text-xl font-black text-slate-800 dark:text-white mb-2 uppercase">No Content Found</h2>
                <p className="text-slate-500 text-[13px] font-medium mb-8">This module hasn't been populated with expert questions yet.</p>
                <button onClick={() => router.push('/vocab-lab')} className="px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black uppercase text-[12px]">Back to Selection</button>
            </div>
        );
    }

    return (
        <VocabLab
            questions={questions}
            currentIdx={currentIdx}
            vocabSubMode={vocabSubMode}
            isFlipped={isFlipped}
            setIsFlipped={setIsFlipped}
            handleNext={handleNext}
            selectedOption={selectedOption}
            setSelectedOption={setSelectedOption}
            showFeedback={showFeedback}
            setShowFeedback={setShowFeedback}
            onSwipe={handleSwipe}
        />
    );
}

export default function VocabLabPage() {
    return (
        <MobileShell>
            <Suspense fallback={<div className="flex justify-center py-20"><RefreshCw className="animate-spin text-indigo-600" /></div>}>
                <VocabLabContent />
            </Suspense>
        </MobileShell>
    );
}
