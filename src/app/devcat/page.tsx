import { ForestAnimation } from "@/components/forest/components/Forest_animation";
import Tree_icon_2 from "@/components/forest/icons/Tree_2_icon.svg";
import Tree_icon_3 from "@/components/forest/icons/Tree_3_icon.svg";

export default function Home() {
  return (
    <div className="background-green-primary h-screen">
      Dev Cat
      <ForestAnimation
        position={"top"}
        icon={Tree_icon_2}
        animation="fadeIn"
        baseColors={["#f36b4b", "#de982e"]}
      />
      <ForestAnimation
        position={"bottom"}
        icon={Tree_icon_3}
        animation="fadeOut"
        baseColors={["#679a45", "#de982e"]}
      />
    </div>
  );
}
