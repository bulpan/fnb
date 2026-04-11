import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://fnb.gongsangplanet.com"),
  title: "성공한 F&B브랜드가 선택한 공간디자인 스튜디오",
  description: "브랜드와 매출을 만드는 F&B 공간 디자인 스튜디오 - 공상플래닛",
  openGraph: {
    title: "성공한 F&B브랜드가 선택한 공간디자인 스튜디오",
    description: "브랜드와 매출을 만드는 F&B 공간 디자인 스튜디오 - 공상플래닛",
    url: "https://fnb.gongsangplanet.com",
    siteName: "공상플래닛",
    images: [
      {
        url: "https://fnb.gongsangplanet.com/fnb/images/compressed/hero/main-entry-dowon.webp",
        width: 1200,
        height: 630,
        alt: "도원 스타일 입구 전경",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "성공한 F&B브랜드가 선택한 공간디자인 스튜디오",
    description: "브랜드와 매출을 만드는 F&B 공간 디자인 스튜디오 - 공상플래닛",
    images: ["https://fnb.gongsangplanet.com/fnb/images/compressed/hero/main-entry-dowon.webp"],
  },
  icons: {
    icon: "/fnb/g-logo.svg",
    shortcut: "/fnb/g-logo.svg",
    apple: "/fnb/g-logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
