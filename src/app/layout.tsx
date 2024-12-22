import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "../styles/global.css";
import SessionWrapper from "./components/SessionWrapper";
import RequireAuth from "./components/RequireAuth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pistah",
  description: "Ad Board Aggregator Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className={inter.className}>
        <SessionWrapper>
          <RequireAuth>{children}</RequireAuth>
        </SessionWrapper>
        <SpeedInsights />
      </body>
    </html>
  );
}
