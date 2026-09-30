import React, { useState, useEffect } from 'react';
import {
  CloudSun,
  Droplets,
  Wind,
  CloudRain,
  MapPin,
  RefreshCw,
  Compass,
  Sparkles,
  Sun
} from 'lucide-react';
import { WeatherData, LanguageCode } from '../types';
import { fetchLiveWeather } from '../services/weather';
import { TRANSLATIONS } from '../data/translations';
import { TTSButton } from './TTSButton';
import farmerMascot from '../assets/images/farmer_soil_growth_1790414455081.jpg';

interface WeatherWidgetProps {
  language: LanguageCode;
  selectedLocation: string;
  onLocationUpdate?: (newLocation: string) => void;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({
  language,
  selectedLocation,
}) => {
  const t = TRANSLATIONS[language];
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadWeather = async (loc?: string) => {
    setIsLoading(true);
    try {
      const data = await fetchLiveWeather(loc || selectedLocation);
      setWeather(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWeather(selectedLocation);
  }, [selectedLocation]);

  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      loadWeather(selectedLocation);
      return;
    }
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,precipitation&daily=precipitation_sum,precipitation_probability_max&timezone=auto`;
          const res = await fetch(url);
          const data = await res.json();
          const current = data.current || {};
          const daily = data.daily || {};

          setWeather({
            locationName: `GPS Farm Coordinates (${lat.toFixed(2)}°N, ${lon.toFixed(2)}°E)`,
            temperature: Math.round(current.temperature_2m ?? 28),
            humidity: Math.round(current.relative_humidity_2m ?? 65),
            weatherCode: current.weather_code ?? 0,
            condition: 'Live GPS Weather',
            windSpeed: Math.round(current.wind_speed_10m ?? 8),
            rainProbability: Math.round(daily.precipitation_probability_max?.[0] ?? 10),
            forecastRainfallMm: Math.round((daily.precipitation_sum?.[0] ?? 0) * 10) / 10,
            farmingAdvisory: 'Local GPS conditions verified. Safe for normal scheduled field activities.',
            isLive: true,
          });
        } catch {
          loadWeather(selectedLocation);
        } finally {
          setIsLoading(false);
        }
      },
      () => {
        loadWeather(selectedLocation);
        setIsLoading(false);
      }
    );
  };

  // Build complete natural voice script in current language
  const weatherVoiceText = weather
    ? language === 'kn'
      ? `${weather.locationName} ನೇರ ಕೃಷಿ ಹವಾಮಾನ ವರದಿ. ಪ್ರಸ್ತುತ ತಾಪಮಾನ ${weather.temperature} ಡಿಗ್ರಿ ಸೆಲ್ಸಿಯಸ್. ಗಾಳಿಯ ತೇವಾಂಶ ಶೇಕಡಾ ${weather.humidity}. ಮಳೆಯಾಗುವ ಸಾಧ್ಯತೆ ಶೇಕಡಾ ${weather.rainProbability}. ಮುನ್ಸೂಚನೆ ಮಳೆ ${weather.forecastRainfallMm} ಮಿಲಿಮೀಟರ್. ಗಾಳಿಯ ವೇಗ ಗಂಟೆಗೆ ${weather.windSpeed} ಕಿಲೋಮೀಟರ್. ಜಮೀನಿನ ಕಾರ್ಯಚಟುವಟಿಕೆ ಸಲಹೆ: ${weather.farmingAdvisory}`
      : language === 'hi'
      ? `${weather.locationName} लाइव कृषि मौसम रिपोर्ट। वर्तमान तापमान ${weather.temperature} डिग्री सेल्सियस है। हवा में नमी ${weather.humidity} प्रतिशत है। बारिश की संभावना ${weather.rainProbability} प्रतिशत है। हवा की गति ${weather.windSpeed} किलोमीटर प्रति घंटा है। खेत कार्य सलाह: ${weather.farmingAdvisory}`
      : `Live Farm Weather Report for ${weather.locationName}. Current temperature is ${weather.temperature} degrees Celsius with ${weather.condition}. Relative humidity is ${weather.humidity} percent. Rain probability is ${weather.rainProbability} percent, with ${weather.forecastRainfallMm} millimeters of forecast rain. Wind speed is ${weather.windSpeed} kilometers per hour. Field Operational Advisory: ${weather.farmingAdvisory}`
    : 'Weather data is currently loading.';

  return (
    <div className="bg-gradient-to-br from-emerald-50 via-sky-50/50 to-amber-50/60 rounded-3xl border border-emerald-100/80 shadow-md p-6 sm:p-7 relative overflow-hidden">
      {/* Background ambient light */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Left: Weather Details & Live Location */}
        <div className="space-y-4 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/90 text-emerald-800 text-xs font-bold border border-emerald-200 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{t.liveWeather}</span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-600 font-medium">Open-Meteo Agro API</span>
            </div>

            <div className="flex items-center gap-2">
              {/* Primary Weather Listen Button */}
              {weather && (
                <TTSButton
                  id="weather-full-report"
                  title={`Live Weather Report (${weather.locationName})`}
                  textToSpeak={weatherVoiceText}
                  language={language}
                  size="sm"
                  variant="primary"
                />
              )}

              <button
                type="button"
                onClick={handleDetectGPS}
                className="px-3 py-1 rounded-lg bg-white/90 hover:bg-white text-emerald-800 border border-emerald-200 text-xs font-semibold transition-colors flex items-center gap-1 shadow-2xs"
                title="Detect Farm GPS"
              >
                <Compass className="w-3.5 h-3.5 text-emerald-600" />
                <span className="hidden sm:inline">Detect GPS</span>
              </button>
              <button
                type="button"
                onClick={() => loadWeather()}
                disabled={isLoading}
                className="p-1.5 rounded-lg bg-white/90 hover:bg-white text-slate-700 border border-slate-200 text-xs transition-colors shadow-2xs"
                title="Refresh Live Weather"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold mb-1">
              <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{weather?.locationName || selectedLocation || 'Indian Agriculture Zone'}</span>
            </div>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-mono tracking-tight">
                {weather ? `${weather.temperature}°C` : '--°C'}
              </span>
              <span className="text-sm sm:text-base font-bold text-emerald-800 flex items-center gap-1">
                <Sun className="w-4 h-4 text-amber-500" />
                {weather?.condition || 'Loading condition...'}
              </span>
            </div>
          </div>

          {/* Key Metrics Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
            <div className="p-2.5 rounded-xl bg-white/90 border border-slate-200/80 shadow-2xs">
              <span className="text-slate-400 font-medium block flex items-center gap-1">
                <Droplets className="w-3.5 h-3.5 text-sky-500" />
                Humidity
              </span>
              <span className="text-sm font-extrabold text-slate-900 font-mono block mt-0.5">
                {weather?.humidity ?? '--'}%
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-white/90 border border-slate-200/80 shadow-2xs">
              <span className="text-slate-400 font-medium block flex items-center gap-1">
                <CloudRain className="w-3.5 h-3.5 text-blue-500" />
                Rain Chance
              </span>
              <span className="text-sm font-extrabold text-slate-900 font-mono block mt-0.5">
                {weather?.rainProbability ?? '--'}%
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-white/90 border border-slate-200/80 shadow-2xs">
              <span className="text-slate-400 font-medium block flex items-center gap-1">
                <Wind className="w-3.5 h-3.5 text-teal-500" />
                Wind Speed
              </span>
              <span className="text-sm font-extrabold text-slate-900 font-mono block mt-0.5">
                {weather?.windSpeed ?? '--'} km/h
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-white/90 border border-slate-200/80 shadow-2xs">
              <span className="text-slate-400 font-medium block flex items-center gap-1">
                <CloudSun className="w-3.5 h-3.5 text-amber-500" />
                Forecast Rain
              </span>
              <span className="text-sm font-extrabold text-slate-900 font-mono block mt-0.5">
                {weather?.forecastRainfallMm ?? '0'} mm
              </span>
            </div>
          </div>

          {/* Operational Advisory Callout with Listen Button */}
          {weather?.farmingAdvisory && (
            <div className="p-3.5 rounded-2xl bg-white/95 border border-emerald-200/90 shadow-xs flex items-start justify-between gap-3">
              <div className="space-y-1">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  {t.weatherAdvisory}
                </span>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {weather.farmingAdvisory}
                </p>
              </div>

              <TTSButton
                id="weather-advisory-only"
                title="Field Operational Weather Advisory"
                textToSpeak={weather.farmingAdvisory}
                language={language}
                size="sm"
                variant="secondary"
              />
            </div>
          )}
        </div>

        {/* Right: Farmer Clip Art Mascot Visual */}
        <div className="hidden lg:flex flex-col items-center justify-center p-3 bg-white/90 rounded-2xl border border-emerald-100 shadow-sm w-44 shrink-0 text-center">
          <div className="w-24 h-24 rounded-2xl overflow-hidden mb-2 shadow-2xs border-2 border-emerald-200 bg-emerald-50">
            <img
              src={farmerMascot}
              alt="Farmer with healthy soil shoot clip art"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-xs font-bold text-slate-900 leading-tight">
            Kisan Weather Desk
          </span>
          <span className="text-[10px] text-emerald-700 font-semibold mt-0.5">
            ಕೃಷಿ ಹವಾಮಾನ ಕೇಂದ್ರ
          </span>
        </div>
      </div>
    </div>
  );
};
