//make an boilerplate for a progress bar component, use installed progress bar from shadcn ui
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";
import { gameStyles } from "../styles/gameStyles";

export const GameProgressBar: React.FC = () => {
  const value = 70;
  const [progress, setProgress] = useState(value);
  const [isTimerFinish, setIsTimerFinish] = useState(false);

  useEffect(() => {
    if (progress <= 0) {
      setIsTimerFinish(true);
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
