"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import YDTLogo from '@/components/YDTLogo';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';
import {
    Compass, Sparkles, Layout, History, Zap, Languages, Trophy, BookOpen,
    PenTool, PieChart, X, Target, Eye, Repeat, ChevronRight, ChevronLeft
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

const grammarTopics = [
    "Tenses & Aspect", "Modals & Similar Expressions", "The Passive", "If & Wish Clauses",
    "Noun Clauses & Reported Speech", "Gerunds & Infinitives", "Adjectives & Adverbs",
    "Relative Clauses", "Nouns, Pronouns & Articles", "Conjunctions & Transitions"
];
const skillTopics = [
    "Cloze Test", "Sentence Completion", "Translation (EN-TR)", "Translation (TR-EN)",
    "Dialogue Completion", "Situation", "Restatement", "Paragraph Completion", "Irrelevant"
];

function RouteTracker() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const setLastActiveRoute = useAppStore((state) => state.setLastActiveRoute);

    useEffect(() => {
        if (pathname && pathname !== '/') {
            const currentRoute = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
            setLastActiveRoute(currentRoute);
        }
    }, [pathname, searchParams, setLastActiveRoute]);

    return null;
}

export default function MobileShell({ children }: { children: React.ReactNode }) {
    const clearProgress = useAppStore((state) => state.clearProgress);
    const lastActiveRoute = useAppStore((state) => state.lastActiveRoute);

    const router = useRouter();
    const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);
    // 'main' | 'vocab' | 'grammar' | 'skills'
    const [navSubMenu, setNavSubMenu] = useState<string>('main');

    const handleClearProgress = () => {
        if (confirm("Clear Progress?")) {
            clearProgress();
        }
    };

    const closeNav = () => {
        setIsNavMenuOpen(false);
        setNavSubMenu('main');
    };

    const navigateTo = (path: string) => {
        closeNav();
        router.push(path);
    };

    return (
        <div 
            className="h-dvh w-full overflow-hidden bg-slate-50 flex justify-center py-0 sm:py-8 font-sans text-slate-900 leading-normal"
            style={{ paddingTop: 'env(safe-area-inset-top)' }}
        >
            <Suspense fallback={null}>
                <RouteTracker />
            </Suspense>            <div className="w-full max-w-[450px] bg-white h-full sm:rounded-[3rem] shadow-2xl flex flex-col relative border-x border-slate-200">

                {/* LOGO SECTION */}
                <header className="pt-8 pb-3 text-center border-b border-slate-50 bg-white shrink-0">
                    <Link href="/" className="inline-block">
                        <YDTLogo size="md" theme="dark" showSlogan={false} />
                    </Link>
                </header>

                <main className="flex-1 p-6 overflow-y-auto pb-32 custom-scrollbar">
                    {children}
                </main>

                <nav className="absolute bottom-0 w-full bg-white border-t p-6 flex justify-center items-center rounded-t-[3rem] shadow-[0_-15px_40px_-15px_rgba(0,0,0,0.15)] z-50">
                    <button onClick={() => { setNavSubMenu('main'); setIsNavMenuOpen(true); }} className="w-16 h-16 rounded-[1.5rem] bg-indigo-900 flex items-center justify-center text-white shadow-xl -mt-16 border-[6px] border-white active:scale-90 transition-all z-50">
                        <span className="text-2xl font-black italic">Y</span>
                    </button>
                </nav>

                {/* Y NAVIGATION MODAL */}
                {isNavMenuOpen && (
                    <div className="fixed inset-0 z-[120] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
                        <div className="w-full max-w-[380px] bg-white rounded-[2.5rem] p-6 shadow-2xl animate-in slide-in-from-bottom-10 border border-slate-100">
                            <div className="flex justify-between items-center mb-6 border-b pb-4">
                                {navSubMenu !== 'main' ? (
                                    <button onClick={() => setNavSubMenu('main')} className="flex items-center gap-1 text-indigo-600">
                                        <ChevronLeft size={16} />
                                        <span className="font-black uppercase text-[11px] italic">
                                            {navSubMenu === 'vocab' ? 'Vocab Lab' : navSubMenu === 'grammar' ? 'Grammar Lab' : 'Skills Lab'}
                                        </span>
                                    </button>
                                ) : (
                                    <span className="font-black uppercase text-[11px] text-indigo-600 italic">Navigation Hub</span>
                                )}
                                <button onClick={closeNav} className="p-2 bg-slate-50 text-slate-400 rounded-full hover:bg-slate-100"><X size={18} /></button>
                            </div>

                            {/* MAIN NAVIGATION GRID */}
                            {navSubMenu === 'main' && (
                                <div className="space-y-3">
                                    {lastActiveRoute && (
                                        <button
                                            onClick={() => navigateTo(lastActiveRoute)}
                                            className="w-full p-4 rounded-2xl bg-slate-900 flex flex-col items-center justify-center text-white active:scale-95 transition-all shadow-md mb-2"
                                        >
                                            <span className="font-black text-[12px] uppercase tracking-wide">Resume Session</span>
                                            <span className="text-[10px] text-slate-400 italic">Return to your last active lab</span>
                                        </button>
                                    )}

                                    <div className="grid grid-cols-2 gap-3">
                                        <button onClick={() => navigateTo('/')} className="p-4 rounded-2xl bg-slate-50 flex flex-col items-center gap-2 text-slate-700 active:scale-95 transition-all outline-none border border-slate-100">
                                            <Layout size={20} className="text-slate-500" />
                                            <span className="font-black text-[10px] uppercase">Home</span>
                                        </button>
                                        <button onClick={() => navigateTo('/reading-lab')} className="p-4 rounded-2xl bg-slate-50 flex flex-col items-center gap-2 text-slate-700 active:scale-95 transition-all outline-none border border-amber-50">
                                            <Zap size={20} className="text-amber-500" />
                                            <span className="font-black text-[10px] uppercase">Reading</span>
                                        </button>
                                        <button onClick={() => setNavSubMenu('vocab')} className="p-4 rounded-2xl bg-slate-50 flex flex-col items-center gap-2 text-slate-700 active:scale-95 transition-all outline-none border border-indigo-50">
                                            <Languages size={20} className="text-indigo-600" />
                                            <span className="font-black text-[10px] uppercase">Vocab</span>
                                        </button>
                                        <button onClick={() => setNavSubMenu('grammar')} className="p-4 rounded-2xl bg-slate-50 flex flex-col items-center gap-2 text-slate-700 active:scale-95 transition-all outline-none border border-emerald-50">
                                            <Trophy size={20} className="text-emerald-600" />
                                            <span className="font-black text-[10px] uppercase">Grammar</span>
                                        </button>
                                        <button onClick={() => setNavSubMenu('skills')} className="p-4 rounded-2xl bg-slate-50 flex flex-col items-center gap-2 text-slate-700 active:scale-95 transition-all outline-none border border-violet-50">
                                            <BookOpen size={20} className="text-violet-600" />
                                            <span className="font-black text-[10px] uppercase">Skills</span>
                                        </button>
                                        <button onClick={() => navigateTo('/progress')} className="p-4 rounded-2xl bg-slate-50 flex flex-col items-center gap-2 text-slate-700 active:scale-95 transition-all outline-none border border-slate-100">
                                            <PieChart size={20} className="text-slate-800" />
                                            <span className="font-black text-[10px] uppercase">Progress</span>
                                        </button>
                                        <button onClick={() => navigateTo('/analyzer')} className="p-4 rounded-2xl bg-slate-50 flex flex-col items-center gap-2 text-slate-700 active:scale-95 transition-all outline-none border border-rose-50 col-span-2">
                                            <PenTool size={20} className="text-rose-600" />
                                            <span className="font-black text-[10px] uppercase">AI Analyzer</span>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* VOCAB SUB-MENU */}
                            {navSubMenu === 'vocab' && (
                                <div className="space-y-2 animate-in slide-in-from-right-5 duration-200">
                                    <button onClick={() => navigateTo('/vocab-lab?mode=synonym')} className="w-full p-4 rounded-2xl bg-indigo-50 flex items-center gap-3 text-slate-700 font-black text-[11px] uppercase active:scale-95 transition-all">
                                        <Target size={18} className="text-indigo-600" /> Synonym & Antonym
                                    </button>
                                    <button onClick={() => navigateTo('/vocab-lab?mode=context')} className="w-full p-4 rounded-2xl bg-amber-50 flex items-center gap-3 text-slate-700 font-black text-[11px] uppercase active:scale-95 transition-all">
                                        <Eye size={18} className="text-amber-600" /> In-Context Lab
                                    </button>
                                    <button onClick={() => navigateTo('/vocab-lab?mode=odd')} className="w-full p-4 rounded-2xl bg-emerald-50 flex items-center gap-3 text-slate-700 font-black text-[11px] uppercase active:scale-95 transition-all">
                                        <X size={18} className="text-emerald-600" /> Odd-One Out
                                    </button>
                                    <button onClick={() => navigateTo('/vocab-lab?mode=loop')} className="w-full p-4 rounded-2xl bg-rose-50 flex items-center gap-3 text-slate-700 font-black text-[11px] uppercase active:scale-95 transition-all">
                                        <Repeat size={18} className="text-rose-600" /> Flashcard Lab
                                    </button>
                                    <button onClick={() => navigateTo('/vocab-lab?mode=wordmap')} className="w-full p-4 rounded-2xl bg-blue-50 flex items-center gap-3 text-slate-700 font-black text-[11px] uppercase active:scale-95 transition-all">
                                        <Zap size={18} className="text-blue-600" /> WordMap Game
                                    </button>
                                </div>
                            )}

                            {/* GRAMMAR SUB-MENU */}
                            {navSubMenu === 'grammar' && (
                                <div className="space-y-2 max-h-[350px] overflow-y-auto custom-scrollbar animate-in slide-in-from-right-5 duration-200">
                                    {grammarTopics.map(t => (
                                        <button key={t} onClick={() => navigateTo(`/grammar-lab?topic=${encodeURIComponent(t)}`)} className="w-full p-3.5 text-left bg-slate-50 rounded-xl text-[10px] font-black uppercase flex justify-between items-center text-slate-600 hover:bg-emerald-50 active:scale-95 transition-all">
                                            {t} <ChevronRight size={14} className="opacity-20" />
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* SKILLS SUB-MENU */}
                            {navSubMenu === 'skills' && (
                                <div className="space-y-2 max-h-[350px] overflow-y-auto custom-scrollbar animate-in slide-in-from-right-5 duration-200">
                                    {skillTopics.map(t => (
                                        <button key={t} onClick={() => navigateTo(`/skills-lab?topic=${encodeURIComponent(t)}`)} className="w-full p-3.5 text-left bg-slate-50 rounded-xl text-[10px] font-black uppercase flex justify-between items-center text-slate-600 hover:bg-violet-50 active:scale-95 transition-all">
                                            {t} <ChevronRight size={14} className="opacity-20" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }
      `}</style>
        </div>
    );
}
