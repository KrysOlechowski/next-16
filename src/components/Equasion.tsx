"use client";

import { randomIntFromInterval } from "@/utils/numbers";

export const Equasion = () => {
  const Answer_Value = randomIntFromInterval(15, 25);
  console.log("Client component");
  console.log("Answer_Value");
  return <div>{"Answer_Value"}</div>;
};
