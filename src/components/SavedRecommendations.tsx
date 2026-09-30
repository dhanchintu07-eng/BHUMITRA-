import React from 'react';
import { Bookmark, Trash2, Calendar, MapPin, Layers, Droplet, ArrowRight, Printer, FileDown } from 'lucide-react';
import { SavedPlan, LanguageCode, UserFarmingConditions } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { exportCropAdvisoryPDF } from '../services/pdfExport';

interface SavedRecommendationsProps {
  language: LanguageCode;
  savedPlans: SavedPlan[];
  onDeletePlan: (id: string) => void;
  onLoadPlan: (conditions: UserFarmingConditions) => void;
}

export const SavedRecommendations: React.FC<SavedRecommendationsProps> = ({
  language,
  savedPlans,
  onDeletePlan,
  onLoadPlan,
}) => {
  const t = TRANSLATIONS[language];

  if (savedPlans.length === 0) {
    return (
      <div id="saved-section" className="bg-white rounded-3xl border border-emerald-100 p-8 sm:p-12 text-center max-w-xl mx-auto shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
          <Bookmark className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2 font-heading">
          No Saved Recommendations Yet
        </h3>
        <p className="text-sm text-slate-500 mb-6">
          When you generate crop recommendations, click "Save Plan" to bookmark them here for offline farm review or printing.
        </p>
      </div>
    );
  }

  return (
    <div id="saved-section" className="space-y-6 scroll-mt-24">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
            {t.savedTitle}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            You have {savedPlans.length} saved farm plans stored on this device.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {savedPlans.map((plan) => (
          <div
            key={plan.id}
            className="bg-white rounded-3xl border border-emerald-100 shadow-sm p-6 space-y-4 hover:shadow-md transition-shadow relative"
          >
            <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-semibold text-slate-400 block">
                  Saved on {plan.timestamp}
                </span>
                <span className="text-base font-extrabold text-slate-900 flex items-center gap-1.5 mt-0.5">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  {plan.conditions.location || 'India'} · {plan.conditions.soilType.toUpperCase()} Soil
                </span>
              </div>

              <button
                onClick={() => onDeletePlan(plan.id)}
                className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                title="Delete saved plan"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Farm Conditions Badges */}
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-medium flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {plan.conditions.season.toUpperCase()} Season
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-sky-50 text-sky-800 font-medium flex items-center gap-1">
                <Droplet className="w-3.5 h-3.5" />
                {plan.conditions.rainfall} mm · {plan.conditions.waterAvailability} water
              </span>
              {plan.conditions.landSize && (
                <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 font-medium">
                  {plan.conditions.landSize} {plan.conditions.landUnit}
                </span>
              )}
            </div>

            {/* Top Crops List */}
            <div className="space-y-2 pt-1">
              <span className="text-xs font-bold text-slate-600 block">
                Top Recommended Crops:
              </span>
              <div className="grid grid-cols-3 gap-2">
                {plan.topCrops.map((c, i) => (
                  <div key={c.id} className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-center">
                    <span className="text-xs font-extrabold text-slate-800 block truncate">
                      {c.name}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-700">
                      {c.suitabilityPercentage}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={() => onLoadPlan(plan.conditions)}
                className="flex-1 py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Re-Load This Plan</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => exportCropAdvisoryPDF(plan.conditions, plan.topCrops, plan.aiInsight, plan.conditions.location)}
                className="py-2 px-3 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                title="Download PDF Advisory Report"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span>PDF</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
