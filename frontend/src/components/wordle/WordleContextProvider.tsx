import { useMemo, useState } from "react";

import { boardDefault, boardStatusDefault, LetterStatus } from "../../constants/";
import { AttemptType, GameOverType } from "../../types";
import { IWordleContext, WordleGameContext } from "../../contexts/wordleContext";
import KeyboardListener from "./KeyboardListener";

interface WordleContextProviderProps {
  children: React.ReactNode;
  correctWord: string;
  enableKeyboard?: boolean;
}


const WordleContextProvider = ({
  children,
  correctWord,
  enableKeyboard = true,
}: WordleContextProviderProps) => {
  const [board, setBoard] = useState(() => structuredClone(boardDefault));
  const [boardStatus, setBoardStatus] = useState(() => structuredClone(boardStatusDefault));
  const [currAttempt, setCurrAttempt] = useState<AttemptType>({ attempt: 0, letterPos: 0, });
  const [letterStatus, setLetterStatus] = useState(() => new Map<string, LetterStatus>);
  const [gameOver, setGameOver] = useState<GameOverType>({ gameOver: false, guessedWord: false, });

  const actions = useMemo(() => ({
    onDelete: () => {
      if (currAttempt.letterPos === 0) return;

      const newBoard = [...board];
      newBoard[currAttempt.attempt][currAttempt.letterPos - 1] = "";
      setBoard(newBoard);
      setCurrAttempt({ ...currAttempt, letterPos: currAttempt.letterPos - 1, });
    },

    onEnter: () => {
      if (currAttempt.letterPos !== 5) return;

      const currentWord = board[currAttempt.attempt].join("");
      const newBoardStatus = [...boardStatus];

      for (let i = 0; i < 5; i++) {
        const letter = currentWord[i];
        if (correctWord[i] === letter) newBoardStatus[currAttempt.attempt][i] = LetterStatus.LetterAndPosition;
        else if (correctWord.includes(letter)) newBoardStatus[currAttempt.attempt][i] = LetterStatus.Letter;
        else newBoardStatus[currAttempt.attempt][i] = LetterStatus.Disabled;
      }

      setBoardStatus(newBoardStatus);

      if (currentWord === correctWord) setGameOver({ gameOver: true, guessedWord: true });
      else if (currAttempt.attempt === 5) setGameOver({ gameOver: true, guessedWord: false });
      else setCurrAttempt({ attempt: currAttempt.attempt + 1, letterPos: 0 });
    },

    onSelectLetter: (key: string) => {
      if (currAttempt.letterPos > 4 || gameOver.gameOver) return;

      const newBoard = [...board];
      newBoard[currAttempt.attempt][currAttempt.letterPos] = key.toUpperCase();
      setBoard(newBoard);
      setCurrAttempt({ ...currAttempt, letterPos: currAttempt.letterPos + 1, });
    },

    onGameReset: () => {
      setBoard(structuredClone(boardDefault));
      setBoardStatus(structuredClone(boardStatusDefault));
      setCurrAttempt({ attempt: 0, letterPos: 0, });
      setLetterStatus(new Map());
      setGameOver({ gameOver: false, guessedWord: false });
    },
  }), [board, boardStatus, currAttempt, gameOver, correctWord]);

  const contextValue = useMemo((): IWordleContext => ({
    board,
    setBoard,
    boardStatus,
    setBoardStatus,
    currAttempt,
    setCurrAttempt,
    letterStatus,
    setLetterStatus,
    gameOver,
    setGameOver,
    correctWord,
    ...actions,
  }), [
    board, boardStatus, currAttempt, letterStatus, 
    gameOver, correctWord, actions
  ]);

  return (
    <WordleGameContext.Provider value={contextValue}>
      {enableKeyboard && (<KeyboardListener />)}
      {children}
    </WordleGameContext.Provider>
  );
};

export default WordleContextProvider;
