import React, { useState } from 'react';
import {
  Sprout,
  Globe,
  Eye,
  Type,
  Bookmark,
  MessageSquareCode,
  ArrowUpDown,
  Home,
  BarChart3,
  SlidersHorizontal,
  Award,
  Stethoscope,
  Store,
  Landmark,
  Newspaper,
} from 'lucide-react';
import { LanguageCode, AppPage } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { getGlobalUI } from '../data/uiTranslations';

interface HeaderProps {
  language: LanguageCode;
  onLanguageChange: (lang: LanguageCode) => void;
  isHighContrast: boolean;
  onToggleContrast: () => void;
  isLargeFont: boolean;
  onToggleFontSize: () => void;
  activePage: AppPage;
  onPageChange: (page: AppPage) => void;
  savedCount: number;
}

const LANGUAGES: { code: LanguageCode; label: string; script: string }[] = [
  { code: 'kn', label: 'Kannada', script: 'ಕನ್ನಡ' },
  { code: 'en', label: 'English', script: 'English' },
  { code: 'hi', label: 'Hindi', script: 'हिन्दी' },
  { code: 'pa', label: 'Punjabi', script: 'ਪੰਜਾਬੀ' },
  { code: 'mr', label: 'Marathi', script: 'मराठी' },
  { code: 'te', label: 'Telugu', script: 'తెలుగు' },
  { code: 'ta', label: 'Tamil', script: 'தமிழ்' },
];

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  isHighContrast,
  onToggleContrast,
  isLargeFont,
  onToggleFontSize,
  activePage,
  onPageChange,
  savedCount,
}) => {
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const t = TRANSLATIONS[language];
  const ui = getGlobalUI(language);

  const NAV_ITEMS: { id: AppPage; label: string; icon: any }[] = [
    { id: 'home', label: ui.nav.home, icon: Home },
    { id: 'news', label: ui.nav.news, icon: Newspaper },
    { id: 'apmc', label: ui.nav.apmc, icon: Store },
    { id: 'wizard', label: ui.nav.wizard, icon: SlidersHorizontal },
    { id: 'results', label: ui.nav.results, icon: Award },
    { id: 'schemes', label: ui.nav.schemes, icon: Landmark },
    { id: 'ask', label: ui.nav.ask, icon: MessageSquareCode },
    { id: 'charts', label: ui.nav.charts, icon: BarChart3 },
    { id: 'helpdesk', label: ui.nav.helpdesk, icon: Stethoscope },
    { id: 'saved', label: `${ui.nav.saved} (${savedCount})`, icon: Bookmark },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
          {/* Zone 1: Brand Wordmark & Startup Tagline */}
          <button
            onClick={() => onPageChange('home')}
            className="flex items-center gap-2.5 text-left focus-visible:outline-emerald-600 focus-visible:ring-2 rounded-lg shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-green-500 to-amber-400 flex items-center justify-center text-white shadow-sm shadow-emerald-600/20">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-emerald-950 font-heading block leading-none">
                BHUMITRA
              </span>
              <span className="text-[11px] font-semibold text-emerald-700 block mt-1">
                {ui.taglineMain}
              </span>
            </div>
          </button>

          {/* Zone 2: Clean Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1 text-xs font-semibold text-slate-600">
            {NAV_ITEMS.map((item) => {
              const IconComp = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onPageChange(item.id)}
                  className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                    isActive
                      ? 'bg-emerald-100/80 text-emerald-950 font-bold'
                      : 'hover:bg-slate-100 text-slate-600'
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Language & Accessibility Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleFontSize}
              title="Toggle Font Size (Accessibility)"
              aria-label="Toggle Font Size"
              className={`p-2 rounded-lg border text-xs font-semibold transition-colors ${
                isLargeFont
                  ? 'bg-emerald-100 border-emerald-300 text-emerald-900'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <span className="flex items-center gap-0.5">
                <Type className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isLargeFont ? 'A+' : 'A'}</span>
              </span>
            </button>

            <button
              onClick={onToggleContrast}
              title="Toggle High Contrast"
              aria-label="Toggle High Contrast"
              className={`p-2 rounded-lg border text-xs transition-colors ${
                isHighContrast
                  ? 'bg-amber-100 border-amber-400 text-amber-900'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
            </button>

            <div className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
                aria-expanded={langMenuOpen}
              >
                <Globe className="w-3.5 h-3.5 text-emerald-600" />
                <span className="font-bold text-emerald-900">
                  {LANGUAGES.find((l) => l.code === language)?.script}
                </span>
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 mt-1.5 w-48 rounded-xl bg-white border border-slate-200 shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 border-b border-slate-100">
                    Select Language / ಭಾಷೆ
                  </div>
                  {LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        onLanguageChange(l.code);
                        setLangMenuOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-emerald-50 transition-colors ${
                        language === l.code
                          ? 'font-bold text-emerald-800 bg-emerald-50/50'
                          : 'text-slate-700'
                      }`}
                    >
                      <span className="font-medium text-sm">{l.script}</span>
                      <span className="text-[11px] text-slate-400 font-normal">{l.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile-First Sub-Navigation Bar */}
      <div className="flex xl:hidden overflow-x-auto items-center gap-1.5 border-t border-slate-100 bg-slate-50/90 px-3 py-2 text-xs font-medium text-slate-600 no-scrollbar">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => onPageChange(item.id)}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap shrink-0 transition-colors ${
              activePage === item.id
                ? 'bg-emerald-700 text-white font-bold shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};
