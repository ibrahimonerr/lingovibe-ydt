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
    PER_BATCH: 5,
    PER_SET: 5
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
                console.warn(`⚠️ Groq Attempt ${attempt} failed: ${e.message}`);
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

async function seedInContext() {
    console.log(`\n👁️ Generating In-Context Vocab Labs (${COUNTS.PER_BATCH} batches of 5 questions each)...\n`);

    for (let i = 0; i < COUNTS.PER_BATCH; i++) {
        console.log(`[In-Context] Generating batch ${i + 1}/${COUNTS.PER_BATCH}...`);

        try {
            const prompt = `Task: Generate 5 advanced English 'Vocabulary in Context' multiple-choice questions for YDT level.
Each question should feature a complex sentence (15-25 words) with one target word replaced by a blank '_____'.

The target words should be academic verbs, adjectives, or adverbs commonly found in YDT (e.g., fluctuate, ambiguous, predominantly, exacerbate, preliminary).

Distractors (wrong options) should be grammatically correct but logically/semantically incorrect for the specific context.

Structure:
{
  "quiz": [
    {
      "question": "Sentence with _____ blank...",
      "options": {"A": "...", "B": "...", "C": "...", "D": "...", "E": "..."},
      "correct": "Letter",
      "hint": "Türkçe ipucu. Cümledeki hangi anahtar kelime ipucu veriyor?",
      "explanation": "ANLAM: (Cümlenin çevirisi) | TACTIC: (Doğru kelimenin neden seçildiğini ve diğerlerinin neden olmadığını açıklayan Türkçe analiz)"
    }
  ]
}

CRITICAL: 
1. Explanation and Hint MUST be in TURKISH.
2. EXACTLY 5 questions per batch.
3. Return ONLY valid JSON.`;

            const parsed = await generateWithGeminiFallback(prompt);

            if (parsed && Array.isArray(parsed.quiz)) {
                // Assuming we use vocab_labs table or similar. 
                // In your UI, vocab context usually uses a generic 'vocab_labs' or similar if implemented.
                // If there's no specific table, we'll use a new one or 'skills_labs' with a specific topic name.
                // Let's check for 'vocab_labs' table existence indirectly by trying to insert.
                const { error } = await supabase.from('vocab_labs').insert([
                    { mode: 'context', question: parsed.quiz }
                ]);

                if (error) {
                    console.error("Supabase Error (Maybe vocab_labs table doesn't exist?):", error.message);
                    // Fallback to skills_labs if vocab_labs doesn't exist
                    const { error: error2 } = await supabase.from('skills_labs').insert([
                        { topic: 'In-Context Vocab', question: parsed.quiz }
                    ]);
                    if (error2) throw error2;
                    console.log(`✅ [In-Context] Saved to skills_labs (Topic: In-Context Vocab) - Batch ${i + 1}`);
                } else {
                    console.log(`✅ [In-Context] Saved to vocab_labs - Batch ${i + 1}`);
                }
            }
        } catch (e: any) {
            console.error(`❌ [In-Context] Error on batch ${i + 1}:`, e.message);
        }
        await delay(3000);
    }
}

async function main() {
    console.log("🚀 Starting In-Context Vocab Seed Data Generation...");
    await seedInContext();
    console.log("\n✨ In-Context Vocab seeding completed!");
    process.exit(0);
}

main().catch(console.error);
