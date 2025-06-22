import WordleContextProvider from "../components/wordle/WordleContextProvider";
import Board from "../components/wordle/Board";
import GameStatus from "../components/wordle/GameStatus";
import ScrenKeyboard from "../components/wordle/ScreenKeyboard";


const WordlePage = () => {
  return (
    <WordleContextProvider correctWord="REACT">
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Board />
        <ScrenKeyboard />
        <GameStatus />
      </div>
    </WordleContextProvider>
  );
};

export default WordlePage;
