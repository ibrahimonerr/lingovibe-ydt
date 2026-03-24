"use client";

import React, { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { supabase } from '@/lib/supabase';
import { Chrome, Apple, User, ArrowRight } from 'lucide-react';
import { Inter, Playfair_Display } from 'next/font/google';
import YDTLogo from '@/components/YDTLogo';

const inter = Inter({ subsets: ['latin'], weight: ['400', '600', '800'] });
const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '700'] });

export default function LoginPage() {
    const { setGuestMode } = useAppStore();
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
        <div className={`fixed inset-0 z-[10000] bg-slate-50 dark:bg-[#070812] flex flex-col items-center justify-center p-8 transition-colors duration-300 ${inter.className}`}>
            <div className="w-full max-w-[380px] flex flex-col items-center">
                
                {/* Top Logo */}
                <div className="mb-12 flex flex-col items-center">
                    <YDTLogo size="xl" hideIcon={true} />
                </div>

                {/* Slogan */}
                <div className="text-center mb-12">
                    <p className={`${playfair.className} text-4xl text-slate-800 dark:text-slate-100 tracking-tight font-medium mb-1`}>
                        learn. practice. overcome
                    </p>
                </div>

                {/* Login Options */}
                <div className="w-full space-y-4">
                    
                    {/* Apple Button */}
                    <button 
                        onClick={() => handleSocialLogin('apple')}
                        disabled={!!loading}
                        className="w-full relative flex items-center justify-center gap-3 bg-white dark:bg-[#1a1c25] text-slate-900 dark:text-white border border-slate-900 dark:border-slate-800 py-[14px] rounded-full font-semibold text-[15px] hover:bg-slate-50 dark:hover:bg-slate-800 transition-all disabled:opacity-50"
                    >
                        <svg className="w-5 h-5 mb-1" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M17.807,17.202C17.027,18.34,16.279,19.5,15.11,19.5c-1.129,0-1.492-.68-2.784-.68c-1.294,0-1.702,.68-2.782,.68c-1.169,0-1.996-1.196-2.775-2.333c-1.593-2.327-2.809-6.576-1.178-9.423c.809-1.413,2.273-2.306,3.882-2.33c1.229-.024,2.39,.816,3.14,.816c.75,0,2.152-1.018,3.61-.869c.61,.026,2.322,.246,3.42,1.854c-.088,.054-2.039,1.192-2.019,3.56c.023,2.836,2.463,3.774,2.5,3.788c-.021,.066-.39,1.336-1.294,2.688z M14.996,4.536C14.34,5.32,13.268,5.884,12.228,5.789c-.144-1.06,.324-2.164,.952-2.895c.664-.78,1.79-1.394,2.77-1.394c.148,1.134-.306,2.246-.954,3.036z"/>
                        </svg>
                        Apple ile Devam Et
                        {loading === 'apple' && <div className="absolute right-6 animate-spin rounded-full h-4 w-4 border-2 border-slate-900 dark:border-white border-t-transparent" />}
                    </button>

                    {/* Google Button */}
                    <button 
                        onClick={() => handleSocialLogin('google')}
                        disabled={!!loading}
                        className="w-full relative flex items-center justify-center gap-3 bg-white dark:bg-[#1a1c25] text-slate-900 dark:text-white border border-slate-400/50 dark:border-slate-800 py-[14px] rounded-full font-semibold text-[15px] hover:bg-slate-50 dark:hover:bg-slate-800 transition-all disabled:opacity-50"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Google ile Devam Et
                        {loading === 'google' && <div className="absolute right-6 animate-spin rounded-full h-4 w-4 border-2 border-slate-900 dark:border-white border-t-transparent" />}
                    </button>


                    {/* Guest Button */}
                    <button 
                        onClick={handleGuestMode}
                        disabled={!!loading}
                        className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 to-rose-500 text-white py-[14px] rounded-full font-semibold text-[15px] hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                        <User size={18} />
                        Misafir Olarak Devam Et
                        {loading === 'guest' && <div className="absolute right-8 animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />}
                    </button>
                </div>

                {/* Footer Link */}
                <div className="mt-12 text-center">
                    <div className="h-[2px] w-24 bg-slate-900 rounded-full mx-auto opacity-10" />
                </div>
            </div>
            
            <style jsx>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-content {
                    animation: fade-in 0.8s ease-out forwards;
                }
            `}</style>
        </div>
    );
}

