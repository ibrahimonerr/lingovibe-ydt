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
                    segmentPrompt = `Role: Sen, YDT ve YDS seviyesinde İngilizce uzmanısın. Görevin, aynı fiilin farklı edatlarla (prepositions) nasıl anlam değiştirdiğini test eden "Meaning Shifter" (Yol Ayrımı) içeriği üretmektir.
1. Cümle: Akademik, bilimsel veya felsefi bir bağlamda, kompleks (compound-complex) bir yapı kur.
2. Yollar: Kelimenin yanına gelebilecek iki farklı edatı (Path A ve Path B) seçenek olarak sun.
3. 🔍 Hint: Asla cevabı söyleme. Boşluktan sonraki kelimenin türüne veya cümlenin sebep-sonuç yönüne bakmasını söyle.
4. ⚠️ Sakın Düşme!: Türkçedeki çeviri hatasına veya "kulağa hoş gelen" ama yanlış olan yapıya odaklan.`;
                    jsonStructure = `{ "quiz": [ { "question": "The manager decided to ___ the proposal carefully before making a final decision.", "paths": { "A": "look into", "B": "look over" }, "correct_path": "B", "feedback": { "A": "Açıklama...", "B": "Açıklama...", "hint": "🔍 Hint: ...", "pitfall": "⚠️ Sakın Düşme!: ..." } } ] }`;
                } else if (mode === "definition_hunt") {
                    segmentPrompt = `Role: Akademik kelime öğretimi uzmanı dil bilimci.
1. Metin: İçinde en az 2-3 tane daha kaliteli akademik kelime barındıran, B2+/C1 seviyesinde bir paragraf (30-40 kelime) yaz.
2. Target Definition: Hedef kelimenin sözlük tanımını (TÜRKÇE) "Görev" olarak ver.
3. 🔍 Hint: Kelimenin kökenine (prefix/suffix), türüne veya yerel bağlamına işaret et; kelimeyi asla yazma.
4. ⚠️ Sakın Düşme!: Metinde geçen diğer "yakışıklı" kelimeyi açıkla. "Seçtiğin [X] kelimesi de şu anlama gelir ancak..." şeklinde belirt.`;
                    jsonStructure = `{ "quiz": [ { "passage": "Passage text containing the correct_word...", "target_definition": "Bir durumu daha da kötüleştirmek.", "correct_word": "exacerbate", "hint": "🔍 Hint: ...", "pitfall": "⚠️ Sakın Düşme!: Metindeki diğer..." } ] }`;
                } else if (mode === "synonym_hunt") {
                    segmentPrompt = `Role: İngilizce eş anlamlılar (synonyms) ve nüanslar uzmanı.
1. Metin: Hedef kelimenin eş anlamlısını (target synonym) içeren, kompleks bir akademik paragraf kurgula.
2. Task: "[X] kelimesinin yerine geçebilecek en güçlü akademik alternatifi metinde bul" komutu.
3. 🔍 Hint: Anlamsal benzerliğe veya kelimenin cümledeki işlevine odaklan.
4. ⚠️ Sakın Düşme!: Metindeki bir zıt anlamlı (antonym) kelimeyi veya yakın anlamlı ama yanlış türdeki (isim vs fiil) bir kelimeyi açıkla.`;
                    jsonStructure = `{ "quiz": [ { "passage": "Passage text containing the correct_synonym...", "target_word": "alleviate", "correct_synonym": "mitigate", "hint": "🔍 Hint: ...", "pitfall": "⚠️ Sakın Düşme!: Metindeki diğer..." } ] }`;
                } else if (mode === "antonym_hunt") {
                    segmentPrompt = `Role: Sen, İngilizcede anlamsal karşıtlıklar (contrasts) uzmanı eğitmen.
1. Metin: Hedef kelimenin zıt anlamlısını içeren, içinde bir zıtlık bağlacı (örn: nonetheless) barındıran kompleks bir paragraf yaz.
2. Task: "[X] kelimesinin metindeki tam zıt anlamlısını bul ve işaretle" komutu.
3. 🔍 Hint: Cümledeki anlamsal "U dönüşünü" işaret et.
4. ⚠️ Sakın Düşme!: Metindeki eş anlamlı (synonym) kelimeyi veya "yakın ama zıt olmayan" bir kelimeyi açıklayarak uyar.`;
                    jsonStructure = `{ "quiz": [ { "passage": "Passage text containing the correct_antonym...", "target_word": "deteriorate", "correct_antonym": "improve", "hint": "🔍 Hint: ...", "pitfall": "⚠️ Sakın Düşme!: Metindeki diğer..." } ] }`;
                }

                const prompt = `Task: Generate 3 academic YDT questions for the module [Mode: ${mode}].
Structure: ${jsonStructure}
Rules:
- High-level academic context (B2-C1).
- EXPLANATIONS, HINTS AND PITFALLS MUST BE IN TURKISH.
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
