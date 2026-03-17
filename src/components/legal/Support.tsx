import React from 'react';
import { Container } from "../ui/Container";

export const Support = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <Container className="max-w-3xl bg-white border border-slate-100 rounded-[2.5rem] p-8 sm:p-12 shadow-xl">
        <h1 className="text-3xl font-black italic text-indigo-900 mb-8 border-b pb-4">Support Center</h1>
        
        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-3">How can we help?</h2>
            <p className="text-slate-600 leading-relaxed italic">
              Experience any issues with your YDT preparation journey? Our team is here to help you get back on track.
            </p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 rounded-3xl bg-indigo-50 border border-indigo-100">
              <h3 className="font-black text-indigo-600 uppercase text-xs mb-2">Email Us</h3>
              <p className="text-slate-700 text-sm font-medium">support@ydthub.com</p>
              <p className="text-slate-400 text-[10px] mt-1 italic">Average response: 24h</p>
            </div>
            
            <div className="p-6 rounded-3xl bg-amber-50 border border-amber-100">
              <h3 className="font-black text-amber-600 uppercase text-xs mb-2">Report Bug</h3>
              <p className="text-slate-700 text-sm font-medium">github.com/ydthub/issues</p>
              <p className="text-slate-400 text-[10px] mt-1 italic">Public issue tracker</p>
            </div>
          </div>

          <section className="pt-8">
            <h3 className="font-bold text-slate-800 mb-4">Frequently Asked Questions</h3>
            <div className="space-y-4 text-sm">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="font-black text-slate-700 mb-1">How does AI analysis work?</p>
                <p className="text-slate-500">We use Gemini AI to scan the text you provide and extract vocabulary and grammar patterns relevant to the YDT exam.</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="font-black text-slate-700 mb-1">Is my progress saved across devices?</p>
                <p className="text-slate-500">Currently, progress is saved locally on your device. Cloud sync with Supabase is coming soon.</p>
              </div>
            </div>
          </section>
        </div>
      </Container>
    </div>
  );
};
