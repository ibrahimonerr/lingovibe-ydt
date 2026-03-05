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
    PER_BATCH: 1, // Number of batches to generate (4 * 5 = 20 questions)
    QUESTIONS_PER_BATCH: 1
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

async function seedCloze() {
    console.log(`\n📚 Generating Cloze Labs (${COUNTS.PER_BATCH} batches of 5 questions each)...\n`);

    for (let i = 0; i < COUNTS.PER_BATCH; i++) {
        console.log(`[Cloze] Generating batch ${i + 1}/${COUNTS.PER_BATCH}...`);

        try {
            const prompt = `Sen kıdemli bir YDT (YKS-DİL) içerik hazırlama uzmanı ve başdenetmenisin. Üreteceğin tüm içerikler B2-C1 (Upper-Intermediate/Advanced) seviyesinde, akademik bir dille (bilim, tarih, felsefe, çevre) yazılmalıdır. Sadece JSON formatında çıktı ver, açıklama metni ekleme.

[SİSTEM TALİMATI]
Task: Generate a high-quality academic English paragraph (about 150-200 words) suitable for YDT (Advanced level).
The paragraph MUST contain EXACTLY 5 numbered blanks for a cloze test, formatted as ___1___, ___2___, ___3___, ___4___, ___5___.
Then generate EXACTLY 5 multiple-choice questions corresponding to these blanks.

Topics: Science, History, Environment, Psychology, Technology, or Art.

JSON Format:
{
  "passage": "Full passage text with numbered blanks here...",
  "quiz": [
    {
      "question": "Choose the best option for blank number 1",
      "options": {"A": "...", "B": "...", "C": "...", "D": "...", "E": "..."},
      "correct_answer": "Letter",
      "hint": "Türkçe ipucu. Boşluğun öncesinde ve sonrasında ne tür bir yapı veya anlam var?",
      "quote": "The exact sentence containing the blank.",
      "feedback": {
        "correct_logic": "Doğru cevabın neden doğru olduğunu kurala veya anlama dayandırarak açıkla.",
        "trap_analysis": "Öğrencinin hangi yanlış şıkka neden düşebileceğini analiz et.",
        "exam_tactic": "Bu boşluk doldurma (cloze test) sorusu tipi için profesyonel bir ipucu ver.",
        "contextual_translation": "İlgili cümlenin akademik Türkçe çevirisi."
      }
    }
  ]
}

CRITICAL: 
1. The 'question' and 'options' MUST be 100% in ENGLISH.
2. The 'feedback' and 'hint' MUST be 100% in TURKISH.
3. The 'quiz' array MUST have EXACTLY 5 questions.
4. The blanks in the 'passage' MUST strictly be formatted as ___1___ to ___5___.
5. Return ONLY the JSON object.`;

            const parsed = await generateWithGeminiFallback(prompt);

            if (parsed && parsed.passage && Array.isArray(parsed.quiz)) {
                const { error } = await supabase.from('cloze_labs').insert([
                    { passage: parsed.passage, questions: parsed.quiz }
                ]);
                if (error) throw error;
                console.log(`✅ [Cloze] Saved batch ${i + 1} with ${parsed.quiz.length} questions.`);
            }
        } catch (e: any) {
            console.error(`❌ [Cloze] Error on batch ${i + 1}:`, e.message);
        }
        await delay(3000);
    }
}

async function main() {
    console.log("🚀 Starting Cloze Seed Data Generation...");
    await seedCloze();
    console.log("\n✨ Cloze seeding completed!");
    process.exit(0);
}

main().catch(console.error);
