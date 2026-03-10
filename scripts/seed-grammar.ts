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
    PER_TOPIC: 1 // Günlük 50 hak olduğu için 1-2 set idealdir
};

const GRAMMAR_TOPICS = [
    "Tenses & Aspect",
    "Modals & Similar Expressions",
    "The Passive",
    "If & Wish Clauses",
    "Noun Clauses & Reported Speech",
    "Gerunds & Infinitives",
    "Adjectives & Adverbs",
    "Relative Clauses",
    "Nouns, Pronouns & Articles",
    "Conjunctions & Transitions"
];

const GRAMMAR_SPECIFIC_PROMPTS: Record<string, string> = {
    "Tenses & Aspect": `Generate 3 YDT-level multiple-choice grammar questions on English Tenses & Aspect.
RULES:
- Each sentence must be 25-40 words, academic/formal register (science, history, psychology topics).
- Use complex structures with time conjunctions: by the time, hardly...when, no sooner...than, since, until, while, as soon as.
- Test temporal relationships between clauses (e.g., Past Perfect vs. Simple Past, Future Perfect vs. Future Simple).
- All 5 options (A-E) must be grammatically plausible tense forms. Only ONE is contextually correct.
- Avoid everyday/simple sentences. Use academic contexts like research findings, historical events, environmental studies.`,

    "Modals & Similar Expressions": `Generate 3 YDT-level multiple-choice grammar questions on Modals & Similar Expressions.
RULES:
- Each sentence must be 25-40 words, academic/formal register.
- Test: must/can't (deduction), should have/needn't have/could have (past regret/unnecessary action), may/might (possibility), had better, be supposed to, be able to.
- Include modal perfects: must have done, should have done, needn't have done, could have done.
- Context must clearly dictate which modal meaning is required (obligation vs. deduction vs. possibility).
- All 5 options must be different modal expressions. Distractors should be semantically close but contextually wrong.`,

    "The Passive": `Generate 3 YDT-level multiple-choice grammar questions on The Passive Voice.
RULES:
- Each sentence must be 25-40 words, academic/formal register.
- Include: passive with modals (should be done), causative (have/get something done), passive gerunds/infinitives (being done, to be done, to have been done), impersonal passives (It is said that... / He is said to...).
- Use academic contexts: scientific discoveries, policy changes, historical events.
- Options should mix active and passive forms to test whether the student identifies the correct voice and tense.`,

    "If & Wish Clauses": `Generate 3 YDT-level multiple-choice grammar questions on If Clauses & Wish Clauses.
RULES:
- Each sentence must be 25-40 words, academic/formal register.
- Test: Type 0, 1, 2, 3 conditionals, mixed conditionals (If + Past Perfect → would + V1), wish + Past Simple / Past Perfect / could.
- Include inversions: Had I known..., Were he to..., Should it rain...
- Include alternative conditional conjunctions: unless, provided that, as long as, supposing, on condition that.
- Context must clearly indicate real vs. unreal condition and time frame.`,

    "Noun Clauses & Reported Speech": `Generate 3 YDT-level multiple-choice grammar questions on Noun Clauses & Reported Speech.
RULES:
- Each sentence must be 25-40 words, academic/formal register.
- Test: that-clauses, whether/if-clauses, wh-clauses as subject/object, reported speech tense shifts, reporting verbs (suggest, insist, recommend + subjunctive).
- Include: The fact that..., It is essential that he go (subjunctive), She wondered whether...
- Use academic contexts like conference reports, research findings, official statements.`,

    "Gerunds & Infinitives": `Generate 3 YDT-level multiple-choice grammar questions on Gerunds & Infinitives.
RULES:
- Each sentence must be 25-40 words, academic/formal register.
- Test: verbs followed by gerund vs. infinitive with meaning change (stop doing vs. stop to do, remember doing vs. remember to do, try doing vs. try to do).
- Include: perfect gerund (having done), passive gerund (being done), verb + object + infinitive (advise sb to do), adjective + infinitive (difficult to understand).
- Use academic/professional contexts.`,

    "Adjectives & Adverbs": `Generate 3 YDT-level multiple-choice grammar questions on Adjectives & Adverbs.
RULES:
- Each sentence must be 25-40 words, academic/formal register.
- Test: comparative/superlative structures (the more...the more, by far the most), adverb placement, adjective order, adjective vs. adverb confusion (hard/hardly, late/lately, near/nearly).
- Include: so...that, such...that, too...to, enough to, as...as.
- Use academic contexts with nuanced meaning distinctions.`,

    "Relative Clauses": `Generate 3 YDT-level multiple-choice grammar questions on Relative Clauses.
RULES:
- Each sentence must be 25-40 words, academic/formal register.
- Test: defining vs. non-defining relative clauses, relative pronouns (who, which, that, whose, whom, where, when), reduced relative clauses (the book written by...), preposition + relative pronoun (in which, for whom).
- Include complex embedding: "The theory, which was proposed by a team whose research had been funded by..."
- Distractors should test pronoun choice and clause type.`,

    "Nouns, Pronouns & Articles": `Generate 3 YDT-level multiple-choice grammar questions on Nouns, Pronouns & Articles.
RULES:
- Each sentence must be 25-40 words, academic/formal register.
- Test: countable/uncountable distinctions, quantifiers (a few/few, a little/little, each/every, either/neither), reflexive/reciprocal pronouns, definite/indefinite/zero article usage.
- Include: abstract noun usage (the importance of...), generic reference (The cheetah is... vs. Cheetahs are...).
- Use academic contexts with precise quantifier meanings.`,

    "Conjunctions & Transitions": `Generate 3 YDT-level multiple-choice grammar questions on Conjunctions & Transitions.
RULES:
- Each sentence must be 25-40 words, academic/formal register.
- Test: subordinating conjunctions (although, whereas, while, even though, in case, so that), adverbial transitions (nevertheless, furthermore, consequently, on the other hand, in contrast).
- Two clauses/sentences with a specific logical relationship: contrast, cause-effect, addition, concession, purpose.
- Options should contain conjunctions from DIFFERENT categories (contrast vs. cause-effect vs. addition) to test logical understanding.`
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

async function seedGrammar() {
    console.log(`\n✍️ Generating Grammar Labs (${GRAMMAR_TOPICS.length} topics x ${COUNTS.PER_TOPIC} sets of 3 questions)...\n`);

    for (const topic of GRAMMAR_TOPICS) {
        for (let i = 0; i < COUNTS.PER_TOPIC; i++) {
            console.log(`[Grammar - ${topic}] Generating set ${i + 1}/${COUNTS.PER_TOPIC}...`);

            try {
                const topicPrompt = GRAMMAR_SPECIFIC_PROMPTS[topic] || `Generate 3 English grammar multiple-choice questions for YDT level.`;

                const prompt = `Task: ${topicPrompt}
Topic: ${topic}
Level: YDT (Turkish university language exam - Advanced English)
Quantity: EXACTLY 3 questions
Format: valid JSON only

Structure:
{
  "quiz": [
    {
      "question": "The question text, with '_____' for the blank if necessary...",
      "options": {"A": "...", "B": "...", "C": "...", "D": "...", "E": "..."},
      "correct": "Letter (e.g. A)",
      "hint": "Türkçe ipucu. Sorunun çözümüne giden yolu gösteren kısa bir ipucu.",
      "explanation": "ANLAM: (Cümlenin Türkçe çevirisi) | TACTIC: (Dilbilgisi kuralının ve doğru şıkkın neden doğru olduğunun Türkçe açıklaması)"
    }
  ]
}

CRITICAL INSTRUCTIONS: 
1. The 'quiz' array MUST contain EXACTLY 3 questions.
2. The 'explanation' and 'hint' MUST be 100% in TURKISH. No other languages allowed in the explanation.
3. Include clear context in sentences, they should be advanced/academic.
4. Return ONLY the JSON object, starting with { and ending with }.`;

                const parsed = await generateWithGPT4oMini(prompt);

                if (parsed && parsed.quiz && Array.isArray(parsed.quiz)) {
                    const { error } = await supabase.from('grammar_labs').insert([
                        { topic, question: parsed.quiz }
                    ]);
                    if (error) {
                        console.error(`❌ [Grammar] Database Insert Error:`, error.message);
                        throw error;
                    }
                    console.log(`✅ [Grammar] Saved ${topic} - Set ${i + 1} (${parsed.quiz.length} questions)`);
                } else {
                    console.log(`❌ [Grammar] Invalid JSON shape.`);
                }
            } catch (e: any) {
                console.error(`❌ [Grammar] Error on ${topic} - set ${i + 1}:`, e.message);
                throw e; // Propagate to fail-fast
            }

            await delay(3000);
        }
    }
}

async function main() {
    console.log("🚀 Starting Grammar Seed Data Generation...");
    try {
        await seedGrammar();
        console.log("\n✨ Grammar seeding tasks completed!");
        process.exit(0);
    } catch (error) {
        console.error("\n❌ Grammar seeding failed critical error.");
        process.exit(1);
    }
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
