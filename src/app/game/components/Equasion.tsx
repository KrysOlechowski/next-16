"use client";

import {
  EQUASION_PATTERN_TYPE,
  EQUASION_TRANSFORMED_TYPE,
} from "@/app/game/types/game_types";
import { generateEquasionAndTiles } from "@/app/game/utils/game";
import { useEffect, useState } from "react";
import { Tiles } from "./Tiles";

type EquasionProps = {
  EQpattern: EQUASION_PATTERN_TYPE;
};

export const Equasion = ({ EQpattern }: EquasionProps) => {
  const [eqData, setEqData] = useState<null | EQUASION_TRANSFORMED_TYPE>(null);
  const [selectedTileIndices, setSelectedTileIndices] = useState<Set<number>>(
    new Set()
  );

  useEffect(() => {
    setEqData(generateEquasionAndTiles(EQpattern));
    setSelectedTileIndices(new Set());
  }, [EQpattern]);

  if (!eqData) return <div>Loading...</div>;

  const numberOfTilesToClick = eqData.number_of_tiles_to_click;
  const correctNumber = eqData.correct_number;
  const numbersTotal = eqData.tiles
    .filter((tile) => selectedTileIndices.has(tile.index))
    .reduce((sum, tile) => sum + tile.value, 0);
  const tilesClickedCount = selectedTileIndices.size;

  const isTilesClickOverflow = tilesClickedCount > numberOfTilesToClick;

  const isOverFlow = numbersTotal > correctNumber;

  const isCorrectSum = numbersTotal === correctNumber;
  const isTilesCorrectClickCount = numberOfTilesToClick === tilesClickedCount;

  const isStepCorrect = isTilesCorrectClickCount && isCorrectSum;

  const handleTileClick = (tileIndex: number) => {
    setSelectedTileIndices((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(tileIndex)) {
        newSet.delete(tileIndex);
      } else {
        newSet.add(tileIndex);
      }
      return newSet;
    });
  };

  return (
    <div className="m-2 p-2 border-1">
      <div className="text-size-primary">{eqData.equasion_string}</div>
      <div className="text-size-secondary">{eqData.correct_number}</div>

      <div className="mt-4 flex flex-col gap-4">
        <div className="text-sm font-medium">
          <span>Selected Total: {numbersTotal}</span>
          <br></br>
          <span>Total To Go: {correctNumber - numbersTotal}</span>
          {isCorrectSum && (
            <span className="ml-2 text-green-600 font-bold">✓ Correct!</span>
          )}
          {isOverFlow && !isCorrectSum && (
            <span className="ml-2 text-red-600 font-bold">✗ Overflow</span>
          )}
        </div>
        <div className="text-sm font-medium">
          Tiles Clicked: {tilesClickedCount}/{numberOfTilesToClick}
          {isTilesClickOverflow && (
            <span className="ml-2 text-red-600 font-bold">
              ✗ Too many tiles
            </span>
          )}
        </div>
        <Tiles
          eqData={eqData}
          onTileClick={handleTileClick}
          selectedTileIndices={selectedTileIndices}
        />
      </div>
    </div>
  );
};
