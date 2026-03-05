import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

async function main() {
    const { error } = await supabase.from('skills_labs').delete().eq('topic', 'Cloze Test');
    if (error) {
        console.error('Delete error:', error.message);
    } else {
        console.log(`✅ Deleted Cloze Test rows.`);
    }
}

main().catch(console.error);
