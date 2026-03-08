import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const githubToken = process.env.GITHUB_TOKEN;

if (!supabaseUrl || !supabaseKey || !githubToken) {
    console.error("Missing Supabase or GitHub credentials in .env.local");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const COUNTS = {
    PER_TOPIC: 1 // Günlük 50 hak olduğu için 1 set idealdir
};

const SKILLS_TOPICS = [
    "Cloze Test",
    "Sentence Completion",
    "Translation (EN-TR)",
    "Translation (TR-EN)",
    "Dialogue Completion",
    "Situation",
    "Restatement",
    "Paragraph Completion",
    "Irrelevant"
];

const SKILLS_SPECIFIC_PROMPTS: Record<string, string> = {
    "Cloze Test": `Generate 1 YDT-level Cloze Test passage. 
RULES:
- Passage: 80-120 words on an academic topic (science, sociology, etc.).
- Blanks: Exactly 5 numbered blanks (e.g., ... known as (1) ____ the ...).
- Questions: 5 multiple-choice questions (A-E) testing mixed skills (1 tense, 1 preposition, 1 conjunction/connector, 1 vocabulary word, 1 modal or relative clause).
- Register: Formal, advanced English.`,

    "Sentence Completion": `Generate 3 YDT-level Sentence Completion questions.
RULES:
- A stem sentence fragment ending or starting with a comma (e.g., "Although the research was initially promising, ____").
- Stem length: 20-35 words, formal register.
- Options: 5 grammatically and logically possible completions. Distractors should test logical connectors (causality, contrast, result).
- Subject Matter: Global issues, technology, scientific phenomena, education.`,

    "Translation (EN-TR)": `Generate 3 YDT-level English to Turkish translation questions.
RULES:
- English sentence: 25-40 words, academic/formal register, containing complex structures (passive voice, relative clauses).
- Turkish options: 5 options that are very similar but have subtle differences in meaning, emphasis, or tense. 
- Goal: Capture the EXACT meaning of the English sentence in professional Turkish.`,

    "Translation (TR-EN)": `Generate 3 YDT-level Turkish to English translation questions.
RULES:
- Turkish sentence: Formal, academic, 20-35 words long.
- English options: 5 options testing precision in vocabulary (e.g., distinguish between 'mitigate' and 'alleviate') and complex English grammar.
- Goal: Precise capture of the Turkish original's semantic nuances and emphasis.`,

    "Dialogue Completion": `Generate 3 YDT-level Dialogue Completion questions.
RULES:
- A formal/semi-formal dialogue between two people (e.g., academic advisor and student, two researchers).
- Structure: Person A (statement) -> Person B (blank ____) -> Person A (follow-up/reaction that gives clue to the blank).
- Options: 5 responses for the blank. Distractors should be polite but logically incoherent with the follow-up sentence.`,

    "Situation": `Generate 3 YDT-level Situation questions.
RULES:
- A scenario: 3-4 sentences describing a specific social or professional situation. The scenario MUST be in ENGLISH.
- Requirement: Use international/English names for characters (e.g., Mark, Sarah, instead of Turkish ones).
- Question: "You say: ____" (MUST be in ENGLISH).
- Options: 5 English responses. One is perfect for the context; others are too rude, too formal, or irrelevant to the specific prompt.
- Example: "A co-worker has made a minor mistake. You want to point it out gently. What do you say?"`,

    "Restatement": `Generate 3 YDT-level Restatement questions.
RULES:
- A complex English sentence (25-40 words) with multiple clauses and high-level vocabulary.
- The target sentence MUST be in ENGLISH.
- Options: 5 sentences (MUST be in ENGLISH). The correct one must express the EXACT same meaning with different words/structures.
- No information should be added or removed from the original meaning in the correct answer.`,

    "Paragraph Completion": `Generate 3 YDT-level Paragraph Completion questions.
RULES:
- A paragraph of 4-5 sentences in ENGLISH where one sentence is missing (____). The missing sentence can be at the beginning, middle, or end.
- Context: Coherent academic text.
- Options: 5 sentences in ENGLISH. The correct one must maintain the logical flow and tone of the paragraph. Distractors should be off-topic or logically inconsistent.`,

    "Irrelevant": `Generate 3 YDT-level 'Irrelevant Sentence' (Odd-one out) questions.
RULES:
- A paragraph consisting of 5 numbered sentences (I, II, III, IV, V) in ENGLISH.
- Context: Academic or informative.
- Task: One sentence disrupts the logical flow or focus of the paragraph. 
- Distractors: All sentences should share the same general topic, but one is subtly off-topic or inconsistent in tone.`
};

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

async function generateWithGPT4oMini(prompt: string, retries = 5): Promise<any> {
    const endpoint = "https://models.inference.ai.azure.com/chat/completions";

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${githubToken}`
                },
                body: JSON.stringify({
                    messages: [
                        { role: "system", content: "You are an expert YDT (English) exam question creator. MANDATORY: The question stem, scenarios, passages, dialogues, and options MUST be in ENGLISH. ONLY the explanation and hint fields MUST be in TURKISH. Return ONLY valid JSON." },
                        { role: "user", content: prompt }
                    ],
                    model: "gpt-4o-mini",
                    temperature: 0.7,
                    max_tokens: 4000
                })
            });

            if (response.status === 429) {
                const waitTime = 30000 * attempt;
                console.warn(`⏳ GitHub Rate Limit (429). Waiting ${waitTime / 1000}s before retry ${attempt}/${retries}...`);
                await delay(waitTime);
                continue;
            }

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(`GitHub API Error: ${response.status} - ${errText}`);
            }

            const data = await response.json();
            const rawText = data.choices[0].message.content;

            const jsonMatch = rawText.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
            if (!jsonMatch) throw new Error("Could not find JSON in response");
            return JSON.parse(jsonMatch[0]);

        } catch (e: any) {
            console.error(`⚠️ Attempt ${attempt} failed: ${e.message}`);
            if (attempt === retries) throw e;
            await delay(5000);
        }
    }
    throw new Error("All GPT-4o-mini retries exhausted");
}

async function seedSkills() {
    console.log(`\n🎯 Generating Skills Labs (${SKILLS_TOPICS.length} topics x ${COUNTS.PER_TOPIC} sets of questions)...\n`);

    for (const topic of SKILLS_TOPICS) {
        for (let i = 0; i < COUNTS.PER_TOPIC; i++) {
            console.log(`[Skills - ${topic}] Generating set ${i + 1}/${COUNTS.PER_TOPIC}...`);

            try {
                const topicPrompt = SKILLS_SPECIFIC_PROMPTS[topic] || `Generate 3 English ${topic} multiple-choice questions.`;

                const prompt = `Task: ${topicPrompt}
Topic: ${topic}
Level: YDT (Turkish university language exam - Advanced English)
Quantity: EXACTLY 3 questions (If Cloze Test, 1 paragraph with 5 blanks and 5 questions. For others, standalone questions or paragraphs).
Format: valid JSON only

Structure:
{
  "quiz": [
    {
      "question": "The question text or passage with blank...",
      "options": {"A": "...", "B": "...", "C": "...", "D": "...", "E": "..."},
      "correct": "Letter (e.g. A)",
      "hint": "Türkçe ipucu. Soru tipine uygun olarak nereye dikkat edilmesi gerektiğini belirten ipucu.",
      "explanation": "ANLAM: (Parçanın/cümlenin Türkçe çevirisi) | TACTIC: (Soru çözüm stratejisi - Türkçe)"
    }
  ]
}

CRITICAL INSTRUCTIONS: 
1. The 'quiz' array MUST contain the correct number of questions (3 for most, 5 for Cloze Test).
2. ALL question text, scenarios, passages, and options MUST be in ENGLISH.
3. ONLY the 'explanation' and 'hint' fields MUST be 100% in TURKISH. No other languages allowed in the explanation.
4. For Restatement: The question should ask for the 'closest meaning'.
5. For Irrelevant: Put the Roman numerals in the text like (I) ... (II) ...
6. Return ONLY the JSON object, starting with { and ending with }.`;

                const parsed = await generateWithGPT4oMini(prompt);

                if (parsed && parsed.quiz && Array.isArray(parsed.quiz)) {
                    const { error } = await supabase.from('skills_labs').insert([
                        { topic, question: parsed.quiz }
                    ]);
                    if (error) throw error;
                    console.log(`✅ [Skills] Saved ${topic} - Set ${i + 1} (${parsed.quiz.length} questions)`);
                } else {
                    console.log(`❌ [Skills] Invalid JSON shape.`);
                }
            } catch (e: any) {
                console.error(`❌ [Skills] Error on ${topic} - set ${i + 1}:`, e.message);
            }

            await delay(3000);
        }
    }
}

async function main() {
    console.log("🚀 Starting Skills Seed Data Generation...");
    await seedSkills();
    console.log("\n✨ Skills seeding tasks completed!");
    process.exit(0);
}

main().catch(console.error);
