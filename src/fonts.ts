import { Montserrat } from "next/font/google";
import localFont from "next/font/local";

// Primary UI font, app-wide — matches Montserrat-Regular.ttf bundled in the
// mobile app (App.tsx). Loaded via next/font/google rather than a copied
// .ttf so we get every weight we need with automatic self-hosting/optimization,
// while staying visually identical (same Google Fonts family).
export const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Scripture/pull-quote font — matches assets/fonts/georgiai.ttf in the mobile
// app, used there only for the Home screen verse-of-the-day. Not a Google
// Fonts family, so it's self-hosted from the actual app asset.
export const georgiaItalic = localFont({
  variable: "--font-georgia-italic",
  src: "./fonts/georgiai.ttf",
  weight: "400",
  style: "italic",
});

// Stopwatch/LCD-style digit font — matches assets/fonts/digital-7.ttf in the
// mobile app (RouteStats timer). Optional use on the site for a stat counter.
export const digital7 = localFont({
  variable: "--font-digital7",
  src: "./fonts/digital-7.ttf",
  weight: "400",
});
