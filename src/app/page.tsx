import { FishkaContainer } from "@/components/fishki/Fishka_Container";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      Home Page
      <div>
        <h1>Fishki</h1>
        <div>
          <FishkaContainer text={["cease", "przerwać"]} />
        </div>
      </div>
    </div>
  );
}
