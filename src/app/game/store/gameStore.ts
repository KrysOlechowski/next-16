import { create } from "zustand";

interface GameStore {
  score: number;
  setScore: (score: number) => void;
  incrementScoreByValue: (value: number) => void;
  resetScore: () => void;
}

export const useGameStore = create<GameStore>((set) => ({
  score: 0,
  setScore: (score) => set({ score }),
  incrementScoreByValue: (value) =>
    set((state) => ({ score: state.score + value })),
  resetScore: () => set({ score: 0 }),
}));

interface GeneralGameStore {
  difficultyLevel: number;
  setDifficultyLevel: (level: number) => void;
  incrementDifficultyLevel: () => void;
}

export const useGeneralGameStore = create<GeneralGameStore>((set) => ({
  difficultyLevel: 1,
  setDifficultyLevel: (level) => set({ difficultyLevel: level }),
  incrementDifficultyLevel: () =>
    set((state) => ({ difficultyLevel: state.difficultyLevel + 1 })),
}));

type GameView = "MAIN_SCREEN" | "GAME_SCREEN";

interface GameViewStore {
  currentGameView: GameView;
  setGameView: (view: GameView) => void;
  toggleGameView: () => void;
}

export const useGameView = create<GameViewStore>((set) => ({
  currentGameView: "MAIN_SCREEN",
  setGameView: (view) => set({ currentGameView: view }),
  toggleGameView: () =>
    set((state) => ({
      currentGameView:
        state.currentGameView === "MAIN_SCREEN" ? "GAME_SCREEN" : "MAIN_SCREEN",
    })),
}));
