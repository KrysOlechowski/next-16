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

type DifficultyLevel = 1 | 2 | 3;

interface GeneralGameStore {
  difficultyLevel: DifficultyLevel;
  setDifficultyLevel: (level: DifficultyLevel) => void;
  incrementDifficultyLevel: () => void;
  infiniteTimer: boolean;
  setInfiniteTimer: (value: boolean) => void;
  demoMode: boolean;
  setDemoMode: (value: boolean) => void;
}

export const useGeneralGameStore = create<GeneralGameStore>((set) => ({
  difficultyLevel: 1,
  setDifficultyLevel: (level) => set({ difficultyLevel: level }),
  incrementDifficultyLevel: () =>
    set((state) => ({
      difficultyLevel: ((state.difficultyLevel % 3) + 1) as DifficultyLevel,
    })),
  infiniteTimer: false,
  setInfiniteTimer: (value) => set({ infiniteTimer: value }),
  demoMode: false,
  setDemoMode: (value) => set({ demoMode: value }),
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
