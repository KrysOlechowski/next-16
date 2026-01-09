import { CSSProperties, ReactNode } from "react";
import { gameStyles } from "../styles/gameStyles";

interface GameButtonProps {
  onClick: () => void;
  children: ReactNode;
  style: CSSProperties;
  className?: string;
}

export function GameButton({
  onClick,
  children,
  style,
  className = "px-4 py-2 rounded",
}: GameButtonProps) {
  return (
    <button onClick={onClick} className={className} style={style}>
      {children}
    </button>
  );
}

interface StyledButtonProps extends GameButtonProps {
  variant: keyof typeof gameStyles.scoreScreen;
}

export function StyledButton({
  onClick,
  children,
  variant,
  className,
}: StyledButtonProps) {
  return (
    <GameButton
      onClick={onClick}
      style={gameStyles.scoreScreen[variant]}
      className={className}
    >
      {children}
    </GameButton>
  );
}
