"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, ChevronRight, Clock, ClipboardCheck, 
  CheckCircle2, X, AlertCircle, BookOpen, Target, 
  Sparkles, RefreshCw, Info, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DenemeQuestion } from '@/lib/denemeEngine';
import { useAppStore } from '@/store/useAppStore';
import ExplanationRenderer from '@/components/features/ExplanationRenderer';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

interface DenemeLabProps {
  questions: DenemeQuestion[];
  onFinish: (results: any) => void;
}

export default function DenemeLab({ questions, onFinish }: DenemeLabProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({}); // { questionIdx: selectedOption }
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds
  const [isOpticOpen, setIsOpticOpen] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [isAnalysisMode, setIsAnalysisMode] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Timer logic
  useEffect(() => {
    if (isFinished) return;
    
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timerRef.current!);
          handleFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isFinished]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleFinish = () => {
    setIsFinished(true);
    if (timerRef.current) clearInterval(timerRef.current);
    
    // Calculate total correct/score
    const totalCorrect = questions.reduce((acc, q, idx) => {
      const isCorrect = answers[idx] === (q.correct_answer || q.correct);
      return acc + (isCorrect ? 1 : 0);
    }, 0);
    
    onFinish({ totalCorrect, totalQuestions: questions.length, answers });
  };

  const currentQuestion = questions[currentIdx];
  const isReading = currentQuestion?.labType === 'reading';

  if (!currentQuestion && !isFinished) return null;

  if (isFinished && !isAnalysisMode) {
    const totalCorrect = questions.reduce((acc, q, idx) => {
      const isCorrect = answers[idx] === (q.correct_answer || q.correct);
      return acc + (isCorrect ? 1 : 0);
    }, 0);

    return (
      <div className="min-h-dvh bg-[#070812] flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-indigo-600 rounded-[2rem] flex items-center justify-center text-white mb-8 shadow-2xl shadow-indigo-500/20 rotate-12 scale-110">
          <ClipboardCheck size={48} />
        </div>
        <h2 className="text-4xl font-black text-white mb-2 uppercase italic tracking-tighter">Deneme Tamamlandı!</h2>
        <p className="text-slate-400 font-bold mb-10 text-lg">Performansın analiz edildi.</p>
        
        <div className="grid grid-cols-2 gap-4 w-full max-w-sm mb-12">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
            <span className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Doğru</span>
            <span className="text-3xl font-black text-emerald-400">{totalCorrect}</span>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
            <span className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Yanlış</span>
            <span className="text-3xl font-black text-rose-400">{questions.length - totalCorrect}</span>
          </div>
        </div>

        <div className="space-y-4 w-full max-w-sm">
          <button 
            onClick={() => setIsAnalysisMode(true)}
            className="w-full py-5 bg-white text-slate-900 rounded-[2rem] font-black uppercase text-[12px] tracking-widest shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles size={18} /> Analiz Et (Çözümleri Gör)
          </button>
          <button 
            onClick={() => window.location.href = '/'}
            className="w-full py-5 bg-slate-900 border border-white/10 text-white rounded-[2rem] font-black uppercase text-[12px] tracking-widest active:scale-95 transition-all"
          >
            Dashboard'a Dön
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-slate-50 dark:bg-[#070812] flex flex-col font-sans selection:bg-indigo-500/30">
      {/* HEADER - Focus Mode */}
      <header className="fixed top-0 inset-x-0 bg-white/80 dark:bg-[#070812]/80 backdrop-blur-xl border-b dark:border-slate-800/50 px-6 py-4 flex items-center justify-between z-[100]">
        <button 
          onClick={() => setShowExitConfirm(true)}
          className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
        >
          <X size={24} />
        </button>
        
        <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 mb-0.5">
                <span className="px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase">
                    {currentQuestion?.labType} Lab
                </span>
                <span className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase">
                    Soru {currentIdx + 1} / {questions.length}
                </span>
            </div>
            {currentQuestion?.topic && (
                <span className="text-[9px] font-bold text-slate-400 dark:text-slate-600 uppercase tracking-widest">
                    {currentQuestion.topic}
                </span>
            )}
        </div>

        <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl border ${timeLeft < 300 ? 'bg-rose-50 border-rose-100 text-rose-600 dark:bg-rose-900/20 dark:border-rose-800' : 'bg-slate-50 border-slate-100 text-slate-600 dark:bg-white/5 dark:border-white/10 dark:text-slate-400'} transition-colors`}>
          <Clock size={16} className={timeLeft < 300 ? 'animate-pulse' : ''} />
          <span className="font-black text-[13px] tabular-nums">{formatTime(timeLeft)}</span>
        </div>
      </header>

      {/* PROGRESS BAR */}
      <div className="fixed top-[72px] inset-x-0 h-1 bg-slate-100 dark:bg-white/5 z-[100]">
        <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
            className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]" 
        />
      </div>

      {/* MAIN CONTENT */}
      <main className="flex-1 pt-28 pb-32 px-6 overflow-y-auto custom-scrollbar">
        <div className="max-w-2xl mx-auto space-y-6">
          
          {/* ANALYSIS / FEEDBACK (ONLY IN ANALYSIS MODE) */}
          {isAnalysisMode && (
            <div className={`p-1 rounded-[2.5rem] ${answers[currentIdx] === (currentQuestion.correct_answer || currentQuestion.correct) ? 'bg-emerald-500' : 'bg-rose-500'} mb-6`}>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.4rem]">
                    <ExplanationRenderer 
                        explanation={currentQuestion.explanation || ''} 
                        feedback={currentQuestion.feedback}
                        hint={currentQuestion.hint || (currentQuestion.feedback as any)?.hint}
                        correctAnswer={currentQuestion.correct_answer || currentQuestion.correct}
                        correctAnswerText={currentQuestion.options?.[currentQuestion.correct_answer || currentQuestion.correct]}
                        isCorrect={answers[currentIdx] === (currentQuestion.correct_answer || currentQuestion.correct)}
                        theme={currentQuestion.labType === 'grammar' ? 'emerald' : currentQuestion.labType === 'reading' ? 'amber' : 'violet'}
                    />
                </div>
            </div>
          )}

          {/* READING PASSAGE */}
          {isReading && currentQuestion.passage && (
            <div className="bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800/50 rounded-[2.5rem] p-6 shadow-sm mb-6">
              <div className="flex items-center gap-2 mb-4 text-amber-600 dark:text-amber-400">
                <BookOpen size={18} />
                <span className="text-[10px] font-black uppercase tracking-widest">Reading Passage</span>
              </div>
              <p className="text-slate-700 dark:text-slate-300 font-medium leading-relaxed italic text-[15px] whitespace-pre-wrap">
                {currentQuestion.passage}
              </p>
            </div>
          )}

          {/* QUESTION TEXT */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border-2 border-slate-50 dark:border-slate-800/50 shadow-sm">
            <div className={`text-[10px] font-black uppercase mb-2 tracking-widest ${isReading ? 'text-amber-600 dark:text-amber-400' : 'text-indigo-600 dark:text-indigo-400'}`}>
               {isReading ? 'Question Details' : 'Question Context'}
            </div>
            <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 leading-snug">
               {currentQuestion.question}
            </h3>
          </div>

          {/* OPTIONS */}
          <div className="grid gap-3">
            {Object.entries(currentQuestion.options).map(([key, value]) => {
              const isSelected = answers[currentIdx] === key;
              const isCorrect = key === (currentQuestion.correct_answer || currentQuestion.correct);
              
              let style = "border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300";
              
              if (isAnalysisMode) {
                if (isCorrect) style = "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400";
                else if (isSelected) style = "border-rose-500 bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400";
              } else if (isSelected) {
                style = "border-indigo-500 bg-indigo-500 text-white shadow-lg shadow-indigo-500/20";
              }

              return (
                <button
                  key={key}
                  disabled={isAnalysisMode}
                  onClick={async () => {
                    setAnswers(prev => ({ ...prev, [currentIdx]: key }));
                    await Haptics.impact({ style: ImpactStyle.Light }).catch(() => {});
                  }}
                  className={`p-4 text-left rounded-2xl border-2 transition-all duration-300 flex items-center gap-4 active:scale-[0.98] ${style}`}
                >
                  <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black uppercase transition-colors
                    ${isSelected ? 'bg-white text-indigo-600' : 'bg-slate-100 dark:bg-white/5 text-slate-400'}`}>
                    {key}
                  </span>
                  <span className="font-bold text-[14px]">{value}</span>
                  {isAnalysisMode && isCorrect && <CheckCircle2 size={18} className="ml-auto text-emerald-500" />}
                </button>
              );
            })}
          </div>
        </div>
      </main>

      {/* FOOTER NAV */}
      <footer className="fixed bottom-0 inset-x-0 bg-white/80 dark:bg-[#070812]/80 backdrop-blur-xl border-t dark:border-slate-800/50 p-6 flex items-center justify-between z-[100]">
        <button 
          onClick={() => currentIdx > 0 && setCurrentIdx(prev => prev - 1)}
          disabled={currentIdx === 0}
          className="flex items-center gap-2 p-4 text-slate-400 disabled:opacity-20 font-black uppercase text-[10px] tracking-widest"
        >
          <ChevronLeft size={20} /> Önceki
        </button>

        {/* OPTIC BUTTON */}
        <button 
           onClick={() => setIsOpticOpen(true)}
           className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-xl flex items-center gap-2 active:scale-95 transition-all"
        >
          <ClipboardCheck size={18} /> Optik
        </button>

        {currentIdx < questions.length - 1 ? (
          <button 
            onClick={() => setCurrentIdx(prev => prev + 1)}
            className="flex items-center gap-2 p-4 text-indigo-600 font-black uppercase text-[10px] tracking-widest"
          >
            Sonraki <ChevronRight size={20} />
          </button>
        ) : (
          <button 
            onClick={handleFinish}
            disabled={isAnalysisMode}
            className="flex items-center gap-2 p-4 text-emerald-500 font-black uppercase text-[10px] tracking-widest disabled:opacity-20"
          >
            Bitir <CheckCircle2 size={20} />
          </button>
        )}
      </footer>

      {/* OPTIC OVERLAY */}
      <AnimatePresence>
        {isOpticOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed inset-0 z-[200] bg-slate-900/60 backdrop-blur-md flex items-end justify-center p-4"
          >
            <div className="w-full max-w-md bg-white dark:bg-[#1a1c2e] rounded-[3rem] p-6 shadow-2xl relative">
                <button 
                    onClick={() => setIsOpticOpen(false)}
                    className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <X size={24} />
                </button>
                
                <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-indigo-600 mb-8 border-b pb-4">
                    Sınav Optik Formu
                </h4>

                <div className="grid grid-cols-4 gap-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar mb-8">
                  {questions.map((q, idx) => {
                    const isSelected = !!answers[idx];
                    const isCurrent = currentIdx === idx;
                    const isCorrect = answers[idx] === (q.correct_answer || q.correct);
                    
                    let style = "bg-slate-50 dark:bg-white/5 text-slate-400 border-slate-100 dark:border-white/10";
                    if (isSelected) style = "bg-slate-900 text-white border-slate-900";
                    if (isCurrent) style = "ring-2 ring-indigo-500 bg-indigo-50 text-indigo-600 border-indigo-200";
                    
                    if (isAnalysisMode) {
                        if (isCorrect) style = "bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/20";
                        else style = "bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-500/20";
                    }

                    return (
                      <button 
                        key={idx}
                        onClick={() => {
                          setCurrentIdx(idx);
                          setIsOpticOpen(false);
                        }}
                        className={`p-3 rounded-2xl border-2 flex flex-col items-center gap-1 transition-all active:scale-95 ${style}`}
                      >
                        <span className="text-[8px] font-black opacity-50 uppercase tracking-tighter">{idx + 1}</span>
                        <span className="font-black text-[13px] uppercase tracking-widest">
                          {answers[idx] || '—'}
                        </span>
                      </button>
                    )
                  })}
                </div>

                {!isAnalysisMode && (
                     <button 
                        onClick={handleFinish}
                        className="w-full py-5 bg-indigo-600 text-white rounded-[1.8rem] font-black uppercase text-[12px] tracking-widest shadow-xl shadow-indigo-500/20 flex items-center justify-center gap-3 active:scale-95 transition-all"
                    >
                        Sınavı Bitir ve Sonuçları Gör <ArrowRight size={18} />
                    </button>
                )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* EXIT CONFIRMATION */}
      <AnimatePresence>
        {showExitConfirm && (
          <div className="fixed inset-0 z-[300] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-6 text-center">
            <div className="w-full max-w-xs bg-white dark:bg-[#1a1c2e] rounded-[3rem] p-8 shadow-2xl">
              <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/40 text-rose-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <AlertCircle size={32} />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 uppercase">Sınavdan Çıkılsın mı?</h3>
              <p className="text-slate-500 text-[13px] font-bold mb-8">İlerlemeniz kaydedilmeyecek ve bugünkü deneme hakkınız yanabilir.</p>
              
              <div className="space-y-3">
                <button 
                   onClick={() => window.location.href = '/'}
                   className="w-full py-4 bg-rose-500 text-white rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-xl shadow-rose-500/20"
                >
                  Evet, Çıkış Yap
                </button>
                <button 
                  onClick={() => setShowExitConfirm(false)}
                  className="w-full py-4 text-slate-400 font-black uppercase text-[11px] tracking-widest"
                >
                  Hayır, Devam Et
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
