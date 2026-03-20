"use client";

import React from 'react';
import { Mail, ArrowLeft, MessageSquare, ExternalLink, LifeBuoy } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SupportPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 p-6 md:p-12">
            <button 
                onClick={() => router.back()}
                className="mb-8 flex items-center gap-2 text-slate-500 hover:text-amber-600 transition-colors font-bold uppercase text-[11px] tracking-widest"
            >
                <ArrowLeft size={16} /> Back
            </button>

            <header className="mb-12">
                <div className="w-16 h-16 bg-amber-500 rounded-3xl flex items-center justify-center text-white mb-6 shadow-xl shadow-amber-100">
                    <LifeBuoy size={32} />
                </div>
                <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-4">Support Center</h1>
                <p className="text-slate-500 font-medium">How can we help your YDT journey?</p>
            </header>

            <div className="grid gap-6 md:grid-cols-2 max-w-4xl">
                {/* Email Support */}
                <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center mb-6">
                        <Mail size={24} />
                    </div>
                    <h2 className="text-xl font-black mb-2 tracking-tight">Email Support</h2>
                    <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                        Have a technical issue or account question? Send us an email and we&apos;ll get back to you within 24 hours.
                    </p>
                    <a 
                        href="mailto:hubydt@gmail.com" 
                        className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl text-[12px] font-black uppercase tracking-widest hover:bg-black transition-colors"
                    >
                        Contact us <ExternalLink size={14} />
                    </a>
                </div>
            </div>

            <div className="grid gap-6 max-w-4xl mt-6">
                {/* FAQ Note */}
                <div className="bg-amber-500/10 border-2 border-dashed border-amber-200 p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-6">
                   <div className="p-4 bg-white rounded-3xl shadow-sm">
                      <LifeBuoy className="text-amber-600" size={32} />
                   </div>
                   <div>
                      <h3 className="text-lg font-black text-amber-900 mb-1">Frequently Asked Questions</h3>
                      <p className="text-amber-800/70 text-sm leading-relaxed">
                        Our AI Analyzer is available 24/7 for question explanations. For subscription issues or data export requests, please use the direct email contact above.
                      </p>
                   </div>
                </div>
            </div>
            
            <p className="mt-12 text-center text-slate-300 text-[10px] font-bold uppercase tracking-widest">
                YDTHub Support • version 0.1.0
            </p>
        </div>
    );
}
