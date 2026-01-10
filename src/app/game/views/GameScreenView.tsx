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
  const isGameFinished = false;

  const toggleGameView = useGameView((state) => state.toggleGameView);
  const difficultyLevel = useGeneralGameStore((s) => s.difficultyLevel);
  const currentStep = useGeneralGameStore((s) => s.currentStep);
  const incrementStep = useGeneralGameStore((s) => s.incrementStep);
  const resetStep = useGeneralGameStore((s) => s.resetStep);

  const gameSteps = getGameStepsByDifficulty(difficultyLevel);
  const numberOfSteps = gameSteps.length;
  console.log(gameSteps);

  const onNextStep = () => {
    if (currentStep < gameSteps.length - 1) {
      incrementStep();
    } else {
      onGameFinish();
    }
  };

  const onGameFinish = () => {
    // Logic to handle game finish
    console.log("Game Finished");
    resetStep();
    toggleGameView();
  };

  return (
    <div
      className="flex flex-col gap-4 p-4"
      style={gameStyles.gameScreen.container}
    >
      <div className="text-2xl font-semibold">
        Step: {currentStep + 1}/{numberOfSteps}
      </div>
      <GameProgressBar />

      <div className="flex text-5xl">
        <Equasion EQpattern={gameSteps[currentStep].equasion} />
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
