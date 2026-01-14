import { create } from "zustand";
import { persist } from "zustand/middleware";

interface DevCatStore {
  noiseOpacity: number;
  backgroundColor: string;
  setNoiseOpacity: (opacity: number) => void;
  setBackgroundColor: (color: string) => void;
}

export const useDevCatStore = create<DevCatStore>()(
  persist(
    (set) => ({
      noiseOpacity: 0,
      backgroundColor: "#de982e",
      setNoiseOpacity: (opacity: number) => set({ noiseOpacity: opacity }),
      setBackgroundColor: (color: string) => set({ backgroundColor: color }),
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
