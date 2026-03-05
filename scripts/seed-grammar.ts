import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';
import path from 'path';
import Groq from 'groq-sdk';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const geminiApiKey = process.env.GEMINI_API_KEY;

if (!supabaseUrl || !supabaseKey || !geminiApiKey) {
    console.error("Missing Supabase or Gemini credentials in .env.local");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const genAI = new GoogleGenerativeAI(geminiApiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const COUNTS = {
    PER_TOPIC: 1 // How many iterations per topic
};

const GRAMMAR_TOPICS = ["Tenses & Aspect", "Modals", "Passive", "Conditionals", "Conjunctions", "Prepositions"];

const GRAMMAR_SPECIFIC_PROMPTS: Record<string, string> = {
    "Tenses & Aspect": `Generate 3 challenging multiple-choice questions focusing exclusively on English Tenses and Aspect (Present, Past, Future, Perfect, Continuous forms). Questions should feature context-rich sentences where the temporal relationship between clauses is crucial for determining the correct tense. Avoid simple, single-clause sentences; use complex sentences with time conjunctions (by the time, hardly...when, no sooner...than, etc.). Provide options that are grammatically plausible but logically incorrect in context.`,

    "Modals": `Generate 3 challenging multiple-choice questions focusing exclusively on English Modals and Modal Perfects (must have done, should have done, needn't have done, etc.). The questions should test the subtle differences in meaning (deduction, obligation, prohibition, theoretical possibility, past regrets). Use contexts that clearly dictate which modal meaning is required. Include past forms of modals which are commonly tested in YDT.`,

    "Passive": `Generate 3 challenging multiple-choice questions focusing on the Passive Voice, including causative forms (have/get something done), passive gerunds/infinitives (being done, to be done), and impersonal passives (it is said that...). The sentences should be academic or formal, similar to YDT standards. Options should include active voice distractors to test if the student correctly identifies the need for passive voice.`,

    "Conditionals": `Generate 3 challenging multiple-choice questions focusing on Conditionals (If Clauses Type 1, 2, 3, Mixed Conditionals) and Wish Clauses. Questions should include inversions (Had I known, Were he to come, Should it rain) and alternative conditionals (unless, provided that, as long as, supposing). Ensure the context clearly dictates the real or unreal nature of the condition and the correct time frame.`,

    "Conjunctions": `Generate 3 challenging multiple-choice questions focusing on Conjunctions, Transitions, and Discourse Markers (e.g., although, despite, nevertheless, therefore, whereas, thus). The questions should consist of two clauses/sentences with a specific logical relationship (contrast, cause-effect, addition, condition). The options should contain conjunctions from different categories to test the student's understanding of the logical flow.`,

    "Prepositions": `Generate 3 challenging multiple-choice questions focusing on Prepositions, Phrasal Verbs, and Prepositional Phrases. Questions should test verbs, adjectives, or nouns followed by specific prepositions (e.g., accuse sb OF, capable OF, reliance ON) or advanced prepositions of time/place/movement. Include abstract prepositional usage commonly found in academic texts.`
};

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

async function generateWithGroq(prompt: string): Promise<string> {
    const chatCompletion = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.7,
        max_tokens: 2500,
    });
    return chatCompletion.choices[0]?.message?.content || "";
}

let geminiQuotaExceeded = false;

async function generateWithGeminiFallback(prompt: string, retries = 3): Promise<any> {
    if (geminiQuotaExceeded) {
        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                const rawText = await generateWithGroq(prompt);
                const jsonMatch = rawText.match(/\{[\s\S]*\}/);
                if (!jsonMatch) throw new Error("Could not find JSON in response");
                return JSON.parse(jsonMatch[0]);
            } catch (e: any) {
                console.warn(`⚠️ Groq Parse/Logic Error (attempt ${attempt}): ${e.message}`);
                if (attempt === retries) throw e;
                await delay(3000);
            }
        }
    }

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            let rawText = "";
            try {
                const result = await model.generateContent(prompt);
                rawText = result.response.text();
            } catch (geminiError: any) {
                const is429 = geminiError.message?.includes('429') || geminiError.status === 429;
                if (is429) {
                    console.warn(`⚠️ Gemini Quota Exceeded. Switching all remaining requests to Groq permanently...`);
                    geminiQuotaExceeded = true;
                    return await generateWithGeminiFallback(prompt, retries);
                }
                console.warn(`⚠️ Gemini failed (attempt ${attempt}): ${geminiError.message}. Falling back to Groq for this request...`);
                rawText = await generateWithGroq(prompt);
            }

            const jsonMatch = rawText.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error("Could not find JSON in response");
            }
            return JSON.parse(jsonMatch[0]);
        } catch (e: any) {
            if (e.message?.includes('429')) {
                console.warn(`⚠️ Rate limit hit. Waiting 15s before retry ${attempt}/${retries}...`);
                await delay(15000);
                if (attempt === retries) throw e;
            } else {
                console.warn(`⚠️ Parse/Logic Error (attempt ${attempt}): ${e.message}`);
                if (attempt === retries) throw e;
                await delay(3000);
            }
        }
    }
}

async function seedGrammar() {
    console.log(`\n✍️ Generating Grammar Labs (${GRAMMAR_TOPICS.length} topics x ${COUNTS.PER_TOPIC} sets of 5 questions)...\n`);

    for (const topic of GRAMMAR_TOPICS) {
        for (let i = 0; i < COUNTS.PER_TOPIC; i++) {
            console.log(`[Grammar - ${topic}] Generating set ${i + 1}/${COUNTS.PER_TOPIC}...`);

            try {
                const topicPrompt = GRAMMAR_SPECIFIC_PROMPTS[topic] || `Generate 3 English grammar multiple-choice questions for YDT level.`;

                const prompt = `Task: ${topicPrompt}
Topic: ${topic}
Level: YDT (Turkish university language exam - Advanced English)
Quantity: EXACTLY 3 questions
Format: valid JSON only

Structure:
{
  "quiz": [
    {
      "question": "The question text, with '_____' for the blank if necessary...",
      "options": {"A": "...", "B": "...", "C": "...", "D": "...", "E": "..."},
      "correct": "A (Just the letter)",
      "hint": "Türkçe ipucu. Sorunun çözümüne giden yolu gösteren kısa bir ipucu.",
      "explanation": "ANLAM: (Cümlenin Türkçe çevirisi) | TACTIC: (Dilbilgisi kuralının ve doğru şıkkın neden doğru olduğunun Türkçe açıklaması)"
    }
  ]
}

CRITICAL INSTRUCTIONS: 
1. The 'quiz' array MUST contain EXACTLY 3 questions.
2. The 'explanation' and 'hint' MUST be 100% in TURKISH. No other languages allowed in the explanation.
3. Include clear context in sentences, they should be advanced/academic.
4. Return ONLY the JSON object, starting with { and ending with }.`;

                const parsed = await generateWithGeminiFallback(prompt);

                if (parsed && parsed.quiz && Array.isArray(parsed.quiz)) {
                    const { error } = await supabase.from('grammar_labs').insert([
                        { topic, question: parsed.quiz }
                    ]);
                    if (error) throw error;
                    console.log(`✅ [Grammar] Saved ${topic} - Set ${i + 1} (${parsed.quiz.length} questions)`);
                } else {
                    console.log(`❌ [Grammar] Invalid JSON shape.`);
                }
            } catch (e: any) {
                console.error(`❌ [Grammar] Error on ${topic} - set ${i + 1}:`, e.message);
            }

            await delay(3000);
        }
    }
}

async function main() {
    console.log("🚀 Starting Grammar Seed Data Generation...");
    await seedGrammar();
    console.log("\n✨ Grammar seeding tasks completed!");
    process.exit(0);
}

main().catch(console.error);
