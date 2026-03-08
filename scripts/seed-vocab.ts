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

const VOCAB_MODES = ["loop", "synonym", "context", "odd"];

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

async function seedVocab() {
  console.log(`\n📚 Generating Vocabulary Labs (4 modes x ${COUNTS.PER_MODE} batches)...\n`);

  for (const mode of VOCAB_MODES) {
    for (let i = 0; i < COUNTS.PER_MODE; i++) {
      console.log(`[Vocab - ${mode}] Generating batch ${i + 1}/${COUNTS.PER_MODE}...`);

      try {
        let segmentPrompt = "";
        let jsonStructure = "";

        if (mode === "loop") {
          segmentPrompt = `Generate 3 high-quality YDT (Advanced) vocabulary flashcards. 
Target words: B2-C1 academic nouns, verbs, or adjectives commonly tested in YDT (e.g., deteriorate, prevalent, alleviate, unprecedented, scrutinize, mitigate, exacerbate, relinquish).`;
          jsonStructure = `{
  "quiz": [
    {
      "question": "WORD_IN_UPPERCASE",
      "explanation": "ANLAM: [Turkish meaning] | SYNONYM: [3 English synonyms] | ANTONYM: [1 English antonym] | MNEMONIC: [Creative Turkish memory hook - a vivid association, wordplay, or mental image that helps remember the word] | CONTEXT: [A complex 20-30 word academic English sentence using the word]"
    }
  ]
}`;
        } else if (mode === "synonym") {
          segmentPrompt = `Generate 3 YDT-level Synonym discovery questions testing B2-C1 academic vocabulary.
Target words should be common in YDT exams: verbs (scrutinize, alleviate, exacerbate), adjectives (detrimental, prevalent, substantial), nouns (implications, scrutiny, discrepancy).`;
          jsonStructure = `{
  "quiz": [
    {
      "question": "Choose the SYNONYM for: **WORD**",
      "options": {"A": "English...", "B": "English...", "C": "English...", "D": "English...", "E": "English..."},
      "correct": "Letter (e.g. A)",
      "explanation": "ANLAM: [Turkish meaning of the target word] | TACTIC: [Professional YDT tip in TURKISH on how to analyze the word's meaning and eliminate distractors] | MNEMONIC: [Creative Turkish memory hook - a vivid association or wordplay to remember this word]"
    }
  ]
}`;
        } else if (mode === "context") {
          segmentPrompt = `Generate 3 YDT-level In-Context vocabulary questions. 
Constraint: The stem sentence MUST be complex, academic (science, history, sociology, psychology), and EXACTLY 20-30 words long. It must use the target word naturally in context with a blank ____. All options must be the same word class (e.g. all verbs, or all adjectives).`;
          jsonStructure = `{
  "quiz": [
    {
      "question": "Complex academic English sentence (20-30 words) containing a blank ____ for the target word...",
      "options": {"A": "English...", "B": "English...", "C": "English...", "D": "English...", "E": "English..."},
      "correct": "Letter (e.g. A)",
      "explanation": "ANLAM: [Turkish translation of the complete sentence with the correct word] | TACTIC: [Turkish explanation of contextual clues that point to the correct answer] | MNEMONIC: [Creative Turkish memory hook for the correct word]"
    }
  ]
}`;
        } else if (mode === "odd") {
          segmentPrompt = `Generate 3 YDT-level 'Odd-one out' questions. Each question has 5 B2-C1 academic words where 4 share a semantic relationship and 1 is the outlier.`;
          jsonStructure = `{
  "quiz": [
    {
      "question": "Which word is the ODD-ONE out?",
      "options": {"A": "English...", "B": "English...", "C": "English...", "D": "English...", "E": "English..."},
      "correct": "Letter (e.g. A)",
      "explanation": "ANLAM: [Short Turkish meanings of all 5 words] | TACTIC: [Turkish explanation of the semantic link between the 4 similar words and why the odd one differs] | MNEMONIC: [Creative Turkish memory hook for the odd word to help remember its distinct meaning]"
    }
  ]
}`;
        }

        const prompt = `Task: ${segmentPrompt}
Level: YDT (Turkish university language exam - Advanced English)
Quantity: EXACTLY 3 items in the "quiz" array.
Return ONLY valid JSON.

Structure:
${jsonStructure}

CRITICAL: 
1. Explanation MUST be in TURKISH (except synonyms/antonyms in loop mode).
2. For loop mode, the "explanation" field must contain ALL parts: ANLAM, SYNONYM, ANTONYM, MNEMONIC, CONTEXT.
3. For others, include TACTIC and MNEMONIC in the explanation.
4. Return ONLY the JSON object, starting with { and ending with }.`;

        const parsed = await generateWithGPT4oMini(prompt);

        if (parsed && Array.isArray(parsed.quiz)) {
          const { error } = await supabase.from('vocab_labs').insert(
            parsed.quiz.map((item: any) => ({
              mode,
              question: item.question,
              options: item.options || null,
              correct: item.correct || null,
              explanation: item.explanation
            }))
          );
          if (error) throw error;
          console.log(`✅ [Vocab] Saved ${mode} - Batch ${i + 1} (${parsed.quiz.length} items)`);
        } else {
          console.log(`❌ [Vocab] Invalid JSON shape.`);
        }
      } catch (e: any) {
        console.error(`❌ [Vocab] Error on ${mode} - batch ${i + 1}:`, e.message);
      }

      await delay(3000);
    }
  }
}

async function main() {
  console.log("🚀 Starting Vocabulary Seed Data Generation...");
  await seedVocab();
  console.log("\n✨ Vocabulary seeding tasks completed!");
  process.exit(0);
}

main().catch(console.error);
