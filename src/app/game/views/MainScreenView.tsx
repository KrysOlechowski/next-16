import { useGameView } from "../store/gameStore";
import { ScoreScreenView } from "./ScoreScreenView";
import { gameStyles } from "../styles/gameStyles";

export function MainScreenView() {
  const toggleGameView = useGameView((state) => state.toggleGameView);

  return (
    <div
      className="flex flex-col items-center justify-center min-h-[50vh] gap-8"
      style={gameStyles.mainScreen.container}
    >
      <ScoreScreenView />
      <button
        onClick={toggleGameView}
        className="px-8 py-4 text-2xl rounded-lg"
        style={gameStyles.mainScreen.button}
      >
        Start
      </button>
    </div>
  );
}
