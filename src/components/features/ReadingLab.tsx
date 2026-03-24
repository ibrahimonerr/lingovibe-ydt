"use client";
import React from 'react';
import { BookOpen, Target, Lightbulb, ChevronRight, Maximize2, Minimize2, Sparkles, RefreshCw } from 'lucide-react';
import ExplanationRenderer from '@/components/features/ExplanationRenderer';

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

  const { recordAnswer, isGuestMode, guestDailyCompletedLabs } = useAppStore();
  if (!questions || !questions[currentIdx]) return null;
  const question = questions[currentIdx];


  const renderPassage = () => {
    if (!readingPassage) return null;

    // Highlight both __N__ and (N) blank formats
    // Use a non-global regex for split (split handles /g internally)
    const blankSplitRegex = /(__\d+__|(?<!\w)\(\d+\)(?!\w))/g;
    // Separate non-global regex for testing individual parts (avoids lastIndex bug)
    const blankTestRegex = /^__\d+__$|^\(\d+\)$/;

    const parts = readingPassage.split(blankSplitRegex);

    // If hint or feedback is active, we also want to highlight the quote in the passage
    let quoteRegex: RegExp | null = null;
    if ((showHint || showFeedback) && question.quote) {
      // Split quote into alphanumeric words (ignoring all punctuation, emojis, extra spaces, quotes, etc.)
      const words = question.quote.trim().split(/[^a-zA-Z0-9çğıöşüÇĞİÖŞÜ]+/);
      const validWords = words.filter(w => w.length > 0);
      
      if (validWords.length > 0) {
        // Re-join words allowing ANY non-alphanumeric characters (like newlines, commas, smart quotes) between them
        const flexibleQuote = validWords
          .map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
          .join('[^a-zA-Z0-9çğıöşüÇĞİÖŞÜ]+');
          
        try {
          quoteRegex = new RegExp(`(${flexibleQuote})`, 'i');
        } catch (e) {
          console.error("Invalid regex for quote:", flexibleQuote);
        }
      }
    }

    return (
      <>
        {parts.map((part: string, i: number) => {
          if (blankTestRegex.test(part)) {
            // Extract the number from __N__ or (N)
            const num = part.replace(/__/g, '').replace(/[()]/g, '');
            return (
              <span
                key={i}
                className="inline-flex items-center justify-center bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 border-2 border-amber-400 dark:border-amber-800 rounded-lg px-2 py-0.5 mx-1 font-black text-[15px] shadow-sm"
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
                      <mark key={j} className="bg-orange-200 dark:bg-orange-900/60 text-orange-900 dark:text-orange-200 px-1 rounded-sm mx-0.5 shadow-sm animate-pulse font-bold underline decoration-wavy decoration-orange-400 dark:decoration-orange-700 underline-offset-4">
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
    <div className="space-y-4 animate-in slide-in-from-right-8 duration-500 pb-10">
      {/* READING PASSAGE CARD */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-[2.5rem] blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
        <div className="relative bg-white dark:bg-slate-900 border-2 border-amber-50 dark:border-amber-900/30 rounded-[2.5rem] shadow-xl overflow-hidden transition-all duration-500">
          <div className="bg-amber-500 dark:bg-amber-600 p-4 flex justify-between items-center">
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
            <p className="text-[15px] font-medium leading-relaxed text-slate-700 dark:text-slate-300 italic first-letter:text-4xl first-letter:font-black first-letter:text-amber-500 dark:first-letter:text-amber-400 first-letter:mr-1 whitespace-pre-wrap">
              {renderPassage()}
            </p>
          </div>

          {!isTextExpanded && (
            <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-white dark:from-slate-900 to-transparent pointer-events-none" />
          )}
        </div>
      </div>

      {/* QUESTION SECTION */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-[1.8rem] border-2 border-slate-50 dark:border-slate-800/50 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5">
          <Target size={60} className="text-amber-500 dark:text-amber-400" />
        </div>
        <div className="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase mb-1 tracking-widest flex items-center gap-2">
          <span className="w-2 h-2 bg-amber-500 dark:bg-amber-400 rounded-full animate-pulse" />
          Question {currentIdx + 1}
        </div>
        <h3 className="text-[16px] font-black text-slate-800 dark:text-slate-100 leading-snug">
          {question.question}
        </h3>
      </div>

      {/* OPTIONS */}
      <div className="grid gap-2">
        {question.options && Object.entries(question.options).map(([key, value]: [string, string]) => (
          <button
            key={key}
            disabled={showFeedback}
            onClick={() => setSelectedOption(key)}
            className={`group relative p-3.5 text-left rounded-[1.2rem] border-2 transition-all duration-300 transform active:scale-[0.98]
              ${selectedOption === key
                ? 'border-amber-500 bg-amber-500 text-white shadow-lg shadow-amber-100 dark:shadow-none'
                : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-amber-200 dark:hover:border-amber-800 text-slate-700 dark:text-slate-300'}`}
          >
            <div className="flex items-center gap-3">
              <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-[11px] font-black transition-colors
                ${selectedOption === key ? 'bg-white text-amber-600' : 'bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 group-hover:bg-amber-50 dark:group-hover:bg-amber-900/20'}`}>
                {key}
              </span>
              <span className="font-bold text-[14px]">{value}</span>
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
          <div className="p-1 rounded-[2.5rem] bg-orange-500 shadow-lg shadow-orange-100 dark:shadow-none">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.4rem]">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 rounded-xl">
                  <Lightbulb size={20} />
                </div>
                <div className="font-black text-[12px] uppercase tracking-tighter text-orange-600 dark:text-orange-400">
                  Not quite! Here is a hint:
                </div>
              </div>
              <div className="p-4 bg-orange-50 dark:bg-orange-900/20 border-orange-100 dark:border-orange-800 border-2 rounded-[1.8rem] text-[13px] font-bold text-orange-900 dark:text-orange-200 italic leading-relaxed">
                <p>{question.hint || "Odaklanmanız gereken farklı bir detay olabilir. Metni tekrar gözden geçirin."}</p>
                {question.quote && (
                  <div className="mt-3 p-3 bg-white dark:bg-slate-800 rounded-xl border border-orange-100 dark:border-orange-700 text-[12px] text-orange-800 dark:text-orange-300 font-medium shadow-sm">
                    <span className="text-[10px] font-black uppercase text-orange-400 dark:text-orange-500 block mb-1">Passage Quote</span>
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
            <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.4rem]">
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-xl ${selectedOption === question.correct ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400' : 'bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400'}`}>
                  <Lightbulb size={20} />
                </div>
                <div className="font-black text-[12px] uppercase tracking-tighter dark:text-slate-200">
                  Result: <span className={selectedOption === (question.correct_answer || question.correct) ? 'text-amber-600 dark:text-amber-400' : 'text-rose-600 dark:text-rose-400'}>
                    {selectedOption === (question.correct_answer || question.correct) ? 'INSIGHTFUL' : 'MISINTERPRETED'}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <ExplanationRenderer explanation={question.explanation} feedback={question.feedback} theme="amber" />
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
      {/* GUEST SIGNUP PROMPT */}
      {isGuestMode && (
        <div className="p-4 rounded-[2rem] border-2 border-dashed bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800 animate-pulse mt-8">
          <div className="flex items-center gap-3">
            <Sparkles className="text-amber-500 dark:text-amber-400" size={20} />
            <div className="text-[12.5px] font-bold text-slate-700 dark:text-slate-300 leading-tight">
              {guestDailyCompletedLabs.includes('reading') 
                ? "Günlük demo hakkını bitirdin! Tüm okuma parçalarına ve 1000'lerce soruya erişmek için giriş yap."
                : "Seviyeni korumak ve ilerlemeni kaydetmek için ücretsiz üye ol!"}
            </div>
            <button 
              onClick={() => useAppStore.getState().setGuestMode(false)}
              className="ml-auto px-4 py-2 rounded-xl text-[10px] font-black uppercase text-white bg-amber-600 dark:bg-amber-700 shadow-lg shadow-amber-500/20"
            >
              Sign Up
            </button>
          </div>
        </div>
      )}
    </div>
  );
}