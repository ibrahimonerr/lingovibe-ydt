export interface Feedback {
    correct_logic: string;
    trap_analysis: string;
    exam_tactic: string;
    contextual_translation?: string;
    translation?: string;
}

export interface Question {
    id: string;
    question: string;
    options: Record<string, string>;
    correct: string;
    correct_answer?: string; // Legacy support
    explanation: string;
    feedback?: Feedback;
    hint?: string;
    quote?: string;
}

export interface ClozeQuestion {
    id?: string;
    blankIdx?: number;
    options: Record<string, string>;
    correct: string;
    explanation: string;
    feedback?: Feedback;
}

export interface ReadingQuestion extends Question { }
export interface GrammarQuestion extends Question { }
export interface VocabQuestion extends Question { }
export interface SkillsQuestion extends Question { }
