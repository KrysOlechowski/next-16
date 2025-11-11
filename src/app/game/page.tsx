import { Equasion } from "@/components/game/Equasion";
import {
  EQUASION_PATTERN_1,
  EQUASION_PATTERN_2,
  EQUASION_PATTERN_3,
  EQUASION_PATTERN_X,
} from "@/const/GAME_CONST";

export default function Home() {
  return (
    <div className="flex text-5xl ">
      <Equasion EQpattern={EQUASION_PATTERN_1} />
      <Equasion EQpattern={EQUASION_PATTERN_2} />
      <Equasion EQpattern={EQUASION_PATTERN_3} />
      <Equasion EQpattern={EQUASION_PATTERN_X} />
    </div>
  );
}
