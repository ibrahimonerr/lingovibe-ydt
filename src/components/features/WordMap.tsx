"use client";
import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, RotateCcw, Brain, Trophy, Flame, Share2, X, CheckCircle2 } from 'lucide-react';
import Confetti from '@/components/Confetti';
import { getDailyWords, generateWordMapFromWords, WordNode, Connection } from '@/lib/wordmapGenerator';
import {
  getDailySession,
  markFlashcardsComplete,
  saveMapResult,
  calculateScore,
  getStreak,
  getToday,
  recordAttempt,
} from '@/lib/wordmapStorage';
import { YDTVocab } from '@/data/ydtVocab';

// ─────────────────────────────────────────────
// PHASE 1: FLASHCARD
// ─────────────────────────────────────────────
function FlashcardPhase({ words, onComplete }: { words: YDTVocab[]; onComplete: () => void }) {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [seen, setSeen] = useState(0);

  const word = words[idx];
  const progress = ((idx + 1) / words.length) * 100;
  const isLastCard = idx === words.length - 1;

  const next = () => {
    if (!isLastCard) {
      setSeen(s => Math.max(s, idx + 1));
      setIdx(i => i + 1);
      setFlipped(false);
    }
  };

  const prev = () => {
    if (idx > 0) { setIdx(i => i - 1); setFlipped(false); }
  };

  // Show Start button when user has reached the final card
  const allSeen = isLastCard;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between border-b border-slate-700/50">
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-rose-400">Daily Flashcards</p>
          <p className="text-[11px] font-bold text-slate-300">Swipe through, then play</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black text-slate-400">{idx + 1} / {words.length}</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-slate-800">
        <div
          className="h-full bg-gradient-to-r from-rose-500 to-indigo-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Card */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 py-6">
        <div
          className="w-full cursor-pointer"
          style={{ perspective: '1000px' }}
          onClick={() => setFlipped(f => !f)}
        >
          <div
            className="relative w-full transition-transform duration-500"
            style={{
              transformStyle: 'preserve-3d',
              transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
              minHeight: '220px',
            }}
          >
            {/* FRONT */}
            <div
              className="absolute inset-0 bg-slate-800 rounded-3xl border border-slate-700 flex flex-col items-center justify-center p-6 text-center"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <p className="text-2xl font-black tracking-tight text-white mb-3">{word.word}</p>
              <p className="text-[10px] text-slate-400 italic leading-relaxed">&quot;{word.context}&quot;</p>
              <p className="mt-4 text-[8px] font-black text-slate-600 uppercase tracking-widest">Tap to flip</p>
            </div>

            {/* BACK */}
            <div
              className="absolute inset-0 bg-indigo-950 rounded-3xl border border-indigo-800/60 flex flex-col items-start justify-center p-6 gap-3"
              style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
            >
              <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest">Türkçe Anlam</p>
              <p className="text-[15px] font-black text-white leading-tight">{word.meaning}</p>

              {word.synonyms.length > 0 && (
                <div>
                  <p className="text-[9px] font-black text-emerald-400 uppercase mb-1 tracking-widest">Synonyms</p>
                  <div className="flex flex-wrap gap-1">
                    {word.synonyms.slice(0, 3).map(s => (
                      <span key={s} className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded-full text-[9px] font-black border border-emerald-500/30">{s}</span>
                    ))}
                  </div>
                </div>
              )}

              {word.antonyms.length > 0 && (
                <div>
                  <p className="text-[9px] font-black text-rose-400 uppercase mb-1 tracking-widest">Antonyms</p>
                  <div className="flex flex-wrap gap-1">
                    {word.antonyms.slice(0, 2).map(a => (
                      <span key={a} className="px-2 py-0.5 bg-rose-500/20 text-rose-300 rounded-full text-[9px] font-black border border-rose-500/30">{a}</span>
                    ))}
                  </div>
                </div>
              )}

              {word.mnemonic && (
                <p className="text-[9px] text-slate-400 italic leading-relaxed border-t border-slate-700 pt-2 mt-1">💡 {word.mnemonic}</p>
              )}
            </div>
          </div>
        </div>

        {/* Nav */}
        <div className="flex items-center gap-3 mt-5 w-full">
          <button
            onClick={prev}
            disabled={idx === 0}
            className="p-3 rounded-2xl bg-slate-800 text-slate-400 disabled:opacity-30 active:scale-95 transition-all"
          >
            <RotateCcw size={16} />
          </button>
          <button
            onClick={next}
            disabled={idx >= words.length - 1}
            className="flex-1 py-3 rounded-2xl bg-slate-700 text-slate-200 font-black text-[11px] uppercase active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-30"
          >
            Next <ChevronRight size={14} />
          </button>
        </div>

        {allSeen && (
          <button
            onClick={onComplete}
            className="w-full mt-3 py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-indigo-600 text-white font-black text-[12px] uppercase active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2 animate-in slide-in-from-bottom-4 duration-500"
          >
            Start Word Map <Brain size={16} />
          </button>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// PHASE 2: WORDMAP
// ─────────────────────────────────────────────
function WordMapPhase({
  wordNodes,
  connections,
  onComplete,
}: {
  wordNodes: WordNode[];
  connections: Connection[];
  onComplete: (score: number, errors: number) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const [solvedPairIds, setSolvedPairIds] = useState<string[]>([]);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [flashRed, setFlashRed] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [failed, setFailed] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const maxLives = 3;
  const livesLeft = maxLives - wrongAttempts;
  const totalPairs = connections.length;

  useEffect(() => {
    if (solvedPairIds.length === totalPairs && totalPairs > 0) {
      const score = calculateScore(wrongAttempts);
      setIsCompleted(true);
      setTimeout(() => { setShowResult(true); onComplete(score, wrongAttempts); }, 800);
    }
  }, [solvedPairIds, totalPairs, wrongAttempts, onComplete]);

  useEffect(() => {
    if (wrongAttempts >= maxLives) {
      setFailed(true);
      setTimeout(() => setShowResult(true), 600);
    }
  }, [wrongAttempts]);

  const handleWordClick = (node: WordNode) => {
    if (isCompleted || failed) return;
    if (node.pairId && solvedPairIds.includes(node.pairId)) return;

    if (selected === null) {
      if (node.pairId === null) {
        // Red herring tap — shake
        setFlashRed(node.id);
        setTimeout(() => setFlashRed(null), 500);
        return;
      }
      setSelected(node.id);
    } else {
      if (selected === node.id) { setSelected(null); return; }

      const firstNode = wordNodes.find(w => w.id === selected);
      if (!firstNode) { setSelected(null); return; }

      if (firstNode.pairId && firstNode.pairId === node.pairId) {
        // ✅ Correct
        recordAttempt(node.relationshipType || 'synonym', true);
        setSolvedPairIds(prev => [...prev, firstNode.pairId!]);
        setSelected(null);
      } else {
        // ❌ Wrong
        if (node.relationshipType) recordAttempt(node.relationshipType, false);
        else if (firstNode.relationshipType) recordAttempt(firstNode.relationshipType, false);
        setFlashRed(node.id);
        setTimeout(() => setFlashRed(null), 600);
        setWrongAttempts(w => w + 1);
        setSelected(null);
      }
    }
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* Conffeti on success */}
      {isCompleted && <Confetti />}

      {/* Header */}
      <div className="px-5 py-3 flex items-center justify-between border-b border-slate-700/50">
        <div>
          <p className="text-[9px] font-black uppercase tracking-[0.2em] text-rose-400 flex items-center gap-1">
            <Brain size={8} /> Word Map
          </p>
          <p className="text-[10px] text-slate-400">Connect synonym & antonym pairs</p>
        </div>
        {/* Lives */}
        <div className="flex gap-1.5 items-center">
          {Array.from({ length: maxLives }).map((_, i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-500 ${i < livesLeft
                ? 'bg-rose-500 shadow-[0_0_8px_rgba(239,68,68,0.7)]'
                : 'bg-slate-700'
                }`}
            />
          ))}
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 relative overflow-hidden bg-slate-900/40">
        {wordNodes.map(node => {
          const isSolved = node.pairId && solvedPairIds.includes(node.pairId);
          const isSelected = selected === node.id;
          const isFlashing = flashRed === node.id;
          const isRedHerring = node.pairId === null;

          return (
            <button
              key={node.id}
              onClick={() => handleWordClick(node)}
              style={{ top: `${node.pos.y}%`, left: `${node.pos.x}%`, transform: 'translate(-50%, -50%)' }}
              className={`absolute px-3 py-2 rounded-xl text-[10px] font-black transition-all duration-300 whitespace-nowrap
                ${isSolved
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 opacity-30 pointer-events-none scale-90'
                  : isFlashing
                    ? 'bg-red-600 text-white border-2 border-red-400 scale-105'
                    : isSelected
                      ? 'bg-rose-600 text-white border-2 border-rose-400 scale-110 z-20 shadow-[0_0_16px_rgba(244,63,94,0.5)]'
                      : isRedHerring
                        ? 'bg-slate-800/60 text-slate-500 border border-slate-700 hover:border-slate-600 italic'
                        : 'bg-slate-800/80 text-slate-200 border border-slate-700 hover:border-indigo-500/50 active:scale-95'
                }`}
            >
              {node.text}
              {isSolved && <CheckCircle2 size={9} className="absolute -top-1 -right-1 text-emerald-400 bg-slate-900 rounded-full" />}
            </button>
          );
        })}
      </div>

      {/* Progress footer */}
      <div className="px-5 py-3 border-t border-slate-700/50 text-center">
        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
          {isCompleted ? 'ALL PAIRS FOUND!' : failed ? 'GAME OVER' : `${solvedPairIds.length} / ${totalPairs} PAIRS`}
        </p>
      </div>

      {/* Results Panel */}
      {showResult && (
        <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-xl flex flex-col z-50 animate-in slide-in-from-bottom-4 duration-500">
          <div className="flex-1 overflow-y-auto p-6">
            {/* Score badge */}
            <div className="text-center mb-6">
              <div className={`inline-flex p-4 rounded-3xl mb-3 ${isCompleted ? 'bg-indigo-600' : 'bg-slate-700'}`}>
                {isCompleted ? <Trophy size={36} className="text-white" /> : <X size={36} className="text-slate-400" />}
              </div>
              <h3 className="text-xl font-black italic uppercase tracking-tight">
                {isCompleted ? 'Map Decoded!' : 'Map Collapsed'}
              </h3>
              {isCompleted && (
                <div className="flex items-center justify-center gap-3 mt-2">
                  <span className="text-2xl font-black text-indigo-400">{calculateScore(wrongAttempts)}</span>
                  <span className="text-[10px] text-slate-500 font-black uppercase">pts</span>
                  <span className="flex items-center gap-1 text-[11px] font-black text-amber-400">
                    <Flame size={12} /> {getStreak()} day streak
                  </span>
                </div>
              )}
            </div>

            {/* Connection reveals */}
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3">Connections Revealed</p>
            <div className="space-y-2">
              {connections.map((c, i) => (
                <div
                  key={i}
                  className="bg-slate-800/80 rounded-2xl p-3 border border-slate-700 animate-in slide-in-from-bottom-2"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-black text-white">{c.wordA} ↔ {c.wordB}</span>
                    <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${c.type === 'synonym' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                      }`}>{c.type}</span>
                  </div>
                  {c.sourceWordMeaning && (
                    <p className="text-[9px] text-slate-500 italic">{c.sourceWordMeaning}</p>
                  )}
                  {c.sourceWordMnemonic && (
                    <p className="text-[8px] text-slate-600 mt-0.5">💡 {c.sourceWordMnemonic}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
export default function WordMap({ onComplete }: { onComplete?: () => void }) {
  const today = getToday();
  const [phase, setPhase] = useState<'loading' | 'flashcards' | 'wordmap' | 'already_played'>('loading');
  const [dailyWords, setDailyWords] = useState<YDTVocab[]>([]);
  const [wordNodes, setWordNodes] = useState<WordNode[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);

  useEffect(() => {
    const session = getDailySession(today);
    const words = getDailyWords(today);
    setDailyWords(words);

    const { wordNodes: nodes, connections: conns } = generateWordMapFromWords(words, today);
    setWordNodes(nodes);
    setConnections(conns);

    if (session?.mapComplete) {
      setPhase('already_played');
    } else if (session?.flashcardsComplete) {
      setPhase('wordmap');
    } else {
      setPhase('flashcards');
    }
  }, [today]);

  const handleFlashcardsComplete = () => {
    markFlashcardsComplete(today);
    setPhase('wordmap');
  };

  const handleMapComplete = (score: number, errors: number) => {
    saveMapResult(today, { score, wrongAttempts: errors });
  };

  if (phase === 'loading') {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-pulse text-indigo-400 font-black text-[11px] uppercase tracking-widest">Loading Daily Map...</div>
      </div>
    );
  }

  if (phase === 'already_played') {
    const session = getDailySession(today);
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center gap-4">
        <div className="bg-indigo-600/20 p-5 rounded-3xl border border-indigo-500/30">
          <Trophy className="text-indigo-400" size={40} />
        </div>
        <h3 className="text-lg font-black italic uppercase">Daily Complete!</h3>
        <p className="text-slate-400 text-[11px]">You&apos;ve already completed today&apos;s Word Map.</p>
        {session && (
          <div className="flex gap-4 mt-2">
            <div className="bg-slate-800 rounded-2xl p-3 text-center border border-slate-700">
              <p className="text-xl font-black text-indigo-400">{session.score}</p>
              <p className="text-[8px] font-black text-slate-500 uppercase">Score</p>
            </div>
            <div className="bg-slate-800 rounded-2xl p-3 text-center border border-slate-700">
              <p className="text-xl font-black text-amber-400">🔥{session.streak}</p>
              <p className="text-[8px] font-black text-slate-500 uppercase">Streak</p>
            </div>
          </div>
        )}
        <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest mt-4">Come back tomorrow for a new map!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[580px] bg-slate-900 rounded-[2.5rem] overflow-hidden text-white relative border-4 border-slate-800 shadow-2xl animate-in fade-in zoom-in duration-500">
      {phase === 'flashcards' && (
        <FlashcardPhase words={dailyWords} onComplete={handleFlashcardsComplete} />
      )}
      {phase === 'wordmap' && (
        <WordMapPhase
          wordNodes={wordNodes}
          connections={connections}
          onComplete={(score, errors) => { handleMapComplete(score, errors); }}
        />
      )}
    </div>
  );
}