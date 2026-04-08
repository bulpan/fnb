import type { Metadata } from 'next';
import { Nanum_Myeongjo, Montserrat } from 'next/font/google';
import localFont from 'next/font/local';

const nanumMyeongjo = Nanum_Myeongjo({
    subsets: ['latin'],
    weight: ['400', '700', '800'],
    variable: '--font-nanum-myeongjo',
    display: 'swap',
});

const pretendard = localFont({
    src: '../../public/fnb/fonts/PretendardVariable.woff2',
    display: 'swap',
    weight: '45 920',
    variable: '--font-pretendard',
});

const montserrat = Montserrat({
    subsets: ['latin'],
    weight: ['300', '400', '600', '800', '900'],
    variable: '--font-montserrat',
    display: 'swap',
});

export const metadata: Metadata = {
    title: '공상플래닛 - F&B 공간 디자인',
    description: '프리미엄 공간 디자인 제안서',
};

export default function FnbLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div
            className={`fnb-wrap ${nanumMyeongjo.variable} ${pretendard.variable} ${montserrat.variable} font-sans bg-[#1A1A1A] text-white min-h-screen selection:bg-white/20`}
        >
            <style
                dangerouslySetInnerHTML={{
                    __html: `
                        body { background-color: #1A1A1A !important; }
                        .fnb-wrap, .fnb-wrap * {
                            word-break: keep-all;
                            overflow-wrap: break-word;
                        }
                    `,
                }}
            />
            {children}
        </div>
    );
}
