"use client";
import React from 'react';
import { Trophy, CheckCircle2, XCircle, ChevronRight, Home } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

export default function LabResults({
    totalQuestions,
    onFinish,
    labTitle = "Lab Session Complete!"
}: {
    totalQuestions: number;
    onFinish: () => void;
    labTitle?: string;
}) {
    const { sessionStats } = useAppStore();
    
    // We only base percentage on actually answered questions. But totalQuestions might be greater.
    // If the user aborted early or answered exactly 'totalQuestions'.
    const answeredCount = sessionStats.correct + sessionStats.wrong;
    const accuracy = answeredCount === 0 ? 0 : Math.round((sessionStats.correct / answeredCount) * 100);

    return (
        <div className="flex flex-col items-center justify-center p-6 space-y-6 animate-in zoom-in-95 duration-500 py-16">
            
            <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center shadow-inner relative">
                <div className="absolute inset-0 rounded-full border-4 border-emerald-500 animate-pulse opacity-50 dark:opacity-30"></div>
                <Trophy size={40} />
            </div>

            <div className="text-center space-y-2">
                <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">{labTitle}</h2>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    Oturumu tamamladın. İşte bugünkü performansın:
                </p>
            </div>

            <div className="w-full bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl border-2 border-slate-100 dark:border-slate-800 p-8 space-y-6 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-slate-50 dark:bg-slate-800 rounded-full blur-3xl opacity-50" />
                
                {/* Accuracy Circle */}
                <div className="flex justify-center">
                    <div className="relative w-32 h-32 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="64" cy="64" r="56" className="stroke-slate-100 dark:stroke-slate-800" strokeWidth="12" fill="none" />
                            <circle 
                                cx="64" cy="64" r="56" 
                                className="stroke-emerald-500 transition-all duration-1000 ease-out" 
                                strokeWidth="12" 
                                strokeDasharray={351.85} 
                                strokeDashoffset={351.85 - (351.85 * accuracy) / 100} 
                                strokeLinecap="round" 
                                fill="none" 
                            />
                        </svg>
                        <div className="absolute flex flex-col items-center">
                            <span className="text-3xl font-black text-slate-800 dark:text-white tracking-tighter">{accuracy}%</span>
                            <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Accuracy</span>
                        </div>
                    </div>
                </div>

                {/* Score Breakdown */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl p-4 flex flex-col items-center border border-emerald-100 dark:border-emerald-800">
                        <CheckCircle2 className="text-emerald-500 dark:text-emerald-400 mb-2" size={24} />
                        <span className="text-2xl font-black text-emerald-700 dark:text-emerald-300">{sessionStats.correct}</span>
                        <span className="text-[10px] font-bold text-emerald-600/70 dark:text-emerald-500/70 uppercase">Doğru</span>
                    </div>
                    <div className="bg-rose-50 dark:bg-rose-900/20 rounded-2xl p-4 flex flex-col items-center border border-rose-100 dark:border-rose-800">
                        <XCircle className="text-rose-500 dark:text-rose-400 mb-2" size={24} />
                        <span className="text-2xl font-black text-rose-700 dark:text-rose-300">{sessionStats.wrong}</span>
                        <span className="text-[10px] font-bold text-rose-600/70 dark:text-rose-500/70 uppercase">Yanlış</span>
                    </div>
                </div>
            </div>

            <button 
                onClick={onFinish}
                className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-5 rounded-[2.2rem] font-black uppercase text-[12px] shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-2 mt-4"
            >
                <Home size={18} /> Ana Sayfaya Dön <ChevronRight size={18} />
            </button>
        </div>
    );
}
