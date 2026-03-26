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
  PER_MODE: 1, // 4 modes x 3 questions = 12 total questions per run
  QUESTIONS_PER_BATCH: 3
};

const VOCAB_MODES = ["meaning_shifter", "definition_hunt", "synonym_hunt", "antonym_hunt"];

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
                        { role: "system", content: "Sen, 20 yıllık deneyime sahip bir YDT/YDS ölçme ve değerlendirme uzmanısın. ELS ve benzeri akademik yayınların soru hazırlama mantığına tamamen hakimsin. Return ONLY valid JSON." },
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

async function seedVocab() {
    console.log(`\n📚 Generating New 4-Module Vocabulary Labs (4 modes x ${COUNTS.PER_MODE} batches)...\n`);

    for (const mode of VOCAB_MODES) {
        for (let i = 0; i < COUNTS.PER_MODE; i++) {
            console.log(`[Vocab - ${mode}] Generating batch ${i + 1}/${COUNTS.PER_MODE}...`);

            try {
                let segmentPrompt = "";
                let jsonStructure = "";

                if (mode === "meaning_shifter") {
                    segmentPrompt = `Role: YDT/YDS İngilizce uzmanı. Phrasal verb ve preposition nüansları testi. Boşluktan sonraki edatın veya kelimenin cümledeki işlevine odaklanan çeldiriciler kurgula.`;
                    jsonStructure = `{
  "question": "The manager decided to ___ the proposal carefully before making a final decision.",
  "paths": { "A": "look into", "B": "look over" },
  "correct_path": "B",
  "feedback": {
    "A": "Açıklama...",
    "B": "Açıklama...",
    "hint": "🔍 Hint: ...",
    "pitfall": "⚠️ Sakın Düşme!: ..."
  }
}`;
                } else if (mode === "definition_hunt") {
                    segmentPrompt = `Role: Akademik kelime öğretimi uzmanı dil bilimci. B2+/C1 seviyesinde bir paragraf yaz ve içinden bir akademik kelimeyi 'tanımlar' üzerinden sorgula.`;
                    jsonStructure = `{
  "passage": "Passage text containing the correct_word...",
  "target_definition": "Bir durumu daha da kötüleştirmek.",
  "correct_word": "exacerbate",
  "hint": "🔍 Hint: ...",
  "pitfall": "⚠️ Sakın Düşme!: Metindeki diğer kelimeler..."
}`;
                } else if (mode === "synonym_hunt") {
                    segmentPrompt = `Role: İngilizce eş anlamlılar (synonyms) ve nüanslar uzmanı. Verilen 'target_word'ün eş anlamlısını metin içinde buldur.`;
                    jsonStructure = `{
  "passage": "Passage text containing the correct_synonym...",
  "target_word": "alleviate",
  "correct_synonym": "mitigate",
  "hint": "🔍 Hint: ...",
  "pitfall": "⚠️ Sakın Düşme!: Metindeki diğer kelimeler..."
}`;
                } else if (mode === "antonym_hunt") {
                    segmentPrompt = `Role: Anlamsal karşıtlıklar (contrasts) uzmanı eğitmen. Verilen 'target_word'ün zıt anlamlısını metin içinde buldur.`;
                    jsonStructure = `{
  "passage": "Passage text containing the correct_antonym...",
  "target_word": "deteriorate",
  "correct_antonym": "improve",
  "hint": "🔍 Hint: ...",
  "pitfall": "⚠️ Sakın Düşme!: Metindeki diğer kelimeler..."
}`;
                }

                const prompt = `Task: Generate 3 academic YDT questions for the module [Mode: ${mode}].
Structure: ${jsonStructure}
Rules:
- High-level academic context (B2-C1).
- ALL English content (passages, targets, options, correct_word) MUST BE IN ENGLISH.
- ALL EXPLANATIONS, HINTS AND PITFALLS MUST BE IN TURKISH.
- Return ONLY valid JSON 'quiz' array.
- DO NOT reveal the correct word/path in the hint.`;

                const parsed = await generateWithGPT4oMini(prompt);

                if (parsed && Array.isArray(parsed.quiz)) {
                    const { error } = await supabase.from('vocab_labs').insert(
                        parsed.quiz.map((item: any) => ({
                            mode,
                            question: item // Store the entire object in 'question'
                        }))
                    );
                    if (error) throw error;
                    console.log(`✅ [Vocab] Saved ${mode} - Batch ${i + 1} (${parsed.quiz.length} items)`);
                }
            } catch (e: any) {
                console.error(`❌ [Vocab] Error on ${mode} - batch ${i + 1}:`, e.message);
                throw e;
            }
            await delay(3000);
        }
    }
}

async function main() {
    console.log("🚀 Starting Vocabulary Seed Data Generation (4-Module System)...");
    try {
        await seedVocab();
        console.log("\n✨ Vocabulary seeding tasks completed!");
        process.exit(0);
    } catch (error) {
        process.exit(1);
    }
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
