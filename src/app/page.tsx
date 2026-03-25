"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import YDTLogo from '@/components/YDTLogo';
import {
  Layout, Zap, Languages, Trophy, BookOpen,
  PenTool, Target, Eye, Repeat, X, ChevronRight,
  Settings as SettingsIcon, PieChart
} from 'lucide-react';
import SettingsMenu from '@/components/layout/SettingsMenu';
import { useAppStore } from '@/store/useAppStore';
import { supabase } from '@/lib/supabase';
import LoginPage from '@/components/auth/LoginPage';

const grammarTopics = [
  "Tenses & Aspect",
  "Modals & Similar Expressions",
  "The Passive",
  "If & Wish Clauses",
  "Noun Clauses & Reported Speech",
  "Gerunds & Infinitives",
  "Adjectives & Adverbs",
  "Relative Clauses",
  "Nouns, Pronouns & Articles",
  "Conjunctions & Transitions"
];
const skillTopics = [
  "Cloze Test",
  "Sentence Completion",
  "Translation (EN-TR)",
  "Translation (TR-EN)",
  "Dialogue Completion",
  "Situation",
  "Restatement",
  "Paragraph Completion",
  "Irrelevant"
];

export default function YDTHub() {
  const router = useRouter();
  const [view, setView] = useState('home');
  const [mode, setMode] = useState('');
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { lastActiveRoute, session, isGuestMode, setSession } = useAppStore();

  useEffect(() => {
    // Listen for auth state changes
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [setSession]);



  const handleLabSelection = (labType: string, subType?: string) => {
    switch (labType) {
      case 'reading':
        router.push('/reading-lab');
        break;
      case 'grammar':
        router.push(`/grammar-lab?topic=${encodeURIComponent(subType || '')}`);
        break;
      case 'skills':
        router.push(`/skills-lab?topic=${encodeURIComponent(subType || '')}`);
        break;
      case 'vocab':
        router.push(`/vocab-lab?mode=${subType}`);
        break;
      case 'analyzer':
        router.push('/analyzer');
        break;
      default:
        break;
    }
  };

  const navigateToHome = () => {
    setView('home');
    setMode('');
  };

  if (!session && !isGuestMode) {
    return <LoginPage />;
  }

  return (
    <div
      className="h-dvh w-full overflow-hidden bg-slate-50 dark:bg-black flex justify-center py-0 sm:py-8 font-sans text-slate-900 dark:text-slate-100 leading-normal transition-colors duration-300"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <div className="w-full max-w-[450px] bg-white dark:bg-[#070812] h-full sm:rounded-[3rem] shadow-2xl flex flex-col relative border-x border-slate-200 dark:border-slate-800 overflow-y-auto custom-scrollbar">


        {/* FLOATING HEADER ISLAND */}
        <header className="z-40 sticky top-6 left-0 w-full px-4 flex justify-center pointer-events-none">
          <div className="bg-white/70 dark:bg-[#070812]/70 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-full px-5 py-2.5 shadow-xl flex items-center justify-center w-full max-w-[420px] pointer-events-auto relative">
            <YDTLogo size="sm" layout="horizontal" showSlogan={true} />
            
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="absolute right-3 w-10 h-10 flex items-center justify-center rounded-full bg-slate-100/50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border border-slate-200/50 dark:border-slate-700/50 active:scale-90 transition-all shadow-sm"
            >
              <SettingsIcon size={18} />
            </button>
          </div>
        </header>

        <main className="flex flex-col px-5 pt-20 pb-28">
          {view === 'home' && (
            <div className="flex flex-col gap-3 animate-in fade-in duration-500">
              {/* READING LAB */}
              <button onClick={() => handleLabSelection('reading')} className="w-full p-5 rounded-[2.2rem] border-2 border-amber-100 dark:border-amber-900/30 bg-white dark:bg-[#1a1c25] flex items-center gap-4 active:scale-95 transition-all text-left shadow-sm">
                <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-2xl text-amber-500 shadow-sm"><Zap size={20} /></div>
                <div>
                  <span className="font-black uppercase text-[13px] block text-slate-800 dark:text-slate-100 leading-none mb-1">Reading Lab</span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.15em] opacity-80">Daily Reading Comprehension</span>
                </div>
              </button>

              {/* VOCAB LAB */}
              <button onClick={() => setMode('vocab_select')} className="w-full p-5 rounded-[2.2rem] border-2 border-indigo-100 dark:border-indigo-900/30 bg-white dark:bg-[#1a1c25] flex items-center gap-4 active:scale-95 transition-all text-left shadow-sm">
                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl text-indigo-600 shadow-sm"><Languages size={20} /></div>
                <div>
                  <span className="font-black uppercase text-[13px] block text-slate-800 dark:text-slate-100 leading-none mb-1">Vocab Lab</span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.15em] opacity-80">Retention & Recall</span>
                </div>
              </button>

               {/* GRAMMAR LAB */}
              <button onClick={() => setMode('grammar')} className="w-full p-5 rounded-[2.2rem] border-2 border-emerald-100 dark:border-emerald-900/30 bg-white dark:bg-[#1a1c25] flex items-center gap-4 active:scale-95 transition-all text-left shadow-sm">
                <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl text-emerald-600 shadow-sm"><PenTool size={20} /></div>
                <div>
                  <span className="font-black uppercase text-[13px] block text-slate-800 dark:text-slate-100 leading-none mb-1">Grammar Lab</span>
                  <span className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.15em] opacity-80">Structure & Sentence Rules</span>
                </div>
              </button>

              {/* SKILLS LAB */}
              <button onClick={() => setMode('skills')} className="w-full p-5 rounded-[2.2rem] border-2 border-violet-100 dark:border-violet-900/30 bg-white dark:bg-[#1a1c25] flex items-center gap-4 active:scale-95 transition-all text-left shadow-sm">
                <div className="p-3 bg-violet-50 dark:bg-violet-900/20 rounded-2xl text-violet-600 shadow-sm"><Target size={20} /></div>
                <div>
                  <span className="font-black uppercase text-[13px] block text-slate-800 dark:text-slate-100 leading-none mb-1">Skills Lab</span>
                  <span className="text-[8px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.15em] opacity-80">Cloze, Dialogue & Paragraphs</span>
                </div>
              </button>

              {/* AI ANALYZER */}
              <button onClick={() => handleLabSelection('analyzer')} className="w-full p-5 rounded-[2.2rem] border-2 border-rose-100 dark:border-rose-900/30 bg-white dark:bg-[#1a1c25] flex items-center gap-4 active:scale-95 transition-all text-left shadow-sm">
                <div className="p-3 bg-rose-50 dark:bg-rose-900/20 rounded-2xl text-rose-600 shadow-sm"><PenTool size={20} /></div>
                <div>
                  <span className="font-black uppercase text-[13px] block text-slate-800 dark:text-slate-100 leading-none mb-1">AI Analyzer</span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.15em] opacity-80">Scan & Generate</span>
                </div>
              </button>
            </div>
          )}
        </main>

        {/* MODALLAR */}
        {['grammar', 'skills', 'vocab_select'].includes(mode) && (
          <div
            className="absolute inset-0 z-[120] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) setMode('');
            }}
          >
            <div className="w-full max-w-[380px] bg-white/95 dark:bg-[#070812]/95 backdrop-blur-xl rounded-[2.5rem] p-6 shadow-2xl animate-in zoom-in-95 duration-200 border border-slate-100 dark:border-slate-800/50">
              <div className="flex justify-between items-center mb-6 border-b dark:border-slate-800/50 pb-4">
                <span className="font-black uppercase text-[11px] text-indigo-600 italic">Lab Selection</span>
                <button onClick={() => setMode('')} className="p-2 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                  <X size={18} />
                </button>
              </div>
              <div className="space-y-2 max-h-[350px] overflow-y-auto custom-scrollbar">
                {mode === 'vocab_select' ? (
                  <>
                    <button onClick={() => handleLabSelection('vocab', 'synonym')} className="w-full p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center gap-3 text-slate-700 dark:text-slate-200 font-black text-[11px] uppercase active:scale-95 transition-all"><Target size={18} className="text-indigo-600" /> Synonym & Antonym</button>
                    <button onClick={() => handleLabSelection('vocab', 'context')} className="w-full p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/20 flex items-center gap-3 text-slate-700 dark:text-slate-200 font-black text-[11px] uppercase active:scale-95 transition-all"><Eye size={18} className="text-amber-600" /> In-Context Lab</button>
                    <button onClick={() => handleLabSelection('vocab', 'odd')} className="w-full p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center gap-3 text-slate-700 dark:text-slate-200 font-black text-[11px] uppercase active:scale-95 transition-all"><X size={18} className="text-emerald-600" /> Odd-One Out</button>
                    <button onClick={() => handleLabSelection('vocab', 'loop')} className="w-full p-4 rounded-2xl bg-rose-50 dark:bg-rose-900/20 flex items-center gap-3 text-slate-700 dark:text-slate-200 font-black text-[11px] uppercase active:scale-95 transition-all"><Repeat size={18} className="text-rose-600" /> Flashcard Lab</button>
                    <button onClick={() => handleLabSelection('vocab', 'wordmap')} className="w-full p-4 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center gap-3 text-slate-700 dark:text-slate-200 font-black text-[11px] uppercase active:scale-95 transition-all"><Zap size={18} className="text-blue-600" /> WordMap Game</button>
                  </>
                ) : (
                  (mode === 'grammar' ? grammarTopics : skillTopics).map(t => (
                    <button key={t} onClick={() => handleLabSelection(mode, t)} className={`w-full p-3.5 text-left bg-slate-50 dark:bg-slate-800/50 rounded-xl text-[10px] font-black uppercase flex justify-between items-center text-slate-600 dark:text-slate-300 hover:${mode === 'grammar' ? 'bg-emerald-50 dark:bg-emerald-900/20' : 'bg-violet-50 dark:bg-violet-900/20'} active:scale-95 transition-all`}>{t} <ChevronRight size={14} className="opacity-20" /></button>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* BOTTOM NAV */}
        <nav className="absolute bottom-0 w-full bg-white dark:bg-[#070812] border-t dark:border-slate-800 p-6 flex justify-center items-center rounded-t-[3rem] shadow-[0_-15px_40px_-15px_rgba(0,0,0,0.15)] z-50">
          <button 
            onClick={() => setIsNavMenuOpen(true)} 
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
        </nav>

        {/* Y NAVIGATION MODAL */}
        {isNavMenuOpen && (
          <div className="fixed inset-0 z-[120] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
            <div className="w-full max-w-[380px] bg-white/95 dark:bg-[#070812]/95 backdrop-blur-xl rounded-[2.5rem] p-6 shadow-2xl animate-in slide-in-from-bottom-10 border border-slate-100 dark:border-slate-800/50">
              <div className="flex justify-between items-center mb-6 border-b dark:border-slate-800/50 pb-4">
                <span className="font-black uppercase text-[11px] text-indigo-600 italic">Navigation Hub</span>
                <button onClick={() => setIsNavMenuOpen(false)} className="p-2 bg-slate-50 dark:bg-slate-800 text-slate-400 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"><X size={18} /></button>
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
                  <button onClick={() => { setIsNavMenuOpen(false); router.push('/'); }} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex flex-col items-center gap-2 text-slate-700 dark:text-slate-300 active:scale-95 transition-all outline-none border border-slate-100 dark:border-slate-800/50">
                    <Layout size={20} className="text-slate-500" />
                    <span className="font-black text-[10px] uppercase">Home</span>
                  </button>
                  <button onClick={() => { setIsNavMenuOpen(false); router.push('/reading-lab'); }} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex flex-col items-center gap-2 text-slate-700 dark:text-slate-300 active:scale-95 transition-all outline-none border border-amber-50 dark:border-amber-900/20">
                    <Zap size={20} className="text-amber-500" />
                    <span className="font-black text-[10px] uppercase">Reading</span>
                  </button>
                  <button onClick={() => { setIsNavMenuOpen(false); setMode('vocab_select'); }} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex flex-col items-center gap-2 text-slate-700 dark:text-slate-300 active:scale-95 transition-all outline-none border border-indigo-50 dark:border-indigo-900/20">
                    <Languages size={20} className="text-indigo-600" />
                    <span className="font-black text-[10px] uppercase">Vocab</span>
                  </button>
                  <button onClick={() => { setIsNavMenuOpen(false); setMode('grammar'); }} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex flex-col items-center gap-2 text-slate-700 dark:text-slate-300 active:scale-95 transition-all outline-none border border-emerald-50 dark:border-emerald-900/20">
                    <Trophy size={20} className="text-emerald-600" />
                    <span className="font-black text-[10px] uppercase">Grammar</span>
                  </button>
                  <button onClick={() => { setIsNavMenuOpen(false); setMode('skills'); }} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex flex-col items-center gap-2 text-slate-700 dark:text-slate-300 active:scale-95 transition-all outline-none border border-violet-50 dark:border-violet-900/20">
                    <BookOpen size={20} className="text-violet-600" />
                    <span className="font-black text-[10px] uppercase">Skills</span>
                  </button>
                  <button onClick={() => { setIsNavMenuOpen(false); router.push('/progress'); }} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex flex-col items-center gap-2 text-slate-700 dark:text-slate-300 active:scale-95 transition-all outline-none border border-slate-100 dark:border-slate-800/50">
                    <PieChart size={20} className="text-slate-800 dark:text-slate-400" />
                    <span className="font-black text-[10px] uppercase">Progress</span>
                  </button>
                  <button onClick={() => { setIsNavMenuOpen(false); router.push('/analyzer'); }} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex flex-col items-center gap-2 text-slate-700 dark:text-slate-300 active:scale-95 transition-all outline-none border border-rose-50 dark:border-rose-900/20 col-span-2">
                    <PenTool size={20} className="text-rose-600" />
                    <span className="font-black text-[10px] uppercase">AI Analyzer</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SETTINGS MODAL */}
        <SettingsMenu 
          isOpen={isSettingsOpen} 
          onClose={() => setIsSettingsOpen(false)} 
          onNavigate={(path) => router.push(path)}
        />

      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
}