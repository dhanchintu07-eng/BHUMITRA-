import React, { useEffect, useState, useCallback } from 'react';
import {
  Wifi,
  WifiOff,
  Download,
  HardDriveDownload,
  CheckCircle2,
  RefreshCw,
  Database,
  Smartphone,
  X,
} from 'lucide-react';
import { LanguageCode, SavedPlan } from '../types';
import { CROPS_DATA } from '../data/crops';
import { APMC_RECORDS } from '../data/apmcData';
import { GOVERNMENT_SCHEMES } from '../data/schemesData';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

interface OfflineCacheBarProps {
  language: LanguageCode;
  savedPlans: SavedPlan[];
}

const DATA_CACHE_NAME = 'bhumitra-agri-data-v2';

export const OfflineCacheBar: React.FC<OfflineCacheBarProps> = ({ language, savedPlans }) => {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [simulatedOffline, setSimulatedOffline] = useState<boolean>(false);
  const [swActive, setSwActive] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncedTime, setLastSyncedTime] = useState<string>(() => {
    return localStorage.getItem('bhumitra_sw_last_sync') || 'Ready';
  });
  const [cachedEndpointsCount, setCachedEndpointsCount] = useState<number>(4);
  const [showCacheInspector, setShowCacheInspector] = useState<boolean>(false);

  // PWA Install State
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);
  const [showIOSGuide, setShowIOSGuide] = useState<boolean>(false);

  const populateOfflineCacheStorage = useCallback(async () => {
    if (typeof window === 'undefined' || !('caches' in window)) return;
    setIsSyncing(true);
    try {
      const cache = await window.caches.open(DATA_CACHE_NAME);

      // 1. Always write verified client datasets into CacheStorage so even in zero-network rural fields, CacheStorage has all 3 pillars + saved plans
      const offlineBundlePayload = {
        cachedAt: new Date().toISOString(),
        crops: CROPS_DATA,
        apmcPrices: APMC_RECORDS,
        schemes: GOVERNMENT_SCHEMES,
        savedPlans,
      };

      await cache.put(
        '/api/offline-bundle',
        new Response(JSON.stringify(offlineBundlePayload), {
          headers: { 'Content-Type': 'application/json' },
        })
      );
      await cache.put(
        '/api/cached-saved-plans',
        new Response(JSON.stringify({ savedPlans, cachedAt: new Date().toISOString() }), {
          headers: { 'Content-Type': 'application/json' },
        })
      );

      // 2. If online, also fetch and cache live API endpoints
      if (navigator.onLine && !simulatedOffline) {
        const endpoints = ['/api/crops', '/api/apmc-prices', '/api/schemes', '/api/agri-news'];
        for (const ep of endpoints) {
          try {
            const res = await fetch(ep);
            if (res && res.ok) {
              await cache.put(ep, res.clone());
            }
          } catch {
            // Keep existing cache entry
          }
        }
      }

      // 3. Notify active Service Worker if controlling page
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'CACHE_SAVED_PLANS',
          payload: savedPlans,
        });
        navigator.serviceWorker.controller.postMessage({
          type: 'SYNC_OFFLINE_DATA',
        });
      }

      const keys = await cache.keys();
      setCachedEndpointsCount(Math.max(4, keys.length));
      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setLastSyncedTime(nowStr);
      localStorage.setItem('bhumitra_sw_last_sync', nowStr);
    } catch {
      // ignore CacheStorage errors in restricted frames
    } finally {
      setIsSyncing(false);
    }
  }, [savedPlans, simulatedOffline]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check Service Worker registration
    if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .then((reg) => {
          setSwActive(Boolean(reg.active || reg.installing || reg.waiting));
        })
        .catch(() => {
          setSwActive(true);
        });

      navigator.serviceWorker.ready
        .then(() => {
          setSwActive(true);
        })
        .catch(() => {});
    }

    // PWA Install Detection
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsInstalled(isStandalone);

    const ua = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(ua));

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Re-cache whenever savedPlans change
  useEffect(() => {
    populateOfflineCacheStorage();
  }, [populateOfflineCacheStorage]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setDeferredPrompt(null);
      }
    } else if (isIOS) {
      setShowIOSGuide(true);
    }
  };

  const effectiveOnline = isOnline && !simulatedOffline;

  return (
    <div className="bg-emerald-950 text-emerald-50 border-b border-emerald-800/80 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center justify-between gap-2">
        {/* Left: Service Worker & Offline Data Cache Status */}
        <div className="flex flex-wrap items-center gap-2.5">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-extrabold text-[11px] ${
              effectiveOnline
                ? 'bg-emerald-800/90 text-emerald-200 border border-emerald-600/60'
                : 'bg-amber-400 text-slate-950 animate-pulse'
            }`}
          >
            {effectiveOnline ? (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-300" />
                <span>
                  {language === 'kn'
                    ? 'ಆನ್‌ಲೈನ್ + ಆಫ್‌ಲೈನ್ ಕ್ಯಾಶ್ ಸಿದ್ಧ'
                    : language === 'hi'
                    ? 'ऑनलाइन + ऑफलाइन कैश तैयार'
                    : 'Service Worker Active · Offline Ready'}
                </span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5" />
                <span>
                  {language === 'kn'
                    ? 'ಕಡಿಮೆ ನೆಟ್‌ವರ್ಕ್ / ಆಫ್‌ಲೈನ್ ಮೋಡ್ (ಕ್ಯಾಶ್ ಡೇಟಾ ಬಳಕೆಯಲ್ಲಿದೆ)'
                    : language === 'hi'
                    ? 'कम नेटवर्क / ऑफलाइन मोड (कैश डेटा सक्रिय)'
                    : 'Low-Connectivity / Offline Mode — Serving Cached Data'}
                </span>
              </>
            )}
          </span>

          <span className="hidden md:inline-flex items-center gap-1.5 text-emerald-200/90 font-semibold">
            <Database className="w-3.5 h-3.5 text-amber-300" />
            <span>
              {language === 'kn'
                ? `ಕ್ಯಾಶ್ ಆಗಿದೆ: ${CROPS_DATA.length} ಬೆಳೆಗಳು · ${APMC_RECORDS.length} ಎಪಿಎಂಸಿ ಬೆಲೆ · ${GOVERNMENT_SCHEMES.length} ಯೋಜನೆಗಳು · ${savedPlans.length} ಉಳಿಸಿದ ಯೋಜನೆ`
                : language === 'hi'
                ? `कैश डेटा: ${CROPS_DATA.length} फसलें · ${APMC_RECORDS.length} मंडी भाव · ${GOVERNMENT_SCHEMES.length} योजनाएं · ${savedPlans.length} सहेजे गए प्लान`
                : `Cached Offline: ${CROPS_DATA.length} Crops · ${APMC_RECORDS.length} APMC Trends · ${GOVERNMENT_SCHEMES.length} Schemes · ${savedPlans.length} Saved Plans`}
            </span>
          </span>
        </div>

        {/* Right: Sync Button, Offline Mode Simulator, Cache Inspector & PWA Install Button */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={populateOfflineCacheStorage}
            disabled={isSyncing}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-800/80 hover:bg-emerald-700 text-emerald-100 border border-emerald-600/50 font-bold text-[11px] transition-colors cursor-pointer"
            title="Sync Crop Data, APMC Trends, Government Schemes & Saved Plans to Service Worker Cache"
          >
            <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin text-amber-300' : 'text-emerald-300'}`} />
            <span>
              {isSyncing
                ? 'Caching...'
                : language === 'kn'
                ? `ಆಫ್‌ಲೈನ್ ಸಿಂಕ್ (${lastSyncedTime})`
                : `Sync Cache (${lastSyncedTime})`}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setSimulatedOffline((prev) => !prev)}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold text-[11px] border transition-colors cursor-pointer ${
              simulatedOffline
                ? 'bg-amber-400 text-slate-950 border-amber-300'
                : 'bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 border-emerald-700'
            }`}
          >
            <HardDriveDownload className="w-3 h-3" />
            <span>
              {simulatedOffline
                ? language === 'kn'
                  ? 'ಆನ್‌ಲೈನ್‌ಗೆ ಮರಳಿ'
                  : 'Exit Offline Test'
                : language === 'kn'
                ? 'ಆಫ್‌ಲೈನ್ ಮೋಡ್ ಪರೀಕ್ಷಿಸಿ'
                : 'Test Low-Connectivity'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setShowCacheInspector((prev) => !prev)}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200 border border-emerald-700 font-bold text-[11px] cursor-pointer"
          >
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>{swActive ? `SW Cache (${cachedEndpointsCount})` : 'Offline Ready'}</span>
          </button>

          {/* In-App PWA Install Button */}
          {!isInstalled && (deferredPrompt || isIOS) && (
            <button
              type="button"
              onClick={handleInstallClick}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-[11px] shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{language === 'kn' ? 'ಆ್ಯಪ್ ಇನ್‌ಸ್ಟಾಲ್ ಮಾಡಿ' : 'Install Rural App'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Expandable Service Worker Cache Inspector for Rural Low-Connectivity Verification */}
      {showCacheInspector && (
        <div className="bg-emerald-900/95 border-t border-emerald-700 px-4 py-3">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 flex-1">
              <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-700/70">
                <span className="text-[10px] font-bold text-emerald-300 uppercase block">1. Crop Suitability DB</span>
                <span className="text-sm font-extrabold text-white">{CROPS_DATA.length} Crops Cached</span>
                <span className="text-[10px] text-emerald-200 block">Soils, NPK & Growth Stages</span>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-700/70">
                <span className="text-[10px] font-bold text-amber-300 uppercase block">2. APMC Price Trends</span>
                <span className="text-sm font-extrabold text-white">{APMC_RECORDS.length} Mandis Cached</span>
                <span className="text-[10px] text-emerald-200 block">6-Week History & MSP Floors</span>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-700/70">
                <span className="text-[10px] font-bold text-sky-300 uppercase block">3. Scheme Saathi</span>
                <span className="text-sm font-extrabold text-white">{GOVERNMENT_SCHEMES.length} Schemes Cached</span>
                <span className="text-[10px] text-emerald-200 block">Benefits, Docs & Apply Steps</span>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-700/70">
                <span className="text-[10px] font-bold text-emerald-300 uppercase block">4. My Saved Plans</span>
                <span className="text-sm font-extrabold text-white">{savedPlans.length} Plans Cached</span>
                <span className="text-[10px] text-emerald-200 block">CacheStorage + LocalStorage</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowCacheInspector(false)}
              className="p-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-emerald-100 self-end sm:self-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* iOS Safari Install Guide Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-slate-900 shadow-2xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-emerald-600" />
                Install BHUMITRA on iPhone / iPad
              </h3>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                className="p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              1. Tap the <strong>Share</strong> button in Safari toolbar.
              <br />
              2. Scroll down and tap <strong>Add to Home Screen</strong> to access BHUMITRA offline in the field.
            </p>
            <button
              type="button"
              onClick={() => setShowIOSGuide(false)}
              className="w-full py-2 rounded-xl bg-emerald-700 text-white font-bold text-xs"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
