import {
  SKY_GRADIENTS,
  getCardColors,
  getScrimGradients,
  FONTS,
} from "@/lib/theme";
import type { TimeOfDay } from "@/types";

const ALL_TIMES: TimeOfDay[] = ["dawn", "day", "dusk", "night"];

describe("SKY_GRADIENTS", () => {
  test("has a gradient for each time of day", () => {
    ALL_TIMES.forEach((tod) => {
      expect(SKY_GRADIENTS[tod]).toBeDefined();
      expect(SKY_GRADIENTS[tod]).toMatch(/^linear-gradient/);
    });
  });
});

describe("getCardColors", () => {
  test("returns white text for all time-of-day values", () => {
    ALL_TIMES.forEach((tod) => {
      const colors = getCardColors(tod);
      expect(colors.text).toBe("#fff");
    });
  });

  test("returns textShadow for all time-of-day values", () => {
    ALL_TIMES.forEach((tod) => {
      const colors = getCardColors(tod);
      expect(colors.textShadow).toBeDefined();
      expect(colors.textShadow.length).toBeGreaterThan(0);
    });
  });

  test("returns timeShadow for all time-of-day values", () => {
    ALL_TIMES.forEach((tod) => {
      const colors = getCardColors(tod);
      expect(colors.timeShadow).toBeDefined();
      expect(colors.timeShadow.length).toBeGreaterThan(0);
    });
  });

  test("returns consistent colors regardless of time (accessibility fix)", () => {
    const dawn = getCardColors("dawn");
    const day = getCardColors("day");
    const dusk = getCardColors("dusk");
    const night = getCardColors("night");

    expect(dawn.text).toBe(day.text);
    expect(day.text).toBe(dusk.text);
    expect(dusk.text).toBe(night.text);
  });

  test("pill background has opacity for glass effect", () => {
    const colors = getCardColors("day");
    expect(colors.pillBg).toMatch(/rgba/);
  });
});

describe("getScrimGradients", () => {
  test("returns top and bottom scrims for all time-of-day values", () => {
    ALL_TIMES.forEach((tod) => {
      const scrims = getScrimGradients(tod);
      expect(scrims.top).toMatch(/linear-gradient/);
      expect(scrims.bottom).toMatch(/linear-gradient/);
    });
  });

  test("top scrim gradient goes from dark to transparent", () => {
    const scrims = getScrimGradients("day");
    expect(scrims.top).toMatch(/rgba\(0,0,0/);
    expect(scrims.top).toMatch(/transparent/);
  });

  test("bottom scrim gradient goes from transparent to dark", () => {
    const scrims = getScrimGradients("day");
    expect(scrims.bottom).toMatch(/rgba\(0,0,0/);
    expect(scrims.bottom).toMatch(/transparent/);
  });
});

describe("FONTS", () => {
  test("has sans and mono font stacks", () => {
    expect(FONTS.sans).toMatch(/DM Sans/);
    expect(FONTS.mono).toMatch(/DM Mono/);
  });
});
