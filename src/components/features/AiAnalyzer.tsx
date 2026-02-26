"use client";
import React from 'react';
import { Sparkles, Lightbulb, FileText } from 'lucide-react';

export default function AiAnalyzer({ 
  question, handleNext, selectedOption, setSelectedOption, showFeedback, setShowFeedback 
}: any) {
  
  if (!question) return null;

  return (
    <div className="space-y-5 animate-in zoom-in-95 duration-500 pb-20">
      {/* AI STATUS INDICATOR */}
      <div className="flex items-center gap-2 px-4 py-2 bg-rose-50 border border-rose-100 rounded-2xl w-fit">
        <Sparkles size={14} className="text-rose-500 animate-pulse" />
        <span className="text-[10px] font-black uppercase text-rose-600 tracking-widest">AI Generated Content</span>
      </div>

      {/* QUESTION CARD */}
      <div className="p-6 bg-slate-900 text-white rounded-[2.5rem] shadow-2xl text-[16px] font-bold border-b-[10px] border-rose-500 leading-relaxed relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10"><FileText size={60}/></div>
        <div className="relative z-10">{question.question}</div>
      </div>

      {/* OPTIONS */}
      <div className="space-y-2">
        {Object.entries(question.options).map(([key, value]: any) => (
          <button 
            key={key} 
            onClick={() => !showFeedback && setSelectedOption(key)} 
            className={`w-full p-4 text-left rounded-[1.5rem] border-2 transition-all text-[13px] flex items-center gap-3 ${
              selectedOption === key 
                ? 'border-rose-500 bg-rose-50 text-rose-700 font-bold shadow-md' 
                : 'border-slate-100 bg-white hover:border-slate-200'
            }`}
          >
            <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-black ${
              selectedOption === key ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-400'
            }`}>{key}</span>
            <span className="flex-1">{value}</span>
          </button>
        ))}
      </div>

      {/* FEEDBACK */}
      {showFeedback && (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
          <div className={`p-6 rounded-[2.5rem] text-[13px] border-2 shadow-inner ${
            selectedOption === question.correct ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'
          }`}>
            <p className="font-black mb-3 uppercase flex items-center gap-2 text-[10px] text-rose-600 tracking-widest">
              <Lightbulb size={16}/> AI Deep Analysis
            </p>
            <div className="font-medium leading-relaxed text-slate-700 italic">
              {question.explanation}
            </div>
          </div>
          <button 
            onClick={handleNext} 
            className="w-full bg-slate-900 text-white py-5 rounded-[2.2rem] font-black uppercase text-[12px] shadow-xl active:scale-95 transition-all tracking-widest"
          >
            Next Question
          </button>
        </div>
      )}

      {!showFeedback && (
        <button 
          onClick={() => selectedOption && setShowFeedback(true)} 
          disabled={!selectedOption} 
          className="w-full bg-rose-600 text-white py-5 rounded-[2.2rem] font-black shadow-lg uppercase text-[12px] active:scale-95 tracking-widest transition-all"
        >
          Verify with AI
        </button>
      )}
    </div>
  );
}