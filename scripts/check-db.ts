import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

async function main() {
    // Check Cloze Test
    const { data: cloze, error: e1 } = await supabase.from('skills_labs').select('*').eq('topic', 'Cloze Test').limit(1);
    if (e1) console.error('CLOZE ERROR:', e1.message);
    console.log('=== CLOZE TEST question structure ===');
    if (cloze?.[0]) {
        const q = cloze[0].question;
        console.log('Top-level keys:', Object.keys(q));
        if (q.questions) {
            console.log('Sub-question[0] keys:', Object.keys(q.questions[0]));
            console.log('Sub-question[0] sample:', JSON.stringify(q.questions[0], null, 2));
        }
    } else {
        console.log('No Cloze data found');
    }

    // Check Irrelevant
    const { data: irr, error: e2 } = await supabase.from('skills_labs').select('*').eq('topic', 'Irrelevant').limit(1);
    if (e2) console.error('IRRELEVANT ERROR:', e2.message);
    console.log('\n=== IRRELEVANT question structure ===');
    if (irr?.[0]) {
        const q = irr[0].question;
        console.log('Top-level keys:', Object.keys(q));
        console.log('Sample (first 800 chars):', JSON.stringify(q, null, 2).slice(0, 800));
    } else {
        console.log('No Irrelevant data found');
    }

    const { count: cCount } = await supabase.from('skills_labs').select('*', { count: 'exact' }).eq('topic', 'Cloze Test');
    const { count: iCount } = await supabase.from('skills_labs').select('*', { count: 'exact' }).eq('topic', 'Irrelevant');
    console.log(`\nTotal rows -> Cloze: ${cCount}, Irrelevant: ${iCount}`);
}

main().catch(console.error);
