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
    PER_BATCH: 1, // Number of batches to generate
    QUESTIONS_PER_BATCH: 5
};

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

async function generateWithGroq(prompt: string): Promise<string> {
    const chatCompletion = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.3-70b-versatile',
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
                    console.warn(`⚠️ Gemini Quota Exceeded. Switching to Groq permanently for this run...`);
                    geminiQuotaExceeded = true;
                    return await generateWithGeminiFallback(prompt, retries);
                }
                console.warn(`⚠️ Gemini failed (attempt ${attempt}): ${geminiError.message}. Falling back to Groq...`);
                rawText = await generateWithGroq(prompt);
            }

            const jsonMatch = rawText.match(/\{[\s\S]*\}/);
            if (!jsonMatch) throw new Error("Could not find JSON in response");
            return JSON.parse(jsonMatch[0]);
        } catch (e: any) {
            console.warn(`⚠️ Attempt ${attempt} failed: ${e.message}`);
            if (attempt === retries) throw e;
            await delay(5000);
        }
    }
}

async function seedReading() {
    console.log(`\n📚 Generating Reading Labs (${COUNTS.PER_BATCH} batches of 5 questions each)...\n`);

    for (let i = 0; i < COUNTS.PER_BATCH; i++) {
        console.log(`[Reading] Generating batch ${i + 1}/${COUNTS.PER_BATCH}...`);

        try {
            const prompt = `Task: Generate a high-quality academic English reading passage (about 200-250 words) suitable for YDT (Advanced level). 
Then generate EXACTLY 5 multiple-choice questions based on this passage.

Topics to choose from (pick one randomly): Science, History, Environment, Psychology, Technology, or Art.

Structure each question to test different reading skills:
1. Main idea/Title of the passage.
2. Specific detail (Scanning).
3. Inference (What is implied?).
4. Vocabulary in context (What does 'X' word mean in line Y?).
5. Reference (What does 'it/they/this' refer to?).

Level: YDT/Advanced
Format: valid JSON only

Structure:
{
  "passage": "Full passage text here...",
  "quiz": [
    {
      "question": "Question text...",
      "options": {"A": "...", "B": "...", "C": "...", "D": "...", "E": "..."},
      "correct": "Letter only",
      "hint": "Türkçe ipucu. Parçanın neresine bakılmalı?",
      "quote": "The exact sentence from the passage that justifies the answer.",
      "explanation": "ANLAM: (Sorunun/ilgili kısmın çevirisi) | TACTIC: (Sorunun neden o şık olduğunu açıklayan Türkçe teknik analiz)"
    }
  ]
}

CRITICAL: 
1. Explanation and Hint MUST be in TURKISH.
2. The 'quiz' array MUST have 5 questions.
3. Return ONLY the JSON object.`;

            const parsed = await generateWithGeminiFallback(prompt);

            if (parsed && parsed.passage && Array.isArray(parsed.quiz)) {
                const { error } = await supabase.from('reading_labs').insert([
                    { passage: parsed.passage, questions: parsed.quiz }
                ]);
                if (error) throw error;
                console.log(`✅ [Reading] Saved batch ${i + 1} with ${parsed.quiz.length} questions.`);
            }
        } catch (e: any) {
            console.error(`❌ [Reading] Error on batch ${i + 1}:`, e.message);
        }
        await delay(3000);
    }
}

async function main() {
    console.log("🚀 Starting Reading Seed Data Generation...");
    await seedReading();
    console.log("\n✨ Reading seeding completed!");
    process.exit(0);
}

main().catch(console.error);
