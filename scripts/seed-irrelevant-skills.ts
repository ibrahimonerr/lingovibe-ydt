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
    PER_TOPIC: 1, // 2 iterations per topic
    QUESTIONS_PER_BATCH: 1
};

const SKILLS_TOPICS = [
    "Irrelevant Sentence"
];

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
                if (!jsonMatch) throw new Error("Could not find valid JSON in response.");
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
                console.warn(`⚠️ Gemini failed (attempt ${attempt}): ${geminiError.message}. Falling back to Groq...`);
                rawText = await generateWithGroq(prompt);
            }

            const jsonMatch = rawText.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
            if (!jsonMatch) {
                throw new Error("Could not find valid JSON in response.");
            }
            return JSON.parse(jsonMatch[0]);
        } catch (e: any) {
            console.warn(`⚠️ Attempt ${attempt} failed: ${e.message}`);
            if (attempt === retries) throw e;
            await delay(5000);
        }
    }
}

async function seedIrrelevantSkills() {
    console.log(`\n🎯 Generating Irrelevant Labs (${SKILLS_TOPICS.length} topics x 10 questions each)...\n`);

    for (const topic of SKILLS_TOPICS) {
        for (let i = 0; i < COUNTS.PER_TOPIC; i++) {
            console.log(`[Skills - ${topic}] Generating batch ${i + 1}/${COUNTS.PER_TOPIC}...`);

            try {
                let segmentPrompt = "";
                let jsonStructure = "";

                if (topic === "Irrelevant Sentence") {
                    segmentPrompt = `Generate 3 'Irrelevant Sentence' (Anlam Bütünlüğünü Bozan Cümle) questions.
CRITICAL CONSTRAINTS:
1. Generate EXACTLY 5 sentences per paragraph, numbered (I), (II), (III), (IV), (V) at the start of each sentence. Let them total 75-100 words.
2. 4 sentences MUST be highly cohesive, discussing a specific academic topic (e.g., The psychological effects of deep-space travel on astronauts).
3. 1 sentence (the Irrelevant one) MUST contain the same general keywords but break the logical thread. It could shift the scope (e.g., from psychology to engine technology), change the chronological tense for no reason, or provide a fact not related to the specific argument being made.

JSON Layout Format:
{
  "quiz": [
    {
      "question": "(I) Sentence 1. (II) Sentence 2. (III) Sentence 3. (IV) Sentence 4. (V) Sentence 5.",
      "options": {
        "A": "I",
        "B": "II",
        "C": "III",
        "D": "IV",
        "E": "V"
      },
      "correct_answer": "Letter",
      "hint": "[TURKISH hint about time-shift or tone-drift]",
      "feedback": {
        "correct_logic": "[TURKISH explanation of why that specific sentence breaks cohesion]",
        "trap_analysis": "[TURKISH explanation of the keyword trap used by the irrelevant sentence]",
        "exam_tactic": "[TURKISH YDT tactic]",
        "contextual_translation": "[Turkish translation of the 5 sentences]"
      }
    }
  ]
}`;
                }

                const prompt = `You are a YDT (Turkish University English Exam) content creator. Output ONLY valid JSON.

[SYSTEM INSTRUCTION]
Topic: ${topic}
Task: ${segmentPrompt}

== CRITICAL LANGUAGE RULES ==
1. The question paragraph and options MUST be 100% in ENGLISH. NEVER TRANSLATE THEM TO TURKISH.
2. The feedback (explanations) MUST be in TURKISH.

Quantity: EXACTLY 3 items in the "quiz" array.
Return ONLY valid JSON. Do not write any conversational text.`;

                const parsed = await generateWithGeminiFallback(prompt);

                if (parsed && Array.isArray(parsed.quiz)) {
                    const { error } = await supabase.from('skills_labs').insert(
                        parsed.quiz.map((q: any) => ({
                            topic: 'Irrelevant',
                            question: q
                        }))
                    );

                    if (error) throw error;
                    console.log(`✅ [Skills - Irrelevant] Saved set ${i + 1}.`);
                } else {
                    console.warn(`⚠️ [Skills - Irrelevant] Skipping set ${i + 1} (no valid 'quiz' array).`);
                }
            } catch (e: any) {
                console.error(`❌ [Skills - Irrelevant] Error on set ${i + 1}:`, e.message);
            }

            await delay(3000);
        }
    }
}

async function main() {
    console.log("🚀 Starting Irrelevant Sentence Seed Data Generation...");
    await seedIrrelevantSkills();
    console.log("\n✨ Seeding tasks completed!");
    process.exit(0);
}

main().catch(console.error);
