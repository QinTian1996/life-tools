import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "喵十七的工具箱",
  description: "给朋友们的小玩意儿们",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
