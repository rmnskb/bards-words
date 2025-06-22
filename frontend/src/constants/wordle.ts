export const ROWS = 6;
export const COLS = 5;

export enum LetterStatus {
  Unknown = 0,
  Disabled = 1,
  Letter = 2,
  LetterAndPosition = 3,
}

const createMatrix = <T>(rows: number, cols:number, defaultValue: T): T[][] => 
  Array.from({ length: rows }, () => Array(cols).fill(defaultValue));

export const boardDefault = createMatrix(ROWS, COLS, "");
export const boardStatusDefault = createMatrix(ROWS, COLS, LetterStatus.Unknown);


