"use client";

import React, { useState } from 'react';
import YDTLogo from '@/components/YDTLogo';
import { useAppStore } from '@/store/useAppStore';
import { supabase } from '@/lib/supabase';
import { Chrome, Apple, User, ArrowRight, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
    const { setSession, setGuestMode } = useAppStore();
    const [loading, setLoading] = useState<string | null>(null);

    const handleSocialLogin = async (provider: 'google' | 'apple') => {
        setLoading(provider);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider,
                options: {
                    redirectTo: window.location.origin
                }
            });
            if (error) throw error;
        } catch (error) {
            console.error(`${provider} Login Error:`, error);
            alert(`Giriş sırasında bir hata oluştu: ${provider}`);
        } finally {
            setLoading(null);
        }
    };

    const handleGuestMode = () => {
        setLoading('guest');
        setTimeout(() => {
            setGuestMode(true);
            setLoading(null);
        }, 800);
    };

    return (
        <div className="fixed inset-0 z-[10000] bg-[#0f172a] flex flex-col items-center justify-center p-6 overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-rose-600/10 blur-[120px] rounded-full" />

            <div className="w-full max-w-[400px] flex flex-col items-center relative z-10">
                {/* Logo Section */}
                <div className="mb-12 animate-in fade-in slide-in-from-top-4 duration-1000">
                    <YDTLogo size="xl" theme="light" showSlogan={true} hideIcon={true} />
                </div>

                {/* Login Card */}
                <div className="w-full space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                    <div className="text-center mb-6">
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">
                            Yolculuğuna Başla
                        </p>
                    </div>

                    {/* Google Button */}
                    <button 
                        onClick={() => handleSocialLogin('google')}
                        disabled={!!loading}
                        className="w-full group relative flex items-center justify-center gap-3 bg-white text-slate-900 py-4 rounded-2xl font-black uppercase text-[12px] shadow-xl active:scale-95 transition-all disabled:opacity-50"
                    >
                        <Chrome size={20} className="text-[#4285F4]" />
                        Google ile Giriş Yap
                        {loading === 'google' && <div className="absolute right-4 animate-spin rounded-full h-4 w-4 border-2 border-indigo-600 border-t-transparent" />}
                    </button>

                    {/* Apple Button */}
                    <button 
                        onClick={() => handleSocialLogin('apple')}
                        disabled={!!loading}
                        className="w-full group relative flex items-center justify-center gap-3 bg-slate-900 text-white py-4 rounded-2xl font-black uppercase text-[12px] shadow-xl active:scale-95 transition-all border border-slate-800 disabled:opacity-50"
                    >
                        <Apple size={20} />
                        Apple ile Giriş Yap
                        {loading === 'apple' && <div className="absolute right-4 animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />}
                    </button>

                    <div className="flex items-center gap-4 py-4">
                        <div className="h-[1px] flex-1 bg-slate-800" />
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">veya</span>
                        <div className="h-[1px] flex-1 bg-slate-800" />
                    </div>

                    {/* Guest Button */}
                    <button 
                        onClick={handleGuestMode}
                        disabled={!!loading}
                        className="w-full group relative flex items-center justify-center gap-3 bg-indigo-600/10 text-indigo-400 py-4 rounded-2xl font-black uppercase text-[12px] border border-indigo-500/20 active:scale-95 transition-all hover:bg-indigo-600/20 disabled:opacity-50"
                    >
                        <User size={20} />
                        Misafir Olarak Devam Et
                        <ArrowRight size={16} className="absolute right-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                        {loading === 'guest' && <div className="absolute right-4 animate-spin rounded-full h-4 w-4 border-2 border-indigo-400 border-t-transparent" />}
                    </button>
                </div>

                {/* Footer Security Note */}
                <div className="mt-12 flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-tight opacity-60">
                    <ShieldCheck size={14} />
                    Verileriniz Apple ve Google ile Güvendedir
                </div>
            </div>
            
            <style jsx>{`
                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                    100% { transform: translateY(0px); }
                }
                .float {
                    animation: float 3s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}
