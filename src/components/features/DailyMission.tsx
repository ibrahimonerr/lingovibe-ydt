"use client";
import React from 'react';
import { BookOpen, ChevronUp, ChevronDown, Lightbulb, Zap } from 'lucide-react';

export default function DailyMission({ 
  questions, currentIdx, readingPassage, isTextExpanded, setIsTextExpanded, 
  handleNext, selectedOption, setSelectedOption, showFeedback, setShowFeedback 
}: any) {
  
  if (!questions || !questions[currentIdx]) {
    return (
      <div className="flex flex-col items-center justify-center p-10 bg-amber-50 rounded-3xl border-2 border-dashed border-amber-200 gap-3">
        <Zap className="text-amber-500 animate-pulse" size={32} />
        <p className="text-amber-700 font-black uppercase text-[10px]">Preparing Mission...</p>
      </div>
    );
  }

  const q = questions[currentIdx];

  return (
    <div className="space-y-5 animate-in slide-in-from-bottom-6">
      {/* READING PASSAGE AREA */}
      {readingPassage && (
        <div className="border-2 border-amber-100 rounded-[2rem] overflow-hidden bg-white shadow-sm transition-all duration-500">
          <button 
            onClick={() => setIsTextExpanded(!isTextExpanded)} 
            className="w-full p-4 bg-amber-50 flex justify-between items-center text-amber-900 font-black text-[10px] uppercase tracking-widest"
          >
            <span className="flex items-center gap-2 font-mono"><BookOpen size={14}/> Reading Passage</span>
            {isTextExpanded ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
          </button>
          
          {isTextExpanded && (
            <div className="p-5 text-[14px] leading-relaxed text-slate-700 italic max-h-[280px] overflow-y-auto border-t border-amber-100 custom-scrollbar bg-amber-50/10">
              {readingPassage}
            </div>
          )}
        </div>
      )}

      {/* QUESTION CARD */}
      <div className="p-6 bg-slate-900 text-white rounded-[2.2rem] shadow-xl text-[16px] font-bold border-b-4 border-amber-500 leading-relaxed">
        {q.question}
      </div>

      {/* OPTIONS */}
      <div className="space-y-2">
        {q.options && Object.entries(q.options).map(([key, value]: any) => (
          <button 
            key={key} 
            onClick={() => !showFeedback && setSelectedOption(key)} 
            className={`w-full p-4 text-left rounded-[1.2rem] border-2 transition-all text-[13px] flex items-center gap-3 ${
              selectedOption === key 
                ? 'border-amber-500 bg-amber-50 text-amber-700 font-bold' 
                : 'border-slate-100 bg-white hover:border-slate-200'
            }`}
          >
            <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black ${
              selectedOption === key ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-400'
            }`}>{key}</span>
            <span className="flex-1 text-slate-700">{value}</span>
          </button>
        ))}
      </div>

      {/* FEEDBACK AREA */}
      {showFeedback && (
        <div className="space-y-4 animate-in fade-in">
          <div className={`p-5 rounded-[2rem] text-[13px] border-2 ${
            selectedOption === q.correct ? 'bg-green-50 border-green-100' : 'bg-rose-50 border-rose-100'
          }`}>
            <p className="font-black mb-3 uppercase flex items-center gap-2 text-[10px] text-amber-600 tracking-widest">
              <Lightbulb size={16}/> Analysis
            </p>
            <div className="font-medium whitespace-pre-wrap leading-relaxed text-slate-700">
              {q.explanation}
            </div>
          </div>
          <button 
            onClick={handleNext} 
            className="w-full bg-amber-500 text-white py-4 rounded-[2rem] font-black uppercase text-[12px] shadow-lg active:scale-95 transition-all"
          >
            Next Step
          </button>
        </div>
      )}

      {!showFeedback && (
        <button 
          onClick={() => selectedOption && setShowFeedback(true)} 
          disabled={!selectedOption} 
          className="w-full bg-slate-900 text-white py-4 rounded-[2rem] font-black shadow-lg uppercase text-[12px] active:scale-95 tracking-widest transition-all"
        >
          Confirm Answer
        </button>
      )}
    </div>
  );
}