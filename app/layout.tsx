import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://calibg.github.io/dengguang/";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const publicAsset = (path: string) => new URL(`${basePath}${path}`, siteUrl).toString();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "杨子硕 — 作品集",
    template: "%s — 杨子硕",
  },
  description:
    "杨子硕的作品集网站。首页是一盏可以拉动的吊灯——向下滚动，灯光会照亮整间屋子与作品。",
  icons: {
    icon: `${basePath}/favicon.png`,
    shortcut: `${basePath}/favicon.png`,
  },
  openGraph: {
    title: "杨子硕 — 作品集",
    description: "光亮起的地方，就是作品的入口。",
    type: "website",
    url: siteUrl,
    images: [{ url: publicAsset("/og.jpg"), width: 1200, height: 630, alt: "一盏吊灯照亮杨子硕的作品集首页。" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "杨子硕 — 作品集",
    description: "光亮起的地方，就是作品的入口。",
    images: [publicAsset("/og.jpg")],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
