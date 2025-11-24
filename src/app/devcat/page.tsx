import { randomIntFromInterval } from "@/utils/numbers";
import Image from "next/image";
import Tree_icon_1 from "@/components/forest/icons/Tree_1_icon.svg";
import Tree_icon_3 from "@/components/forest/icons/Tree_3_icon.svg";

const positions = [
  0, 2, 4, 5, 7, 9, 10, 12, 13, 15, 17, 19, 20, 22, 24, 25, 27, 29, 30, 32, 34,
  35, 37, 39, 40, 42, 44, 45, 47, 49, 50, 55, 57, 59, 60, 62, 64, 65, 67, 69,
  70, 72, 74, 75, 77, 79, 80, 82, 84, 85, 87, 89, 90, 92, 94, 95, 97, 99, 100,
];

const opacity = [20, 40, 60, 80, 100];
const size = [8, 11, 14, 17, 20];

export default function Home() {
  return (
    <div className="background-green-primary h-screen">
      Dev Cat
      <div className="tree-icons-container">
        {positions.map((position) => {
          const randomTree = randomIntFromInterval(0, 1);
          const randomSize = randomIntFromInterval(0, 4);

          if (randomTree === 0) {
            return (
              <div
                key={position}
                style={{
                  // border: "1px solid pink",
                  opacity: `${opacity[randomSize]}%`,
                  position: "absolute",
                  top: randomIntFromInterval(randomSize * 2, randomSize * 5),
                  left: `${position}%`,
                }}
              >
                <Image height={size[randomSize]} src={Tree_icon_3} alt="Tree" />
              </div>
            );
          } else {
            return (
              <div
                key={position}
                style={{
                  // border: "1px solid pink",
                  opacity: `${opacity[randomSize]}%`,
                  position: "absolute",
                  top: randomIntFromInterval(randomSize * 2, randomSize * 5),
                  left: `${position}%`,
                }}
              >
                <Image height={size[randomSize]} src={Tree_icon_1} alt="Tree" />
              </div>
            );
          }
        })}
      </div>
    </div>
  );
}
