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
  } = useWordle();

  const letter = board[attemptVal][letterPos];
  const isAttemptComplete = currAttempt.attempt > attemptVal;

  const getStatusClass = (): string => {
    if (!isAttemptComplete) return `
      bg-ivory text-quill border-vellum
      dark:bg-aged-leather dark:text-candlelight dark:border-warm-taupe
    `;

    const status = boardStatus[attemptVal][letterPos];
    switch (status) {
      case LetterStatus.LetterAndPosition:
        return `
          bg-emerald-ink text-parchment border-emerald-ink
          dark:bg-forest-shadow dark:text-parchment-glow dark:border-forest-shadow
        `;
      case LetterStatus.Letter:
        return `
          bg-amber-scroll text-silk border-amber-scroll
          dark:bg-bronze-patina dark:text-silk dark:border-bronze-patina
        `;
      case LetterStatus.Disabled:
        return `
          bg-stone-gray text-quill border-quill
          dark:bg-ash-gray dark:text-moonlight dark:border-ash-gray
        `;
      default:
        return `
          bg-ivory text-quill border-vellum
          dark:bg-aged-leather dark:text-candlelight dark:border-warm-taupe
        `;
    }
  };

  return (
    <div className={`w-12 h-12 border-2 flex items-center justify-center text-lg font-bold ${getStatusClass()}`}>
      {letter}
    </div>
  );
};

export default Letter;
