# Time Zones

Compare 2 to 4 world clocks. Each card shows a live sky that matches the local time. Scroll to adjust. Click to type. All cards stay in sync.

Next.js 14. TypeScript. Zero UI dependencies.

---

### Why this project exists

Most timezone tools show numbers in a table. You read "2:00 AM" and do math in your head.

This app shows you a dark sky with stars for 2:00 AM. A bright sky with sun for 2:00 PM. You look at the card and know the time of day instantly.

---

### Architecture decisions

**One Date object runs everything.** Every card reads from a single `baseDate`. No per-card time state exists. Scroll one card forward 30 minutes and every other card moves 30 minutes too. Sync bugs are impossible because there is nothing to sync.

**One scroll gesture for the whole time display.** I tested separate controls for hours, minutes, and AM/PM. They force a choice: "do I change the hour or the minute?" One unified scroll removes the choice. Each tick moves 5 minutes. Hours and AM/PM roll over on their own.

**No timezone library.** The browser's `Intl.DateTimeFormat` handles DST, UTC offsets, and half-hour zones (India, Nepal, Newfoundland). Adding moment-timezone or luxon would add 40KB for work the browser already does.

**Accessibility on animated backgrounds.** The sky gradient transitions over 2 seconds between states. During the transition, text contrast drops below readable levels. Three layers fix this independently: white text on all backgrounds (no light/dark toggle), text shadows behind every character, and dark scrim overlays behind text zones at the top and bottom of each card.

**Auto-detect user timezone on launch.** The first card defaults to your local timezone using `Intl.DateTimeFormat().resolvedOptions().timeZone`. No geolocation prompt. No configuration step.

---

### Project structure

```
src/
├── types/index.ts              Shared interfaces
├── data/timezones.ts           120+ cities, 40+ countries
├── lib/
│   ├── time-utils.ts           Pure functions: getTimeInZone, isDST, getSunPosition
│   └── theme.ts                Sky gradients, text colors, scrim generators
├── hooks/
│   ├── useLiveClock.ts         Clock state, live/custom mode, scroll and type handlers
│   └── useResponsive.ts        700px breakpoint
├── components/
│   ├── SkyScene.tsx            Sun, moon, 18 stars, clouds, horizon glow
│   ├── TimeDisplay.tsx         Unified scroll and click-to-type editing
│   ├── TimezoneCard.tsx        Composes sky, time, scrims, city info
│   ├── TimezonePicker.tsx      Modal search grouped by region
│   └── Header.tsx              Live toggle, column count selector
└── app/
    ├── page.tsx                Detects user timezone, wires state, renders cards
    ├── layout.tsx              Root layout
    └── globals.css             7 CSS keyframe animations
```

---

### Run the app

```bash
npm install
npm run dev
```

Opens at localhost:3000. First card shows your timezone. The others default to London, Tokyo, Sydney.

Change defaults in `DEFAULT_ZONES` inside `src/app/page.tsx`.

Add a city by appending to `src/data/timezones.ts`:

```typescript
{ label: "Reykjavik", country: "Iceland", value: "Atlantic/Reykjavik", short: "GMT" }
```