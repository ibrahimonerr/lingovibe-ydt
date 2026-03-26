"use client";
import React from 'react';
import { BookOpen, Target, Lightbulb, ChevronRight, Maximize2, Minimize2, Sparkles, RefreshCw } from 'lucide-react';
import ExplanationRenderer from '@/components/features/ExplanationRenderer';

import { Question, Feedback } from '@/types';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { useAppStore } from '@/store/useAppStore';

export default function ReadingLab({
  questions, currentIdx, readingPassage, canCollapse,
  handleNext, selectedOption, setSelectedOption, showFeedback, setShowFeedback,
  showHint, setShowHint, theme = 'amber'
}: {
  questions: Question[],
  currentIdx: number,
  readingPassage: string,
  handleNext: () => void,
  selectedOption: string | null,
  setSelectedOption: (v: string | null) => void,
  showFeedback: boolean,
  setShowFeedback: (v: boolean) => void,
  showHint: boolean,
  setShowHint: (v: boolean) => void,
  theme?: 'amber' | 'emerald' | 'violet',
  canCollapse?: boolean
}) {
  const [isTextExpanded, setIsTextExpanded] = React.useState(true);

  const [forceShowAnalysis, setForceShowAnalysis] = React.useState(false);
  const { recordAnswer, isGuestMode, guestDailyCompletedLabs } = useAppStore();

  if (!questions || !questions[currentIdx]) return null;
  const question = questions[currentIdx];
  const isCorrect = selectedOption === (question.correct_answer || question.correct);
  const hintText = (question.feedback as any)?.hint || question.hint || "Odaklanmanız gereken farklı bir detay olabilir. Metni tekrar gözden geçirin.";

  // Theme-aware styles
  const themeStyles = {
    amber: {
      bg: 'bg-amber-500',
      bgDark: 'dark:bg-amber-600',
      text: 'text-amber-600',
      textDark: 'dark:text-amber-400',
      border: 'border-amber-50',
      borderDark: 'dark:border-amber-900/30',
      lightBg: 'bg-amber-50',
      lightBgDark: 'dark:bg-amber-900/20',
      buttonBorder: 'border-amber-500',
      buttonBg: 'bg-amber-500',
      icon: 'text-amber-500',
      badge: 'bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 border-amber-400 dark:border-amber-800'
    },
    emerald: {
      bg: 'bg-emerald-500',
      bgDark: 'dark:bg-emerald-600',
      text: 'text-emerald-600',
      textDark: 'dark:text-emerald-400',
      border: 'border-emerald-50',
      borderDark: 'dark:border-emerald-900/30',
      lightBg: 'bg-emerald-50',
      lightBgDark: 'dark:bg-emerald-900/20',
      buttonBorder: 'border-emerald-500',
      buttonBg: 'bg-emerald-500',
      icon: 'text-emerald-500',
      badge: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 border-emerald-400 dark:border-emerald-800'
    },
    violet: {
      bg: 'bg-violet-500',
      bgDark: 'dark:bg-violet-600',
      text: 'text-violet-600',
      textDark: 'dark:text-violet-400',
      border: 'border-violet-50',
      borderDark: 'dark:border-violet-900/30',
      lightBg: 'bg-violet-50',
      lightBgDark: 'dark:bg-violet-900/20',
      buttonBorder: 'border-violet-500',
      buttonBg: 'bg-violet-500',
      icon: 'text-violet-500',
      badge: 'bg-violet-100 dark:bg-violet-900/40 text-violet-800 dark:text-violet-300 border-violet-400 dark:border-violet-800'
    }
  }[theme];

  const renderPassage = () => {
    if (!readingPassage) return null;

    const blankSplitRegex = /(__\d+__|(?<!\w)\(\d+\)(?!\w)|\(\s*(?:VIII|VII|VI|III|II|IV|V|I)\s*\))/g;
    const blankTestRegex = /^__\d+__$|^\(\d+\)$/;
    const romanNumeralRegex = /^\(\s*(?:VIII|VII|VI|III|II|IV|V|I)\s*\)$/i;
    const parts = readingPassage.split(blankSplitRegex);

    let quoteRegex: RegExp | null = null;
    if ((showHint || showFeedback) && question.quote) {
      const words = question.quote.trim().split(/[^a-zA-Z0-9çğıöşüÇĞİÖŞÜ]+/);
      const validWords = words.filter(w => w.length > 0);
      
      if (validWords.length > 0) {
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

    let blankIndex = 0;
    return (
      <>
        {parts.map((part: string, i: number) => {
          if (blankTestRegex.test(part)) {
            blankIndex++;
            const displayNum = theme === 'violet' ? blankIndex : part.replace(/__/g, '').replace(/[()]/g, '');
            if (theme === 'violet') {
              return (
                <strong key={i} className="font-bold text-slate-900 dark:text-white mx-0.5 not-italic">
                  ({displayNum})
                </strong>
              );
            }
            return (
              <span
                key={i}
                className={`inline-flex items-center justify-center border-2 rounded-lg px-2 py-0.5 mx-1 font-black text-[15px] shadow-sm ${themeStyles.badge}`}
              >
                [{displayNum}]
              </span>
            );
          }

          if (romanNumeralRegex.test(part)) {
            return (
              <strong key={i} className="font-bold text-slate-900 dark:text-white mx-0.5 not-italic">
                {part}
              </strong>
            );
          }

          if (quoteRegex && quoteRegex.test(part)) {
            const subParts = part.split(quoteRegex);
            return (
              <span key={i}>
                {subParts.map((sp, j) => {
                  if (j % 2 === 1) {
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

          // Check for Roman Numeral (I), (II), (III)...
          const romanMatch = part.match(/^\(\s*(?:VIII|VII|VI|III|II|IV|V|I)\s*\)$/i);
          if (romanMatch) {
            return (
              <span key={i} className="font-bold text-slate-900 dark:text-white mx-0.5">
                {part}
              </span>
            );
          }

          return <span key={i}>{part}</span>;
        })}
      </>
    );
  };

  return (
    <div className="space-y-3 animate-in slide-in-from-right-8 duration-500 pb-10">
      {/* READING PASSAGE / QUESTION CAPSULE */}
      <div className="relative group">
        <div className={`absolute -inset-1 rounded-[2.5rem] blur opacity-10 group-hover:opacity-20 transition duration-1000 ${themeStyles.buttonBg}`}></div>
        <div className={`relative bg-white dark:bg-slate-900 border-2 rounded-[2.5rem] shadow-xl overflow-hidden transition-all duration-500 ${themeStyles.border} ${themeStyles.borderDark}`}>
          <div className={`p-3.5 flex justify-between items-center ${themeStyles.bg} ${themeStyles.bgDark}`}>
            <div className="flex items-center gap-2 text-white">
              {readingPassage ? <BookOpen size={16} /> : <Target size={16} />}
              <span className="text-[9px] font-black uppercase tracking-tighter">
                {readingPassage ? 'Reading Lab Passage' : `Question ${currentIdx + 1}`}
              </span>
            </div>
            {readingPassage && canCollapse && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsTextExpanded(!isTextExpanded);
                }}
                className="p-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-all z-20 outline-none"
              >
                {isTextExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
              </button>
            )}
          </div>

          <div className={`p-4 transition-all duration-500 overflow-y-auto custom-scrollbar ${isTextExpanded ? 'max-h-[300px]' : 'max-h-[75px] opacity-70'}`}>
            <p className={`text-[14px] font-medium leading-relaxed text-slate-700 dark:text-slate-300 italic whitespace-pre-wrap ${theme === 'amber' && !readingPassage?.trim().startsWith('(') ? 'first-letter:text-3xl first-letter:font-black first-letter:mr-1 first-letter:' + themeStyles.text : ''}`}>
              {readingPassage ? renderPassage() : question.question}
            </p>
          </div>

          {!isTextExpanded && (
            <div className="absolute bottom-0 inset-x-0 h-8 bg-gradient-to-t from-white dark:from-slate-900 to-transparent pointer-events-none" />
          )}
        </div>
      </div>

      {/* SECONDARY QUESTION SECTION (Only shown if there's a passage) */}
      {readingPassage && (
        <div className="bg-white dark:bg-slate-900 p-3.5 rounded-[1.8rem] border-2 border-slate-50 dark:border-slate-800/50 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-5">
            <Target size={40} className={themeStyles.icon} />
          </div>
          <div className={`text-[9px] font-black uppercase mb-0.5 tracking-widest flex items-center gap-2 ${themeStyles.text} ${themeStyles.textDark}`}>
            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${themeStyles.bg} ${themeStyles.bgDark}`} />
            Question {currentIdx + 1}
          </div>
          <h3 className="text-[14px] font-black text-slate-800 dark:text-slate-100 leading-snug">
            {question.question}
          </h3>
        </div>
      )}

      {/* OPTIONS */}
      <div className="grid gap-2">
        {question.options && Object.entries(question.options).map(([key, value]: [string, string]) => (
          <button
            key={key}
            disabled={showFeedback}
            onClick={() => setSelectedOption(key)}
            className={`group relative p-2.5 text-left rounded-[1.2rem] border-2 transition-all duration-300 transform active:scale-[0.98]
               ${selectedOption === key
                ? `${themeStyles.buttonBorder} ${themeStyles.buttonBg} text-white shadow-lg dark:shadow-none`
                : `border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:${themeStyles.buttonBorder}/30 dark:hover:${themeStyles.borderDark} text-slate-700 dark:text-slate-300`}`}
          >
            <div className="flex items-center gap-3">
              <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black transition-colors
                ${selectedOption === key ? 'bg-white ' + themeStyles.text : `bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 group-hover:${themeStyles.lightBg} dark:group-hover:${themeStyles.lightBgDark}`}`}>
                {key}
              </span>
              <span className="font-bold text-[13px]">{value}</span>
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
              <div className={`p-4 border-2 rounded-[1.8rem] text-[13px] font-bold italic leading-relaxed ${themeStyles.lightBg} ${themeStyles.lightBgDark} ${themeStyles.border} ${themeStyles.borderDark} ${themeStyles.text} ${themeStyles.textDark}`}>
                <p>{hintText}</p>
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
                setForceShowAnalysis(false);
              }}
              className="w-full bg-slate-900 text-white py-4 rounded-[2.2rem] font-black uppercase text-[11px] shadow-xl active:scale-95 transition-all tracking-widest flex items-center justify-center gap-2"
            >
              <RefreshCw size={16} /> Try Again
            </button>
            <button
              onClick={() => {
                setShowHint(false);
                setShowFeedback(true);
                setForceShowAnalysis(true); // Reveal button forces full analysis
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
          <div className={`p-1 rounded-[2.5rem] ${isCorrect ? themeStyles.buttonBg : 'bg-rose-500'}`}>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-[2.4rem]">
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-xl ${isCorrect ? `${themeStyles.lightBg} ${themeStyles.text} ${themeStyles.lightBgDark} ${themeStyles.textDark}` : 'bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400'}`}>
                  <Lightbulb size={20} />
                </div>
                <div className="font-black text-[12px] uppercase tracking-tighter dark:text-slate-200">
                  Result: <span className={isCorrect ? `${themeStyles.text} ${themeStyles.textDark}` : 'text-rose-600 dark:text-rose-400'}>
                    {isCorrect ? 'INSIGHTFUL' : 'MISINTERPRETED'}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                {(!isCorrect || forceShowAnalysis) ? (
                  <ExplanationRenderer 
                    explanation={question.explanation || ''} 
                    feedback={question.feedback} 
                    hint={hintText}
                    correctAnswer={question.correct_answer || question.correct}
                    correctAnswerText={question.options?.[question.correct_answer || question.correct]}
                    isCorrect={isCorrect}
                    theme={theme} 
                  />
                ) : (
                  <div className="py-4 text-center">
                    <p className={`text-[14px] font-bold mb-4 ${themeStyles.text} ${themeStyles.textDark}`}>
                      Harika seçim! Parçayı çok iyi analiz ettin.
                    </p>
                    <button 
                      onClick={() => setForceShowAnalysis(true)}
                      className={`text-[11px] font-black uppercase tracking-widest underline underline-offset-4 ${themeStyles.text} ${themeStyles.textDark}`}
                    >
                      Analizi Görüntüle
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              handleNext();
              setForceShowAnalysis(false);
            }}
            className="w-full bg-slate-900 text-white py-5 rounded-[2.2rem] font-black uppercase text-[12px] shadow-xl active:scale-95 transition-all tracking-widest"
          >
            {currentIdx < questions.length - 1 ? 'Next Question' : 'Finish Lab Session'}
          </button>
        </div>
      )}
      {/* GUEST SIGNUP PROMPT */}
       {isGuestMode && (
         <div className={`p-4 rounded-[2rem] border-2 border-dashed animate-pulse mt-8 ${themeStyles.lightBg} ${themeStyles.lightBgDark} ${themeStyles.border} ${themeStyles.borderDark}`}>
           <div className="flex items-center gap-3">
             <Sparkles className={themeStyles.icon} size={20} />
             <div className="text-[12.5px] font-bold text-slate-700 dark:text-slate-300 leading-tight">
               {guestDailyCompletedLabs.includes('reading') 
                 ? "Günlük demo hakkını bitirdin! Tüm okuma parçalarına ve 1000'lerce soruya erişmek için giriş yap."
                 : "Seviyeni korumak ve ilerlemeni kaydetmek için ücretsiz üye ol!"}
             </div>
             <button 
               onClick={() => useAppStore.getState().setGuestMode(false)}
               className={`ml-auto px-4 py-2 rounded-xl text-[10px] font-black uppercase text-white shadow-lg ${themeStyles.bg} ${themeStyles.bgDark}`}
             >
               Sign Up
             </button>
          </div>
        </div>
      )}
    </div>
  );
}