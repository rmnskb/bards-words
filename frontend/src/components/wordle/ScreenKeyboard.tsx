import { useState, useEffect } from "react";

import useWordle from "../../hooks/wordle/useWordle";


// TODO: Colour the keys based on their status (whether they're correct and on the right place)
const ScrenKeyboard = () => {
  const { onSelectLetter, onDelete, onEnter, gameOver } = useWordle();
  const [pressedKey, setPressedKey] = useState<string | null>(null);

  const handleKeyPress = (key: string) => {
    setPressedKey(key);
    setTimeout(() => setPressedKey(null), 150);

    if (key === "ENTER") onEnter();
    else if (key === "DELETE") onDelete();
    else onSelectLetter(key);
  };

  useEffect(() => {
    const handlePhysicalKeyPress = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      if (key.match(/^[a-z]$/)) {
        setPressedKey(key.toUpperCase());
        setTimeout(() => setPressedKey(null), 150);
      } else if (key === 'enter') {
        setPressedKey('ENTER');
        setTimeout(() => setPressedKey(null), 150);
      } else if (key === 'backspace' || key === 'delete') {
        setPressedKey('DELETE');
        setTimeout(() => setPressedKey(null), 150);
      }
    };

    document.addEventListener('keydown', handlePhysicalKeyPress);
    return () => document.removeEventListener('keydown', handlePhysicalKeyPress);
  }, []);

  const keys = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'DELETE']
  ]

  return (
    <div className="flex flex-col gap-2 p-4">
      {!gameOver.gameOver && keys.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-1 justify-center">
          {row.map((key) => (
            <button
              key={key}
              onClick={() => handleKeyPress(key)}
              className={`
                px-3 py-2 rounded font-semibold min-w-[40px]
                transition-all duration-150 border-1 shadow-xs
                ${pressedKey === key
                  ? "bg-soft-gold text-silk dark:bg-bright-gold dark:text-quill transform scale-95"
                  : "bg-vellum dark:bg-aged-leather hover:bg-moonlight dark:hover:bg-warm-taupe"
                }
              `}
            >{key}</button>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ScrenKeyboard;
