import { FishkaContainer } from "@/components/fishki/Fishka_Container";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div>
      Home Page
      <div className="my-6">
        <h2 className="text-lg font-semibold mb-3">Authentication</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <Button asChild>
            <Link href="/auth/sign-up">Sign Up</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/auth/sign-in">Sign In</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/dashboard">Dashboard (Protected)</Link>
          </Button>
        </div>
      </div>
      <div className="my-6">
        <h2 className="text-lg font-semibold mb-3">Other Pages</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <Button asChild variant="outline">
            <Link href="/api-test">/api-test</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/devcat">/devcat</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/dynamic/1">/dynamic/[id]</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/game">/game</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/playground">/playground</Link>
          </Button>
        </div>
      </div>
      <div>
        <h1>Fishki</h1>
        <div>
          <FishkaContainer text={["cease", "przerwać"]} />
        </div>
      </div>
    </div>
  );
}
