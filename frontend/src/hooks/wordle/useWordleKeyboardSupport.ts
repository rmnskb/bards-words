import { useCallback, useEffect } from "react";

import useWordle from "./useWordle";


const useWordleKeyboardSupport = () => {
  const {
    onSelectLetter,
    onDelete,
    onEnter,
    gameOver,
  } = useWordle();

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (gameOver.gameOver) return;

    const key = e.key.toLowerCase();

    if (key.match(/^\w$/)) {
      e.preventDefault();
      onSelectLetter(key.toUpperCase());
      return;
    }

    switch(key) {
      case "enter":
        e.preventDefault();
        onEnter();
        break;
      case "backspace": case "delete":
        e.preventDefault();
        onDelete();
        break;
      default:
        break;
    }
  }, [onSelectLetter, onDelete, onEnter, gameOver.gameOver]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);

    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);
};

export default useWordleKeyboardSupport;
