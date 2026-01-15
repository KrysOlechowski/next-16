import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ForestAnimationConfig {
  colors: [string, string, string];
  animationDuration: number;
  animationSpeed: number;
  opacity: number;
}

interface DevCatStore {
  noiseOpacity: number;
  backgroundColor: string;
  topAnimation: ForestAnimationConfig;
  bottomAnimation: ForestAnimationConfig;
  setNoiseOpacity: (opacity: number) => void;
  setBackgroundColor: (color: string) => void;
  setAnimationOpacity: (opacity: number) => void;
  setTopAnimationColors: (colors: [string, string, string]) => void;
  setBottomAnimationColors: (colors: [string, string, string]) => void;
  setTopAnimationDuration: (duration: number) => void;
  setBottomAnimationDuration: (duration: number) => void;
  setTopAnimationSpeed: (speed: number) => void;
  setBottomAnimationSpeed: (speed: number) => void;
}

export const useDevCatStore = create<DevCatStore>()(
  persist(
    (set) => ({
      noiseOpacity: 0,
      backgroundColor: "#de982e",
      topAnimation: {
        colors: ["#fff", "#679a45", "#000"] as [string, string, string],
        animationDuration: 20,
        animationSpeed: 1,
        opacity: 1,
      },
      bottomAnimation: {
        colors: ["#679a45", "#f36b4b", "#679a45"] as [string, string, string],
        animationDuration: 20,
        animationSpeed: 1,
        opacity: 1,
      },
      setNoiseOpacity: (opacity: number) => set({ noiseOpacity: opacity }),
      setBackgroundColor: (color: string) => set({ backgroundColor: color }),
      setAnimationOpacity: (opacity: number) =>
        set((state: DevCatStore) => ({
          topAnimation: { ...state.topAnimation, opacity },
          bottomAnimation: { ...state.bottomAnimation, opacity },
        })),
      setTopAnimationColors: (colors: [string, string, string]) =>
        set((state: DevCatStore) => ({
          topAnimation: { ...state.topAnimation, colors },
        })),
      setBottomAnimationColors: (colors: [string, string, string]) =>
        set((state: DevCatStore) => ({
          bottomAnimation: { ...state.bottomAnimation, colors },
        })),
      setTopAnimationDuration: (duration: number) =>
        set((state: DevCatStore) => ({
          topAnimation: { ...state.topAnimation, animationDuration: duration },
        })),
      setBottomAnimationDuration: (duration: number) =>
        set((state: DevCatStore) => ({
          bottomAnimation: {
            ...state.bottomAnimation,
            animationDuration: duration,
          },
        })),
      setTopAnimationSpeed: (speed: number) =>
        set((state: DevCatStore) => ({
          topAnimation: { ...state.topAnimation, animationSpeed: speed },
        })),
      setBottomAnimationSpeed: (speed: number) =>
        set((state: DevCatStore) => ({
          bottomAnimation: { ...state.bottomAnimation, animationSpeed: speed },
        })),
    }),
    {
      name: "devcat-storage",
      storage: {
        getItem: (name: string) => {
          const cookies = document.cookie.split(";").reduce((acc, cookie) => {
            const [key, value] = cookie.trim().split("=");
            acc[key] = value ? decodeURIComponent(value) : "";
            return acc;
          }, {} as Record<string, string>);
          const item = cookies[name];
          return item ? JSON.parse(item) : null;
        },
        setItem: (name: string, value: any) => {
          const serialized = JSON.stringify(value);
          document.cookie = `${name}=${encodeURIComponent(
            serialized
          )}; path=/; max-age=31536000`;
        },
        removeItem: (name: string) => {
          document.cookie = `${name}=; path=/; max-age=0`;
        },
      },
    }
  )
);
