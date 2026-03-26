import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';
import { execSync } from 'child_process';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function runSeeder(name: string, scriptPath: string) {
    console.log(`\n-----------------------------------------`);
    console.log(`🚀 STARTING: ${name}`);
    console.log(`-----------------------------------------`);

    // execSync throws an error if the process exits with non-zero
    // We let it throw to fail the main process
    execSync(`npx tsx ${scriptPath}`, { stdio: 'inherit' });
    console.log(`✅ COMPLETED: ${name}`);
}

async function main() {
    console.log("🌟 YDTHub Total Auto-Seeding Started 🌟");

    // Env Check
    const missing = [];
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) missing.push("NEXT_PUBLIC_SUPABASE_URL");
    if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) missing.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");
    if (!process.env.GITHUB_TOKEN) missing.push("GITHUB_TOKEN");

    if (missing.length > 0) {
        console.error(`❌ CRITICAL: Missing environment variables: ${missing.join(", ")}`);
        process.exit(1);
    }

    try {
        // Sırasıyla tüm scriptleri çalıştırır
        await runSeeder("Grammar Seeder", "scripts/seed-grammar.ts");
        await runSeeder("Skills Seeder", "scripts/seed-skills.ts");
        await runSeeder("Vocabulary Seeder", "scripts/seed-vocab.ts");
        await runSeeder("Reading Seeder", "scripts/seed-reading.ts");
        await runSeeder("Flashcards Seeder", "scripts/seed-flashcards.ts");

        console.log("\n🥳 ALL TASKS COMPLETED! Your database is now populated with GPT-4o quality questions.");
        process.exit(0);
    } catch (error) {
        console.error("\n❌ SEEDING FAILED! One or more scripts encountered an error.");
        process.exit(1);
    }
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
