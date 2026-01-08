import { EQUASION_PATTERN_NAME } from "@/const/GAME_CONST";
import {
  EQUASION_PATTERN_NAME_TYPE,
  EQUASION_PATTERN_TYPE,
  EQUASION_TRANSFORMED_TYPE,
} from "@/app/game/types/game_types";
import { randomIntFromInterval } from "../../../utils/numbers";

export const generateEquasionAndTiles = (
  eq_pattern: EQUASION_PATTERN_TYPE
): EQUASION_TRANSFORMED_TYPE => {
  const transformedPattern = generateEquasionFromPattern(eq_pattern);
  const tiles = generateTiles(
    transformedPattern.correct_number,
    eq_pattern.number_of_correct_tiles,
    eq_pattern.number_of_tiles
  );

  return {
    name: eq_pattern.name,
    equasion_string: transformedPattern.equasion_string,
    correct_number: transformedPattern.correct_number,
    tiles: tiles,
    options: [],
  };
};

type TransformedPattern = {
  equasion_string: string;
  correct_number: number;
};

const generateTiles = (
  correctAnswer: number,
  numberOfCorrectTiles: number,
  numberOfTiles: number
) => {
  if (numberOfCorrectTiles === 3) {
    const correctNumbers = splitMax9(correctAnswer, numberOfCorrectTiles, 4);

    return [
      { index: 0, value: correctNumbers[0], is_correct: true },
      { index: 1, value: correctNumbers[1], is_correct: true },
      { index: 2, value: correctNumbers[2], is_correct: true },
      { index: 3, value: randomIntFromInterval(3, 9), is_correct: false },
      { index: 4, value: randomIntFromInterval(3, 8), is_correct: false },
      { index: 5, value: randomIntFromInterval(3, 7), is_correct: false },
    ];
  } else {
    const correctNumbers = splitMax9(correctAnswer, numberOfCorrectTiles, 4);
    return [
      { index: 0, value: correctNumbers[0], is_correct: true },
      { index: 1, value: correctNumbers[1], is_correct: true },
      { index: 2, value: correctNumbers[2], is_correct: true },
      { index: 3, value: correctNumbers[3], is_correct: true },
      { index: 4, value: randomIntFromInterval(3, 7), is_correct: false },
      { index: 5, value: randomIntFromInterval(3, 7), is_correct: false },
      { index: 6, value: randomIntFromInterval(3, 9), is_correct: false },
      { index: 7, value: randomIntFromInterval(3, 9), is_correct: false },
    ];
  }
};

function splitMax9(num: number, parts: number, min = 0) {
  if (
    !Number.isInteger(num) ||
    !Number.isInteger(parts) ||
    !Number.isInteger(min)
  ) {
    throw new TypeError("num, parts i min muszą być liczbami całkowitymi.");
  }
  if (num < 0 || parts <= 0 || min < 0) {
    throw new RangeError("num >= 0, parts > 0, min >= 0 wymagane.");
  }

  const MAX = 9;
  const maxTotal = parts * MAX;
  // Jeśli suma większa niż możliwa (części ≤ 9) -- nie da się rozdzielić
  if (num > maxTotal) {
    throw new RangeError(
      `Nie da się rozdzielić ${num} na ${parts} części bez przekroczenia ${MAX}.`
    );
  }

  // Jeśli niemożliwe spełnić zadeklarowane min dla wszystkich części,
  // obniżamy min do najbardziej równomiernej możliwej wartości (floor)
  const minTotal = parts * min;
  let effectiveMin = min;
  if (num < minTotal) {
    // rozdzielimy sumę jak najbardziej równomiernie — każdy dostanie floor(num/parts) lub +1
    effectiveMin = Math.floor(num / parts);
    // safety: effectiveMin nie może przekroczyć MAX (ale skoro num <= maxTotal, to nie przekroczy)
    if (effectiveMin > MAX) effectiveMin = MAX;
  }

  const result = [];
  let remaining = num;

  for (let i = 0; i < parts; i++) {
    const partsLeft = parts - i - 1;

    // Maksymalnie możemy przydzielić tyle, by pozostałe partsLeft mogły otrzymać conajmniej effectiveMin
    const maxPossible = Math.min(MAX, remaining - partsLeft * effectiveMin);
    // Najmniej musimy zostawić teraz, by potem dało się rozdzielić resztę (przy założonym effectiveMin)
    const minPossible = Math.max(0, effectiveMin);

    // Jeżeli z powodu jakiegoś dziwnego zaokrąglenia minPossible > maxPossible, ustawiamy val = maxPossible
    const lower = Math.min(minPossible, maxPossible);
    const upper = Math.max(minPossible, maxPossible);

    // Dla losowości wybieramy wartość w zakresie [lower, upper], a w skrajnych przypadkach po prostu lower
    const val =
      lower === upper
        ? lower
        : Math.floor(Math.random() * (upper - lower + 1)) + lower;

    result.push(val);
    remaining -= val;
  }

  // Na wszelki wypadek - poprawka: jeśli z powodu wyliczeń pozostało coś i jest to >0/<=MAX
  // równomiernie rozkładamy pozostałość (powinno być 0)
  if (remaining !== 0) {
    // spróbuj dopasować ostatnie elementy, nie tworząc wartości <0 ani >MAX
    for (let i = 0; i < result.length && remaining !== 0; i++) {
      const space =
        remaining > 0
          ? Math.min(MAX - result[i], remaining) // możemy zwiększyć element
          : Math.max(-result[i], remaining); // możemy zmniejszyć element (negative remaining)
      result[i] += space;
      remaining -= space;
    }
  }

  // finalny sanity-check: wszystkie elementy >=0 i <= MAX oraz suma == num
  const sum = result.reduce((a, b) => a + b, 0);
  if (sum !== num || result.some((x) => x < 0 || x > MAX)) {
    throw new Error(
      "Nie udało się wygenerować poprawnego rozkładu (wewnętrzny błąd)."
    );
  }

  return result;
}

const generateEquasionFromPattern = (
  eq_pattern: EQUASION_PATTERN_TYPE
): TransformedPattern => {
  const { pattern, name } = eq_pattern;
  if (eq_pattern.name === EQUASION_PATTERN_NAME.PATTERN_2) {
    const random_a = randomIntFromInterval(pattern[0][0], pattern[0][1]);
    const random_b = randomIntFromInterval(pattern[1][0], pattern[1][1]);

    return {
      equasion_string: `${random_a} - ${random_b}`,
      correct_number: random_a - random_b,
    };
  } else if (eq_pattern.name === EQUASION_PATTERN_NAME.PATTERN_3) {
    const random_a = randomIntFromInterval(pattern[0][0], pattern[0][1]);
    const random_b = randomIntFromInterval(pattern[1][0], pattern[1][1]);
    const random_c = randomIntFromInterval(pattern[2][0], pattern[2][1]);

    return {
      equasion_string: `${random_a} + ${random_b} - ${random_c}`,
      correct_number: random_a + random_b - random_c,
    };
  } else if (eq_pattern.name === EQUASION_PATTERN_NAME.PATTERN_X) {
    const random_a = randomIntFromInterval(pattern[0][0], pattern[0][1]);
    const random_b = randomIntFromInterval(pattern[1][0], pattern[1][1]);
    const random_c = randomIntFromInterval(pattern[2][0], pattern[2][1]);
    const random_d = randomIntFromInterval(pattern[3][0], pattern[3][1]);

    return {
      equasion_string: `${random_a} + ${random_b} + ${random_c} - ${random_d}`,
      correct_number: random_a + random_b + random_c - random_d,
    };
  } else {
    const random_a = randomIntFromInterval(pattern[0][0], pattern[0][1]);
    const random_b = randomIntFromInterval(pattern[1][0], pattern[1][1]);
    return {
      equasion_string: `${random_a} + ${random_b}`,
      correct_number: random_a + random_b,
    };
  }
};
