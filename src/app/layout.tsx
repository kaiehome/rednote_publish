import type { Metadata } from "next";
import React from "react";
import "./globals.css";

// 抑制 Ant Design React 兼容性警告
if (typeof window !== 'undefined') {
  const originalError = console.error;
  const originalWarn = console.warn;
  
  console.error = (...args: any[]) => {
    const message = args[0];
    if (
      message && 
      typeof message === 'string' && 
      (message.includes('[antd: compatible]') ||
       message.includes('antd v5 support React is 16 ~ 18') ||
       message.includes('Warning: [antd: compatible]'))
    ) {
      return;
    }
    originalError.apply(console, args);
  };

  console.warn = (...args: any[]) => {
    const message = args[0];
    if (
      message && 
      typeof message === 'string' && 
      (message.includes('[antd: compatible]') ||
       message.includes('antd v5 support React is 16 ~ 18') ||
       message.includes('Warning: [antd: compatible]'))
    ) {
      return;
    }
    originalWarn.apply(console, args);
  };
}

// 在全局范围内抑制 Ant Design 警告
if (typeof globalThis !== 'undefined') {
  const originalConsoleError = globalThis.console?.error;
  if (originalConsoleError) {
    globalThis.console.error = (...args: any[]) => {
      const message = args[0];
      if (
        message && 
        typeof message === 'string' && 
        (message.includes('[antd: compatible]') ||
         message.includes('antd v5 support React is 16 ~ 18'))
      ) {
        return;
      }
      originalConsoleError.apply(globalThis.console, args);
    };
  }
}

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
