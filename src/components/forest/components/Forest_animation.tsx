import { randomIntFromInterval } from "@/utils/numbers";
import Image from "next/image";
import Tree_icon_1 from "@/components/forest/icons/Tree_1_icon.svg";
import Tree_icon_2 from "@/components/forest/icons/Tree_2_icon.svg";
import Tree_icon_3 from "@/components/forest/icons/Tree_3_icon.svg";
import Tree_icon_4 from "@/components/forest/icons/Tree_4_icon.svg";
import Tree_icon_5 from "@/components/forest/icons/Tree_5_icon.svg";

const positions = [
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

const positions_single = [
  [25, 0, 1],
  [53, 3, 15],
  [50, 4, 20],
  [47, 2, 10],
  [75, 1, 5],
];

const opacity = [20, 40, 60, 80, 100];
const size = [8, 11, 14, 17, 20];

type Props = {
  position: "top" | "bottom";
  icon: "tree" | "needle";
  animation?: "fadeIn" | "fadeOut";
  baseColors: [string, string];
};

export const ForestAnimation = ({ position, icon, animation }: Props) => {
  const isTop = position === "top";
  return (
    <div
      className={`tree-icons-container `}
      style={{
        top: `${position === "top" ? 0 : "unset"}`,
        bottom: `${position === "top" ? "unset" : 0}`,
      }}
    >
      <div
        className={`base ${
          position === "top"
            ? "color_transition_yellow"
            : "color_transition_red"
        }`}
      ></div>

      {positions.map((position, i) => {
        const randomTree = randomIntFromInterval(0, 1);
        // const randomSize = randomIntFromInterval(0, 4);
        const randomSize = position[1];

        const AnimationDuration = 8000 + 3000 * randomSize;
        const top = position[2];

        console.log(AnimationDuration);

        return (
          <div key={`${position[0]}-${i}`}>
            <div
              key={position[0]}
              style={{
                position: "absolute",
                top: top,
                left: `${position[0]}%`,
                animationDuration: `${AnimationDuration}ms`,
                transform: `${
                  isTop ? "translateY(-24px) rotate(180deg)" : "unset"
                }`,
              }}
              className={`${
                animation === "fadeIn" ? "fade-in-element" : "fade-out-element"
              } tree`}
            >
              <Image height={size[randomSize]} src={icon} alt="Tree" />

              {/* <span className="test-indicator">{position[0]}</span> */}
            </div>
          </div>
        );
      })}
    </div>
  );
};
