"use client";
import React from 'react';
import { RotateCcw, Sparkles, Languages, Target, Skull, Bookmark, Lightbulb } from 'lucide-react';

export default function VocabMaster({ 
  questions, currentIdx, vocabSubMode, isFlipped, setIsFlipped, 
  handleNext, selectedOption, setSelectedOption, showFeedback, setShowFeedback 
}: any) {
  
  if (!questions || !questions[currentIdx]) return null;
  const q = questions[currentIdx];

  const renderCardDetails = (explanation: string) => {
    if (!explanation) return null;
    const parts = explanation.split('|');
    return parts.map((p: string, i: number) => {
      const [label, ...content] = p.split(':');
      const styles: any = { 
        "ANLAM": { icon: <Languages size={14}/>, color: "text-indigo-400", bg: "bg-indigo-500/20" }, 
        "SYNONYM": { icon: <Target size={14}/>, color: "text-emerald-400", bg: "bg-emerald-500/20" },
        "ANTONYM": { icon: <Skull size={14}/>, color: "text-rose-400", bg: "bg-rose-500/20" },
        "MNEMONIC": { icon: <Sparkles size={14}/>, color: "text-amber-400", bg: "bg-amber-500/20" }
      };
      const style = styles[label?.trim()] || { icon: <Bookmark size={14}/>, color: "text-slate-400", bg: "bg-slate-500/20" };
      return (
        <div key={i} className={`p-4 rounded-[1.5rem] ${style.bg} border border-white/5 mb-2`}>
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
          <div className="absolute inset-0 backface-hidden bg-slate-900 rounded-[3rem] shadow-2xl flex flex-col items-center justify-center p-8 border-b-[12px] border-indigo-600">
             <RotateCcw size={32} className="text-white/20 mb-6"/>
             <div className="text-white text-[38px] font-black text-center italic uppercase tracking-tighter leading-tight select-none">
               {q.question}
             </div>
             <div className="absolute bottom-12 text-[9px] font-black text-indigo-400 uppercase tracking-[0.4em] opacity-60 italic">Tap to Reveal</div>
          </div>

          {/* KART ARKA YÜZÜ */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 bg-slate-900 rounded-[3rem] shadow-2xl flex flex-col p-6 border border-white/10 overflow-y-auto custom-scrollbar">
            <div className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4 flex items-center justify-center gap-2 bg-white/5 py-2 rounded-full border border-white/5">
              <Sparkles size={14}/> Intelligence
            </div>
            {renderCardDetails(q.explanation)}
          </div>
        </div>
        
        <button 
          onClick={(e) => { e.stopPropagation(); handleNext(); }} 
          className="w-full mt-8 bg-indigo-600 text-white py-5 rounded-[2rem] font-black uppercase text-[11px] shadow-lg active:scale-95 transition-all"
        >
          Next Word
        </button>
      </div>
    );
  }

  // Standart Soru Görünümü (Synonym/Context)
  return (
    <div className="space-y-5 animate-in slide-in-from-right-8">
      <div className="p-6 bg-slate-900 text-white rounded-[2.2rem] shadow-xl text-[16px] font-bold border-b-4 border-indigo-500 leading-relaxed italic">
        {q.question?.split(/(\*\*.*?\*\*)/g).map((part: string, i: number) => 
          part.startsWith('**') && part.endsWith('**') 
            ? <span key={i} className="text-indigo-400 border-b-2 border-indigo-400 font-black px-1">{part.replace(/\*\*/g, '')}</span> 
            : part
        )}
      </div>

      <div className="space-y-2">
        {q.options && Object.entries(q.options).map(([key, value]: any) => (
          <button key={key} onClick={() => !showFeedback && setSelectedOption(key)} className={`w-full p-4 text-left rounded-[1.2rem] border-2 transition-all text-[13px] flex items-center gap-3 ${selectedOption === key ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold shadow-md' : 'border-slate-100 bg-white hover:border-slate-200'}`}>
            <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black ${selectedOption === key ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>{key}</span>
            <span className="flex-1 text-slate-700 font-medium">{value}</span>
          </button>
        ))}
      </div>

      {showFeedback && (
        <div className="space-y-4 animate-in fade-in">
          <div className={`p-5 rounded-[2rem] text-[13px] border-2 shadow-sm ${selectedOption === q.correct ? 'bg-green-50 border-green-100' : 'bg-rose-50 border-rose-100'}`}>
            <p className="font-black mb-3 uppercase flex items-center gap-2 text-[10px] text-indigo-600 tracking-widest"><Lightbulb size={16}/> Correct: {q.correct}</p>
            <div className="space-y-3">{renderCardDetails(q.explanation)}</div>
          </div>
          <button onClick={handleNext} className="w-full bg-indigo-600 text-white py-4 rounded-[2rem] font-black shadow-lg text-[13px] uppercase active:scale-95 transition-all">Continue Mission</button>
        </div>
      )}

      {!showFeedback && (
        <button onClick={() => selectedOption && setShowFeedback(true)} disabled={!selectedOption} className="w-full bg-slate-900 text-white py-4 rounded-[2rem] font-black shadow-lg uppercase text-[12px] active:scale-95 tracking-widest transition-all">Confirm Answer</button>
      )}
    </div>
  );
}