"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import DenemeLab from '@/components/features/DenemeLab';
import { DenemeQuestion, fetchMiniDenemeData } from '@/lib/denemeEngine';
import { useAppStore } from '@/store/useAppStore';
import { RefreshCw, ClipboardCheck, AlertCircle } from 'lucide-react';
import LimitReachedModal from '@/components/ui/LimitReachedModal';

function DenemeLabContent() {
    const router = useRouter();
    const { 
        canSolveMore, markAsSolved, isGuestMode, session, 
        incrementProgress 
    } = useAppStore();

    const [loading, setLoading] = useState(true);
    const [questions, setQuestions] = useState<DenemeQuestion[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [limitReached, setLimitReached] = useState(false);

    useEffect(() => {
        if (!canSolveMore('mini_deneme')) {
            setLimitReached(true);
            setLoading(false);
            return;
        }

        const loadDeneme = async () => {
            setLoading(true);
            try {
                const data = await fetchMiniDenemeData();
                if (data.length === 0) {
                    throw new Error("Soru havuzunda yeterli soru bulunamadı.");
                }
                setQuestions(data);
            } catch (err: any) {
                setError(err.message || "Deneme yüklenirken bir hata oluştu.");
            } finally {
                setLoading(false);
            }
        };

        loadDeneme();
    }, [canSolveMore, isGuestMode, session, router]);

    const handleFinish = (results: any) => {
        // Mark as solved in daily usage
        const allIds = questions.map(q => q.id);
        markAsSolved(allIds, 'mini_deneme');
        incrementProgress('mini_deneme');
    };

    if (limitReached) {
         // Reusing LimitReachedModal might need a specific 'deneme' case, 
         // but since it's already filtered in the UI, this is a safety fallback.
         return (
            <div className="min-h-dvh bg-[#070812] flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
                <div className="w-20 h-20 bg-rose-500/20 text-rose-500 rounded-3xl flex items-center justify-center mb-6 border border-rose-500/30">
                    <AlertCircle size={40} />
                </div>
                <h2 className="text-2xl font-black text-white mb-2 uppercase tracking-tighter italic">Günlük Limit Doldu!</h2>
                <p className="text-slate-400 font-bold mb-8 text-sm">Günde sadece 1 adet Mini Deneme çözebilirsin. Yarın tekrar bekliyoruz!</p>
                <button 
                   onClick={() => router.push('/')}
                   className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-xl active:scale-95 transition-all"
                >
                    Dashboard'a Dön
                </button>
            </div>
         );
    }

    if (loading) {
        return (
            <div className="min-h-dvh bg-slate-50 dark:bg-[#070812] flex flex-col items-center justify-center gap-4">
                <RefreshCw className="text-indigo-600 dark:text-indigo-400 animate-spin" size={32} />
                <span className="font-black uppercase text-[10px] tracking-widest text-slate-400">Deneme Hazırlanıyor...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-dvh bg-slate-50 dark:bg-[#070812] flex flex-col items-center justify-center p-8 text-center">
                <div className="w-16 h-16 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-500 mb-4"><AlertCircle size={32} /></div>
                <h3 className="text-xl font-black mb-2">{error}</h3>
                <button onClick={() => window.location.reload()} className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold uppercase text-xs">Tekrar Dene</button>
            </div>
        );
    }

    return (
        <DenemeLab questions={questions} onFinish={handleFinish} />
    );
}

export default function MiniDenemePage() {
    return (
        <Suspense fallback={<div>Yükleniyor...</div>}>
            <DenemeLabContent />
        </Suspense>
    );
}
