"use client";

import React, { useRef } from "react";
import { getTimeOfDay, getSunPosition } from "@/lib/time-utils";
import { SKY_GRADIENTS } from "@/lib/theme";

interface StarData {
  x: number;
  y: number;
  sz: number;
  dl: number;
  dr: number;
}

function Stars({ opacity }: { opacity: number }) {
  const stars = useRef<StarData[]>(
    Array.from({ length: 18 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 55,
      sz: Math.random() * 2 + 0.8,
      dl: Math.random() * 3,
      dr: Math.random() * 2 + 2,
    }))
  ).current;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        opacity,
        transition: "opacity 1.5s ease",
        pointerEvents: "none",
      }}
    >
      {stars.map((s, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.sz,
            height: s.sz,
            borderRadius: "50%",
            backgroundColor: "#fff",
            animation: `twinkle ${s.dr}s ${s.dl}s ease-in-out infinite`,
          }}
        />
      ))}
    </div>
  );
}

interface SkySceneProps {
  hour: number;
  minute: number;
}

export default function SkyScene({ hour, minute }: SkySceneProps) {
  const tod = getTimeOfDay(hour);
  const sunPos = getSunPosition(hour, minute);
  const showSun = tod !== "night";
  const sunTop = showSun ? 8 + (1 - sunPos) * 50 : 110;

  const sunColor =
    tod === "dawn" || tod === "dusk"
      ? "linear-gradient(135deg,#ff6b6b,#feca57)"
      : "linear-gradient(135deg,#ffeaa7,#fdcb6e 50%,#f9ca24)";

  const glow =
    tod === "dawn" || tod === "dusk"
      ? "rgba(255,107,107,0.3)"
      : "rgba(253,203,110,0.35)";

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: "inherit",
        overflow: "hidden",
        background: SKY_GRADIENTS[tod],
        transition: "background 2s ease",
      }}
    >
      <Stars opacity={tod === "night" ? 0.9 : tod === "dusk" ? 0.3 : 0} />

      {/* Moon */}
      <div
        style={{
          position: "absolute",
          top: tod === "night" ? "10%" : "-20%",
          right: "12%",
          width: 20,
          height: 20,
          borderRadius: "50%",
          background: "linear-gradient(135deg,#ffeaa7,#dfe6e9)",
          boxShadow: "0 0 16px rgba(255,234,167,0.4)",
          transition:
            "top 1.5s cubic-bezier(0.34,1.56,0.64,1), opacity 1s",
          opacity: tod === "night" ? 1 : 0,
        }}
      />

      {/* Sun */}
      <div
        style={{
          position: "absolute",
          top: `${sunTop}%`,
          left: "50%",
          transform: "translateX(-50%)",
          width: 26,
          height: 26,
          borderRadius: "50%",
          background: sunColor,
          boxShadow: `0 0 24px ${glow},0 0 60px ${glow}`,
          transition:
            "top 1.5s cubic-bezier(0.34,1.56,0.64,1),background 1.5s,box-shadow 1.5s",
          zIndex: 2,
        }}
      />

      {/* Clouds */}
      {showSun && (
        <>
          <div
            style={{
              position: "absolute",
              bottom: "22%",
              left: "-10%",
              width: 60,
              height: 14,
              borderRadius: 14,
              background: "rgba(255,255,255,0.2)",
              filter: "blur(3px)",
              animation: "cloudDrift 25s linear infinite",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "38%",
              left: "-20%",
              width: 44,
              height: 11,
              borderRadius: 11,
              background: "rgba(255,255,255,0.14)",
              filter: "blur(2px)",
              animation: "cloudDrift 35s 5s linear infinite",
            }}
          />
        </>
      )}

      {/* Horizon glow */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "30%",
          background:
            tod === "dawn" || tod === "dusk"
              ? "linear-gradient(to top,rgba(253,203,110,0.3),transparent)"
              : tod === "night"
              ? "linear-gradient(to top,rgba(45,27,105,0.4),transparent)"
              : "linear-gradient(to top,rgba(255,234,167,0.12),transparent)",
          transition: "background 2s ease",
        }}
      />
    </div>
  );
}
