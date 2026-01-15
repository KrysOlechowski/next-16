"use client";

import { useEffect } from "react";
import Image from "next/image";
import { ForestAnimation } from "./components/Forest_animation";
import Tree_yellow from "./images/icons/Tree_yellow.svg";
import hero_logo from "./images/hero_logo.svg";
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

  console.log(topAnimation);
  console.log(bottomAnimation);
  return (
    <div className="relative min-h-screen">
      <div id="bg-noise"></div>
      <main className="relative z-10 h-screen">
        <Image alt="Krystian" src={hero_logo} className="hero_logo" />
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
