import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Prefer server-only key if available, fall back to NEXT_PUBLIC_ for dev/demo.
const apiKey =
  process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!apiKey) {
  console.warn(
    'Gemini API key is not set. Define GEMINI_API_KEY (recommended) or NEXT_PUBLIC_GEMINI_API_KEY in .env.local.'
  );
}

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

const SYSTEM_PROMPT = `
You are a language learning assistant.

Given an English text, you must answer in **valid JSON only** with the
following structure (no extra commentary, no markdown):

{
  "summary": "one short paragraph in English",
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "questions": [
    {
      "prompt": "Question in English?",
      "options": ["A) ...", "B) ...", "C) ...", "D) ..."]
    },
    {
      "prompt": "Question in English?",
      "options": ["A) ...", "B) ...", "C) ...", "D) ..."]
    },
    {
      "prompt": "Question in English?",
      "options": ["A) ...", "B) ...", "C) ...", "D) ..."]
    }
  ]
}

Rules:
- keywords must be 3 short phrases extracted from the text.
- each options array must contain exactly 4 options starting with "A) ", "B) ", "C) ", "D) ".
- Do not include explanations or indicate which option is correct.
`;

export async function POST(req: NextRequest) {
  if (!genAI) {
    return NextResponse.json(
      { error: 'API key is not configured on the server.' },
      { status: 500 }
    );
  }

  try {
    const { text } = await req.json();

    if (!text || typeof text !== 'string' || !text.trim()) {
      return NextResponse.json(
        { error: 'Text is required for analysis.' },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

    const result = await model.generateContent([
      SYSTEM_PROMPT,
      '\n\nUser text:\n',
      text
    ]);

    const responseText = result.response.text();

    // Try to be robust against markdown fences or commentary.
    const cleaned = responseText
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      const match = cleaned.match(/\{[\s\S]*\}/);
      if (!match) {
        throw new Error('Model returned non-JSON response.');
      }
      parsed = JSON.parse(match[0]);
    }

    return NextResponse.json(parsed);
  } catch (error) {
    console.error('Error while calling Gemini:', error);
    return NextResponse.json(
      {
        error: 'Metin analizi sırasında bir hata oluştu. Lütfen tekrar deneyin.'
      },
      { status: 500 }
    );
  }
}

