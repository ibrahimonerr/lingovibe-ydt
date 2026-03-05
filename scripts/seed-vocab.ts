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
    PER_MODE: 1, // 2 batches per mode
    QUESTIONS_PER_BATCH: 1 // 5 questions each = 10 total per mode
};

const VOCAB_MODES = ["loop", "synonym", "context", "odd"];

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

async function generateWithGroq(prompt: string): Promise<string> {
    const chatCompletion = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.1-8b-instant',
        temperature: 0.7,
        max_tokens: 3500,
    });
    return chatCompletion.choices[0]?.message?.content || "";
}

let geminiQuotaExceeded = false;

async function generateWithGeminiFallback(prompt: string, retries = 3): Promise<any> {
    if (geminiQuotaExceeded) {
        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                const rawText = await generateWithGroq(prompt);
                const jsonMatch = rawText.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
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
                    console.warn(`⚠️ Gemini Quota Exceeded. Switching to Groq permanently for this run...`);
                    geminiQuotaExceeded = true;
                    return await generateWithGeminiFallback(prompt, retries);
                }
                rawText = await generateWithGroq(prompt);
            }

            const jsonMatch = rawText.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
            if (!jsonMatch) throw new Error("Could not find JSON in response");
            return JSON.parse(jsonMatch[0]);
        } catch (e: any) {
            console.warn(`⚠️ Attempt ${attempt} failed: ${e.message}`);
            if (attempt === retries) throw e;
            await delay(5000);
        }
    }
}

async function seedVocab() {
    console.log(`\n🧠 Generating Vocab Labs (${VOCAB_MODES.length} modes x 10 questions each)...\n`);

    for (const mode of VOCAB_MODES) {
        for (let i = 0; i < COUNTS.PER_MODE; i++) {
            console.log(`[Vocab - ${mode}] Generating batch ${i + 1}/${COUNTS.PER_MODE}...`);

            try {
                let segmentPrompt = "";
                let jsonStructure = "";

                if (mode === "loop") {
                    segmentPrompt = `Generate 3 high-quality YDT (Advanced) vocabulary flashcards. 
Target words: B2-C1 academic nouns, verbs, or adjectives (e.g., deteriorate, prevalent, breakthrough, alleviate).`;
                    jsonStructure = `{
  "quiz": [
    {
      "question": "WORD_IN_UPPERCASE",
      "explanation": "ANLAM: [Turkish meaning] | SYNONYM: [3 English synonyms] | ANTONYM: [1 English antonym] | MNEMONIC: [Turkish memory hook] | CONTEXT: [A complex 15-20 word academic English sentence using the word]"
    }
  ]
}`;
                } else if (mode === "synonym") {
                    segmentPrompt = "Generate 3 YDT Synonym discovery questions testing high-level academic words.";
                    jsonStructure = `{
  "quiz": [
    {
      "question": "Choose the SYNONYM for: **WORD**",
      "options": {"A": "English...", "B": "English...", "C": "English...", "D": "English...", "E": "English..."},
      "correct": "Letter",
      "explanation": "ANLAM: [Turkish meaning] | TACTIC: [Professional YDT tip in TURKISH on how to analyze the word]"
    }
  ]
}`;
                } else if (mode === "context") {
                    segmentPrompt = `Generate 3 In-Context vocabulary questions. 
Constraint: The stem sentence MUST be complex, academic (science, history, sociology), and EXACTLY 15-25 words long. It should contain a blank ____ for the target word. Options must be words of similar type (e.g. all verbs).`;
                    jsonStructure = `{
  "quiz": [
    {
      "question": "Complex academic English sentence containing a blank ____ for the target...",
      "options": {"A": "English...", "B": "English...", "C": "English...", "D": "English...", "E": "English..."},
      "correct": "Letter",
      "explanation": "ANLAM: [Turkish translation of the sentence] | TACTIC: [Turkish explanation of why the word fits the context]"
    }
  ]
}`;
                } else if (mode === "odd") {
                    segmentPrompt = "Generate 3 'Odd-one out' questions (4 related academic words, 1 outlier in meaning).";
                    jsonStructure = `{
  "quiz": [
    {
      "question": "Which word is the ODD-ONE out?",
      "options": {"A": "English...", "B": "English...", "C": "English...", "D": "English...", "E": "English..."},
      "correct": "Letter",
      "explanation": "ANLAM: [Short Turkish meanings of all 5 words] | TACTIC: [Turkish explanation of the semantic link between the 4 words]"
    }
  ]
}`;
                }

                const prompt = `You are a YDT (Turkish University English Exam) content creator. Output ONLY valid JSON.

[SYSTEM INSTRUCTION]
Mode: ${mode}
Task: ${segmentPrompt}

== CRITICAL LANGUAGE RULES ==
1. The question and options MUST be 100% in ENGLISH. NEVER TRANSLATE THEM TO TURKISH.
2. The explanation (feedback) MUST be in TURKISH.
3. Target Vocabulary: High-quality, YDT-specific vocabulary (academic verbs, abstract nouns, phrasal verbs, advanced adjectives).
4. If a sentence is generated, it MUST be complex, formal (history, psychology, science), and 15-25 words long in ENGLISH.
5. Highlights must use double asterisks: **word**.

JSON Layout:
${jsonStructure}

Quantity: EXACTLY 3 items in the "quiz" array.
Return ONLY valid JSON.`;

                const parsed = await generateWithGeminiFallback(prompt);

                if (parsed && Array.isArray(parsed.quiz)) {
                    const { error } = await supabase.from('vocab_labs').insert(
                        parsed.quiz.map((q: any) => ({
                            mode,
                            question: q
                        }))
                    );

                    if (error) throw error;
                    console.log(`✅ [Vocab - ${mode}] Saved batch ${i + 1}.`);
                }
            } catch (e: any) {
                console.error(`❌ [Vocab - ${mode}] Error on batch ${i + 1}:`, e.message);
            }
            await delay(3000);
        }
    }
}

async function main() {
    console.log("🚀 Starting Vocab Lab Seed Data Generation...");
    await seedVocab();
    console.log("\n✨ Vocab seeding completed!");
    process.exit(0);
}

main().catch(console.error);
