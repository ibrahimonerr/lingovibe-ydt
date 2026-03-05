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
    PER_TOPIC: 1 // How many iterations per topic
};

const NEW_SKILLS_TOPICS = ["Translation (EN-TR)", "Translation (TR-EN)", "Dialogue Completion"];

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

async function generateWithGroq(prompt: string): Promise<string> {
    const chatCompletion = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.1-8b-instant',
        temperature: 0.7,
        max_tokens: 3000,
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
                    console.warn(`⚠️ Gemini Quota Exceeded. Switching all remaining requests to Groq permanently...`);
                    geminiQuotaExceeded = true;
                    return await generateWithGeminiFallback(prompt, retries);
                }
                console.warn(`⚠️ Gemini failed (attempt ${attempt}): ${geminiError.message}. Falling back to Groq for this request...`);
                rawText = await generateWithGroq(prompt);
            }

            const jsonMatch = rawText.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error("Could not find JSON in response");
            }
            return JSON.parse(jsonMatch[0]);
        } catch (e: any) {
            if (e.message?.includes('429')) {
                console.warn(`⚠️ Rate limit hit. Waiting 15s before retry ${attempt}/${retries}...`);
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

async function seedNewSkills() {
    console.log(`\n🎯 Generating New Skills Labs (${NEW_SKILLS_TOPICS.length} topics x ${COUNTS.PER_TOPIC} sets of 5 questions)...\n`);

    for (const topic of NEW_SKILLS_TOPICS) {
        for (let i = 0; i < COUNTS.PER_TOPIC; i++) {
            console.log(`[Skills - ${topic}] Generating set ${i + 1}/${COUNTS.PER_TOPIC}...`);

            try {
                let segmentPrompt = "";
                let jsonStructure = "";
                let systemInstruction = "";

                if (topic === "Translation (EN-TR)") {
                    segmentPrompt = `Generate 3 'Translation (EN-TR)' questions.
CRITICAL CONSTRAINTS:
1. The original sentence MUST be written in academic English, 25-45 words long, with complex clauses (noun clauses, relative clauses, passives).
2. The options must be 5 different Turkish translations.
3. The correct answer must reflect the EXCT SUBJECT and EXCT VERB of the English sentence accurately (YDT logic).
4. Distractors must subtly shift the subject/verb (e.g. active to passive), misplace the adjective/adverb, or change the tense.`;
                    jsonStructure = `{
  "quiz": [
    {
      "question": "English Sentence...",
      "options": {"A": "Turkish Option", "B": "Turkish Option", "C": "Turkish Option", "D": "Turkish Option", "E": "Turkish Option"},
      "correct_answer": "Letter",
      "hint": "Türkçe ipucu: Özne ve Yüklem eşleşmesine dikkat et.",
      "feedback": { "correct_logic": "Türkçe: Neden en doğru çeviri?", "trap_analysis": "Türkçe: Diğer şıklardaki özne/yüklem/zaman tuzakları neler?", "exam_tactic": "Türkçe: Çeviri soruları için YDT taktiği.", "contextual_translation": "Türkçe orijinal metin" }
    }
  ]
}`;
                    systemInstruction = "You are a YDT expert. Output valid JSON. Original sentence must be ENGLISH, options and feedback must be TURKISH.";
                } else if (topic === "Translation (TR-EN)") {
                    segmentPrompt = `Generate 3 'Translation (TR-EN)' questions.
CRITICAL CONSTRAINTS:
1. The original sentence MUST be written in academic Turkish, 25-45 words long, with complex clauses (sıfat fiiller, zarf fiiller, edilgen çatı).
2. The options must be 5 different English translations.
3. The correct answer must reflect the EXCT SUBJECT and EXCT VERB of the Turkish sentence accurately.
4. Distractors must subtly shift the subject/verb, misplace the adjective/adverb clause, or change the tense.`;
                    jsonStructure = `{
  "quiz": [
    {
      "question": "Turkish Sentence...",
      "options": {"A": "English Option", "B": "English Option", "C": "English Option", "D": "English Option", "E": "English Option"},
      "correct_answer": "Letter",
      "hint": "Türkçe ipucu: Özne ve Yüklem eşleşmesine dikkat et.",
      "feedback": { "correct_logic": "Türkçe: Neden en doğru çeviri?", "trap_analysis": "Türkçe: Diğer şıklardaki özne/yüklem/zaman tuzakları neler?", "exam_tactic": "Türkçe: Çeviri soruları için YDT taktiği.", "contextual_translation": "English original text" }
    }
  ]
}`;
                    systemInstruction = "You are a YDT expert. Output valid JSON. Original sentence must be TURKISH, options must be ENGLISH, feedback must be TURKISH.";
                } else if (topic === "Dialogue Completion") {
                    segmentPrompt = `Generate 3 'Dialogue Completion' (Diyalog Tamamlama) questions.
CRITICAL CONSTRAINTS:
1. Dialogue must be between 2 people (e.g., Jane and Mark), and exactly 4 to 6 lines (turns) long.
2. The blank ______ must be in the middle or end of the dialogue.
3. The correct line MUST logically respond to the previous line AND perfectly set up the subsequent line (if any).
4. Distractors must sound conversational but miss the specific logical jump, emotion, or topic focus of the exact moment in the dialogue.`;
                    jsonStructure = `{
  "quiz": [
    {
      "question": "Person A: ... \\nPerson B: ... \\nPerson A: _____ \\nPerson B: ...",
      "options": {"A": "English Option", "B": "English Option", "C": "English Option", "D": "English Option", "E": "English Option"},
      "correct_answer": "Letter",
      "hint": "Türkçe ipucu: Boşluktan hemen önceki veya sonraki cümleye odaklan.",
      "feedback": { "correct_logic": "Türkçe: Doğru cevap neden akışı sağladı?", "trap_analysis": "Türkçe: Çeldirici neden anlamsız veya konu dışı kaldı?", "exam_tactic": "Türkçe: Diyalog soruları için YDT taktiği.", "contextual_translation": "Türkçe Diyalog Çevirisi" }
    }
  ]
}`;
                    systemInstruction = "You are a YDT expert. Output valid JSON. Dialogue and options must be ENGLISH, feedback must be TURKISH.";
                }

                const prompt = `[SYSTEM INSTRUCTION]
${systemInstruction}

Task: ${segmentPrompt}

Rules:
1. Strictly follow language requirements for question stem vs options.
2. The feedback MUST be in NATURAL, ACADEMIC TURKISH.
3. Distractors must be very strong to mimic YDT difficulty.
4. JSON Format:
${jsonStructure}

Quantity: Generate EXACTLY 3 questions in the "quiz" array.
CRITICAL: Return ONLY valid JSON.`;

                const parsed = await generateWithGeminiFallback(prompt);

                if (parsed && Array.isArray(parsed.quiz)) {
                    const itemsToInsert = [{ topic, question: parsed.quiz }];
                    const { error } = await supabase.from('skills_labs').insert(itemsToInsert);
                    if (error) throw error;
                    console.log(`✅ [Skills] Saved ${topic} set.`);
                }
            } catch (e: any) {
                console.error(`❌ [Skills] Error on ${topic} - set ${i + 1}:`, e.message);
            }

            await delay(3000);
        }
    }
}

async function main() {
    console.log("🚀 Starting Dialogue & Translation Seed Data Generation...");
    await seedNewSkills();
    console.log("\n✨ New Skills seeding tasks completed!");
    process.exit(0);
}

main().catch(console.error);
