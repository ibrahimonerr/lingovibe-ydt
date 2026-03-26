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

const WORDS_TO_SEED = 10; // Number of words to generate per run

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
                        { role: "system", content: "[ROLE]\nSen, YDT ve YDS gibi sınavlarda çıkan akademik kelimeler üzerine uzmanlaşmış bir Hafıza Teknikleri (Mnemonics) ve Ölçme Değerlendirme Uzmanısın. Görevin, öğrencinin bir kelimeyi sadece ezberlemesini değil, onu sınavda gördüğü an tanımasını sağlayacak \"3 Boyutlu Flashcard\" verisi üretmektir. Return ONLY valid JSON array." },
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

async function seedFlashcards() {
    console.log(`\n🔄 Generating 3D Flashcards (${WORDS_TO_SEED} words)...\n`);

    const prompt = `
[TASK]
(YDT sınavında en çok çıkan 1000 kelimeden yola çıkarak) Rastgele seçilen ${WORDS_TO_SEED} adet akademik kelime için YDT frekansı yüksek, akademik derinliği olan bir flashcard içeriği hazırla.

[DATA CRITERIA]
1. Meaning: Kelimenin YDT metinlerinde en çok karşımıza çıkan teknik/akademik Türkçe karşılığı.
2. Synonyms: En az 3-4 adet, YDT'de birbirinin yerine (restatement sorularında) sıkça sorulan akademik alternatifler.
3. Antonyms: Kelimenin zıt anlamlısı olan ve "Contrast" bağlaçlarıyla sıkça eşleşen 2-3 kelime.
4. Mnemonic (Hafıza Çivisi): Kelimenin sesletimini (pronunciation) veya kökenini Türkçedeki bir kavramla birleştiren, eğlenceli ve akılda kalıcı bir hikaye/kodlama.
5. Confusion Alert (Karıştırma!): (varsa) Yazılışı veya anlamı benzer olduğu için öğrencilerin en çok düştüğü o "sinsi" kelimeyi belirterek uyar.
6. Context: Kelimenin akademik (makale/sınav seviyesi) bir cümle içinde kullanımı.

[FORMAT]
Aşağıdaki yapıda bir JSON dizisi ver:
[
  {
    "word": "Kelime",
    "meaning": "Türkçe karşılık",
    "synonyms": ["syn1", "syn2", "syn3"],
    "antonyms": ["ant1", "ant2"],
    "mnemonic": "💡 Hafıza çivisi hikayesi...",
    "confusion_alert": "⚠️ Uyarı...",
    "context": "Sample academic sentence.",
    "level": "B2/C1"
  }
]
`;

    try {
        const parsed = await generateWithGPT4oMini(prompt);

        if (parsed && Array.isArray(parsed)) {
            const { error } = await supabase.from('vocab_labs').insert(
                parsed.map((item: any) => ({
                    mode: 'loop',
                    question: item // Store flashcard data in the 'question' JSONB column
                }))
            );
            if (error) {
                console.error(`❌ [Flashcards] Database Insert Error:`, error.message);
                throw error;
            }
            console.log(`✅ [Flashcards] Saved ${parsed.length} words to 'vocab_labs' table with mode 'loop'.`);
        } else {
            console.log(`❌ [Flashcards] Invalid JSON shape.`);
        }
    } catch (e: any) {
        console.error(`❌ [Flashcards] Error:`, e.message);
        throw e;
    }
}

async function main() {
    console.log("🚀 Starting Vocab Loop (3D Flashcards) Seeding...");
    try {
        await seedFlashcards();
        console.log("\n✨ Flashcards seeding completed!");
        process.exit(0);
    } catch (error) {
        process.exit(1);
    }
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
