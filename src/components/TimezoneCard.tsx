"use client";

import React, { useState } from "react";
import SkyScene from "@/components/SkyScene";
import TimeDisplay from "@/components/TimeDisplay";
import TimezonePicker from "@/components/TimezonePicker";
import { getTimeOfDay } from "@/lib/time-utils";
import { getCardColors, getScrimGradients, FONTS } from "@/lib/theme";
import { TIMEZONE_DATA } from "@/data/timezones";
import type { TimeValue, ColumnCount } from "@/types";

interface TimezoneCardProps {
  zone: string;
  time: TimeValue;
  date: string;
  offset: string;
  dst: boolean;
  index: number;
  isMobile: boolean;
  columns: ColumnCount;
  onMinuteDelta: (delta: number) => void;
  onDirectSet: (hour: number, minute: number) => void;
  onZoneChange: (zone: string) => void;
}

export default function TimezoneCard({
  zone,
  time,
  date,
  offset,
  dst,
  index,
  isMobile,
  columns,
  onMinuteDelta,
  onDirectSet,
  onZoneChange,
}: TimezoneCardProps) {
  const { hour, minute } = time;
  const tod = getTimeOfDay(hour);
  const colors = getCardColors(tod);
  const scrims = getScrimGradients(tod);
  const [pickerOpen, setPickerOpen] = useState(false);
  const cityData = TIMEZONE_DATA.find((z) => z.value === zone);

  const cityFS = isMobile ? (columns >= 4 ? 10 : 12) : 14;
  const padOuter = isMobile
    ? columns >= 4
      ? "6px 6px 4px"
      : columns === 3
      ? "8px 8px 6px"
      : "12px 12px 8px"
    : "22px 20px 16px";

  return (
    <div
      style={{
        position: "relative",
        borderRadius: isMobile ? 18 : 24,
        overflow: "hidden",
        flex: 1,
        minHeight: 0,
        boxShadow:
          "0 6px 32px rgba(0,0,0,0.1),0 2px 6px rgba(0,0,0,0.05)",
        animation: `cardIn 0.6s ${index * 0.08}s cubic-bezier(0.34,1.56,0.64,1) both`,
      }}
    >
      {/* Sky background */}
      <SkyScene hour={hour} minute={minute} />

      {/* ── Top scrim: darkens behind city/offset info ── */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "40%",
          background: scrims.top,
          zIndex: 3,
          pointerEvents: "none",
          borderRadius: "inherit",
        }}
      />

      {/* ── Bottom scrim: darkens behind date pill ── */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "35%",
          background: scrims.bottom,
          zIndex: 3,
          pointerEvents: "none",
          borderRadius: "inherit",
        }}
      />

      {/* ── Content layer ── */}
      <div
        style={{
          position: "relative",
          zIndex: 5,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: padOuter,
        }}
      >
        {/* Top section: City + Offset + DST */}
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              flexWrap: "nowrap",
            }}
          >
            <button
              onClick={() => setPickerOpen(true)}
              style={{
                background: colors.pillBg,
                border: `1px solid ${colors.pillBorder}`,
                borderRadius: isMobile ? 10 : 14,
                padding: isMobile ? "3px 8px" : "6px 12px",
                color: colors.text,
                fontSize: cityFS,
                fontFamily: FONTS.sans,
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 4,
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                transition: "all 0.3s",
                maxWidth: "60%",
                overflow: "hidden",
                textShadow: colors.textShadow,
              }}
            >
              <span
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {cityData?.label || zone}
              </span>
              <svg
                width="10"
                height="10"
                viewBox="0 0 12 12"
                fill="none"
                style={{ flexShrink: 0, opacity: 0.6 }}
              >
                <path
                  d="M2.5 4.5L6 8L9.5 4.5"
                  stroke={colors.text}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <span
              style={{
                fontSize: isMobile ? (columns >= 4 ? 7 : 8) : 11,
                color: colors.subtext,
                fontFamily: FONTS.mono,
                fontWeight: 500,
                whiteSpace: "nowrap",
                flexShrink: 0,
                textShadow: colors.textShadow,
              }}
            >
              {offset}
            </span>

            {dst && (
              <span
                style={{
                  fontSize: isMobile ? 6 : 9,
                  color: colors.dstColor,
                  fontWeight: 600,
                  background: colors.dstBg,
                  padding: "1px 4px",
                  borderRadius: 4,
                  fontFamily: FONTS.sans,
                  flexShrink: 0,
                  textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                }}
              >
                DST
              </span>
            )}
          </div>

          {/* Country */}
          {cityData?.country && (
            <div
              style={{
                fontSize: isMobile ? (columns >= 4 ? 8 : 9) : 11,
                color: colors.subtext,
                fontFamily: FONTS.sans,
                fontWeight: 400,
                marginTop: isMobile ? 1 : 2,
                paddingLeft: isMobile ? 2 : 4,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                textShadow: colors.textShadow,
              }}
            >
              {cityData.country}
            </div>
          )}
        </div>

        {/* Center section: Time */}
        <TimeDisplay
          hour={hour}
          minute={minute}
          onMinuteDelta={onMinuteDelta}
          onDirectSet={onDirectSet}
          isMobile={isMobile}
          columns={columns}
        />

        {/* Bottom section: Date */}
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontSize: isMobile ? (columns >= 4 ? 8 : 9) : 12,
              fontFamily: FONTS.sans,
              fontWeight: 500,
              color: colors.subtext,
              background: colors.pillBg,
              display: "inline-block",
              padding: isMobile ? "2px 8px" : "4px 14px",
              borderRadius: isMobile ? 7 : 11,
              border: `1px solid ${colors.pillBorder}`,
              backdropFilter: "blur(8px)",
              letterSpacing: "0.3px",
              textShadow: colors.textShadow,
            }}
          >
            {date}
          </div>
        </div>
      </div>

      {/* Picker modal */}
      <TimezonePicker
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={onZoneChange}
        currentZone={zone}
        isMobile={isMobile}
      />
    </div>
  );
}
