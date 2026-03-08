"use client";
import React from 'react';
import { BookOpen, Target, Lightbulb, ChevronRight, Maximize2, Minimize2, Sparkles, Zap, RefreshCw } from 'lucide-react';

import { Question, Feedback } from '@/types';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { useAppStore } from '@/store/useAppStore';

export default function ReadingLab({
  questions, currentIdx, readingPassage, isTextExpanded, setIsTextExpanded,
  handleNext, selectedOption, setSelectedOption, showFeedback, setShowFeedback,
  showHint, setShowHint
}: {
  questions: Question[],
  currentIdx: number,
  readingPassage: string,
  isTextExpanded: boolean,
  setIsTextExpanded: (v: boolean) => void,
  handleNext: () => void,
  selectedOption: string | null,
  setSelectedOption: (v: string | null) => void,
  showFeedback: boolean,
  setShowFeedback: (v: boolean) => void,
  showHint: boolean,
  setShowHint: (v: boolean) => void
}) {

  const recordAnswer = useAppStore(state => state.recordAnswer);
  if (!questions || !questions[currentIdx]) return null;
  const question = questions[currentIdx];

  const renderExplanation = (explanation: string, feedback?: Feedback) => {
    if (feedback) {
      const items = [
        { label: "Analitik Doğrulama", type: "LOGIC", content: feedback.correct_logic, icon: <Target size={14} /> },
        { label: "Sinsi Çeldirici", type: "TRAP", content: feedback.trap_analysis, icon: <Lightbulb size={14} /> },
        { label: "YDT Taktiği", type: "TACTIC", content: feedback.exam_tactic, icon: <Zap size={14} /> },
        { label: "Bağlamsal Çeviri", type: "ANLAM", content: feedback.contextual_translation || feedback.translation, icon: <BookOpen size={14} /> }
      ];

      return items.filter(item => item.content).map((item, i) => {
        const styles: Record<string, { bg: string, text: string, labelColor: string }> = {
          "LOGIC": { bg: "bg-indigo-600 shadow-indigo-200", text: "text-white", labelColor: "text-indigo-200" },
          "TRAP": { bg: "bg-rose-50 border-rose-100 border-2", text: "text-rose-900", labelColor: "text-rose-600" },
          "TACTIC": { bg: "bg-amber-50 border-amber-100 border-2", text: "text-amber-900", labelColor: "text-amber-600" },
          "ANLAM": { bg: "bg-teal-50 border-teal-100 border-2", text: "text-teal-900", labelColor: "text-teal-600" }
        };

        const style = styles[item.type] || { bg: "bg-slate-50 border-slate-100 border-2", text: "text-slate-700", labelColor: "text-slate-400" };

        return (
          <div key={i} className={`p-4 rounded-[1.8rem] mb-3 shadow-sm animate-in zoom-in-95 ${style.bg} ${style.text}`}>
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
        "TACTIC": {
          bg: "bg-indigo-600 shadow-indigo-200",
          text: "text-white",
          labelColor: "text-indigo-200",
          icon: <Zap size={14} />
        },
        "ANLAM": {
          bg: "bg-amber-50 border-amber-100 border-2",
          text: "text-amber-900",
          labelColor: "text-amber-600",
          icon: <BookOpen size={14} />
        }
      };

      const style = styles[type] || {
        bg: "bg-slate-50 border-slate-100 border-2",
        text: "text-slate-700",
        labelColor: "text-slate-400",
        icon: <Sparkles size={14} />
      };

      return (
        <div key={i} className={`p-4 rounded-[1.8rem] mb-3 shadow-sm animate-in zoom-in-95 ${style.bg} ${style.text}`}>
          <div className={`flex items-center gap-2 text-[9px] font-black uppercase mb-1 tracking-widest ${style.labelColor}`}>
            {style.icon} {label}
          </div>
          <div className="text-[13px] font-bold leading-relaxed italic">
            {content.join(':')}
          </div>
        </div>
      );
    });
  };

  const renderPassage = () => {
    if (!readingPassage) return null;

    // Highlight both __N__ and (N) blank formats
    // Split on blank markers first: __1__ ... __5__ or (1) ... (5)
    const blankRegex = /(__\d+__|(?<!\w)\(\d+\)(?!\w))/g;

    const parts = readingPassage.split(blankRegex);

    // If hint quote is active, we also want to highlight the quote
    const quoteRegex = showHint && question.quote
      ? new RegExp(`(${question.quote.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'i')
      : null;

    return (
      <>
        {parts.map((part: string, i: number) => {
          if (blankRegex.test(part) || /^__\d+__$/.test(part) || /^\(\d+\)$/.test(part)) {
            // Extract the number from __N__ or (N)
            const num = part.replace(/__/g, '').replace(/[()]/g, '');
            return (
              <span
                key={i}
                className="inline-flex items-center justify-center bg-amber-100 text-amber-800 border-2 border-amber-400 rounded-lg px-2 py-0.5 mx-1 font-black text-[15px] shadow-sm"
              >
                [{num}]
              </span>
            );
          }

          if (quoteRegex && quoteRegex.test(part)) {
            const subParts = part.split(quoteRegex);
            return (
              <span key={i}>
                {subParts.map((sp, j) => {
                  if (j % 2 === 1) { // Captured match from the regex is always at odd indices
                    return (
                      <mark key={j} className="bg-orange-200 text-orange-900 px-1 rounded-sm mx-0.5 shadow-sm animate-pulse font-bold underline decoration-wavy decoration-orange-400 underline-offset-4">
                        {sp}
                      </mark>
                    );
                  }
                  return <span key={j}>{sp}</span>;
                })}
              </span>
            );
          }

          return <span key={i}>{part}</span>;
        })}
      </>
    );
  };


  return (
    <div className="space-y-6 animate-in slide-in-from-right-8 duration-500 pb-10">
      {/* READING PASSAGE CARD */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-[2.5rem] blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
        <div className="relative bg-white border-2 border-amber-50 rounded-[2.5rem] shadow-xl overflow-hidden transition-all duration-500">
          <div className="bg-amber-500 p-4 flex justify-between items-center">
            <div className="flex items-center gap-2 text-white">
              <BookOpen size={18} />
              <span className="text-[10px] font-black uppercase tracking-tighter">Reading Lab Passage</span>
            </div>
            <button
              onClick={() => setIsTextExpanded(!isTextExpanded)}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-xl text-white transition-all"
            >
              {isTextExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>
          </div>

          <div className={`p-6 transition-all duration-500 overflow-y-auto custom-scrollbar ${isTextExpanded ? 'max-h-[400px]' : 'max-h-[120px] opacity-60'}`}>
            <p className="text-[15px] font-medium leading-relaxed text-slate-700 italic first-letter:text-4xl first-letter:font-black first-letter:text-amber-500 first-letter:mr-1 whitespace-pre-wrap">
              {renderPassage()}
            </p>
          </div>

          {!isTextExpanded && (
            <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none" />
          )}
        </div>
      </div>

      {/* QUESTION SECTION */}
      <div className="bg-white p-6 rounded-[2.2rem] border-2 border-slate-50 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5">
          <Target size={80} className="text-amber-500" />
        </div>
        <div className="text-[11px] font-black text-amber-600 uppercase mb-2 tracking-widest flex items-center gap-2">
          <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
          Question {currentIdx + 1}
        </div>
        <h3 className="text-[17px] font-black text-slate-800 leading-snug">
          {question.question}
        </h3>
      </div>

      {/* OPTIONS */}
      <div className="grid gap-3">
        {question.options && Object.entries(question.options).map(([key, value]: [string, string]) => (
          <button
            key={key}
            disabled={showFeedback}
            onClick={() => setSelectedOption(key)}
            className={`group relative p-5 text-left rounded-[1.8rem] border-2 transition-all duration-300 transform active:scale-[0.98]
              ${selectedOption === key
                ? 'border-amber-500 bg-amber-500 text-white shadow-lg shadow-amber-100'
                : 'border-slate-100 bg-white hover:border-amber-200 text-slate-700'}`}
          >
            <div className="flex items-center gap-4">
              <span className={`w-9 h-9 rounded-2xl flex items-center justify-center text-[12px] font-black transition-colors
                ${selectedOption === key ? 'bg-white text-amber-600' : 'bg-slate-50 text-slate-400 group-hover:bg-amber-50'}`}>
                {key}
              </span>
              <span className="font-bold text-[15px]">{value}</span>
            </div>
          </button>
        ))}
      </div>

      {/* ACTION BUTTON */}
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
          className="w-full py-5 bg-slate-900 text-white rounded-[2.2rem] font-black uppercase text-[12px] shadow-xl hover:bg-black transition-all flex items-center justify-center gap-2"
        >
          Verify Comprehension <ChevronRight size={18} />
        </button>
      )}

      {/* HINT UI */}
      {showHint && !showFeedback && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="p-1 rounded-[2.5rem] bg-orange-500 shadow-lg shadow-orange-100">
            <div className="bg-white p-6 rounded-[2.4rem]">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-orange-100 text-orange-600 rounded-xl">
                  <Lightbulb size={20} />
                </div>
                <div className="font-black text-[12px] uppercase tracking-tighter text-orange-600">
                  Not quite! Here is a hint:
                </div>
              </div>
              <div className="p-4 bg-orange-50 border-orange-100 border-2 rounded-[1.8rem] text-[13px] font-bold text-orange-900 italic leading-relaxed">
                <p>{question.hint || "Odaklanmanız gereken farklı bir detay olabilir. Metni tekrar gözden geçirin."}</p>
                {question.quote && (
                  <div className="mt-3 p-3 bg-white rounded-xl border border-orange-100 text-[12px] text-orange-800 font-medium shadow-sm">
                    <span className="text-[10px] font-black uppercase text-orange-400 block mb-1">Passage Quote</span>
                    &quot;{question.quote}&quot;
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                setShowHint(false);
                setSelectedOption(null);
              }}
              className="w-full bg-slate-900 text-white py-4 rounded-[2.2rem] font-black uppercase text-[11px] shadow-xl active:scale-95 transition-all tracking-widest flex items-center justify-center gap-2"
            >
              <RefreshCw size={16} /> Try Again
            </button>
            <button
              onClick={() => {
                setShowHint(false);
                setShowFeedback(true);
              }}
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
          <div className={`p-1 rounded-[2.5rem] ${selectedOption === question.correct ? 'bg-amber-500' : 'bg-rose-500'}`}>
            <div className="bg-white p-6 rounded-[2.4rem]">
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-xl ${selectedOption === question.correct ? 'bg-amber-100 text-amber-600' : 'bg-rose-100 text-rose-600'}`}>
                  <Lightbulb size={20} />
                </div>
                <div className="font-black text-[12px] uppercase tracking-tighter">
                  Result: <span className={selectedOption === (question.correct_answer || question.correct) ? 'text-amber-600' : 'text-rose-600'}>
                    {selectedOption === (question.correct_answer || question.correct) ? 'INSIGHTFUL' : 'MISINTERPRETED'}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                {renderExplanation(question.explanation, question.feedback)}
              </div>
            </div>
          </div>

          <button
            onClick={handleNext}
            className="w-full bg-slate-900 text-white py-5 rounded-[2.2rem] font-black uppercase text-[12px] shadow-xl active:scale-95 transition-all tracking-widest"
          >
            {currentIdx < questions.length - 1 ? 'Next Question' : 'Finish Lab Session'}
          </button>
        </div>
      )}
    </div>
  );
}