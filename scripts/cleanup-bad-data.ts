import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing Supabase credentials");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanup() {
    console.log("🧼 Cleaning up low-quality/incorrectly formatted questions...");

    // 1. Delete "In-Context Vocab" from skills_labs (since we have vocab_labs now)
    const { error: err1 } = await supabase.from('skills_labs').delete().eq('topic', 'In-Context Vocab');
    if (err1) console.error("Error cleaning skills_labs:", err1.message);
    else console.log("✅ Removed 'In-Context Vocab' from skills_labs.");

    // 2. Clear vocab_labs mode='context' to regenerate with higher quality
    const { error: err2 } = await supabase.from('vocab_labs').delete().eq('mode', 'context');
    if (err2) console.error("Error cleaning vocab_labs:", err2.message);
    else console.log("✅ Cleared 'context' mode in vocab_labs for fresh start.");

    // 3. Clear specific Skill topics to regenerate correctly
    const topicsToClear = ["Cloze Test", "Irrelevant"];
    for (const topic of topicsToClear) {
        const { error } = await supabase.from('skills_labs').delete().eq('topic', topic);
        if (error) console.error(`Error cleaning ${topic}:`, error.message);
        else console.log(`✅ Cleared '${topic}' from skills_labs.`);
    }

    // 4. Clear reading_labs (optional but recommended if they are in Turkish)
    const { error: err3 } = await supabase.from('reading_labs').delete().neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
    if (err3) console.error("Error cleaning reading_labs:", err3.message);
    else console.log("✅ Cleared all 'reading_labs' for fresh start.");

    console.log("\n✨ Cleanup finished. Ready for high-quality regeneration.");
}

cleanup().catch(console.error);
