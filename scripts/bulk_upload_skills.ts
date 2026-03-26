import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function uploadFile(filePath: string) {
  console.log(`Reading ${filePath}...`);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  
  let allQuestions: any[] = [];
  
  // Consolidate different keys (cloze_tests, sentence_completions, etc.)
  Object.values(data).forEach((questions: any) => {
    if (Array.isArray(questions)) {
      allQuestions = [...allQuestions, ...questions];
    }
  });

  if (allQuestions.length === 0) {
    console.log(`No questions found in ${filePath}`);
    return;
  }

  console.log(`Uploading ${allQuestions.length} questions from ${filePath}...`);
  
  const { data: inserted, error } = await supabase
    .from('skills_labs')
    .insert(allQuestions.map(q => ({
      topic: q.topic,
      question: q.question
    })));

  if (error) {
    console.error(`Error uploading ${filePath}:`, error);
  } else {
    console.log(`Successfully uploaded ${allQuestions.length} questions from ${filePath}.`);
  }
}

async function main() {
  const files = [
    'src/data/skills_part3.json',
    'src/data/skills_final.json'
  ];

  for (const file of files) {
    await uploadFile(path.join(process.cwd(), file));
  }
  
  console.log('Bulk upload completed!');
}

main();
