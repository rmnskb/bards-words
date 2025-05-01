interface OccurrenceElement {
    document: string;
    frequency: number;
    indices: number[];
}

export default interface IWordIndex {
    word: string;
    occurrences: OccurrenceElement[];
};