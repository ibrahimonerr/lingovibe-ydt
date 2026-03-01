"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import YDTLogo from '@/components/YDTLogo';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';
import { Compass, Sparkles, Layout, History, Zap, Languages, Trophy, BookOpen, PenTool, X } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

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

    const handleClearProgress = () => {
        if (confirm("Clear Progress?")) {
            clearProgress();
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex justify-center py-0 sm:py-8 font-sans text-slate-900 leading-normal">
            <Suspense fallback={null}>
                <RouteTracker />
            </Suspense>
            <div className="w-full max-w-[450px] bg-white min-h-screen sm:min-h-[850px] sm:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col relative border-x border-slate-200">

                {/* LOGO SECTION */}
                <header className="pt-8 pb-3 text-center border-b border-slate-50 bg-white">
                    <Link href="/" className="inline-block">
                        <YDTLogo size="md" theme="dark" showSlogan={false} />
                    </Link>
                </header>

                <main className="flex-1 p-6 overflow-y-auto pb-32 custom-scrollbar">
                    {children}
                </main>

                <nav className="fixed bottom-0 w-full max-w-[450px] bg-white border-t p-6 flex justify-center items-center rounded-t-[3rem] shadow-2xl z-50">
                    <button onClick={() => setIsNavMenuOpen(true)} className="w-16 h-16 rounded-[1.5rem] bg-indigo-900 flex items-center justify-center text-white shadow-xl -mt-16 border-[6px] border-white active:scale-90 transition-all z-50">
                        <span className="text-2xl font-black italic">Y</span>
                    </button>
                </nav>

                {/* Y NAVIGATION MODAL */}
                {isNavMenuOpen && (
                    <div className="fixed inset-0 z-[120] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
                        <div className="w-full max-w-[380px] bg-white rounded-[2.5rem] p-6 shadow-2xl animate-in slide-in-from-bottom-10 border border-slate-100">
                            <div className="flex justify-between items-center mb-6 border-b pb-4">
                                <span className="font-black uppercase text-[11px] text-indigo-600 italic">Navigation Hub</span>
                                <button onClick={() => setIsNavMenuOpen(false)} className="p-2 bg-slate-50 text-slate-400 rounded-full hover:bg-slate-100"><X size={18} /></button>
                            </div>

                            <div className="space-y-3">
                                {lastActiveRoute && (
                                    <button
                                        onClick={() => { setIsNavMenuOpen(false); router.push(lastActiveRoute); }}
                                        className="w-full p-4 rounded-2xl bg-slate-900 flex flex-col items-center justify-center text-white active:scale-95 transition-all shadow-md mb-2"
                                    >
                                        <span className="font-black text-[12px] uppercase tracking-wide">Resume Session</span>
                                        <span className="text-[10px] text-slate-400 italic">Return to your last active lab</span>
                                    </button>
                                )}

                                <div className="grid grid-cols-2 gap-3">
                                    <button onClick={() => { setIsNavMenuOpen(false); router.push('/'); }} className="p-4 rounded-2xl bg-slate-50 flex flex-col items-center gap-2 text-slate-700 active:scale-95 transition-all outline-none border border-slate-100">
                                        <Layout size={20} className="text-slate-500" />
                                        <span className="font-black text-[10px] uppercase">Home</span>
                                    </button>
                                    <button onClick={() => { setIsNavMenuOpen(false); router.push('/reading-lab'); }} className="p-4 rounded-2xl bg-slate-50 flex flex-col items-center gap-2 text-slate-700 active:scale-95 transition-all outline-none border border-amber-50">
                                        <Zap size={20} className="text-amber-500" />
                                        <span className="font-black text-[10px] uppercase">Reading</span>
                                    </button>
                                    <button onClick={() => { setIsNavMenuOpen(false); router.push('/'); }} className="p-4 rounded-2xl bg-slate-50 flex flex-col items-center gap-2 text-slate-700 active:scale-95 transition-all outline-none border border-indigo-50">
                                        <Languages size={20} className="text-indigo-600" />
                                        <span className="font-black text-[10px] uppercase">Vocab</span>
                                    </button>
                                    <button onClick={() => { setIsNavMenuOpen(false); router.push('/'); }} className="p-4 rounded-2xl bg-slate-50 flex flex-col items-center gap-2 text-slate-700 active:scale-95 transition-all outline-none border border-emerald-50">
                                        <Trophy size={20} className="text-emerald-600" />
                                        <span className="font-black text-[10px] uppercase">Grammar</span>
                                    </button>
                                    <button onClick={() => { setIsNavMenuOpen(false); router.push('/'); }} className="p-4 rounded-2xl bg-slate-50 flex flex-col items-center gap-2 text-slate-700 active:scale-95 transition-all outline-none border border-violet-50">
                                        <BookOpen size={20} className="text-violet-600" />
                                        <span className="font-black text-[10px] uppercase">Skills</span>
                                    </button>
                                    <button onClick={() => { setIsNavMenuOpen(false); router.push('/analyzer'); }} className="p-4 rounded-2xl bg-slate-50 flex flex-col items-center gap-2 text-slate-700 active:scale-95 transition-all outline-none border border-rose-50">
                                        <PenTool size={20} className="text-rose-600" />
                                        <span className="font-black text-[10px] uppercase">Analyzer</span>
                                    </button>
                                </div>
                            </div>
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
