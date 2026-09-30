import React, { useState } from 'react';
import { Cpu, Users, Droplets, CalendarCheck, ArrowRight, ShieldCheck, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { LanguageCode } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { TTSButton } from './TTSButton';
import heroImg from '../assets/images/bhumitra_hero_farm_1790413180340.jpg';
import farmerMascot from '../assets/images/farmer_friendly_mascot_1790414440682.jpg';

interface HeroProps {
  language: LanguageCode;
  onStartClick: () => void;
  onCompareClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ language, onStartClick, onCompareClick }) => {
  const t = TRANSLATIONS[language];

  const heroSpeechText = `${t.appName}. ${t.tagline}. ${t.heroSub}`;

  return (
    <section className="relative overflow-hidden pt-6 pb-10 bg-gradient-to-b from-emerald-50/60 via-white to-[#F8FAF5]">
      {/* Decorative gentle background ambient circles */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-100/40 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-12 left-10 w-80 h-80 bg-emerald-100/50 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Brand, Tagline, Description, Action Buttons */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Trust badge with Audio Listen Button */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100/70 text-emerald-800 text-xs font-bold border border-emerald-200 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Next-Gen Indian Agri-Tech · ICAR Aligned Model</span>
              </div>

              <TTSButton
                id="hero-platform-intro"
                title="Platform Introduction"
                textToSpeak={heroSpeechText}
                language={language}
                size="sm"
                variant="pill"
              />
            </div>

            {/* Tagline & Headline */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] font-heading">
                {language === 'kn' ? (
                  <>
                    ಸ್ಮಾರ್ಟ್ ಬೆಳೆ ನಿರ್ಧಾರ.{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 via-green-600 to-amber-600">
                      ಉತ್ತಮ ಇಳುವರಿ.
                    </span>
                  </>
                ) : (
                  <>
                    Smart Crop Decisions.{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-700 via-green-600 to-amber-600">
                      Better Harvests.
                    </span>
                  </>
                )}
              </h1>
              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
                {t.heroSub}
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                onClick={onStartClick}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-base shadow-lg shadow-emerald-700/25 hover:shadow-xl hover:shadow-emerald-700/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>{t.findBestCrop} (Page 2)</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={onCompareClick}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-base border border-slate-200 shadow-xs hover:border-slate-300 transition-colors"
              >
                <span>{t.exploreLibrary}</span>
              </button>
            </div>

            {/* Subtle verification footnote */}
            <div className="flex items-center justify-center lg:justify-start gap-4 text-xs text-slate-500 pt-1 font-medium">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% Free for Farmers</span>
              </span>
              <span>·</span>
              <span>Kannada (ಕನ್ನಡ) & 6 Languages</span>
              <span>·</span>
              <span>Recharts Nutrient & Growth Analytics</span>
            </div>
          </div>

          {/* Right Column: Hero Visual Showcase with Friendly Farmer Mascot */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100 aspect-16/11 group">
                <img
                  src={heroImg}
                  alt="Thriving Indian Agricultural Fields with modern irrigation under bright skies"
                  className="w-full h-full object-cover transform group-hover:scale-102 transition-transform duration-700"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />

                {/* Overlaid highlight card featuring farmer mascot */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-lg border border-white/60 flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl overflow-hidden border-2 border-emerald-400 bg-emerald-50 shrink-0">
                    <img
                      src={farmerMascot}
                      alt="Friendly Indian farmer mascot giving thumbs up"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between text-xs mb-0.5">
                      <span className="font-extrabold text-slate-900 truncate">
                        {language === 'kn' ? 'ಸ್ಮಾರ್ಟ್ ಕೃಷಿ ನಿರ್ಧಾರ' : 'Smart Farm Guidance'}
                      </span>
                      <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded text-[11px] shrink-0">
                        98% Match
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 line-clamp-2">
                      {language === 'kn'
                        ? 'ಮಣ್ಣು, ಮಳೆ ಮತ್ತು ಹವಾಮಾನಕ್ಕೆ ತಕ್ಕಂತೆ ಧ್ವನಿ ಸಹಿತ ಕೃಷಿ ಸಲಹೆ.'
                        : 'Calibrated with ICAR soil charts, weather station forecasts, and voice narration.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Feature Cards Section */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1 font-heading">
              {t.quickFeatures.title1}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t.quickFeatures.desc1}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-amber-100 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-3">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1 font-heading">
              {t.quickFeatures.title2}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t.quickFeatures.desc2}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-sky-100 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center mb-3">
              <Droplets className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1 font-heading">
              {t.quickFeatures.title3}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t.quickFeatures.desc3}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-3">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1 font-heading">
              {t.quickFeatures.title4}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {t.quickFeatures.desc4}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
