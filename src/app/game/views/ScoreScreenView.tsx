import { useGameStore } from "../store/gameStore";
import { gameStyles } from "../styles/gameStyles";
import { GameButton } from "../components/GameButton";

export function ScoreScreenView() {
  const score = useGameStore((state) => state.score);
  const incrementScoreByValue = useGameStore(
    (state) => state.incrementScoreByValue
  );
  const setScore = useGameStore((state) => state.setScore);
  const resetScore = useGameStore((state) => state.resetScore);

  const incrementValues = [1, 5, 10] as const;

  return (
    <div
      className="flex flex-col items-center gap-4 p-8 rounded-lg"
      style={gameStyles.scoreScreen.container}
    >
      <h2 className="text-3xl font-bold">Score</h2>
      <div
        className="text-6xl font-bold"
        style={gameStyles.scoreScreen.scoreValue}
      >
        {score}
      </div>
      <div className="flex gap-3 flex-wrap justify-center">
        {incrementValues.map((value) => (
          <GameButton
            key={value}
            onClick={() => incrementScoreByValue(value)}
            style={gameStyles.scoreScreen.incrementButton}
          >
            +{value}
          </GameButton>
        ))}
        <GameButton
          onClick={() => setScore(100)}
          style={gameStyles.scoreScreen.setButton}
        >
          Set 100
        </GameButton>
        <GameButton
          onClick={resetScore}
          style={gameStyles.scoreScreen.resetButton}
        >
          Reset
        </GameButton>
      </div>
    </div>
  );
}
