"use client";

import {
  EQUASION_PATTERN_TYPE,
  EQUASION_TRANSFORMED_TYPE,
} from "@/types/game_types";
import { generateEquasionAndTiles } from "@/utils/game";
import { useEffect, useState } from "react";
import { Tiles } from "./Tiles";

type EquasionProps = {
  EQpattern: EQUASION_PATTERN_TYPE;
};

export const Equasion = ({ EQpattern }: EquasionProps) => {
  const [eqData, setEqData] = useState<null | EQUASION_TRANSFORMED_TYPE>(null);

  useEffect(() => {
    setEqData(generateEquasionAndTiles(EQpattern));
  }, [EQpattern]);

  if (!eqData) return <div>Loading...</div>;

  return (
    <div className="m-2 p-2 border-1">
      <div className="text-size-primary">{eqData.equasion_string}</div>
      <div className="text-size-secondary">{eqData.correct_number}</div>

      <div>
        <Tiles eqData={eqData} />
      </div>
    </div>
  );
};
