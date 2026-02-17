"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { getTimeInZone } from "@/lib/time-utils";

export function useLiveClock() {
  const [baseDate, setBaseDate] = useState(() => new Date());
  const [liveMode, setLiveMode] = useState(true);
  const zonesRef = useRef<string[]>([]);

  // Keep zones ref in sync for callbacks
  const setZonesRef = useCallback((zones: string[]) => {
    zonesRef.current = zones;
  }, []);

  useEffect(() => {
    if (!liveMode) return;
    const id = setInterval(() => setBaseDate(new Date()), 1000);
    return () => clearInterval(id);
  }, [liveMode]);

  /** Shift baseDate by a minute delta (used by unified scroll) */
  const applyMinuteDelta = useCallback((delta: number) => {
    setLiveMode(false);
    setBaseDate((prev) => new Date(prev.getTime() + delta * 60_000));
  }, []);

  /** Set an exact hour/minute in a specific zone */
  const setExactTime = useCallback(
    (zoneIndex: number, newHour: number, newMinute: number) => {
      setLiveMode(false);
      setBaseDate((prev) => {
        const tz = zonesRef.current[zoneIndex];
        if (!tz) return prev;
        const cur = getTimeInZone(prev, tz);
        const diff =
          ((newHour - cur.hour) * 60 + (newMinute - cur.minute)) * 60_000;
        return new Date(prev.getTime() + diff);
      });
    },
    []
  );

  /** Resume live clock */
  const goLive = useCallback(() => {
    setBaseDate(new Date());
    setLiveMode(true);
  }, []);

  /** Toggle live/custom */
  const toggleLive = useCallback(() => {
    if (!liveMode) {
      goLive();
    } else {
      setLiveMode(false);
    }
  }, [liveMode, goLive]);

  return {
    baseDate,
    liveMode,
    applyMinuteDelta,
    setExactTime,
    toggleLive,
    setZonesRef,
  };
}
