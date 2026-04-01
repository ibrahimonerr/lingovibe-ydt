"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import YDTLogo from '@/components/YDTLogo';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';
import {
    Compass, Sparkles, Layout, History, Zap, Languages, Trophy, BookOpen,
    PenTool, PieChart, X, Target, Eye, Repeat, ChevronRight, ChevronLeft,
    Split, Search, Copy, Flame, Map as MapIcon
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { useRef } from 'react';

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

    const [isVisible, setIsVisible] = useState(true);
    const lastScrollY = useRef(0);
    const mainRef = useRef<HTMLElement>(null);
    const { scrollY } = useScroll({ container: mainRef });

    useMotionValueEvent(scrollY, "change", (latest) => {
        // Threshold for scroll detection to avoid jitter
        const diff = latest - lastScrollY.current;
        if (latest < 10) {
            setIsVisible(true);
        } else if (diff > 10) {
            // Scrolling down - hide
            setIsVisible(false);
        } else if (diff < -5) {
            // Scrolling up slightly - show fast
            setIsVisible(true);
        }
        lastScrollY.current = latest;
    });

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

    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div 
            className="h-dvh w-full overflow-hidden bg-slate-50 dark:bg-black flex justify-center py-0 sm:py-8 font-sans text-slate-900 dark:text-slate-100 leading-normal transition-colors duration-300"
        >
            <Suspense fallback={null}>
                <RouteTracker />
            </Suspense>            <div className="w-full max-w-[450px] bg-white dark:bg-[#070812] h-full sm:rounded-[3rem] shadow-2xl flex flex-col relative border-x border-slate-200 dark:border-slate-800">

                {/* FLOATING HEADER ISLAND */}
                <motion.header 
                    initial={false}
                    animate={{ 
                        y: isVisible ? 0 : -20,
                        opacity: isVisible ? 1 : 0,
                        scale: isVisible ? 1 : 0.98
                    }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="z-[60] absolute top-6 inset-x-0 px-4 flex justify-center pointer-events-none"
                    style={{ marginTop: 'env(safe-area-inset-top)' }}
                >
                    <div className="bg-white/70 dark:bg-[#070812]/70 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-full px-5 py-2.5 shadow-xl flex items-center justify-center w-full max-w-[420px] pointer-events-auto">
                        <Link href="/" className="active:scale-95 transition-transform">
                            <YDTLogo size="sm" layout="horizontal" showSlogan={true} />
                        </Link>
                    </div>
                </motion.header>

                <main 
                    ref={mainRef as any}
                    className="flex-1 px-6 overflow-y-auto pb-32 custom-scrollbar scroll-smooth relative z-10 min-h-0"
                    style={{ 
                        paddingTop: 'calc(env(safe-area-inset-top, 0px) + 8rem)',
                        backgroundColor: 'transparent'
                    }}
                >
                    {children}
                </main>

                <motion.nav 
                    initial={false}
                    animate={{ 
                        y: isVisible ? 0 : 20,
                        opacity: isVisible ? 1 : 0,
                        scale: isVisible ? 1 : 0.98
                    }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="absolute bottom-0 w-full bg-white/95 dark:bg-[#070812]/95 backdrop-blur-md border-t dark:border-slate-800 p-6 flex justify-center items-center rounded-t-[3rem] shadow-[0_-15px_40px_-15px_rgba(0,0,0,0.15)] z-50"
                    style={{ paddingBottom: 'calc(env(safe-area-inset-bottom) + 1.5rem)' }}
                >
                    <button 
                        onClick={() => { setNavSubMenu('main'); setIsNavMenuOpen(true); }} 
                        className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-tr from-indigo-900 via-violet-900 to-slate-900 flex items-center justify-center text-white shadow-xl -mt-16 border-[6px] border-white dark:border-[#070812] active:scale-90 transition-all z-50 overflow-hidden relative group"
                    >
                        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600 via-fuchsia-600 to-rose-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <svg 
                            viewBox="0 0 100 100" 
                            className="w-1/2 h-1/2 text-white relative z-10 drop-shadow-md" 
                            fill="currentColor"
                        >
                            <path d="M20 20 L50 60 L80 20 L60 20 L50 35 L40 20 Z M45 65 L55 65 L55 85 L45 85 Z" />
                        </svg>
                    </button>
                </motion.nav>

                {/* Y NAVIGATION MODAL */}
                {isNavMenuOpen && (
                    <div className="fixed inset-0 z-[120] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
                        <div className="w-full max-w-[380px] bg-white/90 dark:bg-[#070812]/90 backdrop-blur-xl rounded-[2.5rem] p-6 shadow-2xl animate-in slide-in-from-bottom-10 border border-white/20 dark:border-slate-800/50">
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
                                <div className="space-y-2 max-h-[350px] overflow-y-auto custom-scrollbar animate-in slide-in-from-right-5 duration-200">
                                    <button onClick={() => navigateTo('/vocab-lab?mode=loop')} className="w-full p-3.5 text-left bg-slate-50 rounded-xl text-[10px] font-black uppercase flex justify-between items-center text-slate-600 hover:bg-indigo-50 active:scale-95 transition-all">
                                        <div className="flex items-center gap-2.5">
                                            <Repeat size={16} className="text-indigo-600" />
                                            Vocab Loop
                                        </div>
                                        <ChevronRight size={14} className="opacity-20" />
                                    </button>
                                    <button onClick={() => navigateTo('/vocab-lab?mode=meaning_shifter')} className="w-full p-3.5 text-left bg-slate-50 rounded-xl text-[10px] font-black uppercase flex justify-between items-center text-slate-600 hover:bg-indigo-50 active:scale-95 transition-all">
                                        <div className="flex items-center gap-2.5">
                                            <Split size={16} className="text-indigo-500" />
                                            Meaning Shifter
                                        </div>
                                        <ChevronRight size={14} className="opacity-20" />
                                    </button>
                                    <button onClick={() => navigateTo('/vocab-lab?mode=definition_hunt')} className="w-full p-3.5 text-left bg-slate-50 rounded-xl text-[10px] font-black uppercase flex justify-between items-center text-slate-600 hover:bg-amber-50 active:scale-95 transition-all">
                                        <div className="flex items-center gap-2.5">
                                            <Search size={16} className="text-amber-500" />
                                            Definition Hunt
                                        </div>
                                        <ChevronRight size={14} className="opacity-20" />
                                    </button>
                                    <button onClick={() => navigateTo('/vocab-lab?mode=synonym_hunt')} className="w-full p-3.5 text-left bg-slate-50 rounded-xl text-[10px] font-black uppercase flex justify-between items-center text-slate-600 hover:bg-emerald-50 active:scale-95 transition-all">
                                        <div className="flex items-center gap-2.5">
                                            <Copy size={16} className="text-emerald-500" />
                                            Synonym Hunt
                                        </div>
                                        <ChevronRight size={14} className="opacity-20" />
                                    </button>
                                    <button onClick={() => navigateTo('/vocab-lab?mode=antonym_hunt')} className="w-full p-3.5 text-left bg-slate-50 rounded-xl text-[10px] font-black uppercase flex justify-between items-center text-slate-600 hover:bg-rose-50 active:scale-95 transition-all">
                                        <div className="flex items-center gap-2.5">
                                            <Flame size={16} className="text-rose-500" />
                                            Antonym Hunt
                                        </div>
                                        <ChevronRight size={14} className="opacity-20" />
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
