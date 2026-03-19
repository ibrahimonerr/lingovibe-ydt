import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { capacitorStorage } from '@/lib/capacitorStorage';
import type { Session } from '@supabase/supabase-js';

/**
 * Supabase lab data structure.
 * NOTE: Grammar/Skills labs use `question` (singular) field in DB,
 * while Reading labs use `questions` (plural). This is a Supabase schema
 * convention — not a bug. Handle both when reading lab entries.
 */
interface PrefetchedLab {
    id?: number;
    topic?: string;
    passage?: string;
    question?: Record<string, unknown> | Record<string, unknown>[];  // grammar_labs, skills_labs (singular)
    questions?: Record<string, unknown>[];                           // reading_labs (plural)
    [key: string]: unknown;  // Allow additional DB columns
}

interface Mission {
    id: string;
    name: string;
    completed: boolean;
}

interface AppState {
    activeMissions: Mission[];
    userProgress: {
        readingLabsCompleted: number;
        vocabLabsCompleted: number;
        grammarLabsCompleted: number;
        skillsLabsCompleted: number;
    };
    labStats: {
        totalCorrect: number;
        totalHintsUsed: number;
        totalWrong: number;
    };
    prefetchedLabs: {
        reading: PrefetchedLab[];
        vocab: PrefetchedLab[];
        grammar: PrefetchedLab[];
        skills: PrefetchedLab[];
    };
    lastActiveRoute: string | null;
    isGuestMode: boolean;
    session: Session | null;
    guestAiUsage: number;
    lastAiUsageDate: string | null;
    guestDailyCompletedLabs: string[];
    addMission: (mission: Mission) => void;
    completeMission: (id: string) => void;
    incrementProgress: (type: 'reading' | 'vocab' | 'grammar' | 'skills') => void;
    recordAnswer: (isCorrect: boolean, usedHint?: boolean) => void;
    setPrefetchedLabs: (type: 'reading' | 'vocab' | 'grammar' | 'skills', labs: PrefetchedLab[]) => void;
    setLastActiveRoute: (route: string | null) => void;
    setSession: (session: Session | null) => void;
    setGuestMode: (active: boolean) => void;
    incrementGuestAiUsage: () => void;
    markLabAsCompletedByGuest: (labType: string) => void;
    getDailySeed: () => number;
    clearProgress: () => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set, get) => ({
            activeMissions: [],
            userProgress: {
                readingLabsCompleted: 0,
                vocabLabsCompleted: 0,
                grammarLabsCompleted: 0,
                skillsLabsCompleted: 0,
            },
            labStats: {
                totalCorrect: 0,
                totalHintsUsed: 0,
                totalWrong: 0,
            },
            prefetchedLabs: {
                reading: [],
                vocab: [],
                grammar: [],
                skills: [],
            },
            lastActiveRoute: null,
            isGuestMode: false,
            session: null,
            guestAiUsage: 0,
            lastAiUsageDate: null,
            guestDailyCompletedLabs: [],
            addMission: (mission) =>
                set((state) => ({
                    activeMissions: [...state.activeMissions, mission],
                })),
            completeMission: (id) =>
                set((state) => ({
                    activeMissions: state.activeMissions.map((m) =>
                        m.id === id ? { ...m, completed: true } : m
                    ),
                })),
            incrementProgress: (type) =>
                set((state) => ({
                    userProgress: {
                        ...state.userProgress,
                        [`${type}LabsCompleted`]: state.userProgress[`${type}LabsCompleted`] + 1,
                    },
                })),
            recordAnswer: (isCorrect, usedHint = false) =>
                set((state) => {
                    const stats = { ...state.labStats };
                    if (isCorrect) {
                        stats.totalCorrect += 1;
                    } else {
                        stats.totalWrong += 1;
                    }
                    if (usedHint) {
                        stats.totalHintsUsed += 1;
                    }
                    return { labStats: stats };
                }),
            setPrefetchedLabs: (type, labs) =>
                set((state) => ({
                    prefetchedLabs: {
                        ...state.prefetchedLabs,
                        [type]: labs,
                    },
                })),
            setLastActiveRoute: (route) =>
                set({ lastActiveRoute: route }),
            setSession: (session) => set({ session }),
            setGuestMode: (active) => set({ isGuestMode: active }),
            incrementGuestAiUsage: () => {
                const today = new Date().toDateString();
                set((state) => ({
                    guestAiUsage: state.lastAiUsageDate === today ? state.guestAiUsage + 1 : 1,
                    lastAiUsageDate: today
                }));
            },
            markLabAsCompletedByGuest: (labType) => {
                const today = new Date().toDateString();
                set((state) => {
                    // Reset list if it's a new day
                    const isNewDay = state.lastAiUsageDate !== today;
                    const list = isNewDay ? [] : state.guestDailyCompletedLabs;
                    return {
                        guestDailyCompletedLabs: list.includes(labType) ? list : [...list, labType],
                        lastAiUsageDate: today
                    };
                });
            },
            getDailySeed: () => {
                const today = new Date().toDateString();
                let hash = 0;
                for (let i = 0; i < today.length; i++) {
                    hash = (hash << 5) - hash + today.charCodeAt(i);
                    hash |= 0;
                }
                return Math.abs(hash);
            },
            clearProgress: () =>
                set({
                    activeMissions: [],
                    userProgress: {
                        readingLabsCompleted: 0,
                        vocabLabsCompleted: 0,
                        grammarLabsCompleted: 0,
                        skillsLabsCompleted: 0,
                    },
                    lastActiveRoute: null,
                    isGuestMode: false,
                    session: null,
                }),
        }),
        {
            name: 'ydthub-storage', // name of item in the storage (must be unique)
            storage: createJSONStorage(() => capacitorStorage),
        }
    )
);
