interface OccurrenceElement {
    document: string;
    frequency: number;
    indices: number[];
}

export interface DocumentFrequencyElement {
    document: string;
    frequency: number;
}

export interface YearFrequencyElement {
    year: number;
    frequency: number;
}

export interface IWordIndex {
    word: string;
    occurrences: OccurrenceElement[];
}

export interface IWordDimensions {
    word: string;
    documentFrequencies: DocumentFrequencyElement[];
    yearFrequencies: YearFrequencyElement[];
}

export interface IDocumentTokens {
    document: string;
    occurrences: string[];
}
