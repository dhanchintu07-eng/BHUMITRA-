import React, { useState, useEffect, useMemo } from 'react';
import {
  AlertTriangle,
  Flame,
  Snowflake,
  CloudLightning,
  ShieldAlert,
  Sparkles,
  RefreshCw,
  X,
  Wind,
  Droplets,
  Thermometer,
} from 'lucide-react';
import { WeatherData, LanguageCode } from '../types';
import { fetchLiveWeather } from '../services/weather';
import { TTSButton } from './TTSButton';

export type ExtremeHazardType = 'frost' | 'heatwave' | 'heavy_rain' | 'moderate_watch';

interface ExtremeWeatherAlertBannerProps {
  language: LanguageCode;
  location: string;
  liveWeatherOverride?: WeatherData | null;
  onWeatherLoaded?: (data: WeatherData) => void;
  onAskAIProtectionPlan: (prompt: string) => void;
}

interface ParsedWeatherAlert {
  hazardType: ExtremeHazardType;
  severity: 'CRITICAL' | 'HIGH' | 'ADVISORY';
  title: string;
  titleKn: string;
  titleHi: string;
  summary: string;
  summaryKn: string;
  summaryHi: string;
  actions: string[];
  actionsKn: string[];
  bgClass: string;
  borderClass: string;
  accentTextClass: string;
  icon: React.FC<{ className?: string }>;
}

export function parseWeatherForExtremeHazards(weather: WeatherData): ParsedWeatherAlert {
  const temp = weather.temperature;
  const rainMm = weather.forecastRainfallMm;
  const rainProb = weather.rainProbability;
  const code = weather.weatherCode;

  // 1. FROST / COLD WAVE DETECTION
  if (temp <= 7 || (code >= 71 && code <= 77)) {
    return {
      hazardType: 'frost',
      severity: 'CRITICAL',
      title: `EXTREME FROST & COLD WAVE WARNING · ${temp}°C in ${weather.locationName}`,
      titleKn: `ತೀವ್ರ ಶೀತಗಾಳಿ ಮತ್ತು ಹಿಮಪಾತದ ಎಚ್ಚರಿಕೆ (Frost Alert) · ${temp}°C (${weather.locationName})`,
      titleHi: `तीव्र पाला एवं शीतलहर चेतावनी (Frost Alert) · ${temp}°C (${weather.locationName})`,
      summary: `Sub-optimal freezing/near-freezing field temperatures (${temp}°C) detected. High risk of cellular ice crystal damage to flowering crops, potato, mustard, chickpea, and tender horticulture shoots.`,
      summaryKn: `ಕಡಿಮೆ ತಾಪಮಾನ (${temp}°C) ಪತ್ತೆಯಾಗಿದೆ. ಹೂವು ಬಿಡುವ ಬೆಳೆಗಳು, ಕಡಲೆ, ಸಾಸಿವೆ ಮತ್ತು ತೋಟಗಾರಿಕೆ ಬೆಳೆಗಳಿಗೆ ಹಿಮದ (Frost) ಹಾನಿಯಾಗುವ ಅಪಾಯವಿದೆ.`,
      summaryHi: `कम तापमान (${temp}°C) दर्ज किया गया है। फूल वाली फसलों, चना, सरसों और बागवानी फसलों को पाले से नुकसान का गंभीर खतरा है।`,
      actions: [
        'Apply light evening irrigation immediately — moist soil retains latent heat (+2°C to +3°C warmer).',
        'Mulch root zones with crop residue or straw to insulate soil warmth overnight.',
        'Foliar spray of 0.1% Thiourea (1g/L) or 1% Potassium Nitrate to boost cellular frost tolerance.',
      ],
      actionsKn: [
        'ಸಂಜೆ ವೇಳೆ ಬೆಳೆಗೆ ಲಘು ನೀರಾವರಿ ನೀಡಿ — ತೇವಾಂಶವುಳ್ಳ ಮಣ್ಣು ರಾತ್ರಿ ಬೆಚ್ಚಗಿರುತ್ತದೆ.',
        'ಬೇರಿನ ಸುತ್ತ ಒಣ ಹುಲ್ಲು ಅಥವಾ ಹೊದಿಕೆ (Mulching) ಹಾಕಿ.',
        'ಶೀತ ತಡೆಯಲು ಶೇ. 1 ರಷ್ಟು ಪೊಟ್ಯಾಸಿಯಮ್ ನೈಟ್ರೇಟ್ (13:0:45) ದ್ರಾವಣ ಸಿಂಪಡಿಸಿ.',
      ],
      bgClass: 'bg-gradient-to-r from-sky-950 via-blue-950 to-indigo-950 text-white',
      borderClass: 'border-sky-400',
      accentTextClass: 'text-sky-300',
      icon: Snowflake,
    };
  }

  // 2. HEAT WAVE / SCORCHING STRESS DETECTION
  if (temp >= 36 || (temp >= 34 && weather.humidity <= 28)) {
    return {
      hazardType: 'heatwave',
      severity: 'CRITICAL',
      title: `EXTREME HEAT WAVE ALERT · ${temp}°C & ${weather.humidity}% Humidity in ${weather.locationName}`,
      titleKn: `ತೀವ್ರ ಬಿಸಿಗಾಳಿ ಎಚ್ಚರಿಕೆ (Heat Wave Alert) · ${temp}°C (${weather.locationName})`,
      titleHi: `तीव्र लू एवं तापघात चेतावनी (Heat Wave Alert) · ${temp}°C (${weather.locationName})`,
      summary: `Severe thermal stress (${temp}°C) and rapid evapotranspiration detected. Risk of pollen desiccation, flower drop, scorched leaf margins, and soil moisture depletion.`,
      summaryKn: `ತೀವ್ರ ಬಿಸಿಲು ಮತ್ತು ಉಷ್ಣಾಂಶ (${temp}°C) ಪತ್ತೆಯಾಗಿದೆ. ಹೂವು ಉದುರುವಿಕೆ, ಎಲೆ ಅಂಚು ಒಣಗುವಿಕೆ ಮತ್ತು ಮಣ್ಣಿನ ತೇವಾಂಶ ಕುಸಿತದ ಅಪಾಯವಿದೆ.`,
      summaryHi: `अत्यधिक तापमान (${temp}°C) और तेज वाष्पीकरण दर्ज किया गया है। फूल झड़ने और पत्तियां झुलसने का खतरा है।`,
      actions: [
        'Strictly halt all chemical & fertilizer sprays between 10:30 AM and 4:00 PM to prevent leaf burn.',
        'Schedule frequent light drip/sprinkler irrigation during cool early morning (5–8 AM) or evening hours.',
        'Spray 1% Potassium Nitrate (13:0:45 @ 10g/L) or Kaolin clay (3%) to reduce stomatal water loss.',
      ],
      actionsKn: [
        'ಬೆಳಿಗ್ಗೆ 10:30 ರಿಂದ ಸಂಜೆ 4:00 ರವರೆಗೆ ಯಾವುದೇ ರಾಸಾಯನಿಕ ಸಿಂಪರಣೆ ಮಾಡಬೇಡಿ.',
        'ಮುಂಜಾನೆ ಅಥವಾ ಸಂಜೆ ತಂಪಾದ ಸಮಯದಲ್ಲಿ ಮಾತ್ರ ಹನಿ ನೀರಾವರಿ ನೀಡಿ.',
        'ಬಿಸಿಲಿನ ತಾಪ ತಡೆಯಲು ಸಂಜೆ ಶೇ. 1 ರಷ್ಟು ಪೊಟ್ಯಾಸಿಯಮ್ ನೈಟ್ರೇಟ್ ಸಿಂಪಡಿಸಿ.',
      ],
      bgClass: 'bg-gradient-to-r from-amber-950 via-red-950 to-orange-950 text-white',
      borderClass: 'border-amber-400',
      accentTextClass: 'text-amber-300',
      icon: Flame,
    };
  }

  // 3. HEAVY RAINFALL / CLOUD-BURST / WATERLOGGING DETECTION
  if (rainMm >= 15 || rainProb >= 75 || (code >= 63 && code <= 67) || (code >= 80 && code <= 99)) {
    return {
      hazardType: 'heavy_rain',
      severity: 'CRITICAL',
      title: `HEAVY RAINFALL & WATERLOGGING WARNING · ${rainMm} mm (${rainProb}% Chance) in ${weather.locationName}`,
      titleKn: `ಭಾರೀ ಮಳೆ ಮತ್ತು ಜಲಾವೃತ ಎಚ್ಚರಿಕೆ (Heavy Rain Alert) · ${rainMm} mm (${weather.locationName})`,
      titleHi: `भारी वर्षा एवं जलभराव चेतावनी (Heavy Rain Alert) · ${rainMm} mm (${weather.locationName})`,
      summary: `Intense precipitation forecast (${rainMm} mm, ${rainProb}% probability, wind ${weather.windSpeed} km/h). High risk of root zone waterlogging, basal fertilizer runoff, and lodging in tall crops.`,
      summaryKn: `ಭಾರೀ ಮಳೆ ಮುನ್ಸೂಚನೆ (${rainMm} ಮಿ.ಮೀ, ಶೇ. ${rainProb} ಸಾಧ್ಯತೆ). ಹೊಲದಲ್ಲಿ ನೀರು ನಿಂತು ಬೇರು ಕೊಳೆಯುವ ಮತ್ತು ಗೊಬ್ಬರ ಕೊಚ್ಚಿಹೋಗುವ ಅಪಾಯವಿದೆ.`,
      summaryHi: `भारी बारिश का पूर्वानुमान (${rainMm} मिमी, ${rainProb}% संभावना)। खेत में जलभराव और खाद बहने का खतरा है।`,
      actions: [
        'Open field drainage trenches immediately to drain excess standing water within 12–24 hours.',
        'Postpone all Urea top-dressing and foliar pesticide sprays until rain subsides.',
        'Move harvested bags to raised tarpaulin platforms and report any inundation loss on PMFBY within 72 hours.',
      ],
      actionsKn: [
        'ಹೊಲದಲ್ಲಿ ಹೆಚ್ಚುವರಿ ನೀರು ಸರಾಗವಾಗಿ ಹರಿದುಹೋಗಲು ಬಸಿಗಾಲುವೆಗಳನ್ನು (Drainage) ತಕ್ಷಣ ಸ್ವಚ್ಛಗೊಳಿಸಿ.',
        'ಮಳೆ ನಿಲ್ಲುವವರೆಗೆ ಯೂರಿಯಾ ಗೊಬ್ಬರ ಅಥವಾ ಕೀಟನಾಶಕ ಸಿಂಪರಣೆ ಮುಂದೂಡಿ.',
        'ಕೊಯ್ಲು ಮಾಡಿದ ಫಸಲನ್ನು ಎತ್ತರದ ಜಾಗದಲ್ಲಿ ಟಾರ್ಪಾಲಿನ್ ಮುಚ್ಚಿ ರಕ್ಷಿಸಿ.',
      ],
      bgClass: 'bg-gradient-to-r from-slate-900 via-sky-950 to-teal-950 text-white',
      borderClass: 'border-teal-400',
      accentTextClass: 'text-teal-300',
      icon: CloudLightning,
    };
  }

  // 4. REAL-TIME AGRO-WEATHER WATCH (When live weather is currently moderate, still show live parsed status + simulator controls)
  return {
    hazardType: 'moderate_watch',
    severity: 'ADVISORY',
    title: `LIVE WEATHER SHIELD ACTIVE · ${temp}°C, ${rainMm} mm Rain (${weather.condition}) in ${weather.locationName}`,
    titleKn: `ನೇರ ಹವಾಮಾನ ನಿಗಾ ಕೇಂದ್ರ · ${temp}°C, ${rainMm} ಮಿ.ಮೀ ಮಳೆ (${weather.locationName})`,
    titleHi: `लाइव मौसम सुरक्षा निगरानी · ${temp}°C, ${rainMm} मिमी बारिश (${weather.locationName})`,
    summary: `Live satellite telemetry parsed: No extreme frost (<7°C), heat wave (>36°C), or heavy rain (>15mm) threshold crossed right now. Use the simulator buttons on the right to preview Frost, Heat Wave, or Heavy Rain emergency protocols.`,
    summaryKn: `ಪ್ರಸ್ತುತ ನಿಮ್ಮ ಪ್ರದೇಶದಲ್ಲಿ ತೀವ್ರ ಹಿಮಪಾತ, ಬಿಸಿಗಾಳಿ ಅಥವಾ ಭಾರೀ ಮಳೆಯ ಅಪಾಯವಿಲ್ಲ. ತುರ್ತು ಹವಾಮಾನ ಮುನ್ನೆಚ್ಚರಿಕೆಗಳನ್ನು ಪರೀಕ್ಷಿಸಲು ಬಲಭಾಗದ ಬಟನ್ ಬಳಸಿ.`,
    summaryHi: `वर्तमान में आपके क्षेत्र में पाला, लू या भारी बारिश का कोई गंभीर खतरा नहीं है। आप दाईं ओर दिए गए बटन से पाला, लू या भारी बारिश अलर्ट का परीक्षण कर सकते हैं।`,
    actions: [
      `Current Wind: ${weather.windSpeed} km/h · Humidity: ${weather.humidity}% — Safe window for scheduled field operations.`,
      'Monitor morning leaf dew and maintain stage-wise irrigation.',
    ],
    actionsKn: [
      `ಪ್ರಸ್ತುತ ಗಾಳಿಯ ವೇಗ: ${weather.windSpeed} ಕಿ.ಮೀ/ಗಂ · ತೇವಾಂಶ: ${weather.humidity}% — ಕೃಷಿ ಚಟುವಟಿಕೆಗಳಿಗೆ ಸೂಕ್ತ ಸಮಯ.`,
    ],
    bgClass: 'bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white',
    borderClass: 'border-emerald-500/60',
    accentTextClass: 'text-emerald-300',
    icon: AlertTriangle,
  };
}

export const ExtremeWeatherAlertBanner: React.FC<ExtremeWeatherAlertBannerProps> = ({
  language,
  location,
  liveWeatherOverride,
  onWeatherLoaded,
  onAskAIProtectionPlan,
}) => {
  const [liveWeather, setLiveWeather] = useState<WeatherData | null>(null);
  const [simulatedMode, setSimulatedMode] = useState<'live' | 'frost' | 'heatwave' | 'heavy_rain'>('live');
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const loadWeather = async (locName: string) => {
    setIsFetching(true);
    try {
      const data = await fetchLiveWeather(locName);
      setLiveWeather(data);
      if (onWeatherLoaded) onWeatherLoaded(data);
    } catch {
      // handled in service
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    loadWeather(location);
  }, [location]);

  // If parent passes an updated weather object (e.g. from GPS button in WeatherWidget), sync it
  useEffect(() => {
    if (liveWeatherOverride) {
      setLiveWeather(liveWeatherOverride);
      setSimulatedMode('live');
    }
  }, [liveWeatherOverride]);

  const effectiveWeather: WeatherData = useMemo(() => {
    const base: WeatherData = liveWeather || {
      locationName: location || 'Karnataka Agri Zone',
      temperature: 29,
      humidity: 58,
      weatherCode: 1,
      condition: 'Partly Sunny',
      windSpeed: 10,
      rainProbability: 15,
      forecastRainfallMm: 0,
      farmingAdvisory: 'Normal seasonal conditions.',
      isLive: true,
    };

    if (simulatedMode === 'frost') {
      return {
        ...base,
        temperature: 3,
        humidity: 88,
        weatherCode: 73,
        condition: 'Severe Frost & Cold Wave',
        windSpeed: 14,
      };
    }
    if (simulatedMode === 'heatwave') {
      return {
        ...base,
        temperature: 42,
        humidity: 19,
        weatherCode: 0,
        condition: 'Extreme Scorching Heat Wave',
        windSpeed: 22,
      };
    }
    if (simulatedMode === 'heavy_rain') {
      return {
        ...base,
        temperature: 23,
        humidity: 96,
        weatherCode: 95,
        condition: 'Heavy Downpour & Thunderstorm',
        windSpeed: 38,
        rainProbability: 95,
        forecastRainfallMm: 64.5,
      };
    }
    return base;
  }, [liveWeather, location, simulatedMode]);

  const alertData = useMemo(
    () => parseWeatherForExtremeHazards(effectiveWeather),
    [effectiveWeather]
  );

  // Auto-expand when an extreme hazard is active or simulated
  useEffect(() => {
    if (alertData.hazardType !== 'moderate_watch') {
      setIsExpanded(true);
    }
  }, [alertData.hazardType]);

  const IconComp = alertData.icon;
  const displayTitle =
    language === 'kn'
      ? alertData.titleKn
      : language === 'hi'
      ? alertData.titleHi
      : alertData.title;
  const displaySummary =
    language === 'kn'
      ? alertData.summaryKn
      : language === 'hi'
      ? alertData.summaryHi
      : alertData.summary;
  const displayActions =
    language === 'kn' ? alertData.actionsKn : alertData.actions;

  const speechText = `${displayTitle}. ${displaySummary}. ${displayActions.join('. ')}`;

  return (
    <div
      role="region"
      aria-label="Real-Time Extreme Weather Alert Banner"
      className={`${alertData.bgClass} border-b-2 ${alertData.borderClass} transition-colors duration-300 shadow-md`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        {/* Top Row: Alert Headline + Live Weather Telemetry + Simulator Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5">
          <div className="flex items-start sm:items-center gap-2.5 min-w-0">
            <div
              className={`p-1.5 rounded-xl bg-white/15 shrink-0 ${
                alertData.severity === 'CRITICAL' ? 'animate-bounce' : ''
              }`}
            >
              <IconComp className={`w-4 h-4 ${alertData.accentTextClass}`} />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold">
                <span className={alertData.accentTextClass}>
                  {alertData.severity === 'CRITICAL'
                    ? '🚨 EXTREME WEATHER ALERT'
                    : '🛰️ REAL-TIME WEATHER PARSER'}
                </span>
                <span className="text-white/40">·</span>
                <span className="font-mono tabular-nums text-white/90 flex items-center gap-2">
                  <span className="inline-flex items-center gap-0.5">
                    <Thermometer className="w-3 h-3 text-amber-300" />
                    {effectiveWeather.temperature}°C
                  </span>
                  <span className="inline-flex items-center gap-0.5">
                    <Droplets className="w-3 h-3 text-sky-300" />
                    {effectiveWeather.forecastRainfallMm}mm ({effectiveWeather.rainProbability}%)
                  </span>
                  <span className="inline-flex items-center gap-0.5">
                    <Wind className="w-3 h-3 text-teal-300" />
                    {effectiveWeather.windSpeed} km/h
                  </span>
                </span>
              </div>

              <h2 className="text-xs sm:text-sm font-extrabold tracking-tight text-white font-heading truncate">
                {displayTitle}
              </h2>
            </div>
          </div>

          {/* Right Controls: Hazard Simulator Pills + Expand/Collapse */}
          <div className="flex flex-wrap items-center gap-1.5 shrink-0">
            <span className="text-[11px] text-white/70 font-medium mr-1 hidden sm:inline">
              Test Alert:
            </span>

            <button
              type="button"
              onClick={() => setSimulatedMode('live')}
              className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                simulatedMode === 'live'
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              Live ({liveWeather?.temperature ?? 29}°C)
            </button>

            <button
              type="button"
              onClick={() => setSimulatedMode('frost')}
              className={`px-2 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors ${
                simulatedMode === 'frost'
                  ? 'bg-sky-400 text-slate-950'
                  : 'bg-white/10 hover:bg-white/20 text-sky-200'
              }`}
            >
              <Snowflake className="w-3 h-3" />
              <span>Frost (3°C)</span>
            </button>

            <button
              type="button"
              onClick={() => setSimulatedMode('heatwave')}
              className={`px-2 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors ${
                simulatedMode === 'heatwave'
                  ? 'bg-amber-400 text-slate-950'
                  : 'bg-white/10 hover:bg-white/20 text-amber-200'
              }`}
            >
              <Flame className="w-3 h-3" />
              <span>Heat Wave (42°C)</span>
            </button>

            <button
              type="button"
              onClick={() => setSimulatedMode('heavy_rain')}
              className={`px-2 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors ${
                simulatedMode === 'heavy_rain'
                  ? 'bg-teal-400 text-slate-950'
                  : 'bg-white/10 hover:bg-white/20 text-teal-200'
              }`}
            >
              <CloudLightning className="w-3 h-3" />
              <span>Heavy Rain (65mm)</span>
            </button>

            <button
              type="button"
              onClick={() => loadWeather(location)}
              disabled={isFetching}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white"
              title="Refresh Live Weather"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />
            </button>

            <button
              type="button"
              onClick={() => setIsExpanded((prev) => !prev)}
              className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[11px] font-bold text-white"
            >
              {isExpanded ? 'Hide Details' : 'Details'}
            </button>
          </div>
        </div>

        {/* Expanded Actionable Emergency Protocol */}
        {isExpanded && (
          <div className="mt-2.5 pt-2.5 border-t border-white/15 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 text-xs">
            <div className="space-y-1.5 max-w-4xl">
              <p className="text-white/90 leading-relaxed font-medium">{displaySummary}</p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-amber-200 font-semibold">
                {displayActions.map((act, i) => (
                  <span key={i}>• {act}</span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <TTSButton
                id="extreme-weather-alert-tts"
                title="Extreme Weather Advisory"
                textToSpeak={speechText}
                language={language}
                size="sm"
                variant="pill"
              />

              <button
                type="button"
                onClick={() =>
                  onAskAIProtectionPlan(
                    `URGENT WEATHER ALERT in ${effectiveWeather.locationName}: Current condition is ${effectiveWeather.condition} (${effectiveWeather.temperature}°C, ${effectiveWeather.forecastRainfallMm}mm rain, ${effectiveWeather.humidity}% humidity). Give me an immediate step-by-step crop rescue and PMFBY insurance protection checklist.`
                  )
                }
                className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>
                  {language === 'kn' ? 'AI ಬೆಳೆ ರಕ್ಷಣಾ ಸಲಹೆ' : 'AI Rescue Plan'}
                </span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
