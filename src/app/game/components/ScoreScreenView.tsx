import { useGameStore } from "../store/gameStore";
import { gameStyles } from "../styles/gameStyles";

export function ScoreScreenView() {
  const score = useGameStore((state) => state.score);
  const incrementScoreByValue = useGameStore(
    (state) => state.incrementScoreByValue
  );
  const setScore = useGameStore((state) => state.setScore);
  const resetScore = useGameStore((state) => state.resetScore);

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
        {[1, 5, 10].map((value) => (
          <button
            key={value}
            onClick={() => incrementScoreByValue(value)}
            className="px-4 py-2 rounded"
            style={gameStyles.scoreScreen.incrementButton}
          >
            +{value}
          </button>
        ))}
        <button
          onClick={() => setScore(100)}
          className="px-4 py-2 rounded"
          style={gameStyles.scoreScreen.setButton}
        >
          Set 100
        </button>
        <button
          onClick={resetScore}
          className="px-4 py-2 rounded"
          style={gameStyles.scoreScreen.resetButton}
        >
          Reset
        </button>
      </div>
    </div>
  );
}
