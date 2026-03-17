"use client";

import React from 'react';
import { ShieldCheck, ArrowLeft, Lock, Eye, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PrivacyPolicy() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-white text-slate-900 p-6 md:p-12">
            <button 
                onClick={() => router.back()}
                className="mb-8 flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-bold uppercase text-[11px] tracking-widest"
            >
                <ArrowLeft size={16} /> Back
            </button>

            <header className="mb-12">
                <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center text-white mb-6 shadow-xl shadow-indigo-100">
                    <ShieldCheck size={32} />
                </div>
                <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-4">Privacy Policy</h1>
                <p className="text-slate-500 font-medium">Last Updated: March 17, 2026</p>
            </header>

            <div className="max-w-2xl space-y-10 leading-relaxed text-[15px] font-medium text-slate-700">
                <section>
                    <div className="flex items-center gap-3 mb-4 text-indigo-600">
                        <Lock size={20} />
                        <h2 className="text-lg font-black uppercase tracking-tight">Data Collection</h2>
                    </div>
                    <p>
                        YDTHub collect minimal data to provide our services. This includes your email and basic profile information provided during social login (Google/Apple) to manage your account and track your learning progress.
                    </p>
                </section>

                <section>
                    <div className="flex items-center gap-3 mb-4 text-indigo-600">
                        <Eye size={20} />
                        <h2 className="text-lg font-black uppercase tracking-tight">How we use your data</h2>
                    </div>
                    <p>
                        Your data is strictly used to:
                    </p>
                    <ul className="list-disc pl-5 mt-3 space-y-2">
                        <li>Sync your progress across devices.</li>
                        <li>Provide personalized AI Analyzer feedback.</li>
                        <li>Update you on new features and educational content.</li>
                    </ul>
                </section>

                <section>
                    <div className="flex items-center gap-3 mb-4 text-indigo-600">
                        <FileText size={20} />
                        <h2 className="text-lg font-black uppercase tracking-tight">Your Rights</h2>
                    </div>
                    <p>
                        You have the right to access, modify, or delete your data at any time. You can use the &quot;Delete Account&quot; button in the Settings menu to permanently remove all your information from our servers.
                    </p>
                </section>

                <section className="pt-8 border-t border-slate-100">
                    <p className="text-sm text-slate-400 italic">
                        By using YDTHub, you agree to the collection and use of information in accordance with this policy. For any questions, please visit our Support Center.
                    </p>
                </section>
            </div>
        </div>
    );
}
