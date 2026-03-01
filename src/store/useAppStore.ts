import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
    lastActiveRoute: string | null;
    addMission: (mission: Mission) => void;
    completeMission: (id: string) => void;
    incrementProgress: (type: 'reading' | 'vocab' | 'grammar') => void;
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
        }
    )
);
