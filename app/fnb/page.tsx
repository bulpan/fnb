import PcPage from './PcPage';
import MobilePage from './MobilePage';

export default function FnbPage() {
    return (
        <>
            {/* PC: md(768px) 이상에서 표시 */}
            <div className="hidden md:block">
                <PcPage />
            </div>
            {/* Mobile: md(768px) 미만에서 표시 */}
            <div className="block md:hidden">
                <MobilePage />
            </div>
        </>
    );
}
