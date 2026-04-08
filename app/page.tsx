'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import PrimaryNav from './components/primary-nav';

export default function Home() {
  const [ticker, setTicker] = useState('');
  const [loading, setLoading] = useState(false);
  const [recentReports, setRecentReports] = useState<any[]>([]);
  const [macroData, setMacroData] = useState<any>(null);
  const [growthData, setGrowthData] = useState<any>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const router = useRouter();
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);

  // Initial Load & Macro
  useEffect(() => {
    fetchReports(0);

    // Fetch Macro Data
    fetch(`/api/macro`)
      .then(res => res.json())
      .then(data => setMacroData(data))
      .catch(err => console.error("Macro Fetch Error:", err));

    fetch(`/api/growth-strategy?limit=12`)
      .then(res => res.json())
      .then(data => setGrowthData(data))
      .catch(err => console.error("Growth Strategy Fetch Error:", err));
  }, []);

  const fetchReports = async (pageIdx: number) => {
    try {
      setLoadingMore(true);
      const limit = 20;
      const skip = pageIdx * limit;
      const res = await fetch(`/api/reports?skip=${skip}&limit=${limit}`);
      const data = await res.json();

      if (data.length < limit) {
        setHasMore(false);
      }

      setRecentReports(prev => pageIdx === 0 ? data : [...prev, ...data]);
      setPage(pageIdx);
    } catch (error) {
      console.error("Failed to fetch reports:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  // Intersection Observer for Infinite Scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loadingMore) {
          fetchReports(page + 1);
        }
      },
      { threshold: 1.0 }
    );

    const sentinel = document.getElementById('sentinel');
    if (sentinel) observer.observe(sentinel);

    return () => {
      if (sentinel) observer.unobserve(sentinel);
    };
  }, [page, hasMore, loadingMore]);

  const isTickerCode = (value: string) => /^\d{6}$/.test(value.trim());

  const resolveTickerCode = async (query: string) => {
    const normalized = query.trim();
    if (!normalized) return null;
    if (isTickerCode(normalized)) return normalized;

    const localExactMatch = searchResults.find(
      (item) => item.name === normalized || item.code === normalized
    );
    if (localExactMatch) return localExactMatch.code;

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(normalized)}`);
      const data = await res.json();
      if (!Array.isArray(data) || data.length === 0) return null;

      const exactMatch = data.find(
        (item) => item.name === normalized || item.code === normalized
      );
      return (exactMatch || data[0]).code;
    } catch (error) {
      console.error("Ticker resolve failed:", error);
      return null;
    }
  };

  const handleAnalyze = async () => {
    if (!ticker.trim()) return;
    setLoading(true);

    const resolvedTicker = await resolveTickerCode(ticker);
    if (!resolvedTicker) {
      setLoading(false);
      alert("종목을 찾지 못했습니다. 추천 목록에서 선택하거나 종목 코드를 입력해 주세요.");
      return;
    }

    setTicker(resolvedTicker);
    setSearchResults([]);
    router.push(`/report/${resolvedTicker}`);
  };

  const handleSearch = (query: string) => {
    setTicker(query);
    if (query.length < 1) {
      setSearchResults([]);
      return;
    }

    // Debounce-ish or just fetch (it's fast)
    fetch(`/api/search?q=${query}`)
      .then(res => res.json())
      .then(data => setSearchResults(data))
      .catch(err => console.error(err));
  };

  const selectTicker = (item: any) => {
    setTicker(item.code);
    setSearchResults([]);
    setLoading(true);
    router.push(`/report/${item.code}`);
  };

  return (
    <main className="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6 md:space-y-8">
        <PrimaryNav />

        <header className="text-center space-y-4 md:space-y-6">
          <h1 className="text-3xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
            조셉 종목 분석기
          </h1>

          <div className="flex justify-center">
            <button
              onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}
              className="text-sm text-gray-500 hover:text-white flex items-center gap-1 transition-colors"
            >
              {isDescriptionOpen ? "분석 기준 접기 ▲" : "분석 기준 보기 ▼"}
            </button>
          </div>

          {isDescriptionOpen && (
            <div className="bg-gray-800/80 p-4 md:p-6 rounded-xl border border-gray-700 text-left max-w-3xl mx-auto backdrop-blur-sm shadow-xl transition-all">
              <h3 className="font-bold text-gray-300 mb-2 text-base md:text-lg">📊 데이터 출처 및 분석 기준 (Data Sources & Criteria)</h3>
              <ul className="list-disc list-inside space-y-2 text-xs md:text-sm text-gray-400">
                <li>
                  <strong className="text-blue-300">데이터 원천:</strong> 대한민국 공식 데이터인 <strong>KRX(한국거래소)</strong>의 시세/수급 데이터와 <strong>DART(전자공시)</strong>의 재무제표를 실시간으로 연동하여 분석합니다. (네이버 금융과 동일한 원천 데이터를 사용합니다.)
                </li>
                <li>
                  <strong className="text-emerald-300">판단 로직:</strong> 단순한 차트 분석이 아니라, <strong>재무 건전성(40%)</strong>, <strong>수급 리스크(30%)</strong>, <strong>경쟁 우위(30%)</strong>를 종합적으로 평가하여 기관 투자자 수준의 리포트를 생성합니다.
                </li>
                <li>
                  <strong className="text-yellow-300">매매 타이밍:</strong> 최근 120일간의 주가 흐름과 거래량을 바탕으로 <strong>RSI(상대강도지수)</strong> 및 <strong>이동평균선</strong>을 계산하여 최적의 매수/매도 시점을 제안합니다.
                </li>
              </ul>
            </div>
          )}
        </header>

        {/* Macro Dashboard - Compact Mode */}
        <div className="grid grid-cols-3 gap-2 md:gap-4">
          <MacroCard
            title="USD/KRW"
            value={macroData?.usd_krw?.value}
            change={macroData?.usd_krw?.change}
            status={macroData?.usd_krw?.status}
            prefix="₩"
          />
          <MacroCard
            title="WTI Oil"
            value={macroData?.wti_oil?.value}
            change={macroData?.wti_oil?.change}
            status={macroData?.wti_oil?.status}
            prefix="$"
          />
          <MacroCard
            title="US 10Y"
            value={macroData?.us_treasury_10y?.value}
            change={macroData?.us_treasury_10y?.change}
            status={macroData?.us_treasury_10y?.status}
            prefix=""
            suffix="%"
          />
        </div>

        {/* Search Section */}
        <div className="bg-gray-800 p-4 md:p-6 rounded-2xl shadow-xl border border-gray-700 backdrop-blur-sm relative z-30">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={ticker}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="종목명/코드 (예: 삼성전자)"
                className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-gray-600 placeholder:text-[80%]"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAnalyze();
                  }
                }}
                suppressHydrationWarning={true}
              />
              {/* Dropdown */}
              {searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-600 rounded-lg shadow-2xl overflow-hidden z-[100] max-h-60 overflow-y-auto">
                  {searchResults.map((item) => (
                    <div
                      key={item.code}
                      onClick={() => selectTicker(item)}
                      className="p-3 hover:bg-gray-700 cursor-pointer flex justify-between items-center border-b border-gray-700 last:border-0"
                    >
                      <span className="font-bold text-white text-sm">{item.name}</span>
                      <span className="text-xs text-gray-400 font-mono bg-gray-900 px-2 py-1 rounded border border-gray-700">{item.code}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={() => handleAnalyze()}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-bold transition-all disabled:opacity-50 flex items-center justify-center min-w-[100px]"
            >
              {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : '분석'}
            </button>
          </div>
        </div>

        <Link
          href="/growth"
          className="block rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-950/60 to-cyan-950/40 p-5 transition-colors hover:border-emerald-400/50"
        >
          <div className="text-xs uppercase tracking-[0.3em] text-emerald-300">Growth Strategy</div>
          <div className="mt-2 text-xl font-black text-white">업종 대신 성장 패턴으로 후보를 고르는 메뉴</div>
          <div className="mt-2 text-sm text-gray-300">
            이번 달 성장형 후보, 회복형 기업, 급속 성장주를 한 화면에서 확인합니다.
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full border border-gray-700 bg-gray-950/60 px-3 py-1 text-xs text-gray-300">
              월간 후보 {growthData?.candidate_count ?? 0}개
            </span>
            {(growthData?.monthly_candidates || []).slice(0, 3).map((item: any) => (
              <span
                key={item.ticker}
                className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-200"
              >
                {item.company_name}
              </span>
            ))}
          </div>
        </Link>

        {/* Recent Analysis List */}
        {recentReports.length > 0 && (
          <div className="space-y-3 relative z-10"> {/* Lower z-index for list */}
            <h2 className="text-lg font-bold text-gray-300 px-2 flex items-center gap-2">
              <span>🕒</span> 최근 본 자료들
            </h2>
            <div className="grid gap-3">
              {recentReports.map((report) => (
                <div
                  key={report.id}
                  onClick={() => router.push(`/report/${report.ticker}`)}
                  className="bg-gray-800 p-4 rounded-xl border border-gray-700 hover:border-blue-500 cursor-pointer transition-all hover:bg-gray-800/80 group relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  <div className="flex justify-between items-center relative z-10">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-lg font-bold text-white">{report.data.company_name}</span>
                        <span className="text-xs text-gray-500 bg-gray-900 px-2 py-0.5 rounded">{report.ticker}</span>
                      </div>
                      <div className="text-xs text-gray-400 font-medium">
                        {report.data.summary.action}
                      </div>
                    </div>
                    <div className="text-right flex items-center gap-4">
                      {report.data.price && (
                        <div className="text-right hidden md:block">
                          <div className="text-white font-bold text-lg">
                            {report.data.price.current.toLocaleString()}원
                          </div>
                          <div className={`text-xs font-mono flex items-center justify-end gap-1 ${report.data.price.change > 0 ? 'text-red-400' : report.data.price.change < 0 ? 'text-blue-400' : 'text-gray-400'}`}>
                            <span>{report.data.price.change > 0 ? "▲" : "▼"}</span>
                            <span>{Math.abs(report.data.price.change).toLocaleString()}</span>
                            <span>({report.data.price.change_rate}%)</span>
                          </div>
                        </div>
                      )}

                      <div className="text-right">
                        <div className={`text-2xl font-black ${report.data.rating.includes('Buy') ? 'text-emerald-400' :
                          report.data.rating.includes('Sell') ? 'text-red-400' : 'text-yellow-400'
                          }`}>
                          {report.data.rating.split(' ')[0]}
                        </div>
                        <div className="text-xs text-gray-500 font-mono mt-1">Score: {report.data.total_score.toFixed(0)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Sentinel for Infinite Scroll */}
            {hasMore && (
              <div id="sentinel" className="h-20 flex items-center justify-center p-4">
                {loadingMore && <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>}
              </div>
            )}
            {!hasMore && recentReports.length > 0 && (
              <div className="text-center text-gray-500 text-sm py-8 border-t border-gray-800 mt-4">
                모든 리포트를 불러왔습니다.
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

function MacroCard({ title, value, change, status, prefix = "", suffix = "" }: any) {
  if (!value) return (
    <div className="bg-gray-800 p-3 rounded-xl border border-gray-700 animate-pulse h-20"></div>
  );

  const isPositive = change > 0;
  const changeColor = isPositive ? "text-red-400" : "text-blue-400";

  return (
    <div className="bg-gray-800 p-3 rounded-xl border border-gray-700 flex flex-col justify-between relative overflow-hidden group">
      <div className="flex justify-between items-start mb-1">
        <div className="text-gray-400 text-[10px] md:text-xs font-bold uppercase tracking-wider">{title}</div>
        <div className={`text-[10px] font-mono ${changeColor}`}>
          {change > 0 ? "▲" : "▼"} {Math.abs(change).toFixed(2)}
        </div>
      </div>

      <div className="flex items-baseline gap-1">
        <div className="text-lg md:text-xl font-black text-white leading-none">
          {prefix}{value.toLocaleString()}{suffix}
        </div>
      </div>

      <div className={`text-[10px] mt-2 truncate ${status.includes("High") || status.includes("Low") ? "text-blue-300" : "text-gray-500"}`}>
        {status.split('(')[0]}
      </div>
    </div>
  );
}
