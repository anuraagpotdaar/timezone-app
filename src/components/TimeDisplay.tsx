"use client";

import React, { useState, useRef, useCallback } from "react";
import { to12Hour, getAmPm, getTimeOfDay } from "@/lib/time-utils";
import { getCardColors, FONTS } from "@/lib/theme";
import type { ColumnCount } from "@/types";

interface TimeDisplayProps {
  hour: number;
  minute: number;
  onMinuteDelta: (delta: number) => void;
  onDirectSet: (hour: number, minute: number) => void;
  isMobile: boolean;
  columns: ColumnCount;
}

type EditTarget = "hour" | "minute" | null;

export default function TimeDisplay({
  hour,
  minute,
  onMinuteDelta,
  onDirectSet,
  isMobile,
  columns,
}: TimeDisplayProps) {
  const [editTarget, setEditTarget] = useState<EditTarget>(null);
  const [editBuffer, setEditBuffer] = useState("");
  const hourRef = useRef<HTMLInputElement>(null);
  const minuteRef = useRef<HTMLInputElement>(null);
  const touchStartY = useRef<number | null>(null);
  const accumulated = useRef(0);

  const tod = getTimeOfDay(hour);
  const colors = getCardColors(tod);
  const displayHour = to12Hour(hour);
  const ampm = getAmPm(hour);
  const formattedMin = String(minute).padStart(2, "0");

  const tSize = isMobile
    ? columns >= 4 ? 26 : columns === 3 ? 30 : 38
    : 54;

  const inputW = isMobile
    ? columns >= 4 ? 32 : columns === 3 ? 38 : 48
    : 68;

  const TOUCH_THRESHOLD = 16;

  // ── Scroll/swipe ────────────────────────────────────────────
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (editTarget) return;
      e.preventDefault();
      onMinuteDelta(e.deltaY < 0 ? 5 : -5);
    },
    [onMinuteDelta, editTarget]
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (editTarget) return;
      touchStartY.current = e.touches[0].clientY;
      accumulated.current = 0;
    },
    [editTarget]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (editTarget) return;
      if (touchStartY.current === null) return;
      e.preventDefault();
      const dy = touchStartY.current - e.touches[0].clientY;
      accumulated.current += dy;
      touchStartY.current = e.touches[0].clientY;
      if (Math.abs(accumulated.current) >= TOUCH_THRESHOLD) {
        onMinuteDelta(Math.sign(accumulated.current) * 5);
        accumulated.current = 0;
      }
    },
    [onMinuteDelta, editTarget]
  );

  const handleTouchEnd = useCallback(() => {
    touchStartY.current = null;
    accumulated.current = 0;
  }, []);

  // ── Hour editing ────────────────────────────────────────────
  const startEditHour = useCallback(() => {
    setEditTarget("hour");
    setEditBuffer("");
    setTimeout(() => hourRef.current?.focus(), 20);
  }, []);

  const startEditMinute = useCallback(() => {
    setEditTarget("minute");
    setEditBuffer("");
    setTimeout(() => minuteRef.current?.focus(), 20);
  }, []);

  const commitHour = useCallback(
    (buffer: string) => {
      setEditTarget(null);
      const val = parseInt(buffer);
      if (isNaN(val) || val < 1 || val > 12) return;
      let h24 = ampm === "PM" ? (val === 12 ? 12 : val + 12) : (val === 12 ? 0 : val);
      onDirectSet(h24, minute);
    },
    [ampm, minute, onDirectSet]
  );

  const handleHourKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Escape") { setEditTarget(null); return; }
      if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        commitHour(editBuffer);
        setTimeout(() => startEditMinute(), 30);
        return;
      }
      if (!/^\d$/.test(e.key) && e.key !== "Backspace") { e.preventDefault(); }
    },
    [editBuffer, commitHour, startEditMinute]
  );

  const handleHourInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/\D/g, "");
      if (raw.length > 2) return;
      setEditBuffer(raw);
      if (raw.length === 2) {
        commitHour(raw);
        setTimeout(() => startEditMinute(), 30);
      } else if (raw.length === 1 && parseInt(raw) > 1) {
        commitHour(raw);
        setTimeout(() => startEditMinute(), 30);
      }
    },
    [commitHour, startEditMinute]
  );

  // ── Minute editing ──────────────────────────────────────────
  const commitMinute = useCallback(
    (buffer: string) => {
      setEditTarget(null);
      const val = parseInt(buffer);
      if (isNaN(val) || val < 0 || val > 59) return;
      onDirectSet(hour, val);
    },
    [hour, onDirectSet]
  );

  const handleMinuteKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Escape") { setEditTarget(null); return; }
      if (e.key === "Enter" || e.key === "Tab") {
        e.preventDefault();
        commitMinute(editBuffer);
        return;
      }
      if (!/^\d$/.test(e.key) && e.key !== "Backspace") { e.preventDefault(); }
    },
    [editBuffer, commitMinute]
  );

  const handleMinuteInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/\D/g, "");
      if (raw.length > 2) return;
      setEditBuffer(raw);
      if (raw.length === 2) {
        commitMinute(raw);
      } else if (raw.length === 1 && parseInt(raw) > 5) {
        commitMinute(raw);
      }
    },
    [commitMinute]
  );

  // ── Shared styles ───────────────────────────────────────────
  const digitStyle: React.CSSProperties = {
    fontSize: tSize,
    fontFamily: FONTS.mono,
    fontWeight: 500,
    color: colors.text,
    textShadow: colors.timeShadow,
  };

  const baseInputStyle: React.CSSProperties = {
    width: inputW,
    background: "transparent",
    border: "none",
    ...digitStyle,
    outline: "none",
    padding: 0,
    margin: 0,
    caretColor: colors.text,
    textAlign: "center" as const,
  };

  const editUnderline: React.CSSProperties = {
    borderBottom: "2px solid rgba(255,255,255,0.6)",
    borderRadius: 0,
  };

  const isEditingHour = editTarget === "hour";
  const isEditingMinute = editTarget === "minute";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: isMobile ? 2 : 4,
      }}
    >
      <div
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "center",
          cursor: editTarget ? "text" : "ns-resize",
          touchAction: editTarget ? "auto" : "none",
          userSelect: "none",
          padding: isMobile ? "4px 0" : "6px 0",
          borderRadius: 16,
        }}
        title="Scroll to change time · Click digits to type"
      >
        {/* Hour */}
        {isEditingHour ? (
          <input
            ref={hourRef}
            type="text"
            inputMode="numeric"
            value={editBuffer}
            placeholder={String(displayHour)}
            onChange={handleHourInput}
            onKeyDown={handleHourKeyDown}
            onBlur={() => {
              if (editBuffer) commitHour(editBuffer);
              else setEditTarget(null);
            }}
            style={{ ...baseInputStyle, ...editUnderline, textAlign: "right" }}
            autoComplete="off"
          />
        ) : (
          <span
            onClick={startEditHour}
            style={{
              ...digitStyle,
              width: inputW,
              textAlign: "right" as const,
              cursor: "pointer",
              display: "inline-block",
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === "Enter") startEditHour(); }}
          >
            {displayHour}
          </span>
        )}

        {/* Colon */}
        <span
          style={{
            ...digitStyle,
            opacity: 0.4,
            animation: editTarget ? "none" : "blink 2s ease infinite",
            margin: "0 1px",
          }}
        >
          :
        </span>

        {/* Minute */}
        {isEditingMinute ? (
          <input
            ref={minuteRef}
            type="text"
            inputMode="numeric"
            value={editBuffer}
            placeholder={formattedMin}
            onChange={handleMinuteInput}
            onKeyDown={handleMinuteKeyDown}
            onBlur={() => {
              if (editBuffer) commitMinute(editBuffer);
              else setEditTarget(null);
            }}
            style={{ ...baseInputStyle, ...editUnderline, textAlign: "left" }}
            autoComplete="off"
          />
        ) : (
          <span
            onClick={startEditMinute}
            style={{
              ...digitStyle,
              width: inputW,
              textAlign: "left" as const,
              cursor: "pointer",
              display: "inline-block",
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === "Enter") startEditMinute(); }}
          >
            {formattedMin}
          </span>
        )}

        {/* AM/PM */}
        <span
          style={{
            fontSize: Math.max(tSize * 0.35, 10),
            fontFamily: FONTS.sans,
            fontWeight: 600,
            color: colors.subtext,
            marginLeft: isMobile ? 4 : 8,
            letterSpacing: "0.3px",
            alignSelf: "center",
            userSelect: "none",
            textShadow: colors.textShadow,
          }}
        >
          {ampm}
        </span>
      </div>
    </div>
  );
}
