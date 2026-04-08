'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import PrimaryNav from '../components/primary-nav';

type StrategyFit = {
  monthly_growth?: boolean;
  long_term?: boolean;
  short_term?: boolean;
};

type GrowthProfile = {
  key?: string;
  label?: string;
  summary?: string;
  suitable_style?: string;
  action?: string;
  confidence?: string;
  basis?: string;
  latest_growth?: number;
  latest_qoq_growth?: number;
  ttm_growth?: number;
  cagr?: number;
  latest_period?: string | null;
  latest_disclosure_date?: string | null;
  reasons?: string[];
  strategy_fit?: StrategyFit;
};

type GrowthCandidate = {
  ticker: string;
  company_name: string;
  market?: string;
  market_cap?: number;
  analysis_total_score?: number | null;
  created_at?: string | null;
  price?: {
    current?: number;
    change?: number;
    change_rate?: number;
  };
  growth_profile?: GrowthProfile;
  rating?: string;
};

type GrowthResponse = {
  generated_at?: string;
  source?: string;
  last_refresh_at?: string | null;
  snapshot_count?: number;
  universe_total?: number;
  candidate_count?: number;
  monthly_candidates?: GrowthCandidate[];
  groups?: Record<string, GrowthCandidate[]>;
};

type AiPick = {
  ticker: string;
  company_name: string;
  reason_title: string;
  reason_description: string;
};

type AiResponse = {
  monthly_briefing?: string;
  top_3?: AiPick[];
};

const groupMeta: Record<string, { label: string; description: string; accent: string }> = {
  steady_accumulation: {
    label: '우량 적립형',
    description: '장기적으로 변동성이 낮고 우상향하는 주도주입니다. 월간 리밸런싱과 장기 적립식 분할 매수에 가장 잘 맞습니다.',
    accent: 'border-emerald-500/40 bg-emerald-950/30',
  },
  cashcow_value_growth: {
    label: '캐시카우 가치성장형',
    description: '성장률은 비교적 낮으나 막강한 현금창출력(영업이익/ROE)을 갖춘 방어형 극저평가 우량주입니다.',
    accent: 'border-blue-500/40 bg-blue-950/30',
  },
  hyper_growth: {
    label: '급속 성장',
    description: '성장 속도는 강하지만 과열 위험도 큽니다. 추격매수보다 조정 구간 확인이 중요합니다.',
    accent: 'border-cyan-500/40 bg-cyan-950/30',
  },
  recovery: {
    label: '회복형 턴어라운드',
    description: '부진 이후 회복 초기 구간입니다. 실적 개선이 이어지는지 확인하면서 접근해야 합니다.',
    accent: 'border-amber-500/40 bg-amber-950/30',
  },
  slowing_growth: {
    label: '성장 둔화',
    description: '성장은 이어지지만 가속도가 약해지는 구간입니다. 보유 점검과 밸류 부담 확인이 우선입니다.',
    accent: 'border-orange-500/40 bg-orange-950/30',
  },
  stable_low_growth: {
    label: '완만 성장',
    description: '성장은 유지되지만 강한 성장주라고 보기 어려운 유형입니다. 안정성 중심 보조 후보에 가깝습니다.',
    accent: 'border-slate-500/40 bg-slate-950/30',
  },
  negative_growth: {
    label: '역성장/저성장',
    description: '최근 성장률이 둔화되거나 역성장입니다. 신규 매수보다 회복 여부 확인이 우선입니다.',
    accent: 'border-rose-500/40 bg-rose-950/30',
  },
  classified_later: {
    label: '분류 보류',
    description: '매출 추세 데이터가 부족해 성장 유형 판단을 보류한 상태입니다.',
    accent: 'border-gray-500/40 bg-gray-950/30',
  },
};

const orderedGroups = [
  'steady_accumulation',
  'cashcow_value_growth',
  'hyper_growth',
  'recovery',
  'slowing_growth',
  'stable_low_growth',
  'negative_growth',
  'classified_later',
];

const formatPercent = (value?: number) => {
  if (value === undefined || value === null || Number.isNaN(value)) return '-';
  return `${value.toFixed(1)}%`;
};

const formatDate = (value?: string | null) => {
  if (!value) return '-';
  if (value.length === 8) {
    return `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`;
  }
  return value.slice(0, 10);
};

const formatMarketCap = (value?: number) => {
  if (!value) return '-';
  if (value >= 1000000000000) return `${(value / 1000000000000).toFixed(1)}조`;
  if (value >= 100000000) return `${(value / 100000000).toFixed(0)}억`;
  return value.toLocaleString();
};

const fitTags = (fit?: StrategyFit) => {
  const tags = [];
  if (fit?.monthly_growth) tags.push('월간 후보');
  if (fit?.long_term) tags.push('장기 적합');
  if (fit?.short_term) tags.push('단기 적합');
  return tags;
};

export default function GrowthStrategyPage() {
  const [data, setData] = useState<GrowthResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const [filterType, setFilterType] = useState('all'); // all, large, mid, small
  const [sortType, setSortType] = useState('score'); // score, growth

  const [aiPicks, setAiPicks] = useState<AiResponse | null>(null);
  const [aiLoading, setAiLoading] = useState(true);
  const [aiError, setAiError] = useState<string | null>(null);

  const filteredCandidates = useMemo(() => {
    if (!data?.monthly_candidates) return [];
    let items = [...data.monthly_candidates];

    if (filterType === 'large') items = items.filter((item) => (item.market_cap || 0) >= 1_000_000_000_000);
    else if (filterType === 'mid') items = items.filter((item) => (item.market_cap || 0) >= 200_000_000_000 && (item.market_cap || 0) < 1_000_000_000_000);
    else if (filterType === 'small') items = items.filter((item) => (item.market_cap || 0) < 200_000_000_000);

    if (sortType === 'score') {
      items.sort((a, b) => (b.analysis_total_score || 0) - (a.analysis_total_score || 0));
    } else if (sortType === 'growth') {
      items.sort((a, b) => {
        const aGrowth = a.growth_profile?.latest_growth || 0;
        const bGrowth = b.growth_profile?.latest_growth || 0;
        return bGrowth - aGrowth;
      });
    }

    return items;
  }, [data, filterType, sortType]);

  const fetchGrowth = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/growth-strategy?limit=48');
      if (!res.ok) {
        throw new Error(`API error ${res.status}`);
      }
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error(err);
      setError('성장형 전략 데이터를 불러오지 못했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAiPicks = async () => {
    try {
      setAiLoading(true);
      setAiError(null);
      const res = await fetch('/api/growth-strategy/ai-picks');
      if (!res.ok) throw new Error(`API error ${res.status}`);
      const json = await res.json();
      setAiPicks(json);
    } catch (err) {
      console.error(err);
      setAiError('AI 큐레이션을 불러오지 못했습니다.');
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    fetchGrowth();
    fetchAiPicks();
  }, []);

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      const existing = data?.snapshot_count || 0;
      const res = await fetch(`/api/growth-strategy/refresh?limit=120&offset=${existing}`, {
        method: 'POST',
      });
      if (!res.ok) {
        throw new Error(`Refresh error ${res.status}`);
      }
      await res.json();
      await fetchGrowth();
    } catch (err) {
      console.error(err);
      alert('성장형 스크리너 갱신 중 오류가 발생했습니다.');
    } finally {
      setRefreshing(false);
    }
  };

  const visibleGroups = useMemo(() => {
    const groups = data?.groups || {};
    return orderedGroups.map((key) => ({
      key,
      meta: groupMeta[key],
      items: groups[key] || [],
    }));
  }, [data]);

  return (
    <main className="min-h-screen bg-gray-900 px-4 py-8 text-gray-100 md:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <PrimaryNav />

        <header className="rounded-3xl border border-gray-800 bg-gradient-to-br from-gray-950 via-gray-900 to-emerald-950/30 p-6 md:p-8">
          <div className="text-xs uppercase tracking-[0.3em] text-emerald-300">Growth Strategy</div>
          <h1 className="mt-3 text-3xl font-black text-white md:text-5xl">성장형 전략</h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-gray-300 md:text-base">
            업종이 아니라 성장 패턴으로 후보를 고르는 화면입니다. 목표는 이번 달에 볼 종목군을 먼저 좁히고,
            각 종목의 리포트에서 매수·보유·관망 결론을 이어서 판단하는 것입니다.
          </p>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <div className="rounded-2xl border border-gray-800 bg-gray-950/60 p-4">
              <div className="text-xs text-gray-500">1단계</div>
              <div className="mt-1 font-semibold text-white">성장 유형 분류</div>
              <div className="mt-2 text-sm text-gray-400">지속 성장, 급속 성장, 회복형, 둔화형으로 나눕니다.</div>
            </div>
            <div className="rounded-2xl border border-gray-800 bg-gray-950/60 p-4">
              <div className="text-xs text-gray-500">2단계</div>
              <div className="mt-1 font-semibold text-white">월간 후보 압축</div>
              <div className="mt-2 text-sm text-gray-400">월 1회 리밸런싱 관점에서 볼 만한 종목만 먼저 추립니다.</div>
            </div>
            <div className="rounded-2xl border border-gray-800 bg-gray-950/60 p-4">
              <div className="text-xs text-gray-500">3단계</div>
              <div className="mt-1 font-semibold text-white">종목 리포트 연결</div>
              <div className="mt-2 text-sm text-gray-400">후보를 클릭해 실제 매수·보유·단타 판단으로 이어집니다.</div>
            </div>
          </div>
          <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-gray-800 bg-gray-950/60 p-4 md:flex-row md:items-center md:justify-between">
            <div className="text-sm text-gray-300">
              <div>커버리지: {data?.snapshot_count || 0} / {data?.universe_total || 0} 종목</div>
              <div className="mt-1 text-xs text-gray-500">
                기준 데이터: 최근 분기 공시 매출 + 월간 가격/시총 스냅샷
                {data?.last_refresh_at ? ` / 마지막 갱신 ${formatDate(data.last_refresh_at)}` : ''}
              </div>
            </div>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-200 transition-colors hover:border-emerald-400/60 hover:text-white disabled:opacity-50"
            >
              {refreshing ? '상위 종목 스캔 중...' : '전종목 스크리너 추가 갱신'}
            </button>
          </div>
        </header>

        {aiLoading && (
          <section className="rounded-2xl border border-indigo-500/30 bg-indigo-950/20 p-6 text-sm text-indigo-300 animate-pulse text-center font-bold tracking-wide shadow-lg shadow-indigo-900/20">
            ✨ Gemini AI가 이 달의 최고 성장주를 분석하고 있습니다...
          </section>
        )}

        {aiError && !aiLoading && (
          <section className="rounded-2xl border border-rose-500/30 bg-rose-950/20 p-6 text-sm text-rose-200">
            {aiError}
          </section>
        )}

        {!aiLoading && !aiError && aiPicks && (aiPicks.top_3 || []).length > 0 && (
          <section className="rounded-3xl border border-indigo-500/40 bg-gradient-to-r from-indigo-950/50 via-purple-950/30 to-gray-900 p-6 md:p-8 shadow-2xl shadow-indigo-500/10 relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/30 blur-3xl rounded-full mix-blend-screen pointer-events-none"></div>
            <div className="flex items-center gap-2 text-indigo-300 relative z-10">
              <span className="text-2xl animate-pulse">👑</span>
              <h2 className="text-xl md:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">Gemini AI가 뽑은 이번 달 성장주 TOP 3</h2>
            </div>

            <div className="mt-5 rounded-xl border border-indigo-500/20 bg-indigo-900/40 p-4 relative z-10 backdrop-blur-sm">
              <div className="text-xs uppercase tracking-widest text-indigo-400 font-bold mb-2 flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span> AI Market Briefing</div>
              <p className="text-sm leading-6 text-indigo-100/90 italic">
                "{aiPicks.monthly_briefing}"
              </p>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-3 relative z-10">
              {aiPicks.top_3?.map((pick, i) => (
                <Link
                  key={pick.ticker}
                  href={`/report/${pick.ticker}`}
                  className="block rounded-2xl border border-indigo-500/20 bg-gray-950/80 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-indigo-400/60 hover:bg-indigo-950/60 hover:shadow-[0_8px_30px_rgb(99,102,241,0.15)] relative overflow-hidden group"
                >
                  <div className="absolute top-0 right-0 p-3 pr-4 text-6xl opacity-[0.03] font-black group-hover:text-indigo-400 group-hover:opacity-10 transition-all duration-500 transform group-hover:scale-110 italic">{i + 1}</div>
                  <div className="flex items-center gap-2">
                    <div className="font-bold text-white text-lg tracking-tight">{pick.company_name}</div>
                    <div className="text-[10px] font-mono font-medium text-emerald-300/80 border border-emerald-300/20 bg-emerald-950/30 px-1.5 py-0.5 rounded shadow-sm">{pick.ticker}</div>
                  </div>
                  <div className="mt-4 font-bold text-indigo-300 text-sm leading-5 pr-4 tracking-tight">{pick.reason_title}</div>
                  <div className="mt-2 text-xs leading-relaxed text-gray-400 group-hover:text-gray-300 transition-colors line-clamp-3">{pick.reason_description}</div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {loading && (
          <section className="rounded-2xl border border-gray-800 bg-gray-900/70 p-6 text-sm text-gray-400">
            성장형 전략 데이터를 불러오는 중입니다.
          </section>
        )}

        {error && !loading && (
          <section className="rounded-2xl border border-rose-500/30 bg-rose-950/20 p-6 text-sm text-rose-200">
            {error}
          </section>
        )}

        {!loading && !error && data && (
          <>
            <section className="grid gap-4 md:grid-cols-[1.4fr_1fr]">
              <div className="rounded-2xl border border-emerald-500/20 bg-gray-900/70 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-xs uppercase tracking-[0.28em] text-emerald-300">This Month's Top Picks</div>
                    <h2 className="mt-2 text-xl font-black text-white md:text-2xl">이 달의 큐레이션</h2>
                  </div>
                  <div className="rounded-2xl border border-gray-800 bg-gray-950/70 px-4 py-3 text-right">
                    <div className="text-xs text-gray-500">후보 수</div>
                    <div className="text-2xl font-black text-white">{data.candidate_count || 0}</div>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-6 text-gray-400">
                  시장 유동성과 밸류에이션, 그리고 최근 실적 성장률을 종합해 도출된 이 달의 핵심 후보군입니다.
                  성장 스타일별로 가장 돋보이는 기업들을 제안합니다.
                </p>
                <div className="mt-5 flex flex-wrap gap-2 md:gap-4 md:items-center">
                  <div className="flex bg-gray-950/80 rounded-full p-1 border border-gray-800 text-xs">
                    <button onClick={() => setFilterType('all')} className={`px-4 py-1.5 rounded-full transition-colors ${filterType === 'all' ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-gray-400 hover:text-gray-200'}`}>전체</button>
                    <button onClick={() => setFilterType('large')} className={`px-4 py-1.5 rounded-full transition-colors ${filterType === 'large' ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-gray-400 hover:text-gray-200'}`}>대형주(1조+)</button>
                    <button onClick={() => setFilterType('mid')} className={`px-4 py-1.5 rounded-full transition-colors ${filterType === 'mid' ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-gray-400 hover:text-gray-200'}`}>중소형주</button>
                    <button onClick={() => setFilterType('small')} className={`px-4 py-1.5 rounded-full transition-colors ${filterType === 'small' ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-gray-400 hover:text-gray-200'}`}>소형주</button>
                  </div>

                  <div className="flex bg-gray-950/80 rounded-full p-1 border border-gray-800 text-xs md:ml-auto">
                    <button onClick={() => setSortType('score')} className={`px-4 py-1.5 rounded-full transition-colors ${sortType === 'score' ? 'bg-gray-800 text-white font-bold' : 'text-gray-400 hover:text-gray-200'}`}>점수순</button>
                    <button onClick={() => setSortType('growth')} className={`px-4 py-1.5 rounded-full transition-colors ${sortType === 'growth' ? 'bg-gray-800 text-white font-bold' : 'text-gray-400 hover:text-gray-200'}`}>성장률순</button>
                  </div>
                </div>

                <div className="mt-5 grid gap-3">
                  {filteredCandidates.length === 0 && (
                    <div className="rounded-2xl border border-gray-800 bg-gray-950/60 p-4 text-sm text-gray-400">
                      조건에 맞는 월간 큐레이션 후보가 없습니다.
                    </div>
                  )}

                  {filteredCandidates.map((item, index) => {
                    const profile = item.growth_profile || {};
                    const tags = fitTags(profile.strategy_fit);
                    const changeRate = item.price?.change_rate;
                    const longTermMetric = typeof profile.ttm_growth === 'number' ? profile.ttm_growth : profile.cagr;
                    const longTermLabel = profile.basis === 'quarterly' ? 'TTM 성장률' : '장기 CAGR';

                    // Determine highlight color based on action & profile
                    let cardBorder = 'border-gray-800 hover:border-emerald-400/40';
                    let actionColor = 'text-gray-300';
                    if (profile.action && profile.action.includes('매수')) {
                      cardBorder = 'border-emerald-500/40 hover:border-emerald-400/80';
                      actionColor = 'text-emerald-300 font-semibold';
                    } else if (profile.action && profile.action.includes('주의')) {
                      cardBorder = 'border-rose-500/30 hover:border-rose-400/60';
                      actionColor = 'text-rose-300';
                    } else if (profile.action && profile.action.includes('턴어라운드')) {
                      cardBorder = 'border-amber-500/30 hover:border-amber-400/60';
                      actionColor = 'text-amber-300 font-semibold';
                    }

                    return (
                      <Link
                        key={`top-pick-${item.ticker || index}-${index}`}
                        href={`/report/${item.ticker}`}
                        className={`block rounded-2xl border bg-gray-950/60 p-4 transition-colors ${cardBorder}`}
                      >
                        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <div className="text-lg font-bold text-white">{item.company_name}</div>
                              <div className="rounded-full border border-gray-700 px-2 py-0.5 font-mono text-xs text-gray-400">
                                {item.ticker}
                              </div>
                              <div className="rounded-full border border-gray-700 bg-gray-800/50 px-2 py-0.5 text-xs text-gray-300 font-medium">
                                {profile.label || '미분류'}
                              </div>
                            </div>

                            {/* Action Insight Statement */}
                            <div className={`mt-3 flex items-start gap-2 ${actionColor}`}>
                              <span className="mt-0.5 text-[10px] uppercase tracking-wider opacity-60">💡 Insight</span>
                              <span className="text-sm">{profile.action || '분석 진행 중'}</span>
                            </div>

                            <div className="mt-1 text-xs leading-5 text-gray-400 max-w-lg">{profile.summary}</div>

                            <div className="mt-3 flex flex-wrap gap-2">
                              {tags.map((tag) => (
                                <span key={tag} className="rounded-full border border-gray-700/50 bg-gray-800/30 px-2 py-0.5 text-xs text-gray-400">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="mt-2 grid min-w-[200px] grid-cols-2 gap-2 text-sm md:mt-0 md:text-right">
                            <div className="rounded-xl border border-gray-800 bg-gray-900/60 px-3 py-2">
                              <div className="text-[11px] text-gray-500">최근 성장률</div>
                              <div className="mt-1 font-bold text-emerald-300">{formatPercent(profile.latest_growth)}</div>
                            </div>
                            <div className="rounded-xl border border-gray-800 bg-gray-900/60 px-3 py-2">
                              <div className="text-[11px] text-gray-500">{longTermLabel}</div>
                              <div className="mt-1 font-bold text-cyan-300">{formatPercent(longTermMetric)}</div>
                            </div>
                            <div className="col-span-2 hidden md:block mt-1">
                              <div className="text-[10px] text-gray-600">
                                공시일: {formatDate(profile.latest_disclosure_date)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-2xl border border-gray-800 bg-gray-900/70 p-5">
                <div className="text-xs uppercase tracking-[0.28em] text-gray-500">Execution</div>
                <h2 className="mt-2 text-xl font-black text-white">운영 원칙</h2>
                <div className="mt-4 space-y-4 text-sm leading-6 text-gray-300">
                  <div className="rounded-2xl border border-gray-800 bg-gray-950/60 p-4">
                    <div className="font-semibold text-white">월간 리밸런싱</div>
                    <div className="mt-1 text-gray-400">최근 분기 공시가 유지되는 동안에도 월 1회 가격/유동성 조건으로 후보를 다시 정렬합니다.</div>
                  </div>
                  <div className="rounded-2xl border border-gray-800 bg-gray-950/60 p-4">
                    <div className="font-semibold text-white">실적 기준일을 지켜야 함</div>
                    <div className="mt-1 text-gray-400">성장 판단은 공시 발표일 이후부터만 유효합니다. 그래야 백테스트 왜곡이 줄어듭니다.</div>
                  </div>
                  <div className="rounded-2xl border border-gray-800 bg-gray-950/60 p-4">
                    <div className="font-semibold text-white">전종목을 한 번에 보기 위한 화면</div>
                    <div className="mt-1 text-gray-400">개별 조회 이력과 무관하게 유니버스를 계속 쌓아두는 구조입니다. 실제 매매는 종목 리포트에서 마무리합니다.</div>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <div>
                <div className="text-xs uppercase tracking-[0.28em] text-gray-500">Groups</div>
                <h2 className="mt-2 text-2xl font-black text-white">성장 유형별 분류</h2>
                <p className="mt-2 text-sm leading-6 text-gray-400">
                  각 종목을 업종이 아니라 성장 패턴 기준으로 나눴습니다. 같은 업종이라도 성장 유형이 다르면
                  매수 전략과 보유 전략이 달라집니다.
                </p>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                {visibleGroups.map(({ key, meta, items }) => (
                  <section key={key} className={`rounded-2xl border p-5 ${meta.accent}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-black text-white">{meta.label}</h3>
                        <p className="mt-2 text-sm leading-6 text-gray-300">{meta.description}</p>
                      </div>
                      <div className="rounded-2xl border border-gray-800 bg-gray-950/60 px-3 py-2 text-right">
                        <div className="text-[11px] text-gray-500">종목 수</div>
                        <div className="text-xl font-black text-white">{items.length}</div>
                      </div>
                    </div>

                    <div className="mt-4 space-y-3">
                      {items.length === 0 && (
                        <div className="rounded-2xl border border-gray-800 bg-gray-950/60 p-4 text-sm text-gray-400">
                          현재 저장된 종목 중 해당 유형은 없습니다.
                        </div>
                      )}

                      {items.slice(0, 6).map((item, index) => {
                        const profile = item.growth_profile || {};
                        const longTermMetric = typeof profile.ttm_growth === 'number' ? profile.ttm_growth : profile.cagr;
                        return (
                          <Link
                            key={`group-${key}-item-${item.ticker || index}-${index}`}
                            href={`/report/${item.ticker}`}
                            className="block rounded-2xl border border-gray-800 bg-gray-950/60 p-4 transition-colors hover:border-white/20"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <div className="flex flex-wrap items-center gap-2">
                                  <div className="font-semibold text-white">{item.company_name}</div>
                                  <div className="font-mono text-xs text-gray-500">{item.ticker}</div>
                                </div>
                                <div className="mt-2 text-sm text-gray-300">{profile.action}</div>
                                <div className="mt-1 text-sm leading-6 text-gray-400">{profile.suitable_style}</div>
                              </div>
                              <div className="min-w-[92px] text-right">
                                <div className="text-[11px] text-gray-500">최근 성장률</div>
                                <div className="mt-1 font-bold text-emerald-300">{formatPercent(profile.latest_growth)}</div>
                                <div className="mt-1 text-[11px] text-gray-500">
                                  {profile.basis === 'quarterly' ? 'TTM' : 'CAGR'} {formatPercent(longTermMetric)}
                                </div>
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </section>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
