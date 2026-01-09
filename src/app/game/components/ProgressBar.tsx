// GameProgressBar renders a countdown-style progress bar using the Shadcn UI Progress component and theme colors from gameStyles.
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import { gameStyles } from "../styles/gameStyles";
import { useGeneralGameStore } from "../store/gameStore";

const INITIAL_PROGRESS_VALUE = 70;

export const GameProgressBar: React.FC = () => {
  const [progress, setProgress] = useState(INITIAL_PROGRESS_VALUE);
  const infiniteTimer = useGeneralGameStore((s) => s.infiniteTimer);

  useEffect(() => {
    if (infiniteTimer) {
      // No timer at all in infinite mode
      return;
    }

    if (progress <= 0) {
      return;
    }

    const timer = setTimeout(() => setProgress((prev) => prev - 1), 500);
    return () => clearTimeout(timer);
  }, [progress, infiniteTimer]);

  return (
    <div className="w-full">
      <Progress
        value={progress}
        indicatorColor={gameStyles.gameGeneral.gameMainColor}
        containerColor={gameStyles.gameGeneral.gameAccentColor}
        className="h-4 rounded-lg"
      />
    </div>
  );
};
