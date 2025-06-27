import type { Metadata } from "next";
import "./globals.css";
import "./warning-suppressor";

export const metadata: Metadata = {
  title: "小红书矩阵AI运营平台",
  description: "小红书矩阵AI运营平台 - AI内容创作与自动化发布",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="antialiased"
        suppressHydrationWarning
        style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}
      >
        {children}
      </body>
    </html>
  );
}
