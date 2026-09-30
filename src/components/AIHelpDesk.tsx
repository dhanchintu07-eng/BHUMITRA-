import React, { useState } from 'react';
import {
  Stethoscope,
  Calendar,
  Sun,
  Sunrise,
  Sunset,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Send,
  Droplets,
  HelpCircle,
  Clock,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { LanguageCode } from '../types';
import { TTSButton } from './TTSButton';
import doctorFarmerMascot from '../assets/images/farmer_friendly_mascot_1790414440682.jpg';
import soilPlantMascot from '../assets/images/farmer_soil_growth_1790414455081.jpg';

interface AIHelpDeskProps {
  language: LanguageCode;
  selectedCrop?: string;
  selectedLocation?: string;
}

interface CropSymptom {
  id: string;
  name: string;
  kannadaName: string;
  hindiName: string;
  cause: string;
  organicRemedy: string;
  fertilizerRemedy: string;
  recoveryDays: string;
  icon: string;
}

const COMMON_SYMPTOMS: CropSymptom[] = [
  {
    id: 'yellow-lower',
    name: 'Lower Leaves Turning Pale Yellow',
    kannadaName: 'ಕೆಳಗಿನ ಎಲೆಗಳು ಹಳದಿಯಾಗುವುದು',
    hindiName: 'निचली पत्तियों का पीला पड़ना',
    cause: 'Nitrogen (N) Deficiency / Nodule Inactivity',
    organicRemedy: 'Apply well-fermented Jeevamrutha or cow dung slurry (100L/acre) with irrigation water.',
    fertilizerRemedy: 'Top-dress Urea @ 25 kg/acre before light irrigation, or spray 2% Urea solution on leaves.',
    recoveryDays: '3 - 5 days',
    icon: '🟡',
  },
  {
    id: 'vein-yellow',
    name: 'Yellow Leaves with Dark Green Veins',
    kannadaName: 'ಹಸಿರು ನರಗಳ ನಡುವೆ ಹಳದಿ ಬಣ್ಣ (ಸತು ಕೊರತೆ)',
    hindiName: 'हरी नसों के बीच पीलापन (जिंक की कमी)',
    cause: 'Zinc (Zn) or Iron (Fe) Deficiency (Common in alkaline soils)',
    organicRemedy: 'Foliar spray of Panchagavya (30ml/litre water) during early morning hours.',
    fertilizerRemedy: 'Foliar spray of Zinc Sulphate (0.5%) + 0.25% Lime solution (5g Zinc + 2.5g Lime per litre).',
    recoveryDays: '5 - 7 days',
    icon: '🍃',
  },
  {
    id: 'scorched-edges',
    name: 'Scorched / Burnt Leaf Margins',
    kannadaName: 'ಎಲೆಗಳ ಅಂಚು ಸುಟ್ಟಂತೆ ಕಂದು ಬಣ್ಣ',
    hindiName: 'पत्तियों के किनारे जलना या भूरे पड़ना',
    cause: 'Potassium (K) Deficiency / Heat Stress',
    organicRemedy: 'Incorporate wood ash around plant root base or compost rich in banana waste.',
    fertilizerRemedy: 'Apply MOP (Muriate of Potash) @ 20 kg/acre or spray 1% Potassium Nitrate (13:0:45).',
    recoveryDays: '4 - 6 days',
    icon: '🍂',
  },
  {
    id: 'leaf-curl',
    name: 'Leaf Curling, Crinkling & Stunting',
    kannadaName: 'ಎಲೆ ಮುದುಡುವುದು ಮತ್ತು ಗಿಡ್ಡವಾಗುವುದು',
    hindiName: 'पत्तियों का मुड़ना और सिकुड़ना',
    cause: 'Sucking Pests (Thrips, Aphids, Whiteflies transmitting virus)',
    organicRemedy: 'Spray 5% Neem Seed Kernel Extract (NSKE) or Neem Oil 5ml/L + 1ml liquid soap.',
    fertilizerRemedy: 'Install yellow & blue sticky traps (10/acre). Spray Acetamiprid 20 SP (0.5g/L) if severe.',
    recoveryDays: '5 - 8 days',
    icon: '🌀',
  },
  {
    id: 'white-powder',
    name: 'White Powdery Patches on Leaf Surface',
    kannadaName: 'ಎಲೆಗಳ ಮೇಲೆ ಬಿಳಿ ಬೂದಿ ರೋಗ',
    hindiName: 'पत्तियों पर सफेद चूर्ण (पाउडरी मिल्ड्यू)',
    cause: 'Powdery Mildew Fungal Infection in dry humid weather',
    organicRemedy: 'Spray sour buttermilk/curd spray (50ml/L) or diluted cow milk (1:9 ratio with water).',
    fertilizerRemedy: 'Spray Wettable Sulphur 80 WP @ 2g per litre of water during morning hours.',
    recoveryDays: '3 - 6 days',
    icon: '🍄',
  },
  {
    id: 'midday-wilt',
    name: 'Sudden Wilting & Drooping at Noon',
    kannadaName: 'ಮಧ್ಯಾಹ್ನ ಗಿಡ ಬಾಡುವುದು (ಬೇರು ಕೊಳೆ)',
    hindiName: 'दोपहर में अचानक मुरझाना (जड़ गलन)',
    cause: 'Root Rot / Fusarium Wilt / Underground Grubs',
    organicRemedy: 'Soil drenching around plant base with Trichoderma viride bio-fungicide @ 10g per litre.',
    fertilizerRemedy: 'Drench root zone with Copper Oxychloride (3g/L) to prevent fungal vascular clogging.',
    recoveryDays: '6 - 10 days',
    icon: '🥀',
  },
];

export const AIHelpDesk: React.FC<AIHelpDeskProps> = ({
  language,
  selectedCrop = 'Wheat / Ragi',
  selectedLocation = 'Karnataka',
}) => {
  const [activeTab, setActiveTab] = useState<'routine' | 'doctor' | 'chat'>('routine');
  const [selectedSymptom, setSelectedSymptom] = useState<CropSymptom>(COMMON_SYMPTOMS[0]);
  const [customQuestion, setCustomQuestion] = useState('');
  const [chatResponse, setChatResponse] = useState<string | null>(null);
  const [isAsking, setIsAsking] = useState(false);

  const handleAskHelpDesk = async (q: string) => {
    if (!q.trim() || isAsking) return;
    setIsAsking(true);
    setChatResponse(null);

    try {
      const res = await fetch('/api/ask-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q,
          language: language === 'kn' ? 'Kannada' : language === 'hi' ? 'Hindi' : 'English',
          cropContext: `${selectedCrop} in ${selectedLocation}`,
        }),
      });
      const data = await res.json();
      setChatResponse(data.answer || 'Consult your local Krishi Vigyan Kendra for specialized laboratory assistance.');
    } catch {
      setChatResponse(
        'For weak or less healthy crops: 1) Apply 19:19:19 balanced foliar spray (5g/L) for quick nutrient uptake. 2) Ensure field is not waterlogged. 3) Spray Neem oil 5ml/L for preventive pest shielding.'
      );
    } finally {
      setIsAsking(false);
    }
  };

  const getSymptomName = (s: CropSymptom) => {
    if (language === 'kn') return s.kannadaName;
    if (language === 'hi') return s.hindiName;
    return s.name;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-green-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold border border-white/30">
              <Stethoscope className="w-3.5 h-3.5 text-amber-300" />
              <span>AI Farm Help Desk & Crop Doctor Desk</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-heading">
              {language === 'kn' ? 'ದೈನಂದಿನ ಕೃಷಿ ದಿನಚರಿ & ಬೆಳೆ ಚಿಕಿತ್ಸೆ' : 'Daily Routine & Crop Health Doctor'}
            </h2>
            <p className="text-sm text-emerald-100 leading-relaxed font-medium">
              {language === 'kn'
                ? 'ದುರ್ಬಲ ಬೆಳೆಗಳಿಗೆ ಪೋಷಕಾಂಶ ಚಿಕಿತ್ಸೆ, ದೈನಂದಿನ ಕೃಷಿ ವೇಳಾಪಟ್ಟಿ ಮತ್ತು ಕೀಟ-ರೋಗ ಪರಿಹಾರಗಳು.'
                : 'Scientific daily operational routine, remedies for yellowing/weak foliage, and fertilizer rescue plans for less healthy crops.'}
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-emerald-300 bg-white/10 shadow-sm shrink-0">
              <img
                src={doctorFarmerMascot}
                alt="Farmer doctor mascot"
                className="w-full h-full object-cover"
              />
            </div>

            <TTSButton
              id="help-desk-main-intro"
              title="AI Farm Help Desk Introduction"
              textToSpeak={
                language === 'kn'
                  ? 'ಭೂಮಿತ್ರ ಕೃಷಿ ಸಹಾಯ ಕೇಂದ್ರಕ್ಕೆ ಸ್ವಾಗತ. ಇಲ್ಲಿ ನೀವು ದುರ್ಬಲ ಬೆಳೆಗಳ ಚಿಕಿತ್ಸೆ, ದೈನಂದಿನ ಗೊಬ್ಬರ ಮತ್ತು ನೀರಾವರಿ ವೇಳಾಪಟ್ಟಿಯನ್ನು ತಿಳಿಯಬಹುದು.'
                  : 'Welcome to the BHUMITRA Farm Help Desk. Here you will find daily routine shifts, fertilizer remedies for pale or sick crops, and instant agro-doctor diagnosis.'
              }
              language={language}
              size="sm"
              variant="pill"
            />
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100 rounded-2xl w-fit">
        <button
          type="button"
          onClick={() => setActiveTab('routine')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'routine' ? 'bg-white text-emerald-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-3.5 h-3.5 text-emerald-600" />
          <span>{language === 'kn' ? '೧. ದೈನಂದಿನ ಕೃಷಿ ದಿನಚರಿ' : '1. Daily Routine Routine'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('doctor')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'doctor' ? 'bg-white text-emerald-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Stethoscope className="w-3.5 h-3.5 text-emerald-600" />
          <span>{language === 'kn' ? '೨. ಬೆಳೆ ಚಿಕಿತ್ಸೆ (ಕಡಿಮೆ ಆರೋಗ್ಯದ ಬೆಳೆ)' : '2. Crop Doctor (Less Healthy Crops)'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('chat')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'chat' ? 'bg-white text-emerald-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          <span>{language === 'kn' ? '೩. ತುರ್ತು ಕೃಷಿ ಸಮಾಲೋಚನೆ' : '3. Ask Routine Question'}</span>
        </button>
      </div>

      {/* TAB 1: DAILY FARM ROUTINE RECOMMENDATIONS */}
      {activeTab === 'routine' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-sm font-extrabold text-emerald-950 block font-heading">
                {language === 'kn' ? 'ದೈನಂದಿನ ಮೂರು-ಹಂತದ ಕೃಷಿ ವೇಳಾಪಟ್ಟಿ' : '3-Shift Daily Operational Farm Routine'}
              </span>
              <span className="text-xs text-emerald-700">
                Tailored for {selectedCrop} in {selectedLocation} to maximize fertilizer efficiency and avoid heat stress.
              </span>
            </div>

            <TTSButton
              id="daily-routine-full-audio"
              title="Full Daily Farm Routine"
              textToSpeak={
                language === 'kn'
                  ? 'ದೈನಂದಿನ ಕೃಷಿ ದಿನಚರಿ: ಮುಂಜಾನೆ ೬ ರಿಂದ ೯ ರವರೆಗೆ ಕೀಟ ಪರಿಶೀಲನೆ ಮತ್ತು ಹನಿ ನೀರಾವರಿ. ಮಧ್ಯಾಹ್ನ ೧೧ ರಿಂದ ೩ ರವರೆಗೆ ಸಿಂಪರಣೆ ಮಾಡಬೇಡಿ. ಸಂಜೆ ೪ ರಿಂದ ೬:೩೦ ರವರೆಗೆ ಸಾವಯವ ಗೊಬ್ಬರ ಮತ್ತು ಜೀವಅಮೃತ ಸಿಂಪಡಿಸಿ.'
                  : 'Daily farm operational routine: Morning shift 6 to 9 AM is for insect scouting and checking pheromone traps. Mid-day shift 11 AM to 3 PM avoid all chemical sprays to prevent leaf scorch. Evening shift 4 to 6:30 PM is the best window for foliar fertilizers and bio-pesticides.'
              }
              language={language}
              size="sm"
              variant="secondary"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Morning Shift */}
            <div className="bg-white rounded-3xl p-6 border border-amber-200 shadow-md space-y-4 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                  <Sunrise className="w-3.5 h-3.5 text-amber-600" />
                  <span>06:00 - 09:30 AM</span>
                </span>
                <span className="text-xs font-bold text-slate-400">Shift 1</span>
              </div>

              <div>
                <h4 className="text-base font-extrabold text-slate-900 font-heading">
                  Morning Scouting & Light Irrigation
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Coolest hours with calm air and active pollinator bees.
                </p>
              </div>

              <ul className="text-xs text-slate-700 space-y-2 leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Check underside of 10 random leaves for whiteflies, aphids, or pink bollworm larvae.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Empty and count insect catches in pheromone traps.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Run scheduled drip lines before sunlight heats up water pipes.</span>
                </li>
              </ul>

              <div className="pt-2 border-t border-slate-100">
                <TTSButton
                  id="morning-shift-routine"
                  title="Morning Farm Routine"
                  textToSpeak="Morning shift 6 to 9:30 AM: Inspect underside of leaves for aphids and thrips. Count insect catches in pheromone traps. Run scheduled drip lines before the sun heats up water pipes."
                  language={language}
                  size="sm"
                  variant="subtle"
                  labelOverride="Morning Audio"
                />
              </div>
            </div>

            {/* Mid-Day Shift */}
            <div className="bg-white rounded-3xl p-6 border border-orange-200 shadow-md space-y-4 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-orange-800 bg-orange-100 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-orange-600" />
                  <span>11:00 AM - 03:00 PM</span>
                </span>
                <span className="text-xs font-bold text-slate-400">Shift 2</span>
              </div>

              <div>
                <h4 className="text-base font-extrabold text-slate-900 font-heading">
                  Peak Sun Care & Moisture Audit
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Intense UV radiation and peak plant evapotranspiration.
                </p>
              </div>

              <ul className="text-xs text-slate-700 space-y-2 leading-relaxed">
                <li className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <span className="font-semibold text-amber-900">DO NOT SPRAY fertilizers or pesticides now (causes toxic leaf scorch).</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Perform soil moisture ball test at 6-inch depth: if ball crumbles, schedule evening irrigation.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Check solar water pumping efficiency and battery charge levels.</span>
                </li>
              </ul>

              <div className="pt-2 border-t border-slate-100">
                <TTSButton
                  id="midday-shift-routine"
                  title="Midday Farm Routine"
                  textToSpeak="Midday shift 11 AM to 3 PM: Avoid all chemical sprays during high heat to prevent burning leaves. Test soil moisture at six inches depth. Ensure field channels are clear."
                  language={language}
                  size="sm"
                  variant="subtle"
                  labelOverride="Midday Audio"
                />
              </div>
            </div>

            {/* Evening Shift */}
            <div className="bg-white rounded-3xl p-6 border border-emerald-200 shadow-md space-y-4 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                  <Sunset className="w-3.5 h-3.5 text-emerald-600" />
                  <span>04:00 - 06:30 PM</span>
                </span>
                <span className="text-xs font-bold text-slate-400">Shift 3</span>
              </div>

              <div>
                <h4 className="text-base font-extrabold text-slate-900 font-heading">
                  Prime Foliar & Fertigation Window
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Stomata open, gentle temperature, optimal nutrient absorption.
                </p>
              </div>

              <ul className="text-xs text-slate-700 space-y-2 leading-relaxed">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Best window for applying 19:19:19, Zinc, or Panchagavya foliar sprays.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Inject water-soluble fertilizers through drip venturi or fertigation tank.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Apply biological cultures (Trichoderma or Pseudomonas) into damp soil.</span>
                </li>
              </ul>

              <div className="pt-2 border-t border-slate-100">
                <TTSButton
                  id="evening-shift-routine"
                  title="Evening Farm Routine"
                  textToSpeak="Evening shift 4 to 6:30 PM: This is the prime window for foliar fertilizer spraying and drip fertigation. Stomata are receptive and evaporation is low."
                  language={language}
                  size="sm"
                  variant="subtle"
                  labelOverride="Evening Audio"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CROP DOCTOR FOR SICK & LESS HEALTHY CROPS */}
      {activeTab === 'doctor' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="p-4 bg-amber-50/70 rounded-2xl border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-sm font-extrabold text-amber-950 block font-heading">
                {language === 'kn' ? 'ಬೆಳೆ ರೋಗ ಲಕ್ಷಣ ಆಯ್ಕೆಮಾಡಿ' : 'Select Observed Crop Symptom'}
              </span>
              <span className="text-xs text-amber-800">
                Click any symptom below to see the exact deficiency, organic treatment, and fertilizer dosage.
              </span>
            </div>

            <TTSButton
              id="crop-doctor-intro"
              title="Crop Doctor Guide"
              textToSpeak={
                language === 'kn'
                  ? 'ಬೆಳೆ ರೋಗ ಪರೀಕ್ಷಕ: ನಿಮ್ಮ ಹೊಲದಲ್ಲಿ ಹಳದಿ ಎಲೆ, ಎಲೆ ಮುದುಡುವುದು ಅಥವಾ ಸುಟ್ಟ ಅಂಚು ಕಂಡುಬಂದರೆ, ಸೂಕ್ತ ರೋಗಲಕ್ಷಣವನ್ನು ಆರಿಸಿ ತಕ್ಷಣದ ಪರಿಹಾರ ಪಡೆಯಿರಿ.'
                  : 'Crop Doctor Diagnostic Guide: Click any symptom to see exact organic treatments, NPK correction, and recovery days.'
              }
              language={language}
              size="sm"
              variant="secondary"
            />
          </div>

          {/* Symptom Selector Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {COMMON_SYMPTOMS.map((s) => {
              const isSelected = selectedSymptom.id === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedSymptom(s)}
                  className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between h-32 relative ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-500/30 shadow-md'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <span className="text-2xl">{s.icon}</span>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block leading-tight font-heading">
                      {getSymptomName(s)}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-semibold block mt-1">
                      {s.recoveryDays} recovery
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Diagnostic & Treatment Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-200 shadow-lg space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <span className="text-3xl p-2 bg-slate-50 rounded-2xl border border-slate-200">{selectedSymptom.icon}</span>
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900 font-heading">
                    {getSymptomName(selectedSymptom)}
                  </h3>
                  <span className="text-xs font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded-md inline-block mt-0.5">
                    Root Cause: {selectedSymptom.cause}
                  </span>
                </div>
              </div>

              <TTSButton
                id={`symptom-treatment-${selectedSymptom.id}`}
                title={`Treatment for ${selectedSymptom.name}`}
                textToSpeak={`${selectedSymptom.name}. Cause: ${selectedSymptom.cause}. Organic remedy: ${selectedSymptom.organicRemedy}. Fertilizer remedy: ${selectedSymptom.fertilizerRemedy}. Expected recovery time is ${selectedSymptom.recoveryDays}.`}
                language={language}
                size="md"
                variant="primary"
              />
            </div>

            {/* Remedies Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Organic First Aid */}
              <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2">
                <div className="flex items-center gap-2 text-emerald-900 font-extrabold text-sm font-heading">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>🌱 Organic First-Aid Treatment</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {selectedSymptom.organicRemedy}
                </p>
                <span className="text-[11px] text-emerald-700 font-semibold block pt-1">
                  ✓ Safe for beneficial earthworms and predatory insects.
                </span>
              </div>

              {/* Fast Chemical / Micronutrient Remedy */}
              <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2">
                <div className="flex items-center gap-2 text-amber-900 font-extrabold text-sm font-heading">
                  <Droplets className="w-4 h-4 text-amber-600" />
                  <span>⚡ Fast-Acting Mineral / Fertilizer Rescue</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {selectedSymptom.fertilizerRemedy}
                </p>
                <span className="text-[11px] text-amber-800 font-semibold block pt-1">
                  ⏱️ Expected leaf greening recovery within {selectedSymptom.recoveryDays}.
                </span>
              </div>
            </div>

            {/* Application Advice Footnote */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs text-slate-600">
              <span>Always spray during cool early morning (07:00-09:00 AM) or evening (04:30-06:30 PM). Use clean water with neutral pH.</span>
              <span className="font-bold text-emerald-800 shrink-0">KVK Protocol Verified</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: INTERACTIVE AI EMERGENCY CONSULTATION */}
      {activeTab === 'chat' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-md space-y-6 animate-in fade-in duration-200">
          <div className="max-w-2xl space-y-1">
            <h3 className="text-xl font-extrabold text-slate-900 font-heading">
              Ask AI Agronomist for Routine & Sick Crop Advice
            </h3>
            <p className="text-xs text-slate-500">
              Describe what is happening in your field or ask for a weekly fertilizer schedule.
            </p>
          </div>

          {/* Quick preset question pills */}
          <div className="flex flex-wrap gap-2">
            {[
              'My wheat leaves look light green and growth is slow, how to fix?',
              'How to prepare Jeevamrutha at home for weak crop roots?',
              'What is the best spray routine for cotton pink bollworm prevention?',
              'Can I mix micronutrient spray with neem oil?',
            ].map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setCustomQuestion(q);
                  handleAskHelpDesk(q);
                }}
                className="text-xs px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-500 hover:text-emerald-800 text-slate-700 font-medium transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Query input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAskHelpDesk(customQuestion);
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={customQuestion}
              onChange={(e) => setCustomQuestion(e.target.value)}
              placeholder="e.g. My leaves have brown spots and wilting, what dose of fungicide should I spray?"
              className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              disabled={isAsking || !customQuestion.trim()}
              className="px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm flex items-center gap-2 disabled:bg-slate-300"
            >
              <span>Ask Doctor</span>
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* AI Response Card */}
          {chatResponse && (
            <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-emerald-900 flex items-center gap-1.5 font-heading">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  BHUMITRA Agro-Doctor Recommendation
                </span>

                <TTSButton
                  id="chat-helpdesk-response"
                  title="Agro-Doctor Recommendation"
                  textToSpeak={chatResponse}
                  language={language}
                  size="sm"
                  variant="pill"
                />
              </div>

              <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                {chatResponse}
              </p>
            </div>
          )}

          {isAsking && (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3 text-xs text-slate-600">
              <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
              <span>Analyzing agronomic diagnosis and formulating safe fertilizer dosage...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
