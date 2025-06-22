import useWordle from "../../hooks/wordle/useWordle";


const GameStatus = () => {
  const { gameOver, onGameReset, correctWord, } = useWordle();

  if (!gameOver.gameOver) return null;

  return (
    <div className="text-center p-4">
      <h2 className="text-2xl font-bold mb-2">
        {gameOver.guessedWord ? "You Win!" : "Game Over" }
      </h2>
      {!gameOver.guessedWord && (
        <p className="mb-4">The word was: <strong>{correctWord}</strong></p>
      )}
      <button
        onClick={onGameReset}
        className="px-4 py-2 btn-md btn-gold-leaf"
      >Play Again</button>
    </div>
  );
};

export default GameStatus;
