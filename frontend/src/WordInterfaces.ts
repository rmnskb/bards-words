interface OccurrenceElement {
    document: string;
    frequency: number;
    indices: number[];
}

interface DocumentFrequencyElement {
    document: string;
    frequency: number;
}

interface YearFrequencyElement {
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