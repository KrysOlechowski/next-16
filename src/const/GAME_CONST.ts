export const EQUASION_PATTERN_NAME = {
  PATTERN_1: "PATTERN_1",
  PATTERN_2: "PATTERN_2",
  PATTERN_3: "PATTERN_3",
} as const;

// 3 tiles => [7,9]. 7 + 3 + 3 = 13

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
  // 21 + 9 - 3 = 17
  name: EQUASION_PATTERN_NAME.PATTERN_3,
  pattern: [
    [15, 21],
    [6, 9],
    [3, 5],
  ],
  number_of_correct_tiles: 3,
  number_of_tiles: 6,
};
