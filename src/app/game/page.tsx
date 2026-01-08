"use client";

import { Equasion } from "@/components/game/Equasion";
import {
  EQUASION_PATTERN_1,
  EQUASION_PATTERN_2,
  EQUASION_PATTERN_3,
  EQUASION_PATTERN_X,
} from "@/const/GAME_CONST";
import { useGameView, useGameStore } from "./store/gameStore";

export default function Home() {
  const currentGameView = useGameView((state) => state.currentGameView);
  const toggleGameView = useGameView((state) => state.toggleGameView);

  const score = useGameStore((state) => state.score);
  const incrementScoreByValue = useGameStore(
    (state) => state.incrementScoreByValue
  );
  const setScore = useGameStore((state) => state.setScore);
  const resetScore = useGameStore((state) => state.resetScore);

  if (currentGameView === "MAIN_SCREEN") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-8">
        <div className="flex flex-col items-center gap-4 p-8 bg-gray-100 rounded-lg">
          <h2 className="text-3xl font-bold">Score</h2>
          <div className="text-6xl font-bold text-blue-600">{score}</div>
          <div className="flex gap-3 flex-wrap justify-center">
            <button
              onClick={() => incrementScoreByValue(1)}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              +1
            </button>
            <button
              onClick={() => incrementScoreByValue(5)}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              +5
            </button>
            <button
              onClick={() => incrementScoreByValue(10)}
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              +10
            </button>
            <button
              onClick={() => setScore(100)}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
            >
              Set 100
            </button>
            <button
              onClick={resetScore}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
        <button
          onClick={toggleGameView}
          className="px-8 py-4 text-2xl bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Start
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex text-5xl">
        <Equasion EQpattern={EQUASION_PATTERN_1} />
        <Equasion EQpattern={EQUASION_PATTERN_2} />
        <Equasion EQpattern={EQUASION_PATTERN_3} />
        <Equasion EQpattern={EQUASION_PATTERN_X} />
      </div>
      <button
        onClick={toggleGameView}
        className="px-6 py-3 text-xl bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors w-fit"
      >
        Finish
      </button>
    </div>
  );
}
