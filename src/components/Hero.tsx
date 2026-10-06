import React from 'react';
import {
  Store,
  Landmark,
  Sprout,
  Bot,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import { LanguageCode, AppPage } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { TTSButton } from './TTSButton';
import heroImg from '../assets/images/bhumitra_hero_farm_1790413180340.jpg';
import farmerMascot from '../assets/images/farmer_friendly_mascot_1790414440682.jpg';

interface HeroProps {
  language: LanguageCode;
  onStartClick: () => void;
  onCompareClick: () => void;
  onNavigatePage?: (page: AppPage) => void;
}

export const Hero: React.FC<HeroProps> = ({
  language,
  onStartClick,
  onNavigatePage,
}) => {
  const t = TRANSLATIONS[language];

  const heroSpeechText =
    language === 'kn'
      ? 'ಭೂಮಿತ್ರ. ಮಾರುಕಟ್ಟೆ ಅರಿಯಿರಿ. ಸರಿಯಾದ ಬೆಳೆ ಆಯ್ಕೆ ಮಾಡಿ. ಸ್ಮಾರ್ಟ್ ಆಗಿ ಬೆಳೆಯಿರಿ. ಎಪಿಎಂಸಿ ಮಾರುಕಟ್ಟೆ ಬೆಲೆ, ಬೆಳೆ ಸೂಕ್ತತೆ, ಸ್ಕೀಮ್ ಸಾಥಿ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು ಮತ್ತು ಭೂಮಿತ್ರ ಎಐ ಸಲಹೆಗಾರ.'
      : 'BHUMITRA. Know the Market. Choose the Crop. Grow Smarter. Make smarter crop decisions by combining APMC market prices, soil suitability, Scheme Saathi government subsidies, and BHUMITRA AI.';

  return (
    <section className="relative overflow-hidden pt-6 pb-10 bg-gradient-to-b from-emerald-50/70 via-sky-50/30 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Startup Brand, Tagline, Description, Action Buttons */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <span className="text-xs font-extrabold text-emerald-800 tracking-wide">
                BHUMITRA AgriTech · APMC Market · Crop Suitability · Scheme Saathi · AI
              </span>

              <TTSButton
                id="hero-platform-intro"
                title="BHUMITRA Platform Introduction"
                textToSpeak={heroSpeechText}
                language={language}
                size="sm"
                variant="pill"
              />
            </div>

            {/* Official Tagline: "Know the Market. Choose the Crop. Grow Smarter." */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-5xl lg:text-[52px] font-extrabold text-slate-900 tracking-tight leading-[1.12] font-heading">
                {language === 'kn' ? (
                  <>
                    ಮಾರುಕಟ್ಟೆ ಅರಿಯಿರಿ. ಬೆಳೆ ಆಯ್ಕೆ ಮಾಡಿ.{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 via-amber-500 to-sky-600">
                      ಸ್ಮಾರ್ಟ್ ಆಗಿ ಬೆಳೆಯಿರಿ.
                    </span>
                  </>
                ) : language === 'hi' ? (
                  <>
                    बाज़ार जानें। सही फसल चुनें।{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 via-amber-500 to-sky-600">
                      स्मार्ट खेती करें।
                    </span>
                  </>
                ) : (
                  <>
                    Know the Market. Choose the Crop.{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 via-amber-500 to-sky-600">
                      Grow Smarter.
                    </span>
                  </>
                )}
              </h1>
              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
                {language === 'kn'
                  ? 'ಎಪಿಎಂಸಿ ಮಾರುಕಟ್ಟೆ ಧಾರಣೆ, ನಿಮ್ಮ ಭೂಮಿಯ ಮಣ್ಣಿನ ಸೂಕ್ತತೆ, ಸ್ಕೀಮ್ ಸಾಥಿ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು ಮತ್ತು ಭೂಮಿತ್ರ AI — ರೈತರ ಉತ್ತಮ ನಿರ್ಧಾರಕ್ಕಾಗಿ ಒಂದೇ ವೇದಿಕೆ.'
                  : 'Combine verified APMC Mandi prices, soil & water crop suitability, Scheme Saathi government subsidies, and contextual AI in one farmer-first platform.'}
              </p>
            </div>

            {/* Primary CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-1">
              <button
                onClick={onStartClick}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-emerald-700/25 transition-all"
              >
                <span>{t.findBestCrop}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigatePage && onNavigatePage('apmc')}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-extrabold text-sm sm:text-base shadow-md shadow-amber-500/20 transition-colors"
              >
                <Store className="w-4 h-4" />
                <span>{language === 'kn' ? 'ಎಪಿಎಂಸಿ ಧಾರಣೆ (Mandi Prices)' : 'Mandi / APMC Prices'}</span>
              </button>

              <button
                onClick={() => onNavigatePage && onNavigatePage('schemes')}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-extrabold text-sm sm:text-base shadow-md shadow-sky-600/20 transition-colors"
              >
                <Landmark className="w-4 h-4" />
                <span>{language === 'kn' ? 'ಸ್ಕೀಮ್ ಸಾಥಿ (Schemes)' : 'Scheme Saathi'}</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 text-xs text-slate-500 pt-1 font-medium">
              <span className="inline-flex items-center gap-1.5 text-emerald-800 font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Verified AGMARKNET & .gov.in Sources</span>
              </span>
              <span>·</span>
              <span>Kannada (ಕನ್ನಡ) + English Voice Ready</span>
              <span>·</span>
              <span>Zero Fabricated Prices</span>
            </div>
          </div>

          {/* Right Column: 3D-Styled Visual Showcase Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100 aspect-16/11 group">
                <img
                  src={heroImg}
                  alt="Thriving Indian Agricultural Fields under bright skies"
                  className="w-full h-full object-cover transform group-hover:scale-102 transition-transform duration-700"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/25 to-transparent" />

                {/* Floating Market + Suitability Snapshot Overlay */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-xl flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl overflow-hidden border-2 border-emerald-500 bg-emerald-50 shrink-0">
                    <img
                      src={farmerMascot}
                      alt="Friendly Indian farmer mascot"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between text-xs mb-0.5">
                      <span className="font-extrabold text-slate-900 truncate">
                        {language === 'kn' ? 'ರಾಗಿ · ಯಶವಂತಪುರ ಎಪಿಎಂಸಿ' : 'Ragi · Yeshwanthpur APMC'}
                      </span>
                      <span className="text-emerald-700 font-extrabold font-mono text-xs flex items-center gap-0.5 shrink-0">
                        <TrendingUp className="w-3.5 h-3.5" />
                        ₹4,310/qtl
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 line-clamp-2">
                      {language === 'kn'
                        ? '96% ಭೂಮಿ ಸೂಕ್ತತೆ + ಬೆಂಬಲ ಬೆಲೆಗಿಂತ (₹4,290) ಹೆಚ್ಚಿನ ಮಾರುಕಟ್ಟೆ ಧಾರಣೆ.'
                        : '96% Red Soil Suitability + Trading above ₹4,290 MSP Benchmark.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Core Startup Pillar Cards (Green, Yellow, Sky Blue, White) */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            type="button"
            onClick={() => onNavigatePage && onNavigatePage('apmc')}
            className="text-left bg-white rounded-2xl p-5 border-2 border-amber-200 shadow-sm hover:shadow-md hover:border-amber-400 transition-all"
          >
            <div className="w-11 h-11 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center mb-3 shadow-xs">
              <Store className="w-5 h-5" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 mb-1 font-heading">
              {language === 'kn' ? '1. ಎಪಿಎಂಸಿ ಮಾರುಕಟ್ಟೆ ಧಾರಣೆ' : '1. APMC Market Intelligence'}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {language === 'kn'
                ? 'ರಾಜ್ಯ, ಜಿಲ್ಲೆ ಮತ್ತು ಮಂಡಿ ವಾರು ಕನಿಷ್ಠ, ಗರಿಷ್ಠ ಮತ್ತು ಮಾದರಿ ಬೆಲೆ ಹಾಗೂ ಟ್ರೆಂಡ್ ಚಾರ್ಟ್.'
                : 'Filter by State, District, Mandi & Crop with ↑ Rising / → Stable / ↓ Falling price trends.'}
            </p>
          </button>

          <button
            type="button"
            onClick={onStartClick}
            className="text-left bg-white rounded-2xl p-5 border-2 border-emerald-200 shadow-sm hover:shadow-md hover:border-emerald-400 transition-all"
          >
            <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mb-3 shadow-xs">
              <Sprout className="w-5 h-5" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 mb-1 font-heading">
              {language === 'kn' ? '2. ಬೆಳೆ ಸೂಕ್ತತೆ ಮತ್ತು ಲಾಭ' : '2. Crop Suitability + Price'}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {language === 'kn'
                ? '“ನನ್ನ ಭೂಮಿಗೆ ಈ ಬೆಳೆ ಸೂಕ್ತವೇ?” + “ಮಾರುಕಟ್ಟೆ ಬೆಲೆ ಎಷ್ಟು?” ಒಂದೇ ನೋಟದಲ್ಲಿ ಹೋಲಿಸಿ.'
                : 'Compare “Is this crop suitable for my land?” + “What is its current market price?”'}
            </p>
          </button>

          <button
            type="button"
            onClick={() => onNavigatePage && onNavigatePage('schemes')}
            className="text-left bg-white rounded-2xl p-5 border-2 border-sky-200 shadow-sm hover:shadow-md hover:border-sky-400 transition-all"
          >
            <div className="w-11 h-11 rounded-2xl bg-sky-600 text-white flex items-center justify-center mb-3 shadow-xs">
              <Landmark className="w-5 h-5" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 mb-1 font-heading">
              {language === 'kn' ? '3. ಸ್ಕೀಮ್ ಸಾಥಿ (Scheme Saathi)' : '3. Scheme Saathi Finder'}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {language === 'kn'
                ? 'ಪಿಎಂ-ಕಿಸಾನ್, ಬೆಳೆ ವಿಮೆ, ಕೃಷಿ ಭಾಗ್ಯ ಮತ್ತು ಹನಿ ನೀರಾವರಿ ಸಹಾಯಧನದ ಅಧಿಕೃತ ಮಾಹಿತಿ.'
                : 'Verified Central & State subsidies matched to your state, crop, and land size.'}
            </p>
          </button>

          <button
            type="button"
            onClick={() => onNavigatePage && onNavigatePage('ask')}
            className="text-left bg-white rounded-2xl p-5 border-2 border-emerald-200 shadow-sm hover:shadow-md hover:border-emerald-400 transition-all"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-600 to-sky-600 text-white flex items-center justify-center mb-3 shadow-xs">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 mb-1 font-heading">
              {language === 'kn' ? '4. ಭೂಮಿತ್ರ AI ಸಲಹೆಗಾರ' : '4. BHUMITRA AI Assistant'}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {language === 'kn'
                ? 'ಕನ್ನಡ ಮತ್ತು ಇಂಗ್ಲಿಷ್ ಧ್ವನಿ ಬೆಂಬಲದೊಂದಿಗೆ ಮಾರುಕಟ್ಟೆ, ಯೋಜನೆ ಮತ್ತು ಕೃಷಿ ಪ್ರಶ್ನೋತ್ತರ.'
                : 'Gemini + optional OpenAI assistant connected to crops, weather, APMC & schemes.'}
            </p>
          </button>
        </div>
      </div>
    </section>
  );
};
