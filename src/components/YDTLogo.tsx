import React from 'react';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], weight: ['400', '700', '900'] });

interface YDTLogoProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    /** 'light' for dark backgrounds, 'dark' for light backgrounds */
    theme?: 'light' | 'dark';
    showSlogan?: boolean;
    hideIcon?: boolean;
    layout?: 'vertical' | 'horizontal';
}

export default function YDTLogo({ 
    size = 'md', 
    theme, 
    showSlogan = false, 
    hideIcon = false,
    layout = 'vertical'
}: YDTLogoProps) {
    const sizes = {
        sm: { main: 'text-lg', slogan: 'text-[7px]', icon: 20 },
        md: { main: 'text-xl', slogan: 'text-[8px]', icon: 28 },
        lg: { main: 'text-4xl', slogan: 'text-[10px]', icon: 48 },
        xl: { main: 'text-5xl', slogan: 'text-[12px]', icon: 64 },
    };

    // Responsive colors by default
    const logoColor = theme 
        ? (theme === 'dark' ? 'text-slate-900' : 'text-white')
        : 'text-slate-900 dark:text-white';
    
    const sloganColor = theme
        ? (theme === 'dark' ? 'text-slate-500' : 'text-white/60')
        : 'text-slate-500 dark:text-white/60';

    const isHorizontal = layout === 'horizontal';

    return (
        <div className={`flex ${isHorizontal ? 'flex-row items-center gap-3' : 'flex-col items-center gap-2'} select-none ${inter.className}`}>
            {/* PREMIUM ICON */}
            {!hideIcon && (
                <div className="relative shrink-0">
                    <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600 via-violet-600 to-rose-500 rounded-xl blur-lg opacity-40" />
                    <div 
                        className="relative flex items-center justify-center bg-gradient-to-tr from-indigo-600 via-violet-600 to-rose-500 rounded-xl shadow-lg border border-white/20 overflow-hidden"
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
            <div className={`flex flex-col items-center leading-none`}>
                <span className={`${sizes[size].main} font-black tracking-tighter flex items-center gap-0.5`}>
                    <span className={logoColor}>YDT</span>
                    <span className="bg-gradient-to-r from-indigo-600 to-rose-500 bg-clip-text text-transparent">Hub</span>
                </span>
                
                {showSlogan && (
                    <span className={`${sizes[size].slogan} font-black uppercase tracking-[0.25em] ${sloganColor} ${isHorizontal ? 'mt-1' : 'mt-2'}`}>
                        Learn Smarter. Score Higher.
                    </span>
                )}
            </div>
        </div>
    );
}

