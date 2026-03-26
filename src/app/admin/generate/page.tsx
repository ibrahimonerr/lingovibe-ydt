"use client";

import React, { useState } from 'react';
import { aiService } from '@/services/aiService';
import { supabase } from '@/lib/supabase';
import { Database, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AdminGeneratePage() {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'idle' | 'success' | 'error', msg: string }>({ type: 'idle', msg: '' });

    const generateReading = async () => {
        setLoading(true);
        setStatus({ type: 'idle', msg: 'Generating 1 Reading Passage...' });

        try {
            const prompt = `Generate a short English reading passage (about 100-150 words) suitable for YDT (Turkish university language exam) along with 3 multiple-choice questions in valid JSON format.
{
  "passage": "passage text...",
  "quiz": [
    {
      "question": "question text...",
      "options": {"A": "...", "B": "...", "C": "...", "D": "...", "E": "..."},
      "correct": "A",
      "hint": "Türkçe ipucu. Hangi satıra veya kelimeye odaklanmalı? ASLA doğru cevabı veya şıkkı içine yazma.",
      "quote": "The EXACT sentence or phrase from the passage where the answer is found. Must match passage text perfectly.",
      "explanation": "ANLAM: ... | TACTIC: ..."
    }
  ]
}
Return only JSON block. Ensure explanation is in Turkish.`;

            const responseText = await aiService.generateContent(prompt);
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : responseText);

            if (parsed && parsed.quiz && parsed.passage) {
                setStatus({ type: 'idle', msg: 'Inserting into Supabase...' });
                const { error } = await supabase.from('reading_labs').insert([
                    { passage: parsed.passage, questions: parsed.quiz }
                ]);

                if (error) throw error;
                setStatus({ type: 'success', msg: 'Successfully added 1 Reading Lab to DB.' });
            } else {
                throw new Error("Invalid structure from AI.");
            }
        } catch (e) {
            console.error(e);
            setStatus({ type: 'error', msg: e instanceof Error ? e.message : 'An error occurred.' });
        } finally {
            setLoading(false);
        }
    };

    const generateGrammar = async (topic: string) => {
        setLoading(true);
        setStatus({ type: 'idle', msg: `Generating Grammar (${topic})...` });

        try {
            const prompt = `
Rol Tanımı: Sen, 20 yıldır YDT, YDS ve TOEFL gibi üst düzey İngilizce sınavları için soru hazırlayan kıdemli bir ölçme ve değerlendirme uzmanısın. ELS (English Language Studies) ve benzeri saygın yayınların soru hazırlama mantığına (mantık silsilesi, akademik dil ve çeldirici kalitesi) tamamen hakimsin.

Görev: Aşağıdaki kriterlere uygun olarak, [Hedef Konu: ${topic}] konularını test eden özgün, akademik ve zorluk derecesi yüksek (CEFR B2+ / C1 seviyesi) 3 adet soru hazırla.

Soru Kriterleri:
1. Cümle Yapısı: Cümleler basit olmamalı. Bilimsel bir makaleden, arkeolojik bir bulgudan veya sosyolojik bir analizden alınmış gibi duran kompleks cümleler (compound-complex sentences) kurmalısın.
2. Boşluk Yapısı: Sorular tercihen "dual-gap" (iki boşluklu) olmalı ve her iki boşluk arasındaki zaman (tense) veya yapı uyumu öğrenciyi düşündürmeli.
3. Kelime Dağarcığı: Cümle içerisinde akademik "keyword"ler (örn. mitigate, alleviate, underscore, notwithstanding) kullanılmalı.
4. Çeldiriciler (Distractors): Çeldiriciler "saçma" olmamalı; gramer olarak mümkün görünse de anlamca veya sınav tekniği açısından (zaman uyumu, ipucu kelimeler) yanlış olmalı. Özellikle "yakın anlamlı" veya "yaygın yapılan öğrenci hataları" üzerine kurgulanmalı.
5. Seçenek Sayısı: 5 seçenek (A-E).

Format: Çıktıyı MUTLAKA aşağıdaki JSON formatında ver. Başka hiçbir metin ekleme.

      "question": "Soru metni (boşluklar ___ ile belirtilmeli)",
      "options": {"A": "...", "B": "...", "C": "...", "D": "...", "E": "..."},
      "correct": "Letter (e.g. A)",
      "hint": "🔍 Hint: Soruyu görür görmez öğrencinin araması gereken ipucu kelimesi veya yapısal işaret. ASLA doğru cevabı veya şıkkı içine yazma.",
      "feedback": {
        "logic": "💡The Logic Flow: Sorunun çözüm yolunu adım adım anlatan akıl yürütme. 'Eğer boşluktan sonra şunu görüyorsan, şu yapıya gitmelisin' gibi bir akıl yürütme sun.",
        "pitfall": "⚠️ \"Sakın Düşme!\" (The Pitfall): En güçlü çeldiricinin neden yanlış olduğunu ve öğrencilerin orada neden hata yaptığını teknik olarak açıkla."
      }
    }
  ]
}
`;

            const responseText = await aiService.generateContent(prompt);
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : responseText);

            if (parsed && parsed.quiz && Array.isArray(parsed.quiz)) {
                setStatus({ type: 'idle', msg: 'Inserting into Supabase...' });
                // Insert each question as a separate row or grouping them. Here we insert them as 1 lab array to match our current UI architecture
                const { error } = await supabase.from('grammar_labs').insert([
                    { topic, question: parsed.quiz }
                ]);
                if (error) throw error;
                setStatus({ type: 'success', msg: `Successfully added Grammar Lab (${topic}) to DB.` });
            } else {
                throw new Error("Invalid structure from AI.");
            }
        } catch (e) {
            console.error(e);
            setStatus({ type: 'error', msg: e instanceof Error ? e.message : 'An error occurred.' });
        } finally {
            setLoading(false);
        }
    };

    const generateSkills = async (topic: string) => {
        setLoading(true);
        setStatus({ type: 'idle', msg: `Generating Skills (${topic})...` });

        try {
            const prompt = `
Rol Tanımı: Sen, 20 yıllık deneyime sahip bir YDT/YDS ölçme ve değerlendirme uzmanısın. ELS ve benzeri akademik yayınların Skills ([Hedef Konu: ${topic}]) soruları hazırlama mantığına tamamen hakimsin.

Görev: Aşağıda belirtilen kategori için, akademik derinliği olan (B2+/C1) 3 adet özgün soru hazırla.
[SKILL CATEGORY]: ${topic}

Soru Kriterleri:
1. Metinler: Bilimsel, felsefi veya teknolojik bir arka plana sahip, kompleks cümlelerden oluşmalı.
2. Çeldiriciler: Konuyla ilgili görünen ama "bağlamdan kopuk" veya "mantıksal akışı bozan" ifadelerden seçilmeli.

Format: Çıktıyı MUTLAKA aşağıdaki JSON formatında ver. Başka hiçbir metin ekleme.
{
  "quiz": [
    {
      "question": "Soru metni veya pasaj...",
      "options": {"A": "...", "B": "...", "C": "...", "D": "...", "E": "..."},
      "correct": "Letter (e.g. A)",
      "hint": "🔍 Hint (Kritik İpucu): Sorudaki 'Referans Kelime' (it, this, such), 'Geçiş Kelimesi' (However, Thus) veya 'Anahtar Kavram' ipucunu doğrudan belirt. ASLA doğru cevabı veya şıkkı içine yazma.",
      "feedback": {
        "pitfall": "⚠️ \"Sakın Düşme!\" (The Pitfall): En güçlü çeldiricinin neden yanlış olduğunu (örn. 'aşırı genelleme', 'zaman uyumsuzluğu') teknik olarak açıkla."
      }
    }
  ]
}
`;

            const responseText = await aiService.generateContent(prompt);
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : responseText);

            if (parsed && parsed.quiz && Array.isArray(parsed.quiz)) {
                setStatus({ type: 'idle', msg: 'Inserting into Supabase...' });
                const { error } = await supabase.from('skills_labs').insert([
                    { topic, question: parsed.quiz }
                ]);
                if (error) throw error;
                setStatus({ type: 'success', msg: `Successfully added Skills Lab (${topic}) to DB.` });
            } else {
                throw new Error("Invalid structure from AI.");
            }
        } catch (e) {
            console.error(e);
            setStatus({ type: 'error', msg: e instanceof Error ? e.message : 'An error occurred.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-8 font-sans">
            <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 shadow-xl border border-slate-200">
                <div className="flex items-center gap-4 mb-8 pb-6 border-b">
                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                        <Database size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-slate-900">YDT Content Generator</h1>
                        <p className="text-slate-500 font-medium">Bypass real-time API. Pre-generate and store in Supabase.</p>
                    </div>
                </div>

                {/* Status Bar */}
                {status.msg && (
                    <div className={`p-4 rounded-xl mb-6 flex items-center gap-3 font-bold ${status.type === 'error' ? 'bg-rose-50 text-rose-700 border border-rose-200' : status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-700'}`}>
                        {status.type === 'error' && <AlertCircle size={20} />}
                        {status.type === 'success' && <CheckCircle2 size={20} />}
                        {status.type === 'idle' && loading && <Loader2 size={20} className="animate-spin" />}
                        {status.msg}
                    </div>
                )}

                <div className="grid md:grid-cols-3 gap-6">
                    {/* READING */}
                    <div className="p-6 border-2 border-amber-100 bg-amber-50/30 rounded-2xl">
                        <h2 className="font-black text-amber-900 mb-2">Reading Labs</h2>
                        <p className="text-[12px] text-amber-700 mb-6">Generates 1 short passage + 3 questions.</p>
                        <button disabled={loading} onClick={generateReading} className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition-all disabled:opacity-50">Generate Reading</button>
                    </div>

                    {/* GRAMMAR */}
                    <div className="p-6 border-2 border-emerald-100 bg-emerald-50/30 rounded-2xl">
                        <h2 className="font-black text-emerald-900 mb-2">Grammar Labs</h2>
                        <p className="text-[12px] text-emerald-700 mb-6">Generates 3 mixed grammar questions.</p>
                        <div className="space-y-2">
                            <button disabled={loading} onClick={() => generateGrammar('Tenses')} className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg text-sm disabled:opacity-50">Tenses</button>
                            <button disabled={loading} onClick={() => generateGrammar('Modals')} className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg text-sm disabled:opacity-50">Modals</button>
                            <button disabled={loading} onClick={() => generateGrammar('Mixed')} className="w-full py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-sm disabled:opacity-50">Random / Mixed</button>
                        </div>
                    </div>

                    {/* SKILLS */}
                    <div className="p-6 border-2 border-violet-100 bg-violet-50/30 rounded-2xl">
                        <h2 className="font-black text-violet-900 mb-2">Skills Labs</h2>
                        <p className="text-[12px] text-violet-700 mb-6">Generates 3 skill-based questions.</p>
                        <div className="space-y-2">
                            <button disabled={loading} onClick={() => generateSkills('Sentence Completion')} className="w-full py-2 bg-violet-500 hover:bg-violet-600 text-white font-bold rounded-lg text-sm disabled:opacity-50">Sentence Comp.</button>
                            <button disabled={loading} onClick={() => generateSkills('Restatement')} className="w-full py-2 bg-violet-500 hover:bg-violet-600 text-white font-bold rounded-lg text-sm disabled:opacity-50">Restatement</button>
                            <button disabled={loading} onClick={() => generateSkills('Paragraph Completion')} className="w-full py-2 bg-violet-500 hover:bg-violet-600 text-white font-bold rounded-lg text-sm disabled:opacity-50">Paragraph Comp.</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
