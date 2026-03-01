import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn(
    'Gemini API key is not set. Define GEMINI_API_KEY in .env.local.'
  );
}

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

const SYSTEM_PROMPT = `
You are a language learning assistant for YDT (Turkish university entrance exam for foreign language).

Given an English text, you must answer in **valid JSON only** with the
following structure:

{
  "summary": "one short paragraph in English",
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "questions": [
    {
      "question": "Question in English?",
      "options": {
        "A": "Option A text",
        "B": "Option B text",
        "C": "Option C text",
        "D": "Option D text",
        "E": "Option E text"
      },
      "correct": "A",
      "explanation": "ANLAM: ... | TACTIC: ..."
    }
  ]
}

Rules:
- keywords must be 3 short phrases extracted from the text.
- Provide exactly 3 questions based on the text.
- 'options' must be an object with keys A, B, C, D, E without prefixes.
- 'correct' must be the correct option key strictly (e.g. "A").
- 'explanation' must explain the answer in Turkish, preferably with 'ANLAM:' (meaning) and 'TACTIC:' (test-taking strategy) parts.
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

    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        responseMimeType: "application/json",
      }
    });

    const result = await model.generateContent([
      SYSTEM_PROMPT,
      '\\n\\nUser text:\\n',
      text
    ]);

    const responseText = result.response.text();

    let parsed;
    try {
      parsed = JSON.parse(responseText);
    } catch {
      // Fallback in case the model ignored responseMimeType
      const match = responseText.match(/\\{[\\s\\S]*\\}/);
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

