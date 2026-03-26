"use client";
import React from 'react';
import { Target, Lightbulb, Zap, BookOpen, AlertCircle, Sparkles } from 'lucide-react';
import { Feedback } from '@/types';

interface ExplanationRendererProps {
  explanation: string;
  feedback?: Feedback;
  hint?: string;
  correctAnswer?: string;
  correctAnswerText?: string;
  isCorrect?: boolean;
  /**
   * Theme variant for the ANLAM section.
   * - 'amber' (default, used by ReadingLab)
   * - 'emerald' (used by GrammarLab)
   * - 'violet' (used by SkillsLab)
   */
  theme?: 'amber' | 'emerald' | 'violet';
}

export default function ExplanationRenderer({ 
  explanation, feedback, hint, correctAnswer, correctAnswerText, isCorrect, theme = 'amber' 
}: ExplanationRendererProps) {
  // Theme-specific colors for the ANLAM section
  const anlamTheme = {
    amber: { bg: "bg-teal-50 border-teal-100 dark:bg-teal-900/20 dark:border-teal-800 border-2", text: "text-teal-900 dark:text-teal-200", labelColor: "text-teal-600 dark:text-teal-400" },
    emerald: { bg: "bg-emerald-50 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800 border-2", text: "text-emerald-900 dark:text-emerald-200", labelColor: "text-emerald-600 dark:text-emerald-400" },
    violet: { bg: "bg-violet-50 border-violet-100 dark:bg-violet-900/20 dark:border-violet-800 border-2", text: "text-violet-900 dark:text-violet-200", labelColor: "text-violet-600 dark:text-violet-400" },
  };

  if (feedback) {
    const isSkills = theme === 'violet';
    const items = [
      { 
        label: isSkills ? "🔍 Hint (Kritik İpucu)" : "🔍 Hint", 
        type: "HINT", 
        content: hint || feedback.hint, 
        icon: null 
      },
      { 
        label: "💡The Logic Flow", 
        type: "LOGIC", 
        content: feedback.correct_logic || feedback.logic, 
        icon: null 
      },
      { 
        label: "⚠️ \"Sakın Düşme!\" (The Pitfall)", 
        type: "TRAP", 
        content: feedback.trap_analysis || feedback.pitfall, 
        icon: null 
      },
    ];

    return (
      <div className="space-y-3">
        {/* CORRECT ANSWER REVEAL ON FAILURE */}
        {!isCorrect && correctAnswer && (
          <div className="p-4 rounded-[1.8rem] bg-emerald-600 text-white shadow-lg animate-in zoom-in-95">
            <div className="flex items-center gap-2 text-[9px] font-black uppercase mb-1 tracking-widest text-emerald-100">
              ✔️ Correct Answer
            </div>
            <div className="text-[14px] font-black leading-relaxed">
              <span className="bg-white text-emerald-700 px-2 py-0.5 rounded-lg mr-2">{correctAnswer}</span>
              {correctAnswerText}
            </div>
          </div>
        )}

        {items.filter(item => item.content).map((item, i) => {
          const styles: Record<string, { bg: string; text: string; labelColor: string }> = {
            "HINT": { bg: "bg-orange-50 border-orange-100 dark:bg-orange-900/20 dark:border-orange-800 border-2", text: "text-orange-900 dark:text-orange-200", labelColor: "text-orange-600 dark:text-orange-400" },
            "LOGIC": { bg: "bg-indigo-600 shadow-indigo-200 dark:shadow-none", text: "text-white", labelColor: "text-indigo-200" },
            "TRAP": { bg: "bg-rose-50 border-rose-100 dark:bg-rose-900/20 dark:border-rose-800 border-2", text: "text-rose-900 dark:text-rose-200", labelColor: "text-rose-600 dark:text-rose-400" },
          };

          const style = styles[item.type] || { bg: "bg-slate-50 border-slate-100 dark:bg-slate-800 dark:border-slate-700 border-2", text: "text-slate-700 dark:text-slate-200", labelColor: "text-slate-400 dark:text-slate-500" };

          return (
            <div key={i} className={`p-4 rounded-[1.8rem] shadow-sm animate-in zoom-in-95 ${style.bg} ${style.text}`}>
              <div className={`flex items-center gap-2 text-[9px] font-black uppercase mb-1 tracking-widest ${style.labelColor}`}>
                {item.label}
              </div>
              <div className="text-[13px] font-bold leading-relaxed italic">{item.content}</div>
            </div>
          );
        })}
      </div>
    );
  }

  if (!explanation) return null;
  const parts = explanation.split('|');

  return (
    <>
      {parts.map((p, i) => {
        const [label, ...content] = p.split(':');
        const type = label?.trim().toUpperCase();

        const styles: Record<string, { bg: string; text: string; labelColor: string; icon: React.ReactNode }> = {
          "TACTIC": { bg: "bg-indigo-600 shadow-indigo-200 dark:shadow-none", text: "text-white", labelColor: "text-indigo-200", icon: <Target size={14} /> },
          "ANLAM": { ...anlamTheme[theme], icon: <BookOpen size={14} /> },
          "NOTE": { bg: "bg-amber-50 border-amber-100 dark:bg-amber-900/20 dark:border-amber-800 border-2", text: "text-amber-900 dark:text-amber-200", labelColor: "text-amber-600 dark:text-amber-400", icon: <AlertCircle size={14} /> },
        };

        const style = styles[type] || { bg: "bg-slate-50 border-slate-100 dark:bg-slate-800 dark:border-slate-700 border-2", text: "text-slate-700 dark:text-slate-200", labelColor: "text-slate-400 dark:text-slate-500", icon: <Sparkles size={14} /> };

        return (
          <div key={i} className={`p-4 rounded-[1.8rem] mb-3 shadow-sm animate-in zoom-in-95 ${style.bg} ${style.text}`}>
            <div className={`flex items-center gap-2 text-[9px] font-black uppercase mb-1 tracking-widest ${style.labelColor}`}>
              {style.icon} {label}
            </div>
            <div className="text-[13px] font-bold leading-relaxed italic">{content.join(':')}</div>
          </div>
        );
      })}
    </>
  );
}
