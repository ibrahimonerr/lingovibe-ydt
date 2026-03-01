"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import AiAnalyzer from '@/components/features/AiAnalyzer';
import MobileShell from '@/components/layout/MobileShell';
import { useAppStore } from '@/store/useAppStore';
import { aiService } from '@/services/aiService';

export default function AnalyzerPage() {
    const router = useRouter();
    const [inputText, setInputText] = useState('');
    const [analyzing, setAnalyzing] = useState(false);
    const [questions, setQuestions] = useState<any[]>([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [showFeedback, setShowFeedback] = useState(false);

    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const handleAnalyze = async () => {
        if (!inputText.trim()) return;
        setAnalyzing(true);
        setErrorMsg(null);
        try {
            const data = await aiService.analyzeText(inputText);
            if (data && data.questions && Array.isArray(data.questions)) {
                setQuestions(data.questions);
            } else {
                throw new Error("Invalid structure returned from analyzer");
            }
        } catch (error) {
            console.error("Analyzer Error:", error);
            setErrorMsg("Metin analizi başarısız oldu veya yapay zeka yapısal bir hata yaptı. Lütfen tekrar deneyin.");
        } finally {
            setAnalyzing(false);
        }
    };

    const handleNext = () => {
        if (questions && currentIdx < questions.length - 1) {
            setCurrentIdx(c => c + 1);
            setSelectedOption(null);
            setShowFeedback(false);
        } else {
            router.push('/');
        }
    };

    return (
        <MobileShell>
            {questions.length === 0 ? (
                <div className="space-y-4 animate-in fade-in">
                    <div className="p-6 bg-rose-50 rounded-[2rem] border border-rose-100">
                        <h2 className="text-rose-600 font-black text-lg mb-2">AI Text Analyzer</h2>
                        <p className="text-xs text-rose-500 font-medium">Paste any English text, and the AI will analyze it to generate vocabulary lists and questions for you.</p>
                    </div>

                    <textarea
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        className="w-full h-48 p-4 bg-white rounded-2xl text-[13px] font-medium outline-none border border-slate-200 focus:border-rose-400 focus:ring-4 focus:ring-rose-50 transition-all shadow-sm resize-none custom-scrollbar"
                        placeholder="Paste your YDT passage or text here to begin analysis..."
                    />

                    <button
                        onClick={handleAnalyze}
                        disabled={analyzing || !inputText.trim()}
                        className="w-full bg-rose-600 text-white py-4 rounded-[1.5rem] font-black uppercase text-[12px] shadow-lg active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2"
                    >
                        {analyzing ? 'Analyzing with AI...' : 'Start AI Analysis'}
                    </button>
                    {errorMsg && (
                        <div className="mt-4 p-4 bg-rose-100/50 border border-rose-200 rounded-2xl text-rose-700 text-sm font-medium text-center">
                            {errorMsg}
                        </div>
                    )}
                </div>
            ) : (
                <AiAnalyzer
                    question={questions[currentIdx]}
                    handleNext={handleNext}
                    selectedOption={selectedOption}
                    setSelectedOption={setSelectedOption}
                    showFeedback={showFeedback}
                    setShowFeedback={setShowFeedback}
                />
            )}
        </MobileShell>
    );
}
