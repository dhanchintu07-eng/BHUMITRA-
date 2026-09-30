import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { BarChart3, Clock, Droplets, Volume2, VolumeX, Sparkles, Sprout, Info } from 'lucide-react';
import { Crop, LanguageCode } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { TTSButton } from './TTSButton';
import tractorClipArt from '../assets/images/tractor_sunny_harvest_1790414466969.jpg';

interface CropChartsProps {
  language: LanguageCode;
  crops: Crop[];
}

export const CropCharts: React.FC<CropChartsProps> = ({ language, crops }) => {
  const t = TRANSLATIONS[language];
  const [activeTab, setActiveTab] = useState<'nutrients' | 'stages' | 'water'>('nutrients');

  if (!crops || crops.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-8 text-center text-slate-500 border border-slate-200">
        No crops selected for chart visualization. Please generate recommendations first.
      </div>
    );
  }

  // Prepare NPK Data for Recharts BarChart
  const npkData = crops.map((crop) => ({
    name: crop.name,
    localName: language !== 'en' && crop.localNames[language] ? crop.localNames[language] : crop.name,
    Nitrogen: crop.nutrients?.nitrogen ?? 100,
    Phosphorus: crop.nutrients?.phosphorus ?? 50,
    Potassium: crop.nutrients?.potassium ?? 40,
    Zinc: crop.nutrients?.zinc ?? 15,
    TotalNPK:
      (crop.nutrients?.nitrogen ?? 100) +
      (crop.nutrients?.phosphorus ?? 50) +
      (crop.nutrients?.potassium ?? 40),
  }));

  // Prepare Growth Stage Days for Stacked BarChart
  const stageData = crops.map((crop) => {
    const stages = crop.growthStages || [];
    return {
      name: crop.name,
      localName: language !== 'en' && crop.localNames[language] ? crop.localNames[language] : crop.name,
      totalDays: crop.growingDaysNumeric || 110,
      'Seedling / Emergence': stages[0]?.days || 20,
      'Vegetative Growth': stages[1]?.days || 35,
      'Flowering Stage': stages[2]?.days || 25,
      'Grain / Fruit Filling': stages[3]?.days || 25,
      'Ripening & Harvest': stages[4]?.days || 15,
    };
  });

  // Prepare Water & Duration radar/bar data
  const waterDurationData = crops.map((crop) => ({
    name: crop.name,
    waterMm: crop.waterNumericMm || 500,
    days: crop.growingDaysNumeric || 110,
    yieldQuintal: parseInt(crop.avgYieldPerAcre) || 15,
  }));

  const chartVoiceScript = language === 'kn'
    ? `ಪೋಷಕಾಂಶ ಮತ್ತು ಬೆಳೆ ಅವಧಿಯ ಚಾರ್ಟ್ ಸಾರಾಂಶ: ${crops.map((c) => `${c.name} ಬೆಳೆಗೆ ಹೆಕ್ಟೇರಿಗೆ ${c.nutrients?.nitrogen} ಕೆ.ಜಿ ಸಾರಜನಕ, ${c.nutrients?.phosphorus} ಕೆ.ಜಿ ರಂಜಕ, ಮತ್ತು ${c.nutrients?.potassium} ಕೆ.ಜಿ ಪೊಟ್ಯಾಶ್ ಅಗತ್ಯವಿದ್ದು, ಬೆಳೆಯಲು ${c.growingDuration} ದಿನಗಳು ಬೇಕಾಗುತ್ತದೆ`).join('. ')}.`
    : language === 'hi'
    ? `पोषक तत्व और विकास चक्र तुलना: ${crops.map((c) => `${c.name} को प्रति हेक्टेयर ${c.nutrients?.nitrogen} किग्रा नाइट्रोजन, ${c.nutrients?.phosphorus} किग्रा फास्फोरस, और ${c.nutrients?.potassium} किग्रा पोटाश की आवश्यकता है और पकने में ${c.growingDuration} लगते हैं`).join('. ')}.`
    : `Comparative Agronomy Chart Summary: ${crops.map((c) => `${c.name} takes approximately ${c.growingDuration} and requires ${c.nutrients?.nitrogen} kg Nitrogen, ${c.nutrients?.phosphorus} kg Phosphorus, and ${c.nutrients?.potassium} kg Potassium per hectare`).join('. ')}.`;

  return (
    <div className="bg-white rounded-3xl border border-emerald-100 shadow-xl shadow-emerald-950/5 p-6 sm:p-10 space-y-8">
      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold mb-2 border border-emerald-200">
            <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Interactive Visual Agronomy · Recharts</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-heading">
            {t.chartsTitle}
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            {t.chartsSub}
          </p>
        </div>

        {/* Audio Speech read-aloud button */}
        <TTSButton
          id="charts-summary-full"
          title="Comparative Fertilizer & Growth Chart Summary"
          textToSpeak={chartVoiceScript}
          language={language}
          size="md"
          variant="primary"
        />
      </div>

      {/* Chart Switcher Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100 rounded-2xl w-fit">
        <button
          type="button"
          onClick={() => setActiveTab('nutrients')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'nutrients'
              ? 'bg-white text-emerald-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          🌿 1. NPK Fertilizer Requirements (kg/ha)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('stages')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'stages'
              ? 'bg-white text-emerald-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          ⏱️ 2. Growth Stage Cycle (Days)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('water')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'water'
              ? 'bg-white text-emerald-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          💧 3. Water Consumption (mm)
        </button>
      </div>

      {/* Chart 1: Comparative NPK Requirements */}
      {activeTab === 'nutrients' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100">
            <div>
              <span className="text-xs font-extrabold text-emerald-900 block font-heading">
                {t.npkChartTitle}
              </span>
              <span className="text-xs text-emerald-700">
                Shows exact Nitrogen (N), Phosphorus (P2O5), and Potassium (K2O) needed per hectare.
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-emerald-800">
                <span className="w-3 h-3 rounded-full bg-emerald-600" /> Nitrogen (N)
              </span>
              <span className="flex items-center gap-1.5 text-amber-800">
                <span className="w-3 h-3 rounded-full bg-amber-500" /> Phosphorus (P)
              </span>
              <span className="flex items-center gap-1.5 text-sky-800">
                <span className="w-3 h-3 rounded-full bg-sky-600" /> Potassium (K)
              </span>
            </div>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={npkData}
                margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#334155', fontSize: 13, fontWeight: 600 }}
                />
                <YAxis
                  unit=" kg"
                  tick={{ fill: '#64748b', fontSize: 12 }}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-lg text-xs space-y-1">
                          <span className="font-extrabold text-slate-900 block font-heading text-sm">
                            {label}
                          </span>
                          {payload.map((entry: any, index: number) => (
                            <div key={`item-${index}`} className="flex justify-between gap-4">
                              <span style={{ color: entry.color }} className="font-semibold">
                                {entry.name}:
                              </span>
                              <span className="font-mono font-bold text-slate-800">
                                {entry.value} kg/ha
                              </span>
                            </div>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend />
                <Bar dataKey="Nitrogen" fill="#059669" radius={[6, 6, 0, 0]} name="Nitrogen (N)" />
                <Bar dataKey="Phosphorus" fill="#f59e0b" radius={[6, 6, 0, 0]} name="Phosphorus (P)" />
                <Bar dataKey="Potassium" fill="#0284c7" radius={[6, 6, 0, 0]} name="Potassium (K)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Chart 2: Growth Stage Timeline (Stacked) */}
      {activeTab === 'stages' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-100 flex items-center justify-between">
            <div>
              <span className="text-xs font-extrabold text-amber-900 block font-heading">
                {t.growthChartTitle}
              </span>
              <span className="text-xs text-amber-700">
                Visualizes total growing days broken into key botanical development stages.
              </span>
            </div>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stageData}
                layout="vertical"
                margin={{ top: 20, right: 30, left: 40, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" unit=" days" tick={{ fill: '#64748b', fontSize: 12 }} />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fill: '#334155', fontSize: 13, fontWeight: 600 }}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const total = payload.reduce((acc, curr) => acc + (Number(curr.value) || 0), 0);
                      return (
                        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xl text-xs space-y-1">
                          <span className="font-extrabold text-slate-900 block font-heading text-sm">
                            {label} (Total: {total} Days)
                          </span>
                          {payload.map((entry: any, index: number) => (
                            <div key={`item-${index}`} className="flex justify-between gap-4">
                              <span style={{ color: entry.color }} className="font-medium">
                                {entry.name}:
                              </span>
                              <span className="font-mono font-bold text-slate-800">
                                {entry.value} days
                              </span>
                            </div>
                          ))}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend />
                <Bar dataKey="Seedling / Emergence" stackId="a" fill="#84cc16" />
                <Bar dataKey="Vegetative Growth" stackId="a" fill="#10b981" />
                <Bar dataKey="Flowering Stage" stackId="a" fill="#eab308" />
                <Bar dataKey="Grain / Fruit Filling" stackId="a" fill="#f97316" />
                <Bar dataKey="Ripening & Harvest" stackId="a" fill="#b45309" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Chart 3: Water Requirement Comparison */}
      {activeTab === 'water' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-4 bg-sky-50/60 rounded-2xl border border-sky-100 flex items-center justify-between">
            <div>
              <span className="text-xs font-extrabold text-sky-900 block font-heading">
                Total Water Requirement (Millimeters)
              </span>
              <span className="text-xs text-sky-700">
                Helps plan tubewell electricity hours and canal water allocations.
              </span>
            </div>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={waterDurationData}
                margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fill: '#334155', fontSize: 13, fontWeight: 600 }} />
                <YAxis unit=" mm" tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip
                  formatter={(val: any) => [`${val} mm`, 'Water Requirement']}
                />
                <Legend />
                <Bar dataKey="waterMm" fill="#0284c7" radius={[6, 6, 0, 0]} name="Water Requirement (mm)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Agricultural Clip Art Footer Callout */}
      <div className="pt-4 p-5 rounded-2xl bg-amber-50/40 border border-amber-200/60 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-xl overflow-hidden border border-amber-200 bg-white shrink-0">
            <img
              src={tractorClipArt}
              alt="Tractor harvest clip art"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <span className="text-xs font-extrabold text-slate-900 block font-heading">
              Smart Fertilizer & Water Scheduling
            </span>
            <p className="text-xs text-slate-600 mt-0.5">
              Nitrogen is best split into 2-3 split applications: 33% at sowing basal, 33% at tillering, and 33% at panicle/flowering.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
