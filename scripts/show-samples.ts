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

async function showSamples() {
    console.log("🔍 Fetching generated question samples...\n");

    // Skills
    const { data: skills } = await supabase.from('skills_labs').select('*').eq('topic', 'Situation').limit(1);
    if (skills && skills.length > 0) {
        console.log("--- SKILLS (SITUATION) SAMPLE ---");
        console.log(JSON.stringify(skills[0].question[0], null, 2));
        console.log("\n");
    }
}

showSamples().catch(console.error);
