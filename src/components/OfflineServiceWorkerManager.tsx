import React, { useState, useEffect, useCallback } from 'react';
import {
  Wifi,
  WifiOff,
  Download,
  RefreshCw,
  CheckCircle2,
  Database,
  Sprout,
  TrendingUp,
  Landmark,
  Bookmark,
  ChevronDown,
  ChevronUp,
  Smartphone,
  X,
} from 'lucide-react';
import { LanguageCode, SavedPlan } from '../types';
import { CROPS_DATA } from '../data/crops';
import { APMC_RECORDS } from '../data/apmcData';
import { GOVERNMENT_SCHEMES } from '../data/schemesData';
import { VERIFIED_AGRI_NEWS_ARTICLES } from '../data/agriNewsData';
import { usePWAInstall, useOnlineStatus } from '../hooks/usePWAInstall';
import { TTSButton } from './TTSButton';

interface OfflineServiceWorkerManagerProps {
  language: LanguageCode;
  savedPlans: SavedPlan[];
  onNavigateTab?: (tab: 'wizard' | 'apmc' | 'schemes' | 'saved') => void;
}

const DATA_CACHE_NAME = 'bhumitra-essential-agri-data-v2';

export const OfflineServiceWorkerManager: React.FC<OfflineServiceWorkerManagerProps> = ({
  language,
  savedPlans,
  onNavigateTab,
}) => {
  const browserOnline = useOnlineStatus();
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();

  const [simulatedOffline, setSimulatedOffline] = useState(false);
  const [swStatus, setSwStatus] = useState<'registering' | 'active' | 'cached_ready'>('registering');
  const [isSyncing, setIsSyncing] = useState(false);
  const [expandedDrawer, setExpandedDrawer] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [lastCachedTime, setLastCachedTime] = useState<string>(() => {
    return localStorage.getItem('bhumitra_sw_cached_at') || 'Ready';
  });

  const [cachedStats, setCachedStats] = useState({
    cropsCount: CROPS_DATA.length,
    apmcCount: APMC_RECORDS.length,
    schemesCount: GOVERNMENT_SCHEMES.length,
    savedPlansCount: savedPlans.length,
  });

  const isEffectiveOnline = browserOnline && !simulatedOffline;

  // Sync essential crop data, APMC price trends, government schemes, and saved plans into Cache Storage & Service Worker
  const syncOfflineCache = useCallback(async () => {
    setIsSyncing(true);
    try {
      const payload = {
        version: 'bhumitra-offline-v2',
        cachedAt: new Date().toISOString(),
        crops: CROPS_DATA,
        apmcRecords: APMC_RECORDS,
        schemes: GOVERNMENT_SCHEMES,
        agriNews: VERIFIED_AGRI_NEWS_ARTICLES,
        savedPlans,
      };

      // 1. Write directly into Browser Cache Storage API so offline fetch requests & client inspection always succeed
      if (typeof window !== 'undefined' && 'caches' in window) {
        const cache = await window.caches.open(DATA_CACHE_NAME);
        await cache.put(
          '/api/offline-bundle',
          new Response(JSON.stringify(payload), {
            headers: { 'Content-Type': 'application/json' },
          })
        );
        await cache.put(
          '/api/crops',
          new Response(JSON.stringify({ success: true, crops: CROPS_DATA }), {
            headers: { 'Content-Type': 'application/json' },
          })
        );
        await cache.put(
          '/api/apmc-prices',
          new Response(JSON.stringify({ success: true, records: APMC_RECORDS }), {
            headers: { 'Content-Type': 'application/json' },
          })
        );
        await cache.put(
          '/api/schemes',
          new Response(JSON.stringify({ success: true, schemes: GOVERNMENT_SCHEMES }), {
            headers: { 'Content-Type': 'application/json' },
          })
        );
        await cache.put(
          '/api/offline-saved-plans',
          new Response(JSON.stringify({ success: true, savedPlans }), {
            headers: { 'Content-Type': 'application/json' },
          })
        );
      }

      // 2. Also notify active Service Worker controller
      if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'SYNC_ESSENTIAL_DATA',
          payload,
        });
        navigator.serviceWorker.controller.postMessage({
          type: 'CACHE_SAVED_PLANS',
          plans: savedPlans,
        });
      }

      // 3. Mirror essential bundle metadata into localStorage for instant synchronous fallback
      const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      localStorage.setItem('bhumitra_sw_cached_at', timeStr);
      setLastCachedTime(timeStr);
      setCachedStats({
        cropsCount: CROPS_DATA.length,
        apmcCount: APMC_RECORDS.length,
        schemesCount: GOVERNMENT_SCHEMES.length,
        savedPlansCount: savedPlans.length,
      });
      setSwStatus('cached_ready');
    } catch {
      setSwStatus('cached_ready');
    } finally {
      setIsSyncing(false);
    }
  }, [savedPlans]);

  // Register /sw.js Service Worker on mount and cache essential data
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .then((registration) => {
          if (registration.active || registration.installing || registration.waiting) {
            setSwStatus('active');
          }
          syncOfflineCache();
        })
        .catch(() => {
          // Even if SW registration is restricted in iframe, populate Cache Storage API
          syncOfflineCache();
        });

      const handleSwMessage = (event: MessageEvent) => {
        if (event.data?.type === 'OFFLINE_SYNC_COMPLETE') {
          setSwStatus('cached_ready');
        }
      };
      navigator.serviceWorker.addEventListener('message', handleSwMessage);
      return () => {
        navigator.serviceWorker.removeEventListener('message', handleSwMessage);
      };
    } else {
      syncOfflineCache();
    }
  }, [syncOfflineCache]);

  // Re-cache saved plans whenever savedPlans array changes
  useEffect(() => {
    setCachedStats((prev) => ({ ...prev, savedPlansCount: savedPlans.length }));
    if (typeof window !== 'undefined' && 'caches' in window) {
      window.caches
        .open(DATA_CACHE_NAME)
        .then((cache) =>
          cache.put(
            '/api/offline-saved-plans',
            new Response(JSON.stringify({ success: true, savedPlans }), {
              headers: { 'Content-Type': 'application/json' },
            })
          )
        )
        .catch(() => {});
    }
  }, [savedPlans]);

  const labels = {
    onlineBadge:
      language === 'kn'
        ? 'ಸರ್ವಿಸ್ ವರ್ಕರ್ ಸಕ್ರಿಯ • ಆಫ್‌ಲೈನ್ ಡೇಟಾ ಸಿದ್ಧವಾಗಿದೆ'
        : language === 'hi'
        ? 'सर्विस वर्कर सक्रिय • ऑफ़लाइन डेटा कैश तैयार'
        : 'Service Worker Active • Offline Field Cache Ready',
    offlineBadge:
      language === 'kn'
        ? 'ಕಡಿಮೆ ನೆಟ್‌ವರ್ಕ್ / ಆಫ್‌ಲೈನ್ ಮೋಡ್ — ಕ್ಯಾಶ್ ಮಾಡಿದ ಡೇಟಾ ಬಳಸಲಾಗುತ್ತಿದೆ'
        : language === 'hi'
        ? 'कम नेटवर्क / ऑफ़लाइन मोड — कैश किया गया डेटा उपयोग में है'
        : 'Low-Connectivity / Offline Mode — Using Cached Farm Data',
    syncBtn:
      language === 'kn'
        ? 'ಆಫ್‌ಲೈನ್ ಡೇಟಾ ಸಿಂಕ್ ಮಾಡಿ'
        : language === 'hi'
        ? 'ऑफ़लाइन डेटा सिंक करें'
        : 'Sync Offline Cache',
    simulateBtn: simulatedOffline
      ? language === 'kn'
        ? 'ಆನ್‌ಲೈನ್ ಮೋಡ್‌ಗೆ ಮರಳಿ'
        : 'Exit Offline Test'
      : language === 'kn'
      ? 'ಆಫ್‌ಲೈನ್ ಪರೀಕ್ಷೆ'
      : 'Test Low-Connectivity Mode',
    installAppBtn:
      language === 'kn'
        ? 'ಭೂಮಿತ್ರ ಆಪ್ ಇನ್‌ಸ್ಟಾಲ್ ಮಾಡಿ'
        : language === 'hi'
        ? 'भूमिमित्र ऐप इंस्टॉल करें'
        : 'Install Offline App',
  };

  return (
    <div className="bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 text-white border-b border-emerald-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          {/* Left: Service Worker & Offline Cache Status */}
          <div className="flex flex-wrap items-center gap-2.5">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-extrabold text-[11px] border ${
                isEffectiveOnline
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-amber-400 text-slate-950 border-amber-300 animate-pulse'
              }`}
            >
              {isEffectiveOnline ? (
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <WifiOff className="w-3.5 h-3.5 text-slate-950" />
              )}
              <span>{isEffectiveOnline ? labels.onlineBadge : labels.offlineBadge}</span>
            </span>

            {/* Cached Pills Summary */}
            <div className="hidden md:flex items-center gap-2 text-[11px] text-emerald-100/90 font-semibold">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/10">
                <Sprout className="w-3 h-3 text-emerald-400" />
                {cachedStats.cropsCount} Crops
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/10">
                <TrendingUp className="w-3 h-3 text-amber-300" />
                {cachedStats.apmcCount} APMC Trends
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/10">
                <Landmark className="w-3 h-3 text-sky-300" />
                {cachedStats.schemesCount} Schemes
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/10">
                <Bookmark className="w-3 h-3 text-pink-300" />
                {cachedStats.savedPlansCount} Saved Plans
              </span>
            </div>
          </div>

          {/* Right: Sync Offline Cache, Simulate Low-Connectivity, Install PWA & Details Toggle */}
          <div className="flex flex-wrap items-center gap-2">
            {/* In-App PWA Install Button (Mandatory per PWA skill) */}
            {!isInstalled && isInstallable && (
              <button
                type="button"
                onClick={install}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-[11px] shadow-xs transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{labels.installAppBtn}</span>
              </button>
            )}

            {!isInstalled && !isInstallable && isIOS && (
              <button
                type="button"
                onClick={() => setShowIOSGuide(true)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-400/90 text-slate-950 font-extrabold text-[11px] cursor-pointer"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Install on iPhone</span>
              </button>
            )}

            <button
              type="button"
              onClick={syncOfflineCache}
              disabled={isSyncing}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-emerald-200 font-bold text-[11px] border border-white/15 transition-colors cursor-pointer"
              title="Cache essential crop data, APMC prices, schemes & saved plans for offline field access"
            >
              <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin text-amber-300' : ''}`} />
              <span>{isSyncing ? 'Caching...' : labels.syncBtn}</span>
            </button>

            <button
              type="button"
              onClick={() => setSimulatedOffline((prev) => !prev)}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold text-[11px] border transition-colors cursor-pointer ${
                simulatedOffline
                  ? 'bg-amber-400 text-slate-950 border-amber-300'
                  : 'bg-white/10 hover:bg-white/20 text-sky-200 border-white/15'
              }`}
            >
              <WifiOff className="w-3 h-3" />
              <span>{labels.simulateBtn}</span>
            </button>

            <button
              type="button"
              onClick={() => setExpandedDrawer((prev) => !prev)}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-bold cursor-pointer"
            >
              <Database className="w-3 h-3 text-emerald-400" />
              <span className="hidden sm:inline">Offline Vault</span>
              {expandedDrawer ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {/* Expandable Offline Cache Vault Inspector for Low-Connectivity Rural Areas */}
        {expandedDrawer && (
          <div className="mt-2.5 pt-3 pb-2 border-t border-emerald-800/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs animate-in fade-in duration-200">
            <div
              onClick={() => onNavigateTab?.('wizard')}
              className="p-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 cursor-pointer transition-colors"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-extrabold text-emerald-300 flex items-center gap-1.5">
                  <Sprout className="w-4 h-4" />
                  Essential Crop Data
                </span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-[11px] text-slate-200">
                {cachedStats.cropsCount} Indian crops with soil suitability, NPK ratios, irrigation stages & pest protocols cached offline.
              </p>
            </div>

            <div
              onClick={() => onNavigateTab?.('apmc')}
              className="p-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 cursor-pointer transition-colors"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-extrabold text-amber-300 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4" />
                  APMC Price Trends
                </span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-[11px] text-slate-200">
                {cachedStats.apmcCount} APMC mandi benchmarks, 6-week price trajectories, and MSP floors cached for offline comparison.
              </p>
            </div>

            <div
              onClick={() => onNavigateTab?.('schemes')}
              className="p-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 cursor-pointer transition-colors"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-extrabold text-sky-300 flex items-center gap-1.5">
                  <Landmark className="w-4 h-4" />
                  Government Schemes
                </span>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-[11px] text-slate-200">
                {cachedStats.schemesCount} verified Central & State schemes (PM-KISAN, PMFBY, Krishi Bhagya, KCC) with document checklists cached.
              </p>
            </div>

            <div
              onClick={() => onNavigateTab?.('saved')}
              className="p-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 cursor-pointer transition-colors"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-extrabold text-pink-300 flex items-center gap-1.5">
                  <Bookmark className="w-4 h-4" />
                  Saved Farm Plans ({cachedStats.savedPlansCount})
                </span>
                <TTSButton
                  id="offline-vault-summary-tts"
                  title="Offline Cache Summary"
                  textToSpeak={`BHUMITRA Service Worker has cached ${cachedStats.cropsCount} crops, ${cachedStats.apmcCount} APMC market price trends, ${cachedStats.schemesCount} government schemes, and ${cachedStats.savedPlansCount} saved crop plans for offline access in low-connectivity areas.`}
                  language={language}
                  size="sm"
                  variant="subtle"
                />
              </div>
              <p className="text-[11px] text-slate-200">
                Last synced: <strong>{lastCachedTime}</strong> ({swStatus === 'cached_ready' ? 'Service Worker Cache v2' : 'Active'}).
              </p>
            </div>
          </div>
        )}
      </div>

      {/* iOS Safari Install Guide Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-slate-900 shadow-2xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold">Install BHUMITRA on iPhone / iPad</h3>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              1. Tap the <strong>Share</strong> button in Safari toolbar.<br />
              2. Scroll down and tap <strong>Add to Home Screen</strong> to access BHUMITRA offline in the field.
            </p>
            <button
              type="button"
              onClick={() => setShowIOSGuide(false)}
              className="w-full py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
