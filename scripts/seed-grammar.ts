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
    PER_TOPIC: 1 // Daily generation limit
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
                        {
                            role: "system",
                            content: "Sen, 20 yıldır YDT, YDS ve TOEFL gibi üst düzey İngilizce sınavları için soru hazırlayan kıdemli bir ölçme ve değerlendirme uzmanısın. ELS (English Language Studies) ve benzeri saygın yayınların soru hazırlama mantığına (mantık silsilesi, akademik dil ve çeldirici kalitesi) tamamen hakimsin. Return ONLY valid JSON."
                        },
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
                const prompt = `
Rol Tanımı: Sen, 20 yıldır YDT, YDS ve TOEFL gibi üst düzey İngilizce sınavları için soru hazırlayan kıdemli bir ölçme ve değerlendirme uzmanısın. ELS (English Language Studies) ve benzeri saygın yayınların soru hazırlama mantığına (mantık silsilesi, akademik dil ve çeldirici kalitesi) tamamen hakimsin.

Görev: Aşağıdaki kriterlere uygun olarak, [Hedef Konu: ${topic}] konularını test eden özgün, akademik ve zorluk derecesi yüksek (Ösym'nin YKS-Dil (ydt) düzeyinde olması gerektiğini unutmadan çok teknik olmayan ve 17-18 yaş grubunun ilgisini çekebilecek konuları öncelikleyelim) (CEFR B2+ / C1 seviyesi) 3 adet soru hazırla.

Soru Kriterleri:
1. Cümle Yapısı: Cümleler basit olmamalı. Bilimsel bir makaleden, arkeolojik bir bulgudan veya sosyolojik bir analizden alınmış gibi duran kompleks cümleler (compound-complex sentences) kurmalısın.
2. Boşluk Yapısı: Sorular tercihen "dual-gap" (iki boşluklu) olmalı ve her iki boşluk arasındaki zaman (tense) veya yapı uyumu öğrenciyi düşündürmeli.
3. Kelime Dağarcığı: Cümle içerisinde akademik "keyword"ler (örn. mitigate, alleviate, underscore, notwithstanding) kullanılmalı.
4. Çeldiriciler (Distractors): Çeldiriciler "saçma" olmamalı; gramer olarak mümkün görünse de anlamca veya sınav tekniği açısından (zaman uyumu, ipucu kelimeler) yanlış olmalı.

Geri Bildirim Yapısı (JSON):
KRİTİK KURAL 1: Boşluklar (----) MUTLAKA [Hedef Konu: ${topic}] ile ilgili olmalıdır. Boşlukları "Vocabulary" (kelime bilgisi) ölçmek için kullanma, sadece gramer yapısını ölç.

KRİTİK KURAL 2 (ÇEŞİTLİLİK): "Thus", "Thereby", "However", "Mitigate" gibi kelimeleri sürekli kullanma. YDT/YDS skalasındaki tüm yapıları kullanmaya özen göster. Her soru farklı bir mantık ve farklı bir kelime grubu üzerine kurulu olmalı.

Format: Çıktıyı MUTLAKA aşağıdaki JSON formatında ver. Başka hiçbir metin ekleme.

{
  "quiz": [
    {
      "question": "[Sample Context Related to ${topic}]",
      "options": ["A) Opt1", "B) Opt2", "C) Opt3", "D) Opt4", "E) Opt5"],
      "correct_answer": "A",
      "feedback": {
        "hint": "Turkish hint here...",
        "logic": "Turkish logic explanation here...",
        "pitfall": "Turkish pitfall explanation here..."
      }
    }
  ]
}

CRITICAL INSTRUCTIONS: 
1. The 'quiz' array MUST contain EXACTLY 3 questions.
2. ALL question text and options MUST be in ENGLISH.
3. ONLY the 'feedback' and 'hint' fields MUST be 100% in TURKISH. No other languages allowed in the explanation.
4. Return ONLY the JSON object, starting with { and ending with }.`;

                const parsed = await generateWithGPT4oMini(prompt);

                if (parsed && parsed.quiz && Array.isArray(parsed.quiz)) {
                    // Map the array options to object format for UI compatibility
                    const formattedQuestions = parsed.quiz.map((q: any, idx: number) => {
                        const optionsObj: Record<string, string> = {};
                        if (Array.isArray(q.options)) {
                            q.options.forEach((opt: string) => {
                                const match = opt.match(/^([A-E])[\)\.]\s*(.*)/);
                                if (match) {
                                    optionsObj[match[1]] = match[2];
                                } else {
                                    // Fallback if AI skips letter prefix
                                    const first = opt.substring(0, 1).toUpperCase();
                                    if (['A', 'B', 'C', 'D', 'E'].includes(first)) {
                                        optionsObj[first] = opt.substring(3).trim();
                                    }
                                }
                            });
                        } else {
                            // Fallback if AI returns object anyway
                            Object.assign(optionsObj, q.options);
                        }

                        // Generate a unique ID for each question
                        const sanitizedTopic = topic.toLowerCase().replace(/[&]/g, 'and').replace(/\s+/g, '_');
                        const qId = `grammar_${sanitizedTopic}_${Date.now()}_${idx}`;

                        return {
                            ...q,
                            id: qId,
                            options: optionsObj,
                            correct: q.correct_answer || q.correct // Ensure compatibility
                        };
                    });

                    const insertData = formattedQuestions.map((q: any) => ({
                        topic,
                        question: q
                    }));

                    const { error } = await supabase.from('grammar_labs').insert(insertData);
                    if (error) {
                        console.error(`❌ [Grammar] Database Insert Error:`, error.message);
                        throw error;
                    }
                    console.log(`✅ [Grammar] Saved ${topic} - ${formattedQuestions.length} questions added`);
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
