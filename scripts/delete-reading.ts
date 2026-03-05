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

async function clearReading() {
    console.log("🗑️ Deleting all reading_labs records...");

    // Using a broad condition to delete all rows
    const { error } = await supabase
        .from('reading_labs')
        .delete()
        .neq('id', -1);

    if (error) {
        console.error("Error deleting reading labs:", error.message);
    } else {
        console.log("✅ Successfully cleared reading_labs table.");
    }
}

clearReading().catch(console.error);
