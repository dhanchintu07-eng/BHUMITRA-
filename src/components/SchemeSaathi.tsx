import React, { useState, useMemo } from 'react';
import {
  Landmark,
  CheckCircle2,
  FileText,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Calculator,
  Info,
  ClipboardCheck,
  HelpCircle,
} from 'lucide-react';
import {
  GOVERNMENT_SCHEMES,
  GovernmentScheme,
  FarmerProfileTag,
} from '../data/schemesData';
import { APMC_STATES } from '../data/apmcData';
import { CROPS_DATA } from '../data/crops';
import { LanguageCode, UserFarmingConditions } from '../types';
import { TTSButton } from './TTSButton';

interface SchemeSaathiProps {
  language: LanguageCode;
  userConditions: UserFarmingConditions;
  onAskSchemeAI: (prompt: string) => void;
}

const PROFILE_OPTIONS: { id: FarmerProfileTag; label: string; labelKn: string }[] = [
  { id: 'all', label: 'All Farming Profiles', labelKn: 'ಎಲ್ಲಾ ರೈತರು' },
  { id: 'small_marginal', label: 'Small & Marginal (< 5 Acres)', labelKn: 'ಸಣ್ಣ ಮತ್ತು ಅತಿ ಸಣ್ಣ ರೈತರು (< 5 ಎಕರೆ)' },
  { id: 'rainfed', label: 'Rainfed / Dryland Cultivator', labelKn: 'ಮಳೆ ಆಶ್ರಿತ ಕೃಷಿಕರು' },
  { id: 'irrigation_drip', label: 'Drip, Sprinkler & Solar Pump', labelKn: 'ಹನಿ ನೀರಾವರಿ ಮತ್ತು ಸೋಲಾರ್ ಪಂಪ್' },
  { id: 'millet_grower', label: 'Millet (Shree Anna) & Pulse Grower', labelKn: 'ಸಿರಿಧಾನ್ಯ (ರಾಗಿ/ಸಜ್ಜೆ) ಮತ್ತು ದ್ವಿದಳ ಧಾನ್ಯ' },
  { id: 'women_sc_st', label: 'Women / SC / ST Priority Subsidy', labelKn: 'ಮಹಿಳಾ / ಪ.ಜಾತಿ / ಪ.ಪಂಗಡ ವಿಶೇಷ ಸಹಾಯಧನ' },
  { id: 'credit_insurance', label: 'Crop Loan (KCC) & Harvest Insurance', labelKn: 'ಬೆಳೆ ಸಾಲ (KCC) ಮತ್ತು ಬೆಳೆ ವಿಮೆ' },
];

export const SchemeSaathi: React.FC<SchemeSaathiProps> = ({
  language,
  userConditions,
  onAskSchemeAI,
}) => {
  const [selectedState, setSelectedState] = useState<string>(
    APMC_STATES.includes(userConditions.location) ? userConditions.location : 'Karnataka'
  );
  const [selectedCrop, setSelectedCrop] = useState<string>('All Crops');
  const [landSizeAcres, setLandSizeAcres] = useState<number>(userConditions.landSize || 2.5);
  const [selectedProfile, setSelectedProfile] = useState<FarmerProfileTag>('all');

  const filteredSchemes = useMemo(() => {
    return GOVERNMENT_SCHEMES.filter((scheme) => {
      const stateMatch =
        scheme.applicableStates.includes('All India') ||
        scheme.applicableStates.some((s) => s.toLowerCase() === selectedState.toLowerCase());

      const cropMatch =
        selectedCrop === 'All Crops' ||
        scheme.applicableCrops.includes('All Crops') ||
        scheme.applicableCrops.includes(selectedCrop);

      const profileMatch =
        selectedProfile === 'all' || scheme.profileTags.includes(selectedProfile);

      return stateMatch && cropMatch && profileMatch;
    });
  }, [selectedState, selectedCrop, selectedProfile]);

  const calculateEstimatedBenefit = (scheme: GovernmentScheme, acres: number): string | null => {
    if (!scheme.estimateRulePerAcre) return null;
    const raw = Math.round(scheme.estimateRulePerAcre * Math.max(0.5, acres));
    const capped = scheme.estimateCapRupees ? Math.min(raw, scheme.estimateCapRupees) : raw;
    return `₹${capped.toLocaleString('en-IN')}`;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-amber-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-300">
              <Landmark className="w-4 h-4" />
              <span>2. Scheme Saathi · Verified Government Scheme Finder</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-heading">
              {language === 'kn'
                ? 'ಸ್ಕೀಮ್ ಸಾಥಿ (Scheme Saathi) — ಸರ್ಕಾರಿ ಕೃಷಿ ಯೋಜನೆಗಳು'
                : language === 'hi'
                ? 'स्कीम साथी — सरकारी कृषि योजना एवं सब्सिडी खोजक'
                : 'Scheme Saathi — Government Scheme & Subsidy Finder'}
            </h2>
            <p className="text-sm text-emerald-50 leading-relaxed">
              {language === 'kn'
                ? 'ನಿಮ್ಮ ರಾಜ್ಯ, ಬೆಳೆ, ಜಮೀನಿನ ವಿಸ್ತೀರ್ಣ ಮತ್ತು ಕೃಷಿ ಪ್ರೊಫೈಲ್ ಆಧರಿಸಿ ಅಧಿಕೃತ ಕೇಂದ್ರ ಹಾಗೂ ರಾಜ್ಯ ಸರ್ಕಾರದ ಯೋಜನೆಗಳನ್ನು ಹುಡುಕಿ.'
                : 'Discover official Central & State agricultural schemes matched to your state, crop, land size, and farmer profile.'}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <TTSButton
              id="scheme-saathi-intro"
              title="Scheme Saathi Introduction"
              textToSpeak={
                language === 'kn'
                  ? 'ಸ್ಕೀಮ್ ಸಾಥಿಗೆ ಸ್ವಾಗತ. ನಿಮ್ಮ ರಾಜ್ಯ, ಬೆಳೆ ಮತ್ತು ಜಮೀನಿನ ವಿಸ್ತೀರ್ಣಕ್ಕೆ ಅನುಗುಣವಾಗಿ ಪಿಎಂ ಕಿಸಾನ್, ಫಸಲ್ ಬಿಮಾ ಯೋಜನೆ, ಕೃಷಿ ಭಾಗ್ಯ ಮತ್ತು ಹನಿ ನೀರಾವರಿ ಸಹಾಯಧನದ ವಿವರಗಳನ್ನು ಇಲ್ಲಿ ಪರಿಶೀಲಿಸಿ.'
                  : 'Welcome to Scheme Saathi. Find verified government schemes including PM-KISAN, PMFBY Crop Insurance, PMKSY Drip Subsidy, Kisan Credit Card, and state packages with official application links.'
              }
              language={language}
              size="md"
              variant="pill"
            />
          </div>
        </div>
      </div>

      {/* Transparency & Verification Distinction Notice */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-amber-950">
        <div className="flex items-start gap-2.5">
          <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Verified Statutory Rules vs. Land-Size Estimates: </span>
            <span>
              Each card clearly separates official statutory benefits (such as ₹6,000/yr under PM-KISAN or 1.5%–2% PMFBY premium rates) from indicative land-area estimates calculated for your {landSizeAcres} Acres. Always apply directly through the official `.gov.in` portals linked below.
            </span>
          </div>
        </div>
      </div>

      {/* 4-Parameter Profile Matcher: State | Crop | Land Size | Farming Profile */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold text-slate-900 font-heading">
            {language === 'kn'
              ? 'ನಿಮ್ಮ ಕೃಷಿ ವಿವರ ನಮೂದಿಸಿ (ರಾಜ್ಯ · ಬೆಳೆ · ಜಮೀನು · ಪ್ರೊಫೈಲ್)'
              : 'Personalize Scheme Saathi for Your Farm Profile'}
          </h3>
          <span className="text-xs font-bold text-emerald-800">
            {filteredSchemes.length} Verified Schemes Matched
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. State */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">
              1. Farmer State (ರಾಜ್ಯ)
            </label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500"
            >
              {APMC_STATES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Crop */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">
              2. Target Crop (ಬೆಳೆ)
            </label>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500"
            >
              <option value="All Crops">All Crops</option>
              {CROPS_DATA.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.localNames.kn})
                </option>
              ))}
            </select>
          </div>

          {/* 3. Land Size (Acres) */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">
              3. Land Size in Acres (ಜಮೀನು ವಿಸ್ತೀರ್ಣ)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min={0.5}
                max={50}
                step={0.5}
                value={landSizeAcres}
                onChange={(e) => setLandSizeAcres(Math.max(0.5, Number(e.target.value) || 1))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold text-slate-900 font-mono tabular-nums focus:bg-white focus:ring-2 focus:ring-emerald-500"
              />
              <span className="text-xs font-bold text-slate-500 shrink-0">Acres</span>
            </div>
          </div>

          {/* 4. Farming Profile */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">
              4. Farming Profile (ಕೃಷಿ ವರ್ಗ)
            </label>
            <select
              value={selectedProfile}
              onChange={(e) => setSelectedProfile(e.target.value as FarmerProfileTag)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500"
            >
              {PROFILE_OPTIONS.map((p) => (
                <option key={p.id} value={p.id}>
                  {language === 'kn' ? p.labelKn : p.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Matched Schemes Grid */}
      <div className="space-y-6">
        {filteredSchemes.map((scheme) => {
          const estimatedValue = calculateEstimatedBenefit(scheme, landSizeAcres);
          const schemeSpeech =
            language === 'kn'
              ? `${scheme.nameKn}. ಸೌಲಭ್ಯ: ${scheme.verifiedBenefitKn}. ಅಧಿಕೃತ ವೆಬ್‌ಸೈಟ್: ${scheme.portalLabel}.`
              : `${scheme.name}. Verified Benefit: ${scheme.verifiedBenefit}. Required documents: ${scheme.documents.join(', ')}. Apply at ${scheme.portalLabel}.`;

          return (
            <div
              key={scheme.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6 hover:border-emerald-300 transition-colors"
            >
              {/* Top Row: Scheme Title, Ministry, Verification Status & Listen Button */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span className="font-bold text-emerald-800">{scheme.ministryOrState}</span>
                    <span>·</span>
                    <span className="font-semibold text-sky-800">{scheme.verificationType}</span>
                    <span>·</span>
                    <span>{scheme.lastVerified}</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading">
                    {language === 'kn' ? scheme.nameKn : language === 'hi' ? scheme.nameHi : scheme.name}
                  </h3>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                  <TTSButton
                    id={`scheme-tts-${scheme.id}`}
                    title={scheme.name}
                    textToSpeak={schemeSpeech}
                    language={language}
                    size="sm"
                    variant="secondary"
                  />

                  <a
                    href={scheme.officialLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-colors"
                  >
                    <span>Official Portal ({scheme.portalLabel})</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Benefit Section: Verified Statutory Benefit vs Land-Size Estimate */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                <div className="lg:col-span-8 p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-900">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>Verified Official Benefit</span>
                  </div>
                  <p className="text-sm text-slate-800 font-medium leading-relaxed">
                    {language === 'kn' ? scheme.verifiedBenefitKn : scheme.verifiedBenefit}
                  </p>
                </div>

                <div className="lg:col-span-4 p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex flex-col justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-extrabold text-amber-950">
                    <Calculator className="w-4 h-4 text-amber-600" />
                    <span>Indicative Estimate ({landSizeAcres} Acres)</span>
                  </div>
                  {estimatedValue ? (
                    <div className="my-1">
                      <span className="text-2xl font-extrabold text-slate-900 font-mono tabular-nums">
                        Up to {estimatedValue}
                      </span>
                      <span className="block text-[11px] text-amber-900 mt-0.5">
                        Estimated coverage/subsidy scale for {landSizeAcres} Acres (subject to state DLTC/nodal norms)
                      </span>
                    </div>
                  ) : (
                    <div className="my-1">
                      <span className="text-lg font-extrabold text-slate-900 font-mono tabular-nums">
                        ₹6,000 / Year Fixed
                      </span>
                      <span className="block text-[11px] text-amber-900 mt-0.5">
                        Uniform statutory DBT benefit per eligible farmer family
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* 3-Column Details: Eligibility | Documents | How to Apply */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-1">
                {/* 1. Eligibility */}
                <div className="space-y-2">
                  <h4 className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Eligibility Criteria (ಅರ್ಹತೆ)</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-600 leading-relaxed">
                    {scheme.eligibility.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 2. Required Documents */}
                <div className="space-y-2">
                  <h4 className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-sky-600" />
                    <span>Required Documents (ದಾಖಲೆಗಳು)</span>
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-600 leading-relaxed">
                    {scheme.documents.map((doc, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-sky-600 font-bold">•</span>
                        <span>{doc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 3. How to Apply */}
                <div className="space-y-2">
                  <h4 className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                    <ClipboardCheck className="w-4 h-4 text-amber-600" />
                    <span>How to Apply (ಅರ್ಜಿ ಸಲ್ಲಿಸುವ ವಿಧಾನ)</span>
                  </h4>
                  <ol className="space-y-1.5 text-xs text-slate-600 leading-relaxed">
                    {scheme.howToApply.map((step, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="font-bold text-amber-700 font-mono">{i + 1}.</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>

              {/* Footer Bar: Official Link + Ask AI Assistant */}
              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-slate-500">
                  <span>Official Source Link:</span>
                  <a
                    href={scheme.officialLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-emerald-700 hover:underline font-semibold"
                  >
                    {scheme.officialLink}
                  </a>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    onAskSchemeAI(
                      `Explain how I can apply for "${scheme.name}" in ${selectedState} for my ${landSizeAcres}-acre farm and what mistakes to avoid during document verification.`
                    )
                  }
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 text-slate-700 font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Ask BHUMITRA AI About This Scheme</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
