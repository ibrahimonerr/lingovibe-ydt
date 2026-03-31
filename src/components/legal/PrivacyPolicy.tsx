import React from 'react';
import { Container } from "../ui/Container";

export const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white py-12 px-6">
      <Container className="max-w-3xl border border-slate-100 rounded-[2.5rem] p-8 sm:p-12 shadow-sm">
        <h1 className="text-3xl font-black italic text-slate-900 mb-8 border-b pb-4">Privacy Policy</h1>
        
        <div className="space-y-6 text-slate-600 leading-relaxed text-sm">
          <section>
            <h2 className="text-lg font-bold text-slate-800 mb-2 uppercase tracking-tight">1. Overview</h2>
            <p>
              Welcome to YDTHub. Your privacy is important to us. This policy explains how we handle your data within the application.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-800 mb-2 uppercase tracking-tight">2. Data Collection</h2>
            <p>
              YDTHub is an offline-first learning application. We use:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Local Storage:</strong> To save your progress, active missions, and preferences directly on your device.</li>
              <li><strong>Supabase:</strong> For secure user authentication (sign in/sign out) and to serve question bank data. We do not sell or share your personal data with third parties.</li>
            </ul>
          </section>


          <section>
            <h2 className="text-lg font-bold text-slate-800 mb-2 uppercase tracking-tight">4. Your Rights</h2>
            <p>
              As your data is primarily stored locally, you have full control. You can clear your data by resetting the application or clearing your browser&apos;s local storage.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-bold text-slate-800 mb-2 uppercase tracking-tight">5. Contact</h2>
            <p>
              For any privacy-related questions, please contact us through our support channels.
            </p>
          </section>

          <footer className="mt-12 pt-8 border-t border-slate-50 text-[10px] uppercase font-bold text-slate-400">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </footer>
        </div>
      </Container>
    </div>
  );
};
