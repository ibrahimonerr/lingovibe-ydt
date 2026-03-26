import React, { useState } from 'react';
import { Sparkles, Skull, Lightbulb, ChevronRight, Split, Search, Copy, Flame, Scale, RotateCcw, Bookmark, Languages, Target } from 'lucide-react';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { useAppStore } from '@/store/useAppStore';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { createPortal } from 'react-dom';

export default function VocabLab({
  questions, currentIdx, vocabSubMode, handleNext, selectedOption, setSelectedOption, showFeedback, setShowFeedback, isFlipped, setIsFlipped, onSwipe
}: {
  questions: any[],
  currentIdx: number,
  vocabSubMode: string,
  handleNext: () => void,
  selectedOption: string | null,
  setSelectedOption: (v: string | null) => void,
  showFeedback: boolean,
  setShowFeedback: (v: boolean) => void,
  isFlipped?: boolean,
  setIsFlipped?: (v: boolean) => void,
  onSwipe?: (learned: boolean) => void
}) {

  const { recordAnswer, isGuestMode } = useAppStore();
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [wrongWords, setWrongWords] = useState<string[]>([]);

  // Motion values for swipe
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacityRepeat = useTransform(x, [-100, -50], [1, 0]);
  const opacityLearned = useTransform(x, [50, 100], [0, 1]);
  const bgOpacity = useTransform(x, [-150, 0, 150], [0.5, 0, 0.5]);
  const bgColor = useTransform(x, [-150, 0, 150], ["#ef4444", "#0f172a", "#10b981"]);

  if (!questions || !questions[currentIdx]) return null;
  const q = questions[currentIdx];

  // Helper to trigger haptics
  const triggerHaptics = async (success: boolean) => {
    try {
      if (success) {
        await Haptics.notification({ type: NotificationType.Success });
      } else {
        await Haptics.impact({ style: ImpactStyle.Medium });
      }
    } catch (e) {
      // Ignore if not on mobile
    }
  };

  const handleChoiceFinish = async (isCorrect: boolean, choice: string) => {
    if (showFeedback) return;
    setSelectedOption(choice);
    
    if (isCorrect) {
      setShowFeedback(true);
      setWrongWords([]);
      recordAnswer(true, false);
      await triggerHaptics(true);
    } else {
      if (!wrongWords.includes(choice)) {
        const nextWrongArr = [...wrongWords, choice];
        setWrongWords(nextWrongArr);
        recordAnswer(false, false);
        await triggerHaptics(false);
        if (nextWrongArr.length >= 3) {
          setShowFeedback(true);
        }
      }
    }
  };

  const handleWordClick = async (word: string, cleanWord: string) => {
    if (showFeedback) return;
    
    const correct = (q.correct_word || q.correct_synonym || q.correct_antonym || "").toLowerCase();
    const isCorrect = cleanWord.toLowerCase() === correct;
    
    if (isCorrect) {
      setSelectedWord(word);
      setShowFeedback(true);
      setWrongWords([]);
      recordAnswer(true, false);
      await triggerHaptics(true);
    } else {
      if (!wrongWords.includes(word)) {
        const nextWrongArr = [...wrongWords, word];
        setWrongWords(nextWrongArr);
        recordAnswer(false, false);
        await triggerHaptics(false);
        if (nextWrongArr.length >= 3) {
          setShowFeedback(true);
        }
      }
    }
  };

  const onNext = () => {
    setWrongWords([]);
    setSelectedWord(null);
    setSelectedOption(null);
    setShowFeedback(false);
    handleNext();
  };

  // --- RENDERERS ---

  const renderCardDetails = (explanation: string) => {
    if (!explanation) return null;
    const parts = explanation.split('|');
    return parts.map((p: string, i: number) => {
      const separatorIdx = p.indexOf(':');
      if (separatorIdx === -1) return null;
      const label = p.substring(0, separatorIdx).trim();
      const content = p.substring(separatorIdx + 1).trim();

      const styles: Record<string, { icon: React.ReactNode, color: string, bg: string }> = {
        "ANLAM": { icon: <Languages size={14} />, color: "text-indigo-400", bg: "bg-indigo-500/20" },
        "SYNONYM": { icon: <Target size={14} />, color: "text-emerald-400", bg: "bg-emerald-500/20" },
        "ANTONYM": { icon: <Skull size={14} />, color: "text-rose-400", bg: "bg-rose-500/20" },
        "MNEMONIC": { icon: <Sparkles size={14} />, color: "text-amber-400", bg: "bg-amber-500/20" },
        "CONFUSION": { icon: <Flame size={14} />, color: "text-orange-400", bg: "bg-orange-500/20" },
        "CONTEXT": { icon: <Search size={14} />, color: "text-blue-400", bg: "bg-blue-500/20" }
      };
      const style = styles[label] || { icon: <Bookmark size={14} />, color: "text-slate-400", bg: "bg-slate-500/20" };
      return (
        <div key={i} className={`p-2.5 rounded-2xl ${style.bg} border border-slate-100 dark:border-white/5 mb-1.5 last:mb-0`}>
          <div className={`flex items-center gap-1.5 ${style.color} text-[8px] font-black uppercase mb-1 tracking-wider`}>
            {style.icon} {label}
          </div>
          <div className="text-slate-800 dark:text-white font-bold text-[12px] leading-snug">{content}</div>
        </div>
      );
    });
  };

  const renderLoop = () => {
    return (
      <div className="min-h-[450px] flex flex-col items-center justify-center animate-in slide-in-from-bottom-10 duration-700 relative">
        {/* Swipe Overlays */}
        <motion.div 
            style={{ opacity: opacityLearned }}
            className="absolute top-10 right-10 z-[100] border-4 border-emerald-500 rounded-xl px-4 py-2 rotate-[15deg] pointer-events-none"
        >
            <span className="text-emerald-500 font-black text-2xl uppercase tracking-tighter italic">BİLİYORUM</span>
        </motion.div>

        <motion.div 
            style={{ opacity: opacityRepeat }}
            className="absolute top-10 left-10 z-[100] border-4 border-rose-500 rounded-xl px-4 py-2 rotate-[-15deg] pointer-events-none"
        >
            <span className="text-rose-500 font-black text-2xl uppercase tracking-tighter italic">TEKRAR</span>
        </motion.div>

        <motion.div
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          style={{ x, rotate }}
          onDragEnd={(_, info) => {
            if (info.offset.x > 100) {
              triggerHaptics(true);
              onSwipe?.(true);
            } else if (info.offset.x < -100) {
              triggerHaptics(false);
              onSwipe?.(false);
            }
          }}
          className="relative w-full h-[400px] preserve-3d cursor-grab active:cursor-grabbing"
        >
          <div
            onClick={() => setIsFlipped?.(!isFlipped)}
            className={`relative w-full h-full transition-all duration-700 preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}
            style={{ perspective: '1000px' }}
          >
            {/* Card Front */}
            <div className={`absolute inset-0 backface-hidden bg-white dark:bg-slate-900 rounded-[3.5rem] shadow-2xl flex flex-col items-center justify-center p-8 border-b-[12px] border-indigo-600 border-x border-t border-slate-100 dark:border-white/5 transition-opacity duration-300 ${isFlipped ? 'opacity-0' : 'opacity-100'}`}>
              <motion.div 
                style={{ backgroundColor: bgColor, opacity: bgOpacity }}
                className="absolute inset-0 rounded-[3.5rem] pointer-events-none z-0" 
              />
              <RotateCcw size={40} className="text-slate-200 dark:text-white/10 mb-8 relative z-10" />
              <div className="text-slate-900 dark:text-white text-[42px] font-black text-center italic uppercase tracking-tighter leading-none select-none relative z-10 drop-shadow-2xl">
                {q.question || q.word}
              </div>
              <div className="absolute bottom-14 text-[10px] font-black text-indigo-400/40 uppercase tracking-[0.5em] italic flex items-center gap-2">
                <ChevronRight size={14} className="animate-pulse" /> Tap to Reveal
              </div>
            </div>

            {/* Card Back */}
            <div className={`absolute inset-0 backface-hidden rotate-y-180 bg-white dark:bg-slate-950 rounded-[3.5rem] shadow-2xl flex flex-col px-6 py-5 border border-slate-100 dark:border-white/10 overflow-y-auto custom-scrollbar transition-opacity duration-300 ${isFlipped ? 'opacity-100' : 'opacity-0'}`}>
              <div className="text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4 flex items-center justify-center gap-2 bg-slate-50 dark:bg-white/5 py-2 rounded-full border border-slate-100 dark:border-white/5">
                <Sparkles size={14} /> Knowledge Crystal
              </div>
              <div className="space-y-1">
                {renderCardDetails(q.explanation)}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="mt-12 flex items-center gap-4 text-[11px] font-black text-slate-500 uppercase tracking-widest opacity-40">
            <span className="flex items-center gap-1.5"><ChevronRight className="rotate-180" size={14} /> Tekrar</span>
            <div className="w-1 h-1 rounded-full bg-slate-700" />
            <span className="flex items-center gap-1.5">Biliyorum <ChevronRight size={14} /></span>
        </div>

        <style jsx>{`
            .perspective-1000 { perspective: 1000px; }
            .preserve-3d { transform-style: preserve-3d; }
            .backface-hidden { backface-visibility: hidden; }
            .rotate-y-180 { transform: rotateY(180deg); }
        `}</style>
      </div>
    );
  };

  const renderMeaningShifter = () => {
    const paths = q.paths || { A: '', B: '' };
    const mainVerb = q.root_word || 'ACTION';

    return (
      <div className="space-y-4 animate-in slide-in-from-bottom-8 duration-700">
        <div className="p-6 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-white/5 shadow-xl text-center relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent" />
          <div className="text-[17px] font-bold leading-relaxed text-slate-700 dark:text-slate-300 italic px-2">
            {(q.sentence || q.question)?.split('___').map((part: string, i: number) => (
              <React.Fragment key={i}>
                {part}
                {i === 0 && (
                  <span className={`inline-block border-b-2 px-2 mx-1 min-w-[70px] transition-all duration-500 whitespace-nowrap ${
                    showFeedback 
                      ? (selectedOption === q.correct_path || wrongWords.length >= 3)
                        ? 'border-emerald-500 text-emerald-600 dark:text-emerald-400 font-black animate-bounce' 
                        : 'border-rose-500 text-rose-600 dark:text-rose-400 font-black'
                      : 'border-indigo-400 text-indigo-400 animate-pulse'
                  }`}>
                    {showFeedback ? `${q.root_word || ''} ${paths[q.correct_path as keyof typeof paths]}` : '____'}
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="relative py-4 flex flex-col items-center">
            <svg className="absolute top-[50px] left-0 w-full h-[100px] pointer-events-none" viewBox="0 0 400 100">
                <motion.path 
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    d="M 175 25 L 85 85" 
                    fill="none" 
                    stroke="url(#grad-left)" 
                    strokeWidth="4" 
                    strokeLinecap="round"
                    className={`${selectedOption === 'A' ? 'opacity-100' : 'opacity-20'}`}
                />
                <motion.path 
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    d="M 225 25 L 315 85" 
                    fill="none" 
                    stroke="url(#grad-right)" 
                    strokeWidth="4" 
                    strokeLinecap="round"
                    className={`${selectedOption === 'B' ? 'opacity-100' : 'opacity-20'}`}
                />
                <defs>
                   <linearGradient id="grad-left" x1="175" y1="25" x2="85" y2="85">
                      <stop offset="0%" stopColor="#4f46e5" />
                      <stop offset="100%" stopColor="#3b82f6" />
                   </linearGradient>
                   <linearGradient id="grad-right" x1="225" y1="25" x2="315" y2="85">
                      <stop offset="0%" stopColor="#4f46e5" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                   </linearGradient>
                </defs>
            </svg>

            <motion.div 
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="relative z-20 px-8 py-4 rounded-[1.8rem] bg-indigo-600 shadow-[0_20px_50px_rgba(79,70,229,0.35)] flex items-center justify-center text-white border-4 border-white dark:border-slate-800"
            >
                <div className="text-center">
                    <span className="text-2xl font-black italic tracking-tighter uppercase drop-shadow-md">{mainVerb}</span>
                </div>
            </motion.div>

            <div className="mt-10 flex justify-between w-full px-4 gap-6 relative z-30">
                {['A', 'B'].map((key) => {
                    const isIncorrect = selectedOption === key && key !== q.correct_path;
                    const isCorrect = (selectedOption === key && key === q.correct_path) || (showFeedback && key === q.correct_path);
                    
                    return (
                        <motion.button
                            key={key}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleChoiceFinish(key === q.correct_path, key)}
                            className={`group relative flex-1 p-8 rounded-[2.5rem] border-2 transition-all duration-300 flex flex-col items-center shadow-xl ${
                                isCorrect
                                    ? 'bg-emerald-500 border-emerald-400 text-white neon-glow'
                                    : isIncorrect
                                        ? 'bg-rose-500 border-rose-400 text-white animate-shake shadow-rose-500/30'
                                        : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-white/5 hover:border-indigo-400'
                            }`}
                        >
                            <span className={`text-[10px] font-black uppercase tracking-[0.2em] mb-1 ${selectedOption === key ? 'text-white/70' : 'text-slate-400'}`}>Path {key}</span>
                            <span className="text-xl font-black italic tracking-tighter uppercase">{paths[key as keyof typeof paths]}</span>
                        </motion.button>
                    );
                })}
            </div>
        </div>
      </div>
    );
  };

  const renderWordHunt = () => {
    const passage = q.passage || "";
    const words = passage.split(/\s+/);
    const targetInfo = q.target_definition || q.target_word;
    const isAntonym = vocabSubMode === 'antonym_hunt';
    const mainColor = isAntonym ? 'from-rose-500 to-pink-600' : 'from-indigo-500 to-blue-600';
    const shadowColor = isAntonym ? 'shadow-rose-500/30' : 'shadow-indigo-500/30';
    
    const instructionText = vocabSubMode === 'definition_hunt' 
      ? 'Find the word that means:' 
      : vocabSubMode === 'synonym_hunt' 
        ? 'Find the synonym of:' 
        : 'Find the antonym of:';

    const isDefinition = vocabSubMode === 'definition_hunt';
    const targetFontSize = isDefinition ? 'text-[16px] font-bold leading-relaxed' : 'text-2xl font-black italic tracking-tighter uppercase';

    return (
      <div className="space-y-4 animate-in slide-in-from-bottom-8 duration-700">
        <div className={`p-4 bg-gradient-to-br ${mainColor} rounded-[2rem] text-white shadow-2xl ${shadowColor} relative overflow-hidden group flex flex-col items-center text-center px-8`}>
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
          <span className="text-[9px] font-black uppercase tracking-[0.3em] opacity-70 mb-2 relative z-10">Challenge Objective</span>
          <div className="relative z-10 space-y-1">
            <p className="text-[14px] font-bold opacity-90 leading-tight tracking-tight">{instructionText}</p>
            <h3 className={`${targetFontSize} drop-shadow-lg`}>
              {isDefinition ? (
                <span className="opacity-100 italic tracking-tight">"{targetInfo}"</span>
              ) : (
                `"${targetInfo}"`
              )}
            </h3>
          </div>
        </div>
  
        <div className="p-6 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-2xl leading-[1.8] text-[16px] font-medium text-slate-700 dark:text-slate-300 relative text-justify tracking-tight overflow-hidden">
          <div className="absolute top-2 right-4 opacity-5"><Sparkles size={32} /></div>
          {words.map((word: string, i: number) => {
            const displayWord = word.replace(/\*\*/g, "");
            const cleanWord = displayWord.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
            const correct = (q.correct_word || q.correct_synonym || q.correct_antonym || "").toLowerCase();
            const isCorrect = cleanWord.toLowerCase() === correct && showFeedback;
            const isLatestChosen = selectedWord === word;
            const isTarget = isAntonym && q.target_word && cleanWord.toLowerCase() === q.target_word.toLowerCase() && showFeedback;
            const isMistake = wrongWords.includes(word);

            return (
              <motion.span
                key={i}
                whileHover={{ scale: 1.05, y: -2 }}
                onClick={() => handleWordClick(word, cleanWord)}
                className={`inline-block px-1.5 py-0.5 mx-0.5 rounded-xl cursor-pointer transition-all duration-300 ${
                  isCorrect 
                    ? `bg-emerald-500 text-white font-black shadow-lg neon-glow scale-110 z-20 relative px-3` 
                    : isTarget
                      ? `bg-amber-500 text-white font-black shadow-lg shadow-amber-500/40 animate-pulse px-3`
                      : (isLatestChosen && !showFeedback && cleanWord.toLowerCase() === correct)
                        ? 'bg-emerald-500/20 text-emerald-600 font-bold'
                        : isMistake 
                          ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/40 animate-shake px-2' 
                          : 'hover:bg-indigo-50 dark:hover:bg-white/5 hover:text-indigo-600 dark:hover:text-indigo-400 hover:shadow-sm'
                }`}
              >
                {displayWord}
              </motion.span>
            );
          })}
        </div>
      </div>
    );
  };

  const renderFeedback = () => {
    let feedbackLogic = q.feedback?.logic || q.logic;
    if (vocabSubMode === 'meaning_shifter') {
      feedbackLogic = q.feedback?.[selectedOption || 'A'] || feedbackLogic;
    }
    
    const hint = q.hint || q.feedback?.hint;
    const pitfall = q.pitfall || q.feedback?.pitfall;
    
    let targetWord = "";
    if (vocabSubMode === 'meaning_shifter') {
      targetWord = `${q.root_word || ''} ${q.paths?.[q.correct_path as keyof typeof q.paths] || ''}`;
    } else {
      targetWord = q.correct_word || q.correct_synonym || q.correct_antonym || q.target_word || "";
    }

    const modalContent = (
      <AnimatePresence>
        {showFeedback && (
          <div className="fixed inset-0 z-[2000] flex items-end sm:items-center justify-center bg-slate-200/50 dark:bg-slate-950/90 backdrop-blur-xl pointer-events-auto">
            <motion.div 
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "100%", opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="w-full max-w-sm space-y-6 px-6 pb-12 sm:pb-6"
            >
                <div className="p-8 rounded-[3rem] sm:rounded-[4rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-white/5 shadow-[0_40px_120px_rgba(0,0,0,0.6)] relative overflow-hidden">
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl" />
                    <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-fuchsia-500/5 rounded-full blur-3xl" />

                    <div className="text-center mb-8 relative z-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600 text-white mb-4 shadow-xl shadow-indigo-500/30">
                            <Lightbulb size={32} />
                        </div>
                        <div className="space-y-1">
                            <span className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.3em] block">KELİME ANALİZİ</span>
                            <h2 className="text-3xl font-black italic tracking-tighter bg-gradient-to-r from-indigo-500 to-violet-600 bg-clip-text text-transparent uppercase py-1 leading-tight">
                                {targetWord}
                            </h2>
                        </div>
                    </div>

                    {feedbackLogic && (
                      <div className="p-5 rounded-[2rem] bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-white/5 mb-6 text-center relative z-10">
                          <p className="text-[14px] text-slate-700 dark:text-slate-300 font-bold leading-relaxed italic">"{feedbackLogic}"</p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 gap-4 relative z-10">
                        {hint && (
                            <div className="p-5 rounded-[1.8rem] bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20">
                                <div className="flex items-center gap-2 text-amber-600 text-[10px] font-black uppercase tracking-widest mb-1">
                                    <Sparkles size={16} /> Expert Hint
                                </div>
                                <p className="text-slate-700 dark:text-slate-300 text-[13px] font-bold leading-snug">{hint}</p>
                            </div>
                        )}
                        {pitfall && (
                            <div className="p-5 rounded-[1.8rem] bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/20">
                                <div className="flex items-center gap-2 text-rose-600 text-[10px] font-black uppercase tracking-widest mb-1">
                                    <Skull size={16} /> Avoid The Pitfall
                                </div>
                                <p className="text-slate-700 dark:text-slate-300 text-[13px] font-bold leading-snug">{pitfall}</p>
                            </div>
                        )}
                    </div>
                </div>

                <button
                    onClick={onNext}
                    className="group relative w-full overflow-hidden py-6 bg-indigo-600 text-white rounded-[2.5rem] font-black uppercase text-[15px] tracking-[0.2em] shadow-2xl active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    {currentIdx < questions.length - 1 ? 'Sonraki Soru' : 'Tamamla'}
                    <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    );

    if (typeof document !== 'undefined') {
      return createPortal(modalContent, document.body);
    }
    return null;
  };

  return (
    <div className="max-w-md mx-auto">
      {vocabSubMode === 'loop' 
        ? renderLoop() 
        : vocabSubMode === 'meaning_shifter' 
          ? renderMeaningShifter() 
          : renderWordHunt()}

      {vocabSubMode !== 'loop' && renderFeedback()}

      {isGuestMode && (
        <div className="p-5 rounded-[2.5rem] bg-gradient-to-br from-indigo-50 to-white dark:from-slate-900 dark:to-slate-800 border border-slate-200 dark:border-white/10 shadow-2xl mt-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 blur-3xl" />
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow-lg">
              <Sparkles size={24} />
            </div>
            <div className="space-y-0.5">
              <p className="text-[12px] font-black text-slate-800 dark:text-white uppercase tracking-tight">Ücretsiz Üye Ol</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium leading-tight">İlerlemeni kaydet ve binlerce soruya sınırsız eriş.</p>
            </div>
            <button 
              onClick={() => useAppStore.getState().setGuestMode(false)}
              className="ml-auto px-5 py-2.5 rounded-xl text-[11px] font-black uppercase text-white bg-indigo-600 shadow-xl"
            >
              Kayıt Ol
            </button>
          </div>
        </div>
      )}
    </div>
  );
}