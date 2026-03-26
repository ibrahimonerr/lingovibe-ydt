export interface YDTVocab {
    id: string;
    word: string;
    meaning: string;
    synonyms: string[];
    antonyms: string[];
    mnemonic: string;
    context: string;
}

export const YDT_VOCAB_DB: YDTVocab[] = [];
