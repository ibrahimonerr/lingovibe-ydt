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
                        { role: "system", content: "Rol Tanımı: Sen, kıdemli bir okuma anlama uzmanısın. Akademik derinliği olan (B2-C1) özgün İngilizce okuma parçaları ve bunlara bağlı 5 soru hazırla. Return ONLY valid JSON." },
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
    console.log(`\n📖 Generating Reading Labs (${COUNTS.PER_BATCH} passages with 5 questions each)....\n`);

    for (let i = 0; i < COUNTS.PER_BATCH; i++) {
        console.log(`[Reading] Generating batch ${i + 1}/${COUNTS.PER_BATCH}...`);

        try {
            const prompt = `Task: Akademik derinliği olan (B2-C1) özgün İngilizce okuma parçası ve buna bağlı 5 soru hazırla.
 
Pasaj Kuralları:
- Uzunluk: 150-250 kelime.
- Kayıt: Akademik, resmi (Environmental Science, Psychology, Sociology, Neuroscience, History, Archaeology, Technology Ethics vb.).
- Dil: Relative clauses, passive voice, advanced conjunctions içeren kompleks yapı.

Soru Türleri:
1. Ana Fikir / Başlık.
2. Detay Sorgulama (Scanning).
3. Çıkarım (Inference).
4. Bağlamdan Kelime Anlamı.
5. Referans Kelime (it/they/this).

Format: Çıktıyı MUTLAKA aşağıdaki JSON formatında ver.
{
  "passage": "Pasaj metni...",
  "quiz": [
    {
      "question": "Soru metni...",
      "options": {"A": "...", "B": "...", "C": "...", "D": "...", "E": "..."},
      "correct": "Letter (e.g. A)",
      "hint": "🔍 Hint: Parçadaki doğrudan referansı veya ipucu cümlesini belirt. ASLA doğru cevabı içine yazma.",
      "quote": "Cevabın dayanağı olan tam cümleyi metinden kopyala.",
      "feedback": {
        "logic_flow": "💡 The Logic Flow: Sorunun çözüm yolunu ve doğru şıkka nasıl ulaşılacağını açıkla.",
        "pitfall": "⚠️ \"Sakın Düşme!\" (The Pitfall): En güçlü çeldiricinin neden yanlış olduğunun teknik açıklaması."
      }
    }
  ]
}
CRITICAL: 
1. Explanation and Hint MUST be in TURKISH.
2. The 'quiz' array MUST have EXACTLY 5 questions.
3. Each question must test a DIFFERENT skill.
4. Return ONLY the JSON object, starting with { and ending with }.`;

            const parsed = await generateWithGPT4oMini(prompt);

            if (parsed && parsed.passage && Array.isArray(parsed.quiz)) {
                const { error } = await supabase.from('reading_labs').insert([
                    {
                        passage: parsed.passage,
                        questions: parsed.quiz // UI expects 'questions', not 'quiz'
                    }
                ]);
                if (error) {
                    console.error(`❌ [Reading] Database Insert Error:`, error.message);
                    throw error;
                }
                console.log(`✅ [Reading] Saved passage ${i + 1} (${parsed.quiz.length} questions)`);
            } else {
                console.log(`❌ [Reading] Invalid JSON shape.`);
            }
        } catch (e: any) {
            console.error(`❌ [Reading] Error on batch ${i + 1}:`, e.message);
            throw e; // Propagate error to seed-all.ts
        }

        await delay(5000);
    }
}

async function main() {
    console.log("🚀 Starting Reading Seed Data Generation...");
    try {
        await seedReading();
        console.log("\n✨ Reading seeding tasks completed!");
        process.exit(0);
    } catch (err) {
        console.error("\n❌ Reading seeding failed critical error.");
        process.exit(1);
    }
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
