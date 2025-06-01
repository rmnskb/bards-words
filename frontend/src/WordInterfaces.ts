export interface IOccurrenceElement {
    document: string;
    frequency: number;
    indices: number[];
}

export interface IFlatOccurrenceElement {
    document: string;
    index: number;
}

export interface IDocumentFreqElement {
    document: string;
    frequency: number;
}

export interface IYearFreqElement {
    year: number;
    frequency: number;
}

export interface IWordIndex {
    word: string;
    occurrences: IOccurrenceElement[];
}

export interface IWordDimensions {
    word: string;
    documentFrequencies: IDocumentFreqElement[];
    yearFrequencies: IYearFreqElement[];
}

export interface IDocumentTokens {
    document: string;
    occurrences: string[];
}

export interface IDictionaryEntry {
    word: string;
    phonetic: string;
    phonetics?: {
        text: string;
        audio?: string;
    }[];
    origin?: string;
    meanings?: {
        partOfSpeech: string;
        definitions?: {
            definition?: string;
            example?: string;
        }[];
        synonyms?: string[];
        antonyms?: string[];
    }[];
}

export interface ICollocationsStatItem {
    other: string;
    frequency: number;
}

export interface ICollocationsStats {
    word: string;
    collocationsStats: ICollocationsStatItem[];
}
