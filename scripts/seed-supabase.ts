import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const geminiApiKey = process.env.GEMINI_API_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials in .env.local");
    process.exit(1);
}

if (!geminiApiKey) {
    console.error("Missing GEMINI_API_KEY in .env.local");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const genAI = new GoogleGenerativeAI(geminiApiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

// Number of records to generate per specific topic
const COUNTS = {
    READING: 10,
    PER_TOPIC: 5
};

// Exact Subtopics from UI (src/app/page.tsx)
const GRAMMAR_TOPICS = ["Tenses & Aspect", "Modals", "Passive", "Conditionals", "Conjunctions", "Prepositions"];
const SKILLS_TOPICS = ["Cloze Test", "Sentence Completion", "Restatement", "Paragraph Completion", "Irrelevant"];

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

import Groq from 'groq-sdk';
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function generateWithGroq(prompt: string): Promise<string> {
    const chatCompletion = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.7,
        max_tokens: 2000,
    });
    return chatCompletion.choices[0]?.message?.content || "";
}

async function generateWithGeminiFallback(prompt: string, retries = 3): Promise<any> {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            let rawText = "";
            try {
                // Priority 1: Gemini
                const result = await model.generateContent(prompt);
                rawText = result.response.text();
            } catch (geminiError: any) {
                const is429 = geminiError.message?.includes('429') || geminiError.status === 429;
                console.warn(`⚠️ Gemini failed (attempt ${attempt}): ${geminiError.message}. ${is429 ? 'Quota hit, switching to Groq...' : 'Falling back to Groq...'}`);
                // Priority 2: Groq fallback
                rawText = await generateWithGroq(prompt);
            }

            const jsonMatch = rawText.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error("Could not find JSON in response: " + rawText.substring(0, 100) + "...");
            }
            return JSON.parse(jsonMatch[0]);
        } catch (e: any) {
            if (e.message?.includes('429')) {
                console.warn(`⚠️ Rate limit hit on both providers. Waiting 15s before retry ${attempt}/${retries}...`);
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

async function seedReading() {
    console.log(`\n📚 Generating ${COUNTS.READING} Reading Labs...`);

    for (let i = 0; i < COUNTS.READING; i++) {
        console.log(`[Reading] Generating ${i + 1}/${COUNTS.READING}...`);
        try {
            const prompt = `Generate a short English reading passage (about 100-150 words) suitable for YDT (Turkish university language exam) along with 3 multiple-choice questions in valid JSON format.
{
  "passage": "passage text...",
  "quiz": [
    {
      "question": "question text...",
      "options": {"A": "...", "B": "...", "C": "...", "D": "...", "E": "..."},
      "correct": "A",
      "hint": "Türkçe ipucu. Hangi satıra veya kelimeye odaklanmalı?",
      "quote": "The EXACT sentence or phrase from the passage where the answer is found. Must match passage text perfectly.",
      "explanation": "ANLAM: ... | TACTIC: ..."
    }
  ]
}
Return only JSON block. Ensure explanation is in Turkish.`;

            const parsed = await generateWithGeminiFallback(prompt);

            if (parsed && parsed.quiz && parsed.passage) {
                const { error } = await supabase.from('reading_labs').insert([
                    { passage: parsed.passage, questions: parsed.quiz }
                ]);
                if (error) throw error;
                console.log(`✅ [Reading] Saved ${i + 1}/${COUNTS.READING}`);
            } else {
                console.log(`❌ [Reading] Invalid JSON shape.`);
            }
        } catch (e: any) {
            console.error(`❌ [Reading] Error on iteration ${i + 1}:`, e.message);
        }

        // Groq is fast and has high limits, wait only 3 seconds
        if (i < COUNTS.READING - 1) await delay(3000);
    }
}

async function seedGrammar() {
    console.log(`\n✍️ Generating Grammar Labs (${GRAMMAR_TOPICS.length} topics x ${COUNTS.PER_TOPIC} sets)...`);

    for (const topic of GRAMMAR_TOPICS) {
        for (let i = 0; i < COUNTS.PER_TOPIC; i++) {
            console.log(`[Grammar - ${topic}] Generating ${i + 1}/${COUNTS.PER_TOPIC}...`);

            try {
                const prompt = `Generate 3 English grammar multiple-choice questions for YDT (Turkish university language exam) level in valid JSON format.
Topic: ${topic}
{
  "quiz": [
    {
      "question": "question text...",
      "options": {"A": "...", "B": "...", "C": "...", "D": "...", "E": "..."},
      "correct": "A",
      "hint": "Türkçe ipucu. Hangi dilbilgisi kuralına veya anahtar kelimeye odaklanmalı?",
      "explanation": "ANLAM: ... | TACTIC: ..."
    }
  ]
}
Return only JSON block without markdown wrappers if possible. Ensure explanation is in Turkish.`;

                const parsed = await generateWithGeminiFallback(prompt);

                if (parsed && parsed.quiz && Array.isArray(parsed.quiz)) {
                    const { error } = await supabase.from('grammar_labs').insert([
                        { topic, question: parsed.quiz }
                    ]);
                    if (error) throw error;
                    console.log(`✅ [Grammar] Saved ${topic} - Set ${i + 1}`);
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

async function seedSkills() {
    console.log(`\n🎯 Generating Skills Labs (${SKILLS_TOPICS.length} topics x ${COUNTS.PER_TOPIC} sets)...`);

    for (const topic of SKILLS_TOPICS) {
        for (let i = 0; i < COUNTS.PER_TOPIC; i++) {
            console.log(`[Skills - ${topic}] Generating ${i + 1}/${COUNTS.PER_TOPIC}...`);

            try {
                const prompt = `Generate 3 English ${topic} multiple-choice questions for YDT (Turkish university language exam) level in valid JSON format.
{
  "quiz": [
    {
      "question": "question text...",
      "options": {"A": "...", "B": "...", "C": "...", "D": "...", "E": "..."},
      "correct": "A",
      "hint": "Türkçe ipucu. Hangi bağlaca veya yapısal ilişkiye dikkat etmeli?",
      "explanation": "ANLAM: ... | TACTIC: ..."
    }
  ]
}
Return only JSON block without markdown wrappers if possible. Ensure explanation is in Turkish.`;

                const parsed = await generateWithGeminiFallback(prompt);

                if (parsed && parsed.quiz && Array.isArray(parsed.quiz)) {
                    const { error } = await supabase.from('skills_labs').insert([
                        { topic, question: parsed.quiz }
                    ]);
                    if (error) throw error;
                    console.log(`✅ [Skills] Saved ${topic} - Set ${i + 1}`);
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
    console.log("🚀 Starting YDT Seed Data Generation...");
    console.log("========================================");
    console.log("🤖 Priority: Gemini → Groq fallback");
    console.log(`📊 Per topic: ${COUNTS.PER_TOPIC} sets\n`);

    // await seedReading();  // uncomment to also seed reading
    await seedGrammar();
    await seedSkills();

    console.log("\n✨ All seeding tasks completed!");
    process.exit(0);
}

main().catch(console.error);
