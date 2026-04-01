import { supabase } from './supabase';
import { Question } from '@/types';

export const GRAMMAR_TOPICS = [
  "Tenses & Aspect", "Modals & Similar Expressions", "The Passive", "If & Wish Clauses",
  "Noun Clauses & Reported Speech", "Gerunds & Infinitives", "Adjectives & Adverbs",
  "Relative Clauses", "Nouns, Pronouns & Articles", "Conjunctions & Transitions"
];

export const SKILL_TOPICS = [
  "Sentence Completion", "Translation (EN-TR)", "Translation (TR-EN)",
  "Dialogue Completion", "Situation", "Restatement", "Paragraph Completion", "Irrelevant"
];

export interface DenemeQuestion extends Question {
  labType: 'grammar' | 'skills' | 'reading';
  topic?: string;
  passage?: string; // For reading
}

function normalizeQuestion(q: any, topic?: string): DenemeQuestion {
  // Common normalization
  const normalized: any = { 
    ...q,
    correct_answer: q.correct_answer || q.correct || q.correct_option || 'A',
    options: q.options || {}
  };

  // Topic specific normalization
  if (topic === 'Irrelevant' && Array.isArray(q.sentences)) {
    // 1. Filter out sentences that look like prompts (contain "irrelevant", "bozmaktadır", "which of the following")
    const cleanSentences = q.sentences
      .map((s: string) => s.trim())
      .filter((s: string) => {
        const lower = s.toLowerCase();
        const isPrompt = lower.includes("irrelevant") || 
                        lower.includes("akışı bozmaktadır") || 
                        lower.includes("which of the following") ||
                        lower.includes("parça okunduğunda") ||
                        s.length < 5;
        return !isPrompt;
      })
      .map((s: string) => {
        // 2. Remove existing numbering like (I), (II), (1), 1., etc.
        return s.replace(/^(\([A-Z0-9]+\)|[A-Z0-9]+\.|\d+\))\s*/i, '').trim();
      });

    // 3. Re-format with I-V numerals
    const romaNumerals = ['I', 'II', 'III', 'IV', 'V'];
    normalized.question = cleanSentences.slice(0, 5).map((s: string, i: number) => `(${romaNumerals[i]}) ${s}`).join('\n\n');
    
    normalized.options = {
      'A': 'I',
      'B': 'II',
      'C': 'III',
      'D': 'IV',
      'E': 'V'
    };
  }

  // Ensure question text exists
  if (!normalized.question) {
    normalized.question = q.text || q.content || q.passage || 'Soru içeriği yüklenemedi.';
  }

  // Ensure options is an object
  if (Array.isArray(normalized.options)) {
    const optsObj: any = {};
    const labels = ['A', 'B', 'C', 'D', 'E'];
    normalized.options.forEach((opt: string, i: number) => {
      if (i < 5) optsObj[labels[i]] = opt;
    });
    normalized.options = optsObj;
  }

  return normalized as DenemeQuestion;
}

export async function fetchMiniDenemeData(): Promise<DenemeQuestion[]> {
  try {
    // 1. Fetch Grammar Questions (1 per topic)
    const grammarPromises = GRAMMAR_TOPICS.map(async (topic) => {
      const { data, error } = await supabase
        .from('grammar_labs')
        .select('*')
        .eq('topic', topic)
        .limit(20); // Fetch a small pool to randomize client-side if needed, or use a better random logic

      if (error || !data || data.length === 0) return null;
      const randomItem = data[Math.floor(Math.random() * data.length)];
      const qs = Array.isArray(randomItem.question) ? randomItem.question : [randomItem.question];
      const randomQ = qs[Math.floor(Math.random() * qs.length)];
      
      const normalized = normalizeQuestion(randomQ, topic);
      return {
        ...normalized,
        id: randomItem.id,
        labType: 'grammar',
        topic: topic
      } as DenemeQuestion;
    });

    // 2. Fetch Skills Questions (1 per topic, excluding cloze)
    const skillsPromises = SKILL_TOPICS.map(async (topic) => {
      const { data, error } = await supabase
        .from('skills_labs')
        .select('*')
        .eq('topic', topic)
        .limit(20);

      if (error || !data || data.length === 0) return null;
      const randomItem = data[Math.floor(Math.random() * data.length)];
      const qs = Array.isArray(randomItem.question) ? randomItem.question : [randomItem.question];
      const randomQ = qs[Math.floor(Math.random() * qs.length)];
      
      const normalized = normalizeQuestion(randomQ, topic);
      return {
        ...normalized,
        id: randomItem.id,
        labType: 'skills',
        topic: topic
      } as DenemeQuestion;
    });

    // 3. Fetch 1 Reading Passage
    const fetchReading = async () => {
      const { data, error } = await supabase
        .from('reading_labs')
        .select('*')
        .limit(50); // Pool of reading labs

      if (error || !data || data.length === 0) return [];
      const selectedLab = data[Math.floor(Math.random() * data.length)];
      
      const passageQuestions = ((selectedLab.questions as any[]) || []).map(q => {
        const normalized = normalizeQuestion(q, 'reading');
        return {
          ...normalized,
          labType: 'reading',
          passage: selectedLab.passage,
          id: `${selectedLab.id}_${q.id || Math.random()}`
        };
      });
      
      console.log(`Loaded ${passageQuestions.length} reading questions.`);
      return passageQuestions as DenemeQuestion[];
    };

    const [grammarResults, skillsResults, readingResults] = await Promise.all([
      Promise.all(grammarPromises),
      Promise.all(skillsPromises),
      fetchReading()
    ]);

    // Combine and Filter Nulls
    const denemeSet: DenemeQuestion[] = [
      ...(grammarResults.filter(q => q !== null) as DenemeQuestion[]),
      ...(skillsResults.filter(q => q !== null) as DenemeQuestion[]),
      ...readingResults
    ];

    return denemeSet;
  } catch (err) {
    console.error("Deneme Fetch Error:", err);
    throw err;
  }
}
