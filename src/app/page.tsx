"use client";

import React, { useState, useEffect } from 'react';
import { 
  BookOpen, PenTool, Layout, History, ChevronDown, ChevronUp, X,
  Brain, RefreshCw, Zap, Lightbulb, Trophy, Languages, ChevronRight, Skull, CheckCircle2,
  Repeat, Target, Eye, AlertCircle, Bookmark, RotateCcw, Quote, Sparkles
} from 'lucide-react';

export default function YDTHub() {
  const [view, setView] = useState('home');
  const [mode, setMode] = useState(''); 
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isTextExpanded, setIsTextExpanded] = useState(true);
  const [inputText, setInputText] = useState('');
  const [readingPassage, setReadingPassage] = useState<string | null>(null);
  const [darkList, setDarkList] = useState<any[]>([]);
  const [vocabSubMode, setVocabSubMode] = useState<string | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);

  const grammarTopics = ["Tenses & Aspect", "Modals", "Passive & Causatives", "Pronouns", "Adjectives & Adverbs", "Relative Clauses", "Noun Clauses", "Conditionals & Wish", "Conjunctions", "Gerund & Infinitive", "Prepositions", "Participles"];
  const skillTopics = ["Cloze Test", "Sentence Completion", "English-Turkish Translation", "Turkish-English Translation", "Restatement", "Paragraph Completion", "Irrelevant Sentence", "Dialogue Completion", "Situation"];

  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  const PRIMARY_MODEL = "gemini-3-flash-preview";

  useEffect(() => {
    const saved = localStorage.getItem('lingovibe_dark_list');
    if (saved) setDarkList(JSON.parse(saved));
  }, []);

  const navigateToHome = () => {
    setLoading(false); setView('home'); setMode(''); setVocabSubMode(null); setQuestions([]); setCurrentIdx(0); setSelectedOption(null); setShowFeedback(false); setIsFlipped(false);
  };

  const parseAIResponse = (text: string) => {
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) return JSON.parse(jsonMatch[0]);
      return JSON.parse(text);
    } catch (e) { throw new Error("Format Hatası."); }
  };

  const handleQuizGeneration = async (type: string, subType?: string, content?: string) => {
    const cacheKey = `ydthub_v21_final_stable_${type}_${subType || ''}_${content || ''}`;
    const cached = localStorage.getItem(cacheKey);

    if (cached) {
      const parsed = JSON.parse(cached);
      setQuestions(parsed.quiz);
      setReadingPassage(type === 'vocab' ? null : (parsed.passage && parsed.passage !== "null" ? parsed.passage : null));
      setVocabSubMode(subType || null);
      setCurrentIdx(0); setSelectedOption(null); setShowFeedback(false); setMode(''); setView('quiz'); setIsFlipped(false);
      return;
    }

    setLoading(true); setView('quiz'); setQuestions([]); setCurrentIdx(0); setShowFeedback(false); setMode(''); setVocabSubMode(subType || null); setIsFlipped(false);

    let prompt = `Expert YDT teacher. Return ONLY JSON: { "passage": "null", "quiz": [ { "question": "WORD", "options": {"A":"Reveal"}, "correct": "A", "explanation": "ANLAM: [Türkçe Karşılık] | SYNONYM: [Eş Anlamlısı] | ANTONYM: [Zıt Anlamlısı] | MNEMONIC: [Hafıza Taktiği]" } ] }. `;
    
    if (type === 'vocab' && subType === 'loop') {
      prompt += "Generate 10 advanced YDT words. Question must be ONLY the word. You MUST use labels ANLAM, SYNONYM, ANTONYM, and MNEMONIC separated by | in the explanation field.";
    } else {
      prompt += `Topic: ${content || type}.`;
    }

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${PRIMARY_MODEL}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      const cleanJson = parseAIResponse(rawText);
      localStorage.setItem(cacheKey, JSON.stringify(cleanJson));
      setReadingPassage(type === 'vocab' ? null : (cleanJson.passage && cleanJson.passage !== "null" ? cleanJson.passage : null));
      setQuestions(cleanJson.quiz);
    } catch (err: any) {
      alert("Yükleme hatası.");
      navigateToHome();
    } finally { setLoading(false); }
  };

  const formatQuestionText = (text: string) => {
    if (!text) return "";
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => 
      part.startsWith('**') && part.endsWith('**') 
        ? <strong key={i} className="text-indigo-600 bg-indigo-50 px-1 rounded border-b-2 border-indigo-400 font-black">{part.replace(/\*\*/g, '')}</strong> 
        : part
    );
  };

  const renderCardBack = (explanation: string) => {
    const parts = explanation.split('|');
    const sections = parts.map(p => {
      const [label, ...content] = p.split(':');
      return { label: label?.trim(), content: content.join(':')?.trim() };
    }).filter(s => s.content);

    if (sections.length === 0) return <div className="text-white/80 font-medium p-4">{explanation}</div>;

    return (
      <div className="space-y-3 w-full">
        {sections.map((sec, i) => {
          const styles: any = { 
            "ANLAM": { icon: <Languages size={14}/>, color: "text-indigo-400", bg: "bg-indigo-500/20" }, 
            "SYNONYM": { icon: <Target size={14}/>, color: "text-emerald-400", bg: "bg-emerald-500/20" },
            "ANTONYM": { icon: <Skull size={14}/>, color: "text-rose-400", bg: "bg-rose-500/20" },
            "MNEMONIC": { icon: <Sparkles size={14}/>, color: "text-amber-400", bg: "bg-amber-500/20" }
          };
          const style = styles[sec.label] || { icon: <Bookmark size={14}/>, color: "text-slate-400", bg: "bg-slate-500/20" };
          
          return (
            <div key={i} className={`p-4 rounded-[1.8rem] ${style.bg} border border-white/5 animate-in fade-in slide-in-from-bottom-2`}>
              <div className={`flex items-center gap-2 ${style.color} text-[9px] font-black uppercase tracking-widest mb-1`}>
                {style.icon} {sec.label}
              </div>
              <div className="text-white font-bold text-[14px] leading-snug">
                {sec.content}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex justify-center py-0 sm:py-8 font-sans text-slate-900 leading-normal text-sm">
      <div className="w-full max-w-[450px] bg-white min-h-screen sm:min-h-[850px] sm:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col relative border-x border-slate-200">
        
        <div className="bg-white pt-8 pb-4 px-8 text-center border-b border-slate-50">
          <div className="inline-flex items-center justify-center bg-indigo-50 p-2 rounded-2xl mb-2"><Brain className="text-indigo-600" size={24} /></div>
          <h1 className="text-2xl font-black italic tracking-tighter uppercase leading-none">YDT<span className="text-indigo-600">Hub</span></h1>
        </div>

        <main className="flex-1 p-6 overflow-y-auto pb-32">
          {view === 'home' && !loading && (
            <div className="space-y-3 animate-in fade-in">
              {[
                { id: 'daily', title: 'Daily Mission', sub: 'Okuma Ve Stratejik Soru Seti', icon: <Zap className="text-amber-500" size={18}/>, bg: 'bg-amber-50', border: 'border-amber-100' },
                { id: 'vocab', title: 'Vocab Master', sub: 'Üç Aşamalı Kelime Stratejisi', icon: <Languages className="text-indigo-600" size={18}/>, bg: 'bg-indigo-50', border: 'border-indigo-100' },
                { id: 'grammar', title: 'Topic Mastery', sub: 'Dilbilgisi Uzmanlık Pratiği', icon: <Trophy className="text-emerald-600" size={18}/>, bg: 'bg-emerald-50', border: 'border-emerald-100' },
                { id: 'skills', title: 'Skills Practice', sub: 'YDT Soru Tipleri Antrenmanı', icon: <BookOpen className="text-blue-600" size={18}/>, bg: 'bg-blue-50', border: 'border-blue-100' },
                { id: 'analyzer', title: 'Ai Analyzer', sub: 'Metni Sınav Formatına Dönüştürün', icon: <PenTool className="text-rose-600" size={18}/>, bg: 'bg-rose-50', border: 'border-rose-100' },
              ].map((card) => (
                <button key={card.id} onClick={() => card.id === 'vocab' ? setMode('vocab_select') : ['grammar', 'skills', 'analyzer'].includes(card.id) ? setMode(card.id) : handleQuizGeneration(card.id)} className={`w-full p-4 rounded-[1.8rem] border-2 ${card.border} ${card.bg} text-left transition-all active:scale-95 shadow-sm`}>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white rounded-xl shadow-sm">{card.icon}</div>
                    <div className="flex flex-col">
                      <span className="font-black text-slate-800 text-[13px] leading-tight uppercase">{card.title}</span>
                      <span className="text-[9px] font-bold text-slate-400 mt-1 tracking-tight">{card.sub}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {loading && (
            <div className="flex flex-col items-center justify-center py-32 gap-6 animate-in fade-in text-center">
              <RefreshCw className="animate-spin text-indigo-600" size={56}/>
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest leading-loose">Mission Loading...</p>
            </div>
          )}

          {view === 'quiz' && questions.length > 0 && (
            <div className="space-y-5 animate-in slide-in-from-right-8 pb-20">
              <div className="flex justify-between items-center px-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest">
                <span className="bg-indigo-50 px-3 py-1 rounded-full">{vocabSubMode === 'loop' ? 'Flashcards' : 'Practice'} | {currentIdx + 1} / {questions.length}</span>
                <button onClick={navigateToHome} className="text-slate-400 font-black underline uppercase">Exit</button>
              </div>

              {!vocabSubMode && readingPassage && (
                <div className="border-2 border-indigo-100 rounded-[2rem] overflow-hidden bg-white shadow-sm">
                  <button onClick={() => setIsTextExpanded(!isTextExpanded)} className="w-full p-4 bg-indigo-50 flex justify-between items-center text-indigo-900 font-black text-[10px] uppercase">
                    <span className="flex items-center gap-2 font-mono"><BookOpen size={14}/> Reading Passage</span>
                    {isTextExpanded ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                  </button>
                  {isTextExpanded && <div className="p-5 text-[14px] leading-relaxed text-slate-700 italic max-h-[250px] overflow-y-auto border-t border-indigo-100 custom-scrollbar">{readingPassage}</div>}
                </div>
              )}

              {vocabSubMode === 'loop' ? (
                <div className="perspective-1000 min-h-[420px]">
                  <div onClick={() => setIsFlipped(!isFlipped)} className={`relative w-full h-[400px] transition-all duration-700 preserve-3d cursor-pointer ${isFlipped ? 'rotate-y-180' : ''}`}>
                    {/* ÖN YÜZ */}
                    <div className="absolute inset-0 backface-hidden bg-slate-900 rounded-[3rem] shadow-2xl flex flex-col items-center justify-center p-8 border-b-[12px] border-indigo-600">
                       <RotateCcw size={32} className="text-white/20 mb-6"/>
                       <div className="text-white text-[34px] font-black text-center tracking-tighter italic uppercase leading-none select-none">{questions[currentIdx].question}</div>
                       <div className="absolute bottom-12 text-[9px] font-black text-indigo-400 uppercase tracking-[0.3em] opacity-60">Tap to Reveal</div>
                    </div>
                    {/* ARKA YÜZ (PREMIUM MODERNIZE) */}
                    <div className="absolute inset-0 backface-hidden rotate-y-180 bg-slate-900 rounded-[3rem] shadow-2xl flex flex-col p-6 border border-white/10 overflow-y-auto custom-scrollbar">
                      <div className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4 flex items-center justify-center gap-2 bg-white/5 py-2 rounded-full border border-white/5">
                        <Sparkles size={14}/> Word Intelligence
                      </div>
                      {renderCardBack(questions[currentIdx].explanation)}
                    </div>
                  </div>
                  <div className="mt-8 flex gap-3">
                    <button onClick={() => { if(currentIdx > 0) { setCurrentIdx(c=>c-1); setIsFlipped(false); } }} disabled={currentIdx === 0} className={`flex-1 py-4 rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest transition-all ${currentIdx === 0 ? 'bg-slate-50 text-slate-200' : 'bg-white border-2 border-slate-100 text-slate-600 active:scale-90'}`}>Back</button>
                    <button onClick={() => { if(currentIdx < questions.length - 1) { setCurrentIdx(c=>c+1); setIsFlipped(false); } else { navigateToHome(); } }} className="flex-[2.5] bg-indigo-600 text-white py-4 rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest shadow-lg shadow-indigo-200 active:scale-90">Next Word</button>
                  </div>
                </div>
              ) : (
                <div className="space-y-5 animate-in slide-in-from-bottom-4">
                  <div className="p-6 bg-slate-900 text-white rounded-[2.2rem] shadow-xl text-[15px] font-bold leading-relaxed border-b-4 border-indigo-500">
                    {formatQuestionText(questions[currentIdx].question)}
                  </div>
                  <div className="space-y-2">
                    {Object.entries(questions[currentIdx].options).map(([key, value]: any) => (
                      <button key={key} onClick={() => !showFeedback && setSelectedOption(key)} className={`w-full p-4 text-left rounded-[1.2rem] border-2 transition-all text-[13px] flex items-center gap-3 ${selectedOption === key ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold' : 'border-slate-100 bg-white shadow-sm hover:border-slate-200'}`}>
                        <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black ${selectedOption === key ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>{key}</span>
                        <span className="flex-1">{value}</span>
                      </button>
                    ))}
                  </div>
                  {showFeedback && (
                    <div className="space-y-4 animate-in fade-in">
                      <div className={`p-5 rounded-[2rem] text-[13px] border-2 shadow-sm ${selectedOption === questions[currentIdx].correct ? 'bg-green-50 text-green-900 border-green-100' : 'bg-rose-50 text-rose-900 border-rose-100'}`}>
                        <p className="font-black mb-3 uppercase flex items-center gap-2 text-[10px] tracking-widest text-indigo-600"><Lightbulb size={16}/> Analysis</p>
                        {selectedOption !== questions[currentIdx].correct && <div className="mb-3 font-bold text-rose-700 underline italic text-[11px]">Chosen: {questions[currentIdx].options[selectedOption!]}</div>}
                        <div className="font-medium whitespace-pre-wrap leading-relaxed">{questions[currentIdx].explanation}</div>
                      </div>
                      <button onClick={() => { if(currentIdx < questions.length - 1) { setCurrentIdx(c=>c+1); setSelectedOption(null); setShowFeedback(false); } else { navigateToHome(); } }} className="w-full bg-indigo-600 text-white py-4 rounded-[2rem] font-black shadow-lg text-[13px] uppercase tracking-widest active:scale-95 transition-all">Next Step</button>
                    </div>
                  )}
                  {!showFeedback && <button onClick={() => selectedOption && setShowFeedback(true)} disabled={!selectedOption} className="w-full bg-slate-900 text-white py-4 rounded-[2rem] font-black shadow-lg uppercase text-[12px] tracking-widest active:scale-95 transition-all">Confirm Answer</button>}
                </div>
              )}
            </div>
          )}
        </main>

        {mode !== '' && (
          <div className="absolute inset-0 z-[110] bg-slate-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
            <div className="w-full max-w-[380px] bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10">
              <div className="p-6 text-center border-b bg-slate-50 font-black uppercase text-[12px] tracking-widest">
                {mode === 'vocab_select' ? 'Vocab Master' : mode.charAt(0).toUpperCase() + mode.slice(1)} Center
              </div>
              <div className="p-5 max-h-[400px] overflow-y-auto custom-scrollbar">
                {mode === 'analyzer' ? (
                  <div className="space-y-4">
                    <textarea value={inputText} onChange={(e) => setInputText(e.target.value)} className="w-full h-32 p-4 bg-slate-50 rounded-2xl text-sm border outline-none" placeholder="Paste your academic text here..." />
                    <button onClick={() => handleQuizGeneration('text', undefined, inputText)} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[12px]">Generate Mission</button>
                  </div>
                ) : mode === 'vocab_select' ? (
                  <div className="space-y-2">
                    <button onClick={() => handleQuizGeneration('vocab', 'synonym')} className="w-full p-4 rounded-2xl bg-indigo-50 border-2 border-indigo-100 flex items-center gap-3 active:scale-95 transition-all group hover:bg-indigo-100"><Target size={20} className="text-indigo-600"/><p className="font-black text-[12px] uppercase">Synonym & Depth</p></button>
                    <button onClick={() => handleQuizGeneration('vocab', 'context')} className="w-full p-4 rounded-2xl bg-amber-50 border-2 border-amber-100 flex items-center gap-3 active:scale-95 transition-all group hover:bg-amber-100"><Eye size={20} className="text-amber-600"/><p className="font-black text-[12px] uppercase">In-Context Mastery</p></button>
                    <button onClick={() => handleQuizGeneration('vocab', 'loop')} className="w-full p-4 rounded-2xl bg-rose-50 border-2 border-rose-100 flex items-center gap-3 active:scale-95 transition-all group hover:bg-rose-100"><Repeat size={20} className="text-rose-600"/><p className="font-black text-[12px] uppercase">Flashcard Loop</p></button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-2">
                    {(mode === 'grammar' ? grammarTopics : skillTopics).map((t: string) => (
                      <button key={t} onClick={() => handleQuizGeneration(mode, undefined, t)} className="w-full p-4 text-left bg-slate-50 rounded-xl text-[12px] font-bold flex justify-between items-center transition-all hover:bg-indigo-600 hover:text-white group">
                        {t} <ChevronRight size={14} className="opacity-30 group-hover:opacity-100"/>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button onClick={() => setMode('')} className="w-full py-4 text-[10px] font-black uppercase text-slate-400 hover:text-red-500 transition-colors">Close</button>
            </div>
          </div>
        )}

        <nav className="fixed bottom-0 w-full max-w-[450px] bg-white border-t p-6 flex justify-around items-center rounded-t-[3rem] shadow-2xl z-[100]">
          <button onClick={navigateToHome} className={`p-3 transition-all ${view === 'home' && mode === '' ? 'text-indigo-600 bg-indigo-50 rounded-2xl' : 'text-slate-300'}`}><Layout size={26} /></button>
          <button onClick={navigateToHome} className="w-16 h-16 bg-indigo-900 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl -mt-16 border-[6px] border-white transition-all active:scale-90 shadow-indigo-100"><span className="text-2xl font-black italic">Y</span></button>
          <button onClick={() => { if(confirm("Clear Progress?")) { localStorage.clear(); window.location.reload(); } }} className="p-3 text-slate-300 hover:text-red-500 transition-all"><History size={26} /></button>
        </nav>
      </div>

      <style jsx global>{`
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
      `}</style>
    </div>
  );
}