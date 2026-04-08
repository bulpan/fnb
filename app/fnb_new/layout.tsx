import type { Metadata } from "next";
import { Nanum_Myeongjo, Montserrat } from "next/font/google";
import localFont from "next/font/local";

const nanumMyeongjo = Nanum_Myeongjo({
  subsets: ["latin"],
  weight: ["400", "700", "800"],
  variable: "--font-nanum-myeongjo",
  display: "swap",
});

const pretendard = localFont({
  src: "../../public/fnb/fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "600", "800", "900"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "공상플래닛 - F&B 공간 디자인 (New)",
  description: "브랜드와 매출을 만드는 F&B 공간 디자인 포트폴리오 (new ver.)",
};

export default function FnbNewLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={[
        "min-h-screen bg-[#0f1012] text-[#ebe7de] antialiased",
        nanumMyeongjo.variable,
        pretendard.variable,
        montserrat.variable,
        "font-sans selection:bg-white/20",
      ].join(" ")}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
            body { background-color: #0f1012 !important; }
            html { scroll-behavior: smooth; }
            @media (max-width: 767px) {
              #new-contact input,
              #new-contact select,
              #new-contact textarea {
                font-size: 16px !important;
              }
            }
          `,
        }}
      />
      {children}
    </div>
  );
}
