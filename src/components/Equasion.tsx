"use client";

import { EQUASION_PATTERN_TYPE } from "@/types/game_types";
import { generateEquasionAndTiles } from "@/utils/game";
import { randomIntFromInterval } from "@/utils/numbers";
import { useEffect, useState } from "react";

type EquasionProps = {
  EQpattern: EQUASION_PATTERN_TYPE;
};

export const Equasion = ({ EQpattern }: EquasionProps) => {
  const [eqData, setEqData] = useState<null | ReturnType<
    typeof generateEquasionAndTiles
  >>(null);

  useEffect(() => {
    setEqData(generateEquasionAndTiles(EQpattern));
  }, [EQpattern]);

  if (!eqData) return <div>Loading...</div>;

  return (
    <div className="m-2 p-2 border-1">
      <div>{eqData.equasion_string}</div>
      <div>{eqData.correct_number}</div>

      <div>
        {eqData.tiles.map((tile) => {
          return (
            <div
              key={tile.index}
              className={`alert-error text-xs  ${
                tile.is_correct ? "text-green-500" : "text-red-500"
              }`}
            >
              <div>Index: {tile.index}</div>
              <div>{tile.value}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
