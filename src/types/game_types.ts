import {
  EQUASION_PATTERN_1,
  EQUASION_PATTERN_2,
  EQUASION_PATTERN_3,
  EQUASION_PATTERN_NAME,
} from "@/const/GAME_CONST";

export type EQUASION_PATTERN_NAME_TYPE = keyof typeof EQUASION_PATTERN_NAME;

export type EQUASION_TRANSFORMED_TYPE = {
  name: EQUASION_PATTERN_NAME_TYPE;
  equasion_string: string;
  correct_number: number;
  tiles: { index: number; value: number; is_correct: boolean }[];
  options: [];
};

export type EQUASION_PATTERN_TYPE =
  | typeof EQUASION_PATTERN_1
  | typeof EQUASION_PATTERN_2
  | typeof EQUASION_PATTERN_3;
