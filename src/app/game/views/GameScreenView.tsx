import { Equasion } from "@/app/game/components/Equasion";
import {
  EQUASION_PATTERN_1,
  EQUASION_PATTERN_2,
  EQUASION_PATTERN_3,
  EQUASION_PATTERN_X,
} from "@/app/game/const/GAME_CONST";
import { useGameView } from "../store/gameStore";
import { gameStyles } from "../styles/gameStyles";
import { GameButton } from "../components/GameButton";
import { GameProgressBar } from "../components/ProgressBar";

export function GameScreenView() {
  const toggleGameView = useGameView((state) => state.toggleGameView);

  return (
    <div
      className="flex flex-col gap-4 p-4"
      style={gameStyles.gameScreen.container}
    >
      <GameProgressBar />
      <div className="flex text-5xl">
        <Equasion EQpattern={EQUASION_PATTERN_1} />
        <Equasion EQpattern={EQUASION_PATTERN_2} />
        <Equasion EQpattern={EQUASION_PATTERN_3} />
        <Equasion EQpattern={EQUASION_PATTERN_X} />
      </div>
      <GameButton
        onClick={toggleGameView}
        style={gameStyles.gameScreen.button}
        className="px-6 py-3 text-xl rounded-lg w-fit"
      >
        Finish
      </GameButton>
    </div>
  );
}
