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

async function cleanupSituation() {
    console.log("🧼 Cleaning up 'Situation' questions from skills_labs...");

    const { error } = await supabase
        .from('skills_labs')
        .delete()
        .eq('topic', 'Situation');

    if (error) {
        console.error("❌ Error cleaning Situation:", error.message);
    } else {
        console.log("✅ Successfully cleared 'Situation' questions.");
    }
}

cleanupSituation().catch(console.error);
