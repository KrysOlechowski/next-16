export const EQUASION_PATTERN_NAME = {
  PATTERN_1: "PATTERN_1",
  PATTERN_2: "PATTERN_2",
  PATTERN_3: "PATTERN_3",
  PATTERN_X: "PATTERN_X",
} as const;

export const EQUASION_PATTERN_1 = {
  // a + bb
  // 7 + 11 = 18
  // 9 + 19 = 27
  name: EQUASION_PATTERN_NAME.PATTERN_1,
  pattern: [
    [7, 9],
    [11, 18],
  ],
  number_of_correct_tiles: 3,
  number_of_tiles: 6,
};

export const EQUASION_PATTERN_2 = {
  // aa - b
  // 22 - 8 = 16
  // 29 - 6 = 23
  name: EQUASION_PATTERN_NAME.PATTERN_2,
  pattern: [
    [22, 29],
    [6, 8],
  ],
  number_of_correct_tiles: 3,
  number_of_tiles: 6,
};

export const EQUASION_PATTERN_3 = {
  // aa + b - c
  // 15 + 6 - 5 = 16
  // 21 + 9 - 3 = 27
  name: EQUASION_PATTERN_NAME.PATTERN_3,
  pattern: [
    [15, 21],
    [6, 9],
    [3, 5],
  ],
  number_of_correct_tiles: 3,
  number_of_tiles: 6,
};

export const EQUASION_PATTERN_X = {
  // a + b + cc - dd
  // 7 + 6 + 20 - 15 = 18
  // 9 + 9 + 25 - 11 = 32
  name: EQUASION_PATTERN_NAME.PATTERN_X,
  pattern: [
    [7, 9],
    [6, 9],
    [20, 25],
    [11, 15],
  ],
  number_of_correct_tiles: 4,
  number_of_tiles: 6,
};
