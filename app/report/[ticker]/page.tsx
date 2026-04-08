'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import PrimaryNav from '../../components/primary-nav';

export default function ReportPage() {
    const { ticker } = useParams();
    const router = useRouter();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [showScoreHelp, setShowScoreHelp] = useState(false);

    const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
    const [activeBacktestTip, setActiveBacktestTip] = useState<string | null>(null);
    const [showDetails, setShowDetails] = useState(false);

    const [backtestThresholds, setBacktestThresholds] = useState({
        sharpeStrong: 0.8,
        sharpeOk: 0.5,
        mddWarning: -25,
        mddBad: -35
    });
    const [btSettings, setBtSettings] = useState({
        commissionBps: 5,
        slippageBps: 5,
        wfWindowDays: 180,
        wfStepDays: 60
    });

    const tooltips: any = {
        rsi: {
            title: "RSI (상대강도지수)",
            desc: "주가의 과열/침체를 판단하는 지표입니다.",
            detail: "• 30 이하: 과매도 (공포) → 매수 기회\n• 70 이상: 과매수 (탐욕) → 매도 고려\n• 50: 중립"
        },
        ma: {
            title: "MA Trend (장기 추세)",
            desc: "20일 vs 60일 이평선으로 대세 흐름을 봅니다.",
            detail: "• 정배열 (상승 추세): 주가가 장기적으로 오르는 중\n• 역배열 (하락 추세): 주가가 장기적으로 내리는 중\n* 추세가 좋아도 단기적으론 하락(조정)할 수 있습니다."
        },
        stochastic: {
            title: "Stochastic (스토캐스틱)",
            desc: "주가의 '진짜 바닥'을 찾는 민감한 지표입니다.",
            detail: "• 20 이하: 침체권 (매수 준비)\n• 80 이상: 과열권 (매도 준비)\n• %K가 %D를 상향 돌파 시 매수 신호"
        },
        mfi: {
            title: "MFI (자금 흐름 지표)",
            desc: "거래량(돈)이 실린 진짜 상승인지 판별합니다.",
            detail: "• 20 이하: 자금 이탈 과도 (저점 매수 기회)\n• 80 이상: 자금 유입 과도 (고점 매도 기회)\n• RSI보다 신뢰도가 높습니다."
        },
        macd: {
            title: "MACD (추세전환지표)",
            desc: "장단기 이평선의 수렴/확산을 이용한 추세 지표입니다.",
            detail: "• MACD > Signal: 매수 신호 (상승 반전)\n• MACD < Signal: 매도 신호 (하락 반전)\n• 0선 돌파: 강한 추세 시작"
        },
        bollinger: {
            title: "Bollinger Bands (볼린저 밴드)",
            desc: "주가의 변동성 범위를 나타내는 밴드입니다.",
            detail: "• 하단 터치: 과매도 (반등 확률 높음)\n• 상단 터치: 과매수 (조정 확률 높음)\n• 폭 축소: 조만간 큰 시세 분출 예고"
        }
    };

    useEffect(() => {
        if (!ticker) return;
        fetchData();
    }, [ticker]);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const saved = window.localStorage.getItem('backtestSettings');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed.btSettings) setBtSettings(parsed.btSettings);
                if (parsed.backtestThresholds) setBacktestThresholds(parsed.backtestThresholds);
            } catch { }
        }
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        window.localStorage.setItem('backtestSettings', JSON.stringify({
            btSettings,
            backtestThresholds
        }));
    }, [btSettings, backtestThresholds]);

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setActiveBacktestTip(null);
            }
        };
        const onClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            if (!target.closest('[data-bt-tip]')) {
                setActiveBacktestTip(null);
            }
        };
        document.addEventListener('keydown', onKeyDown);
        document.addEventListener('click', onClick);
        return () => {
            document.removeEventListener('keydown', onKeyDown);
            document.removeEventListener('click', onClick);
        };
    }, []);

    const fetchData = async (forceRefresh = false) => {
        setLoading(true);
        try {
            // Use relative path for proxy support (works on mobile/LAN)
            const params = new URLSearchParams();
            if (forceRefresh) params.set('force_refresh', 'true');
            params.set('commission_bps', String(btSettings.commissionBps));
            params.set('slippage_bps', String(btSettings.slippageBps));
            params.set('wf_window_days', String(btSettings.wfWindowDays));
            params.set('wf_step_days', String(btSettings.wfStepDays));
            const url = `/api/analyze/${ticker}?${params.toString()}`;
            const res = await fetch(url);

            const contentType = res.headers.get("content-type");
            const text = await res.text();

            if (!res.ok) {
                // Handle non-JSON error messages from backend (e.g., "Internal Server Error")
                throw new Error(text || `Server Error (${res.status})`);
            }

            try {
                const json = JSON.parse(text);
                if (json.error) {
                    throw new Error(json.error);
                }
                setData(json);
            } catch (e: any) {
                if (e.message.includes("JSON")) {
                    console.error("JSON Parse Error. Response text:", text);
                    throw new Error(`Invalid JSON response from server. Please try again later.`);
                }
                throw e; // Re-throw actual backend errors
            }
        } catch (e: any) {
            console.error(e);
            alert(`분석 중 오류가 발생했습니다.\n\n${e.message}`);
            router.push('/'); // Go back to home on error
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = () => {
        if (confirm("최신 데이터로 다시 분석하시겠습니까? (시간이 조금 걸릴 수 있습니다)")) {
            fetchData(true);
        }
    };

    const heatClass = (value: number) => {
        if (value >= 10) return "bg-emerald-900/40 text-emerald-200";
        if (value > 0) return "bg-emerald-900/20 text-emerald-100";
        if (value <= -10) return "bg-rose-900/40 text-rose-200";
        if (value < 0) return "bg-rose-900/20 text-rose-100";
        return "bg-gray-800 text-gray-300";
    };

    const formatCompactDate = (value?: string | null) => {
        if (!value) return '-';
        if (value.length === 8) {
            return `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`;
        }
        return value.slice(0, 10);
    };

    // Initial Loading State (No data yet)
    if (!data && loading) return (
        <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
            <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
                <div className="text-xl font-bold animate-pulse">AI 분석 시스템 초기화 중...</div>
            </div>
        </div>
    );

    // Error State
    if (!data && !loading) return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Failed to load data. Please check the ticker.</div>;

    const getActionColor = (action: string) => {
        if (action.includes("강력 매수")) return "text-emerald-400";
        if (action.includes("매수") && !action.includes("매도")) return "text-blue-400"; // Buy but not Sell
        if (action.includes("관망") || action.includes("보유")) return "text-yellow-400";
        return "text-red-400";
    }

    const totalScore = data?.total_score ?? 0;
    const riskLevel = data?.bottleneck?.risk_level ?? "중간";
    const techScore = data?.technical_analysis?.summary?.score ?? 0;
    const rsi = data?.technical_analysis?.rsi ?? 50;
    const trendUp = (data?.technical_analysis?.trend ?? "").includes("상승");
    const stabilityScore = data?.stability?.score ?? 0;
    const sentimentScore = data?.sentiment_analysis?.score ?? 50;
    const growthProfile = data?.growth_profile ?? {};
    const growthFit = growthProfile?.strategy_fit ?? {};
    const growthTags = [
        growthFit.monthly_growth ? "월간 성장 전략 적합" : null,
        growthFit.long_term ? "중장기 적합" : null,
        growthFit.short_term ? "단기 대응 가능" : null,
    ].filter((value): value is string => Boolean(value));

    const sellPressure = riskLevel === "높음" || totalScore < 50 || techScore <= -2;
    const buyBias = totalScore >= 65 && riskLevel !== "높음";
    const longTermBuy = totalScore >= 70 && stabilityScore >= 70 && riskLevel !== "높음";
    const shortTermBuy = techScore >= 2 && trendUp && riskLevel !== "높음" && rsi < 70;

    const holdingAction = sellPressure
        ? "보유 비중 축소 또는 손절 기준 재설정"
        : buyBias
            ? "보유 유지, 급등일 추격매수 금지"
            : "중립 보유, 신규 확대는 보류";

    const newBuyAction = sellPressure
        ? "신규 매수 보류"
        : growthProfile?.action || (buyBias ? "조정 시 분할 매수 가능" : "신규 매수 보류");

    const shortTermAction = shortTermBuy
        ? "단타 진입 가능 (기술 신호 우위)"
        : growthFit.short_term
            ? "단타는 가능하나 눌림 확인 후 접근"
            : "단타 관망";

    const longTermAction = longTermBuy
        ? "장기 분할 매수 가능"
        : growthFit.long_term
            ? "장기 관점 추적 가능, 진입은 분할 접근"
            : "장기 신규 진입 보수적 접근";

    const growthConfidenceColor =
        growthProfile?.confidence === 'high'
            ? 'text-emerald-300 border-emerald-500/30 bg-emerald-500/10'
            : growthProfile?.confidence === 'medium'
                ? 'text-amber-300 border-amber-500/30 bg-amber-500/10'
                : 'text-gray-300 border-gray-700 bg-gray-900/60';
    const growthLongTermLabel = growthProfile?.basis === 'quarterly' ? 'TTM 성장률' : '장기 CAGR';
    const growthLongTermValue = typeof growthProfile?.ttm_growth === 'number'
        ? growthProfile.ttm_growth
        : growthProfile?.cagr;

    return (
        <main className="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-8">
            <div className="max-w-4xl mx-auto space-y-4 md:space-y-8">
                <PrimaryNav />

                {/* Nav */}
                <div className="flex justify-between items-center">
                    <Link href="/" className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 font-bold text-sm md:text-base">
                        ← Back to Dashboard
                    </Link>
                    <Link
                        href="/growth"
                        className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-200 transition-colors hover:border-emerald-400/60 hover:text-white"
                    >
                        성장형 전략 보기
                    </Link>
                </div>

                {/* Header */}
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-700 pb-4 md:pb-6 gap-4 border-gray-700">
                    <div>
                        <div className="flex flex-col gap-1">
                            <h1 className="text-2xl md:text-3xl font-bold flex items-baseline gap-2 flex-wrap">
                                {data.company_name}
                                <span className="text-gray-500 text-lg md:text-xl font-normal">({ticker})</span>
                            </h1>
                            {data.price && (
                                <div className="flex items-center gap-3 mt-1">
                                    <span className="text-white font-bold text-2xl md:text-3xl tracking-tight">{data.price.current.toLocaleString()}원</span>
                                    <span className={`text-sm md:text-base font-bold flex items-center gap-1 px-2 py-0.5 rounded-md ${data.price.change > 0 ? 'bg-red-900/30 text-red-400' : data.price.change < 0 ? 'bg-blue-900/30 text-blue-400' : 'bg-gray-800 text-gray-400'}`}>
                                        <span>{data.price.change > 0 ? "▲" : "▼"}</span>
                                        <span>{Math.abs(data.price.change_rate)}%</span>
                                    </span>
                                </div>
                            )}
                        </div>
                        <p className="text-gray-400 mt-1 text-xs md:text-base">Generated by Senior Quant AI</p>
                    </div>
                    <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                        <button
                            onClick={handleRefresh}
                            className="bg-gray-800 hover:bg-gray-700 text-blue-400 px-3 py-1.5 md:px-4 md:py-2 rounded-lg border border-gray-600 transition-colors flex items-center gap-2 text-xs md:text-sm font-bold"
                            disabled={loading}
                        >
                            🔄 재분석 (Refresh)
                        </button>
                        <div className="text-right">
                            <div className="text-xs md:text-sm text-gray-400 flex items-center justify-end gap-1">
                                종합 평가 점수
                                <button onClick={() => setShowScoreHelp(true)} className="text-gray-500 hover:text-white rounded-full border border-gray-600 w-4 h-4 flex items-center justify-center text-xs">?</button>
                            </div>
                            <div className="text-2xl md:text-4xl font-black text-white">{data.total_score.toFixed(1)}</div>
                        </div>
                    </div>
                </header>

                {/* Primary Growth & Action Spotlight */}
                <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-xl border border-gray-700 p-5 md:p-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-cyan-500 to-purple-500"></div>

                    <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-3">
                                <div className="text-xs uppercase tracking-[0.28em] text-emerald-400 font-bold">Growth Insight</div>
                                <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold ${growthConfidenceColor}`}>
                                    <span>{growthProfile?.label || '분류 보류'}</span>
                                </div>
                            </div>

                            <h2 className="mt-4 text-2xl md:text-4xl font-black leading-tight text-white flex items-center gap-3">
                                <span className={getActionColor(growthProfile?.action || data.summary.action)}>
                                    {growthProfile?.action || data.summary.action}
                                </span>
                            </h2>
                            <p className="mt-3 text-base md:text-lg text-gray-300 font-medium">
                                {growthProfile?.summary}
                            </p>

                            {/* Key Reasons Checklist */}
                            <div className="mt-5 space-y-2">
                                {(growthProfile?.reasons || []).map((reason: string, idx: number) => (
                                    <div key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                                        <span className="text-emerald-500 mt-0.5">✓</span>
                                        <span>{reason}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Quick Metrics */}
                        <div className="flex md:flex-col gap-3 min-w-[200px]">
                            <div className="flex-1 rounded-xl border border-gray-700/50 bg-gray-900/80 p-4 text-center md:text-right">
                                <div className="text-xs text-gray-500 whitespace-nowrap">최근 분기 (YoY)</div>
                                <div className="mt-1 text-2xl md:text-3xl font-black text-emerald-400">
                                    {typeof growthProfile?.latest_growth === 'number' ? `${growthProfile.latest_growth.toFixed(1)}%` : '-'}
                                </div>
                            </div>
                            <div className="flex-1 rounded-xl border border-gray-700/50 bg-gray-900/80 p-4 text-center md:text-right">
                                <div className="text-xs text-gray-500 whitespace-nowrap">{growthLongTermLabel}</div>
                                <div className="mt-1 text-2xl md:text-3xl font-black text-cyan-400">
                                    {typeof growthLongTermValue === 'number' ? `${growthLongTermValue.toFixed(1)}%` : '-'}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Main Rating (Comprehensive Action) */}
                <section className="bg-gray-800 rounded-xl p-4 md:p-8 border border-gray-700 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
                    <h2 className="text-sm md:text-xl text-gray-400 mb-2 md:mb-4">AI Investment Verdict (종합 판단)</h2>

                    {/* Main Big Text */}
                    <div className={`text-2xl md:text-4xl font-black leading-tight ${getActionColor(data.summary.action)}`}>
                        {data.summary.action}
                    </div>

                    {/* Subtext (Legacy Rating) */}
                    <div className="mt-3 text-sm md:text-base text-gray-500 bg-gray-900/50 inline-block px-4 py-1 rounded-full border border-gray-700">
                        기본 등급: {data.rating}
                    </div>

                    {/* Score Breakdown (Transparency) */}
                    {data.final_rating?.breakdown && (
                        <div className="mt-6 p-4 bg-gray-900/60 rounded-lg border border-gray-700/50 text-left mx-auto max-w-md">
                            <h4 className="text-xs md:text-sm font-bold mb-3 text-gray-300 flex items-center gap-2">
                                <span>💯</span>
                                <span>점수 계산 과정</span>
                            </h4>
                            <div className="space-y-2">
                                {data.final_rating.breakdown.map((item: any, idx: number) => (
                                    <div key={idx} className="flex justify-between items-center text-xs md:text-sm">
                                        <span className="text-gray-400">{item.category}:</span>
                                        <span className="font-mono text-gray-200">
                                            <span className="text-blue-400">{item.score}점</span>
                                            <span className="text-gray-500 mx-1">×</span>
                                            <span className="text-purple-400">{item.weight}%</span>
                                            <span className="text-gray-500 mx-1">=</span>
                                            <span className="text-emerald-400 font-bold">{item.weighted}점</span>
                                        </span>
                                    </div>
                                ))}
                                <div className="border-t border-gray-700 pt-2 mt-2 flex justify-between font-bold text-sm md:text-base">
                                    <span className="text-gray-300">총점:</span>
                                    <span className="text-yellow-400">{data.total_score.toFixed(1)}점</span>
                                </div>
                            </div>
                        </div>
                    )}
                </section>

                {/* Decision Summary */}
                <section className="bg-gray-800 rounded-xl p-4 md:p-6 border border-gray-700">
                    <h3 className="text-base md:text-xl font-bold mb-3">실전 매매 의사결정 요약</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="bg-gray-900/60 border border-gray-700 rounded-lg p-3">
                            <div className="text-xs text-gray-400 mb-1">보유 중이라면</div>
                            <div className="font-bold text-gray-100">{holdingAction}</div>
                        </div>
                        <div className="bg-gray-900/60 border border-gray-700 rounded-lg p-3">
                            <div className="text-xs text-gray-400 mb-1">지금 사고 싶다면</div>
                            <div className="font-bold text-gray-100">{newBuyAction}</div>
                        </div>
                        <div className="bg-gray-900/60 border border-gray-700 rounded-lg p-3">
                            <div className="text-xs text-gray-400 mb-1">단타 관점</div>
                            <div className="font-bold text-gray-100">{shortTermAction}</div>
                        </div>
                        <div className="bg-gray-900/60 border border-gray-700 rounded-lg p-3">
                            <div className="text-xs text-gray-400 mb-1">중장기 관점</div>
                            <div className="font-bold text-gray-100">{longTermAction}</div>
                        </div>
                    </div>

                    <div className="mt-4 bg-gray-900/50 border border-gray-700 rounded-lg p-3 text-xs md:text-sm text-gray-300 space-y-1">
                        <div>매수 체크: 총점 {totalScore.toFixed(1)}점 / 리스크 {riskLevel} / 기술점수 {techScore}</div>
                        <div>매도 체크: 기술점수 -2 이하, 리스크 높음, 총점 50 미만 중 1개라도 충족 시 보수적으로 대응</div>
                        <div>참고 지표: RSI {rsi}, 재무안정성 {stabilityScore}, 뉴스감성 {sentimentScore}</div>
                    </div>
                </section>

                <div className="flex justify-end">
                    <button
                        onClick={() => setShowDetails((prev) => !prev)}
                        className="text-xs md:text-sm px-3 py-1.5 rounded-lg border border-gray-600 text-gray-300 hover:text-white hover:border-gray-500"
                    >
                        {showDetails ? "상세 근거 숨기기" : "상세 근거 보기"}
                    </button>
                </div>

                {showDetails && (
                    <>
                        {/* Strategy Backtest & Regime */}
                        <section className="bg-gray-800 p-4 md:p-5 rounded-lg border border-gray-700">
                            <h3 className="text-base md:text-xl font-bold mb-4 flex items-center justify-between">
                                <span className="flex items-center gap-2">
                                    <span>전략 백테스트</span>
                                </span>
                                {data.backtest?.period_start && data.backtest?.period_end && (
                                    <span className="text-xs text-gray-400 font-normal">
                                        {data.backtest.period_start} ~ {data.backtest.period_end}
                                    </span>
                                )}
                            </h3>

                            <details className="group mb-4">
                                <summary className="text-blue-400 text-xs md:text-sm cursor-pointer hover:text-blue-300 flex items-center gap-2">
                                    💡 백테스트가 뭔가요? (지표 설명)
                                    <svg className="w-4 h-4 transform transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </summary>
                                <div className="text-gray-400 text-xs md:text-sm mt-2 pl-4 border-l-2 border-blue-500/30 space-y-2">
                                    <p><strong>백테스트</strong>는 과거 데이터로 "이 전략을 썼다면 성과가 어땠는지"를 시뮬레이션한 결과입니다. 미래 보장은 아니며, 참고용입니다.</p>
                                    <p><strong>Total</strong>: 전체 누적 수익률 (전체 기간 동안 얼마나 올랐는지)</p>
                                    <p><strong>CAGR</strong>: 연복리 수익률 (기간이 길어도 비교 가능한 연환산 수익)</p>
                                    <p><strong>MDD</strong>: 최대 낙폭 (가장 크게 떨어진 구간, 리스크 지표)</p>
                                    <p><strong>Sharpe</strong>: 위험 대비 효율 (수익이 변동성 대비 얼마나 안정적인지)</p>
                                    <p><strong>Regime</strong>: 현재 시장 국면 (추세/횡보 + 변동성 수준)</p>
                                    <p><strong>Position Sizing</strong>: 손절 기준과 리스크 비중으로 계산한 권장 보유 수량</p>
                                </div>
                            </details>

                            {data.backtest?.error ? (
                                <div className="text-gray-500 text-sm">백테스트 데이터 부족</div>
                            ) : (
                                <div className="space-y-4">
                                    {/* Simple Backtest Summary */}
                                    {data.backtest?.strategies?.length > 0 && (() => {
                                        const sortedBySharpe = [...data.backtest.strategies].sort((a: any, b: any) => (b.metrics?.sharpe ?? 0) - (a.metrics?.sharpe ?? 0));
                                        const best = sortedBySharpe[0];
                                        const metrics = best?.metrics || {};
                                        const total = metrics.total_return ?? 0;
                                        const sharpe = metrics.sharpe ?? 0;
                                        const mdd = metrics.max_drawdown ?? 0;
                                        const tone =
                                            total > 0 && sharpe >= backtestThresholds.sharpeOk && mdd > backtestThresholds.mddWarning ? "우호적" :
                                                total <= 0 || mdd <= backtestThresholds.mddBad ? "보수적" : "중립적";
                                        const toneColor =
                                            tone === "우호적" ? "text-emerald-300" :
                                                tone === "보수적" ? "text-amber-300" : "text-gray-300";
                                        return (
                                            <div className="bg-gradient-to-r from-gray-900/80 via-gray-900/60 to-gray-900/80 p-3 md:p-4 rounded-lg border border-gray-700 text-sm text-gray-300">
                                                <div className="font-bold text-gray-200 mb-1 flex items-center gap-2">
                                                    전문 요약
                                                    <span className="text-[10px] px-2 py-0.5 rounded-full border border-gray-600 text-gray-400">
                                                        과거 데이터 기반 참고
                                                    </span>
                                                </div>
                                                <div>
                                                    샤프 지표 기준으로 가장 효율적이었던 전략은 <strong className="text-blue-300">{best.label}</strong>입니다.
                                                    누적 수익률 <strong className="text-emerald-300">{metrics.total_return ?? 0}%</strong>,
                                                    연복리 <strong className="text-emerald-300">{metrics.cagr ?? 0}%</strong>,
                                                    최대 낙폭 <strong className="text-rose-300">{metrics.max_drawdown ?? 0}%</strong>로 요약됩니다.
                                                    종합 해석은 <strong className={toneColor}>{tone}</strong>하게 접근하는 것이 합리적입니다.
                                                </div>
                                            </div>
                                        );
                                    })()}
                                    <div className="bg-gray-900/60 p-3 md:p-4 rounded-lg border border-gray-700">
                                        <div className="text-xs text-gray-500 mb-2">판단 기준 조정 (슬라이더)</div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                                            <label className="flex flex-col gap-1">
                                                <span className="text-gray-400">Sharpe 기준: {backtestThresholds.sharpeOk.toFixed(2)}</span>
                                                <input
                                                    type="range"
                                                    min="0.2"
                                                    max="1.5"
                                                    step="0.05"
                                                    value={backtestThresholds.sharpeOk}
                                                    onChange={(e) => setBacktestThresholds((prev) => ({ ...prev, sharpeOk: parseFloat(e.target.value) }))}
                                                />
                                            </label>
                                            <label className="flex flex-col gap-1">
                                                <span className="text-gray-400">MDD 경고: {backtestThresholds.mddWarning}%</span>
                                                <input
                                                    type="range"
                                                    min="-40"
                                                    max="-10"
                                                    step="1"
                                                    value={backtestThresholds.mddWarning}
                                                    onChange={(e) => setBacktestThresholds((prev) => ({ ...prev, mddWarning: parseFloat(e.target.value) }))}
                                                />
                                            </label>
                                            <label className="flex flex-col gap-1">
                                                <span className="text-gray-400">MDD 배제: {backtestThresholds.mddBad}%</span>
                                                <input
                                                    type="range"
                                                    min="-60"
                                                    max="-20"
                                                    step="1"
                                                    value={backtestThresholds.mddBad}
                                                    onChange={(e) => setBacktestThresholds((prev) => ({ ...prev, mddBad: parseFloat(e.target.value) }))}
                                                />
                                            </label>
                                        </div>
                                        <div className="text-[11px] text-gray-500 mt-2">
                                            슬라이더 값은 추천/보류/배제 판단과 요약 톤에 즉시 반영됩니다.
                                        </div>
                                    </div>

                                    <div className="bg-gray-900/60 p-3 md:p-4 rounded-lg border border-gray-700">
                                        <div className="text-xs text-gray-500 mb-2 flex items-center gap-2">
                                            백테스트 설정 (거래비용/워크포워드)
                                            <span className="text-[10px] px-2 py-0.5 rounded-full border border-gray-600 text-gray-400">
                                                실제 매매에 가까운 보정
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                                            <label className="flex flex-col gap-1">
                                                <span className="text-gray-400">수수료(왕복) {btSettings.commissionBps} bps</span>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="30"
                                                    step="1"
                                                    value={btSettings.commissionBps}
                                                    onChange={(e) => setBtSettings((prev) => ({ ...prev, commissionBps: parseInt(e.target.value, 10) }))}
                                                />
                                                <span className="text-[11px] text-gray-500">
                                                    거래 시 발생하는 수수료 비용(1bp=0.01%)
                                                </span>
                                            </label>
                                            <label className="flex flex-col gap-1">
                                                <span className="text-gray-400">슬리피지(왕복) {btSettings.slippageBps} bps</span>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="30"
                                                    step="1"
                                                    value={btSettings.slippageBps}
                                                    onChange={(e) => setBtSettings((prev) => ({ ...prev, slippageBps: parseInt(e.target.value, 10) }))}
                                                />
                                                <span className="text-[11px] text-gray-500">
                                                    체결가가 예상보다 불리하게 미끄러지는 비용
                                                </span>
                                            </label>
                                            <label className="flex flex-col gap-1">
                                                <span className="text-gray-400">워크포워드 창 {btSettings.wfWindowDays}일</span>
                                                <input
                                                    type="range"
                                                    min="90"
                                                    max="365"
                                                    step="30"
                                                    value={btSettings.wfWindowDays}
                                                    onChange={(e) => setBtSettings((prev) => ({ ...prev, wfWindowDays: parseInt(e.target.value, 10) }))}
                                                />
                                                <span className="text-[11px] text-gray-500">
                                                    한 구간 길이(길수록 안정성 확인, 짧을수록 민감)
                                                </span>
                                            </label>
                                            <label className="flex flex-col gap-1">
                                                <span className="text-gray-400">워크포워드 이동 {btSettings.wfStepDays}일</span>
                                                <input
                                                    type="range"
                                                    min="30"
                                                    max="180"
                                                    step="30"
                                                    value={btSettings.wfStepDays}
                                                    onChange={(e) => setBtSettings((prev) => ({ ...prev, wfStepDays: parseInt(e.target.value, 10) }))}
                                                />
                                                <span className="text-[11px] text-gray-500">
                                                    다음 구간 이동 폭(작을수록 촘촘한 검사)
                                                </span>
                                            </label>
                                        </div>
                                        <div className="flex items-center justify-between mt-3">
                                            <div className="text-[11px] text-gray-500">
                                                설정을 바꾸면 백테스트를 다시 계산해야 합니다.
                                            </div>
                                            <button
                                                onClick={() => fetchData(true)}
                                                className="text-xs px-3 py-1.5 rounded-lg border border-gray-600 text-blue-300 hover:text-white hover:border-gray-500"
                                            >
                                                설정 적용
                                            </button>
                                        </div>
                                    </div>

                                    {/* Walk-forward stability */}
                                    {data.backtest?.walk_forward?.windows?.length > 0 && (() => {
                                        const windows = data.backtest.walk_forward.windows;
                                        const bestBySharpe = [...data.backtest.strategies].sort((a: any, b: any) => (b.metrics?.sharpe ?? 0) - (a.metrics?.sharpe ?? 0));
                                        const bestKey = bestBySharpe?.[0]?.key;
                                        const winRates = windows.map((w: any) => {
                                            const s = w.strategies.find((x: any) => x.key === bestKey);
                                            return s?.metrics?.total_return ?? 0;
                                        });
                                        const positive = winRates.filter((v: number) => v > 0).length;
                                        const stability = Math.round((positive / winRates.length) * 100);
                                        const strategyStability = data.backtest.strategies.map((s: any) => {
                                            const vals = windows.map((w: any) => {
                                                const r = w.strategies.find((x: any) => x.key === s.key);
                                                return r?.metrics?.total_return ?? 0;
                                            });
                                            const pos = vals.filter((v: number) => v > 0).length;
                                            return {
                                                key: s.key,
                                                label: s.label,
                                                stability: Math.round((pos / vals.length) * 100)
                                            };
                                        });
                                        return (
                                            <div className="bg-gray-900/60 p-3 md:p-4 rounded-lg border border-gray-700">
                                                <div className="text-xs text-gray-500 mb-1">워크포워드 안정성</div>
                                                <div className="text-sm md:text-base font-bold text-gray-200">
                                                    {stability}% 구간에서 플러스 수익
                                                </div>
                                                <div className="text-[11px] text-gray-500 mt-1">
                                                    기간별로 전략 성과가 얼마나 일관되게 유지되는지 보여줍니다.
                                                </div>
                                                <div className="mt-3 space-y-2">
                                                    <div className="text-[11px] text-gray-500">전략별 안정성 비교</div>
                                                    {strategyStability.map((s: any) => (
                                                        <div key={s.key} className="flex items-center gap-2">
                                                            <div className="w-28 text-[11px] text-gray-400">{s.label}</div>
                                                            <div className="flex-1 h-2 bg-gray-800 rounded">
                                                                <div
                                                                    className="h-2 bg-blue-500 rounded"
                                                                    style={{ width: `${s.stability}%` }}
                                                                ></div>
                                                            </div>
                                                            <div className="w-10 text-[11px] text-gray-300 text-right">{s.stability}%</div>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className="mt-3 overflow-x-auto">
                                                    <table className="w-full text-[11px] border border-gray-700 rounded-lg overflow-hidden">
                                                        <thead className="bg-gray-900/70">
                                                            <tr>
                                                                <th className="text-left p-2 text-gray-400">구간</th>
                                                                <th className="text-right p-2 text-gray-400">Total</th>
                                                                <th className="text-right p-2 text-gray-400">CAGR</th>
                                                                <th className="text-right p-2 text-gray-400">MDD</th>
                                                                <th className="text-right p-2 text-gray-400">Sharpe</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {windows.map((w: any, i: number) => {
                                                                const s = w.strategies.find((x: any) => x.key === bestKey);
                                                                const m = s?.metrics || {};
                                                                return (
                                                                    <tr key={i} className="border-t border-gray-700">
                                                                        <td className="p-2 text-gray-300">{w.period_start} ~ {w.period_end}</td>
                                                                        <td className={`p-2 text-right ${heatClass(m.total_return ?? 0)}`}>{m.total_return ?? 0}%</td>
                                                                        <td className={`p-2 text-right ${heatClass(m.cagr ?? 0)}`}>{m.cagr ?? 0}%</td>
                                                                        <td className={`p-2 text-right ${heatClass(m.max_drawdown ?? 0)}`}>{m.max_drawdown ?? 0}%</td>
                                                                        <td className={`p-2 text-right ${heatClass(m.sharpe ?? 0)}`}>{m.sharpe ?? 0}</td>
                                                                    </tr>
                                                                );
                                                            })}
                                                        </tbody>
                                                    </table>
                                                    <div className="text-[11px] text-gray-500 mt-2">
                                                        색상 히트맵은 구간별 성과의 강약을 직관적으로 보여줍니다.
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })()}

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        <div className="bg-gray-900/60 p-3 rounded-lg border border-gray-700 relative">
                                            <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                                                Market Regime
                                                <button
                                                    data-bt-tip
                                                    onClick={() => setActiveBacktestTip(activeBacktestTip === 'regime' ? null : 'regime')}
                                                    className="text-gray-500 hover:text-white"
                                                >
                                                    ⓘ
                                                </button>
                                            </div>
                                            {activeBacktestTip === 'regime' && (
                                                <div data-bt-tip className="absolute z-10 left-1/2 top-8 w-60 -translate-x-1/2 bg-gray-900 text-gray-300 text-[11px] p-2 rounded border border-gray-700 whitespace-normal">
                                                    현재 시장 국면(추세/횡보)과 변동성 수준을 요약한 값입니다.
                                                </div>
                                            )}
                                            <div className="text-sm md:text-base font-bold text-gray-200">
                                                {data.market_regime?.regime || "Unknown"}
                                            </div>
                                            <div className="text-[11px] text-gray-500 mt-1">
                                                Trend: {data.market_regime?.trend || "Unknown"} / Vol: {data.market_regime?.volatility || "Unknown"}
                                            </div>
                                        </div>
                                        <div className="bg-gray-900/60 p-3 rounded-lg border border-gray-700 relative">
                                            <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                                                Risk Settings
                                                <button
                                                    data-bt-tip
                                                    onClick={() => setActiveBacktestTip(activeBacktestTip === 'risk' ? null : 'risk')}
                                                    className="text-gray-500 hover:text-white"
                                                >
                                                    ⓘ
                                                </button>
                                            </div>
                                            {activeBacktestTip === 'risk' && (
                                                <div data-bt-tip className="absolute z-10 left-1/2 top-8 w-64 -translate-x-1/2 bg-gray-900 text-gray-300 text-[11px] p-2 rounded border border-gray-700 whitespace-normal">
                                                    손절/익절 기준(ATR 배수)과 1회 거래 리스크 비중입니다.
                                                </div>
                                            )}
                                            <div className="text-sm md:text-base font-bold text-gray-200">
                                                Stop {data.backtest?.risk_settings?.stop_atr || 0} ATR / Take {data.backtest?.risk_settings?.take_atr || 0} ATR
                                            </div>
                                            <div className="text-[11px] text-gray-500 mt-1">
                                                Risk per trade: {(data.backtest?.risk_settings?.risk_per_trade || 0) * 100}%
                                            </div>
                                        </div>
                                        <div className="bg-gray-900/60 p-3 rounded-lg border border-gray-700 relative">
                                            <div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                                                Position Sizing
                                                <button
                                                    data-bt-tip
                                                    onClick={() => setActiveBacktestTip(activeBacktestTip === 'size' ? null : 'size')}
                                                    className="text-gray-500 hover:text-white"
                                                >
                                                    ⓘ
                                                </button>
                                            </div>
                                            {activeBacktestTip === 'size' && (
                                                <div data-bt-tip className="absolute z-10 left-1/2 top-8 w-64 -translate-x-1/2 bg-gray-900 text-gray-300 text-[11px] p-2 rounded border border-gray-700 whitespace-normal">
                                                    계정 규모와 손절 폭을 기준으로 계산한 권장 보유 수량입니다.
                                                </div>
                                            )}
                                            <div className="text-sm md:text-base font-bold text-gray-200">
                                                {data.backtest?.position_sizing_hint?.suggested_shares || 0}주
                                            </div>
                                            <div className="text-[11px] text-gray-500 mt-1">
                                                ATR {data.backtest?.position_sizing_hint?.last_atr || 0} / Stop {data.backtest?.position_sizing_hint?.stop_amount || 0}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="w-full text-xs md:text-sm border border-gray-700 rounded-lg overflow-hidden">
                                            <thead className="bg-gray-900/70">
                                                <tr>
                                                    <th className="text-left p-2 md:p-3 text-gray-400">전략</th>
                                                    <th className="text-right p-2 md:p-3 text-gray-400">
                                                        <span className="inline-flex items-center gap-1">
                                                            Total
                                                            <span className="relative">
                                                                <button
                                                                    data-bt-tip
                                                                    onClick={() => setActiveBacktestTip(activeBacktestTip === 'total' ? null : 'total')}
                                                                    className="text-gray-500 hover:text-white"
                                                                >
                                                                    ⓘ
                                                                </button>
                                                                <span data-bt-tip className={`${activeBacktestTip === 'total' ? 'block' : 'hidden'} absolute left-1/2 mt-2 w-56 -translate-x-1/2 bg-gray-900 text-gray-300 text-[11px] p-2 rounded border border-gray-700 whitespace-normal`}>
                                                                    전체 누적 수익률입니다.
                                                                </span>
                                                            </span>
                                                        </span>
                                                    </th>
                                                    <th className="text-right p-2 md:p-3 text-gray-400">
                                                        <span className="inline-flex items-center gap-1">
                                                            CAGR
                                                            <span className="relative">
                                                                <button
                                                                    data-bt-tip
                                                                    onClick={() => setActiveBacktestTip(activeBacktestTip === 'cagr' ? null : 'cagr')}
                                                                    className="text-gray-500 hover:text-white"
                                                                >
                                                                    ⓘ
                                                                </button>
                                                                <span data-bt-tip className={`${activeBacktestTip === 'cagr' ? 'block' : 'hidden'} absolute left-1/2 mt-2 w-56 -translate-x-1/2 bg-gray-900 text-gray-300 text-[11px] p-2 rounded border border-gray-700 whitespace-normal`}>
                                                                    연복리 수익률(연환산)입니다.
                                                                </span>
                                                            </span>
                                                        </span>
                                                    </th>
                                                    <th className="text-right p-2 md:p-3 text-gray-400">
                                                        <span className="inline-flex items-center gap-1">
                                                            MDD
                                                            <span className="relative">
                                                                <button
                                                                    data-bt-tip
                                                                    onClick={() => setActiveBacktestTip(activeBacktestTip === 'mdd' ? null : 'mdd')}
                                                                    className="text-gray-500 hover:text-white"
                                                                >
                                                                    ⓘ
                                                                </button>
                                                                <span data-bt-tip className={`${activeBacktestTip === 'mdd' ? 'block' : 'hidden'} absolute left-1/2 mt-2 w-56 -translate-x-1/2 bg-gray-900 text-gray-300 text-[11px] p-2 rounded border border-gray-700 whitespace-normal`}>
                                                                    최대 낙폭(가장 큰 하락폭)입니다.
                                                                </span>
                                                            </span>
                                                        </span>
                                                    </th>
                                                    <th className="text-right p-2 md:p-3 text-gray-400">
                                                        <span className="inline-flex items-center gap-1">
                                                            Sharpe
                                                            <span className="relative">
                                                                <button
                                                                    data-bt-tip
                                                                    onClick={() => setActiveBacktestTip(activeBacktestTip === 'sharpe' ? null : 'sharpe')}
                                                                    className="text-gray-500 hover:text-white"
                                                                >
                                                                    ⓘ
                                                                </button>
                                                                <span data-bt-tip className={`${activeBacktestTip === 'sharpe' ? 'block' : 'hidden'} absolute left-1/2 mt-2 w-64 -translate-x-1/2 bg-gray-900 text-gray-300 text-[11px] p-2 rounded border border-gray-700 whitespace-normal`}>
                                                                    위험 대비 효율(수익/변동성) 지표입니다.
                                                                </span>
                                                            </span>
                                                        </span>
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {data.backtest?.strategies?.map((s: any, idx: number) => {
                                                    const total = s.metrics?.total_return ?? 0;
                                                    const sharpe = s.metrics?.sharpe ?? 0;
                                                    const mdd = s.metrics?.max_drawdown ?? 0;
                                                    const tag =
                                                        total > 0 && sharpe >= backtestThresholds.sharpeOk && mdd > backtestThresholds.mddWarning ? "추천" :
                                                            total <= 0 || mdd <= backtestThresholds.mddBad ? "배제" : "보류";
                                                    const tagColor =
                                                        tag === "추천" ? "bg-emerald-900/60 text-emerald-300 border-emerald-600/50" :
                                                            tag === "배제" ? "bg-rose-900/60 text-rose-300 border-rose-600/50" :
                                                                "bg-gray-800 text-gray-300 border-gray-600";
                                                    const comment =
                                                        tag === "추천" ? "성과와 리스크 균형이 양호한 편입니다." :
                                                            tag === "배제" ? "낙폭이 크거나 성과가 약해 신중 접근이 필요합니다." :
                                                                "성과는 있으나 리스크 대비 효율이 애매합니다.";
                                                    const tagHelp =
                                                        tag === "추천" ? "수익/리스크 지표가 안정적 범위에 있습니다." :
                                                            tag === "배제" ? "수익이 낮거나 낙폭이 큰 구간입니다." :
                                                                "성과는 있으나 확신 신호가 부족합니다.";
                                                    return (
                                                        <tr key={idx} className="border-t border-gray-700">
                                                            <td className="p-2 md:p-3">
                                                                <div className="font-bold text-gray-200">{s.label}</div>
                                                                <div className="text-[11px] text-gray-500">{s.description}</div>
                                                                <div className="flex items-center gap-2 mt-1">
                                                                    <div className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border ${tagColor}`}>
                                                                        {tag}
                                                                        <span className="relative" data-bt-tip>
                                                                            <button
                                                                                data-bt-tip
                                                                                onClick={() => setActiveBacktestTip(activeBacktestTip === `tag-${idx}` ? null : `tag-${idx}`)}
                                                                                className="text-gray-400 hover:text-white"
                                                                            >
                                                                                ⓘ
                                                                            </button>
                                                                            <span
                                                                                data-bt-tip
                                                                                className={`${activeBacktestTip === `tag-${idx}` ? 'block' : 'hidden'} absolute left-1/2 mt-2 w-52 -translate-x-1/2 bg-gray-900 text-gray-300 text-[11px] p-2 rounded border border-gray-700 whitespace-normal`}
                                                                            >
                                                                                {tagHelp}
                                                                            </span>
                                                                        </span>
                                                                    </div>
                                                                    <div className="text-[11px] text-gray-500">{comment}</div>
                                                                </div>
                                                            </td>
                                                            <td className="p-2 md:p-3 text-right font-mono text-gray-200">{s.metrics.total_return}%</td>
                                                            <td className="p-2 md:p-3 text-right font-mono text-gray-200">{s.metrics.cagr}%</td>
                                                            <td className="p-2 md:p-3 text-right font-mono text-red-300">{s.metrics.max_drawdown}%</td>
                                                            <td className="p-2 md:p-3 text-right font-mono text-gray-200">{s.metrics.sharpe}</td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </section>

                        {/* Technical Analysis (Timing) - NEW */}
                        <section className="bg-gray-800 rounded-xl p-4 md:p-5 border border-gray-700 relative overflow-hidden">
                            <h3 className="text-base md:text-xl font-bold mb-4 flex items-center gap-2 relative z-10">
                                <span>⏱️</span> 매매 타이밍 (Technical Timing)
                            </h3>

                            {data.technical_analysis ? (
                                <div className="relative z-10">

                                    {/* Action Advice (Highlighted) - MOVED TO TOP */}
                                    <div className={`text-lg md:text-xl font-bold mb-6 p-4 rounded-xl border flex items-start gap-3 shadow-lg ${data.technical_analysis.color === 'red' ? 'bg-red-900/40 border-red-500 text-red-100' :
                                        data.technical_analysis.color === 'blue' ? 'bg-blue-900/40 border-blue-500 text-blue-100' :
                                            'bg-gray-700/50 border-gray-600 text-gray-200'
                                        }`}>
                                        <span className="text-2xl">💡</span>
                                        <span className="leading-relaxed">{data.technical_analysis.action}</span>
                                    </div>

                                    {/* Signal & Trend Info */}
                                    <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
                                        <span className={`text-sm font-bold px-3 py-1.5 rounded-full border self-start md:self-auto ${data.technical_analysis.trend.includes('상승') ? 'bg-red-900/30 border-red-500/30 text-red-300' : 'bg-blue-900/30 border-blue-500/30 text-blue-300'}`}>
                                            {data.technical_analysis.trend}
                                        </span>

                                        {/* Confidence Score Badge */}
                                        {data.technical_analysis.summary && (
                                            <span className="text-sm bg-gray-700 px-3 py-1.5 rounded-full border border-gray-600 flex items-center gap-1.5">
                                                <span>🛡️ 신뢰도:</span>
                                                <span className="font-mono font-bold text-white">{data.technical_analysis.summary.confidence}</span>
                                                <span className="text-gray-400">지표 동의</span>
                                            </span>
                                        )}
                                    </div>

                                    {/* Indicators Grid */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {/* RSI */}
                                        <div className="bg-gray-700/30 p-3 rounded-lg border border-gray-700 relative">
                                            <button onClick={() => setActiveTooltip('rsi')} className="absolute top-2 right-2 text-gray-500 hover:text-white">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                            <div className="text-gray-500 text-xs font-bold mb-1">RSI (14d)</div>
                                            <div className={`font-mono font-bold text-lg ${data.technical_analysis.rsi < 30 ? 'text-emerald-400' :
                                                data.technical_analysis.rsi > 70 ? 'text-red-400' : 'text-white'
                                                }`}>
                                                {data.technical_analysis.rsi}
                                            </div>
                                            <div className="text-[10px] text-gray-500 mt-1">
                                                {data.technical_analysis.rsi < 30 ? 'Oversold' : data.technical_analysis.rsi > 70 ? 'Overbought' : 'Neutral'}
                                            </div>
                                        </div>

                                        {/* MA Trend */}
                                        <div className="bg-gray-700/30 p-3 rounded-lg border border-gray-700 relative">
                                            <button onClick={() => setActiveTooltip('ma')} className="absolute top-2 right-2 text-gray-500 hover:text-white">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                            <div className="text-gray-500 text-xs font-bold mb-1">MA Trend</div>
                                            <div className={`font-mono font-bold text-lg ${data.technical_analysis.ma20 > data.technical_analysis.ma60 ? 'text-red-400' : 'text-blue-400'}`}>
                                                {data.technical_analysis.ma20 > data.technical_analysis.ma60 ? 'Bullish' : 'Bearish'}
                                            </div>
                                            <div className="text-[10px] text-gray-500 mt-1">
                                                ma20 vs ma60
                                            </div>
                                        </div>

                                        {/* MACD */}
                                        <div className="bg-gray-700/30 p-3 rounded-lg border border-gray-700 relative">
                                            <button onClick={() => setActiveTooltip('macd')} className="absolute top-2 right-2 text-gray-500 hover:text-white">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                            <div className="text-gray-500 text-xs font-bold mb-1">MACD</div>
                                            <div className={`font-mono font-bold text-lg ${data.technical_analysis.macd?.status === 'Bullish' ? 'text-red-400' : 'text-blue-400'}`}>
                                                {data.technical_analysis.macd?.status || 'N/A'}
                                            </div>
                                            <div className="text-[10px] text-gray-500 mt-1">
                                                {data.technical_analysis.macd?.macd > data.technical_analysis.macd?.signal ? 'Golden Cross' : 'Dead Cross'}
                                            </div>
                                        </div>

                                        {/* Bollinger */}
                                        <div className="bg-gray-700/30 p-3 rounded-lg border border-gray-700 relative">
                                            <button onClick={() => setActiveTooltip('bollinger')} className="absolute top-2 right-2 text-gray-500 hover:text-white">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                            <div className="text-gray-500 text-xs font-bold mb-1">Bollinger</div>
                                            <div className={`font-mono font-bold text-lg ${data.technical_analysis.bollinger?.status.includes('Oversold') ? 'text-emerald-400' :
                                                data.technical_analysis.bollinger?.status.includes('Overbought') ? 'text-red-400' : 'text-gray-300'
                                                }`}>
                                                {data.technical_analysis.bollinger?.status.split('(')[0] || 'Normal'}
                                            </div>
                                            <div className="text-[10px] text-gray-500 mt-1 truncate">
                                                {data.technical_analysis.bollinger?.status.includes('(') ?
                                                    data.technical_analysis.bollinger?.status.split('(')[1].replace(')', '') : 'Middle Zone'}
                                            </div>
                                        </div>

                                        {/* Stochastic */}
                                        <div className="bg-gray-700/30 p-3 rounded-lg border border-gray-700 relative">
                                            <button onClick={() => setActiveTooltip('stochastic')} className="absolute top-2 right-2 text-gray-500 hover:text-white">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                            <div className="text-gray-500 text-xs font-bold mb-1">Stochastic</div>
                                            <div className={`font-mono font-bold text-lg ${data.technical_analysis.stochastic?.k < 20 ? 'text-emerald-400' :
                                                data.technical_analysis.stochastic?.k > 80 ? 'text-red-400' : 'text-white'
                                                }`}>
                                                {data.technical_analysis.stochastic?.k || 50}
                                            </div>
                                            <div className="text-[10px] text-gray-500 mt-1">
                                                Slow %K / %D
                                            </div>
                                        </div>

                                        {/* MFI */}
                                        <div className="bg-gray-700/30 p-3 rounded-lg border border-gray-700 relative">
                                            <button onClick={() => setActiveTooltip('mfi')} className="absolute top-2 right-2 text-gray-500 hover:text-white">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                            <div className="text-gray-500 text-xs font-bold mb-1">MFI (Money)</div>
                                            <div className={`font-mono font-bold text-lg ${data.technical_analysis.mfi < 20 ? 'text-emerald-400' :
                                                data.technical_analysis.mfi > 80 ? 'text-red-400' : 'text-white'
                                                }`}>
                                                {data.technical_analysis.mfi || 50}
                                            </div>
                                            <div className="text-[10px] text-gray-500 mt-1">
                                                Volume Weighted
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-gray-500 text-sm py-4">
                                    기술적 분석 데이터 준비 중...
                                </div>
                            )}
                        </section>
                        <section className="bg-gray-800 p-4 md:p-5 rounded-lg border border-gray-700">
                            <h3 className="text-base md:text-xl font-bold mb-2 md:mb-4 flex items-center">
                                <span className="mr-2">📊</span>
                                3-Year Net Income Trend (당기순이익 추이)
                            </h3>
                            <div className="mb-4 md:mb-6">
                                <details className="group">
                                    <summary className="text-blue-400 text-xs md:text-sm cursor-pointer hover:text-blue-300 flex items-center gap-2 mb-2">
                                        💡 이 차트를 어떻게 해석하나요?
                                        <svg className="w-4 h-4 transform transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </summary>
                                    <p className="text-gray-400 text-xs md:text-sm mt-2 pl-4 border-l-2 border-blue-500/30">
                                        "왜 이 등급이 나왔는가?"를 뒷받침하는 핵심 근거입니다.
                                        회사가 실제로 벌어들인 현금(순이익)이 우상향하고 있다면 <strong>강력한 매수 신호</strong>입니다.
                                    </p>
                                </details>

                                {/* CSS Bar Chart */}
                                <div className="flex items-end space-x-4 md:space-x-8 h-48 md:h-64 border-b border-gray-600 pb-4 px-2 md:px-4 justify-center bg-gray-900/50 rounded-lg">
                                    {/* Support both legacy list and new structured trend data */}
                                    {(data.financial_data.financial_trend || data.financial_data.fcf_history.map((v: number, i: number) => ({ year: new Date().getFullYear() - 3 + i, net_income: v }))).map((item: any, idx: number) => {
                                        const val = item.net_income !== undefined ? item.net_income : item; // Fallback
                                        const yearLabel = item.year || (new Date().getFullYear() - 2 + idx);

                                        const allValues = (data.financial_data.financial_trend || data.financial_data.fcf_history).map((x: any) => x.net_income !== undefined ? x.net_income : x);
                                        const absValues = allValues.map((v: number) => Math.abs(v));
                                        const maxVal = Math.max(...absValues, 1000000); // Min scale 1M
                                        const heightPct = Math.max((Math.abs(val) / maxVal) * 100, 5);
                                        const isPositive = val >= 0;
                                        const colorClass = isPositive ? "bg-emerald-500" : "bg-red-500";

                                        // Format Value (Trillions/Billions)
                                        const formatVal = (v: number) => {
                                            if (Math.abs(v) > 1000000000000) return `${(v / 1000000000000).toFixed(1)}조`;
                                            if (Math.abs(v) > 100000000) return `${(v / 100000000).toFixed(0)}억`;
                                            return v.toLocaleString();
                                        };

                                        return (
                                            <div key={idx} className="flex flex-col items-center justify-end h-full w-16 md:w-24 group">
                                                <div className="mb-2 text-[10px] md:text-xs font-mono text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                                    {formatVal(val)}
                                                </div>
                                                <div
                                                    className={`w-full ${colorClass} rounded-t-lg transition-all duration-500 hover:brightness-110 relative`}
                                                    style={{ height: `${heightPct}%` }}
                                                >
                                                    {heightPct > 20 && (
                                                        <span className="absolute bottom-2 left-0 right-0 text-center text-[10px] md:text-xs font-bold text-gray-900">
                                                            {formatVal(val)}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="mt-2 md:mt-3 text-xs md:text-sm font-bold text-gray-400" suppressHydrationWarning>
                                                    {yearLabel}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </section>

                        {/* Grid Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Stability */}
                            <div className="bg-gray-800 p-4 md:p-5 rounded-lg border-t-4 border-blue-500">
                                <h3 className="font-bold text-base md:text-lg mb-2 md:mb-4">재무 안정성 (Run Stability)</h3>
                                <div className="flex justify-between mb-1 md:mb-2 text-sm md:text-base">
                                    <span>Level</span>
                                    <span className="font-mono text-blue-300">{data.stability.level}</span>
                                </div>
                                <div className="flex justify-between text-sm md:text-base">
                                    <span>Score</span>
                                    <span className="font-mono">{data.stability.score}</span>
                                </div>
                            </div>

                            {/* Risk */}
                            <div className="bg-gray-800 p-4 md:p-5 rounded-lg border-t-4 border-yellow-500">
                                <h3 className="font-bold text-base md:text-lg mb-2 md:mb-4">리스크 진단 (Risk Check)</h3>
                                <div className="flex justify-between mb-1 md:mb-2 text-sm md:text-base">
                                    <span>Level</span>
                                    <span className="font-mono text-yellow-300">{data.bottleneck.risk_level}</span>
                                </div>
                                <div className="flex justify-between text-sm md:text-base">
                                    <span>Issues</span>
                                    <span className="font-mono">{data.bottleneck.critical_issues.length}</span>
                                </div>
                            </div>

                            {/* Competitive */}
                            <div className="bg-gray-800 p-4 md:p-5 rounded-lg border-t-4 border-emerald-500">
                                <h3 className="font-bold text-base md:text-lg mb-2 md:mb-4">경쟁 우위 (Competitive Edge)</h3>
                                <div className="flex justify-between mb-1 md:mb-2 text-sm md:text-base">
                                    <span>Rating</span>
                                    <span className="font-mono text-emerald-300">{data.competitive.rating}</span>
                                </div>
                                <div className="flex justify-between text-sm md:text-base">
                                    <span>Edges</span>
                                    <span className="font-mono">{data.competitive.edge_count}</span>
                                </div>
                            </div>
                        </div>

                        {/* Theme DNA Analysis */}
                        <section className="bg-gray-800 p-4 md:p-5 rounded-lg border border-gray-700">
                            <h3 className="text-base md:text-xl font-bold mb-4 flex items-center justify-between">
                                <span className="flex items-center gap-2">
                                    <span>🧬</span> 테마 DNA 분석 (Sector Identity)
                                </span>
                                <span className="text-xs text-gray-400 font-normal">최근 90일 동행성 기준</span>
                            </h3>

                            {data.theme_analysis?.error ? (
                                <div className="text-gray-500 text-sm">테마 데이터 분석 부족</div>
                            ) : (
                                <div>
                                    <div className="mb-4">
                                        <div className="text-sm text-gray-400 mb-1">Main Identity</div>
                                        <div className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
                                            {data.theme_analysis?.summary === 'Independent' ? "🏖️ 독자적 움직임 (Independent)" :
                                                `🔗 ${data.theme_analysis?.summary} 테마 연동`}
                                        </div>
                                        <p className="text-sm text-gray-400 mt-2 bg-gray-900/50 p-3 rounded border border-gray-700">
                                            {data.theme_analysis?.message}
                                        </p>
                                    </div>

                                    {/* Tag Cloud / List */}
                                    <div className="flex flex-wrap gap-2">
                                        {data.theme_analysis?.top_themes?.map((t: any, idx: number) => (
                                            <div key={idx} className={`px-3 py-2 rounded-lg border flex items-center gap-3 ${idx === 0 ? "bg-blue-900/40 border-blue-500/50 text-blue-200" : "bg-gray-800 border-gray-600 text-gray-400"
                                                }`}>
                                                <span className="font-bold text-sm">{t.theme}</span>
                                                <span className="text-xs bg-black/30 px-1.5 py-0.5 rounded text-gray-300">
                                                    {t.leader_name}와 {Math.round(t.correlation * 100)}% 동행
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </section>

                        {/* Sentiment Analysis (News) - NEW */}
                        <section className="bg-gray-800 p-4 md:p-5 rounded-lg border border-gray-700">
                            <h3 className="text-base md:text-xl font-bold mb-4 flex items-center justify-between">
                                <span className="flex items-center gap-2">
                                    <span>📰</span> 뉴스 감성 분석 (Market Sentiment)
                                </span>
                                {data.sentiment_analysis?.score !== undefined && (
                                    <span className={`text-sm px-3 py-1 rounded-full font-bold ${data.sentiment_analysis.score >= 60 ? "bg-emerald-900 text-emerald-300 border border-emerald-500/50" :
                                        data.sentiment_analysis.score <= 40 ? "bg-red-900 text-red-300 border border-red-500/50" :
                                            "bg-gray-700 text-gray-300"
                                        }`}>
                                        {data.sentiment_analysis.score}점 ({data.sentiment_analysis.mood.split('(')[1]?.replace(')', '') || '중립'})
                                    </span>
                                )}
                            </h3>

                            {data.sentiment_analysis?.error ? (
                                <div className="text-gray-500 text-sm">뉴스 데이터 분석 실패 ({data.sentiment_analysis.error})</div>
                            ) : data.sentiment_analysis ? (
                                <div>
                                    {/* Gauge / Summary */}
                                    <div className="mb-4">
                                        <p className="text-sm text-gray-300 mb-2">{data.sentiment_analysis.summary}</p>
                                        <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden flex">
                                            <div className="bg-red-500 h-full transition-all duration-1000" style={{ width: `${100 - (data.sentiment_analysis.score || 50)}%` }}></div>
                                            <div className="bg-emerald-500 h-full transition-all duration-1000" style={{ width: `${data.sentiment_analysis.score || 50}%` }}></div>
                                        </div>
                                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                                            <span>Fear (악재)</span>
                                            <span>Neutral</span>
                                            <span>Optimism (호재)</span>
                                        </div>
                                    </div>

                                    {/* Headlines */}
                                    <div className="space-y-2">
                                        {data.sentiment_analysis.headlines?.slice(0, 3).map((news: any, idx: number) => (
                                            <div key={idx} className="flex justify-between items-start text-sm border-b border-gray-700 pb-2 last:border-0 last:pb-0">
                                                <div className="text-gray-300 truncate pr-2">{news.title}</div>
                                                <span className={`text-xs font-bold whitespace-nowrap ${news.sentiment === 'Positive' ? 'text-emerald-400' :
                                                    news.sentiment === 'Negative' ? 'text-red-400' : 'text-gray-500'
                                                    }`}>
                                                    {news.sentiment === 'Positive' ? '호재' : news.sentiment === 'Negative' ? '악재' : '-'}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-gray-500 text-sm py-4">뉴스 데이터 분석 중...</div>
                            )}
                        </section>

                        {/* Macro Impact Analysis */}
                        <section className="bg-gray-800 p-4 md:p-5 rounded-lg border border-gray-700">
                            <h3 className="text-base md:text-xl font-bold mb-4 flex items-center justify-between">
                                <span className="flex items-center gap-2">
                                    <span>🌍</span> 거시경제 영향 분석 (Macro Impact)
                                </span>
                                <span className={`text-sm px-3 py-1 rounded-full font-bold ${data.macro_analysis?.summary?.includes('Positive') ? "bg-emerald-900 text-emerald-300 border border-emerald-500/50" :
                                    data.macro_analysis?.summary?.includes('Negative') ? "bg-red-900 text-red-300 border border-red-500/50" :
                                        "bg-gray-700 text-gray-300"
                                    }`}>
                                    {data.macro_analysis?.summary || "Neutral"}
                                </span>
                            </h3>

                            {data.macro_analysis?.error ? (
                                <div className="text-gray-500 text-sm">거시 데이터 분석에 실패했습니다. (데이터 부족 등)</div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                                    {data.macro_analysis?.details?.length > 0 ? (
                                        data.macro_analysis?.details.map((item: any, idx: number) => (
                                            <div key={idx} className={`p-4 rounded-lg border ${item.impact === 'Good' ? "bg-emerald-900/20 border-emerald-500/30" :
                                                item.impact === 'Bad' ? "bg-red-900/20 border-red-500/30" :
                                                    "bg-gray-800 border-gray-700"
                                                }`}>
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="font-bold text-gray-300">{item.factor}</span>
                                                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${item.impact === 'Good' ? "bg-emerald-500 text-black" :
                                                        item.impact === 'Bad' ? "bg-red-500 text-white" :
                                                            "bg-gray-600 text-gray-300"
                                                        }`}>{item.impact}</span>
                                                </div>
                                                <p className="text-sm text-gray-400 mb-2">{item.message}</p>
                                                <div className="flex justify-between items-center text-xs text-gray-500 font-mono mt-3 border-t border-gray-700/50 pt-2">
                                                    <span>Correlation: {item.correlation > 0 ? '+' : ''}{item.correlation}</span>
                                                    <span>Trend: {item.trend_compared_to_avg}</span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-span-3 text-center text-gray-500 py-4">
                                            특별한 거시경제 민감도가 발견되지 않았습니다. (시장 무관형 종목)
                                            <div className="text-xs mt-1">상관계수 절대값이 모두 0.15 미만입니다.</div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </section>

                        {/* Fair Value Analysis - NEW */}
                        {/* Fair Value Analysis - Commented out per user request (Outdated Data)
                <section className="bg-gray-800 p-4 md:p-5 rounded-lg border border-gray-700">
                    <h3 className="text-base md:text-xl font-bold mb-4 flex items-center justify-between">
                        <span className="flex items-center gap-2">
                            <span>⚖️</span> 적정 주가 분석 (Fair Value)
                        </span>
                        {data.valuation_analysis?.upside !== undefined && (
                            <span className={`text-sm px-3 py-1 rounded-full font-bold ${data.valuation_analysis.status.includes('Undervalued') ? "bg-emerald-900 text-emerald-300 border border-emerald-500/50" :
                                data.valuation_analysis.status.includes('Overvalued') ? "bg-red-900 text-red-300 border border-red-500/50" :
                                    "bg-gray-700 text-gray-300"
                                }`}>
                                {data.valuation_analysis.status.includes('Undervalued') ? `저평가 (+${data.valuation_analysis.upside}%)` :
                                    data.valuation_analysis.status.includes('Overvalued') ? `고평가 (${data.valuation_analysis.upside}%)` :
                                        "적정 주가"}
                            </span>
                        )}
                    </h3>

                    {data.valuation_analysis?.details?.error ? (
                        <div className="text-gray-500 text-sm">적정 주가 계산 불가 ({data.valuation_analysis.details.error})</div>
                    ) : data.valuation_analysis ? (
                        <div className="relative pt-4 pb-2">
                            <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                                <div>현재가: <span className="text-white font-bold text-lg">{data.valuation_analysis.current_price?.toLocaleString() || 0}원</span></div>
                                <div className="text-right">적정가: <span className="text-blue-400 font-bold text-lg">{data.valuation_analysis.fair_value?.toLocaleString() || 0}원</span></div>
                            </div>

                            <div className="relative h-4 bg-gray-700 rounded-full w-full overflow-hidden mt-2 mb-4">
                                {(() => {
                                    const current = data.valuation_analysis.current_price || 0;
                                    const fair = data.valuation_analysis.fair_value || 0;
                                    const maxVal = Math.max(current, fair) * 1.2 || 100;
                                    const currentPct = (current / maxVal) * 100;
                                    const fairPct = (fair / maxVal) * 100;

                                    return (
                                        <>
                                            <div className="absolute top-0 bottom-0 w-1 bg-white z-10" style={{ left: `${currentPct}%` }}></div>
                                            <div className="absolute top-0 bottom-0 w-1 bg-blue-500 z-10" style={{ left: `${fairPct}%` }}></div>
                                            <div className={`absolute top-0 bottom-0 opacity-30 ${current < fair ? "bg-emerald-500" : "bg-red-500"}`}
                                                style={{
                                                    left: `${Math.min(currentPct, fairPct)}%`,
                                                    width: `${Math.abs(fairPct - currentPct)}%`
                                                }}>
                                            </div>
                                        </>
                                    );
                                })()}
                            </div>

                            <div className="bg-gray-900/50 p-3 rounded border border-gray-700 text-xs md:text-sm text-gray-300">
                                <p className="mb-1">
                                    <span className="font-bold text-gray-400">💡 분석 방식:</span> {data.valuation_analysis.details?.method || 'N/A'}
                                </p>
                                <p>
                                    EPS({data.valuation_analysis.details?.eps?.toLocaleString() || 0}) × 목표 PER({data.valuation_analysis.details?.target_per || 0})
                                    & BPS({data.valuation_analysis.details?.bps?.toLocaleString() || 0}) × 목표 PBR({data.valuation_analysis.details?.target_pbr || 0})
                                    기반으로 계산되었습니다. (안전마진 10% 적용)
                                </p>
                                <p className="text-[10px] text-gray-500 border-t border-gray-700 pt-2 mt-2">
                                    ⚠️ <strong>데이터 주의사항:</strong> 본 적정 주가는 <em>최근 확정된 결산/분기 실적</em>을 기준으로 산출되었습니다.
                                    2026년 예상 실적(컨센서스)이 아닌 과거 실적 기반이므로, 향후 이익 성장이 예상되는 기업은 실제보다 저평가된 것으로 보일 수 있습니다. (참고용으로만 활용하세요)
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="text-gray-500 text-sm py-4">적정 주가 데이터 준비 중...</div>
                    )}
                </section>
                */}

                        {/* Detailed Metrics */}
                        <section className="bg-gray-800 p-4 md:p-5 rounded-lg relative">
                            <div className="flex justify-between items-center mb-4 md:mb-6">
                                <h3 className="text-lg md:text-xl font-bold">주요 지표 설명 (Key Metrics)</h3>
                                <button
                                    onClick={() => alert("상세 데이터 보기 기능은 현재 개발 중입니다.\n\nraw_data:\n" + JSON.stringify(data.raw_data, null, 2))}
                                    className="text-xs md:text-sm bg-gray-700 hover:bg-gray-600 px-2 py-1 md:px-3 md:py-1 rounded border border-gray-600 transition-colors"
                                >
                                    📋 자세히 보기 (Raw Data)
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                                <div className="p-3 md:p-4 bg-gray-900 rounded border border-gray-700">
                                    <div className="flex justify-between items-center mb-1">
                                        <div className="text-gray-400 text-xs md:text-sm font-bold">PER (주가수익비율)</div>
                                        <div className="text-lg md:text-xl font-bold">{data.stock_metrics.per}</div>
                                    </div>
                                    <p className="text-[10px] md:text-xs text-gray-500">
                                        * Price-to-Earnings Ratio: 주가가 1주당 순이익의 몇 배인지 나타냅니다. 낮을수록 저평가(매력적)된 상태일 수 있습니다. (업종 평균: {data.sector_avg.avg_per})
                                    </p>
                                </div>

                                <div className="p-3 md:p-4 bg-gray-900 rounded border border-gray-700">
                                    <div className="flex justify-between items-center mb-1">
                                        <div className="text-gray-400 text-xs md:text-sm font-bold">PBR (주가순자산비율)</div>
                                        <div className="text-lg md:text-xl font-bold">{data.stock_metrics.pbr}</div>
                                    </div>
                                    <p className="text-[10px] md:text-xs text-gray-500">
                                        * Price-to-Book Ratio: 주가가 1주당 순자산의 몇 배인지 나타냅니다. 1.0 미만이면 청산가치보다 저평가된 상태입니다.
                                    </p>
                                </div>

                                <div className="p-3 md:p-4 bg-gray-900 rounded border border-gray-700">
                                    <div className="flex justify-between items-center mb-1">
                                        <div className="text-gray-400 text-xs md:text-sm font-bold">ROE (자기자본이익률)</div>
                                        <div className="text-lg md:text-xl font-bold">{data.stock_metrics.roe.toFixed(2)}%</div>
                                    </div>
                                    <p className="text-[10px] md:text-xs text-gray-500">
                                        * Return on Equity: 기업이 투입한 자본 대비 얼마만큼의 이익을 냈는지 보여줍니다. 높을수록 돈을 잘 버는 기업입니다. (업종 평균: {data.sector_avg.avg_roe})
                                    </p>
                                </div>

                                <div className="p-3 md:p-4 bg-gray-900 rounded border border-gray-700">
                                    <div className="flex justify-between items-center mb-1">
                                        <div className="text-gray-400 text-xs md:text-sm font-bold">Debt Ratio (부채비율)</div>
                                        <div className="text-lg md:text-xl font-bold">{data.financial_data.debt_ratio.toFixed(2)}%</div>
                                    </div>
                                    <p className="text-[10px] md:text-xs text-gray-500">
                                        * 부채총계 / 자본총계: 타인 자본 의존도를 나타냅니다. 100% 미만이면 매우 안정적, 200% 이상이면 리스크가 있습니다.
                                    </p>
                                </div>
                            </div>
                        </section>
                    </>
                )}
            </div>
            {/* Tooltip Modal */}
            {activeTooltip && tooltips[activeTooltip] && (
                <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setActiveTooltip(null)}>
                    <div className="bg-gray-800 p-6 rounded-xl border border-gray-600 max-w-sm w-full shadow-2xl relative" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setActiveTooltip(null)} className="absolute top-3 right-3 text-gray-400 hover:text-white">✕</button>
                        <h4 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                            <span>ℹ️</span> {tooltips[activeTooltip].title}
                        </h4>
                        <p className="text-gray-300 mb-4 text-sm">{tooltips[activeTooltip].desc}</p>
                        <div className="bg-gray-900/50 p-3 rounded text-sm text-gray-400 whitespace-pre-wrap leading-relaxed">
                            {tooltips[activeTooltip].detail}
                        </div>
                    </div>
                </div>
            )}

            {/* Score Help Modal */}
            {showScoreHelp && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowScoreHelp(false)}>
                    <div className="bg-gray-800 p-8 rounded-xl max-w-lg w-full border border-gray-600 shadow-2xl relative" onClick={e => e.stopPropagation()}>
                        <button onClick={() => setShowScoreHelp(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>

                        <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <span>🏆</span> 점수 산정 기준 (Score Guide)
                        </h3>

                        <div className="space-y-4 mb-8">
                            <div className="flex items-center p-3 rounded bg-gray-900 border border-emerald-500/30">
                                <div className="text-2xl mr-4">🟢</div>
                                <div>
                                    <div className="font-bold text-emerald-400">80 ~ 100점 (Strong Buy)</div>
                                    <div className="text-sm text-gray-400">재무, 수급, 경쟁력이 모두 완벽한 상태. 강력 매수 추천.</div>
                                </div>
                            </div>
                            <div className="flex items-center p-3 rounded bg-gray-900 border border-blue-500/30">
                                <div className="text-2xl mr-4">🔵</div>
                                <div>
                                    <div className="font-bold text-blue-400">60 ~ 80점 (Buy)</div>
                                    <div className="text-sm text-gray-400">전반적으로 우수하나 1~2개 약점이 있음. 분할 매수 유효.</div>
                                </div>
                            </div>
                            <div className="flex items-center p-3 rounded bg-gray-900 border border-yellow-500/30">
                                <div className="text-2xl mr-4">🟡</div>
                                <div>
                                    <div className="font-bold text-yellow-400">40 ~ 60점 (Hold)</div>
                                    <div className="text-sm text-gray-400">확실한 방향성이 보이지 않음. 관망 권장.</div>
                                </div>
                            </div>
                            <div className="flex items-center p-3 rounded bg-gray-900 border border-red-500/30">
                                <div className="text-2xl mr-4">🔴</div>
                                <div>
                                    <div className="font-bold text-red-400">0 ~ 40점 (Sell)</div>
                                    <div className="text-sm text-gray-400">재무 위험이 있거나 고평가 상태. 매도 고려.</div>
                                </div>
                            </div>
                        </div>

                        <div className="text-xs text-gray-500 bg-gray-900/50 p-4 rounded">
                            <p className="font-bold mb-1">ℹ️ 점수는 어떻게 계산되나요?</p>
                            <ul className="list-disc list-inside space-y-1">
                                <li><strong>재무 안정성 (40%):</strong> 빚이 적고 돈을 잘 버는가?</li>
                                <li><strong>경쟁 우위 (30%):</strong> 경쟁사보다 싸고 효율적인가?</li>
                                <li><strong>리스크 진단 (30%):</strong> 수급이 꼬이거나 고점 징후가 없는가?</li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {/* Loading Overlay */}
            {loading && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
                    <div className="text-xl font-bold text-white animate-pulse">{data?.company_name || ticker} 분석 중...</div>
                    <div className="text-sm text-blue-300 mt-2">DART 재무제표 및 KRX 수급 데이터를 분석 중입니다.</div>
                </div>
            )}
        </main>
    );
}
