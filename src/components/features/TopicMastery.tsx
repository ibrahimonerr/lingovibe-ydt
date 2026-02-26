"use client";
import React from 'react';
import { Lightbulb, Trophy, BookOpen } from 'lucide-react';

export default function TopicMastery({ 
  question, mode, handleNext, selectedOption, setSelectedOption, showFeedback, setShowFeedback 
}: any) {
  
  if (!question) return null;

  // Tema Renkleri: Grammar için Yeşil, Skills için Mavi
  const theme = mode === 'grammar' 
    ? { border: 'border-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-700', icon: <Trophy size={16}/> }
    : { border: 'border-blue-500', bg: 'bg-blue-50', text: 'text-blue-700', icon: <BookOpen size={16}/> };

  return (
    <div className="space-y-5 animate-in slide-in-from-right-8 pb-20">
      {/* HEADER INDICATOR */}
      <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${theme.bg} ${theme.text} text-[10px] font-black uppercase tracking-widest`}>
        {theme.icon} {mode} Mastery
      </div>

      {/* QUESTION CARD */}
      <div className={`p-6 bg-slate-900 text-white rounded-[2.2rem] shadow-xl text-[16px] font-bold border-b-4 ${theme.border} leading-relaxed`}>
        {question.question}
      </div>

      {/* OPTIONS */}
      <div className="space-y-2">
        {question.options && Object.entries(question.options).map(([key, value]: any) => (
          <button 
            key={key} 
            onClick={() => !showFeedback && setSelectedOption(key)} 
            className={`w-full p-4 text-left rounded-[1.2rem] border-2 transition-all text-[13px] flex items-center gap-3 ${
              selectedOption === key 
                ? `${theme.border} ${theme.bg} ${theme.text} font-bold` 
                : 'border-slate-100 bg-white hover:border-slate-200'
            }`}
          >
            <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black ${
              selectedOption === key ? `bg-slate-900 text-white` : 'bg-slate-100 text-slate-400'
            }`}>{key}</span>
            <span className="flex-1 text-slate-700">{value}</span>
          </button>
        ))}
      </div>

      {/* FEEDBACK */}
      {showFeedback && (
        <div className="space-y-4 animate-in fade-in">
          <div className={`p-5 rounded-[2rem] text-[13px] border-2 ${
            selectedOption === question.correct ? 'bg-green-50 border-green-100' : 'bg-rose-50 border-rose-100'
          }`}>
            <p className={`font-black mb-3 uppercase flex items-center gap-2 text-[10px] ${theme.text} tracking-widest`}>
              <Lightbulb size={16}/> Solution Analysis
            </p>
            <div className="font-medium whitespace-pre-wrap leading-relaxed text-slate-700">
              {question.explanation}
            </div>
          </div>
          <button 
            onClick={handleNext} 
            className="w-full bg-slate-900 text-white py-4 rounded-[2rem] font-black uppercase text-[12px] shadow-lg active:scale-95 transition-all"
          >
            Next Challenge
          </button>
        </div>
      )}

      {!showFeedback && (
        <button 
          onClick={() => selectedOption && setShowFeedback(true)} 
          disabled={!selectedOption} 
          className="w-full bg-slate-900 text-white py-4 rounded-[2rem] font-black shadow-lg uppercase text-[12px] active:scale-95 tracking-widest transition-all"
        >
          Verify Answer
        </button>
      )}
    </div>
  );
}