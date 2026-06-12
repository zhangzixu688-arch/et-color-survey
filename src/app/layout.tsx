import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Noto_Sans_SC } from "next/font/google";
import "./globals.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const notoSansSc = Noto_Sans_SC({ variable: "--font-noto-sc", subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: "车色偏好调研问卷 | ET Color Preference Survey",
  description: "探索六种车身色彩，分享你的第一印象、购买偏好与价值判断。Explore six body colors and share your first impression, purchase preference, and value judgment.",
};

export const viewport: Viewport = { themeColor: "#05070a", colorScheme: "dark" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" data-scroll-behavior="smooth">
      <body className={`${geist.variable} ${geistMono.variable} ${notoSansSc.variable}`}>{children}</body>
    </html>
  );
}
