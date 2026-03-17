import React from 'react';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], weight: ['400', '700', '900'] });

interface YDTLogoProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    /** 'light' for dark backgrounds, 'dark' for light backgrounds */
    theme?: 'light' | 'dark';
    showSlogan?: boolean;
    hideIcon?: boolean;
}

export default function YDTLogo({ size = 'md', theme = 'dark', showSlogan = false, hideIcon = false }: YDTLogoProps) {
    const sizes = {
        sm: { main: 'text-xl', slogan: 'text-[8px]', icon: 24 },
        md: { main: 'text-3xl', slogan: 'text-[9px]', icon: 36 },
        lg: { main: 'text-5xl', slogan: 'text-[11px]', icon: 56 },
        xl: { main: 'text-6xl', slogan: 'text-[13px]', icon: 72 },
    };

    const logoColor = theme === 'dark' ? 'text-slate-900' : 'text-white';
    const sloganColor = theme === 'dark' ? 'text-slate-500' : 'text-white/60';

    return (
        <div className={`flex flex-col items-center gap-1 select-none ${inter.className}`}>
            <div className="flex items-center gap-3">
                {/* PREMIUM ICON */}
                {!hideIcon && (
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600 via-violet-600 to-rose-500 rounded-2xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity" />
                        <div 
                            className="relative flex items-center justify-center bg-gradient-to-tr from-indigo-600 via-violet-600 to-rose-500 rounded-2xl shadow-xl overflow-hidden"
                            style={{ width: sizes[size].icon, height: sizes[size].icon }}
                        >
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.4),transparent_50%)]" />
                            <svg 
                                viewBox="0 0 100 100" 
                                className="w-2/3 h-2/3 text-white drop-shadow-lg" 
                                fill="currentColor"
                            >
                                <path d="M20 20 L50 60 L80 20 L60 20 L50 35 L40 20 Z M45 65 L55 65 L55 85 L45 85 Z" />
                            </svg>
                        </div>
                    </div>
                )}

                {/* TEXT LOGO */}
                <div className="flex flex-col items-start leading-none mt-1">
                    <span className={`${sizes[size].main} font-black tracking-tighter flex items-baseline`}>
                        <span className={logoColor}>YDT</span>
                        <span className="bg-gradient-to-r from-indigo-600 to-rose-500 bg-clip-text text-transparent">Hub</span>
                    </span>
                </div>
            </div>

            {showSlogan && (
                <span className={`${sizes[size].slogan} font-black uppercase tracking-[0.25em] ${sloganColor} mt-1`}>
                    Learn. Practice. Overcome.
                </span>
            )}
        </div>
    );
}
