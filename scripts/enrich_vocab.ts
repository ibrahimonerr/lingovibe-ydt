import Groq from 'groq-sdk';
import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const vocabFilePath = path.join(process.cwd(), 'src', 'data', 'ydtVocab.ts');
const wordListPath = path.join(process.cwd(), 'vocab_final_list.txt');

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));
const BATCH_SIZE = 15; // words per Groq request
const MAX_WORDS = 9999; // process all remaining words

// Basic words to filter out before sending to Groq
const BASIC_WORDS = new Set(['ability', 'actually', 'addition', 'additional', 'address', 'after',
    'agree', 'along', 'also', 'always', 'among', 'answer', 'appear', 'apply', 'around',
    'avoid', 'avoidable', 'basic', 'before', 'being', 'between', 'both', 'bring', 'broad',
    'broadly', 'calculate', 'called', 'careful', 'carefully', 'certain', 'certainly',
    'challenge', 'come', 'common', 'commonly', 'complete', 'completely', 'concern',
    'constant', 'control', 'correct', 'could', 'decide', 'directly', 'done', 'during',
    'every', 'expand', 'explain', 'focus', 'follow', 'form', 'forward', 'free',
    'freely', 'function', 'given', 'happen', 'include', 'increase', 'indeed',
    'known', 'large', 'lately', 'lead', 'likely', 'limit', 'little', 'local',
    'manage', 'mean', 'mostly', 'nearly', 'never', 'note', 'number', 'often',
    'once', 'order', 'other', 'particular', 'possible', 'provide', 'recent',
    'refuse', 'remain', 'remove', 'repeat', 'require', 'reveal', 'seem', 'generally',
    'separate', 'show', 'since', 'situation', 'small', 'state', 'still', 'change',
    'support', 'their', 'theory', 'thing', 'those', 'through', 'truly', 'usually',
    'value', 'various', 'whole', 'within', 'without', 'understand', 'problem']
);

async function enrichBatch(words: string[], startId: number, retries = 3): Promise<any[]> {
    const prompt = `For each of the following English words, return a JSON array entry for a Turkish YDT exam student.

Words to process: ${words.join(', ')}

For each word, create an object:
{
  "id": "${startId}" (increment from ${startId}),
  "word": "WORD IN UPPERCASE",
  "meaning": "Turkish meaning (e.g. 'Ertelemek, geciktirmek')",
  "synonyms": ["s1", "s2", "s3"],
  "antonyms": ["a1", "a2"],
  "mnemonic": "Kısa, eğlenceli ve akılda kalıcı Türkçe hafıza cümlesi",
  "context": "A natural English sentence using the word in context."
}

Return ONLY a valid JSON array starting with [ and ending with ]. No markdown. No extra text.`;

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const res = await groq.chat.completions.create({
                messages: [{ role: 'user', content: prompt }],
                model: 'llama-3.3-70b-versatile',
                temperature: 0.6,
                max_tokens: 4096,
            });
            const raw = res.choices[0]?.message?.content || '';
            const jsonStr = raw.match(/\[[\s\S]*\]/)?.[0] || '';
            if (!jsonStr) throw new Error('No JSON array in response');
            return JSON.parse(jsonStr);
        } catch (e: any) {
            const is429 = e.message?.includes('429');
            if (is429 && attempt < retries) {
                const waitSec = 60 * attempt; // 60s, 120s backoff
                console.log(`  ⏳ Rate limit hit. Waiting ${waitSec}s before retry ${attempt}/${retries - 1}...`);
                await delay(waitSec * 1000);
            } else {
                throw e;
            }
        }
    }
    throw new Error('Max retries exceeded');
}

async function main() {
    const rawWords = fs.readFileSync(wordListPath, 'utf-8').split('\n').filter(Boolean);
    const currentContent = fs.readFileSync(vocabFilePath, 'utf-8');
    const existingWords = new Set(
        (currentContent.match(/"word":\s*"([^"]+)"/g) || []).map(m =>
            m.replace(/"word":\s*"/, '').replace('"', '').toLowerCase()
        )
    );
    const maxId = Math.max(
        ...((currentContent.match(/"id":\s*"(\d+)"/g) || ['0']).map(m =>
            parseInt(m.replace(/"id":\s*"/, '').replace('"', ''))
        ))
    );

    // Filter out already-known words, basic words, and limit
    const newWords = rawWords
        .filter(w => !existingWords.has(w.toLowerCase()) && !BASIC_WORDS.has(w.toLowerCase()))
        .slice(0, MAX_WORDS);
    console.log(`📚 Words to enrich: ${newWords.length} (max ${MAX_WORDS}), starting from ID ${maxId + 1}`);

    let currentId = maxId + 1;
    let allNewEntries: any[] = [];

    for (let i = 0; i < newWords.length; i += BATCH_SIZE) {
        const batch = newWords.slice(i, i + BATCH_SIZE);
        const batchNum = Math.floor(i / BATCH_SIZE) + 1;
        const totalBatches = Math.ceil(newWords.length / BATCH_SIZE);
        console.log(`Batch ${batchNum}/${totalBatches}: ${batch.slice(0, 5).join(', ')}...`);

        try {
            const enriched = await enrichBatch(batch, currentId);
            if (Array.isArray(enriched) && enriched.length > 0) {
                allNewEntries = allNewEntries.concat(enriched);
                currentId += enriched.length;
                console.log(`  ✅ ${enriched.length} words done. Total: ${allNewEntries.length}`);
            }
        } catch (e: any) {
            console.error(`  ❌ Batch ${batchNum} error: ${e.message.substring(0, 120)}`);
        }

        await delay(4000); // 4s between batches to avoid rate limits
    }

    console.log(`\n✨ Generated ${allNewEntries.length} new entries.`);

    if (allNewEntries.length === 0) return;

    const entriesStr = allNewEntries.map(e => JSON.stringify(e, null, 4)).join(',\n');
    const updatedContent = currentContent.replace(/\n\];\n/, `,\n${entriesStr}\n];\n`);
    fs.writeFileSync(vocabFilePath, updatedContent, 'utf-8');

    console.log(`✅ ydtVocab.ts now has ${existingWords.size + allNewEntries.length} words!`);
}

main().catch(console.error);
