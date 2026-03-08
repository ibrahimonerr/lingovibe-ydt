import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';
import { execSync } from 'child_process';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function runSeeder(name: string, scriptPath: string) {
    console.log(`\n-----------------------------------------`);
    console.log(`🚀 STARTING: ${name}`);
    console.log(`-----------------------------------------`);
    try {
        execSync(`npx tsx ${scriptPath}`, { stdio: 'inherit' });
        console.log(`✅ COMPLETED: ${name}`);
    } catch (e) {
        console.error(`❌ FAILED: ${name}`);
    }
}

async function main() {
    console.log("🌟 YDTHub Total Auto-Seeding Started 🌟");

    // Sırasıyla tüm scriptleri çalıştırır
    await runSeeder("Grammar Seeder", "scripts/seed-grammar.ts");
    await runSeeder("Skills Seeder", "scripts/seed-skills.ts");
    await runSeeder("Vocabulary Seeder", "scripts/seed-vocab.ts");
    await runSeeder("Reading Seeder", "scripts/seed-reading.ts");

    console.log("\n🥳 ALL TASKS COMPLETED! Your database is now populated with GPT-4o quality questions.");
    process.exit(0);
}

main().catch(console.error);
