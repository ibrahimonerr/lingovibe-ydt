"use client";
import React from 'react';
import { RotateCcw, Sparkles, Languages, Target, Skull, Bookmark, Lightbulb } from 'lucide-react';

import { Question } from '@/types';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { useAppStore } from '@/store/useAppStore';

export default function VocabMaster({
  questions, currentIdx, vocabSubMode, isFlipped, setIsFlipped,
  handleNext, selectedOption, setSelectedOption, showFeedback, setShowFeedback
}: {
  questions: Question[],
  currentIdx: number,
  vocabSubMode: string,
  isFlipped: boolean,
  setIsFlipped: (v: boolean) => void,
  handleNext: () => void,
  selectedOption: string | null,
  setSelectedOption: (v: string | null) => void,
  showFeedback: boolean,
  setShowFeedback: (v: boolean) => void
}) {

  const { recordAnswer, isGuestMode, guestDailyCompletedLabs } = useAppStore();
  if (!questions || !questions[currentIdx]) return null;
  const q = questions[currentIdx];

  const renderCardDetails = (explanation: string) => {
    if (!explanation) return null;
    const parts = explanation.split('|');
    return parts.map((p: string, i: number) => {
      const [label, ...content] = p.split(':');
      const styles: Record<string, { icon: React.ReactNode, color: string, bg: string }> = {
        "ANLAM": { icon: <Languages size={14} />, color: "text-indigo-400", bg: "bg-indigo-500/20" },
        "SYNONYM": { icon: <Target size={14} />, color: "text-emerald-400", bg: "bg-emerald-500/20" },
        "ANTONYM": { icon: <Skull size={14} />, color: "text-rose-400", bg: "bg-rose-500/20" },
        "MNEMONIC": { icon: <Sparkles size={14} />, color: "text-amber-400", bg: "bg-amber-500/20" }
      };
      		const style = styles[label?.trim()] || { icon: <Bookmark size={14} />, color: "text-slate-400 dark:text-slate-500", bg: "bg-slate-500/20" };
      return (
        <div key={i} className={`p-4 rounded-[1.5rem] ${style.bg} border border-white/5 dark:border-white/10 mb-2`}>
          <div className={`flex items-center gap-2 ${style.color} text-[9px] font-black uppercase mb-1`}>{style.icon} {label}</div>
          <div className="text-white font-bold text-[13px] leading-snug">{content.join(':')}</div>
        </div>
      );
    });
  };

  if (vocabSubMode === 'loop') {
    return (
      <div className="perspective-1000 min-h-[450px] animate-in slide-in-from-bottom-10">
        {/* 3D FLIP CONTAINER */}
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className={`relative w-full h-[400px] transition-all duration-700 preserve-3d cursor-pointer ${isFlipped ? 'rotate-y-180' : ''}`}
        >
          {/* KART ÖN YÜZÜ */}
          <div className="absolute inset-0 backface-hidden bg-slate-900 dark:bg-[#1a1c25] rounded-[3rem] shadow-2xl flex flex-col items-center justify-center p-8 border-b-[12px] border-indigo-600 dark:border-indigo-900">
            <RotateCcw size={32} className="text-white/20 mb-6" />
            <div className="text-white text-[38px] font-black text-center italic uppercase tracking-tighter leading-tight select-none">
              {q.question}
            </div>
            <div className="absolute bottom-12 text-[9px] font-black text-indigo-400 uppercase tracking-[0.4em] opacity-60 italic">Tap to Reveal</div>
          </div>

          {/* KART ARKA YÜZÜ */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 bg-slate-900 dark:bg-[#1a1c25] rounded-[3rem] shadow-2xl flex flex-col p-6 border border-white/10 overflow-y-auto custom-scrollbar">
            <div className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4 flex items-center justify-center gap-2 bg-white/5 py-2 rounded-full border border-white/5">
              <Sparkles size={14} /> Intelligence
            </div>
            {renderCardDetails(q.explanation)}
          </div>
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); handleNext(); }}
          className="w-full mt-8 bg-indigo-600 text-white py-5 rounded-[2rem] font-black uppercase text-[11px] shadow-lg active:scale-95 transition-all"
        >
          {currentIdx < questions.length - 1 ? 'Next Word' : 'Finish Lab Session'}
        </button>
      </div>
    );
  }

  // Standart Soru Görünümü (Synonym/Context)
  return (
    <div className="space-y-4 animate-in slide-in-from-right-8">
      <div className="p-4 bg-slate-900 dark:bg-[#1a1c25] text-white rounded-[1.8rem] shadow-xl text-[15px] font-bold border-b-4 border-indigo-500 dark:border-indigo-800 leading-relaxed italic">
        {q.question?.split(/(\*\*.*?\*\*)/g).map((part: string, i: number) =>
          part.startsWith('**') && part.endsWith('**')
            ? <span key={i} className="text-indigo-400 border-b-2 border-indigo-400 font-black px-1">{part.replace(/\*\*/g, '')}</span>
            : part
        )}
      </div>

      <div className="space-y-2">
        {q.options && Object.entries(q.options).map(([key, value]: [string, string]) => (
          <button key={key} onClick={() => !showFeedback && setSelectedOption(key)} className={`w-full p-2.5 text-left rounded-[1rem] border-2 transition-all text-[13px] flex items-center gap-3 ${selectedOption === key ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-bold shadow-md' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-200 dark:hover:border-slate-700'}`}>
            <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black ${selectedOption === key ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'}`}>{key}</span>
            <span className="flex-1 text-slate-700 dark:text-slate-300 font-medium">{value}</span>
          </button>
        ))}
      </div>

      {showFeedback && (
        <div className="space-y-4 animate-in fade-in">
          <div className={`p-5 rounded-[2rem] text-[13px] border-2 shadow-sm ${selectedOption === q.correct ? 'bg-green-50 border-green-100 dark:bg-green-900/20 dark:border-green-800' : 'bg-rose-50 border-rose-100 dark:bg-rose-900/20 dark:border-rose-800'}`}>
            <p className="font-black mb-3 uppercase flex items-center gap-2 text-[10px] text-indigo-600 dark:text-indigo-400 tracking-widest"><Lightbulb size={16} /> Correct: {q.correct}</p>
            <div className="space-y-3">{renderCardDetails(q.explanation)}</div>
          </div>
          <button onClick={handleNext} className="w-full bg-indigo-600 text-white py-4 rounded-[2rem] font-black shadow-lg text-[13px] uppercase active:scale-95 transition-all">
            {currentIdx < questions.length - 1 ? 'Continue Mission' : 'Finish Lab Session'}
          </button>
        </div>
      )}

      {!showFeedback && (
        <button
          onClick={async () => {
            if (selectedOption) {
              setShowFeedback(true);
              if (selectedOption === q.correct) {
                recordAnswer(true, false);
                await Haptics.notification({ type: NotificationType.Success }).catch(() => { });
              } else {
                recordAnswer(false, false);
                await Haptics.impact({ style: ImpactStyle.Light }).catch(() => { });
              }
            }
          }}
          disabled={!selectedOption}
          className="w-full bg-slate-900 text-white py-4 rounded-[2rem] font-black shadow-lg uppercase text-[12px] active:scale-95 tracking-widest transition-all"
        >
          Confirm Answer
        </button>
      )}
      {/* GUEST SIGNUP PROMPT */}
      {isGuestMode && (
        <div className="p-4 rounded-[1.8rem] border-2 border-dashed bg-slate-800 dark:bg-slate-900/50 border-indigo-500/30 animate-pulse mt-4">
          <div className="flex items-center gap-3">
            <Sparkles className="text-indigo-400" size={20} />
            <div className="text-[12px] font-bold text-slate-300 dark:text-slate-400 leading-tight">
              {guestDailyCompletedLabs.includes('vocab') 
                ? "Günlük demo hakkını bitirdin! Tüm kelimelere ve 1000'lerce soruya erişmek için giriş yap."
                : "Seviyeni korumak ve ilerlemeni kaydetmek için ücretsiz üye ol!"}
            </div>
            <button 
              onClick={() => useAppStore.getState().setGuestMode(false)}
              className="ml-auto px-4 py-2 rounded-xl text-[10px] font-black uppercase text-white bg-indigo-600 shadow-lg shadow-indigo-500/20"
            >
              Sign Up
            </button>
          </div>
        </div>
      )}
    </div>
  );
}