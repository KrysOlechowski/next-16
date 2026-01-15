import { randomIntFromInterval } from "@/utils/numbers";
import Image from "next/image";
import type { StaticImageData } from "next/image";
import Tree_icon_1 from "@/components/forest/icons/Tree_1_icon.svg";
import Tree_icon_2 from "@/components/forest/icons/Tree_2_icon.svg";
import Tree_icon_3 from "@/components/forest/icons/Tree_3_icon.svg";
import Tree_icon_4 from "@/components/forest/icons/Tree_4_icon.svg";
import Tree_icon_5 from "@/components/forest/icons/Tree_5_icon.svg";

const treePositions = [
  // [2, 2, 20],
  // [4, 1, 16],
  // [6, 3, 12],
  // [8, 0, 8],
  // [10, 4, 4],
  // [12, 2, 0],
  [14, 1, 20],
  [16, 3, 16],
  [18, 0, 12],
  [20, 4, 8],
  [22, 2, 4],
  [24, 1, 0],
  [26, 3, 20],
  [28, 0, 16],
  [30, 4, 12],
  [32, 2, 8],
  [34, 1, 4],
  [36, 3, 0],
  [38, 0, 20],
  [40, 4, 16],
  [42, 2, 12],

  [45, 1, 14],
  [44, 4, 19],

  [45, 1, 14],
  [45, 0, 4],
  [46, 4, 22],
  [47, 2, 6],
  [48, 3, 14],
  [48, 0, 0],
  [49, 1, 4],
  [50, 4, 20],
  [51, 2, 8],
  [52, 0, 4],
  [53, 4, 15],
  [56, 3, 8],
  [58, 0, 4],
  [60, 4, 0],
  [62, 2, 20],
  [64, 1, 16],
  [66, 3, 12],
  [68, 0, 8],
  [70, 4, 4],
  [72, 2, 0],
  [74, 1, 20],
  [76, 3, 16],
  [78, 0, 12],
  [80, 4, 8],
  [82, 2, 4],
  [84, 1, 0],
  // [86, 3, 20],
  // [88, 0, 16],
  // [90, 4, 12],
  // [92, 2, 8],
  // [94, 1, 4],
  // [96, 3, 0],
  // [98, 0, 20],
  // [100, 4, 16],
];

const singleTreePositions = [
  [25, 0, 1],
  [53, 3, 15],
  [50, 4, 20],
  [47, 2, 10],
  [75, 1, 5],
];

const opacityLevels = [20, 40, 60, 80, 100];
const treeSizes = [8, 11, 14, 17, 20];

type Props = {
  position: "top" | "bottom";
  icon: StaticImageData | string;
  animation?: "fadeIn" | "fadeOut";
  colors: [string, string, string];
  animationDuration?: number;
  animationSpeed?: number;
  opacity?: number;
};

export const ForestAnimation = ({
  position,
  icon,
  animation = "fadeOut",
  colors,
  animationDuration = 20,
  animationSpeed = 1,
  opacity = 1,
}: Props) => {
  const isTop = position === "top";
  const animationClass =
    animation === "fadeIn" ? "fade-in-element" : "fade-out-element";

  const animationName = `color_change_${colors.join("_").replace(/#/g, "")}`;

  const keyframes = `
    @keyframes ${animationName} {
      0% {
        background-color: ${colors[0]};
      }
      50% {
        background-color: ${colors[1]};
      }
      100% {
        background-color: ${colors[2]};
      }
    }
  `;

  return (
    <div
      className={`tree-icons-container `}
      style={{
        top: `${position === "top" ? 0 : "unset"}`,
        bottom: `${position === "top" ? "unset" : 0}`,
        opacity: opacity,
      }}
    >
      <style>{keyframes}</style>
      <div
        className="base"
        style={{
          animationName: animationName,
          animationDuration: `${animationDuration / animationSpeed}s`,
          animationIterationCount: "infinite",
          animationDirection: "alternate",
          animationTimingFunction: "ease-in-out",
          animationPlayState: "running",
          transition: "color 10s ease",
          top: isTop ? "-184px" : undefined,
        }}
      ></div>

      {treePositions.map((treePosition, index) => {
        // const sizeIndex = randomIntFromInterval(0, 4);
        const sizeIndex = treePosition[1];

        const animationDuration = 8000 + 3000 * sizeIndex;
        const verticalOffset = treePosition[2];

        return (
          <div key={`${treePosition[0]}-${index}`}>
            <div
              style={{
                position: "absolute",
                top: verticalOffset,
                left: `${treePosition[0]}%`,
                animationDuration: `${animationDuration}ms`,
                transform: `${
                  isTop ? "translateY(-24px) rotate(0deg)" : "unset"
                }`,
              }}
              className={`${animationClass} tree`}
            >
              <Image height={treeSizes[sizeIndex]} src={icon} alt="Tree" />

              {/* <span className="test-indicator">{treePosition[0]}</span> */}
            </div>
          </div>
        );
      })}
    </div>
  );
};
