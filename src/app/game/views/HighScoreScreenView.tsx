import { useGameStore } from "../store/gameStore";
import { gameStyles } from "../styles/gameStyles";
import { GameButton } from "../components/GameButton";

export function HighScoreScreenView() {
  const highScore = useGameStore((state) => state.score);
  const incrementHighScoreByValue = useGameStore(
    (state) => state.incrementScoreByValue
  );
  const setHighScore = useGameStore((state) => state.setScore);
  const resetHighScore = useGameStore((state) => state.resetScore);

  const incrementValues = [1, 5, 10] as const;

  return (
    <div
      className="flex flex-col items-center gap-4 p-8 rounded-lg"
      style={gameStyles.scoreScreen.container}
    >
      <h2 className="text-3xl font-bold">High Score</h2>
      <div
        className="text-6xl font-bold"
        style={gameStyles.scoreScreen.scoreValue}
      >
        {highScore}
      </div>
      <div className="flex gap-3 flex-wrap justify-center">
        {incrementValues.map((value) => (
          <GameButton
            key={value}
            onClick={() => incrementHighScoreByValue(value)}
            style={gameStyles.scoreScreen.incrementButton}
          >
            +{value}
          </GameButton>
        ))}
        <GameButton
          onClick={() => setHighScore(100)}
          style={gameStyles.scoreScreen.setButton}
        >
          Set 100
        </GameButton>
        <GameButton
          onClick={resetHighScore}
          style={gameStyles.scoreScreen.resetButton}
        >
          Reset
        </GameButton>
      </div>
    </div>
  );
}
