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

async function clearAllQuestions() {
    console.log("🗑️  Clearing ALL question data from database...\n");

    // 1. Clear grammar_labs
    const { error: err1 } = await supabase.from('grammar_labs').delete().gt('id', 0);
    if (err1) console.error("❌ Error clearing grammar_labs:", err1.message);
    else console.log("✅ Cleared grammar_labs");

    // 2. Clear skills_labs
    const { error: err2 } = await supabase.from('skills_labs').delete().gt('id', 0);
    if (err2) console.error("❌ Error clearing skills_labs:", err2.message);
    else console.log("✅ Cleared skills_labs");

    // 3. Clear vocab_labs
    const { error: err3 } = await supabase.from('vocab_labs').delete().gt('id', 0);
    if (err3) console.error("❌ Error clearing vocab_labs:", err3.message);
    else console.log("✅ Cleared vocab_labs");

    // 4. Clear reading_labs
    const { error: err4 } = await supabase.from('reading_labs').delete().gt('id', 0);
    if (err4) console.error("❌ Error clearing reading_labs:", err4.message);
    else console.log("✅ Cleared reading_labs");

    console.log("\n✨ All question tables cleared. Ready for fresh Gemini-only generation.");
}

clearAllQuestions().catch(console.error);
