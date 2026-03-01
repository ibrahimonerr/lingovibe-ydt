"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import YDTLogo from '@/components/YDTLogo';
import {
  Layout, History, Zap, Languages, Trophy, BookOpen,
  PenTool, Target, Eye, Repeat, X, ChevronRight, PlayCircle
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';

const grammarTopics = ["Tenses & Aspect", "Modals", "Passive", "Conditionals", "Conjunctions", "Prepositions"];
const skillTopics = ["Cloze Test", "Sentence Completion", "Restatement", "Paragraph Completion", "Irrelevant"];

export default function YDTHub() {
  const router = useRouter();
  const [view, setView] = useState('home');
  const [mode, setMode] = useState('');
  const [activeMissions, setActiveMissions] = useState<any[]>([]);
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);
  const lastActiveRoute = useAppStore((state) => state.lastActiveRoute);

  useEffect(() => {
    const saved = localStorage.getItem('ydt_active_missions');
    if (saved) setActiveMissions(JSON.parse(saved));
  }, []);

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

  return (
    <div
      className="min-h-dvh bg-slate-50 flex justify-center py-0 sm:py-8 font-sans text-slate-900 leading-normal"
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <div className="w-full max-w-[450px] bg-white min-h-dvh sm:min-h-[850px] sm:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col relative border-x border-slate-200">

        {/* Spacer that pushes all content down */}
        <div className="flex-1" />

        {/* LOGO SECTION */}
        <header className="py-5 text-center border-b border-slate-100 bg-white">
          <YDTLogo size="md" theme="dark" showSlogan={false} />
        </header>

        <main className="flex flex-col px-5 pt-6 pb-28">
          {view === 'home' && (
            <div className="flex flex-col gap-3 animate-in fade-in duration-500">
              {/* READING LAB */}
              <button onClick={() => handleLabSelection('reading')} className="w-full p-5 rounded-[2.2rem] border-2 border-amber-100 bg-amber-50/30 flex items-center gap-4 active:scale-95 transition-all text-left shadow-sm">
                <div className="p-3 bg-white rounded-2xl text-amber-500 shadow-sm"><Zap size={20} /></div>
                <div>
                  <span className="font-black uppercase text-[13px] block text-slate-800 leading-none mb-1">Reading Lab</span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.15em] opacity-80">Daily Reading Comprehension</span>
                </div>
              </button>

              {/* VOCAB LAB */}
              <button onClick={() => setMode('vocab_select')} className="w-full p-5 rounded-[2.2rem] border-2 border-indigo-100 bg-indigo-50/30 flex items-center gap-4 active:scale-95 transition-all text-left shadow-sm">
                <div className="p-3 bg-white rounded-2xl text-indigo-600 shadow-sm"><Languages size={20} /></div>
                <div>
                  <span className="font-black uppercase text-[13px] block text-slate-800 leading-none mb-1">Vocab Lab</span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.15em] opacity-80">Retention & Recall</span>
                </div>
              </button>

              {/* GRAMMAR LAB */}
              <button onClick={() => setMode('grammar')} className="w-full p-5 rounded-[2.2rem] border-2 border-emerald-100 bg-emerald-50/30 flex items-center gap-4 active:scale-95 transition-all text-left shadow-sm">
                <div className="p-3 bg-white rounded-2xl text-emerald-600 shadow-sm"><Trophy size={20} /></div>
                <div>
                  <span className="font-black uppercase text-[13px] block text-slate-800 leading-none mb-1">Grammar Lab</span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.15em] opacity-80">Structural Logic</span>
                </div>
              </button>

              {/* SKILLS LAB */}
              <button onClick={() => setMode('skills')} className="w-full p-5 rounded-[2.2rem] border-2 border-violet-100 bg-violet-50/30 flex items-center gap-4 active:scale-95 transition-all text-left shadow-sm">
                <div className="p-3 bg-white rounded-2xl text-violet-600 shadow-sm"><BookOpen size={20} /></div>
                <div>
                  <span className="font-black uppercase text-[13px] block text-slate-800 leading-none mb-1">Skills Lab</span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.15em] opacity-80">Patterns & Logic</span>
                </div>
              </button>

              {/* AI ANALYZER */}
              <button onClick={() => handleLabSelection('analyzer')} className="w-full p-5 rounded-[2.2rem] border-2 border-rose-100 bg-rose-50/30 flex items-center gap-4 active:scale-95 transition-all text-left shadow-sm">
                <div className="p-3 bg-white rounded-2xl text-rose-600 shadow-sm"><PenTool size={20} /></div>
                <div>
                  <span className="font-black uppercase text-[13px] block text-slate-800 leading-none mb-1">AI Analyzer</span>
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.15em] opacity-80">Scan & Generate</span>
                </div>
              </button>
            </div>
          )}
        </main>

        {/* MODALLAR */}
        {['grammar', 'skills', 'vocab_select'].includes(mode) && view === 'home' && (
          <div className="absolute inset-0 z-[120] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
            <div className="w-full max-w-[380px] bg-white rounded-[2.5rem] p-6 shadow-2xl animate-in zoom-in-95 duration-200">
              <div className="text-center font-black uppercase text-[11px] text-indigo-600 mb-6 border-b pb-4 italic">Lab Selection</div>
              <div className="space-y-2 max-h-[350px] overflow-y-auto custom-scrollbar">
                {mode === 'vocab_select' ? (
                  <>
                    <button onClick={() => handleLabSelection('vocab', 'synonym')} className="w-full p-4 rounded-2xl bg-indigo-50 flex items-center gap-3 text-slate-700 font-black text-[11px] uppercase"><Target size={18} className="text-indigo-600" /> Synonym & Antonym</button>
                    <button onClick={() => handleLabSelection('vocab', 'context')} className="w-full p-4 rounded-2xl bg-amber-50 flex items-center gap-3 text-slate-700 font-black text-[11px] uppercase"><Eye size={18} className="text-amber-600" /> In-Context Lab</button>
                    <button onClick={() => handleLabSelection('vocab', 'odd')} className="w-full p-4 rounded-2xl bg-emerald-50 flex items-center gap-3 text-slate-700 font-black text-[11px] uppercase"><X size={18} className="text-emerald-600" /> Odd-One Out</button>
                    <button onClick={() => handleLabSelection('vocab', 'loop')} className="w-full p-4 rounded-2xl bg-rose-50 flex items-center gap-3 text-slate-700 font-black text-[11px] uppercase"><Repeat size={18} className="text-rose-600" /> Flashcard Lab</button>
                    <button onClick={() => handleLabSelection('vocab', 'wordmap')} className="w-full p-4 rounded-2xl bg-blue-50 flex items-center gap-3 text-slate-700 font-black text-[11px] uppercase"><Zap size={18} className="text-blue-600" /> WordMap Game</button>
                  </>
                ) : (
                  (mode === 'grammar' ? grammarTopics : skillTopics).map(t => (
                    <button key={t} onClick={() => handleLabSelection(mode, t)} className="w-full p-3.5 text-left bg-slate-50 rounded-xl text-[10px] font-black uppercase flex justify-between items-center text-slate-600 hover:bg-indigo-50 transition-all">{t} <ChevronRight size={14} className="opacity-20" /></button>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* BOTTOM NAV */}
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
                  <button onClick={() => { setIsNavMenuOpen(false); setMode('vocab_select'); }} className="p-4 rounded-2xl bg-slate-50 flex flex-col items-center gap-2 text-slate-700 active:scale-95 transition-all outline-none border border-indigo-50">
                    <Languages size={20} className="text-indigo-600" />
                    <span className="font-black text-[10px] uppercase">Vocab</span>
                  </button>
                  <button onClick={() => { setIsNavMenuOpen(false); setMode('grammar'); }} className="p-4 rounded-2xl bg-slate-50 flex flex-col items-center gap-2 text-slate-700 active:scale-95 transition-all outline-none border border-emerald-50">
                    <Trophy size={20} className="text-emerald-600" />
                    <span className="font-black text-[10px] uppercase">Grammar</span>
                  </button>
                  <button onClick={() => { setIsNavMenuOpen(false); setMode('skills'); }} className="p-4 rounded-2xl bg-slate-50 flex flex-col items-center gap-2 text-slate-700 active:scale-95 transition-all outline-none border border-violet-50">
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