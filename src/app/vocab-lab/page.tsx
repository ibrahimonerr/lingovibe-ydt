"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import VocabLab from '@/components/features/VocabLab';
import WordMap from '@/components/features/WordMap';
import MobileShell from '@/components/layout/MobileShell';
import { RefreshCw } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { YDT_VOCAB_DB } from '@/data/ydtVocab';

function VocabLabContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const vocabSubMode = searchParams.get('mode') || 'synonym';

    const [loading, setLoading] = useState(true);
    const [questions, setQuestions] = useState<any[]>([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [showFeedback, setShowFeedback] = useState(false);
    const [isFlipped, setIsFlipped] = useState(false);
    const incrementProgress = useAppStore(state => state.incrementProgress);

    useEffect(() => {
        const generateLocalVocab = () => {
            if (vocabSubMode === 'wordmap') {
                setLoading(false);
                return;
            }
            setLoading(true);
            try {
                // Determine how many questions to generate (e.g., 3)
                const numQuestions = 3;
                const generatedQuiz = [];

                // Helper to get random elements from an array
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
                            question: targetWord.word,
                            explanation: `ANLAM: ${targetWord.meaning} | MNEMONIC: ${targetWord.mnemonic}`
                        });
                    } else if (vocabSubMode === 'synonym') {
                        // Generate a synonym question
                        const optionsObj: any = {};
                        const correctLetter = 'ABCD'[Math.floor(Math.random() * 4)];

                        let wrongOptionIdx = 0;
                        for (let letter of 'ABCD') {
                            if (letter === correctLetter) {
                                // Assign a legitimate synonym as correct
                                optionsObj[letter] = targetWord.synonyms.length > 0
                                    ? targetWord.synonyms[0]
                                    : targetWord.meaning;
                            } else {
                                // Assign wrong meanings/synonyms
                                optionsObj[letter] = otherWords[wrongOptionIdx].synonyms[0] || otherWords[wrongOptionIdx].meaning;
                                wrongOptionIdx++;
                            }
                        }

                        generatedQuiz.push({
                            question: `Find the SYNONYM for: **${targetWord.word}**`,
                            options: optionsObj,
                            correct: correctLetter,
                            explanation: `ANLAM: ${targetWord.meaning} | TACTIC: Synonyms include ${targetWord.synonyms.join(', ')}.`
                        });
                    } else if (vocabSubMode === 'context') {
                        // Context question
                        const blankedContext = targetWord.context.replace(new RegExp(targetWord.word, 'gi'), '_____');
                        const optionsObj: any = {};
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
                            question: blankedContext,
                            options: optionsObj,
                            correct: correctLetter,
                            explanation: `ANLAM: ${targetWord.meaning}. Metindeki anlama uyan kelime '${targetWord.word}' olmalıdır.`
                        });
                    } else if (vocabSubMode === 'odd') {
                        // Odd one out question (3 related, 1 unrelated)
                        const optionsObj: any = {};
                        const correctLetter = 'ABCD'[Math.floor(Math.random() * 4)]; // This will be the odd one

                        // We need 3 related words. We can use the word, and 2 of its synonyms.
                        // For simplicity let's use the word itself, its synonym, and another synonym as 3 related ones, and 1 antonym or random as odd
                        const oddWordOptions = [
                            targetWord.word,
                            targetWord.synonyms[0] || targetWord.meaning,
                            targetWord.synonyms[1] || targetWord.meaning + ' (similar)'
                        ];

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
                            question: "Find the odd-one out:",
                            options: optionsObj,
                            correct: correctLetter,
                            explanation: `ANLAM: Diğer kelimeler '${targetWord.meaning}' ile ilgiliyken doğru cevap zıt/farklı anlamlıdır.`
                        });
                    }
                }

                setQuestions(generatedQuiz);
            } catch (error) {
                console.error("Local Generation Error:", error);
                alert("Sorular oluşturulamadı. Lütfen tekrar deneyin.");
            } finally {
                setLoading(false);
            }
        };

        generateLocalVocab();
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
