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
    PER_BATCH: 1, // Günlük 50 hak olduğu için 1-2 batch idealdir
    QUESTIONS_PER_BATCH: 5
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
                        { role: "system", content: "You are an expert YDT (English) exam question creator. Return ONLY valid JSON." },
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

async function seedReading() {
    console.log(`\n📖 Generating Reading Labs (${COUNTS.PER_BATCH} passages with 5 questions each)...\n`);

    for (let i = 0; i < COUNTS.PER_BATCH; i++) {
        console.log(`[Reading] Generating batch ${i + 1}/${COUNTS.PER_BATCH}...`);

        try {
            const prompt = `Task: Generate a high-quality academic English reading passage suitable for YDT (Advanced level).

PASSAGE RULES:
- Length: 150-250 words, single coherent passage.
- Register: Academic, formal. B2-C1 vocabulary naturally embedded.
- Topics (pick one randomly): Environmental Science, Psychology, History, Neuroscience, Sociology, Art History, Archaeology, Technology Ethics.
- Include complex sentence structures: relative clauses, passive voice, conditionals, advanced conjunctions.
- Must contain at least 3-4 B2-C1 vocabulary words used in context.

Then generate EXACTLY 5 multiple-choice questions based on this passage. Each question tests a DIFFERENT reading skill:
1. Main idea / Best title for the passage.
2. Specific detail (Scanning — "According to the passage...").
3. Inference (What is implied? What can be inferred?).
4. Vocabulary in context (What does the word 'X' in paragraph Y most likely mean?).
5. Reference (What does 'it/they/this/these' in line X refer to?).

Level: YDT/Advanced
Format: valid JSON only

Structure:
{
  "passage": "Full passage text here...",
  "quiz": [
    {
      "question": "Question text...",
      "options": {"A": "...", "B": "...", "C": "...", "D": "...", "E": "..."},
      "correct": "Letter (e.g. A)",
      "hint": "Türkçe ipucu. Parçanın neresine bakılmalı? Hangi paragraf veya cümle?",
      "quote": "The exact sentence from the passage that justifies the answer.",
      "explanation": "ANLAM: (Sorunun/ilgili kısmın Türkçe çevirisi) | TACTIC: (Türkçe teknik analiz — neden o şık doğru, diğerleri neden yanlış)"
    }
  ]
}

CRITICAL: 
1. Explanation and Hint MUST be in TURKISH.
2. The 'quiz' array MUST have EXACTLY 5 questions.
3. Each question must test a DIFFERENT skill (main idea, detail, inference, vocabulary, reference).
4. Return ONLY the JSON object, starting with { and ending with }.`;

            const parsed = await generateWithGPT4oMini(prompt);

            if (parsed && parsed.passage && Array.isArray(parsed.quiz)) {
                const { error } = await supabase.from('reading_labs').insert([
                    { passage: parsed.passage, quiz: parsed.quiz }
                ]);
                if (error) throw error;
                console.log(`✅ [Reading] Saved passage ${i + 1} (${parsed.quiz.length} questions)`);
            } else {
                console.log(`❌ [Reading] Invalid JSON shape.`);
            }
        } catch (e: any) {
            console.error(`❌ [Reading] Error on batch ${i + 1}:`, e.message);
        }

        await delay(5000);
    }
}

async function main() {
    console.log("🚀 Starting Reading Seed Data Generation...");
    await seedReading();
    console.log("\n✨ Reading seeding tasks completed!");
    process.exit(0);
}

main().catch(console.error);
