import { ForestAnimation } from "@/components/forest/components/Forest_animation";
import Tree_icon_2 from "@/components/forest/icons/Tree_2_icon.svg";
import Tree_icon_3 from "@/components/forest/icons/Tree_3_icon.svg";

import hero_logo from "@/components/forest/images/hero_logo.svg";
import hero_logo_png from "@/components/forest/images/image 1.png";

import Image from "next/image";

export default function Home() {
  return (
    <div className="background-green-primary h-screen">
      <Image alt="Krystian" src={hero_logo_png} className="hero_logo" />
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
