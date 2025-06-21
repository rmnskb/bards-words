import { Dispatch, SetStateAction, createContext } from "react";

export enum LetterStatus {
  Unknown = 0,
  Disabled = 1,
  Letter = 2,
  LetterAndPosition = 3,
}

type AttemptType = {
  attempt: number;
  letterPos: number;
};

type GameOverType = {
  gameOver: boolean;
  guessedWord: boolean;
};

export interface IWordleContext {
  board: string[][];
  setBoard: Dispatch<SetStateAction<string[][]>>;
  boardStatus: LetterStatus[][];
  setBoardStatus: Dispatch<SetStateAction<LetterStatus[][]>>;
  currAttempt: AttemptType;
  setCurrAttempt: Dispatch<SetStateAction<AttemptType>>;
  onDelete: () => void;
  onEnter: () => void;
  onSelectLetter: (key: string) => void;
  correctWord: string;
  letterStatus: Map<string, LetterStatus>;
  setLetterStatus: Dispatch<SetStateAction<Map<string, LetterStatus>>>;
  gameOver: GameOverType;
  setGameOver: Dispatch<SetStateAction<GameOverType>>;
}

export const WordleGameContext = createContext<IWordleContext>(
  {} as IWordleContext
);
