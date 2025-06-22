import Letter from "./Letter"
import { ROWS, COLS } from "../../constants"


const Board = () => {
  return (
    <div className="board flex flex-col gap-1 p-4">
      {Array.from({ length: ROWS }, (_, attemptVal) => (
        <div key={attemptVal} className="row flex gap-1">
          {Array.from({ length: COLS }, (_, letterPos) => (
            <Letter 
              key={letterPos}
              letterPos={letterPos}
              attemptVal={attemptVal}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Board;
