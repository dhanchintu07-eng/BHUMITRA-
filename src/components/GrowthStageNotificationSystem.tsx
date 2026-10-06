import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Bell,
  BellRing,
  X,
  Sprout,
  Droplets,
  Wheat,
  Bug,
  Sparkles,
  Clock,
  CheckCircle2,
  Play,
  Pause,
  FastForward,
  Calendar,
  MapPin,
  ArrowRight,
} from 'lucide-react';
import {
  SavedPlan,
  Crop,
  LanguageCode,
  GrowthStageNotification,
  NotificationStageCategory,
} from '../types';
import { TTSButton } from './TTSButton';

interface GrowthStageNotificationSystemProps {
  language: LanguageCode;
  savedPlans: SavedPlan[];
  fallbackCrops: Crop[];
  fallbackLocation: string;
  onNavigateToSaved: () => void;
  onAskAIAboutStage: (prompt: string, cropName: string) => void;
  externalTriggerPlan?: SavedPlan | null;
  onClearExternalTrigger?: () => void;
}

const STAGE_META: Record<
  NotificationStageCategory,
  {
    label: string;
    labelKn: string;
    labelHi: string;
    badgeBg: string;
    badgeText: string;
    border: string;
    accentBg: string;
    icon: React.FC<{ className?: string }>;
  }
> = {
  fertilization: {
    label: 'Fertilization Window',
    labelKn: 'ಗೊಬ್ಬರ ಹಾಕುವ ಹಂತ (Fertilization)',
    labelHi: 'खाद एवं उर्वरक चरण',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-900',
    border: 'border-amber-300',
    accentBg: 'from-amber-600 to-orange-600',
    icon: Sprout,
  },
  harvest: {
    label: 'Harvest & Maturity Window',
    labelKn: 'ಕೊಯ್ಲು ಮತ್ತು ಮಾಗುವ ಹಂತ (Harvest)',
    labelHi: 'कटाई एवं पकने का समय',
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-emerald-900',
    border: 'border-emerald-300',
    accentBg: 'from-emerald-600 to-green-600',
    icon: Wheat,
  },
  irrigation: {
    label: 'Critical Irrigation Check',
    labelKn: 'ನಿರ್ಣಾಯಕ ನೀರಾವರಿ ಹಂತ (Irrigation)',
    labelHi: 'महत्वपूर्ण सिंचाई जांच',
    badgeBg: 'bg-sky-100',
    badgeText: 'text-sky-900',
    border: 'border-sky-300',
    accentBg: 'from-sky-600 to-blue-600',
    icon: Droplets,
  },
  flowering: {
    label: 'Flowering & Pod Setting',
    labelKn: 'ಹೂವು ಮತ್ತು ಕಾಳು ಕಟ್ಟುವ ಹಂತ',
    labelHi: 'फूल एवं फली बनने का चरण',
    badgeBg: 'bg-purple-100',
    badgeText: 'text-purple-900',
    border: 'border-purple-300',
    accentBg: 'from-purple-600 to-indigo-600',
    icon: Sparkles,
  },
  pest_scouting: {
    label: 'Pest & Disease Scouting',
    labelKn: 'ಕೀಟ ಮತ್ತು ರೋಗ ಪರಿಶೀಲನೆ',
    labelHi: 'कीट एवं रोग निगरानी',
    badgeBg: 'bg-rose-100',
    badgeText: 'text-rose-900',
    border: 'border-rose-300',
    accentBg: 'from-rose-600 to-red-600',
    icon: Bug,
  },
};

export function generateNotificationsForPlans(
  savedPlans: SavedPlan[],
  fallbackCrops: Crop[],
  fallbackLocation: string
): GrowthStageNotification[] {
  const activePlans = savedPlans.filter((p) => p.remindersEnabled !== false);

  const plansToProcess: SavedPlan[] =
    activePlans.length > 0
      ? activePlans
      : [
          {
            id: 'active-session-plan',
            timestamp: 'Current Session',
            conditions: {
              location: fallbackLocation || 'Karnataka',
              soilType: 'red',
              season: 'kharif',
              rainfall: 650,
              waterAvailability: 'medium',
            },
            topCrops: fallbackCrops.slice(0, 2),
            aiInsight: '',
            remindersEnabled: true,
          },
        ];

  const list: GrowthStageNotification[] = [];

  plansToProcess.forEach((plan) => {
    const crops = plan.topCrops.slice(0, 2);
    crops.forEach((crop) => {
      const stages = crop.growthStages || [];
      let cumulativeStart = 1;

      stages.forEach((st, idx) => {
        const startDay = cumulativeStart;
        const endDay = cumulativeStart + st.days - 1;
        cumulativeStart = endDay + 1;
        const dayWindow = `Day ${startDay}–${endDay}`;

        const sLower = st.stageName.toLowerCase();
        let category: NotificationStageCategory = 'irrigation';
        let title = `${crop.name}: ${st.stageName} Check`;
        let message = st.description;
        let actionableDosage = '';

        if (idx === 1 || sLower.includes('tiller') || sLower.includes('vegetative') || sLower.includes('branch')) {
          category = 'fertilization';
          title = `${crop.name} — Top-Dressing Fertilization Window`;
          message = `${st.stageName} (${dayWindow}): Critical nutrient demand phase for vigorous vegetative growth in ${plan.conditions.location}.`;
          actionableDosage = `Apply split Nitrogen dose (~${Math.round(crop.nutrients.nitrogen / 3)} kg N/ha via Neem-coated Urea) + ${crop.nutrients.zinc} kg/ha Zinc Sulphate after light moisture check.`;
        } else if (idx === stages.length - 1 || sLower.includes('harvest') || sLower.includes('matur') || sLower.includes('ripen')) {
          category = 'harvest';
          title = `${crop.name} — Harvest & Maturity Window`;
          message = `${st.stageName} (${dayWindow}): Crop is entering final maturity in your ${plan.conditions.season.toUpperCase()} plan (${plan.conditions.location}).`;
          actionableDosage = `Stop field irrigation 10 days before harvest. Harvest when 85–90% grains/pods mature and sun-dry to 12% moisture for safe storage.`;
        } else if (sLower.includes('flower') || sLower.includes('panicle') || sLower.includes('peg') || sLower.includes('bloom')) {
          category = 'flowering';
          title = `${crop.name} — Flowering & Micronutrient Check`;
          message = `${st.stageName} (${dayWindow}): Peak reproductive stage. Avoid any moisture stress or mid-day chemical sprays.`;
          actionableDosage = `Spray 1% Potassium Nitrate (13:0:45 @ 10g/L) in evening hours to boost flower retention and grain/pod setting.`;
        } else if (idx === 3 || sLower.includes('grain') || sLower.includes('pod') || sLower.includes('boll')) {
          category = 'pest_scouting';
          title = `${crop.name} — Pest Scouting & Grain Filling`;
          message = `${st.stageName} (${dayWindow}): Developing grains/pods attract borers and sucking pests.`;
          actionableDosage = `${crop.pestAdvisory} Apply Potash (${crop.nutrients.potassium} kg K/ha basal or foliar) for bold grain weight.`;
        } else {
          category = 'irrigation';
          title = `${crop.name} — Establishment & Basal Nutrition`;
          message = `${st.stageName} (${dayWindow}): Early root establishment in ${plan.conditions.soilType} soil.`;
          actionableDosage = `Ensure basal NPK (${Math.round(crop.nutrients.nitrogen / 3)}:${crop.nutrients.phosphorus}:${crop.nutrients.potassium} kg/ha) and critical first irrigation.`;
        }

        list.push({
          id: `${plan.id}-${crop.id}-stage-${idx}`,
          planId: plan.id,
          planLocation: plan.conditions.location || 'Farm',
          season: plan.conditions.season,
          cropId: crop.id,
          cropName: crop.name,
          stageName: st.stageName,
          stageCategory: category,
          dayWindow,
          title,
          message,
          actionableDosage,
          timestamp: 'Scheduled Reminder',
          isRead: false,
        });
      });
    });
  });

  // Prioritize fertilization and harvest windows first so users immediately see the most critical reminders
  return list.sort((a, b) => {
    const priorityOrder: Record<NotificationStageCategory, number> = {
      fertilization: 1,
      harvest: 2,
      flowering: 3,
      pest_scouting: 4,
      irrigation: 5,
    };
    return priorityOrder[a.stageCategory] - priorityOrder[b.stageCategory];
  });
}

export const GrowthStageNotificationSystem: React.FC<GrowthStageNotificationSystemProps> = ({
  language,
  savedPlans,
  fallbackCrops,
  fallbackLocation,
  onNavigateToSaved,
  onAskAIAboutStage,
  externalTriggerPlan,
  onClearExternalTrigger,
}) => {
  const allNotifications = useMemo(
    () => generateNotificationsForPlans(savedPlans, fallbackCrops, fallbackLocation),
    [savedPlans, fallbackCrops, fallbackLocation]
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeToast, setActiveToast] = useState<GrowthStageNotification | null>(null);
  const [isCenterOpen, setIsCenterOpen] = useState(false);
  const [isRecurringEnabled, setIsRecurringEnabled] = useState(true);
  const [intervalSeconds, setIntervalSeconds] = useState<number>(35);
  const [historyLog, setHistoryLog] = useState<GrowthStageNotification[]>([]);
  const [completedStageIds, setCompletedStageIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('bhumitra_completed_stages');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const triggerNotification = useCallback(
    (notif: GrowthStageNotification) => {
      const enriched: GrowthStageNotification = {
        ...notif,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setActiveToast(enriched);
      setHistoryLog((prev) => {
        const filtered = prev.filter((item) => item.id !== enriched.id);
        return [enriched, ...filtered].slice(0, 12);
      });
    },
    []
  );

  // Trigger next notification in rotation
  const triggerNextInRotation = useCallback(() => {
    if (allNotifications.length === 0) return;
    const nextIdx = (currentIndex + 1) % allNotifications.length;
    setCurrentIndex(nextIdx);
    triggerNotification(allNotifications[nextIdx]);
  }, [allNotifications, currentIndex, triggerNotification]);

  // Initial welcome reminder after 5 seconds so user immediately experiences the toast alert
  useEffect(() => {
    if (allNotifications.length === 0) return;
    const initTimer = setTimeout(() => {
      triggerNotification(allNotifications[0]);
    }, 4500);
    return () => clearTimeout(initTimer);
  }, [allNotifications.length > 0]);

  // Recurring local timer
  useEffect(() => {
    if (!isRecurringEnabled || allNotifications.length === 0) return;
    const timer = setInterval(() => {
      triggerNextInRotation();
    }, intervalSeconds * 1000);
    return () => clearInterval(timer);
  }, [isRecurringEnabled, intervalSeconds, allNotifications, triggerNextInRotation]);

  // Handle external trigger from SavedPlans card
  useEffect(() => {
    if (!externalTriggerPlan) return;
    const matching = allNotifications.find((n) => n.planId === externalTriggerPlan.id);
    if (matching) {
      triggerNotification(matching);
    } else if (allNotifications.length > 0) {
      triggerNotification(allNotifications[0]);
    }
    if (onClearExternalTrigger) {
      onClearExternalTrigger();
    }
  }, [externalTriggerPlan, allNotifications, triggerNotification, onClearExternalTrigger]);

  const toggleMarkCompleted = (id: string) => {
    setCompletedStageIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      localStorage.setItem('bhumitra_completed_stages', JSON.stringify(next));
      return next;
    });
  };

  const getStageLabel = (cat: NotificationStageCategory) => {
    const meta = STAGE_META[cat];
    if (language === 'kn') return meta.labelKn;
    if (language === 'hi') return meta.labelHi;
    return meta.label;
  };

  return (
    <>
      {/* Top Compact Recurring Notification Status & Control Strip */}
      <div className="bg-emerald-950 text-emerald-50 border-b border-emerald-800/80 py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-800/90 text-emerald-200 font-bold border border-emerald-700">
              <BellRing className={`w-3.5 h-3.5 text-amber-400 ${isRecurringEnabled ? 'animate-pulse' : ''}`} />
              <span>
                {language === 'kn'
                  ? 'ಬೆಳೆ ಬೆಳವಣಿಗೆಯ ಹಂತದ ಜ್ಞಾಪನೆಗಳು (ಸಕ್ರಿಯ)'
                  : language === 'hi'
                  ? 'फसल विकास चरण रिमाइंडर (सक्रिय)'
                  : 'Crop Growth Stage Reminders'}
              </span>
            </span>

            <span className="text-emerald-200/90 hidden md:inline">
              {savedPlans.length > 0
                ? `Monitoring ${savedPlans.length} saved crop plan(s) for Fertilization, Irrigation & Harvest windows`
                : `Monitoring active ${fallbackLocation} crop plan (${allNotifications.length} growth stages scheduled)`}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Simulate Next Alert Immediately */}
            <button
              type="button"
              onClick={triggerNextInRotation}
              className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold flex items-center gap-1 transition-colors shadow-2xs"
              title="Simulate next growth stage toast notification now"
            >
              <FastForward className="w-3.5 h-3.5" />
              <span>{language === 'kn' ? 'ಈಗಲೇ ಜ್ಞಾಪನೆ ಪರೀಕ್ಷಿಸಿ' : 'Simulate Stage Alert'}</span>
            </button>

            {/* Pause / Resume Recurring Timer */}
            <button
              type="button"
              onClick={() => setIsRecurringEnabled((prev) => !prev)}
              className={`px-2.5 py-1 rounded-lg border font-bold flex items-center gap-1 transition-colors ${
                isRecurringEnabled
                  ? 'bg-emerald-900/80 border-emerald-700 text-emerald-200 hover:bg-emerald-800'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
              }`}
              title="Toggle automatic recurring notifications"
            >
              {isRecurringEnabled ? (
                <>
                  <Pause className="w-3 h-3 text-emerald-400" />
                  <span className="hidden sm:inline">Every {intervalSeconds}s</span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 text-amber-400" />
                  <span className="hidden sm:inline">Paused</span>
                </>
              )}
            </button>

            {/* Open Full Schedule & Notification Center */}
            <button
              type="button"
              onClick={() => setIsCenterOpen(true)}
              className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold flex items-center gap-1.5 border border-white/15 transition-colors relative"
            >
              <Bell className="w-3.5 h-3.5 text-amber-300" />
              <span>
                {language === 'kn' ? 'ವೇಳಾಪಟ್ಟಿ' : 'Stage Schedule'} ({allNotifications.length})
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Floating Simulated UI Toast Notification (Bottom-Right) */}
      {activeToast && (
        <div
          role="alert"
          aria-live="polite"
          className="fixed bottom-20 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[430px] animate-in slide-in-from-bottom-5 fade-in duration-300"
        >
          <div
            className={`rounded-3xl bg-white border-2 ${
              STAGE_META[activeToast.stageCategory].border
            } shadow-2xl shadow-emerald-950/25 overflow-hidden`}
          >
            {/* Top Gradient Accent Bar */}
            <div
              className={`bg-gradient-to-r ${
                STAGE_META[activeToast.stageCategory].accentBg
              } px-4 py-2.5 text-white flex items-center justify-between`}
            >
              <div className="flex items-center gap-2">
                <BellRing className="w-4 h-4 text-amber-200 animate-bounce" />
                <span className="text-xs font-extrabold uppercase tracking-wider">
                  {getStageLabel(activeToast.stageCategory)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold bg-black/20 px-2 py-0.5 rounded-full">
                  {activeToast.dayWindow}
                </span>
                <button
                  type="button"
                  onClick={() => setActiveToast(null)}
                  className="p-1 rounded-lg hover:bg-white/20 text-white transition-colors"
                  aria-label="Close notification"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Toast Body */}
            <div className="p-4 sm:p-5 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 text-[11px] font-bold text-slate-500 mb-0.5">
                    <span className="flex items-center gap-1 text-emerald-700">
                      <MapPin className="w-3 h-3" />
                      {activeToast.planLocation}
                    </span>
                    <span>·</span>
                    <span className="uppercase">{activeToast.season} Plan</span>
                    <span>·</span>
                    <span>{activeToast.timestamp}</span>
                  </div>
                  <h4 className="text-base font-extrabold text-slate-900 font-heading leading-snug">
                    {activeToast.title}
                  </h4>
                </div>

                <TTSButton
                  id={`toast-tts-${activeToast.id}`}
                  title={activeToast.title}
                  textToSpeak={`${activeToast.title}. ${activeToast.message} Recommended action: ${activeToast.actionableDosage}`}
                  language={language}
                  size="sm"
                  variant="subtle"
                  labelOverride="Listen"
                />
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{activeToast.message}</p>

              {/* Actionable Dosage / Harvest Window Box */}
              <div
                className={`p-3 rounded-2xl ${
                  STAGE_META[activeToast.stageCategory].badgeBg
                }/60 border ${STAGE_META[activeToast.stageCategory].border} text-xs space-y-1`}
              >
                <span
                  className={`font-extrabold block ${
                    STAGE_META[activeToast.stageCategory].badgeText
                  }`}
                >
                  ✓ Recommended Field Action:
                </span>
                <p className="text-slate-800 font-medium leading-relaxed">
                  {activeToast.actionableDosage}
                </p>
              </div>

              {/* Footer Quick Actions */}
              <div className="flex items-center justify-between gap-2 pt-1">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      const prompt = `My saved ${activeToast.cropName} crop in ${activeToast.planLocation} is entering the ${activeToast.stageName} stage (${activeToast.dayWindow}). What exact fertilizer, irrigation, and pest precautions should I take right now?`;
                      const cropName = activeToast.cropName;
                      setActiveToast(null);
                      onAskAIAboutStage(prompt, cropName);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center gap-1 transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    <span>Ask AI Advisor</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setActiveToast(null);
                      onNavigateToSaved();
                    }}
                    className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                  >
                    Saved Plans
                  </button>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={triggerNextInRotation}
                    className="px-2.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold"
                    title="Cycle to next growth stage reminder"
                  >
                    Next Stage →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Slide-Over / Modal: Crop Growth Stage Reminder Center */}
      {isCenterOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-xl h-full flex flex-col shadow-2xl overflow-hidden">
            {/* Drawer Header */}
            <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-900 to-green-800 text-white flex items-center justify-between">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/15 text-amber-300 text-[11px] font-bold">
                  <BellRing className="w-3.5 h-3.5" />
                  <span>Recurring Local Growth Stage Alert Engine</span>
                </div>
                <h3 className="text-xl font-extrabold font-heading">
                  Saved Crop Growth Stage Reminders
                </h3>
                <p className="text-xs text-emerald-100">
                  Automated checks for Fertilization, Irrigation, Flowering & Harvest windows
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsCenterOpen(false)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Recurring Frequency Controls */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-700" />
                <span className="text-xs font-bold text-slate-700">Recurring Toast Frequency:</span>
                <div className="flex items-center gap-1">
                  {[20, 35, 60].map((sec) => (
                    <button
                      key={sec}
                      type="button"
                      onClick={() => {
                        setIntervalSeconds(sec);
                        setIsRecurringEnabled(true);
                      }}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                        isRecurringEnabled && intervalSeconds === sec
                          ? 'bg-emerald-700 text-white'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {sec}s
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setIsRecurringEnabled(!isRecurringEnabled)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                      !isRecurringEnabled
                        ? 'bg-amber-600 text-white'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {isRecurringEnabled ? 'Pause' : 'Paused'}
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  triggerNextInRotation();
                }}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 shadow-2xs"
              >
                <FastForward className="w-3.5 h-3.5" />
                <span>Test Toast Alert Now</span>
              </button>
            </div>

            {/* Stage Reminders List */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {allNotifications.map((item) => {
                const meta = STAGE_META[item.stageCategory];
                const IconComp = meta.icon;
                const isDone = completedStageIds.includes(item.id);

                return (
                  <div
                    key={item.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      isDone
                        ? 'bg-slate-50 border-slate-200 opacity-75'
                        : `bg-white ${meta.border} shadow-xs hover:shadow-md`
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold ${meta.badgeBg} ${meta.badgeText}`}
                        >
                          <IconComp className="w-3 h-3" />
                          <span>{getStageLabel(item.stageCategory)}</span>
                        </span>
                        <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-emerald-600" />
                          {item.dayWindow}
                        </span>
                        <span className="text-[11px] font-semibold text-slate-400">
                          ({item.planLocation} · {item.season.toUpperCase()})
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleMarkCompleted(item.id)}
                        className={`text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 transition-colors ${
                          isDone
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
                        }`}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{isDone ? 'Completed' : 'Mark Checked'}</span>
                      </button>
                    </div>

                    <h4 className="text-sm font-extrabold text-slate-900 font-heading">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-600 mt-1">{item.message}</p>

                    <div className="mt-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-800 font-medium">
                      <span className="font-bold text-emerald-800">Action: </span>
                      {item.actionableDosage}
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          triggerNotification(item);
                        }}
                        className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
                      >
                        <BellRing className="w-3.5 h-3.5" />
                        <span>Simulate Toast for This Stage</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIsCenterOpen(false);
                          onAskAIAboutStage(
                            `For ${item.cropName} during ${item.stageName} (${item.dayWindow}) in ${item.planLocation}, explain the exact fertilization or harvest checklist.`,
                            item.cropName
                          );
                        }}
                        className="text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 px-3 py-1 rounded-lg border border-amber-200 flex items-center gap-1"
                      >
                        <span>Ask AI</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
