"use client";
import React, { useState, useEffect } from 'react';
import YDTLogo from '@/components/YDTLogo';

export default function SplashScreenWrapper({ children }: { children: React.ReactNode }) {
    const [showSplash, setShowSplash] = useState(true);
    const [isAnimatingOut, setIsAnimatingOut] = useState(false);

    useEffect(() => {
        const hasSeen = sessionStorage.getItem('ydt_splash_seen');
        if (hasSeen) {
            setShowSplash(false);
            return;
        }

        const timer = setTimeout(() => {
            setIsAnimatingOut(true);
            setTimeout(() => {
                setShowSplash(false);
                sessionStorage.setItem('ydt_splash_seen', 'true');
            }, 600);
        }, 1400);

        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            {showSplash && (
                <div className={`fixed inset-0 z-[20000] flex flex-col items-center justify-center bg-slate-50 dark:bg-[#070812] transition-opacity duration-500 ease-in-out ${isAnimatingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                    <div className={`flex flex-col items-center gap-3 transition-all duration-700 ease-in-out ${isAnimatingOut ? 'scale-110 opacity-0' : 'scale-100 opacity-100 zoom-in'}`}>
                        <YDTLogo size="lg" showSlogan={true} />
                    </div>
                </div>
            )}
            {/* The main app content loads in the background but is not interactive if splash covers it */}
            {children}

            <style jsx>{`
                @keyframes initialZoom {
                    0% { transform: scale(0.8); opacity: 0; }
                    100% { transform: scale(1); opacity: 1; }
                }
                .zoom-in {
                    animation: initialZoom 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                }
            `}</style>
        </>
    );
}
