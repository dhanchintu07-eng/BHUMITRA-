import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Newspaper,
  CloudRain,
  Landmark,
  TrendingUp,
  Sprout,
  Cpu,
  FileCheck2,
  RefreshCw,
  ExternalLink,
  Sparkles,
  Search,
  Mic,
  MicOff,
  CheckCircle2,
  Globe,
  Calendar,
  Volume2,
  Square,
  ArrowRight,
} from 'lucide-react';
import { AgriNewsArticle, AgriNewsCategory, GroundingWebSource, LanguageCode } from '../types';
import { VERIFIED_AGRI_NEWS_ARTICLES, localizeNewsArticle } from '../data/agriNewsData';
import { getGlobalUI } from '../data/uiTranslations';
import { TTSButton } from './TTSButton';
import { useTTS } from '../context/TTSContext';

interface TodayInAgricultureProps {
  language: LanguageCode;
  compactPreview?: boolean;
  onOpenFullNews?: () => void;
  onAskAIAboutNews?: (prompt: string) => void;
}

const SPEECH_LANG_MAP: Record<LanguageCode, string> = {
  kn: 'kn-IN',
  hi: 'hi-IN',
  pa: 'pa-IN',
  mr: 'mr-IN',
  te: 'te-IN',
  ta: 'ta-IN',
  en: 'en-IN',
};

export const TodayInAgriculture: React.FC<TodayInAgricultureProps> = ({
  language,
  compactPreview = false,
  onOpenFullNews,
  onAskAIAboutNews,
}) => {
  const ui = getGlobalUI(language);
  const { speak, stop, activeId, isPlaying } = useTTS();

  const [articles, setArticles] = useState<AgriNewsArticle[]>(VERIFIED_AGRI_NEWS_ARTICLES);
  const [groundingLinks, setGroundingLinks] = useState<GroundingWebSource[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<AgriNewsCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isListeningVoice, setIsListeningVoice] = useState(false);
  const [lastUpdatedLabel, setLastUpdatedLabel] = useState<string>(() =>
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  );

  const recognitionRef = useRef<any>(null);

  const fetchNews = async (forceRefresh = false) => {
    setIsRefreshing(true);
    try {
      const res = await fetch(`/api/agri-news${forceRefresh ? '?refresh=true' : ''}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.articles) && data.articles.length > 0) {
          setArticles(data.articles);
        }
        if (Array.isArray(data.groundingLinks)) {
          setGroundingLinks(data.groundingLinks);
        }
        setLastUpdatedLabel(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      }
    } catch {
      // Keep verified articles on network error
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNews(false);
  }, []);

  const handleVoiceSearch = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    if (isListeningVoice && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListeningVoice(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = SPEECH_LANG_MAP[language] || 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListeningVoice(true);
    recognition.onresult = (event: any) => {
      const transcript = event.results?.[0]?.[0]?.transcript;
      if (transcript) {
        setSearchQuery(transcript);
      }
    };
    recognition.onerror = () => setIsListeningVoice(false);
    recognition.onend = () => setIsListeningVoice(false);

    recognitionRef.current = recognition;
    recognition.start();
  };

  const filteredArticles = useMemo(() => {
    const list = articles.filter((art) => {
      if (selectedCategory !== 'all' && art.category !== selectedCategory) return false;
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const loc = localizeNewsArticle(art, language);
      return (
        loc.title.toLowerCase().includes(q) ||
        loc.summary.toLowerCase().includes(q) ||
        loc.whyItMatters.toLowerCase().includes(q) ||
        art.sourceName.toLowerCase().includes(q) ||
        art.regionTag.toLowerCase().includes(q)
      );
    });
    return compactPreview ? list.slice(0, 3) : list;
  }, [articles, selectedCategory, searchQuery, language, compactPreview]);

  const fullBulletinText = useMemo(() => {
    const topItems = filteredArticles.slice(0, 4).map((art, index) => {
      const loc = localizeNewsArticle(art, language);
      return `${index + 1}. ${loc.title}. ${loc.summary} ${ui.news.whyItMattersLabel}: ${loc.whyItMatters}`;
    });
    return `${ui.news.title}. ${topItems.join(' ... ')}`;
  }, [filteredArticles, language, ui.news.title, ui.news.whyItMattersLabel]);

  const isBulletinPlaying = activeId === 'agri-news-full-bulletin' && isPlaying;

  const getCategoryMeta = (cat: AgriNewsArticle['category']) => {
    switch (cat) {
      case 'rainfall':
        return {
          label: ui.news.categories.rainfall,
          icon: <CloudRain className="w-4 h-4 text-sky-600" />,
          badgeClass: 'bg-sky-100 text-sky-900 border-sky-300',
          borderAccent: 'border-t-4 border-t-sky-500',
        };
      case 'government':
        return {
          label: ui.news.categories.government,
          icon: <Landmark className="w-4 h-4 text-amber-700" />,
          badgeClass: 'bg-amber-100 text-amber-900 border-amber-300',
          borderAccent: 'border-t-4 border-t-amber-500',
        };
      case 'markets':
        return {
          label: ui.news.categories.markets,
          icon: <TrendingUp className="w-4 h-4 text-emerald-700" />,
          badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-300',
          borderAccent: 'border-t-4 border-t-emerald-600',
        };
      case 'crops':
        return {
          label: ui.news.categories.crops,
          icon: <Sprout className="w-4 h-4 text-green-700" />,
          badgeClass: 'bg-green-100 text-green-900 border-green-300',
          borderAccent: 'border-t-4 border-t-green-600',
        };
      case 'technology':
        return {
          label: ui.news.categories.technology,
          icon: <Cpu className="w-4 h-4 text-indigo-700" />,
          badgeClass: 'bg-indigo-100 text-indigo-900 border-indigo-300',
          borderAccent: 'border-t-4 border-t-indigo-500',
        };
      case 'schemes':
      default:
        return {
          label: ui.news.categories.schemes,
          icon: <FileCheck2 className="w-4 h-4 text-teal-700" />,
          badgeClass: 'bg-teal-100 text-teal-900 border-teal-300',
          borderAccent: 'border-t-4 border-t-teal-600',
        };
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 my-6">
      <div className="bg-white rounded-3xl shadow-xl border-2 border-sky-200 overflow-hidden">
        {/* Vibrant Sky-to-Farm Horizon Header */}
        <div className="bg-gradient-to-r from-sky-800 via-emerald-800 to-green-900 px-6 py-6 text-white relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-56 h-56 rounded-full bg-amber-400/15 blur-2xl pointer-events-none" />
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-400/20 border border-sky-300/40 text-sky-200 text-xs font-extrabold uppercase tracking-wider mb-2">
                <Newspaper className="w-3.5 h-3.5 text-amber-300" />
                {ui.news.badge}
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight flex items-center gap-2.5">
                <span>🌾 {ui.news.title}</span>
              </h2>
              <p className="text-sky-100 text-sm sm:text-base mt-1 max-w-3xl leading-relaxed">
                {ui.news.subtitle}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {/* Listen to Full Bulletin Button */}
              <button
                type="button"
                onClick={() => {
                  if (isBulletinPlaying) {
                    stop();
                  } else {
                    speak('agri-news-full-bulletin', ui.news.title, fullBulletinText, language);
                  }
                }}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm transition-all shadow-md cursor-pointer ${
                  isBulletinPlaying
                    ? 'bg-amber-400 text-slate-950 ring-2 ring-white animate-pulse'
                    : 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                }`}
              >
                {isBulletinPlaying ? (
                  <>
                    <Square className="w-4 h-4 fill-current" />
                    {ui.stopBtn}
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4" />
                    {ui.news.listenBulletinBtn}
                  </>
                )}
              </button>

              {/* Refresh Live Google Search Grounded News */}
              <button
                type="button"
                onClick={() => fetchNews(true)}
                disabled={isRefreshing}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/30 text-white font-bold text-xs sm:text-sm transition-all cursor-pointer disabled:opacity-60"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-amber-300' : 'text-sky-200'}`} />
                {isRefreshing ? ui.news.refreshingBtn : ui.news.refreshLiveBtn}
              </button>
            </div>
          </div>

          {/* Grounding Web Sources Strip if present */}
          {groundingLinks.length > 0 && (
            <div className="mt-4 pt-3 border-t border-white/15 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-300 flex items-center gap-1">
                <Globe className="w-3.5 h-3.5" />
                {ui.ai.webSourcesLabel}:
              </span>
              {groundingLinks.map((link, i) => (
                <a
                  key={i}
                  href={link.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-xs font-bold text-white transition-colors"
                >
                  <span className="truncate max-w-[200px]">{link.title}</span>
                  <ExternalLink className="w-3 h-3 shrink-0 text-amber-300" />
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Category Filter Pills & Voice Search Bar */}
        {!compactPreview && (
          <div className="p-5 bg-gradient-to-b from-sky-50/70 to-emerald-50/40 border-b border-slate-200 space-y-4">
            <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
              {/* Search + Voice Search */}
              <div className="relative flex-1 flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={ui.news.searchPlaceholder}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border-2 border-slate-200 focus:border-emerald-600 focus:outline-none text-sm font-semibold text-slate-900"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleVoiceSearch}
                  className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-extrabold text-xs sm:text-sm border-2 transition-all cursor-pointer shrink-0 ${
                    isListeningVoice
                      ? 'bg-red-600 text-white border-red-700 animate-pulse'
                      : 'bg-emerald-700 hover:bg-emerald-800 text-white border-emerald-800'
                  }`}
                >
                  {isListeningVoice ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  {isListeningVoice ? ui.listeningNow : ui.news.voiceSearchBtn}
                </button>
              </div>

              <div className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>
                  {ui.news.verifiedDateLabel}: <strong>{lastUpdatedLabel}</strong>
                </span>
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {(
                [
                  'all',
                  'rainfall',
                  'government',
                  'markets',
                  'crops',
                  'technology',
                  'schemes',
                ] as AgriNewsCategory[]
              ).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer border ${
                    selectedCategory === cat
                      ? 'bg-emerald-700 text-white border-emerald-800 shadow-sm'
                      : 'bg-white hover:bg-emerald-50 text-slate-700 border-slate-200'
                  }`}
                >
                  {ui.news.categories[cat]}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* News Cards Grid */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-slate-50/50">
          {filteredArticles.map((article) => {
            const loc = localizeNewsArticle(article, language);
            const meta = getCategoryMeta(article.category);
            const speechContent = `${loc.title}. ${loc.summary}. ${ui.news.whyItMattersLabel}: ${loc.whyItMatters}`;

            return (
              <article
                key={article.id}
                className={`bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden ${meta.borderAccent}`}
              >
                <div className="p-5 space-y-3.5">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-extrabold border ${meta.badgeClass}`}
                    >
                      {meta.icon}
                      {meta.label}
                    </span>

                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold ${
                        article.isLiveGrounded
                          ? 'bg-sky-50 text-sky-800 border border-sky-200'
                          : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      {article.isLiveGrounded ? ui.news.liveSearchGroundedBadge : ui.news.verifiedOfficialBadge}
                    </span>
                  </div>

                  {/* Headline */}
                  <h3 className="text-base sm:text-lg font-extrabold text-slate-900 leading-snug">
                    {loc.title}
                  </h3>

                  {/* Source & Date */}
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 font-semibold">
                    <span className="inline-flex items-center gap-1 text-slate-700 font-bold">
                      <Globe className="w-3.5 h-3.5 text-emerald-600" />
                      {article.sourceName}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {article.publishedDate}
                    </span>
                  </div>

                  {/* Summary */}
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{loc.summary}</p>

                  {/* Why It Matters to Farmers Callout */}
                  <div className="p-3.5 rounded-xl bg-amber-50/90 border border-amber-200 space-y-1">
                    <p className="text-[11px] font-extrabold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      {ui.news.whyItMattersLabel}
                    </p>
                    <p className="text-xs font-bold text-amber-950 leading-relaxed">{loc.whyItMatters}</p>
                  </div>
                </div>

                {/* Card Footer: Listen 🔊 + Official Link + Ask AI */}
                <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <TTSButton
                      id={`news-${article.id}`}
                      title={loc.title}
                      textToSpeak={speechContent}
                      language={language}
                      size="sm"
                      variant="secondary"
                    />
                    <a
                      href={article.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold transition-colors"
                    >
                      {ui.news.readSourceBtn}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  {onAskAIAboutNews && (
                    <button
                      type="button"
                      onClick={() =>
                        onAskAIAboutNews(
                          `${loc.title} — ${ui.news.whyItMattersLabel}: ${loc.whyItMatters}`
                        )
                      }
                      className="inline-flex items-center gap-1 text-xs font-extrabold text-emerald-700 hover:text-emerald-900 cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>AI</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {/* Footer CTA when shown as compact preview on Home */}
        {compactPreview && onOpenFullNews && (
          <div className="px-6 py-4 bg-emerald-50/70 border-t border-emerald-200 flex items-center justify-between flex-wrap gap-3">
            <p className="text-xs sm:text-sm font-bold text-emerald-950">
              🔊 {ui.voiceFirstHint}
            </p>
            <button
              type="button"
              onClick={onOpenFullNews}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs sm:text-sm shadow-sm transition-all cursor-pointer"
            >
              <span>{ui.nav.news}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
