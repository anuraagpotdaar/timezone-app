import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Time Zones — Compare World Clocks",
  description:
    "Beautiful timezone comparison tool. View 2–4 world clocks side by side with live day/night animations, DST detection, and intuitive scroll-to-adjust.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
