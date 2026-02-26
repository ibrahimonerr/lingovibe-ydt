"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Brain, Layout, History, Zap, Languages, Trophy, BookOpen, 
  PenTool, Target, Eye, Repeat, X, RefreshCw, ChevronRight, PlayCircle 
} from 'lucide-react';

// MODÜLER BİLEŞENLER
import VocabMaster from '@/components/features/VocabMaster';
import DailyMission from '@/components/features/DailyMission';
import TopicMastery from '@/components/features/TopicMastery';
import AiAnalyzer from '@/components/features/AiAnalyzer';

const IS_MOCK_MODE = true; 

const MOCK_DATA: any = {
  daily: { passage: "The Great Barrier Reef...", quiz: [{ question: "Visible from space?", options: {A:"Yes", B:"No"}, correct: "A", explanation: "Metne göre evet." }] },
  vocab_synonym: { quiz: [{ question: "ADHERE", options: {A:"Stick", B:"Release"}, correct: "A", explanation: "ANLAM: Yapışmak | SYNONYM: Stick." }] },
  vocab_context: { quiz: [{ question: "The witness decided to **corroborate** the story.", options: {A:"Deny", B:"Confirm"}, correct: "B", explanation: "ANLAM: Doğrulamak | SYNONYM: Confirm." }] },
  vocab_odd: { quiz: [{ question: "Find the odd-one out:", options: {A:"Smart", B:"Clever", C:"Dull"}, correct: "C", explanation: "Dull zıttır." }] },
  vocab_loop: { quiz: [{ question: "LOQUACIOUS", explanation: "ANLAM: Konuşkan | SYNONYM: Talkative | MNEMONIC: Loqua (vıdı vıdı)." }] },
  grammar: { quiz: [{ question: "If I --- you...", options: {A:"am", B:"were"}, correct: "B", explanation: "Type 2." }] },
  skills: { quiz: [{ question: "Restatement...", options: {A:"Warm", B:"Not warm"}, correct: "B", explanation: "Restatement." }] },
  analyzer: { quiz: [{ question: "AI Result?", options: {A:"Success", B:"Fail"}, correct: "A", explanation: "AI Success." }] }
};

const grammarTopics = ["Tenses & Aspect", "Modals", "Passive & Causatives", "Pronouns", "Adjectives & Adverbs", "Relative Clauses", "Noun Clauses", "Conditionals & Wish", "Conjunctions", "Gerund & Infinitive", "Prepositions", "Participles"];
const skillTopics = ["Cloze Test", "Sentence Completion", "English-Turkish Translation", "Turkish-English Translation", "Restatement", "Paragraph Completion", "Irrelevant Sentence", "Dialogue Completion", "Situation"];

export default function YDTHub() {
  const [view, setView] = useState('home');
  const [mode, setMode] = useState(''); 
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isTextExpanded, setIsTextExpanded] = useState(true);
  const [readingPassage, setReadingPassage] = useState<string | null>(null);
  const [vocabSubMode, setVocabSubMode] = useState<string | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [inputText, setInputText] = useState('');
  const [activeMissions, setActiveMissions] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('ydt_active_missions');
    if (saved) setActiveMissions(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (view === 'quiz' && questions.length > 0) {
      const missionId = vocabSubMode ? `vocab_${vocabSubMode}` : mode || 'daily';
      const newMission = {
        id: missionId,
        title: vocabSubMode ? `Vocab: ${vocabSubMode.toUpperCase()}` : (mode === 'daily' ? 'Daily Mission' : `${mode?.toUpperCase()}`),
        questions, currentIdx, readingPassage, vocabSubMode, mode, timestamp: new Date().getTime()
      };
      const filtered = activeMissions.filter(m => m.id !== missionId);
      const updated = [newMission, ...filtered].slice(0, 5);
      setActiveMissions(updated);
      localStorage.setItem('ydt_active_missions', JSON.stringify(updated));
    }
  }, [currentIdx, view, questions.length]);

  const handleQuizGeneration = async (type: string, subType?: string, content?: string) => {
    setMode(''); setLoading(true); setView('quiz'); setVocabSubMode(subType || null);
    if (IS_MOCK_MODE) {
      setTimeout(() => {
        const key = subType ? `${type}_${subType}` : type;
        const result = MOCK_DATA[key] || MOCK_DATA['daily'];
        setQuestions(result.quiz);
        setReadingPassage(result.passage || null);
        setLoading(false);
      }, 400);
      return;
    }
  };

  const resumeMission = (m: any) => {
    setQuestions(m.questions);
    setCurrentIdx(m.currentIdx);
    setReadingPassage(m.readingPassage);
    setVocabSubMode(m.vocabSubMode);
    setMode(m.mode);
    setView('quiz');
    setMode('');
  };

  const navigateToHome = () => {
    setView('home'); setMode(''); setQuestions([]); setCurrentIdx(0); 
    setSelectedOption(null); setShowFeedback(false); setIsFlipped(false); setReadingPassage(null);
  };

  const handleNext = () => {
    if (questions && currentIdx < questions.length - 1) {
      setCurrentIdx(c => c + 1); setSelectedOption(null); setShowFeedback(false); setIsFlipped(false);
    } else { navigateToHome(); }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center py-0 sm:py-8 font-sans text-slate-900 leading-normal">
      <div className="w-full max-w-[450px] bg-white min-h-screen sm:min-h-[850px] sm:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col relative border-x border-slate-200">
        
        <header className="pt-10 pb-4 text-center border-b border-slate-50 bg-white">
          <div className="inline-flex items-center justify-center bg-indigo-50 p-2 rounded-2xl mb-2"><Brain className="text-indigo-600" size={24} /></div>
          <h1 className="text-2xl font-black italic uppercase text-slate-900 leading-none">YDT<span className="text-indigo-600">Hub</span></h1>
        </header>

        <main className="flex-1 p-6 overflow-y-auto pb-32">
          {view === 'home' && !loading && (
            <div className="space-y-3 animate-in fade-in duration-500">
              <button onClick={() => handleQuizGeneration('daily')} className="w-full p-5 rounded-[2.2rem] border-2 border-amber-100 bg-amber-50/30 flex items-center gap-4 active:scale-95 transition-all text-left shadow-sm">
                <div className="p-3 bg-white rounded-2xl text-amber-500 shadow-sm"><Zap size={20}/></div>
                <div><span className="font-black uppercase text-[13px] block">Daily Mission</span><span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Reading Mastery</span></div>
              </button>
              
              <button onClick={() => setMode('vocab_select')} className="w-full p-5 rounded-[2.2rem] border-2 border-indigo-100 bg-indigo-50/30 flex items-center gap-4 active:scale-95 transition-all text-left shadow-sm">
                <div className="p-3 bg-white rounded-2xl text-indigo-600 shadow-sm"><Languages size={20}/></div>
                <div><span className="font-black uppercase text-[13px] block">Vocab Master</span><span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Strategy & Memory</span></div>
              </button>

              <button onClick={() => setMode('grammar')} className="w-full p-5 rounded-[2.2rem] border-2 border-emerald-100 bg-emerald-50/30 flex items-center gap-4 active:scale-95 transition-all text-left shadow-sm">
                <div className="p-3 bg-white rounded-2xl text-emerald-600 shadow-sm"><Trophy size={20}/></div>
                <div><span className="font-black uppercase text-[13px] block">Grammar Master</span><span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Topic Practice</span></div>
              </button>

              <button onClick={() => setMode('skills')} className="w-full p-5 rounded-[2.2rem] border-2 border-blue-100 bg-blue-50/30 flex items-center gap-4 active:scale-95 transition-all text-left shadow-sm">
                <div className="p-3 bg-white rounded-2xl text-blue-600 shadow-sm"><BookOpen size={20}/></div>
                <div><span className="font-black uppercase text-[13px] block">Skills Practice</span><span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Question Types</span></div>
              </button>

              <button onClick={() => setMode('analyzer')} className="w-full p-5 rounded-[2.2rem] border-2 border-rose-100 bg-rose-50/30 flex items-center gap-4 active:scale-95 transition-all text-left shadow-sm">
                <div className="p-3 bg-white rounded-2xl text-rose-600 shadow-sm"><PenTool size={20}/></div>
                <div><span className="font-black uppercase text-[13px] block">Ai Analyzer</span><span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Text to Quiz</span></div>
              </button>
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center py-32 animate-pulse">
              <RefreshCw className="animate-spin text-indigo-600 mb-4" size={48} />
              <p className="font-black text-indigo-600 uppercase text-[10px]">Syncing...</p>
            </div>
          )}

          {!loading && view === 'quiz' && questions.length > 0 && (
            <>
              {vocabSubMode ? (
                <VocabMaster questions={questions} currentIdx={currentIdx} vocabSubMode={vocabSubMode} isFlipped={isFlipped} setIsFlipped={setIsFlipped} handleNext={handleNext} selectedOption={selectedOption} setSelectedOption={setSelectedOption} showFeedback={showFeedback} setShowFeedback={setShowFeedback} />
              ) : readingPassage ? (
                <DailyMission questions={questions} currentIdx={currentIdx} readingPassage={readingPassage} isTextExpanded={isTextExpanded} setIsTextExpanded={setIsTextExpanded} handleNext={handleNext} selectedOption={selectedOption} setSelectedOption={setSelectedOption} showFeedback={showFeedback} setShowFeedback={setShowFeedback} />
              ) : (mode === 'analyzer' || inputText !== '') ? (
                 <AiAnalyzer question={questions[currentIdx]} handleNext={handleNext} selectedOption={selectedOption} setSelectedOption={setSelectedOption} showFeedback={showFeedback} setShowFeedback={setShowFeedback} />
              ) : (
                <TopicMastery question={questions[currentIdx]} mode={mode || 'grammar'} handleNext={handleNext} selectedOption={selectedOption} setSelectedOption={setSelectedOption} showFeedback={showFeedback} setShowFeedback={setShowFeedback} />
              )}
            </>
          )}
        </main>

        {/* MODALS */}
        {['grammar', 'skills', 'vocab_select', 'analyzer', 'resume_list'].includes(mode) && (
          <div className="absolute inset-0 z-[120] bg-slate-900/60 backdrop-blur-md flex items-end justify-center p-4">
            <div className="w-full max-w-[380px] bg-white rounded-[2.5rem] p-6 shadow-2xl animate-in slide-in-from-bottom-10">
              <div className="text-center font-black uppercase text-[11px] text-indigo-600 mb-6 border-b pb-4">{mode === 'resume_list' ? 'Active Missions' : 'Selection Menu'}</div>
              <div className="space-y-2 max-h-[350px] overflow-y-auto custom-scrollbar">
                {mode === 'resume_list' ? (
                  activeMissions.length === 0 ? <p className="text-center py-10 text-[10px] text-slate-400 font-bold uppercase">No active missions</p> : activeMissions.map((m, idx) => (
                    <button key={idx} onClick={() => resumeMission(m)} className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-slate-100 flex items-center gap-4 transition-all active:scale-95 shadow-sm">
                       <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-lg"><PlayCircle size={20}/></div>
                       <div className="text-left"><div className="font-black text-[11px] uppercase text-slate-700">{m.title}</div><div className="text-[9px] font-bold text-slate-400">Step: {m.currentIdx + 1} / {m.questions.length}</div></div>
                    </button>
                  ))
                ) : mode === 'vocab_select' ? (
                  <>
                    <button onClick={() => handleQuizGeneration('vocab', 'synonym')} className="w-full p-4 rounded-2xl bg-indigo-50 flex items-center gap-3 text-slate-700 font-black text-[11px] uppercase"><Target size={18}/> Synonym & Antonym</button>
                    <button onClick={() => handleQuizGeneration('vocab', 'context')} className="w-full p-4 rounded-2xl bg-amber-50 flex items-center gap-3 text-slate-700 font-black text-[11px] uppercase"><Eye size={18}/> In-Context</button>
                    <button onClick={() => handleQuizGeneration('vocab', 'odd')} className="w-full p-4 rounded-2xl bg-emerald-50 flex items-center gap-3 text-slate-700 font-black text-[11px] uppercase"><X size={18}/> Odd-One Out</button>
                    <button onClick={() => handleQuizGeneration('vocab', 'loop')} className="w-full p-4 rounded-2xl bg-rose-50 flex items-center gap-3 text-slate-700 font-black text-[11px] uppercase"><Repeat size={18}/> Flashcard Loop</button>
                  </>
                ) : mode === 'analyzer' ? (
                  <div className="space-y-3">
                    <textarea value={inputText} onChange={(e) => setInputText(e.target.value)} className="w-full h-32 p-4 bg-slate-50 rounded-2xl text-xs outline-none border focus:border-indigo-300" placeholder="Paste YDT text..." />
                    <button onClick={() => handleQuizGeneration('analyzer', undefined, inputText)} className="w-full bg-rose-600 text-white py-4 rounded-2xl font-black uppercase text-[11px]">Analyze</button>
                  </div>
                ) : (
                  (mode === 'grammar' ? grammarTopics : skillTopics).map(t => (
                    <button key={t} onClick={() => handleQuizGeneration(mode, undefined, t)} className="w-full p-3.5 text-left bg-slate-50 rounded-xl text-[10px] font-bold uppercase flex justify-between items-center text-slate-600">{t} <ChevronRight size={14} className="opacity-20"/></button>
                  ))
                )}
              </div>
              <button onClick={() => setMode('')} className="w-full mt-4 py-4 text-[10px] font-black uppercase text-slate-400">Back to Hub</button>
            </div>
          </div>
        )}

        <nav className="fixed bottom-0 w-full max-w-[450px] bg-white border-t p-6 flex justify-around items-center rounded-t-[3rem] shadow-2xl z-[100]">
          <button onClick={navigateToHome} className="p-3 text-slate-300 hover:text-indigo-600 transition-all"><Layout size={26} /></button>
          <button onClick={() => setMode('resume_list')} className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl -mt-16 border-[6px] border-white active:scale-90 transition-all ${activeMissions.length > 0 ? 'bg-indigo-600' : 'bg-indigo-900'}`}>
            <span className="text-2xl font-black italic">Y</span>
          </button>
          <button onClick={() => { if(confirm("Clear Progress?")) { localStorage.clear(); window.location.reload(); } }} className="p-3 text-slate-300 hover:text-rose-500 transition-all"><History size={26} /></button>
        </nav>
      </div>

      {/* KRİTİK CSS BLOĞU BURADA */}
      <style jsx global>{`
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { 
          backface-visibility: hidden; 
          -webkit-backface-visibility: hidden; 
        }
        .rotate-y-180 { transform: rotateY(180deg); }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
}