"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import VocabLab from '@/components/features/VocabLab';
import WordMap from '@/components/features/WordMap';
import MobileShell from '@/components/layout/MobileShell';
import { RefreshCw } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { YDT_VOCAB_DB } from '@/data/ydtVocab';
import { supabase } from '@/lib/supabase';
import { Question } from '@/types';

function VocabLabContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const vocabSubMode = searchParams.get('mode') || 'synonym';

    const [loading, setLoading] = useState(true);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [isFlipped, setIsFlipped] = useState(false);
    const { incrementProgress, prefetchedLabs, isGuestMode, getDailySeed } = useAppStore();
    const limit = isGuestMode ? 3 : 5;

    useEffect(() => {
        // Reset all state when mode changes
        setCurrentIdx(0);
        setSelectedOption(null);
        setShowFeedback(false);
        setIsFlipped(false);

        const fetchVocab = async () => {
            const seed = getDailySeed();
            
            if (vocabSubMode === 'wordmap') {
                setLoading(false);
                return;
            }

            if (prefetchedLabs.vocab && prefetchedLabs.vocab.length > 0) {
                // Filter prefetched data by the current mode
                const matchingItems = prefetchedLabs.vocab.filter(
                    (item: any) => item.mode === vocabSubMode
                );
                if (matchingItems.length > 0) {
                    const prefetchedItems = matchingItems.map((item: any) => item.question || item);
                    if (isGuestMode) {
                        const stableIdx = seed % (matchingItems.length - limit);
                        setQuestions(prefetchedItems.slice(stableIdx, stableIdx + limit));
                    } else {
                        setQuestions(prefetchedItems.slice(0, 5));
                    }
                    setLoading(false);
                    return;
                }
            }

            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from('vocab_labs')
                    .select('*')
                    .eq('mode', vocabSubMode)
                    .limit(50);

                if (error) throw error;

                if (data && data.length > 0) {
                    // Stable shuffle for guests using seed
                    const sortedData = [...data].sort((a, b) => {
                        const valA = (a.id + seed) % 100;
                        const valB = (b.id + seed) % 100;
                        return valA - valB;
                    });
                    const selectedModeQuestions = sortedData.slice(0, limit).map(item => item.question);
                    setQuestions(selectedModeQuestions);
                } else {
                    generateLocalVocab(seed);
                }
            } catch (error) {
                console.error("Supabase Fetch Error:", error);
                generateLocalVocab(seed);
            } finally {
                setLoading(false);
            }
        };

        const generateLocalVocab = (seed: number) => {
            const numQuestions = limit;
            const generatedQuiz: Question[] = [];
            
            // Deterministic random for guests
            const getDeterministicElements = (arr: any[], count: number, offset: number) => {
                const result = [];
                const tempArr = [...arr];
                for (let i = 0; i < count; i++) {
                    const idx = (seed + offset + i) % tempArr.length;
                    result.push(tempArr[idx]);
                    tempArr.splice(idx, 1);
                }
                return result;
            };

            for (let i = 0; i < numQuestions; i++) {
                const randomWords = getDeterministicElements(YDT_VOCAB_DB, 4, i * 10);
                // ... logic for different modes using randomWords continues similarly
                const targetWord = randomWords[0];
                const otherWords = randomWords.slice(1);

                if (vocabSubMode === 'loop') {
                    generatedQuiz.push({
                        id: targetWord.id,
                        question: targetWord.word,
                        options: {},
                        correct: '',
                        explanation: `ANLAM: ${targetWord.meaning} | MNEMONIC: ${targetWord.mnemonic}`
                    });
                } else if (vocabSubMode === 'synonym') {
                    const optionsObj: Record<string, string> = {};
                    const correctLetter = 'ABCD'[Math.floor(((seed + i) % 4))]; // Deterministic correct answer
                    let wrongOptionIdx = 0;
                    for (let letter of 'ABCD') {
                        if (letter === correctLetter) {
                            optionsObj[letter] = targetWord.synonyms.length > 0 ? targetWord.synonyms[0] : targetWord.meaning;
                        } else {
                            optionsObj[letter] = otherWords[wrongOptionIdx].synonyms[0] || otherWords[wrongOptionIdx].meaning;
                            wrongOptionIdx++;
                        }
                    }
                    generatedQuiz.push({
                        id: targetWord.id,
                        question: `Find the SYNONYM for: **${targetWord.word}**`,
                        options: optionsObj,
                        correct: correctLetter,
                        explanation: `ANLAM: ${targetWord.meaning} | TACTIC: Synonyms include ${targetWord.synonyms.join(', ')}.`
                    });
                } else if (vocabSubMode === 'context') {
                    const blankedContext = targetWord.context.replace(new RegExp(targetWord.word, 'gi'), '_____');
                    const optionsObj: Record<string, string> = {};
                    const correctLetter = 'ABCD'[((seed + i + 1) % 4)];
                    const contextDistractors = getDeterministicElements(YDT_VOCAB_DB.filter(w => w.id !== targetWord.id), 3, i * 5);
                    let wrongOptionIdx = 0;
                    for (let letter of 'ABCD') {
                        if (letter === correctLetter) {
                            optionsObj[letter] = targetWord.word.toLowerCase();
                        } else {
                            optionsObj[letter] = contextDistractors[wrongOptionIdx].word.toLowerCase();
                            wrongOptionIdx++;
                        }
                    }
                    generatedQuiz.push({
                        id: targetWord.id,
                        question: blankedContext,
                        options: optionsObj,
                        correct: correctLetter,
                        explanation: `ANLAM: ${targetWord.meaning}. Metindeki anlama uyan kelime '${targetWord.word}' olmalıdır.`
                    });
                } else if (vocabSubMode === 'odd') {
                    const optionsObj: Record<string, string> = {};
                    const correctLetter = 'ABCD'[((seed + i + 2) % 4)];
                    const oddWordOptions = [targetWord.word, targetWord.synonyms[0] || targetWord.meaning, targetWord.synonyms[1] || targetWord.meaning + ' (similar)'];
                    const oddWord = targetWord.antonyms.length > 0 ? targetWord.antonyms[0] : otherWords[0].word;
                    let relatedIdx = 0;
                    for (let letter of 'ABCD') {
                        if (letter === correctLetter) {
                            optionsObj[letter] = oddWord;
                        } else {
                            optionsObj[letter] = oddWordOptions[relatedIdx];
                            relatedIdx++;
                        }
                    }
                    generatedQuiz.push({
                        id: targetWord.id,
                        question: "Find the odd-one out:",
                        options: optionsObj,
                        correct: correctLetter,
                        explanation: `ANLAM: Diğer kelimeler '${targetWord.meaning}' ile ilgiliyken doğru cevap zıt/farklı anlamlıdır.`
                    });
                }
            }
            setQuestions(generatedQuiz);
        };

        fetchVocab();
    }, [vocabSubMode, prefetchedLabs.vocab]);

    const handleNext = () => {
        if (questions && currentIdx < questions.length - 1) {
            setCurrentIdx(prev => prev + 1);
            setSelectedOption(null);
            setShowFeedback(false);
            setIsFlipped(false);
        } else {
            // Finished
            if (isGuestMode) {
                const { markLabAsCompletedByGuest } = useAppStore.getState();
                markLabAsCompletedByGuest('vocab');
            }
            incrementProgress('vocab');
            router.push('/');
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-32 animate-pulse">
                <RefreshCw className="animate-spin text-indigo-600 mb-4" size={48} />
                <p className="font-black text-indigo-600 uppercase text-[10px] tracking-widest">Lab Syncing...</p>
            </div>
        );
    }

    if (vocabSubMode === 'wordmap') {
        return <WordMap onComplete={() => router.push('/')} />;
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
