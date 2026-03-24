"use client";
import { useEffect } from 'react';
import { useAppStore } from '@/store/useAppStore';

export default function ThemeHandler() {
    const theme = useAppStore((state) => state.theme);

    useEffect(() => {
        const root = window.document.documentElement;
        
        if (theme === 'system') {
            const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            root.classList.remove('light', 'dark');
            root.classList.add(systemTheme);
            
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handleChange = () => {
                root.classList.remove('light', 'dark');
                root.classList.add(mediaQuery.matches ? 'dark' : 'light');
            };
            mediaQuery.addEventListener('change', handleChange);
            return () => mediaQuery.removeEventListener('change', handleChange);
        } else {
            root.classList.remove('light', 'dark');
            root.classList.add(theme);
        }
    }, [theme]);

    return null;
}
