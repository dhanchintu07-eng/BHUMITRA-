import React from 'react';
import { Sprout, ShieldCheck } from 'lucide-react';
import { LanguageCode, AppPage } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface FooterProps {
  language: LanguageCode;
  onNavigate: (page: AppPage) => void;
}

export const Footer: React.FC<FooterProps> = ({ language, onNavigate }) => {
  const t = TRANSLATIONS[language];

  return (
    <footer className="bg-white border-t border-slate-200 mt-16 pt-12 pb-10 text-slate-600 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-100">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900 font-heading">
                BHUMITRA
              </span>
            </div>
            <p className="text-xs text-slate-500 max-w-md leading-relaxed">
              {t.tagline} — An open, accessible agri-tech intelligence engine calibrated for Indian farming conditions, soil textures, rainfall variability, and seasonal crop cycles.
            </p>
            <div className="flex items-center gap-2 text-emerald-800 font-medium pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Grounded in ICAR & State Agricultural Universities agronomy principles.</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2.5">
            <span className="font-bold text-slate-900 block text-sm font-heading">
              Platform Pages
            </span>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('wizard')}
                  className="hover:text-emerald-700 transition-colors"
                >
                  Page 2: {t.findBestCrop}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('results')}
                  className="hover:text-emerald-700 transition-colors"
                >
                  Page 3: {t.resultsTitle}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('charts')}
                  className="hover:text-emerald-700 transition-colors"
                >
                  Page 4: {t.chartsTitle}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('compare')}
                  className="hover:text-emerald-700 transition-colors"
                >
                  Page 5: {t.compareTitle}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('helpdesk')}
                  className="hover:text-emerald-700 transition-colors"
                >
                  Page 6: {language === 'kn' ? 'ಕೃಷಿ ಸಹಾಯ ಕೇಂದ್ರ (Help Desk)' : 'AI Help Desk & Routine'}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('ask')}
                  className="hover:text-emerald-700 transition-colors"
                >
                  Page 7: {t.askAiTitle}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('saved')}
                  className="hover:text-emerald-700 transition-colors"
                >
                  Page 8: {t.savedTitle}
                </button>
              </li>
            </ul>
          </div>

          {/* Agro Advisory Note */}
          <div className="space-y-2.5">
            <span className="font-bold text-slate-900 block text-sm font-heading">
              Farmer Advisory Notice
            </span>
            <p className="text-xs text-slate-500 leading-relaxed">
              BHUMITRA recommendations serve as scientific decision-support. Periodic laboratory soil testing through your district Krishi Vigyan Kendra (KVK) is recommended for precision macro and micro-nutrient application.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400">
          <p>© {new Date().getFullYear()} BHUMITRA (ಭೂಮಿತ್ರ / भूमिमित्र). Built with care for Indian farmers and agriculture students.</p>
          <div className="flex items-center gap-2 text-slate-500">
            <span>Clean Tech</span>
            <span>·</span>
            <span>Water-Aware Agriculture</span>
            <span>·</span>
            <span>Zero-Hype Decision Support</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
