"use client";

import Image from "next/image";
import { ForestAnimation } from "@/components/forest/components/Forest_animation";
import Tree_yellow from "@/components/forest/icons/Tree_yellow.svg";
import hero_logo from "@/components/forest/images/hero_logo.svg";
import { DevCatTestingTools } from "./components/DevCatTestingTools";
import { useDevCatStore } from "./store/devCatStore";

export const DevCatPage = () => {
  const { backgroundColor, topAnimation, bottomAnimation } = useDevCatStore();

  return (
    <div className="bg-[#de982e] relative h-screen" style={{ backgroundColor }}>
      <div id="bg-noise"></div>
      <main className="relative z-10">
        <Image alt="Krystian" src={hero_logo} className="hero_logo" />
        <ForestAnimation
          position={"top"}
          icon={Tree_yellow}
          animation="fadeIn"
          colors={topAnimation.colors}
        />
        <ForestAnimation
          position={"bottom"}
          icon={Tree_yellow}
          animation="fadeOut"
          colors={bottomAnimation.colors}
        />
        <DevCatTestingTools />
      </main>
    </div>
  );
};
