import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { capacitorStorage } from '@/lib/capacitorStorage';

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
    };
    labStats: {
        totalCorrect: number;
        totalHintsUsed: number;
        totalWrong: number;
    };
    prefetchedLabs: {
        reading: any[];
        vocab: any[];
        grammar: any[];
        skills: any[];
    };
    lastActiveRoute: string | null;
    addMission: (mission: Mission) => void;
    completeMission: (id: string) => void;
    incrementProgress: (type: 'reading' | 'vocab' | 'grammar') => void;
    recordAnswer: (isCorrect: boolean, usedHint?: boolean) => void;
    setPrefetchedLabs: (type: 'reading' | 'vocab' | 'grammar' | 'skills', labs: any[]) => void;
    setLastActiveRoute: (route: string | null) => void;
    clearProgress: () => void;
}

export const useAppStore = create<AppState>()(
    persist(
        (set) => ({
            activeMissions: [],
            userProgress: {
                readingLabsCompleted: 0,
                vocabLabsCompleted: 0,
                grammarLabsCompleted: 0,
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
            clearProgress: () =>
                set({
                    activeMissions: [],
                    userProgress: {
                        readingLabsCompleted: 0,
                        vocabLabsCompleted: 0,
                        grammarLabsCompleted: 0,
                    },
                    lastActiveRoute: null,
                }),
        }),
        {
            name: 'ydthub-storage', // name of item in the storage (must be unique)
            storage: createJSONStorage(() => capacitorStorage),
        }
    )
);
