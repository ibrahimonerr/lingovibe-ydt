import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanupGrammar() {
    console.log("🧹 Cleaning up incompatible grammar data...");
    
    // We want to remove old questions to make room for new high-quality academic questions
    const { error } = await supabase
        .from('grammar_labs')
        .delete()
        .not('id', 'is', null); // Standard way to target all rows

    if (error) {
        console.error("❌ Cleanup failed:", error.message);
    } else {
        console.log("✅ Cleanup successful. Ready for new seeding.");
    }
}

cleanupGrammar().catch(console.error);
