"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import GrammarLab from '@/components/features/GrammarLab';
import MobileShell from '@/components/layout/MobileShell';
import { RefreshCw } from 'lucide-react';
import { supabase } from '@/lib/supabase';

import ReadingLab from '@/components/features/ReadingLab';
import { useAppStore } from '@/store/useAppStore';
import { Question } from '@/types';

function SkillsLabContent() {
    const router = useRouter();
    const { prefetchedLabs } = useAppStore();
    const searchParams = useSearchParams();
    const topic = searchParams.get('topic') || '';

    const [loading, setLoading] = useState(true);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [passage, setPassage] = useState<string | null>(null);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [isTextExpanded, setIsTextExpanded] = useState(false);

    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        const fetchQuestions = async () => {
            if (!topic && prefetchedLabs.skills && prefetchedLabs.skills.length > 0) {
                const randomIndex = Math.floor(Math.random() * prefetchedLabs.skills.length);
                const selectedLab = prefetchedLabs.skills[randomIndex];

                if (selectedLab.passage) {
                    setPassage(selectedLab.passage);
                    setQuestions(selectedLab.questions as Question[]);
                } else {
                    setQuestions(selectedLab.question as Question[]);
                }
                setLoading(false);
                return;
            }

            setLoading(true);
            setErrorMsg(null);
            setPassage(null);
            try {
                let query = supabase.from('skills_labs').select('*').limit(50);

                if (topic) {
                    query = query.eq('topic', topic);
                }

                const { data, error } = await query;

                if (error) throw error;

                if (data && data.length > 0) {
                    const randomIndex = Math.floor(Math.random() * data.length);
                    const selectedLab = data[randomIndex];
                    const raw = selectedLab.question;

                    if (topic === 'Cloze Test') {
                        // seed-cloze-skills.ts saved the whole parsed object.
                        // Due to a serialization quirk it may be stored as { '0': { passage, questions } }
                        // or directly as { passage, questions }. Handle both.
                        const clozeData = raw['0'] ?? raw;
                        setPassage(clozeData.passage || null);
                        const qs = (clozeData.questions || []).map((q: any) => ({
                            ...q,
                            question: `Choose the best option for blank (${q.id}):`,
                        })) as Question[];
                        setQuestions(qs);

                    } else if (topic === 'Irrelevant') {
                        // Has: sentences[], correct_answer (Roman numeral letter like 'C'),
                        // hint, feedback. NO options field — build options from sentences.
                        const letters = ['A', 'B', 'C', 'D', 'E'];
                        const sentences: string[] = raw.sentences || [];
                        const opts: Record<string, string> = {};
                        sentences.forEach((s: string, i: number) => {
                            opts[letters[i]] = s;
                        });
                        const normalized: Question = {
                            ...raw,
                            question: 'Which sentence breaks the flow of the paragraph?',
                            options: opts,
                            correct_answer: raw.correct_answer, // e.g. 'C'
                        } as Question;
                        setQuestions([normalized]);

                    } else {
                        setQuestions(Array.isArray(raw) ? raw : [raw]);
                    }
                } else {
                    throw new Error("Veritabanında bu yeteneğe ait soru bulunamadı.");
                }

            } catch (error) {
                console.error("Supabase Fetch Error:", error);
                setErrorMsg(error instanceof Error ? error.message : "Sorular yüklenemedi.");
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, [topic, prefetchedLabs.skills]);

    const handleNext = () => {
        if (questions && currentIdx < questions.length - 1) {
            setCurrentIdx(c => c + 1);
            setSelectedOption(null);
            setShowFeedback(false);
            setShowHint(false);
        } else {
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

    if (topic === 'Cloze Test') {
        return (
            <ReadingLab
                questions={questions}
                currentIdx={currentIdx}
                readingPassage={passage || ''}
                isTextExpanded={true}
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

    const currentQuestion = questions[currentIdx];
    if (!currentQuestion) return null;

    return (
        <GrammarLab
            question={currentQuestion}
            mode="skills"
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

export default function SkillsLabPage() {
    return (
        <MobileShell>
            <Suspense fallback={<div className="flex justify-center py-20"><RefreshCw className="animate-spin text-indigo-600" /></div>}>
                <SkillsLabContent />
            </Suspense>
        </MobileShell>
    );
}
