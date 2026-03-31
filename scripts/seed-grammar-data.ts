import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const DATA_DIR = path.resolve(process.cwd(), 'src/data/grammar');

/**
 * Generates a stable hash for a question to prevent duplicates.
 */
function generateQuestionHash(topic: string, questionText: string): string {
    return crypto.createHash('md5').update(`${topic}:${questionText}`).digest('hex');
}

/**
 * Validates the structure of a grammar question.
 */
function validateQuestion(q: any, index: number, filename: string): boolean {
    const required = ['topic', 'question', 'options', 'correct_answer'];
    for (const field of required) {
        if (!q[field]) {
            console.warn(`⚠️ [${filename}] Question #${index+1} is missing required field: ${field}`);
            return false;
        }
    }

    // Check options (A-E)
    const options = q.options;
    // Handle both array of strings and object format
    if (Array.isArray(options)) {
        if (options.length < 5) {
            console.warn(`⚠️ [${filename}] Question #${index+1} has fewer than 5 options.`);
            return false;
        }
    } else if (typeof options === 'object') {
        const keys = Object.keys(options);
        if (!['A','B','C','D','E'].every(key => keys.includes(key))) {
            console.warn(`⚠️ [${filename}] Question #${index+1} must have options A, B, C, D, and E.`);
            return false;
        }
    }

    // Feedback validation
    if (!q.feedback || !q.feedback.hint || !q.feedback.logic || !q.feedback.pitfall) {
        console.warn(`⚠️ [${filename}] Question #${index+1} has incomplete feedback (hint, logic, pitfall).`);
        return false;
    }

    return true;
}

/**
 * Formats a raw question into the database schema.
 */
function formatQuestion(q: any, hash: string): any {
    const optionsObj: Record<string, string> = {};
    if (Array.isArray(q.options)) {
        q.options.forEach((opt: string) => {
            const cleanOpt = opt.replace(/^[&|]\s*/, '');
            const match = cleanOpt.match(/^([A-E])[\)\.]\s*(.*)/);
            if (match) {
                optionsObj[match[1]] = match[2];
            } else {
                const first = cleanOpt.substring(0, 1).toUpperCase();
                if (['A','B','C','D','E'].includes(first)) {
                    optionsObj[first] = cleanOpt.substring(3).trim();
                }
            }
        });
    } else {
        Object.assign(optionsObj, q.options);
    }

    // Prepend hash to ID to make it super-safe for tracking in DB
    const sanitizedTopic = q.topic.toLowerCase().replace(/[&]/g, 'and').replace(/\s+/g, '_');
    const qId = `grammar_${sanitizedTopic}_curated_${hash.substring(0, 8)}`;

    return {
        topic: q.topic,
        question: {
            ...q,
            id: qId,
            options: optionsObj,
            correct: q.correct_answer || (q as any).correct,
            _hash: hash // Internal tracking to prevent dupes
        }
    };
}

async function startSeeding() {
    console.log(`🚀 Starting Balanced Seeder for [${DATA_DIR}]...`);

    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
        console.log(`📁 Created data directory: ${DATA_DIR}`);
    }

    const files = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.json'));
    if (files.length === 0) {
        console.log("ℹ️ No JSON files found in data directory. Exiting.");
        return;
    }

    // 1. Fetch existing question hashes from DB to avoid duplicates
    // We store the hash in question._hash if we added it, or we calculate it.
    // For now, let's fetch all questions to compare text.
    console.log("🔍 Fetching existing data for deduplication...");
    const { data: existingData, error: fetchError } = await supabase.from('grammar_labs').select('topic, question');
    if (fetchError) {
        console.error("❌ Failed to fetch existing data:", fetchError.message);
        return;
    }

    const existingHashes = new Set(
        existingData?.map((item: any) => {
            // If we have a stored hash, use it. Otherwise, generate it from the text.
            return item.question._hash || generateQuestionHash(item.topic, item.question.question);
        }) || []
    );

    console.log(`📊 Currently have ${existingHashes.size} unique questions in database.`);

    const toInsert: any[] = [];
    let duplicateCount = 0;
    let invalidCount = 0;

    for (const file of files) {
        console.log(`\n📄 Processing file: ${file}`);
        const filePath = path.join(DATA_DIR, file);
        let rawContent = fs.readFileSync(filePath, 'utf8');
        
        // Handle malformed JSON blocks - arrays separated by whitespace or newlines: ] ... [
        let sanitizedContent = rawContent.trim();
        sanitizedContent = sanitizedContent.replace(/\]\s*\[/g, ',');
        sanitizedContent = sanitizedContent
            .replace(/"([A-E])"\)/g, '"$1)')
            .replace(/"\|([A-E])"\)/g, '"$1)')
            .replace(/"&([A-E])"\)/g, '"$1)');

        let questions: any[] = [];
        try {
            const parsed = JSON.parse(sanitizedContent);
            questions = Array.isArray(parsed) ? parsed : (parsed.topics ? parsed.topics.flatMap((t:any) => t.questions.map((q:any) => ({...q, topic: t.topic}))) : [parsed]);
        } catch (e: any) {
            console.error(`❌ JSON Parse Error in ${file}: ${e.message}. Attempting fallback...`);
            const blocks = sanitizedContent.match(/\{[\s\S]*?\}/g) || [];
            for (const block of blocks) {
                try {
                    const qRes = JSON.parse(block);
                    if (qRes.topic && qRes.question) questions.push(qRes);
                } catch {}
            }
        }

        for (let i = 0; i < questions.length; i++) {
            const q = questions[i];
            
            if (!validateQuestion(q, i, file)) {
                invalidCount++;
                continue;
            }

            const hash = generateQuestionHash(q.topic, q.question);
            if (existingHashes.has(hash)) {
                duplicateCount++;
                continue;
            }

            toInsert.push(formatQuestion(q, hash));
            // Add to existing hashes to prevent multi-file duplicates in same run
            existingHashes.add(hash);
        }
    }

    if (toInsert.length === 0) {
        console.log(`\n✨ No new questions to add. (Skipped ${duplicateCount} duplicates, ${invalidCount} invalid)`);
        return;
    }

    console.log(`\n📤 Inserting ${toInsert.length} new questions... (Skipped ${duplicateCount} duplicates, ${invalidCount} invalid)`);

    const BATCH_SIZE = 50;
    for (let i = 0; i < toInsert.length; i += BATCH_SIZE) {
        const batch = toInsert.slice(i, i + BATCH_SIZE);
        const { error } = await supabase.from('grammar_labs').insert(batch);
        
        if (error) {
            console.error(`❌ Batch Insert Error at index ${i}:`, error.message);
            throw error;
        }
        console.log(`✅ Progress: ${i + batch.length}/${toInsert.length}`);
    }

    console.log("\n✨ Seeding completed successfully!");
}

startSeeding().catch(err => {
    console.error("\n❌ Critical error:", err.message);
    process.exit(1);
});
