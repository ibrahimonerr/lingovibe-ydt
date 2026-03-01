const PREFIX = 'ydt_wordmap_';

export interface DayResult {
    flashcardsComplete: boolean;
    mapComplete: boolean;
    score: number;
    wrongAttempts: number;
    streak: number;
    completedAt?: string;
}

export interface ErrorHistory {
    synonym: { correct: number; total: number };
    antonym: { correct: number; total: number };
}

function todayKey(): string {
    return new Date().toISOString().split('T')[0]; // YYYY-MM-DD
}

export function getDailySession(date = todayKey()): DayResult | null {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(PREFIX + date);
    return raw ? JSON.parse(raw) : null;
}

export function markFlashcardsComplete(date = todayKey()): void {
    const existing = getDailySession(date) || { flashcardsComplete: false, mapComplete: false, score: 0, wrongAttempts: 0, streak: getStreak() };
    localStorage.setItem(PREFIX + date, JSON.stringify({ ...existing, flashcardsComplete: true }));
}

export function saveMapResult(date = todayKey(), result: { score: number; wrongAttempts: number }): void {
    const streak = updateStreak(date);
    const existing = getDailySession(date) || { flashcardsComplete: true, mapComplete: false, score: 0, wrongAttempts: 0, streak };
    localStorage.setItem(PREFIX + date, JSON.stringify({
        ...existing,
        mapComplete: true,
        score: result.score,
        wrongAttempts: result.wrongAttempts,
        streak,
        completedAt: new Date().toISOString(),
    }));
}

export function getStreak(): number {
    if (typeof window === 'undefined') return 0;
    return parseInt(localStorage.getItem(PREFIX + 'streak') || '0');
}

export function updateStreak(date = todayKey()): number {
    const today = date;
    const yesterday = new Date(new Date(today).getTime() - 86400000).toISOString().split('T')[0];
    const lastDate = localStorage.getItem(PREFIX + 'last_completed');
    let streak = getStreak();

    if (lastDate === yesterday) {
        streak += 1;
    } else if (lastDate !== today) {
        streak = 1; // reset if missed a day
    }

    localStorage.setItem(PREFIX + 'streak', String(streak));
    localStorage.setItem(PREFIX + 'last_completed', today);
    return streak;
}

export function getErrorHistory(): ErrorHistory {
    if (typeof window === 'undefined') return { synonym: { correct: 0, total: 0 }, antonym: { correct: 0, total: 0 } };
    const raw = localStorage.getItem(PREFIX + 'errors');
    return raw ? JSON.parse(raw) : { synonym: { correct: 0, total: 0 }, antonym: { correct: 0, total: 0 } };
}

export function recordAttempt(type: 'synonym' | 'antonym', wasCorrect: boolean): void {
    const history = getErrorHistory();
    history[type].total += 1;
    if (wasCorrect) history[type].correct += 1;
    localStorage.setItem(PREFIX + 'errors', JSON.stringify(history));
}

export function calculateScore(wrongAttempts: number): number {
    return Math.max(0, 100 + (3 - wrongAttempts) * 20);
}

export function getToday(): string {
    return todayKey();
}
