import React, { useState, useMemo, useEffect } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  MapPin,
  Store,
  IndianRupee,
  ExternalLink,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Scale,
  ArrowRight,
  Info,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import { APMC_RECORDS, APMC_STATES, APMCRecord } from '../data/apmcData';
import { Crop, GroundingWebSource, LanguageCode, UserFarmingConditions } from '../types';
import { getGlobalUI } from '../data/uiTranslations';
import { TTSButton } from './TTSButton';

interface APMCMarketIntelligenceProps {
  language: LanguageCode;
  userConditions: UserFarmingConditions;
  recommendedCrops: Crop[];
  onAskMarketAI: (prompt: string, cropName: string) => void;
  onSelectCropToCompare?: (crop: Crop) => void;
}

export const APMCMarketIntelligence: React.FC<APMCMarketIntelligenceProps> = ({
  language,
  userConditions,
  recommendedCrops,
  onAskMarketAI,
}) => {
  const ui = getGlobalUI(language);
  const [selectedState, setSelectedState] = useState<string>('All States');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('All Districts');
  const [selectedMandi, setSelectedMandi] = useState<string>('All Mandis');
  const [selectedCommodity, setSelectedCommodity] = useState<string>('All Commodities');
  const [activeChartRecord, setActiveChartRecord] = useState<APMCRecord>(APMC_RECORDS[0]);
  const [liveRecords, setLiveRecords] = useState<APMCRecord[]>(APMC_RECORDS);
  const [feedMode, setFeedMode] = useState<'verified_benchmark' | 'live_agmarknet'>('verified_benchmark');
  const [isSearchingWebMandi, setIsSearchingWebMandi] = useState(false);
  const [webMandiResult, setWebMandiResult] = useState<{
    summary: string;
    groundingLinks: GroundingWebSource[];
    modelUsed: string;
  } | null>(null);

  const handleLiveGoogleSearchMandi = async (record: APMCRecord) => {
    setIsSearchingWebMandi(true);
    try {
      const res = await fetch('/api/apmc-live-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cropName: record.commodity,
          state: record.state,
          mandi: record.mandi,
          language,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setWebMandiResult({
          summary: data.summary || '',
          groundingLinks: Array.isArray(data.groundingLinks) ? data.groundingLinks : [],
          modelUsed: data.modelUsed || 'Google Search Grounded',
        });
      }
    } catch {
      // ignore error
    } finally {
      setIsSearchingWebMandi(false);
    }
  };

  const marketMovers = useMemo(() => {
    const rising = liveRecords.filter((r) => r.trend === 'rising').sort((a, b) => b.trendPercent - a.trendPercent);
    const falling = liveRecords.filter((r) => r.trend === 'falling').sort((a, b) => a.trendPercent - b.trendPercent);
    const stable = liveRecords.filter((r) => r.trend === 'stable');
    return { rising, falling, stable };
  }, [liveRecords]);

  // Check if backend has live data.gov.in AGMARKNET records available
  useEffect(() => {
    let active = true;
    fetch('/api/apmc-prices')
      .then((r) => r.json())
      .then((data) => {
        if (active && data && Array.isArray(data.records) && data.records.length > 0) {
          setLiveRecords(data.records);
          setFeedMode(data.isLiveGovFeed ? 'live_agmarknet' : 'verified_benchmark');
          setActiveChartRecord(data.records[0]);
        }
      })
      .catch(() => {
        // Keep verified benchmark records
      });
    return () => {
      active = false;
    };
  }, []);

  // Dynamically derive districts, mandis, and commodities from available records
  const availableDistricts = useMemo(() => {
    const base =
      selectedState === 'All States'
        ? liveRecords
        : liveRecords.filter((r) => r.state === selectedState);
    return Array.from(new Set(base.map((r) => r.district)));
  }, [liveRecords, selectedState]);

  const availableMandis = useMemo(() => {
    const base = liveRecords.filter(
      (r) =>
        (selectedState === 'All States' || r.state === selectedState) &&
        (selectedDistrict === 'All Districts' || r.district === selectedDistrict)
    );
    return Array.from(new Set(base.map((r) => r.mandi)));
  }, [liveRecords, selectedState, selectedDistrict]);

  const availableCommodities = useMemo(() => {
    return Array.from(new Set(liveRecords.map((r) => r.commodity)));
  }, [liveRecords]);

  // Reset dependent filters when parent filter changes
  const handleStateChange = (newState: string) => {
    setSelectedState(newState);
    setSelectedDistrict('All Districts');
    setSelectedMandi('All Mandis');
  };

  const handleDistrictChange = (newDist: string) => {
    setSelectedDistrict(newDist);
    setSelectedMandi('All Mandis');
  };

  const filteredRecords = useMemo(() => {
    return liveRecords.filter((r) => {
      if (selectedState !== 'All States' && r.state !== selectedState) return false;
      if (selectedDistrict !== 'All Districts' && r.district !== selectedDistrict) return false;
      if (selectedMandi !== 'All Mandis' && r.mandi !== selectedMandi) return false;
      if (selectedCommodity !== 'All Commodities' && r.commodity !== selectedCommodity) return false;
      return true;
    });
  }, [liveRecords, selectedState, selectedDistrict, selectedMandi, selectedCommodity]);

  // Keep activeChartRecord synced with filtered results
  useEffect(() => {
    if (filteredRecords.length > 0 && !filteredRecords.some((r) => r.id === activeChartRecord.id)) {
      setActiveChartRecord(filteredRecords[0]);
    }
  }, [filteredRecords, activeChartRecord.id]);

  const renderTrendIndicator = (record: APMCRecord) => {
    if (record.trend === 'rising') {
      return (
        <span className="inline-flex items-center gap-1 font-bold text-emerald-700 text-xs">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>↑ Rising (+{record.trendPercent}%)</span>
        </span>
      );
    }
    if (record.trend === 'falling') {
      return (
        <span className="inline-flex items-center gap-1 font-bold text-amber-700 text-xs">
          <TrendingDown className="w-3.5 h-3.5" />
          <span>↓ Falling ({record.trendPercent}%)</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 font-bold text-sky-700 text-xs">
        <Minus className="w-3.5 h-3.5" />
        <span>→ Stable (+{record.trendPercent}%)</span>
      </span>
    );
  };

  const speechOverview = useMemo(() => {
    const top = filteredRecords[0] || activeChartRecord;
    if (language === 'kn') {
      return `ಎಪಿಎಂಸಿ ಮಾರುಕಟ್ಟೆ ಧಾರಣೆ: ${top.mandi} ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ${top.commodityKn} ಮಾದರಿ ಬೆಲೆ ಕ್ವಿಂಟಾಲ್‌ಗೆ ${top.modalPrice} ರೂಪಾಯಿ. ಕನಿಷ್ಠ ಬೆಲೆ ${top.minPrice} ಮತ್ತು ಗರಿಷ್ಠ ಬೆಲೆ ${top.maxPrice} ರೂಪಾಯಿ.`;
    }
    return `APMC Market Intelligence: In ${top.mandi}, ${top.commodity} modal price is ${top.modalPrice} rupees per quintal, with minimum ${top.minPrice} and maximum ${top.maxPrice} rupees per quintal.`;
  }, [filteredRecords, activeChartRecord, language]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero Banner for APMC Market Intelligence */}
      <div className="bg-gradient-to-r from-emerald-800 via-green-700 to-sky-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
              <Store className="w-4 h-4" />
              <span>1. APMC Market Intelligence · AGMARKNET & e-NAM Reference</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-heading">
              {language === 'kn'
                ? 'ಮಂಡಿ / ಎಪಿಎಂಸಿ ಮಾರುಕಟ್ಟೆ ಧಾರಣೆ ಮತ್ತು ಬೆಳೆ ಸೂಕ್ತತೆ'
                : language === 'hi'
                ? 'मंडी / APMC बाज़ार भाव और फसल उपयुक्तता'
                : 'Mandi / APMC Prices & Crop Suitability Matrix'}
            </h2>
            <p className="text-sm text-emerald-50 leading-relaxed">
              {language === 'kn'
                ? '“ಈ ಬೆಳೆ ನನ್ನ ಭೂಮಿಗೆ ಸೂಕ್ತವೇ?” + “ಇದರ ಪ್ರಸ್ತುತ ಮಾರುಕಟ್ಟೆ ಬೆಲೆ ಎಷ್ಟು?” — ಎರಡನ್ನೂ ಒಂದೇ ಕಡೆ ಹೋಲಿಸಿ ನಿರ್ಧರಿಸಿ.'
                : 'Compare verified APMC Mandi prices alongside your land’s soil & water suitability before you sow.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <TTSButton
              id="apmc-intelligence-overview"
              title="APMC Market Intelligence Overview"
              textToSpeak={speechOverview}
              language={language}
              size="md"
              variant="pill"
            />
            <a
              href="https://enam.gov.in/web/dashboard/trade-data"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold flex items-center gap-1.5 border border-white/25 transition-colors"
            >
              <span>Official e-NAM Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>

      {/* Data Provenance & Anti-Hallucination Transparency Notice */}
      <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-sky-950">
        <div className="flex items-start gap-2.5">
          <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Data Integrity & Verification Status: </span>
            {feedMode === 'live_agmarknet' ? (
              <span>
                Connected to live Government of India Open Data API (`data.gov.in` AGMARKNET feed).
              </span>
            ) : (
              <span>
                Showing verified official AGMARKNET / e-NAM & CACP MSP 2025–26/2026–27 seasonal benchmark snapshots. Dates and sources are explicitly labeled — BHUMITRA never fabricates prices or mislabels historical reference data as live auction ticks.
              </span>
            )}
          </div>
        </div>
        <a
          href="https://agmarknet.gov.in/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sky-700 hover:text-sky-900 font-bold underline whitespace-nowrap shrink-0 flex items-center gap-1"
        >
          <span>Verify on AGMARKNET</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* NOTABLE MARKET MOVEMENTS: 📈 Rising | ➡️ Stable | 📉 Falling */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-emerald-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">{ui.apmc.marketMoversTitle}</h3>
            <p className="text-xs text-slate-600">{ui.apmc.marketMoversSub}</p>
          </div>
          <TTSButton
            id="apmc-market-movers-tts"
            title={ui.apmc.marketMoversTitle}
            textToSpeak={`${ui.apmc.marketMoversTitle}. ${ui.apmc.risingLabel}: ${marketMovers.rising
              .slice(0, 3)
              .map((r) => `${language === 'kn' ? r.commodityKn : r.commodity} ₹${r.modalPrice}`)
              .join(', ')}. ${ui.apmc.stableLabel}: ${marketMovers.stable
              .slice(0, 2)
              .map((r) => `${language === 'kn' ? r.commodityKn : r.commodity} ₹${r.modalPrice}`)
              .join(', ')}.`}
            language={language}
            size="sm"
            variant="secondary"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 📈 Rising */}
          <div className="p-4 rounded-2xl bg-emerald-50/90 border border-emerald-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-700 text-white text-xs font-extrabold">
                <TrendingUp className="w-3.5 h-3.5" />
                {ui.apmc.risingLabel}
              </span>
              <span className="text-[11px] font-bold text-emerald-800">Strong Mandi Demand</span>
            </div>
            <div className="space-y-2">
              {marketMovers.rising.slice(0, 3).map((rec) => (
                <button
                  key={rec.id}
                  type="button"
                  onClick={() => setActiveChartRecord(rec)}
                  className="w-full text-left p-2.5 rounded-xl bg-white hover:bg-emerald-100/60 border border-emerald-200/80 flex items-center justify-between transition-colors cursor-pointer"
                >
                  <div>
                    <p className="text-xs font-extrabold text-slate-900">
                      {language === 'kn' ? rec.commodityKn : language === 'hi' ? rec.commodityHi : rec.commodity}
                    </p>
                    <p className="text-[11px] text-slate-500">{rec.mandi}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-extrabold text-emerald-800 font-mono">
                      ₹{rec.modalPrice.toLocaleString('en-IN')}/qtl
                    </p>
                    <span className="text-[11px] font-bold text-emerald-700">📈 +{rec.trendPercent}%</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* ➡️ Stable */}
          <div className="p-4 rounded-2xl bg-sky-50/90 border border-sky-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-sky-700 text-white text-xs font-extrabold">
                <Minus className="w-3.5 h-3.5" />
                {ui.apmc.stableLabel}
              </span>
              <span className="text-[11px] font-bold text-sky-800">Steady MSP Backed</span>
            </div>
            <div className="space-y-2">
              {marketMovers.stable.slice(0, 3).map((rec) => (
                <button
                  key={rec.id}
                  type="button"
                  onClick={() => setActiveChartRecord(rec)}
                  className="w-full text-left p-2.5 rounded-xl bg-white hover:bg-sky-100/60 border border-sky-200/80 flex items-center justify-between transition-colors cursor-pointer"
                >
                  <div>
                    <p className="text-xs font-extrabold text-slate-900">
                      {language === 'kn' ? rec.commodityKn : language === 'hi' ? rec.commodityHi : rec.commodity}
                    </p>
                    <p className="text-[11px] text-slate-500">{rec.mandi}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-extrabold text-sky-900 font-mono">
                      ₹{rec.modalPrice.toLocaleString('en-IN')}/qtl
                    </p>
                    <span className="text-[11px] font-bold text-sky-700">
                      ➡️ +{rec.trendPercent}% (MSP ₹{rec.mspBenchmark})
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 📉 Falling */}
          <div className="p-4 rounded-2xl bg-amber-50/90 border border-amber-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-600 text-white text-xs font-extrabold">
                <TrendingDown className="w-3.5 h-3.5" />
                {ui.apmc.fallingLabel}
              </span>
              <span className="text-[11px] font-bold text-amber-900">High Arrival Pressure</span>
            </div>
            <div className="space-y-2">
              {marketMovers.falling.slice(0, 3).map((rec) => (
                <button
                  key={rec.id}
                  type="button"
                  onClick={() => setActiveChartRecord(rec)}
                  className="w-full text-left p-2.5 rounded-xl bg-white hover:bg-amber-100/60 border border-amber-200/80 flex items-center justify-between transition-colors cursor-pointer"
                >
                  <div>
                    <p className="text-xs font-extrabold text-slate-900">
                      {language === 'kn' ? rec.commodityKn : language === 'hi' ? rec.commodityHi : rec.commodity}
                    </p>
                    <p className="text-[11px] text-slate-500">{rec.mandi}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-extrabold text-amber-950 font-mono">
                      ₹{rec.modalPrice.toLocaleString('en-IN')}/qtl
                    </p>
                    <span className="text-[11px] font-bold text-amber-800">📉 {rec.trendPercent}%</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4-Selector Filter Bar: State | District | APMC/Mandi | Crop/Commodity */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold text-slate-900 font-heading">
            {language === 'kn'
              ? 'ಮಾರುಕಟ್ಟೆ ಮತ್ತು ಬೆಳೆ ಆಯ್ಕೆ ಮಾಡಿ (ರಾಜ್ಯ · ಜಿಲ್ಲೆ · ಎಪಿಎಂಸಿ · ಬೆಳೆ)'
              : 'Filter Mandi Prices by State, District, APMC & Commodity'}
          </h3>
          <button
            type="button"
            onClick={() => {
              setSelectedState('All States');
              setSelectedDistrict('All Districts');
              setSelectedMandi('All Mandis');
              setSelectedCommodity('All Commodities');
            }}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-900"
          >
            Reset Filters ({filteredRecords.length} markets)
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. State */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">
              1. State (ರಾಜ್ಯ / राज्य)
            </label>
            <select
              value={selectedState}
              onChange={(e) => handleStateChange(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500"
            >
              <option value="All States">All States (India)</option>
              {APMC_STATES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* 2. District */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">
              2. District (ಜಿಲ್ಲೆ / जिला)
            </label>
            <select
              value={selectedDistrict}
              onChange={(e) => handleDistrictChange(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500"
            >
              <option value="All Districts">All Districts</option>
              {availableDistricts.map((dist) => (
                <option key={dist} value={dist}>
                  {dist}
                </option>
              ))}
            </select>
          </div>

          {/* 3. APMC / Mandi */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">
              3. APMC / Mandi (ಮಾರುಕಟ್ಟೆ / मंडी)
            </label>
            <select
              value={selectedMandi}
              onChange={(e) => setSelectedMandi(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500"
            >
              <option value="All Mandis">All APMC Mandis</option>
              {availableMandis.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Crop / Commodity */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">
              4. Crop / Commodity (ಬೆಳೆ / फसल)
            </label>
            <select
              value={selectedCommodity}
              onChange={(e) => setSelectedCommodity(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500"
            >
              <option value="All Commodities">All Commodities</option>
              {availableCommodities.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* COMBINED DECISION ENGINE: "Is this crop suitable for my land?" + "What is its current market price?" */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-200 shadow-md space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <span className="text-xs font-bold text-emerald-700">
              Combined Agronomic + Market Profitability View
            </span>
            <h3 className="text-xl font-extrabold text-slate-900 font-heading">
              {language === 'kn'
                ? '“ಈ ಬೆಳೆ ನನ್ನ ಭೂಮಿಗೆ ಸೂಕ್ತವೇ?” + “ಇದರ ಪ್ರಸ್ತುತ ಮಾರುಕಟ್ಟೆ ಬೆಲೆ ಎಷ್ಟು?”'
                : '“Is this crop suitable for my land?” + “What is its current market price?”'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Evaluated for your {userConditions.location || 'Karnataka'} farm ({userConditions.soilType.toUpperCase()} soil · {userConditions.season.toUpperCase()} season · {userConditions.rainfall} mm rain)
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {recommendedCrops.slice(0, 3).map((crop, idx) => {
            const matchingApmc =
              liveRecords.find(
                (r) =>
                  r.cropId === crop.id &&
                  r.state.toLowerCase() === (userConditions.location || '').toLowerCase()
              ) || liveRecords.find((r) => r.cropId === crop.id);

            const aboveMsp =
              matchingApmc && matchingApmc.mspBenchmark
                ? matchingApmc.modalPrice >= matchingApmc.mspBenchmark
                : true;

            return (
              <div
                key={crop.id}
                className="rounded-2xl border border-slate-200 p-5 flex flex-col justify-between space-y-4 hover:border-emerald-400 transition-colors bg-slate-50/40"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-xs font-semibold text-slate-500">
                        Rank #{idx + 1} · {crop.category}
                      </span>
                      <h4 className="text-lg font-extrabold text-slate-900 font-heading">
                        {crop.name} ({crop.localNames.kn})
                      </h4>
                    </div>
                  </div>

                  {/* Dual Question Comparison Split */}
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    {/* Q1: Land Suitability */}
                    <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200">
                      <span className="text-[11px] font-bold text-emerald-900 block">
                        1. Land Suitability
                      </span>
                      <span className="text-xl font-extrabold text-emerald-700 font-mono tabular-nums block mt-0.5">
                        {crop.suitabilityPercentage || 92}%
                      </span>
                      <span className="text-[11px] text-emerald-800 block mt-0.5">
                        Matches {userConditions.soilType} soil & {userConditions.waterAvailability} water
                      </span>
                    </div>

                    {/* Q2: APMC Market Price */}
                    <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200">
                      <span className="text-[11px] font-bold text-amber-950 block">
                        2. Modal APMC Price
                      </span>
                      <span className="text-xl font-extrabold text-slate-900 font-mono tabular-nums block mt-0.5">
                        {matchingApmc ? `₹${matchingApmc.modalPrice.toLocaleString('en-IN')}` : 'MSP Backed'}
                      </span>
                      <div className="mt-0.5">
                        {matchingApmc ? (
                          renderTrendIndicator(matchingApmc)
                        ) : (
                          <span className="text-[11px] text-amber-800">Per Quintal</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {matchingApmc && (
                    <div className="text-xs text-slate-600 space-y-1 pt-1">
                      <div className="flex items-center justify-between">
                        <span>Reference Mandi:</span>
                        <span className="font-bold text-slate-800">{matchingApmc.mandi}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Min – Max Range:</span>
                        <span className="font-mono tabular-nums font-semibold text-slate-800">
                          ₹{matchingApmc.minPrice} – ₹{matchingApmc.maxPrice}/qtl
                        </span>
                      </div>
                      {matchingApmc.mspBenchmark && (
                        <div className="flex items-center justify-between">
                          <span>Govt MSP Floor:</span>
                          <span className="font-mono tabular-nums font-bold text-emerald-700">
                            ₹{matchingApmc.mspBenchmark}/qtl ({aboveMsp ? 'Trading Above MSP' : 'MSP Protected'})
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    if (matchingApmc) setActiveChartRecord(matchingApmc);
                    onAskMarketAI(
                      `Is ${crop.name} profitable to grow on my ${userConditions.soilType} soil in ${userConditions.location} given its APMC modal price of ₹${matchingApmc?.modalPrice || 4000}/quintal and ${crop.suitabilityPercentage}% land suitability?`,
                      crop.name
                    );
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Ask AI Profitability Verdict</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Price-Trend Chart & Selected Market Deep-Dive */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 7 Cols: APMC Prices Table */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 font-heading">
                Verified Mandi / APMC Price Board
              </h3>
              <p className="text-xs text-slate-500">
                Click any market row to inspect its 6-week price trend vs MSP floor
              </p>
            </div>
            <span className="text-xs font-mono tabular-nums text-slate-500">
              Unit: ₹ / Quintal (100 kg)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-600">
                  <th className="py-3 px-4">Crop / Commodity</th>
                  <th className="py-3 px-4">Market (APMC)</th>
                  <th className="py-3 px-4 text-right">Min / Max (₹)</th>
                  <th className="py-3 px-4 text-right">Modal Price</th>
                  <th className="py-3 px-4">Trend</th>
                  <th className="py-3 px-4">Verified Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredRecords.map((rec) => {
                  const isSelected = rec.id === activeChartRecord.id;
                  return (
                    <tr
                      key={rec.id}
                      onClick={() => setActiveChartRecord(rec)}
                      className={`cursor-pointer transition-colors ${
                        isSelected ? 'bg-emerald-50/70' : 'hover:bg-slate-50'
                      }`}
                    >
                      <td className="py-3.5 px-4">
                        <span className="font-bold text-slate-900 block">
                          {language === 'kn' ? rec.commodityKn : rec.commodity}
                        </span>
                        <span className="text-[11px] text-slate-500">{rec.variety}</span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-slate-800 block">{rec.mandi}</span>
                        <span className="text-[11px] text-slate-500">
                          {rec.district}, {rec.state}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-600">
                        ₹{rec.minPrice.toLocaleString('en-IN')} – ₹{rec.maxPrice.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <span className="font-mono tabular-nums text-sm font-extrabold text-emerald-800">
                          ₹{rec.modalPrice.toLocaleString('en-IN')}
                        </span>
                        {rec.mspBenchmark && (
                          <span className="block text-[10px] font-mono text-slate-400">
                            MSP: ₹{rec.mspBenchmark}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">{renderTrendIndicator(rec)}</td>
                      <td className="py-3.5 px-4 text-[11px] text-slate-500">
                        {rec.verifiedDate}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 5 Cols: Price-Trend Chart & Market Card */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5">
          <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <span className="text-xs font-semibold text-emerald-700">
                {activeChartRecord.mandi} · {activeChartRecord.state}
              </span>
              <h3 className="text-lg font-extrabold text-slate-900 font-heading">
                {activeChartRecord.commodity} Price Trend
              </h3>
              <span className="text-xs text-slate-500">
                Variety: {activeChartRecord.variety} · {activeChartRecord.dataSource}
              </span>
            </div>
            {renderTrendIndicator(activeChartRecord)}
          </div>

          {/* Key Price Metrics Row */}
          <div className="grid grid-cols-3 gap-2.5 text-center">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="text-[11px] text-slate-500 block">Minimum</span>
              <span className="text-base font-extrabold text-slate-800 font-mono tabular-nums">
                ₹{activeChartRecord.minPrice.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200">
              <span className="text-[11px] font-bold text-emerald-800 block">Modal (Latest)</span>
              <span className="text-lg font-extrabold text-emerald-900 font-mono tabular-nums">
                ₹{activeChartRecord.modalPrice.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200">
              <span className="text-[11px] font-bold text-amber-900 block">Maximum</span>
              <span className="text-base font-extrabold text-amber-950 font-mono tabular-nums">
                ₹{activeChartRecord.maxPrice.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* 6-Week Price Trajectory Chart */}
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={activeChartRecord.history}
                margin={{ top: 10, right: 12, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="modalPriceGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="dateLabel" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis
                  domain={['auto', 'auto']}
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickFormatter={(v) => `₹${v}`}
                />
                <Tooltip
                  formatter={(value: any, name: any) => [
                    `₹${Number(value).toLocaleString('en-IN')} / Quintal`,
                    name === 'modalPrice' ? 'APMC Modal Price' : 'Govt MSP Floor',
                  ]}
                />
                {activeChartRecord.mspBenchmark && (
                  <ReferenceLine
                    y={activeChartRecord.mspBenchmark}
                    stroke="#d97706"
                    strokeDasharray="4 4"
                    label={{
                      value: `MSP ₹${activeChartRecord.mspBenchmark}`,
                      position: 'insideTopLeft',
                      fill: '#b45309',
                      fontSize: 11,
                    }}
                  />
                )}
                <Area
                  type="monotone"
                  dataKey="modalPrice"
                  stroke="#059669"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#modalPriceGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
            <span>Source: {activeChartRecord.dataSource}</span>
            <span>Arrival Volume: ~{activeChartRecord.arrivalTonnes} Tonnes</span>
          </div>

          {/* Listen + Live Google Search Grounding Mandi Check */}
          <div className="pt-2 border-t border-slate-100 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <TTSButton
                id={`apmc-active-${activeChartRecord.id}`}
                title={`${activeChartRecord.commodity} (${activeChartRecord.mandi})`}
                textToSpeak={
                  language === 'kn'
                    ? `${activeChartRecord.mandi} ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ${activeChartRecord.commodityKn} ಮಾದರಿ ಬೆಲೆ ಕ್ವಿಂಟಾಲ್‌ಗೆ ${activeChartRecord.modalPrice} ರೂಪಾಯಿ. ಕನಿಷ್ಠ ${activeChartRecord.minPrice}, ಗರಿಷ್ಠ ${activeChartRecord.maxPrice} ರೂಪಾಯಿ. ಸರ್ಕಾರಿ ಬೆಂಬಲ ಬೆಲೆ ${activeChartRecord.mspBenchmark || 0} ರೂಪಾಯಿ.`
                    : `${activeChartRecord.commodity} at ${activeChartRecord.mandi}: Latest Modal Price is ₹${activeChartRecord.modalPrice} per quintal, minimum ₹${activeChartRecord.minPrice}, maximum ₹${activeChartRecord.maxPrice}, and Government MSP floor is ₹${activeChartRecord.mspBenchmark || 'N/A'}.`
                }
                language={language}
                size="sm"
                variant="secondary"
              />

              <button
                type="button"
                onClick={() => handleLiveGoogleSearchMandi(activeChartRecord)}
                disabled={isSearchingWebMandi}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-700 hover:bg-sky-800 text-white text-xs font-extrabold shadow-xs transition-all cursor-pointer disabled:opacity-60"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>
                  {isSearchingWebMandi ? ui.apmc.verifyingGoogleSearchBtn : ui.apmc.verifyGoogleSearchBtn}
                </span>
              </button>
            </div>

            {webMandiResult && (
              <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-sky-900">
                    🔍 {ui.apmc.liveWebGroundingTitle}
                  </span>
                  <TTSButton
                    id="apmc-web-grounded-tts"
                    title={ui.apmc.liveWebGroundingTitle}
                    textToSpeak={webMandiResult.summary}
                    language={language}
                    size="sm"
                    variant="subtle"
                  />
                </div>
                <p className="text-xs text-slate-800 leading-relaxed font-medium">{webMandiResult.summary}</p>
                {webMandiResult.groundingLinks.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {webMandiResult.groundingLinks.map((lnk, idx) => (
                      <a
                        key={idx}
                        href={lnk.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-sky-200 text-[11px] font-bold text-sky-800 hover:bg-sky-100"
                      >
                        <span className="truncate max-w-[160px]">{lnk.title}</span>
                        <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
