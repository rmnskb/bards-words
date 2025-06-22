import { useEffect } from "react";

import { LetterStatus } from "../../constants";
import useWordle from "../../hooks/wordle/useWordle";

interface LetterProps {
  letterPos: number;
  attemptVal: number;
}


const Letter = ({
  letterPos,
  attemptVal,
}: LetterProps) => {
  const {
    board,
    boardStatus,
    currAttempt,
    letterStatus,
    setLetterStatus,
  } = useWordle();

  const letter = board[attemptVal][letterPos];
  const isAttemptComplete = currAttempt.attempt > attemptVal;

  useEffect(() => {
    if (!isAttemptComplete || !letter) return;
 
    const currentStatus = boardStatus[attemptVal][letterPos];
    const existingStatus = letterStatus.get(letter) ?? LetterStatus.Unknown;

    if (existingStatus < currentStatus) 
      setLetterStatus(prev => new Map(prev).set(letter, currentStatus));
  }, [
    isAttemptComplete,
    letter,
    boardStatus,
    attemptVal,
    letterPos,
    letterStatus,
    setLetterStatus,
  ]);

  return (
    <div
      className="
        text-white text-4xl font-bold 
        bg-gray-500 w-7 h-6 leading-6 grid
        place-items-center mr-1 rounded 
        border border-gray-300
      "
    >
      {letter}
    </div>
  );
};

export default Letter;
