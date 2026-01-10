import {
  GAME_STEPS_EASY,
  GAME_STEPS_HARD,
  GAME_STEPS_MEDIUM,
} from "../const/STEPS_CONTS";

export function getGameStepsByDifficulty(level: 1 | 2 | 3) {
  switch (level) {
    case 1:
      return GAME_STEPS_EASY;
    case 2:
      return GAME_STEPS_MEDIUM;
    case 3:
      return GAME_STEPS_HARD;
    default:
      return GAME_STEPS_EASY;
  }
}
