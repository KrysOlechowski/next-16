import { EQUASION_TRANSFORMED_TYPE } from "@/app/game/types/game_types";
import { gameStyles } from "../styles/gameStyles";

type Props = {
  eqData: EQUASION_TRANSFORMED_TYPE;
  onTileClick?: (tileIndex: number) => void;
  selectedTileIndices?: Set<number>;
};

export const Tiles = ({
  eqData,
  onTileClick,
  selectedTileIndices = new Set(),
}: Props) => {
  return (
    <div className="grid grid-cols-3 gap-2 w-fit">
      {eqData.tiles.map((tile) => {
        const isSelected = selectedTileIndices.has(tile.index);
        return (
          <div
            key={tile.index}
            onClick={() => onTileClick?.(tile.index)}
            className={`
              flex items-center justify-center
              rounded-md shadow-sm
              transition-all duration-200 hover:scale-105
              cursor-pointer
              h-[40px] w-[40px]
              font-semibold text-base
              border-2
              ${isSelected ? "ring-2 ring-blue-500 scale-105" : ""}
              ${
                tile.is_correct
                  ? "bg-green-100 border-green-400 text-green-700 hover:bg-green-200"
                  : "bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200"
              }
            `}
            style={
              tile.is_correct
                ? {
                    backgroundColor: "rgba(34, 197, 94, 0.1)",
                    borderColor: gameStyles.gameGeneral.gameMainColor,
                  }
                : undefined
            }
          >
            <span>{tile.value}</span>
          </div>
        );
      })}
    </div>
  );
};
