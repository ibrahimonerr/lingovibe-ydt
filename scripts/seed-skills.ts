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
    PER_TOPIC: 5 // How many iterations per topic
};

const SKILLS_TOPICS = ["Cloze Test", "Sentence Completion", "Restatement", "Paragraph Completion", "Irrelevant"];

const SKILLS_SPECIFIC_PROMPTS: Record<string, string> = {
    "Cloze Test": `Generate a short academic or informative English paragraph of about 100 words with 5 missing parts (blanks numbered 1 to 5). Then, create 5 multiple-choice questions corresponding to each blank. The blanks should test a mix of vocabulary, prepositions, conjunctions, and verb tenses appropriately contextualized within the passage. The options should be challenging and suitable for YDT.`,

    "Sentence Completion": `Generate 5 challenging 'Sentence Completion' questions. Each question should provide half of a complex sentence (either the main clause or the subordinate clause) ending or beginning with a blank. The 5 options must be full clauses that grammatically and logically complete the sentence. Use advanced conjunctions (e.g., although, provided that, given that, much as) and ensure distractors are grammatically correct but logically flawed in context.`,

    "Restatement": `Generate 5 challenging 'Restatement (Anlamca En Yakın Cümle)' questions. For each question, provide a complex, nuanced English sentence. The 5 options should be alternative ways to express this sentence. Only one option should capture the exact meaning, tone, and logical relationship (e.g., cause/effect, concession) of the original without omitting details or adding unstated facts. The distractors should alter the meaning slightly (e.g., changing 'some' to 'all', or shifting the cause-effect relationship).`,

    "Paragraph Completion": `Generate 5 challenging 'Paragraph Completion' questions. For each question, write a coherent, academic paragraph of 4-5 sentences where one crucial sentence is missing (indicated by a blank). Provide 5 options for the missing sentence. The correct option must seamlessly bridge the ideas before and after the blank, maintaining pronoun references, chronological order, or logical flow. Distractors should be on-topic but disrupt the paragraph's specific flow or logical progression.`,

    "Irrelevant": `Generate 5 challenging 'Irrelevant Sentence' questions. For each question, provide a coherent English paragraph of EXACTLY 5 sentences, numbered (I), (II), (III), (IV), (V). Four sentences should develop a single main idea logically. One sentence must be irrelevant—it may be related to the general topic but breaks the specific logical flow, changes the focus, or introduces an unconnected detail. The options should simply be A) I, B) II, C) III, D) IV, E) V.`
};

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

async function generateWithGroq(prompt: string): Promise<string> {
    const chatCompletion = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.3-70b-versatile',
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

async function seedSkills() {
    console.log(`\n🎯 Generating Skills Labs (${SKILLS_TOPICS.length} topics x ${COUNTS.PER_TOPIC} sets of 5 questions)...\n`);

    for (const topic of SKILLS_TOPICS) {
        for (let i = 0; i < COUNTS.PER_TOPIC; i++) {
            console.log(`[Skills - ${topic}] Generating set ${i + 1}/${COUNTS.PER_TOPIC}...`);

            try {
                const topicPrompt = SKILLS_SPECIFIC_PROMPTS[topic] || `Generate 5 English ${topic} multiple-choice questions.`;

                const prompt = `Task: ${topicPrompt}
Topic: ${topic}
Level: YDT (Turkish university language exam - Advanced English)
Quantity: EXACTLY 5 questions (If Cloze Test, 1 paragraph with 5 blanks and 5 questions. For others, 5 standalone questions or paragraphs).
Format: valid JSON only

Structure:
{
  "quiz": [
    {
      "question": "The question text or passage with blank...",
      "options": {"A": "...", "B": "...", "C": "...", "D": "...", "E": "..."},
      "correct": "A (Just the letter)",
      "hint": "Türkçe ipucu. Soru tipine uygun olarak nereye dikkat edilmesi gerektiğini belirten ipucu.",
      "explanation": "ANLAM: (Parçanın/cümlenin Türkçe çevirisi) | TACTIC: (Soru çözüm stratejisi - Türkçe)"
    }
  ]
}

CRITICAL INSTRUCTIONS: 
1. The 'quiz' array MUST contain EXACTLY 5 questions.
2. The 'explanation' and 'hint' MUST be 100% in TURKISH. No other languages allowed in the explanation.
3. For Restatement: The question should ask for the 'closest meaning'.
4. For Irrelevant: Put the Roman numerals in the text like (I) ... (II) ...
5. Return ONLY the JSON object, starting with { and ending with }.`;

                const parsed = await generateWithGeminiFallback(prompt);

                if (parsed && parsed.quiz && Array.isArray(parsed.quiz)) {
                    const { error } = await supabase.from('skills_labs').insert([
                        { topic, question: parsed.quiz }
                    ]);
                    if (error) throw error;
                    console.log(`✅ [Skills] Saved ${topic} - Set ${i + 1} (${parsed.quiz.length} questions)`);
                } else {
                    console.log(`❌ [Skills] Invalid JSON shape.`);
                }
            } catch (e: any) {
                console.error(`❌ [Skills] Error on ${topic} - set ${i + 1}:`, e.message);
            }

            await delay(3000);
        }
    }
}

async function main() {
    console.log("🚀 Starting Skills Seed Data Generation...");
    await seedSkills();
    console.log("\n✨ Skills seeding tasks completed!");
    process.exit(0);
}

main().catch(console.error);
