"use client";
import React from 'react';
import { RotateCcw, Sparkles, Languages, Target, Skull, Bookmark, Eye, Repeat, Lightbulb } from 'lucide-react';

export default function VocabMaster({ 
  questions, currentIdx, setCurrentIdx, vocabSubMode, isFlipped, setIsFlipped, 
  handleNext, formatQuestionText, selectedOption, setSelectedOption, showFeedback, setShowFeedback 
}: any) {
  
  const renderCardBack = (explanation: string) => {
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
        <div key={i} className={`p-4 rounded-[1.8rem] ${style.bg} border border-white/5 mb-2`}>
          <div className={`flex items-center gap-2 ${style.color} text-[9px] font-black uppercase mb-1`}>{style.icon} {label}</div>
          <div className="text-white font-bold text-[14px] leading-snug">{content.join(':')}</div>
        </div>
      );
    });
  };

  if (vocabSubMode === 'loop') {
    return (
      <div className="perspective-1000 min-h-[420px]">
        <div onClick={() => setIsFlipped(!isFlipped)} className={`relative w-full h-[400px] transition-all duration-700 preserve-3d cursor-pointer ${isFlipped ? 'rotate-y-180' : ''}`}>
          <div className="absolute inset-0 backface-hidden bg-slate-900 rounded-[3rem] shadow-2xl flex flex-col items-center justify-center p-8 border-b-[12px] border-indigo-600">
             <RotateCcw size={32} className="text-white/20 mb-6"/>
             <div className="text-white text-[34px] font-black text-center italic uppercase leading-tight select-none tracking-tighter">{questions[currentIdx].question}</div>
             <div className="absolute bottom-12 text-[9px] font-black text-indigo-400 uppercase tracking-[0.4em] opacity-60">Tap to Reveal</div>
          </div>
          <div className="absolute inset-0 backface-hidden rotate-y-180 bg-slate-900 rounded-[3rem] shadow-2xl flex flex-col p-6 border border-white/10 overflow-y-auto custom-scrollbar">
            <div className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4 flex items-center justify-center gap-2 bg-white/5 py-2 rounded-full border border-white/5"><Sparkles size={14}/> Word Intelligence</div>
            {renderCardBack(questions[currentIdx].explanation)}
          </div>
        </div>
        <div className="mt-8 flex gap-3">
          <button onClick={() => { if(currentIdx > 0) { setCurrentIdx(currentIdx - 1); setIsFlipped(false); } }} disabled={currentIdx === 0} className={`flex-1 py-4 rounded-[1.5rem] font-black uppercase text-[10px] ${currentIdx === 0 ? 'bg-slate-50 text-slate-200' : 'bg-white border-2 border-slate-100 text-slate-600 active:scale-90'}`}>Prev</button>
          <button onClick={handleNext} className="flex-[2.5] bg-indigo-600 text-white py-4 rounded-[1.5rem] font-black uppercase text-[10px] shadow-lg active:scale-90">Next Word</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="p-6 bg-slate-900 text-white rounded-[2.2rem] shadow-xl text-[15px] font-bold border-b-4 border-indigo-500 leading-relaxed italic">
        {formatQuestionText(questions[currentIdx].question)}
      </div>
      <div className="space-y-2">
        {Object.entries(questions[currentIdx].options).map(([key, value]: any) => (
          <button key={key} onClick={() => !showFeedback && setSelectedOption(key)} className={`w-full p-4 text-left rounded-[1.2rem] border-2 transition-all text-[13px] flex items-center gap-3 ${selectedOption === key ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold' : 'border-slate-100 bg-white shadow-sm hover:border-slate-200'}`}>
            <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black ${selectedOption === key ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>{key}</span><span className="flex-1">{value}</span>
          </button>
        ))}
      </div>
      {showFeedback && (
        <div className="space-y-4 animate-in fade-in">
          <div className={`p-5 rounded-[2rem] text-[13px] border-2 shadow-sm ${selectedOption === questions[currentIdx].correct ? 'bg-green-50 text-green-900 border-green-100' : 'bg-rose-50 text-rose-900 border-rose-100'}`}>
            <p className="font-black mb-3 uppercase flex items-center gap-2 text-[10px] text-indigo-600 tracking-widest"><Lightbulb size={16}/> Analysis</p>
            <div className="font-medium whitespace-pre-wrap leading-relaxed">{questions[currentIdx].explanation}</div>
          </div>
          <button onClick={handleNext} className="w-full bg-indigo-600 text-white py-4 rounded-[2rem] font-black shadow-lg text-[13px] uppercase active:scale-95 transition-all">Next Step</button>
        </div>
      )}
    </div>
  );
}