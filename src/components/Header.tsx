"use client";

import React from "react";
import { FONTS } from "@/lib/theme";
import type { ColumnCount } from "@/types";

interface HeaderProps {
  liveMode: boolean;
  columns: ColumnCount;
  isMobile: boolean;
  onToggleLive: () => void;
  onSetColumns: (n: ColumnCount) => void;
}

const COLUMN_OPTIONS: ColumnCount[] = [2, 3, 4];

export default function Header({
  liveMode,
  columns,
  isMobile,
  onToggleLive,
  onSetColumns,
}: HeaderProps) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: isMobile ? 8 : 14,
        flexShrink: 0,
        flexWrap: "wrap",
        gap: 8,
        animation: "fadeUp 0.5s ease both",
      }}
    >
      <div>
        <h1
          style={{
            fontSize: isMobile ? 20 : 28,
            fontWeight: 700,
            color: "#1a1a1a",
            margin: 0,
            letterSpacing: "-0.5px",
            lineHeight: 1.2,
            fontFamily: FONTS.sans,
          }}
        >
          Time Zones
        </h1>
        {!isMobile && (
          <p
            style={{
              fontSize: 13,
              color: "#717171",
              margin: "2px 0 0",
              fontWeight: 400,
              fontFamily: FONTS.sans,
            }}
          >
            Scroll to adjust · double-click or tap &quot;type time&quot; to enter
            directly
          </p>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
        {/* Live / Custom toggle */}
        <button
          onClick={onToggleLive}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: isMobile ? "6px 10px" : "8px 14px",
            borderRadius: 12,
            border: "1px solid rgba(0,0,0,0.1)",
            background: liveMode ? "#ff385c" : "#fff",
            color: liveMode ? "#fff" : "#484848",
            fontSize: isMobile ? 11 : 12,
            fontWeight: 600,
            fontFamily: FONTS.sans,
            cursor: "pointer",
            transition: "all 0.3s",
            boxShadow: liveMode
              ? "0 3px 12px rgba(255,56,92,0.25)"
              : "0 1px 3px rgba(0,0,0,0.06)",
          }}
        >
          <div
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: liveMode ? "#fff" : "#aaa",
              animation: liveMode ? "blink 1.5s ease infinite" : "none",
            }}
          />
          {liveMode ? "Live" : "Custom"}
        </button>

        {/* Column count selector */}
        <div
          style={{
            display: "flex",
            background: "#fff",
            borderRadius: 12,
            border: "1px solid rgba(0,0,0,0.1)",
            overflow: "hidden",
            boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          }}
        >
          {COLUMN_OPTIONS.map((n, i) => (
            <button
              key={n}
              onClick={() => onSetColumns(n)}
              style={{
                padding: isMobile ? "6px 12px" : "8px 14px",
                border: "none",
                background: columns === n ? "#222" : "transparent",
                color: columns === n ? "#fff" : "#717171",
                fontSize: isMobile ? 11 : 12,
                fontWeight: 600,
                fontFamily: FONTS.sans,
                cursor: "pointer",
                transition: "all 0.3s",
                borderRight:
                  i < COLUMN_OPTIONS.length - 1
                    ? "1px solid rgba(0,0,0,0.06)"
                    : "none",
              }}
            >
              {n}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
