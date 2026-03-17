"use client";
import React from 'react';
import { Lightbulb, Target, BookOpen, Sparkles, ChevronRight, AlertCircle, RefreshCw } from 'lucide-react';

import { Question, Feedback } from '@/types';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { useAppStore } from '@/store/useAppStore';

export default function GrammarLab({
  question, mode, handleNext, selectedOption, setSelectedOption, showFeedback, setShowFeedback,
  showHint, setShowHint
}: {
  question: Question | null,
  mode: string,
  handleNext: () => void,
  selectedOption: string | null,
  setSelectedOption: (v: string | null) => void,
  showFeedback: boolean,
  setShowFeedback: (v: boolean) => void,
  showHint: boolean,
  setShowHint: (v: boolean) => void
}) {

  const { recordAnswer, isGuestMode, guestDailyCompletedLabs } = useAppStore();
  if (!question) return null;

  const isSkills = mode === 'skills';
  const themeClass = isSkills ? 'violet' : 'emerald';
  const labTitle = isSkills ? 'Skills Strategy' : 'Grammar Focus';

  const renderExplanation = (explanation: string, feedback?: Feedback) => {
    if (feedback) {
      const items = [
        { label: "Analitik Doğrulama", type: "LOGIC", content: feedback.correct_logic, icon: <Target size={14} /> },
        { label: "Sinsi Çeldirici", type: "TRAP", content: feedback.trap_analysis, icon: <AlertCircle size={14} /> },
        { label: "YDT Taktiği", type: "TACTIC", content: feedback.exam_tactic, icon: <Sparkles size={14} /> },
        { label: "Bağlamsal Çeviri", type: "ANLAM", content: feedback.contextual_translation || feedback.translation, icon: <BookOpen size={14} /> }
      ];

      return items.filter(item => item.content).map((item, i) => {
        const styles: Record<string, { bg: string, text: string, labelColor: string }> = {
          "LOGIC": { bg: "bg-indigo-600 shadow-indigo-200", text: "text-white", labelColor: "text-indigo-200" },
          "TRAP": { bg: "bg-rose-50 border-rose-100 border-2", text: "text-rose-900", labelColor: "text-rose-600" },
          "TACTIC": { bg: "bg-amber-50 border-amber-100 border-2", text: "text-amber-900", labelColor: "text-amber-600" },
          "ANLAM": { bg: isSkills ? "bg-violet-50 border-violet-100 border-2" : "bg-emerald-50 border-emerald-100 border-2", text: isSkills ? "text-violet-900" : "text-emerald-900", labelColor: isSkills ? "text-violet-600" : "text-emerald-600" }
        };

        const style = styles[item.type] || { bg: "bg-slate-50 border-slate-100 border-2", text: "text-slate-700", labelColor: "text-slate-400" };

        return (
          <div key={i} className={`p-4 rounded-[1.8rem] mb-3 shadow-sm ${style.bg} ${style.text}`}>
            <div className={`flex items-center gap-2 text-[9px] font-black uppercase mb-1 tracking-widest ${style.labelColor}`}>
              {item.icon} {item.label}
            </div>
            <div className="text-[13px] font-bold leading-relaxed italic">{item.content}</div>
          </div>
        );
      });
    }

    if (!explanation) return null;
    const parts = explanation.split('|');

    return parts.map((p, i) => {
      const [label, ...content] = p.split(':');
      const type = label?.trim().toUpperCase();

      const styles: Record<string, { bg: string, text: string, labelColor: string, icon: React.ReactNode }> = {
        "TACTIC": { bg: "bg-indigo-600 shadow-indigo-200", text: "text-white", labelColor: "text-indigo-200", icon: <Target size={14} /> },
        "ANLAM": { bg: isSkills ? "bg-violet-50 border-violet-100 border-2" : "bg-emerald-50 border-emerald-100 border-2", text: isSkills ? "text-violet-900" : "text-emerald-900", labelColor: isSkills ? "text-violet-600" : "text-emerald-600", icon: <BookOpen size={14} /> },
        "NOTE": { bg: "bg-amber-50 border-amber-100 border-2", text: "text-amber-900", labelColor: "text-amber-600", icon: <AlertCircle size={14} /> }
      };

      const style = styles[type] || { bg: "bg-slate-50 border-slate-100 border-2", text: "text-slate-700", labelColor: "text-slate-400", icon: <Sparkles size={14} /> };

      return (
        <div key={i} className={`p-4 rounded-[1.8rem] mb-3 shadow-sm ${style.bg} ${style.text}`}>
          <div className={`flex items-center gap-2 text-[9px] font-black uppercase mb-1 tracking-widest ${style.labelColor}`}>
            {style.icon} {label}
          </div>
          <div className="text-[13px] font-bold leading-relaxed italic">{content.join(':')}</div>
        </div>
      );
    });
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
      {/* DINAMIK SORU KARTI */}
      <div className="relative group">
        <div className={`absolute -inset-1 bg-gradient-to-r ${isSkills ? 'from-violet-500 to-purple-500' : 'from-emerald-500 to-teal-500'} rounded-[2.5rem] blur opacity-10 transition duration-1000`}></div>
        <div className={`relative p-7 bg-white border-2 ${isSkills ? 'border-violet-50' : 'border-emerald-50'} rounded-[2.5rem] shadow-xl text-[18px] font-bold text-slate-800 leading-relaxed italic whitespace-pre-wrap`}>
          <div className={`absolute -top-3 left-8 text-white text-[9px] font-black px-4 py-1 rounded-full uppercase tracking-tighter shadow-md ${isSkills ? 'bg-violet-600' : 'bg-emerald-500'}`}>
            {labTitle}
          </div>
          {question.question?.split(/(\*\*.*?\*\*)/g).map((part: string, i: number) =>
            part.startsWith('**') && part.endsWith('**')
              ? <span key={i} className={`${isSkills ? 'bg-violet-100 text-violet-700 border-violet-200' : 'bg-emerald-100 text-emerald-700 border-emerald-200'} rounded px-2 mx-1 shadow-sm not-italic border-b-2`}>{part.replace(/\*\*/g, '')}</span>
              : part
          )}
        </div>
      </div>

      {/* SEÇENEKLER */}
      <div className="grid gap-3">
        {question.options && Object.entries(question.options).map(([key, value]: [string, string]) => (
          <button key={key} disabled={showFeedback} onClick={() => setSelectedOption(key)}
            className={`group relative p-5 text-left rounded-[1.8rem] border-2 transition-all duration-300 transform active:scale-[0.98]
              ${selectedOption === key
                ? (isSkills ? 'border-violet-500 bg-violet-600 text-white' : 'border-emerald-500 bg-emerald-500 text-white')
                : `border-slate-100 bg-white hover:${isSkills ? 'border-violet-200' : 'border-emerald-200'} text-slate-700`}`}
          >
            <div className="flex items-center gap-4">
              <span className={`w-9 h-9 rounded-2xl flex items-center justify-center text-[12px] font-black ${selectedOption === key ? 'bg-white text-slate-900' : 'bg-slate-50 text-slate-400'}`}>{key}</span>
              <span className="font-bold text-[15px]">{value}</span>
            </div>
          </button>
        ))}
      </div>

      {selectedOption && !showFeedback && !showHint && (
        <button
          onClick={async () => {
            const correctAnswer = question.correct_answer || question.correct;
            if (selectedOption === correctAnswer) {
              setShowFeedback(true);
              setShowHint(false);
              recordAnswer(true, showHint);
              await Haptics.notification({ type: NotificationType.Success }).catch(() => { });
            } else {
              setShowHint(true);
              recordAnswer(false, true);
              await Haptics.impact({ style: ImpactStyle.Light }).catch(() => { });
            }
          }}
          className={`w-full py-5 ${isSkills ? 'bg-violet-900' : 'bg-slate-900'} text-white rounded-[2.2rem] font-black uppercase text-[12px] flex items-center justify-center gap-2 transition-all`}
        >
          Verify Strategy <ChevronRight size={18} />
        </button>
      )}

      {/* HINT UI */}
      {showHint && !showFeedback && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className={`p-1 rounded-[2.5rem] ${isSkills ? 'bg-fuchsia-500 shadow-fuchsia-100' : 'bg-orange-500 shadow-orange-100'} shadow-lg`}>
            <div className="bg-white p-6 rounded-[2.4rem]">
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-xl ${isSkills ? 'bg-fuchsia-100 text-fuchsia-600' : 'bg-orange-100 text-orange-600'}`}>
                  <Lightbulb size={20} />
                </div>
                <div className={`font-black text-[12px] uppercase tracking-tighter ${isSkills ? 'text-fuchsia-600' : 'text-orange-600'}`}>
                  Strategy check! Here is a hint:
                </div>
              </div>
              <div className={`p-4 border-2 rounded-[1.8rem] text-[13px] font-bold italic leading-relaxed ${isSkills ? 'bg-fuchsia-50 border-fuchsia-100 text-fuchsia-900' : 'bg-orange-50 border-orange-100 text-orange-900'}`}>
                {question.hint || "Farklı bir dil kuralları açısıyla bakmayı deneyin."}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => { setShowHint(false); setSelectedOption(null); }}
              className={`w-full ${isSkills ? 'bg-violet-900' : 'bg-slate-900'} text-white py-4 rounded-[2.2rem] font-black uppercase text-[11px] shadow-xl active:scale-95 transition-all tracking-widest flex items-center justify-center gap-2`}
            >
              <RefreshCw size={16} /> Try Again
            </button>
            <button
              onClick={() => { setShowHint(false); setShowFeedback(true); }}
              className="w-full bg-slate-100 text-slate-500 hover:text-slate-800 py-4 rounded-[2.2rem] font-black uppercase text-[11px] active:scale-95 transition-all tracking-widest"
            >
              Reveal Answer
            </button>
          </div>
        </div>
      )}

      {/* FULL FEEDBACK UI */}
      {showFeedback && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className={`p-1 rounded-[2.5rem] ${selectedOption === question.correct ? (isSkills ? 'bg-violet-500' : 'bg-emerald-500') : 'bg-rose-500'}`}>
            <div className="bg-white p-6 rounded-[2.4rem]">
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-xl ${selectedOption === question.correct ? (isSkills ? 'bg-violet-100 text-violet-600' : 'bg-emerald-100 text-emerald-600') : 'bg-rose-100 text-rose-600'}`}>
                  <Lightbulb size={20} />
                </div>
                <div className="font-black text-[12px] uppercase tracking-tighter">
                  Result: <span className={selectedOption === (question.correct_answer || question.correct) ? (isSkills ? 'text-violet-600' : 'text-emerald-600') : 'text-rose-600'}>{selectedOption === (question.correct_answer || question.correct) ? 'WELL SOLVED' : 'STRATEGY ERROR'}</span>
                </div>
              </div>
              <div className="space-y-1">{renderExplanation(question.explanation, question.feedback)}</div>
            </div>
          </div>
          <button onClick={handleNext} className={`w-full ${isSkills ? 'bg-violet-900' : 'bg-slate-900'} text-white py-5 rounded-[2.2rem] font-black uppercase text-[12px] shadow-xl active:scale-95 transition-all tracking-widest`}>Next Challenge</button>
        </div>
      )}

      {/* GUEST SIGNUP PROMPT */}
      {isGuestMode && (
        <div className={`p-4 rounded-[2rem] border-2 border-dashed ${isSkills ? 'bg-violet-50 border-violet-200' : 'bg-emerald-50 border-emerald-200'} animate-pulse mt-8`}>
          <div className="flex items-center gap-3">
            <Sparkles className={isSkills ? 'text-violet-600' : 'text-emerald-600'} size={20} />
            <div className="text-[12.5px] font-bold text-slate-700 leading-tight">
              {guestDailyCompletedLabs.includes('grammar') 
                ? "Günlük demo hakkını bitirdin! Tüm laboratuvarlara ve 1000'lerce soruya erişmek için giriş yap."
                : "Seviyeni korumak ve ilerlemeni kaydetmek için ücretsiz üye ol!"}
            </div>
            <button 
              onClick={() => useAppStore.getState().setGuestMode(false)}
              className={`ml-auto px-4 py-2 rounded-xl text-[10px] font-black uppercase text-white shadow-lg ${isSkills ? 'bg-violet-900' : 'bg-emerald-600'}`}
            >
              Sign Up
            </button>
          </div>
        </div>
      )}
    </div>
  );
}