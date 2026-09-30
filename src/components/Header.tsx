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
  Stethoscope
} from 'lucide-react';
import { LanguageCode, AppPage } from '../types';
import { TRANSLATIONS } from '../data/translations';

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

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-emerald-100 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
          {/* Zone 1: Single Brand Wordmark Element */}
          <button
            onClick={() => onPageChange('home')}
            className="flex items-center gap-2.5 text-left focus-visible:outline-emerald-600 focus-visible:ring-2 rounded-lg"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-500 flex items-center justify-center text-white shadow-sm shadow-emerald-600/20">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-emerald-950 font-heading block leading-none">
                BHUMITRA
              </span>
              <span className="text-[11px] font-semibold text-emerald-700 tracking-wider uppercase block mt-1">
                {language === 'kn' ? 'ಭೂಮಿತ್ರ · ಸ್ಮಾರ್ಟ್ ಕೃಷಿ' : 'भूमिमित्र · Smart Agriculture'}
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation Links (Page by Page) */}
          <nav className="hidden xl:flex items-center gap-1.5 text-xs font-semibold text-slate-600">
            <button
              onClick={() => onPageChange('home')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                activePage === 'home'
                  ? 'bg-emerald-100/70 text-emerald-900 font-bold'
                  : 'hover:bg-slate-100 text-slate-600'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home & Weather</span>
            </button>

            <button
              onClick={() => onPageChange('wizard')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                activePage === 'wizard'
                  ? 'bg-emerald-100/70 text-emerald-900 font-bold'
                  : 'hover:bg-slate-100 text-slate-600'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Crop Finder</span>
            </button>

            <button
              onClick={() => onPageChange('results')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                activePage === 'results'
                  ? 'bg-emerald-100/70 text-emerald-900 font-bold'
                  : 'hover:bg-slate-100 text-slate-600'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Top Crops</span>
            </button>

            <button
              onClick={() => onPageChange('charts')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                activePage === 'charts'
                  ? 'bg-emerald-100/70 text-emerald-900 font-bold'
                  : 'hover:bg-slate-100 text-slate-600'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Nutrient Charts</span>
            </button>

            <button
              onClick={() => onPageChange('compare')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                activePage === 'compare'
                  ? 'bg-emerald-100/70 text-emerald-900 font-bold'
                  : 'hover:bg-slate-100 text-slate-600'
              }`}
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>Compare</span>
            </button>

            <button
              onClick={() => onPageChange('helpdesk')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                activePage === 'helpdesk'
                  ? 'bg-emerald-100/70 text-emerald-900 font-bold'
                  : 'hover:bg-slate-100 text-slate-600'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5 text-emerald-600" />
              <span>{language === 'kn' ? 'ಸಹಾಯ ಕೇಂದ್ರ (Help Desk)' : 'AI Help Desk'}</span>
            </button>

            <button
              onClick={() => onPageChange('ask')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                activePage === 'ask'
                  ? 'bg-emerald-100/70 text-emerald-900 font-bold'
                  : 'hover:bg-slate-100 text-slate-600'
              }`}
            >
              <MessageSquareCode className="w-3.5 h-3.5" />
              <span>Ask AI</span>
            </button>

            <button
              onClick={() => onPageChange('saved')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                activePage === 'saved'
                  ? 'bg-emerald-100/70 text-emerald-900 font-bold'
                  : 'hover:bg-slate-100 text-slate-600'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Saved ({savedCount})</span>
            </button>
          </nav>

          {/* Zone 3: Actions - Language & Accessibility Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Font size accessibility toggle */}
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

            {/* High Contrast accessibility toggle */}
            <button
              onClick={onToggleContrast}
              title="Toggle High Contrast for Sunlight Legibility"
              aria-label="Toggle High Contrast"
              className={`p-2 rounded-lg border text-xs transition-colors ${
                isHighContrast
                  ? 'bg-amber-100 border-amber-400 text-amber-900'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
            </button>

            {/* Language Selector Dropdown (with Kannada) */}
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
                    Select Language / ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ
                  </div>
                  {LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        onLanguageChange(l.code);
                        setLangMenuOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-emerald-50 transition-colors ${
                        language === l.code ? 'font-bold text-emerald-800 bg-emerald-50/50' : 'text-slate-700'
                      }`}
                    >
                      <span className="font-medium text-sm">{l.script}</span>
                      <span className="text-[11px] text-slate-400 font-normal">{l.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Find CTA */}
            <button
              onClick={() => onPageChange('wizard')}
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm transition-all hover:shadow-emerald-700/20 whitespace-nowrap"
            >
              {t.findBestCrop}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar (Page by Page) */}
      <div className="flex xl:hidden overflow-x-auto items-center gap-1 border-t border-slate-100 bg-slate-50/90 px-3 py-2 text-xs font-medium text-slate-600 no-scrollbar">
        {[
          { id: 'home', label: 'Home' },
          { id: 'wizard', label: 'Finder' },
          { id: 'results', label: 'Crops' },
          { id: 'charts', label: 'Charts' },
          { id: 'compare', label: 'Compare' },
          { id: 'helpdesk', label: 'Help Desk' },
          { id: 'ask', label: 'Ask AI' },
          { id: 'saved', label: `Saved (${savedCount})` },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => onPageChange(item.id as AppPage)}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap shrink-0 transition-colors ${
              activePage === item.id
                ? 'bg-emerald-600 text-white font-bold shadow-xs'
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
