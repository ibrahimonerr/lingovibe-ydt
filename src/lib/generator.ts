import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const githubToken = process.env.GITHUB_TOKEN;

const supabase = createClient(supabaseUrl, supabaseKey);

export async function generateWithGPT4oMini(prompt: string) {
    if (!githubToken) throw new Error("Missing GITHUB_TOKEN");

    const endpoint = "https://models.inference.ai.azure.com/chat/completions";

    const response = await fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${githubToken}`
        },
        body: JSON.stringify({
            messages: [
                { role: "system", content: "You are an expert YDT (English) exam question creator. MANDATORY: The question stem, scenarios, passages, dialogues, and options MUST be in ENGLISH. ONLY the explanation and hint fields MUST be in TURKISH. Return ONLY valid JSON." },
                { role: "user", content: prompt }
            ],
            model: "gpt-4o-mini",
            temperature: 0.7,
            max_tokens: 4000
        })
    });

    if (!response.ok) {
        const err = await response.text();
        throw new Error(`GitHub API Error: ${response.status} - ${err}`);
    }

    const data = await response.json();
    const rawText = data.choices[0].message.content;
    const jsonMatch = rawText.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (!jsonMatch) throw new Error("Could not find JSON in response");
    return JSON.parse(jsonMatch[0]);
}

export const GRAMMAR_SPECIFIC_PROMPTS: Record<string, string> = {
    "Tenses & Aspect": `Generate 3 YDT-level multiple-choice grammar questions on English Tenses & Aspect. RULES: Each sentence 25-40 words, academic/formal. All options A-E in English. Explanation and Hint in Turkish.`,
    "Modals & Similar Expressions": `Generate 3 YDT-level multiple-choice grammar questions on Modals. RULES: Each sentence 25-40 words, academic/formal. All options A-E in English. Explanation and Hint in Turkish.`,
    // ... we can add more as needed
};

export async function seedSingleGrammar(topic: string) {
    const prompt = `Task: Generate 3 YDT grammar questions for topic: ${topic}.
Structure: { "quiz": [{ "question": "...", "options": {"A":"..."}, "correct": "A", "hint": "...", "explanation": "..." }] }
CRITICAL: ONLY THE HINT AND EXPLANATION FIELDS MUST BE IN TURKISH.`;

    const parsed = await generateWithGPT4oMini(prompt);
    if (parsed && parsed.quiz) {
        await supabase.from('grammar_labs').insert([{ topic, question: parsed.quiz }]);
        return parsed.quiz.length;
    }
    return 0;
}
