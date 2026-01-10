import { useState } from "react";
import { Equasion } from "@/app/game/components/Equasion";
import {
  EQUASION_PATTERN_1,
  EQUASION_PATTERN_2,
  EQUASION_PATTERN_3,
  EQUASION_PATTERN_X,
} from "@/app/game/const/GAME_CONST";
import { useGameView, useGeneralGameStore } from "../store/gameStore";
import { gameStyles } from "../styles/gameStyles";
import { GameButton } from "../components/GameButton";
import { GameProgressBar } from "../components/ProgressBar";
import { getGameStepsByDifficulty } from "../utils/steps";

export function GameScreenView() {
  const toggleGameView = useGameView((state) => state.toggleGameView);
  const difficultyLevel = useGeneralGameStore((s) => s.difficultyLevel);

  const gameSteps = getGameStepsByDifficulty(difficultyLevel);
  console.log(gameSteps);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const onNextStep = () => {
    if (currentStepIndex < gameSteps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      // Game finished logic here
      console.log("Game Finished");
    }
  };
  return (
    <div
      className="flex flex-col gap-4 p-4"
      style={gameStyles.gameScreen.container}
    >
      <GameProgressBar />

      <div className="flex text-5xl">
        <Equasion EQpattern={gameSteps[currentStepIndex].equasion} />
      </div>
      <GameButton
        onClick={onNextStep}
        style={gameStyles.gameScreen.button}
        className="demo-test px-6 py-3 text-xl rounded-lg w-fit"
      >
        Next Step
      </GameButton>
      <GameButton
        onClick={toggleGameView}
        style={gameStyles.gameScreen.button}
        className="demo-test px-6 py-3 text-xl rounded-lg w-fit"
      >
        Finish
      </GameButton>
    </div>
  );
}
