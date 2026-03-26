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
    "Tenses & Aspect": `Generate 3 high-difficulty grammar questions on English Tenses & Aspect.
RULES:
- Each sentence must be complex (compound-complex), academic/formal register (science, history, archaeology, sociology).
- Use dual-gap structures that test temporal/structural harmony.
- Test: Past Perfect vs. Simple Past, Future Perfect vs. Future Simple, and nuances of aspects (continuous vs. simple).
- Include academic keywords (mitigate, underscore, etc.).
- Distractors must be plausible (grammatically possible but contextually wrong) and focused on common student errors.`,

    "Modals & Similar Expressions": `Generate 3 high-difficulty grammar questions on Modals & Similar Expressions.
RULES:
- Academic/formal register, complex sentences.
- Test: must/can't (deduction), modal perfects (should have/needn't have/could have) in nuanced contexts.
- Dual-gap structure where possible to test modal + tense harmony.
- Use academic keywords. Distractors should be semantically close but contextually wrong.`,

    "The Passive": `Generate 3 high-difficulty grammar questions on The Passive Voice.
RULES:
- Academic/formal register, complex sentences.
- Include: passive with modals, causative (have/get something done), passive gerunds/infinitives, impersonal passives.
- Dual-gap structure where one gap might be active and the other passive to test voice identification.
- Use academic keywords and high-quality distractors.`,

    "If & Wish Clauses": `Generate 3 high-difficulty grammar questions on If Clauses & Wish Clauses.
RULES:
- Academic/formal register, complex sentences.
- Test: Type 2/3, mixed conditionals, wish clauses, and inverted conditionals (Had I known, Were I to, etc.).
- Dual-gap structure to test tense harmony across clauses.
- Use academic keywords. Distractors should test specific conditional rules.`,

    "Noun Clauses & Reported Speech": `Generate 3 high-difficulty grammar questions on Noun Clauses & Reported Speech.
RULES:
- Academic/formal register, complex sentences.
- Test: that-clauses, whether/if-clauses, wh-clauses, subjunctive (It is essential that he go), and complex reporting verbs.
- Dual-gap structures to test reporting verb + clause structure harmony.
- Use academic keywords and high-quality distractors.`,

    "Gerunds & Infinitives": `Generate 3 high-difficulty grammar questions on Gerunds & Infinitives.
RULES:
- Academic/formal register, complex sentences.
- Test: perfect gerund/infinitive (having done, to have done), passive forms, and verbs with meaning changes.
- Dual-gap structures to test multiple verb structures in one sentence.
- Use academic keywords and high-quality distractors.`,

    "Adjectives & Adverbs": `Generate 3 high-difficulty grammar questions on Adjectives & Adverbs.
RULES:
- Academic/formal register, complex sentences.
- Test: complex comparatives (the more...the more, by far the most), adverb placement, and nuanced adverbial meanings.
- Dual-gap structure to test adjective vs. adverb usage.
- Use academic keywords and high-quality distractors.`,

    "Relative Clauses": `Generate 3 high-difficulty grammar questions on Relative Clauses.
RULES:
- Academic/formal register, complex sentences.
- Test: defining/non-defining, reduced relatives (participle clauses), and preposition + relative pronoun (in which, for whom).
- Dual-gap structure where one gap is a relative pronoun and the other is a verb form.
- Use academic keywords.`,

    "Nouns, Pronouns & Articles": `Generate 3 high-difficulty grammar questions on Nouns, Pronouns & Articles.
RULES:
- Academic/formal register, complex sentences.
- Test: abstract nouns, complex quantifiers (each/every, either/neither), and nuanced article usage in academic contexts.
- Dual-gap structure to test quantifier + noun harmony.
- Use academic keywords and high-quality distractors.`,

    "Conjunctions & Transitions": `Generate 3 high-difficulty grammar questions on Conjunctions & Transitions.
RULES:
- Academic/formal register, complex sentences.
- Test: subordinating conjunctions and adverbial transitions in complex logical relationships (contrast, concession, cause-effect).
- Dual-gap structure to test two related logical links.
- Use academic keywords and high-quality distractors.`
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

                const prompt = `
Rol Tanımı: Sen, 20 yıldır YDT, YDS ve TOEFL gibi üst düzey İngilizce sınavları için soru hazırlayan kıdemli bir ölçme ve değerlendirme uzmanısın. ELS (English Language Studies) ve benzeri saygın yayınların soru hazırlama mantığına (mantık silsilesi, akademik dil ve çeldirici kalitesi) tamamen hakimsin.

Görev: Aşağıdaki kriterlere uygun olarak, [Hedef Konu: ${topic}] konularını test eden özgün, akademik ve zorluk derecesi yüksek (CEFR B2+ / C1 seviyesi) 3 adet soru hazırla.

Soru Kriterleri:
1. Cümle Yapısı: Cümleler basit olmamalı. Bilimsel bir makaleden, arkeolojik bir bulgudan veya sosyolojik bir analizden alınmış gibi duran kompleks cümleler (compound-complex sentences) kurmalısın.
2. Boşluk Yapısı: Sorular tercihen "dual-gap" (iki boşluklu) olmalı ve her iki boşluk arasındaki zaman (tense) veya yapı uyumu öğrenciyi düşündürmeli.
3. Kelime Dağarcığı: Cümle içerisinde akademik "keyword"ler (örn. mitigate, alleviate, underscore, notwithstanding) kullanılmalı.
4. Çeldiriciler (Distractors): Çeldiriciler "saçma" olmamalı; gramer olarak mümkün görünse de anlamca veya sınav tekniği açısından (zaman uyumu, ipucu kelimeler) yanlış olmalı. Özellikle "yakın anlamlı" veya "yaygın yapılan öğrenci hataları" üzerine kurgulanmalı.
5. Seçenek Sayısı: 5 seçenek (A-E).

Format: Çıktıyı MUTLAKA aşağıdaki JSON formatında ver. Başka hiçbir metin ekleme.

{
  "quiz": [
    {
      "question": "Soru metni (boşluklar ___ ile belirtilmeli)",
      "options": {"A": "...", "B": "...", "C": "...", "D": "...", "E": "..."},
      "correct": "Letter (e.g. A)",
      "hint": "🔍 Hint: Soruyu görür görmez öğrencinin araması gereken ipucu kelimesi veya yapısal işaret. ASLA doğru cevabı veya şıkkı içine yazma.",
      "feedback": {
        "logic": "💡The Logic Flow: Sorunun çözüm yolunu adım adım anlatan akıl yürütme. 'Eğer boşluktan sonra şunu görüyorsan, şu yapıya gitmelisin' gibi bir akıl yürütme sun.",
        "pitfall": "⚠️ \"Sakın Düşme!\" (The Pitfall): En güçlü çeldiricinin neden yanlış olduğunu ve öğrencilerin orada neden hata yaptığını teknik olarak açıkla."
      }
    }
  ]
}

CRITICAL INSTRUCTIONS: 
1. The 'quiz' array MUST contain EXACTLY 3 questions.
2. The 'feedback' and 'hint' MUST be 100% in TURKISH. No other languages allowed in the explanation.
3. Return ONLY the JSON object, starting with { and ending with }.`;

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
