import { Dispatch, SetStateAction, createContext } from "react";

import { LetterStatus } from "../constants";
import { AttemptType, GameOverType } from "../types";

interface WordleState {
  board: string[][];
  boardStatus: LetterStatus[][];
  currAttempt: AttemptType;
  correctWord: string;
  letterStatus: Map<string, LetterStatus>;
  gameOver: GameOverType;
  showInvalidWordMessage: boolean;
}

interface WordleActions {
  setBoard: Dispatch<SetStateAction<string[][]>>;
  setBoardStatus: Dispatch<SetStateAction<LetterStatus[][]>>;
  setCurrAttempt: Dispatch<SetStateAction<AttemptType>>;
  setLetterStatus: Dispatch<SetStateAction<Map<string, LetterStatus>>>;
  setGameOver: Dispatch<SetStateAction<GameOverType>>;
  setShowInvalidWordMessage: Dispatch<SetStateAction<boolean>>;
  onDelete: () => void;
  onEnter: () => void;
  onSelectLetter: (key: string) => void;
  onGameReset: () => void;
}

export interface IWordleContext extends WordleState, WordleActions {}

export const WordleGameContext = createContext<IWordleContext | null>(null);
