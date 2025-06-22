import WordleContextProvider from "../components/wordle/WordleContextProvider";
import Board from "../components/wordle/Board";
import GameStatus from "../components/wordle/GameStatus";
import ScrenKeyboard from "../components/wordle/ScreenKeyboard";
import useRandomWordFetch from "../hooks/wordle/useRandomWordFetch";


const WordlePage = () => {
  const {
    word,
    getRandomWord,
  } = useRandomWordFetch({ wordLength: 5 });

  return (
    <WordleContextProvider
      correctWord={word ? word.toUpperCase() : "REACT"}
      getRandomWord={getRandomWord}
    >
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Board />
        <ScrenKeyboard />
        <GameStatus />
      </div>
    </WordleContextProvider>
  );
};

export default WordlePage;
