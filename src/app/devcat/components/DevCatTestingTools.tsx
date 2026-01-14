"use client";
import React, { useState, useEffect } from "react";
import { useDevCatStore } from "../store/devCatStore";

export const DevCatTestingTools: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { noiseOpacity, backgroundColor, setNoiseOpacity, setBackgroundColor } =
    useDevCatStore();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "t") {
        setIsVisible((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--noise-opacity",
      noiseOpacity.toString()
    );
    const bgDiv = document.querySelector('[id="bg-noise"]') as HTMLElement;
    if (bgDiv) {
      bgDiv.style.backgroundColor = backgroundColor;
    }
    const mainDiv = document.querySelector(
      ".bg-\\[\\#de982e\\]"
    ) as HTMLElement;
    if (mainDiv) {
      mainDiv.style.backgroundColor = backgroundColor;
    }
  }, [noiseOpacity, backgroundColor]);

  const handleOpacityChange = (value: number) => {
    setNoiseOpacity(value);
  };

  const handleBackgroundColorChange = (color: string) => {
    setBackgroundColor(color);
  };

  return (
    <div
      style={{
        display: isVisible ? "block" : "none",
        position: "fixed",
        top: "20px",
        left: "20px",
        background: "rgba(0, 0, 0, 0.8)",
        color: "white",
        padding: "20px",
        borderRadius: "8px",
        zIndex: 9999,
        minWidth: "250px",
      }}
    >
      <h1 style={{ margin: "0 0 15px 0", fontSize: "18px" }}>
        DevCat Testing Tools
      </h1>
      <div style={{ marginBottom: "15px" }}>
        <label
          style={{ display: "block", marginBottom: "8px", fontSize: "14px" }}
        >
          Noise Opacity: {noiseOpacity.toFixed(2)}
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={noiseOpacity}
          onChange={(e) => handleOpacityChange(parseFloat(e.target.value))}
          style={{ width: "100%", cursor: "pointer" }}
        />
      </div>
      <div>
        <label
          style={{ display: "block", marginBottom: "8px", fontSize: "14px" }}
        >
          Background Color: {backgroundColor}
        </label>
        <input
          type="color"
          value={backgroundColor}
          onChange={(e) => handleBackgroundColorChange(e.target.value)}
          style={{
            width: "100%",
            height: "40px",
            cursor: "pointer",
            borderRadius: "4px",
          }}
        />
      </div>
    </div>
  );
};
