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
    PER_BATCH: 4, // 4 batches * 5 questions = 20 total
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

async function seedClozeInSkills() {
    console.log(`\n📚 Generating Cloze Tests for Skills Lab (${COUNTS.PER_BATCH} sets)...\n`);

    for (let i = 0; i < COUNTS.PER_BATCH; i++) {
        console.log(`[Skills - Cloze] Generating batch ${i + 1}/${COUNTS.PER_BATCH}...`);

        try {
            const questionTypes = [
                "Preposition veya Phrasal Verb (e.g., in, on, look into, result in)",
                "Conjunction veya Linking Word (e.g., although, however, therefore, whereas)",
                "Grammar Yapısı - Tense/Modal/Passive (e.g., had been, might have, was built)",
                "Vocabulary - B2 düzey kelime (e.g., significant, monitor, trend, emerge)",
                "Quantifier veya Pronoun (e.g., both, neither, each, those, which)"
            ];

            const prompt = `Sen kıdemli bir YDT (YKS-DİL) içerik hazırlama uzmanısın. Sadece JSON formatında çıktı ver.

[SİSTEM TALİMATI]
Görev: YDT Cloze Test için KISA, okunması kolay bir İngilizce paragraf üret.

Kısıtlamalar:
- Paragraf TOPLAM 70-90 KELIME uzunluğunda (kısa tut, mobil dostu!)
- Dil seviyesi: B1-B2 (YDT'de çıkabilecek, ama aşırı karmaşık değil)
- Konu: günlük hayat, bilim, tarih, doğa veya teknoloji (çeşitlilik için her seferinde farklı bir konu seç)
- Paragraf içinde TAMAMEN 5 boşluk ver: __1__, __2__, __3__, __4__, __5__ formatında

Boşluk türleri (YDT formatına uygun çeşitlilik):
  Boşluk 1 → ${questionTypes[0]}
  Boşluk 2 → ${questionTypes[1]}
  Boşluk 3 → ${questionTypes[2]}
  Boşluk 4 → ${questionTypes[3]}
  Boşluk 5 → ${questionTypes[4]}

JSON Formatı:
{
  "passage": "70-90 kelimelik kısa paragraf, boşluklar __1__ ... __5__ şeklinde",
  "questions": [
    {
      "id": 1,
      "type": "Preposition",
      "options": {"A": "...", "B": "...", "C": "...", "D": "...", "E": "..."},
      "correct_answer": "Harf",
      "hint": "Türkçe ipucu: Boşluktan önce/sonra gelen yapı nedir?",
      "feedback": {
        "correct_logic": "Türkçe: Doğru cevabın gramer/anlam açıklaması.",
        "trap_analysis": "Türkçe: Öğrenci neden yanlış şıka düşebilir?",
        "exam_tactic": "Türkçe: Bu soru tipi için pratik YDT taktiği.",
        "contextual_translation": "Türkçe: İlgili cümlenin doğal Türkçe çevirisi."
      }
    }
  ]
}

KESİN KURALLAR:
1. "passage" ve "options" TAMAMEN İNGİLİZCE.
2. "hint" ve "feedback" TAMAMEN TÜRKÇE.
3. "questions" dizisi TAMAMEN 5 soru içermeli.
4. Boşluklar sadece __1__ ... __5__ formatında.
5. SADECE JSON objesi döndür.`;


            const parsed = await generateWithGeminiFallback(prompt);

            if (parsed && parsed.passage && Array.isArray(parsed.questions)) {
                const { error } = await supabase.from('skills_labs').insert([
                    {
                        topic: 'Cloze Test',
                        question: parsed // Saving the whole object (passage + questions) inside the 'question' JSONB column
                    }
                ]);
                if (error) throw error;
                console.log(`✅ [Skills - Cloze] Saved batch ${i + 1}.`);
            }
        } catch (e: any) {
            console.error(`❌ [Skills - Cloze] Error on batch ${i + 1}:`, e.message);
        }
        await delay(3000);
    }
}

async function main() {
    console.log("🚀 Starting Cloze Test Generation for Skills Lab...");
    await seedClozeInSkills();
    console.log("\n✨ Cloze seeding completed!");
    process.exit(0);
}

main().catch(console.error);
