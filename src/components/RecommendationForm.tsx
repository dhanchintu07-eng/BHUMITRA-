import React, { useState } from 'react';
import {
  MapPin,
  Layers,
  Calendar,
  CloudRain,
  Droplet,
  Compass,
  Sparkles,
  History,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Info,
  Volume2,
  VolumeX
} from 'lucide-react';
import { SoilType, Season, WaterAvailability, LandUnit, UserFarmingConditions, LanguageCode, RecentSearch } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface RecommendationFormProps {
  language: LanguageCode;
  initialConditions: UserFarmingConditions;
  onSubmit: (conditions: UserFarmingConditions) => void;
  isLoading: boolean;
  recentSearches: RecentSearch[];
  onSelectRecent: (conditions: UserFarmingConditions) => void;
}

const INDIAN_STATES = [
  'Karnataka',
  'Punjab',
  'Maharashtra',
  'Uttar Pradesh',
  'Madhya Pradesh',
  'Rajasthan',
  'Gujarat',
  'Telangana',
  'Andhra Pradesh',
  'Tamil Nadu',
  'Haryana',
  'Bihar',
  'West Bengal',
  'Odisha',
  'Chhattisgarh',
  'Assam',
  'Jharkhand',
  'Kerala',
];

export const RecommendationForm: React.FC<RecommendationFormProps> = ({
  language,
  initialConditions,
  onSubmit,
  isLoading,
  recentSearches,
  onSelectRecent,
}) => {
  const t = TRANSLATIONS[language];

  // Wizard inner step (1 to 4)
  const [wizardStep, setWizardStep] = useState<number>(1);

  const [location, setLocation] = useState(initialConditions.location || 'Karnataka');
  const [soilType, setSoilType] = useState<SoilType>(initialConditions.soilType || 'red');
  const [season, setSeason] = useState<Season>(initialConditions.season || 'kharif');
  const [rainfall, setRainfall] = useState<number>(initialConditions.rainfall || 650);
  const [waterAvailability, setWaterAvailability] = useState<WaterAvailability>(initialConditions.waterAvailability || 'medium');
  const [landSize, setLandSize] = useState<number | undefined>(initialConditions.landSize || 2.5);
  const [landUnit, setLandUnit] = useState<LandUnit>(initialConditions.landUnit || 'Acres');

  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onSubmit({
      location: location.trim(),
      soilType,
      season,
      rainfall,
      waterAvailability,
      landSize: landSize || 1,
      landUnit,
    });
  };

  const handleSpeakStep = () => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    let text = '';
    if (wizardStep === 1) {
      text = `Step 1: Choose your state and farm location. Currently selected is ${location}.`;
    } else if (wizardStep === 2) {
      text = `Step 2: Choose your soil type. Options are Red soil, Black soil, Loamy soil, Sandy soil, or Clay soil. Selected is ${soilType} soil.`;
    } else if (wizardStep === 3) {
      text = `Step 3: Select your cropping season and average regional rainfall. Current season is ${season}, and rainfall is ${rainfall} millimeters.`;
    } else {
      text = `Step 4: Select your farm irrigation availability: Low, Medium, or High, and enter your land size.`;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    if (language === 'kn') utterance.lang = 'kn-IN';
    else if (language === 'hi') utterance.lang = 'hi-IN';
    else if (language === 'ta') utterance.lang = 'ta-IN';
    else if (language === 'te') utterance.lang = 'te-IN';
    else utterance.lang = 'en-IN';

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const handlePresetSelect = (preset: {
    location: string;
    soilType: SoilType;
    season: Season;
    rainfall: number;
    waterAvailability: WaterAvailability;
  }) => {
    setLocation(preset.location);
    setSoilType(preset.soilType);
    setSeason(preset.season);
    setRainfall(preset.rainfall);
    setWaterAvailability(preset.waterAvailability);
    setWizardStep(4);
  };

  return (
    <div className="bg-white rounded-3xl border border-emerald-100 shadow-xl shadow-emerald-950/5 p-6 sm:p-10 space-y-8">
      {/* Wizard Header & Stepper */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold mb-2 border border-emerald-200">
            <Compass className="w-3.5 h-3.5 text-emerald-600" />
            <span>Crop Decision Wizard · Step {wizardStep} of 4</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
            {t.formTitle}
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            {t.formSub}
          </p>
        </div>

        {/* Audio Listen for illiterate / non-reading farmers */}
        <button
          type="button"
          onClick={handleSpeakStep}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold border border-amber-200 transition-colors shadow-2xs"
          title="Listen instructions for this step"
        >
          {isSpeaking ? (
            <>
              <VolumeX className="w-4 h-4 text-amber-700" />
              <span>{t.stopAudio}</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4 text-amber-700" />
              <span>{t.listenTip} (ಕೇಳಿ / Listen Step)</span>
            </>
          )}
        </button>
      </div>

      {/* Progress Dots Bar */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { num: 1, label: '1. Location' },
          { num: 2, label: '2. Soil Type' },
          { num: 3, label: '3. Season & Rain' },
          { num: 4, label: '4. Water & Land' },
        ].map((s) => (
          <button
            key={s.num}
            type="button"
            onClick={() => setWizardStep(s.num)}
            className={`py-2 px-3 rounded-xl text-xs font-bold text-left transition-all ${
              wizardStep === s.num
                ? 'bg-emerald-700 text-white shadow-sm'
                : wizardStep > s.num
                ? 'bg-emerald-100 text-emerald-900'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
            }`}
          >
            <span className="block truncate">{s.label}</span>
          </button>
        ))}
      </div>

      {/* 1-Click Common Farm Scenarios (Quick presets) */}
      <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 mb-2">
          <History className="w-4 h-4 text-emerald-600" />
          <span>{t.recentSearches} · 1-Click Common Farm Scenarios:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() =>
              handlePresetSelect({
                location: 'Karnataka',
                soilType: 'red',
                season: 'kharif',
                rainfall: 650,
                waterAvailability: 'medium',
              })
            }
            className="text-xs px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-emerald-500 hover:text-emerald-700 font-medium transition-colors shadow-2xs"
          >
            🌾 Karnataka · Red Soil · Kharif (Ragi & Groundnut)
          </button>
          <button
            type="button"
            onClick={() =>
              handlePresetSelect({
                location: 'Punjab',
                soilType: 'loamy',
                season: 'rabi',
                rainfall: 550,
                waterAvailability: 'high',
              })
            }
            className="text-xs px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-emerald-500 hover:text-emerald-700 font-medium transition-colors shadow-2xs"
          >
            🌾 Punjab · Loamy · Rabi (Wheat & Mustard)
          </button>
          <button
            type="button"
            onClick={() =>
              handlePresetSelect({
                location: 'Maharashtra',
                soilType: 'black',
                season: 'kharif',
                rainfall: 750,
                waterAvailability: 'medium',
              })
            }
            className="text-xs px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-emerald-500 hover:text-emerald-700 font-medium transition-colors shadow-2xs"
          >
            ☁️ Maharashtra · Black Soil · Kharif (Cotton & Soybean)
          </button>
          <button
            type="button"
            onClick={() =>
              handlePresetSelect({
                location: 'Rajasthan',
                soilType: 'sandy',
                season: 'kharif',
                rainfall: 320,
                waterAvailability: 'low',
              })
            }
            className="text-xs px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-emerald-500 hover:text-emerald-700 font-medium transition-colors shadow-2xs"
          >
            ☀️ Rajasthan · Sandy · Low Water (Bajra & Pulses)
          </button>
          {recentSearches.map((rs) => (
            <button
              key={rs.id}
              type="button"
              onClick={() => onSelectRecent(rs.conditions)}
              className="text-xs px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 font-medium hover:bg-emerald-100 transition-colors shadow-2xs"
            >
              🕒 {rs.label}
            </button>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="min-h-[280px]">
        {/* Step 1: Location */}
        {wizardStep === 1 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <label className="block text-base font-bold text-slate-900 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-600" />
                <span>1. {t.locationLabel}</span>
              </span>
              <span className="text-xs text-slate-500 font-normal">Select or type your state/district</span>
            </label>

            <div className="relative max-w-lg">
              <input
                type="text"
                list="states-list-wizard"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder={t.locationPlaceholder}
                className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-white text-slate-900 text-base font-medium focus:ring-2 focus:ring-emerald-500 shadow-2xs"
              />
              <datalist id="states-list-wizard">
                {INDIAN_STATES.map((s) => (
                  <option key={s} value={s} />
                ))}
              </datalist>
            </div>

            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-slate-500 block">Quick Pick Agricultural States:</span>
              <div className="flex flex-wrap gap-2">
                {['Karnataka', 'Punjab', 'Maharashtra', 'Uttar Pradesh', 'Madhya Pradesh', 'Rajasthan', 'Gujarat', 'Tamil Nadu', 'Telangana', 'Andhra Pradesh'].map((quickState) => (
                  <button
                    key={quickState}
                    type="button"
                    onClick={() => setLocation(quickState)}
                    className={`text-xs px-3.5 py-2 rounded-xl border font-bold transition-colors ${
                      location.toLowerCase().includes(quickState.toLowerCase())
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-2xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-emerald-50 hover:text-emerald-800'
                    }`}
                  >
                    {quickState}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Soil Type */}
        {wizardStep === 2 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <label className="block text-base font-bold text-slate-900 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-600" />
                <span>2. {t.soilLabel}</span>
              </span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
                Selected: {t.soilTypes[soilType]}
              </span>
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { id: 'red', title: t.soilTypes.red, desc: t.soilTypes.redDesc, badge: 'RED SOIL', color: 'bg-red-100 text-red-900 border-red-200' },
                { id: 'black', title: t.soilTypes.black, desc: t.soilTypes.blackDesc, badge: 'REGUR / BLACK', color: 'bg-stone-800 text-stone-100 border-stone-700' },
                { id: 'loamy', title: t.soilTypes.loamy, desc: t.soilTypes.loamyDesc, badge: 'LOAMY SOIL', color: 'bg-amber-100 text-amber-900 border-amber-200' },
                { id: 'clay', title: t.soilTypes.clay, desc: t.soilTypes.clayDesc, badge: 'CLAY SOIL', color: 'bg-orange-100 text-orange-900 border-orange-200' },
                { id: 'sandy', title: t.soilTypes.sandy, desc: t.soilTypes.sandyDesc, badge: 'SANDY SOIL', color: 'bg-yellow-100 text-yellow-900 border-yellow-200' },
                { id: 'other', title: t.soilTypes.other, desc: t.soilTypes.otherDesc, badge: 'ALLUVIAL / MIXED', color: 'bg-emerald-100 text-emerald-900 border-emerald-200' },
              ].map((s) => {
                const isSelected = soilType === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSoilType(s.id as SoilType)}
                    className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between h-32 relative ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/30 shadow-md'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${s.color}`}>
                        {s.badge}
                      </span>
                      {isSelected && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                    </div>
                    <div>
                      <span className="text-sm font-extrabold text-slate-900 block font-heading">
                        {s.title}
                      </span>
                      <span className="text-xs text-slate-500 line-clamp-2 mt-0.5 leading-snug">
                        {s.desc}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Season & Rainfall */}
        {wizardStep === 3 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Season */}
            <div className="space-y-2">
              <label className="block text-base font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-600" />
                <span>3. {t.seasonLabel}</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'kharif', label: t.seasons.kharif, desc: t.seasons.kharifDesc, badge: 'Monsoon (ಮುಂಗಾರು)' },
                  { id: 'rabi', label: t.seasons.rabi, desc: t.seasons.rabiDesc, badge: 'Winter (ಹಿಂಗಾರು)' },
                  { id: 'zaid', label: t.seasons.zaid, desc: t.seasons.zaidDesc, badge: 'Summer (ಬೇಸಿಗೆ)' },
                ].map((s) => {
                  const isSelected = season === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSeason(s.id as Season)}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/70 ring-2 ring-emerald-500/20 shadow-md'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-extrabold uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                          {s.badge}
                        </span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                      </div>
                      <span className="text-sm font-bold text-slate-900 block font-heading">
                        {s.label}
                      </span>
                      <span className="text-xs text-slate-500 block mt-1 leading-snug">
                        {s.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Rainfall Slider */}
            <div className="p-5 rounded-2xl bg-sky-50/60 border border-sky-100 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <CloudRain className="w-4 h-4 text-sky-600" />
                  <span>{t.rainfallLabel}</span>
                </label>
                <span className="text-base font-extrabold text-sky-800 bg-white px-3.5 py-1 rounded-xl border border-sky-200 shadow-2xs font-mono">
                  {rainfall} mm
                </span>
              </div>

              <input
                type="range"
                min="200"
                max="2000"
                step="50"
                value={rainfall}
                onChange={(e) => setRainfall(Number(e.target.value))}
                className="w-full accent-sky-600 cursor-pointer h-2.5 bg-sky-200 rounded-lg"
              />

              <div className="flex justify-between text-xs text-slate-500 font-medium">
                <button
                  type="button"
                  onClick={() => setRainfall(350)}
                  className={`hover:text-sky-700 ${rainfall < 500 ? 'font-bold text-sky-700' : ''}`}
                >
                  Low (&lt;500mm)
                </button>
                <button
                  type="button"
                  onClick={() => setRainfall(750)}
                  className={`hover:text-sky-700 ${rainfall >= 500 && rainfall <= 1000 ? 'font-bold text-sky-700' : ''}`}
                >
                  Moderate (500–1000mm)
                </button>
                <button
                  type="button"
                  onClick={() => setRainfall(1300)}
                  className={`hover:text-sky-700 ${rainfall > 1000 ? 'font-bold text-sky-700' : ''}`}
                >
                  Heavy (&gt;1000mm)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Water Availability & Land Size */}
        {wizardStep === 4 && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Water Availability */}
            <div className="space-y-3">
              <label className="block text-base font-bold text-slate-900 flex items-center gap-2">
                <Droplet className="w-5 h-5 text-emerald-600" />
                <span>4. {t.waterLabel}</span>
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'low', label: t.waterLevels.low, desc: t.waterLevels.lowDesc },
                  { id: 'medium', label: t.waterLevels.medium, desc: t.waterLevels.mediumDesc },
                  { id: 'high', label: t.waterLevels.high, desc: t.waterLevels.highDesc },
                ].map((w) => {
                  const isSelected = waterAvailability === w.id;
                  return (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => setWaterAvailability(w.id as WaterAvailability)}
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? 'border-emerald-600 bg-white ring-2 ring-emerald-500/20 shadow-md'
                          : 'border-slate-200 bg-slate-50/70 hover:bg-white'
                      }`}
                    >
                      <span className="text-sm font-extrabold text-slate-900 block font-heading">
                        {w.label}
                      </span>
                      <span className="text-xs text-slate-500 block mt-1 leading-snug">
                        {w.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Land Area */}
            <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-sm font-bold text-slate-900 block">
                  {t.landLabel}
                </span>
                <span className="text-xs text-slate-500 block mt-0.5">
                  Used for total yield harvest calculations and fertilizer budget.
                </span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={landSize || ''}
                  onChange={(e) => setLandSize(e.target.value ? Number(e.target.value) : undefined)}
                  placeholder={t.landPlaceholder}
                  className="w-28 px-4 py-3 rounded-xl border border-slate-200 bg-white text-base font-bold text-slate-800 text-center focus:ring-2 focus:ring-emerald-500"
                />
                <select
                  value={landUnit}
                  onChange={(e) => setLandUnit(e.target.value as LandUnit)}
                  className="px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-700 focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Acres">Acres (ಎಕರೆ)</option>
                  <option value="Hectares">Hectares (ಹೆಕ್ಟೇರ್)</option>
                  <option value="Bigha">Bigha (ವಿಘಾ)</option>
                  <option value="Guntha">Guntha (ಗುಂಟೆ)</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Wizard Stepper Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100 gap-3">
        {wizardStep > 1 ? (
          <button
            type="button"
            onClick={() => setWizardStep(wizardStep - 1)}
            className="px-5 py-3.5 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-sm flex items-center gap-1.5 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{t.prevStep}</span>
          </button>
        ) : (
          <div />
        )}

        {wizardStep < 4 ? (
          <button
            type="button"
            onClick={() => setWizardStep(wizardStep + 1)}
            className="px-7 py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm flex items-center gap-2 transition-all shadow-md shadow-emerald-700/20"
          >
            <span>{t.nextStep}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => handleSubmit()}
            disabled={isLoading}
            className={`px-8 py-4 rounded-2xl font-extrabold text-sm sm:text-base text-white shadow-xl transition-all flex items-center gap-2 ${
              isLoading
                ? 'bg-slate-400 cursor-not-allowed'
                : 'bg-emerald-700 hover:bg-emerald-800 shadow-emerald-700/25 hover:shadow-2xl hover:shadow-emerald-700/30'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>{t.analyzingButton}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>{t.generateButton} → (View Results Page)</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
