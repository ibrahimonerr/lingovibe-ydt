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
    sessionStats: {
        correct: number;
        wrong: number;
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
    theme: 'light' | 'dark' | 'system';
    guestDailyCompletedLabs: string[];
    solvedIds: string[];
    dailyUsage: Record<string, { count: number, date: string }>;
    learnedWordIds: string[];
    dailyVocabCount: number;
    lastVocabDate: string | null;
    addMission: (mission: Mission) => void;
    completeMission: (id: string) => void;
    toggleLearnedWord: (id: string) => void;
    incrementDailyVocabCount: () => void;
    incrementProgress: (type: 'reading' | 'vocab' | 'grammar' | 'skills') => void;
    recordAnswer: (isCorrect: boolean, usedHint?: boolean) => void;
    canSolveMore: (type: 'reading' | 'vocab' | 'grammar' | 'skills', subTopic?: string) => boolean;
    markAsSolved: (ids: string[], type: 'reading' | 'vocab' | 'grammar' | 'skills', subTopic?: string) => void;
    setPrefetchedLabs: (type: 'reading' | 'vocab' | 'grammar' | 'skills', labs: PrefetchedLab[]) => void;
    setLastActiveRoute: (route: string | null) => void;
    setSession: (session: Session | null) => void;
    setGuestMode: (active: boolean) => void;
    incrementGuestAiUsage: () => void;
    markLabAsCompletedByGuest: (labType: string) => void;
    getDailySeed: () => number;
    clearProgress: () => void;
    resetSessionStats: () => void;
    setTheme: (theme: 'light' | 'dark' | 'system') => void;
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
            sessionStats: {
                correct: 0,
                wrong: 0,
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
            theme: 'system',
            guestDailyCompletedLabs: [],
            solvedIds: [],
            dailyUsage: {},
            learnedWordIds: [],
            dailyVocabCount: 0,
            lastVocabDate: null,
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
            toggleLearnedWord: (id) =>
                set((state) => ({
                    learnedWordIds: state.learnedWordIds.includes(id)
                        ? state.learnedWordIds.filter(wid => wid !== id)
                        : [...state.learnedWordIds, id]
                })),
            incrementDailyVocabCount: () => {
                const today = new Date().toDateString();
                set((state) => ({
                    dailyVocabCount: state.lastVocabDate === today ? state.dailyVocabCount + 1 : 1,
                    lastVocabDate: today
                }));
            },
            incrementProgress: (type) =>
                set((state) => ({
                    userProgress: {
                        ...state.userProgress,
                        [`${type}LabsCompleted`]: state.userProgress[`${type}LabsCompleted`] + 1,
                    },
                })),
            canSolveMore: (type, subTopic) => {
                const state = get();
                const today = new Date().toDateString();
                const key = subTopic ? `${type}:${subTopic}` : type;
                const usage = state.dailyUsage[key];
                const currentCount = (usage && usage.date === today) ? usage.count : 0;

                // Limits based on Guest vs. Registered
                if (state.isGuestMode) {
                    if (type === 'reading') return currentCount < 1;
                    if (type === 'vocab') {
                        if (subTopic === 'loop') return currentCount < 10; // 10 flashcards
                        return currentCount < 5; // 5 questions per other sub-modules
                    }
                    return currentCount < 3; // 3 for Grammar/Skills
                } else {
                    // Registered Users
                    if (type === 'reading') return currentCount < 5;
                    if (type === 'vocab') {
                        if (subTopic === 'loop') return currentCount < 10; // Still 10 flashcards?
                        return currentCount < 20;
                    }
                    return currentCount < 20;
                }
            },
            markAsSolved: (ids, type, subTopic) => {
                const today = new Date().toDateString();
                const key = subTopic ? `${type}:${subTopic}` : type;
                set((state) => {
                    const usage = state.dailyUsage[key];
                    const currentCount = (usage && usage.date === today) ? usage.count : 0;
                    
                    return {
                        solvedIds: Array.from(new Set([...state.solvedIds, ...ids])),
                        dailyUsage: {
                            ...state.dailyUsage,
                            [key]: { count: currentCount + ids.length, date: today }
                        }
                    };
                });
            },
            recordAnswer: (isCorrect, usedHint = false) =>
                set((state) => {
                    const stats = { ...state.labStats };
                    const sStats = { ...state.sessionStats };
                    if (isCorrect) {
                        stats.totalCorrect += 1;
                        sStats.correct += 1;
                    } else {
                        stats.totalWrong += 1;
                        sStats.wrong += 1;
                    }
                    if (usedHint) {
                        stats.totalHintsUsed += 1;
                    }
                    return { labStats: stats, sessionStats: sStats };
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
                    sessionStats: { correct: 0, wrong: 0 }
                }),
            resetSessionStats: () =>
                set({
                    sessionStats: { correct: 0, wrong: 0 }
                }),
            setTheme: (theme) => set({ theme }),
        }),
        {
            name: 'ydthub-storage', // name of item in the storage (must be unique)
            storage: createJSONStorage(() => capacitorStorage),
        }
    )
);
