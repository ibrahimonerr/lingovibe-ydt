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
    const { incrementProgress, prefetchedLabs } = useAppStore();

    useEffect(() => {
        // Reset all state when mode changes
        setCurrentIdx(0);
        setSelectedOption(null);
        setShowFeedback(false);
        setIsFlipped(false);

        const fetchVocab = async () => {
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
                    setQuestions(prefetchedItems.slice(0, 5));
                    setLoading(false);
                    return;
                }
                // If no matching items for this mode, fall through to Supabase fetch
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
                    const shuffled = data.sort(() => 0.5 - Math.random());
                    const selectedModeQuestions = shuffled.slice(0, 5).map(item => item.question);
                    setQuestions(selectedModeQuestions);
                } else {
                    generateLocalVocab();
                }
            } catch (error) {
                console.error("Supabase Fetch Error:", error);
                generateLocalVocab();
            } finally {
                setLoading(false);
            }
        };

        const generateLocalVocab = () => {
            // ... (rest of local logic remains as fallback)
            const numQuestions = 3;
            const generatedQuiz: Question[] = [];
            const getRandomElements = (arr: any[], count: number) => {
                const shuffled = [...arr].sort(() => 0.5 - Math.random());
                return shuffled.slice(0, count);
            };

            for (let i = 0; i < numQuestions; i++) {
                const randomWords = getRandomElements(YDT_VOCAB_DB, 4);
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
                    const correctLetter = 'ABCD'[Math.floor(Math.random() * 4)];
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
                    const correctLetter = 'ABCD'[Math.floor(Math.random() * 4)];
                    const contextDistractors = getRandomElements(YDT_VOCAB_DB.filter(w => w.id !== targetWord.id), 3);
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
                    const correctLetter = 'ABCD'[Math.floor(Math.random() * 4)];
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
    }, [vocabSubMode]);

    const handleNext = () => {
        if (questions && currentIdx < questions.length - 1) {
            setCurrentIdx(c => c + 1);
            setSelectedOption(null);
            setShowFeedback(false);
            setIsFlipped(false);
        } else {
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
