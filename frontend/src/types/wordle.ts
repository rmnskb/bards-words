export type AttemptType = {
  attempt: number;
  letterPos: number;
};

export type GameOverType = {
  gameOver: boolean;
  guessedWord: boolean;
};

export interface IRandomWord {
  word: string;
  date: string;
  is_random: boolean;
}

export interface IEligibleWords {
  words: string[];
}
