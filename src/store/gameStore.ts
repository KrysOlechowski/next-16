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
