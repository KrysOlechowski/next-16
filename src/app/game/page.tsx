"use client";

import { useGameView } from "./store/gameStore";
import { MainScreenView } from "./components/MainScreenView";
import { GameScreenView } from "./components/GameScreenView";

export default function Home() {
  const currentGameView = useGameView((state) => state.currentGameView);

  if (currentGameView === "MAIN_SCREEN") {
    return <MainScreenView />;
  }

  return <GameScreenView />;
}
