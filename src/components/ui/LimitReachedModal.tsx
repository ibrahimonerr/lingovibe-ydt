import React from 'react';
import { useRouter } from 'next/navigation';
import { Target, Sparkles, LogIn, ArrowRight } from 'lucide-react';

interface LimitReachedModalProps {
    type: 'reading' | 'vocab' | 'grammar' | 'skills';
    isGuest: boolean;
}

const LimitReachedModal: React.FC<LimitReachedModalProps> = ({ type, isGuest }) => {
    const router = useRouter();

    const config = {
        reading: { title: 'Reading Lab', icon: <Sparkles />, color: 'from-blue-600 to-cyan-600' },
        vocab: { title: 'Vocab Lab', icon: <Target />, color: 'from-violet-600 to-fuchsia-600' },
        grammar: { title: 'Grammar Lab', icon: <Sparkles />, color: 'from-emerald-600 to-teal-600' },
        skills: { title: 'Skills Lab', icon: <Target />, color: 'from-rose-600 to-orange-600' }
    }[type];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-xl animate-in fade-in duration-300">
            <div className="w-full max-w-sm bg-white dark:bg-[#1a1c2e] rounded-[3rem] p-8 shadow-2xl border border-white/20 relative overflow-hidden animate-in zoom-in-95 duration-500">
                <div className={`absolute top-0 left-0 w-full h-2 bg-gradient-to-r ${config.color}`} />
                
                <div className={`w-20 h-20 rounded-[2rem] bg-gradient-to-br ${config.color} flex items-center justify-center mx-auto mb-8 shadow-xl shadow-indigo-500/20 rotate-12`}>
                    {React.cloneElement(config.icon as React.ReactElement<{ size: number; className: string }>, { size: 40, className: 'text-white' })}
                </div>

                <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4 italic tracking-tighter uppercase text-center">
                    Daily Limit Reached!
                </h2>

                <div className="bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 rounded-2xl p-6 mb-8 text-center">
                    <p className="text-slate-600 dark:text-slate-400 font-bold text-[13px] leading-relaxed">
                        {isGuest 
                            ? "Bugünlük limitine ulaştın! Daha fazla soru çözmek ve ilerlemeni kaydetmek için ücretsiz üye olmaya ne dersin?"
                            : "Harika iş! Bugünlük bu konu için hedefine ulaştın. Yarın yeni sorularla devam edebilirsin!"
                        }
                    </p>
                </div>

                <div className="space-y-3">
                    {isGuest ? (
                        <button 
                            onClick={() => router.push('/auth/login')}
                            className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black uppercase text-[12px] tracking-widest shadow-xl shadow-indigo-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                        >
                            <LogIn size={18} />
                            Sign Up / Login
                        </button>
                    ) : (
                        <button 
                            onClick={() => router.push('/')}
                            className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[2rem] font-black uppercase text-[12px] tracking-widest shadow-xl active:scale-[0.98] transition-all"
                        >
                            Back to Dashboard
                        </button>
                    )}

                    <button 
                        onClick={() => router.push('/')}
                        className="w-full py-4 text-slate-400 dark:text-slate-500 font-bold text-[11px] uppercase tracking-widest hover:text-indigo-600 transition-colors"
                    >
                        Maybe Later
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LimitReachedModal;
