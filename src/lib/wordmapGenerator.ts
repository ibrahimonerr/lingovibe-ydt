import { YDTVocab, YDT_VOCAB_DB } from '@/data/ydtVocab';

export interface WordNode {
    id: string;
    text: string;
    pos: { x: number; y: number };
    pairId: string | null; // null = red herring
    relationshipType?: 'synonym' | 'antonym';
    sourceWord?: string; // the daily word this syn/ant belongs to
}

export interface Connection {
    pairId: string;
    wordA: string;
    wordB: string;
    type: 'synonym' | 'antonym';
    sourceWordMeaning?: string;
    sourceWordMnemonic?: string;
}

export interface DailyPuzzle {
    date: string;
    dailyWords: YDTVocab[];
    wordNodes: WordNode[];
    connections: Connection[];
}

// Seeded pseudo-random number generator (deterministic per date)
function seededRandom(seed: string) {
    let s = [...seed].reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return () => {
        s = (s * 9301 + 49297) % 233280;
        return s / 233280;
    };
}

function shuffleSeeded<T>(arr: T[], rng: () => number): T[] {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// Generate non-overlapping scatter positions
function generatePositions(count: number, rng: () => number): { x: number; y: number }[] {
    const positions: { x: number; y: number }[] = [];
    const MIN_DIST = 18; // minimum % distance between nodes

    let attempts = 0;
    while (positions.length < count && attempts < 500) {
        attempts++;
        const x = 5 + rng() * 82; // 5-87%
        const y = 5 + rng() * 80; // 5-85%
        const tooClose = positions.some(
            p => Math.sqrt((p.x - x) ** 2 + (p.y - y) ** 2) < MIN_DIST
        );
        if (!tooClose) positions.push({ x, y });
    }
    return positions;
}

export function getDailyWords(date: string, count = 10): YDTVocab[] {
    const rng = seededRandom(date);
    const shuffled = shuffleSeeded(
        YDT_VOCAB_DB.filter(w => w.synonyms.length > 0 || w.antonyms.length > 0),
        rng
    );
    return shuffled.slice(0, count);
}

export function generateWordMapFromWords(
    dailyWords: YDTVocab[],
    date: string
): { wordNodes: WordNode[]; connections: Connection[] } {
    const rng = seededRandom(date + '_map');
    const connections: Connection[] = [];
    const usedTexts = new Set<string>();
    const pairs: { pairId: string; wordA: string; wordB: string; type: 'synonym' | 'antonym'; src: YDTVocab }[] = [];

    // Build pairs from daily words' synonyms and antonyms
    for (const word of dailyWords) {
        // Prefer synonym pairs
        if (word.synonyms.length > 0) {
            const syn = word.synonyms[0].toUpperCase();
            if (!usedTexts.has(word.word) && !usedTexts.has(syn) && syn.length > 2) {
                const pairId = `pair_${pairs.length}`;
                pairs.push({ pairId, wordA: word.word, wordB: syn, type: 'synonym', src: word });
                usedTexts.add(word.word);
                usedTexts.add(syn);
            }
        }
        // Also add antonym pairs for variety
        if (word.antonyms.length > 0 && pairs.length < 8) {
            const ant = word.antonyms[0].toUpperCase();
            if (!usedTexts.has(word.word) && !usedTexts.has(ant) && ant.length > 2) {
                const pairId = `pair_${pairs.length}`;
                pairs.push({ pairId, wordA: word.word, wordB: ant, type: 'antonym', src: word });
                usedTexts.add(word.word);
                usedTexts.add(ant);
            }
        }
        if (pairs.length >= 6) break;
    }

    // Select 4-6 pairs for the puzzle
    const selectedPairs = shuffleSeeded(pairs, rng).slice(0, Math.min(6, pairs.length));

    // Build real word nodes from selected pairs
    const pairNodes: Omit<WordNode, 'pos'>[] = [];
    for (const p of selectedPairs) {
        pairNodes.push({ id: `${p.pairId}_a`, text: p.wordA, pairId: p.pairId, relationshipType: p.type, sourceWord: p.src.word });
        pairNodes.push({ id: `${p.pairId}_b`, text: p.wordB, pairId: p.pairId, relationshipType: p.type, sourceWord: p.src.word });
        connections.push({
            pairId: p.pairId,
            wordA: p.wordA,
            wordB: p.wordB,
            type: p.type,
            sourceWordMeaning: p.src.meaning,
            sourceWordMnemonic: p.src.mnemonic,
        });
    }

    // Add 2-3 red herrings (from daily words' other synonyms that don't pair with anything)
    const redHerringCandidates = dailyWords
        .flatMap(w => [...w.synonyms.slice(1), ...w.antonyms.slice(1)])
        .map(w => w.toUpperCase())
        .filter(w => !usedTexts.has(w) && w.length > 3);

    const uniqueRed = [...new Set(redHerringCandidates)];
    const shuffledRed = shuffleSeeded(uniqueRed, rng);
    const redHerrings = shuffledRed.slice(0, 3);
    redHerrings.forEach((text, i) => {
        pairNodes.push({ id: `rh_${i}`, text, pairId: null });
    });

    // Assign scatter positions
    const positions = generatePositions(pairNodes.length, rng);
    const wordNodes: WordNode[] = pairNodes.map((n, i) => ({
        ...n,
        pos: positions[i] || { x: 10 + i * 12, y: 30 + (i % 3) * 20 },
    }));

    return { wordNodes, connections };
}
