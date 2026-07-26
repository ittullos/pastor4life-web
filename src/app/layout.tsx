import type { Metadata } from "next";
import { montserrat, georgiaItalic, digital7 } from "@/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pastor4Life",
  description:
    "A simple, friendly app designed just for pastors who want to stay healthy in body, mind, and spirit.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${georgiaItalic.variable} ${digital7.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
