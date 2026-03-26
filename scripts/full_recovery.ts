import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error("Missing Supabase credentials in .env.local");
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const dataFiles = [
    '/Users/ibrahimoner/Desktop/YDTHub/src/data/skills_part1.json',
    '/Users/ibrahimoner/Desktop/YDTHub/src/data/skills_part2.json',
    '/Users/ibrahimoner/Desktop/YDTHub/src/data/skills_part3.json',
    '/Users/ibrahimoner/Desktop/YDTHub/src/data/skills_final.json'
];

const newQuestionsFile = '/Users/ibrahimoner/Downloads/ydt_skills_lab_80_questions.json';
const SKIP_IDS = [4, 26, 40]; // Heisenberg, Entanglement, Problem of Identity

async function runRecovery() {
    console.log('🧹 Clearing Skills Lab table...');
    await supabase.from('skills_labs').delete().neq('topic', 'placeholder'); // Delete all

    console.log('🚀 Importing Legacy Questions (Part 1-3 + Final)...');

    for (const file of dataFiles) {
        console.log(`Processing ${path.basename(file)}...`);
        const content = JSON.parse(fs.readFileSync(file, 'utf-8'));

        for (const key in content) {
            const list = content[key];
            if (!Array.isArray(list)) continue;

            for (const item of list) {
                const topic = item.topic;
                let questionData: any = item.question;

                // Standardize format: UI expects an array for 'quiz' or the specific Irrelevant/Cloze shapes
                if (topic === 'Irrelevant') {
                    // Already an object { sentences, correct_answer } in legacy files
                } else if (topic === 'Cloze Test') {
                    // Already an object { passage, questions }
                } else {
                    // Wrap single legacy question in an array if it isn't one
                    if (!Array.isArray(questionData)) {
                        questionData = [questionData];
                    }
                }

                await supabase.from('skills_labs').insert({
                    topic: topic,
                    question: questionData
                });
                process.stdout.write('.');
            }
        }
    }

    console.log('\n🚀 Importing New 80 Questions (Filtered)...');
    const newData = JSON.parse(fs.readFileSync(newQuestionsFile, 'utf-8'));
    
    for (const part of newData.parts) {
        const category = part.category_name;
        // Map category names to legacy topics
        const topicMap: any = {
            'Sentence Completion': 'Sentence Completion',
            'Translation (EN-TR)': 'Translation (EN-TR)',
            'Translation (TR-EN)': 'Translation (TR-EN)',
            'Dialogue Completion': 'Dialogue Completion',
            'Situation': 'Situation',
            'Restatement': 'Restatement',
            'Paragraph Completion': 'Paragraph Completion',
            'Irrelevant': 'Irrelevant'
        };
        const topic = topicMap[category] || category;
        const questions = part.questions.filter((q: any) => !SKIP_IDS.includes(q.id));

        for (const q of questions) {
            let payload: any = null;

            if (topic === 'Irrelevant') {
                const sentences = q.question.split(/\((?:I|II|III|IV|V)\)/g)
                    .filter((s: string) => s.trim().length > 0)
                    .map((s: string) => s.trim());
                
                payload = {
                    sentences: sentences,
                    correct_answer: q.correct,
                    hint: q.analyzer.hint,
                    feedback: { 
                        pitfall: q.analyzer.pitfall,
                        logic_flow: q.analyzer.logic_flow
                    }
                };
            } else {
                payload = [{
                    question: q.question,
                    options: q.options,
                    correct: q.correct,
                    hint: q.analyzer.hint,
                    feedback: { 
                        pitfall: q.analyzer.pitfall,
                        logic_flow: q.analyzer.logic_flow
                    }
                }];
            }

            await supabase.from('skills_labs').insert({
                topic: topic,
                question: payload
            });
            process.stdout.write('+');
        }
    }

    console.log('\n🏁 Recovery and Import Complete!');
}

runRecovery();
