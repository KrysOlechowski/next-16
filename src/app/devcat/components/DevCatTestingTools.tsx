"use client";
import React, { useState, useEffect } from "react";
import { useDevCatStore } from "../store/devCatStore";

export const DevCatTestingTools: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const {
    noiseOpacity,
    backgroundColor,
    topAnimation,
    bottomAnimation,
    setNoiseOpacity,
    setBackgroundColor,
    setAnimationOpacity,
    setTopAnimationColors,
    setBottomAnimationColors,
    setTopAnimationDuration,
    setBottomAnimationDuration,
    setTopAnimationSpeed,
    setBottomAnimationSpeed,
  } = useDevCatStore();

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

  const panelStyle = {
    display: isVisible ? "block" : "none",
    position: "fixed" as const,
    top: "20px",
    left: "20px",
    background: "rgba(0, 0, 0, 0.8)",
    color: "white",
    padding: "20px",
    borderRadius: "8px",
    zIndex: 9999,
    minWidth: "300px",
    maxHeight: "90vh",
    overflowY: "auto" as const,
  };

  const sectionStyle = {
    marginBottom: "20px",
    paddingBottom: "15px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.2)",
  };

  const labelStyle = {
    display: "block" as const,
    marginBottom: "8px",
    fontSize: "14px",
    fontWeight: "600" as const,
  };

  const inputStyle = {
    width: "100%",
    padding: "8px",
    marginBottom: "8px",
    borderRadius: "4px",
    border: "none",
    cursor: "pointer" as const,
  };

  return (
    <div style={panelStyle}>
      <h1 style={{ margin: "0 0 15px 0", fontSize: "18px" }}>
        DevCat Testing Tools
      </h1>

      {/* Noise Opacity */}
      <div style={sectionStyle}>
        <label style={labelStyle}>
          Noise Opacity: {noiseOpacity.toFixed(2)}
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={noiseOpacity}
          onChange={(e) => setNoiseOpacity(parseFloat(e.target.value))}
          style={{ width: "100%", cursor: "pointer" }}
        />
      </div>

      {/* Background Color */}
      <div style={sectionStyle}>
        <label style={labelStyle}>Background Color: {backgroundColor}</label>
        <input
          type="color"
          value={backgroundColor}
          onChange={(e) => setBackgroundColor(e.target.value)}
          style={{ ...inputStyle, height: "40px" }}
        />
      </div>

      {/* Animation Opacity */}
      <div style={sectionStyle}>
        <label style={labelStyle}>
          Animation Opacity: {(topAnimation.opacity ?? 1).toFixed(2)}
        </label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={String(topAnimation.opacity ?? 1)}
          onChange={(e) => setAnimationOpacity(parseFloat(e.target.value))}
          style={{ width: "100%", cursor: "pointer" }}
        />
      </div>

      {/* Top Animation */}
      <div style={sectionStyle}>
        <h3 style={{ margin: "0 0 10px 0", fontSize: "14px" }}>
          Top Animation
        </h3>
        <label style={labelStyle}>Color 1</label>
        <input
          type="color"
          value={topAnimation.colors[0]}
          onChange={(e) => {
            const colors = [...topAnimation.colors] as [string, string, string];
            colors[0] = e.target.value;
            setTopAnimationColors(colors);
          }}
          style={{ ...inputStyle, height: "40px" }}
        />
        <label style={labelStyle}>Color 2</label>
        <input
          type="color"
          value={topAnimation.colors[1]}
          onChange={(e) => {
            const colors = [...topAnimation.colors] as [string, string, string];
            colors[1] = e.target.value;
            setTopAnimationColors(colors);
          }}
          style={{ ...inputStyle, height: "40px" }}
        />
        <label style={labelStyle}>Color 3</label>
        <input
          type="color"
          value={topAnimation.colors[2]}
          onChange={(e) => {
            const colors = [...topAnimation.colors] as [string, string, string];
            colors[2] = e.target.value;
            setTopAnimationColors(colors);
          }}
          style={{ ...inputStyle, height: "40px" }}
        />
        <label style={labelStyle}>
          Duration: {topAnimation.animationDuration}s
        </label>
        <input
          type="range"
          min="5"
          max="60"
          step="1"
          value={topAnimation.animationDuration}
          onChange={(e) => setTopAnimationDuration(parseFloat(e.target.value))}
          style={{ width: "100%", cursor: "pointer", marginBottom: "8px" }}
        />
        <label style={labelStyle}>Speed: {topAnimation.animationSpeed}x</label>
        <input
          type="range"
          min="0.1"
          max="5"
          step="0.1"
          value={topAnimation.animationSpeed}
          onChange={(e) => setTopAnimationSpeed(parseFloat(e.target.value))}
          style={{ width: "100%", cursor: "pointer" }}
        />
      </div>

      {/* Bottom Animation */}
      <div style={sectionStyle}>
        <h3 style={{ margin: "0 0 10px 0", fontSize: "14px" }}>
          Bottom Animation
        </h3>
        <label style={labelStyle}>Color 1</label>
        <input
          type="color"
          value={bottomAnimation.colors[0]}
          onChange={(e) => {
            const colors = [...bottomAnimation.colors] as [
              string,
              string,
              string
            ];
            colors[0] = e.target.value;
            setBottomAnimationColors(colors);
          }}
          style={{ ...inputStyle, height: "40px" }}
        />
        <label style={labelStyle}>Color 2</label>
        <input
          type="color"
          value={bottomAnimation.colors[1]}
          onChange={(e) => {
            const colors = [...bottomAnimation.colors] as [
              string,
              string,
              string
            ];
            colors[1] = e.target.value;
            setBottomAnimationColors(colors);
          }}
          style={{ ...inputStyle, height: "40px" }}
        />
        <label style={labelStyle}>Color 3</label>
        <input
          type="color"
          value={bottomAnimation.colors[2]}
          onChange={(e) => {
            const colors = [...bottomAnimation.colors] as [
              string,
              string,
              string
            ];
            colors[2] = e.target.value;
            setBottomAnimationColors(colors);
          }}
          style={{ ...inputStyle, height: "40px" }}
        />
        <label style={labelStyle}>
          Duration: {bottomAnimation.animationDuration}s
        </label>
        <input
          type="range"
          min="5"
          max="60"
          step="1"
          value={bottomAnimation.animationDuration}
          onChange={(e) =>
            setBottomAnimationDuration(parseFloat(e.target.value))
          }
          style={{ width: "100%", cursor: "pointer", marginBottom: "8px" }}
        />
        <label style={labelStyle}>
          Speed: {bottomAnimation.animationSpeed}x
        </label>
        <input
          type="range"
          min="0.1"
          max="5"
          step="0.1"
          value={bottomAnimation.animationSpeed}
          onChange={(e) => setBottomAnimationSpeed(parseFloat(e.target.value))}
          style={{ width: "100%", cursor: "pointer" }}
        />
      </div>
    </div>
  );
};
