// GameProgressBar renders a countdown-style progress bar using the Shadcn UI Progress component and theme colors from gameStyles.
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import { gameStyles } from "../styles/gameStyles";

const INITIAL_PROGRESS_VALUE = 70;

export const GameProgressBar: React.FC = () => {
  const [progress, setProgress] = useState(INITIAL_PROGRESS_VALUE);

  useEffect(() => {
    if (progress <= 0) {
      return;
    }

    const timer = setTimeout(() => setProgress((prev) => prev - 1), 500);
    return () => clearTimeout(timer);
  }, [progress]);

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
