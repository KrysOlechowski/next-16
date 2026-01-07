import { ForestAnimation } from "@/components/forest/components/Forest_animation";
import Tree_icon_2 from "@/components/forest/icons/Tree_2_icon.svg";
import Tree_icon_Needle from "@/components/forest/icons/Tree_3_icon.svg";
import Rain_drop from "@/components/forest/icons/Rain_drop_icon.svg";
import Water_drop from "@/components/forest/icons/Water_drop_icon.svg";

import Tree_color_bubble_icon from "@/components/forest/icons/Tree_color_bubble_icon.svg";
import Tree_color_normal_icon from "@/components/forest/icons/Tree_color_normal_icon.svg";

import Star_white_icon from "@/components/forest/icons/Star_white_icon.svg";
import Star_white_2_icon from "@/components/forest/icons/Star_white_2_icon.svg";

import Tree_yellow from "@/components/forest/icons/Tree_yellow.svg";

import hero_logo from "@/components/forest/images/hero_logo.svg";
import hero_logo_png from "@/components/forest/images/image 1.png";

import Image from "next/image";

export default function Home() {
  return (
    <div className="background-green-primary h-screen">
      <Image alt="Krystian" src={hero_logo} className="hero_logo" />
      <ForestAnimation
        position={"top"}
        // icon={Rain_drop}
        icon={Tree_yellow}
        animation="fadeIn"
        colors={["#fff", "#679a45", "#000"]}
      />
      <ForestAnimation
        position={"bottom"}
        // icon={Water_drop}
        icon={Tree_yellow}
        animation="fadeOut"
        colors={["#679a45", "#f36b4b", "#679a45"]}
      />
    </div>
  );
}
