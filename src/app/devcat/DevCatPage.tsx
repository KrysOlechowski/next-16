"use client";

import { useEffect } from "react";
import Image from "next/image";
import { ForestAnimation } from "./components/Forest_animation";
import Tree_yellow from "./images/icons/Tree_yellow.svg";
import hero_logo from "./images/hero_logo.svg";
import hero_logo_png from "./images/hero_logo.png";
import { DevCatTestingTools } from "./components/DevCatTestingTools";
import { useDevCatStore } from "./store/devCatStore";

export const DevCatPage = () => {
  const { backgroundColor, topAnimation, bottomAnimation } = useDevCatStore();

  useEffect(() => {
    document.body.style.backgroundColor = backgroundColor;
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, [backgroundColor]);

  return (
    <div className="text-white relative min-h-screen">
      <div id="bg-noise"></div>
      <main className="relative z-10 h-screen">
        {/* <Image alt="Krystian" src={hero_logo} className="hero_logo" /> */}
        <Image alt="Krystian" src={hero_logo_png} className="hero_logo" />
        <h1>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam
          harum eaque libero laboriosam commodi omnis dolore perferendis sed
          excepturi nesciunt. Autem laudantium quo porro reprehenderit ipsa
          numquam reiciendis molestiae! Optio?
        </h1>
        <ForestAnimation
          position={"top"}
          icon={Tree_yellow}
          animation="fadeIn"
          colors={topAnimation.colors}
          animationDuration={topAnimation.animationDuration}
          animationSpeed={topAnimation.animationSpeed}
          opacity={topAnimation.opacity ?? 1}
        />
        <ForestAnimation
          position={"bottom"}
          icon={Tree_yellow}
          animation="fadeOut"
          colors={bottomAnimation.colors}
          animationDuration={bottomAnimation.animationDuration}
          animationSpeed={bottomAnimation.animationSpeed}
          opacity={bottomAnimation.opacity ?? 1}
        />
        <DevCatTestingTools />
      </main>
    </div>
  );
};
