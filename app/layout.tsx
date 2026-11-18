import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "InsightIQ — AI Analytics Dashboard",
  description: "Upload your data, visualize it instantly, and ask AI for smart insights.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
