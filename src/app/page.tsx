"use client";

import React, { useState, useCallback, useEffect } from "react";
import Header from "@/components/Header";
import TimezoneCard from "@/components/TimezoneCard";
import { useResponsive } from "@/hooks/useResponsive";
import { useLiveClock } from "@/hooks/useLiveClock";
import {
  getTimeInZone,
  getDateInZone,
  getOffsetLabel,
  isDST,
  detectUserTimezone,
} from "@/lib/time-utils";
import type { ColumnCount } from "@/types";

const DEFAULT_ZONES = [
  "",
  "Europe/London",
  "Asia/Tokyo",
  "Australia/Sydney",
];

export default function Home() {
  const { isMobile } = useResponsive();
  const [columns, setColumns] = useState<ColumnCount>(2);
  const [zones, setZones] = useState<string[]>(DEFAULT_ZONES);
  const [initialized, setInitialized] = useState(false);

  const {
    baseDate,
    liveMode,
    applyMinuteDelta,
    setExactTime,
    toggleLive,
    setZonesRef,
  } = useLiveClock();

  useEffect(() => {
    const userTz = detectUserTimezone();
    setZones((prev) => {
      const updated = [...prev];
      updated[0] = userTz;
      for (let i = 1; i < updated.length; i++) {
        if (updated[i] === userTz) {
          updated[i] = "America/New_York";
          break;
        }
      }
      return updated;
    });
    setInitialized(true);
  }, []);

  useEffect(() => {
    setZonesRef(zones);
  }, [zones, setZonesRef]);

  const handleZoneChange = useCallback((index: number, newZone: string) => {
    setZones((prev) => {
      const next = [...prev];
      next[index] = newZone;
      return next;
    });
  }, []);

  const activeZones = zones.slice(0, columns);

  if (!initialized) return null;

  const cardGap = isMobile ? 7 : 24;
  // Cards max out at 300px wide → container scales with column count
  const maxContainerWidth = 300 * columns + cardGap * (columns - 1) + 80;

  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        background: "linear-gradient(145deg,#faf9f7,#f0eeeb 50%,#e8e6e3)",
        fontFamily: "'DM Sans', sans-serif",
        display: "flex",
        justifyContent: "center",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: isMobile ? "100%" : maxContainerWidth,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          padding: isMobile ? "10px 10px 6px" : "40px 40px 32px",
          boxSizing: "border-box",
        }}
      >
        <Header
          liveMode={liveMode}
          columns={columns}
          isMobile={isMobile}
          onToggleLive={toggleLive}
          onSetColumns={setColumns}
        />

        {isMobile ? (
          /* Mobile: stack vertically, fill remaining space */
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: cardGap,
              minHeight: 0,
            }}
          >
            {activeZones.map((zone, i) => (
              <TimezoneCard
                key={`${zone}-${i}`}
                zone={zone}
                time={getTimeInZone(baseDate, zone)}
                date={getDateInZone(baseDate, zone)}
                offset={getOffsetLabel(baseDate, zone)}
                dst={isDST(baseDate, zone)}
                index={i}
                isMobile
                columns={columns}
                onMinuteDelta={(delta) => applyMinuteDelta(delta)}
                onDirectSet={(h, m) => setExactTime(i, h, m)}
                onZoneChange={(z) => handleZoneChange(i, z)}
              />
            ))}
            <div style={{ textAlign: "center", flexShrink: 0, paddingTop: 1 }}>
              <p style={{ fontSize: 8, color: "#bbb", margin: 0 }}>
                Swipe up/down to adjust · tap time to type
              </p>
            </div>
          </div>
        ) : (
          /* Desktop: vertically centered, capped height */
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 0,
            }}
          >
            <div
              style={{
                display: "flex",
                gap: cardGap,
                width: "100%",
                maxHeight: 480,
                height: "75%",
                minHeight: 320,
              }}
            >
              {activeZones.map((zone, i) => (
                <TimezoneCard
                  key={`${zone}-${i}`}
                  zone={zone}
                  time={getTimeInZone(baseDate, zone)}
                  date={getDateInZone(baseDate, zone)}
                  offset={getOffsetLabel(baseDate, zone)}
                  dst={isDST(baseDate, zone)}
                  index={i}
                  isMobile={false}
                  columns={columns}
                  onMinuteDelta={(delta) => applyMinuteDelta(delta)}
                  onDirectSet={(h, m) => setExactTime(i, h, m)}
                  onZoneChange={(z) => handleZoneChange(i, z)}
                />
              ))}
            </div>
          </div>
        )}

        {!isMobile && (
          <div
            style={{
              textAlign: "center",
              flexShrink: 0,
              paddingTop: 16,
              animation: "fadeUp 0.5s 0.4s ease both",
            }}
          >
            <p style={{ fontSize: 11, color: "#b0b0b0", margin: 0 }}>
              Scroll to adjust · click time to type · DST auto-detected
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
