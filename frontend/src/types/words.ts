import { TShakespeareWorkTitle } from "../constants/worksEnum";

export interface IOccurrenceElement {
  document: TShakespeareWorkTitle;
  frequency: number;
  indices: number[];
}

export interface IFlatOccurrenceElement {
  document: TShakespeareWorkTitle;
  index: number;
}

export interface IDocumentFreqElement {
  document: TShakespeareWorkTitle;
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

// TODO:Split the interface
export interface IWordDimensions {
  word: string;
  documentFrequencies: IDocumentFreqElement[];
  yearFrequencies: IYearFreqElement[];
}

export interface IDocumentFrequencies {
  word: string;
  documentFrequencies: IDocumentFreqElement[];
}

export interface IYearFrequencies {
  word: string;
  yearFrequencies: IYearFreqElement[];
}

export interface IDocumentTokens {
  document: TShakespeareWorkTitle;
  occurrences: string[];
}

export interface ICollocationsStatItem {
  other: string;
  frequency: number;
}

export interface ICollocationsStats {
  word: string;
  collocationsStats: ICollocationsStatItem[];
}

export interface ISuggestionsItem {
  suggestions: string[];
}
