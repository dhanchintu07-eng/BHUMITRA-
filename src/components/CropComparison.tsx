import React, { useState } from 'react';
import { Scale, Check, X, Droplets, Calendar, Clock, TrendingUp, AlertTriangle, Plus, Trash2 } from 'lucide-react';
import { Crop, LanguageCode } from '../types';
import { CROPS_DATA } from '../data/crops';
import { TRANSLATIONS } from '../data/translations';
import { TTSButton } from './TTSButton';

interface CropComparisonProps {
  language: LanguageCode;
  initialCrops?: Crop[];
}

export const CropComparison: React.FC<CropComparisonProps> = ({ language, initialCrops }) => {
  const t = TRANSLATIONS[language];
  const [selectedCropIds, setSelectedCropIds] = useState<string[]>(
    initialCrops && initialCrops.length > 0
      ? initialCrops.map((c) => c.id).slice(0, 3)
      : ['wheat', 'mustard', 'chickpea']
  );

  const selectedCrops = CROPS_DATA.filter((c) => selectedCropIds.includes(c.id));

  const handleAddCrop = (cropId: string) => {
    if (selectedCropIds.length < 3 && !selectedCropIds.includes(cropId)) {
      setSelectedCropIds([...selectedCropIds, cropId]);
    }
  };

  const handleRemoveCrop = (cropId: string) => {
    if (selectedCropIds.length > 1) {
      setSelectedCropIds(selectedCropIds.filter((id) => id !== cropId));
    }
  };

  const compareVoiceScript = language === 'kn'
    ? `ಬೆಳೆಗಳ ಹೋಲಿಕೆ ಸಾರಾಂಶ: ${selectedCrops.map((c) => `${c.name} ಬೆಳೆಗೆ ನೀರಿನ ಅಗತ್ಯ ${c.waterNeed}, ಕಾಲಾವಧಿ ${c.growingDuration}, ಮತ್ತು ಇಳುವರಿ ಎಕರೆಗೆ ${c.avgYieldPerAcre}`).join('. ')}.`
    : language === 'hi'
    ? `फसल तुलना सारांश: ${selectedCrops.map((c) => `${c.name} के लिए पानी की आवश्यकता ${c.waterNeed}, पकने की अवधि ${c.growingDuration}, और पैदावार प्रति एकड़ ${c.avgYieldPerAcre}`).join('. ')}.`
    : `Crop Comparison Summary: ${selectedCrops.map((c) => `${c.name} requires ${c.waterNeed} of water, takes ${c.growingDuration}, and yields ${c.avgYieldPerAcre}`).join('. ')}.`;

  return (
    <div id="compare-section" className="space-y-6 scroll-mt-24">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-emerald-100 shadow-xl shadow-emerald-950/5 p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                <Scale className="w-3.5 h-3.5 text-emerald-600" />
                <span>Multi-Crop Decision Matrix</span>
              </div>

              <TTSButton
                id="crop-compare-full-summary"
                title="Crop Comparison Summary"
                textToSpeak={compareVoiceScript}
                language={language}
                size="sm"
                variant="pill"
              />
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
              {t.compareTitle}
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              {t.compareSub}
            </p>
          </div>

          {/* Quick Crop Selector Pills */}
          <div className="space-y-1.5">
            <span className="text-xs font-bold text-slate-500 block">
              Add Crop to Compare (Max 3):
            </span>
            <div className="flex flex-wrap gap-1.5">
              {CROPS_DATA.map((crop) => {
                const isSelected = selectedCropIds.includes(crop.id);
                return (
                  <button
                    key={crop.id}
                    onClick={() => (isSelected ? handleRemoveCrop(crop.id) : handleAddCrop(crop.id))}
                    className={`text-xs px-2.5 py-1 rounded-lg border font-medium transition-colors ${
                      isSelected
                        ? 'bg-emerald-600 border-emerald-600 text-white shadow-2xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {isSelected ? `✓ ${crop.name}` : `+ ${crop.name}`}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Side-by-Side Comparison Table Grid */}
        <div className="mt-8 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="p-4 bg-slate-50 rounded-tl-2xl font-bold text-xs text-slate-500 uppercase tracking-wider w-1/4">
                  Feature / Parameter
                </th>
                {selectedCrops.map((crop) => (
                  <th key={crop.id} className="p-4 bg-slate-50 font-bold text-slate-900 text-sm w-1/4 min-w-[220px]">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-extrabold text-base block font-heading text-emerald-950">
                          {crop.name}
                        </span>
                        <span className="text-[11px] font-semibold text-emerald-700 block">
                          {crop.localNames.hi || crop.category}
                        </span>
                      </div>
                      {selectedCrops.length > 1 && (
                        <button
                          onClick={() => handleRemoveCrop(crop.id)}
                          className="text-slate-400 hover:text-red-600 p-1 rounded-md transition-colors"
                          title="Remove crop"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
              {/* Row 1: Water Requirement */}
              <tr>
                <td className="p-4 font-bold text-slate-700 bg-slate-50/50 flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-sky-500" />
                  <span>Water Requirement</span>
                </td>
                {selectedCrops.map((crop) => (
                  <td key={crop.id} className="p-4">
                    <span className="font-extrabold text-slate-900 block">
                      {crop.waterRequirementMm}
                    </span>
                    <span className="text-xs text-slate-500 block mt-0.5">
                      {crop.irrigationStages}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Row 2: Growing Duration */}
              <tr>
                <td className="p-4 font-bold text-slate-700 bg-slate-50/50 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-500" />
                  <span>Growing Duration</span>
                </td>
                {selectedCrops.map((crop) => (
                  <td key={crop.id} className="p-4 font-bold text-slate-800">
                    {crop.growingDuration}
                  </td>
                ))}
              </tr>

              {/* Row 3: Ideal Soil Types */}
              <tr>
                <td className="p-4 font-bold text-slate-700 bg-slate-50/50">
                  Ideal Soil Types
                </td>
                {selectedCrops.map((crop) => (
                  <td key={crop.id} className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {crop.suitableSoils.map((s) => (
                        <span key={s} className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 text-xs font-semibold capitalize">
                          {s}
                        </span>
                      ))}
                    </div>
                    <span className="text-xs text-slate-500 block mt-1">
                      {crop.soilDescription}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Row 4: Suitable Seasons */}
              <tr>
                <td className="p-4 font-bold text-slate-700 bg-slate-50/50 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-500" />
                  <span>Sowing Season</span>
                </td>
                {selectedCrops.map((crop) => (
                  <td key={crop.id} className="p-4 font-bold text-slate-800 capitalize">
                    {crop.suitableSeasons.join(', ')}
                  </td>
                ))}
              </tr>

              {/* Row 5: Average Yield */}
              <tr>
                <td className="p-4 font-bold text-slate-700 bg-slate-50/50 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-purple-500" />
                  <span>Expected Yield / Acre</span>
                </td>
                {selectedCrops.map((crop) => (
                  <td key={crop.id} className="p-4 font-extrabold text-emerald-800">
                    {crop.avgYieldPerAcre}
                  </td>
                ))}
              </tr>

              {/* Row 6: Market Demand & MSP */}
              <tr>
                <td className="p-4 font-bold text-slate-700 bg-slate-50/50">
                  Market Demand & Offtake
                </td>
                {selectedCrops.map((crop) => (
                  <td key={crop.id} className="p-4">
                    <span className="font-semibold text-slate-800 block">
                      {crop.marketDemand}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Row 7: Pest & Risk Profile */}
              <tr>
                <td className="p-4 font-bold text-slate-700 bg-slate-50/50 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  <span>Risk Level & Pest Care</span>
                </td>
                {selectedCrops.map((crop) => (
                  <td key={crop.id} className="p-4">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold mb-1 ${
                      crop.riskLevel === 'Low' || crop.riskLevel === 'Very Low'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {crop.riskLevel} Risk
                    </span>
                    <span className="text-xs text-slate-600 block leading-snug">
                      {crop.pestAdvisory}
                    </span>
                  </td>
                ))}
              </tr>

              {/* Row 8: Key Agronomic Tip */}
              <tr>
                <td className="p-4 font-bold text-slate-700 bg-slate-50/50">
                  Farmer Practical Tip
                </td>
                {selectedCrops.map((crop) => (
                  <td key={crop.id} className="p-4 text-xs text-slate-700 italic bg-amber-50/30">
                    "{crop.farmingTip}"
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
