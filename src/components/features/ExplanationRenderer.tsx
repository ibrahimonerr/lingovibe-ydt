"use client";
import React from 'react';
import { Target, Lightbulb, Zap, BookOpen, AlertCircle, Sparkles } from 'lucide-react';
import { Feedback } from '@/types';

interface ExplanationRendererProps {
  explanation: string;
  feedback?: Feedback;
  /**
   * Theme variant for the ANLAM section.
   * - 'amber' (default, used by ReadingLab)
   * - 'emerald' (used by GrammarLab)
   * - 'violet' (used by SkillsLab)
   */
  theme?: 'amber' | 'emerald' | 'violet';
}

export default function ExplanationRenderer({ explanation, feedback, theme = 'amber' }: ExplanationRendererProps) {
  // Theme-specific colors for the ANLAM section
  const anlamTheme = {
    amber: { bg: "bg-teal-50 border-teal-100 dark:bg-teal-900/20 dark:border-teal-800 border-2", text: "text-teal-900 dark:text-teal-200", labelColor: "text-teal-600 dark:text-teal-400" },
    emerald: { bg: "bg-emerald-50 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-800 border-2", text: "text-emerald-900 dark:text-emerald-200", labelColor: "text-emerald-600 dark:text-emerald-400" },
    violet: { bg: "bg-violet-50 border-violet-100 dark:bg-violet-900/20 dark:border-violet-800 border-2", text: "text-violet-900 dark:text-violet-200", labelColor: "text-violet-600 dark:text-violet-400" },
  };

  if (feedback) {
    const items = [
      { label: "Analitik Doğrulama", type: "LOGIC", content: feedback.correct_logic, icon: <Target size={14} /> },
      { label: "Sinsi Çeldirici", type: "TRAP", content: feedback.trap_analysis, icon: <Lightbulb size={14} /> },
      { label: "YDT Taktiği", type: "TACTIC", content: feedback.exam_tactic, icon: <Zap size={14} /> },
      { label: "Bağlamsal Çeviri", type: "ANLAM", content: feedback.contextual_translation || feedback.translation, icon: <BookOpen size={14} /> }
    ];

    return (
      <>
        {items.filter(item => item.content).map((item, i) => {
          const styles: Record<string, { bg: string; text: string; labelColor: string }> = {
            "LOGIC": { bg: "bg-indigo-600 shadow-indigo-200 dark:shadow-none", text: "text-white", labelColor: "text-indigo-200" },
            "TRAP": { bg: "bg-rose-50 border-rose-100 dark:bg-rose-900/20 dark:border-rose-800 border-2", text: "text-rose-900 dark:text-rose-200", labelColor: "text-rose-600 dark:text-rose-400" },
            "TACTIC": { bg: "bg-amber-50 border-amber-100 dark:bg-amber-900/20 dark:border-amber-800 border-2", text: "text-amber-900 dark:text-amber-200", labelColor: "text-amber-600 dark:text-amber-400" },
            "ANLAM": anlamTheme[theme],
          };

          const style = styles[item.type] || { bg: "bg-slate-50 border-slate-100 dark:bg-slate-800 dark:border-slate-700 border-2", text: "text-slate-700 dark:text-slate-200", labelColor: "text-slate-400 dark:text-slate-500" };

          return (
            <div key={i} className={`p-4 rounded-[1.8rem] mb-3 shadow-sm animate-in zoom-in-95 ${style.bg} ${style.text}`}>
              <div className={`flex items-center gap-2 text-[9px] font-black uppercase mb-1 tracking-widest ${style.labelColor}`}>
                {item.icon} {item.label}
              </div>
              <div className="text-[13px] font-bold leading-relaxed italic">{item.content}</div>
            </div>
          );
        })}
      </>
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
