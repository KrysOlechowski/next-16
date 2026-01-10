import { useGameView, useGeneralGameStore } from "../store/gameStore";
import { HighScoreScreenView } from "./ScoreScreenView";
import { gameStyles } from "../styles/gameStyles";
import { GameButton } from "../components/GameButton";

export function MainScreenView() {
  const toggleGameView = useGameView((state) => state.toggleGameView);
  const difficultyLevel = useGeneralGameStore((s) => s.difficultyLevel);
  const setDifficultyLevel = useGeneralGameStore((s) => s.setDifficultyLevel);
  const infiniteTimer = useGeneralGameStore((s) => s.infiniteTimer);
  const setInfiniteTimer = useGeneralGameStore((s) => s.setInfiniteTimer);
  const demoMode = useGeneralGameStore((s) => s.demoMode);
  const setDemoMode = useGeneralGameStore((s) => s.setDemoMode);

  return (
    <div
      className="flex flex-col items-center justify-center min-h-[50vh] gap-8"
      style={gameStyles.mainScreen.container}
    >
      <HighScoreScreenView />
      <div className="flex flex-col gap-4 w-full max-w-sm">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Difficulty</span>
          <select
            value={String(difficultyLevel)}
            onChange={(e) =>
              setDifficultyLevel(parseInt(e.target.value, 10) as 1 | 2 | 3)
            }
            className="border rounded-md px-3 py-2 bg-white text-black"
          >
            <option value="1">Easy</option>
            <option value="2">Medium</option>
            <option value="3">Hard</option>
          </select>
        </label>

        <label className="flex items-center justify-between gap-4">
          <span className="text-sm font-medium">Infinite timer</span>
          <input
            type="checkbox"
            checked={infiniteTimer}
            onChange={(e) => setInfiniteTimer(e.target.checked)}
            className="h-5 w-5"
          />
        </label>

        <label className="flex items-center justify-between gap-4">
          <span className="text-sm font-medium">Demo testing</span>
          <input
            type="checkbox"
            checked={demoMode}
            onChange={(e) => setDemoMode(e.target.checked)}
            className="h-5 w-5"
          />
        </label>
      </div>
      <GameButton
        onClick={toggleGameView}
        style={gameStyles.mainScreen.button}
        className="px-8 py-4 text-2xl rounded-lg"
      >
        Start
      </GameButton>
    </div>
  );
}
