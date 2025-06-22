import WordleContextProvider from "../components/wordle/WordleContextProvider";
import Board from "../components/wordle/Board";


const WordlePage = () => {
  return (
    <WordleContextProvider correctWord="REACT">
      <div className="w-80 h-96 flex flex-col">
        <Board />
      </div>
    </WordleContextProvider>
  );
};

export default WordlePage;
