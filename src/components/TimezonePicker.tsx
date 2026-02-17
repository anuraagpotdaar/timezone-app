"use client";

import React, { useState, useEffect, useRef } from "react";
import { TIMEZONE_DATA } from "@/data/timezones";
import { FONTS } from "@/lib/theme";

interface TimezonePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (tz: string) => void;
  currentZone: string;
  isMobile: boolean;
}

export default function TimezonePicker({
  isOpen,
  onClose,
  onSelect,
  currentZone,
  isMobile,
}: TimezonePickerProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const lowerQuery = query.toLowerCase();
  const filtered = TIMEZONE_DATA.filter(
    (z) =>
      z.label.toLowerCase().includes(lowerQuery) ||
      z.country.toLowerCase().includes(lowerQuery) ||
      z.value.toLowerCase().includes(lowerQuery)
  );

  // Group by IANA region prefix
  const grouped: Record<string, typeof filtered> = {};
  filtered.forEach((z) => {
    const region = z.value
      .split("/")[0]
      .replace("America", "Americas")
      .replace("Pacific", "Oceania")
      .replace("Australia", "Oceania");
    if (!grouped[region]) grouped[region] = [];
    grouped[region].push(z);
  });

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0,0,0,0.35)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        animation: "overlayIn 0.2s ease",
        padding: isMobile ? 16 : 0,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: 22,
          overflow: "hidden",
          boxShadow:
            "0 24px 80px rgba(0,0,0,0.2),0 8px 24px rgba(0,0,0,0.1)",
          width: isMobile ? "100%" : 380,
          maxWidth: 420,
          maxHeight: isMobile ? "75vh" : 500,
          display: "flex",
          flexDirection: "column",
          animation: "modalIn 0.3s cubic-bezier(0.34,1.56,0.64,1)",
          border: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "16px 20px 12px",
            borderBottom: "1px solid rgba(0,0,0,0.06)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: "#1a1a1a",
              fontFamily: FONTS.sans,
            }}
          >
            Select City
          </span>
          <button
            onClick={onClose}
            style={{
              width: 30,
              height: 30,
              borderRadius: 10,
              border: "1px solid rgba(0,0,0,0.08)",
              background: "rgba(0,0,0,0.03)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#666",
              fontSize: 16,
              fontFamily: "system-ui",
            }}
          >
            ✕
          </button>
        </div>

        {/* Search */}
        <div style={{ padding: "10px 16px 6px", flexShrink: 0 }}>
          <div style={{ position: "relative" }}>
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                opacity: 0.3,
              }}
            >
              <circle cx="11" cy="11" r="7" stroke="#1a1a1a" strokeWidth="2" />
              <path
                d="M16 16L21 21"
                stroke="#1a1a1a"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search city or country..."
              style={{
                width: "100%",
                border: "1px solid rgba(0,0,0,0.1)",
                borderRadius: 12,
                padding: "10px 14px 10px 36px",
                fontSize: 14,
                fontFamily: FONTS.sans,
                outline: "none",
                background: "rgba(0,0,0,0.02)",
                color: "#1a1a1a",
                boxSizing: "border-box",
              }}
            />
          </div>
        </div>

        {/* Results */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "2px 10px 12px",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {Object.entries(grouped).map(([region, cities]) => (
            <div key={region}>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#999",
                  letterSpacing: "0.8px",
                  textTransform: "uppercase",
                  padding: "10px 8px 4px",
                  fontFamily: FONTS.sans,
                }}
              >
                {region}
              </div>
              {cities.map((z) => (
                <button
                  key={`${z.value}-${z.label}`}
                  onClick={() => {
                    onSelect(z.value);
                    onClose();
                  }}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: "100%",
                    padding: "9px 10px",
                    border: "none",
                    borderRadius: 10,
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "background 0.12s",
                    background:
                      z.value === currentZone
                        ? "rgba(0,119,255,0.06)"
                        : "transparent",
                    fontFamily: FONTS.sans,
                  }}
                  onMouseEnter={(e) => {
                    if (z.value !== currentZone)
                      e.currentTarget.style.background = "rgba(0,0,0,0.03)";
                  }}
                  onMouseLeave={(e) => {
                    if (z.value !== currentZone)
                      e.currentTarget.style.background = "transparent";
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: z.value === currentZone ? 600 : 450,
                        color:
                          z.value === currentZone ? "#0077ff" : "#1a1a1a",
                      }}
                    >
                      {z.label}
                    </div>
                    <div style={{ fontSize: 11, color: "#999", marginTop: 1 }}>
                      {z.country}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "#aaa",
                      fontFamily: FONTS.mono,
                      flexShrink: 0,
                      marginLeft: 12,
                    }}
                  >
                    {z.short}
                  </div>
                </button>
              ))}
            </div>
          ))}
          {filtered.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "32px 16px",
                color: "#aaa",
                fontSize: 14,
              }}
            >
              No cities found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
