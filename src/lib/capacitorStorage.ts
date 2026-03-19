import { StateStorage } from 'zustand/middleware';

// Check if we're running in a Capacitor native environment
const isCapacitorNative = typeof window !== 'undefined' && !!(window as any)?.Capacitor?.isNativePlatform?.();

// Web-safe storage that falls back to localStorage when Capacitor is not available
const createStorage = (): StateStorage => {
    if (isCapacitorNative) {
        // Dynamically import Capacitor Preferences only in native environment
        const { Preferences } = require('@capacitor/preferences');
        return {
            getItem: async (name: string): Promise<string | null> => {
                const { value } = await Preferences.get({ key: name });
                return value;
            },
            setItem: async (name: string, value: string): Promise<void> => {
                await Preferences.set({ key: name, value });
            },
            removeItem: async (name: string): Promise<void> => {
                await Preferences.remove({ key: name });
            },
        };
    }

    // Fallback to localStorage for web environments
    return {
        getItem: async (name: string): Promise<string | null> => {
            if (typeof window === 'undefined') return null;
            return localStorage.getItem(name);
        },
        setItem: async (name: string, value: string): Promise<void> => {
            if (typeof window === 'undefined') return;
            localStorage.setItem(name, value);
        },
        removeItem: async (name: string): Promise<void> => {
            if (typeof window === 'undefined') return;
            localStorage.removeItem(name);
        },
    };
};

export const capacitorStorage: StateStorage = createStorage();
