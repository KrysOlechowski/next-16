import { EQUASION_TRANSFORMED_TYPE } from "@/app/game/types/game_types";

type Props = {
  eqData: EQUASION_TRANSFORMED_TYPE;
};

export const Tiles = ({ eqData }: Props) => {
  return (
    <div>
      {eqData.tiles.map((tile) => {
        return (
          <div
            key={tile.index}
            className={`alert-error text-xs  ${
              tile.is_correct ? "text-green-500" : "text-red-500"
            }`}
          >
            {/* <div>Index: {tile.index}</div> */}
            <div className="text-size-ternary">{tile.value}</div>
          </div>
        );
      })}
    </div>
  );
};
