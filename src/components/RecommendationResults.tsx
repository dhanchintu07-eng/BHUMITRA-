import React, { useState } from 'react';
import {
  CheckCircle,
  Droplets,
  Calendar,
  Clock,
  Lightbulb,
  Bookmark,
  Printer,
  Scale,
  Sparkles,
  ChevronDown,
  ChevronUp,
  BarChart3,
  TrendingUp,
  ArrowRight,
  ArrowLeft,
  FileDown
} from 'lucide-react';
import { Crop, UserFarmingConditions, LanguageCode } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { TTSButton } from './TTSButton';
import { exportCropAdvisoryPDF } from '../services/pdfExport';

interface RecommendationResultsProps {
  language: LanguageCode;
  conditions: UserFarmingConditions;
  topCrops: Crop[];
  runnerUps: Crop[];
  aiInsight: string;
  onSavePlan: () => void;
  isSaved: boolean;
  onCompareWith: (crop: Crop) => void;
  onGoToCharts: () => void;
  onGoToWizard: () => void;
}

export const RecommendationResults: React.FC<RecommendationResultsProps> = ({
  language,
  conditions,
  topCrops,
  runnerUps,
  aiInsight,
  onSavePlan,
  isSaved,
  onCompareWith,
  onGoToCharts,
  onGoToWizard,
}) => {
  const t = TRANSLATIONS[language];
  const [showRunnerUps, setShowRunnerUps] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleExportPDF = () => {
    exportCropAdvisoryPDF(conditions, topCrops, aiInsight, conditions.location);
  };

  // Full overview speech script
  const overviewSpeechText = topCrops && topCrops.length > 0
    ? language === 'kn'
      ? `ನಿಮ್ಮ ${conditions.location || 'ಜಮೀನಿನ'} ${conditions.soilType} ಮಣ್ಣಿಗೆ ಮತ್ತು ${conditions.season} ಋತುವಿಗೆ ಭೂಮಿತ್ರ ಶಿಫಾರಸು ಮಾಡಿದ ಟಾಪ್ ೩ ಬೆಳೆಗಳು: ಮೊದಲನೆಯದು ${topCrops[0]?.name}, ಹೊಂದಾಣಿಕೆ ಶೇಕಡಾ ${topCrops[0]?.suitabilityPercentage}. ಎರಡನೆಯದು ${topCrops[1]?.name || ''}, ಹೊಂದಾಣಿಕೆ ಶೇಕಡಾ ${topCrops[1]?.suitabilityPercentage || ''}. ಮೂರನೆಯದು ${topCrops[2]?.name || ''}, ಹೊಂದಾಣಿಕೆ ಶೇಕಡಾ ${topCrops[2]?.suitabilityPercentage || ''}. ಕೃಷಿ ಸಲಹೆ: ${aiInsight}`
      : language === 'hi'
      ? `आपकी ${conditions.location || 'ज़मीन'} के लिए शीर्ष तीन अनुशंसित फसलें हैं: पहली ${topCrops[0]?.name}, उपयुक्तता ${topCrops[0]?.suitabilityPercentage} प्रतिशत। दूसरी ${topCrops[1]?.name || ''}। तीसरी ${topCrops[2]?.name || ''}। मुख्य सलाह: ${aiInsight}`
      : `Top 3 recommended crops for your farm in ${conditions.location || 'your region'} with ${conditions.soilType} soil in ${conditions.season} season: First rank, ${topCrops[0]?.name}, suitability match ${topCrops[0]?.suitabilityPercentage} percent. Second rank, ${topCrops[1]?.name || ''}. Third rank, ${topCrops[2]?.name || ''}. Advisory note: ${aiInsight}`
    : 'No crop recommendations generated yet.';

  return (
    <div id="results-section" className="space-y-8 animate-in fade-in duration-300">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-emerald-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-bold text-emerald-800 tracking-wider uppercase">
              AI Evaluation Report · Page 3
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading mt-1">
            {t.resultsTitle}
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            {t.resultsSub}
          </p>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 no-print self-stretch sm:self-auto">
          {/* Main Overview Listen Button */}
          <TTSButton
            id="results-all-overview"
            title="Full Crop Recommendations Overview"
            textToSpeak={overviewSpeechText}
            language={language}
            size="md"
            variant="primary"
          />

          <button
            onClick={onSavePlan}
            className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all shadow-xs ${
              isSaved
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Bookmark className="w-4 h-4 text-emerald-600" />
            <span>{isSaved ? t.savedSuccess : t.savePlan}</span>
          </button>

          <button
            onClick={handleExportPDF}
            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs transition-colors"
            title="Download Full Crop Advisory PDF Report"
          >
            <FileDown className="w-4 h-4" />
            <span>{language === 'kn' ? 'ವರದಿ PDF ಡೌನ್‌ಲೋಡ್' : 'Export PDF Report'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-xs transition-colors"
            title="Print or Export PDF"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span className="hidden sm:inline">{t.printCard}</span>
          </button>
        </div>
      </div>

      {/* AI Agronomist Strategic Advisory Banner with Listen Button */}
      {aiInsight && (
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-green-900 rounded-3xl p-6 sm:p-7 text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-2 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-200 text-xs font-bold border border-emerald-400/30">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>BHUMITRA AI Advisory</span>
              </div>
              <p className="text-sm sm:text-base text-emerald-50 leading-relaxed font-medium">
                "{aiInsight}"
              </p>
              <div className="flex items-center gap-4 text-xs text-emerald-300/80 pt-1">
                <span>📍 {conditions.location || 'India'}</span>
                <span>·</span>
                <span>🌱 {conditions.soilType.toUpperCase()} Soil</span>
                <span>·</span>
                <span>💧 {conditions.rainfall}mm Rainfall</span>
                <span>·</span>
                <span>☀️ {conditions.season.toUpperCase()} Season</span>
              </div>
            </div>

            <TTSButton
              id="ai-agronomist-advisory-banner"
              title="BHUMITRA AI Strategic Advisory"
              textToSpeak={aiInsight}
              language={language}
              size="md"
              variant="pill"
            />
          </div>
        </div>
      )}

      {/* Top 3 Crop Cards Grid with Dedicated Listen Buttons */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {topCrops.map((crop, index) => {
          const rankColors = [
            { badge: 'bg-emerald-600 text-white', label: '#1 Top Recommendation' },
            { badge: 'bg-amber-600 text-white', label: '#2 High Potential' },
            { badge: 'bg-sky-600 text-white', label: '#3 Viable Alternative' },
          ];

          const localName =
            language !== 'en' && crop.localNames[language]
              ? crop.localNames[language]
              : crop.localNames.kn || crop.localNames.hi || crop.name;

          // Full narration script for this specific crop
          const cropFullSpeech = language === 'kn'
            ? `${crop.name}, ಸ್ಥಳೀಯ ಹೆಸರು ${localName}. ಸೂಕ್ತತೆಯ ಹೊಂದಾಣಿಕೆ ಶೇಕಡಾ ${crop.suitabilityPercentage}. ಹೊಂದಾಣಿಕೆಯ ಕಾರಣ: ${crop.matchReason}. ನೀರಿನ ಅಗತ್ಯತೆ: ${crop.waterNeed}. ಬೆಳೆಯುವ ಕಾಲಾವಧಿ: ${crop.growingDuration}. ನಿರೀಕ್ಷಿತ ಇಳುವರಿ ಎಕರೆಗೆ ${crop.avgYieldPerAcre}. ಪ್ರಮುಖ ಕೃಷಿ ಸಲಹೆ: ${crop.farmingTip}. ಕೀಟ ಮತ್ತು ರೋಗ ನಿಯಂತ್ರಣ: ${crop.pestAdvisory}`
            : language === 'hi'
            ? `${crop.name}, स्थानीय नाम ${localName}। उपयुक्तता स्कोर ${crop.suitabilityPercentage} प्रतिशत। मेल खाने का कारण: ${crop.matchReason}। पानी की आवश्यकता: ${crop.waterNeed}। पकने की अवधि: ${crop.growingDuration}। अनुमानित पैदावार प्रति एकड़ ${crop.avgYieldPerAcre}। व्यावहारिक कृषि सुझाव: ${crop.farmingTip}`
            : `${crop.name}, also known as ${localName}. Suitability match is ${crop.suitabilityPercentage} percent. Why it matches: ${crop.matchReason}. Expected water requirement is ${crop.waterNeed}. Growth duration is ${crop.growingDuration}. Expected yield per acre is ${crop.avgYieldPerAcre}. Practical farming tip: ${crop.farmingTip}. Pest management: ${crop.pestAdvisory}`;

          return (
            <div
              key={crop.id}
              className="print-card bg-white rounded-3xl border border-emerald-100 shadow-lg shadow-emerald-950/5 flex flex-col justify-between overflow-hidden hover:shadow-xl transition-shadow"
            >
              {/* Card Header & Visual Media */}
              <div>
                <div className="relative h-48 bg-slate-100 overflow-hidden">
                  {crop.image ? (
                    <img
                      src={crop.image}
                      alt={crop.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-emerald-100 to-amber-50 text-emerald-800">
                      <span className="text-4xl">🌾</span>
                    </div>
                  )}

                  {/* Rank Badge */}
                  <div className="absolute top-3.5 left-3.5">
                    <span className={`text-[11px] font-extrabold px-3 py-1 rounded-full shadow-md ${rankColors[index].badge}`}>
                      {rankColors[index].label}
                    </span>
                  </div>

                  {/* Suitability Score Pill */}
                  <div className="absolute top-3.5 right-3.5 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/80 shadow-md flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-700">Suitability:</span>
                    <span className="text-sm font-extrabold text-emerald-700 font-mono">
                      {crop.suitabilityPercentage}%
                    </span>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-6 space-y-4">
                  {/* Title & Regional Names + Card Listen Button */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-xl font-extrabold text-slate-900 tracking-tight font-heading">
                        {crop.name}
                      </h3>
                      <span className="text-xs font-bold text-emerald-700 block mt-0.5">
                        {localName} · {crop.category}
                      </span>
                    </div>

                    <TTSButton
                      id={`crop-card-${crop.id}`}
                      title={`${crop.name} Full Rundown`}
                      textToSpeak={cropFullSpeech}
                      language={language}
                      size="sm"
                      variant="secondary"
                    />
                  </div>

                  {/* Why it matches */}
                  <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-100/80">
                    <span className="text-[11px] font-bold text-emerald-900 flex items-center gap-1 mb-1">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      {t.whyMatches}:
                    </span>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {crop.matchReason}
                    </p>
                  </div>

                  {/* Core Condition Specs Grid */}
                  <div className="grid grid-cols-2 gap-2.5 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 font-medium block flex items-center gap-1">
                        <Droplets className="w-3 h-3 text-sky-500" />
                        {t.waterReq}
                      </span>
                      <span className="font-bold text-slate-800 block mt-0.5">
                        {crop.waterNeed}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 font-medium block flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-amber-500" />
                        {t.seasonReq}
                      </span>
                      <span className="font-bold text-slate-800 block mt-0.5 capitalize">
                        {crop.suitableSeasons.join(', ')}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 font-medium block flex items-center gap-1">
                        <Clock className="w-3 h-3 text-emerald-500" />
                        {t.durationReq}
                      </span>
                      <span className="font-bold text-slate-800 block mt-0.5">
                        {crop.growingDuration}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-slate-400 font-medium block flex items-center gap-1">
                        <TrendingUp className="w-3 h-3 text-purple-500" />
                        Yield per Acre
                      </span>
                      <span className="font-bold text-slate-800 block mt-0.5">
                        {crop.avgYieldPerAcre}
                      </span>
                    </div>
                  </div>

                  {/* Farming Tip Card with Listen Button */}
                  <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 relative">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-bold text-amber-950 flex items-center gap-1">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                        {t.farmingTip}
                      </span>

                      <TTSButton
                        id={`crop-tip-${crop.id}`}
                        title={`${crop.name} Farming Tip`}
                        textToSpeak={crop.farmingTip}
                        language={language}
                        size="sm"
                        variant="subtle"
                        labelOverride="Tip Audio"
                      />
                    </div>
                    <p className="text-xs text-amber-900 leading-relaxed font-medium">
                      {crop.farmingTip}
                    </p>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-6 pt-0 border-t border-slate-100 flex items-center gap-2 no-print">
                <button
                  type="button"
                  onClick={() => onCompareWith(crop)}
                  className="flex-1 py-2 px-3 rounded-xl border border-slate-200 hover:border-emerald-500 hover:text-emerald-700 bg-white text-xs font-semibold text-slate-700 transition-colors flex items-center justify-center gap-1.5"
                >
                  <Scale className="w-3.5 h-3.5" />
                  <span>Compare Crop</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Runner-Ups Toggle Section with Listen Buttons */}
      {runnerUps.length > 0 && (
        <div className="pt-2 no-print">
          <button
            onClick={() => setShowRunnerUps(!showRunnerUps)}
            className="w-full py-3 px-4 rounded-2xl border border-dashed border-slate-300 hover:border-emerald-500 bg-slate-50/80 text-xs font-bold text-slate-700 hover:text-emerald-800 flex items-center justify-center gap-2 transition-colors"
          >
            <span>
              {showRunnerUps
                ? 'Hide Secondary Alternative Crops'
                : `View 3 More Secondary Crop Options (${runnerUps.map((c) => c.name).join(', ')})`}
            </span>
            {showRunnerUps ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showRunnerUps && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
              {runnerUps.map((crop) => (
                <div
                  key={crop.id}
                  className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2 hover:border-emerald-300 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-bold text-slate-900 font-heading block">
                        {crop.name}
                      </span>
                      <span className="text-[11px] text-emerald-700 font-semibold">
                        {crop.suitabilityPercentage}% match
                      </span>
                    </div>

                    <TTSButton
                      id={`crop-runnerup-${crop.id}`}
                      title={`${crop.name} Summary`}
                      textToSpeak={`${crop.name}. Suitability score is ${crop.suitabilityPercentage} percent. ${crop.matchReason}. Expected water need: ${crop.waterNeed}. Duration: ${crop.growingDuration}. Farming tip: ${crop.farmingTip}`}
                      language={language}
                      size="sm"
                      variant="subtle"
                    />
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2">
                    {crop.matchReason}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1">
                    <span>💧 {crop.waterNeed}</span>
                    <span>⏱️ {crop.growingDuration}</span>
                  </div>
                  <button
                    onClick={() => onCompareWith(crop)}
                    className="w-full mt-2 py-1.5 text-[11px] font-semibold text-emerald-700 hover:bg-emerald-50 rounded-lg border border-emerald-200 transition-colors"
                  >
                    Add to Comparison
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Page-by-Page Navigation Bar */}
      <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 no-print">
        <button
          onClick={onGoToWizard}
          className="w-full sm:w-auto px-5 py-3 rounded-2xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm flex items-center justify-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>← Back to Crop Finder (Page 2)</span>
        </button>

        <button
          onClick={onGoToCharts}
          className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-700/20 hover:shadow-xl transition-all"
        >
          <BarChart3 className="w-4 h-4" />
          <span>View Nutrient & Growth Charts (Page 4) →</span>
        </button>
      </div>
    </div>
  );
};
