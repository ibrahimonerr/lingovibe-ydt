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
      return {
        ...randomItem.question,
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
      return {
        ...randomItem.question,
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
      
      const passageQuestions = ((selectedLab.questions as any[]) || []).map(q => ({
        ...q,
        labType: 'reading',
        passage: selectedLab.passage,
        id: `${selectedLab.id}_${q.id || Math.random()}`
      }));
      
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
