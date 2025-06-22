import { useContext } from "react";

import { IWordleContext, WordleGameContext } from "../../contexts/wordleContext";


const useWordle = (): IWordleContext => {
  const context = useContext(WordleGameContext);

  if (!context) throw new Error("useWordle must be used within a WordleContextProvider component");

  return context;
};

export default useWordle;
