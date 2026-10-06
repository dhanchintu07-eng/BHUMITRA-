import React from 'react';
import {
  Bookmark,
  Trash2,
  Calendar,
  MapPin,
  Droplet,
  ArrowRight,
  FileDown,
  BellRing,
  BellOff,
  Sprout,
  Wheat,
  Sparkles,
} from 'lucide-react';
import { SavedPlan, LanguageCode, UserFarmingConditions } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { exportCropAdvisoryPDF } from '../services/pdfExport';

interface SavedRecommendationsProps {
  language: LanguageCode;
  savedPlans: SavedPlan[];
  onDeletePlan: (id: string) => void;
  onLoadPlan: (conditions: UserFarmingConditions) => void;
  onToggleReminders?: (id: string) => void;
  onTriggerPlanNotification?: (plan: SavedPlan) => void;
}

export const SavedRecommendations: React.FC<SavedRecommendationsProps> = ({
  language,
  savedPlans,
  onDeletePlan,
  onLoadPlan,
  onToggleReminders,
  onTriggerPlanNotification,
}) => {
  const t = TRANSLATIONS[language];

  if (savedPlans.length === 0) {
    return (
      <div
        id="saved-section"
        className="bg-white rounded-3xl border border-emerald-100 p-8 sm:p-12 text-center max-w-xl mx-auto shadow-sm"
      >
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
          <Bookmark className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2 font-heading">
          No Saved Recommendations Yet
        </h3>
        <p className="text-sm text-slate-500 mb-6">
          When you generate crop recommendations, click "Save Plan" to bookmark them here for recurring growth stage alerts, offline review, or PDF export.
        </p>
      </div>
    );
  }

  return (
    <div id="saved-section" className="space-y-6 scroll-mt-24">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
            {t.savedTitle}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            You have {savedPlans.length} saved farm plan(s) with automated growth-stage reminders for fertilization, irrigation, and harvest windows.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {savedPlans.map((plan) => {
          const remindersOn = plan.remindersEnabled !== false;
          const primaryCrop = plan.topCrops[0];

          return (
            <div
              key={plan.id}
              className="bg-white rounded-3xl border border-emerald-100 shadow-sm p-6 space-y-4 hover:shadow-md transition-shadow relative flex flex-col justify-between"
            >
              <div className="space-y-4">
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

                  <div className="flex items-center gap-1.5">
                    {onToggleReminders && (
                      <button
                        type="button"
                        onClick={() => onToggleReminders(plan.id)}
                        className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 border transition-colors ${
                          remindersOn
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                            : 'bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-200'
                        }`}
                        title={
                          remindersOn
                            ? 'Recurring growth stage reminders enabled'
                            : 'Recurring growth stage reminders muted'
                        }
                      >
                        {remindersOn ? (
                          <>
                            <BellRing className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Alerts ON</span>
                          </>
                        ) : (
                          <>
                            <BellOff className="w-3.5 h-3.5 text-slate-400" />
                            <span>Muted</span>
                          </>
                        )}
                      </button>
                    )}

                    <button
                      onClick={() => onDeletePlan(plan.id)}
                      className="text-slate-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                      title="Delete saved plan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
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
                    {plan.topCrops.map((c) => (
                      <div
                        key={c.id}
                        className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-center"
                      >
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

                {/* Growth Stage Windows Preview (Fertilization & Harvest Checkpoints) */}
                {primaryCrop && primaryCrop.growthStages && (
                  <div className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-100 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-emerald-950 flex items-center gap-1.5">
                        <Sprout className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{primaryCrop.name} Growth Stage Checkpoints</span>
                      </span>
                      <span className="text-[11px] font-bold text-emerald-700">
                        {primaryCrop.growingDuration}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                      <div className="p-2 rounded-xl bg-white border border-amber-200">
                        <span className="font-extrabold text-amber-900 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-600" />
                          Fertilization
                        </span>
                        <span className="text-slate-600 block mt-0.5 truncate">
                          {primaryCrop.growthStages[1]?.stageName || 'Tillering'} (~Day 25–55)
                        </span>
                        <span className="text-[10px] font-semibold text-amber-700 block">
                          NPK {primaryCrop.nutrients.nitrogen}:{primaryCrop.nutrients.phosphorus}:
                          {primaryCrop.nutrients.potassium}
                        </span>
                      </div>

                      <div className="p-2 rounded-xl bg-white border border-sky-200">
                        <span className="font-extrabold text-sky-900 flex items-center gap-1">
                          <Droplet className="w-3 h-3 text-sky-600" />
                          Flowering
                        </span>
                        <span className="text-slate-600 block mt-0.5 truncate">
                          {primaryCrop.growthStages[2]?.stageName || 'Flowering'} (~Day 55–80)
                        </span>
                        <span className="text-[10px] font-semibold text-sky-700 block">
                          Moisture Critical
                        </span>
                      </div>

                      <div className="p-2 rounded-xl bg-white border border-emerald-200 col-span-2 sm:col-span-1">
                        <span className="font-extrabold text-emerald-900 flex items-center gap-1">
                          <Wheat className="w-3 h-3 text-emerald-600" />
                          Harvest Window
                        </span>
                        <span className="text-slate-600 block mt-0.5 truncate">
                          {primaryCrop.growthStages[primaryCrop.growthStages.length - 1]
                            ?.stageName || 'Maturity'}
                        </span>
                        <span className="text-[10px] font-semibold text-emerald-700 block">
                          Dry to 12% moisture
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Bar */}
              <div className="pt-2 flex flex-wrap items-center gap-2">
                <button
                  onClick={() => onLoadPlan(plan.conditions)}
                  className="flex-1 py-2 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Re-Load Plan</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                {onTriggerPlanNotification && (
                  <button
                    type="button"
                    onClick={() => onTriggerPlanNotification(plan)}
                    className="py-2 px-3 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                    title="Simulate growth stage toast notification for this plan"
                  >
                    <BellRing className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Test Stage Alert</span>
                  </button>
                )}

                <button
                  onClick={() =>
                    exportCropAdvisoryPDF(
                      plan.conditions,
                      plan.topCrops,
                      plan.aiInsight,
                      plan.conditions.location
                    )
                  }
                  className="py-2 px-3 rounded-xl border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold flex items-center justify-center gap-1 transition-colors"
                  title="Download PDF Advisory Report"
                >
                  <FileDown className="w-3.5 h-3.5" />
                  <span>PDF</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
