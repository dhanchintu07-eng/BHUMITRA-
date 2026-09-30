import { WeatherData } from '../types';

interface Coordinates {
  lat: number;
  lon: number;
  name: string;
}

const STATE_COORDINATES: Record<string, Coordinates> = {
  karnataka: { lat: 15.3647, lon: 75.1240, name: 'Karnataka (Hubballi-Dharwad Agri Belt)' },
  punjab: { lat: 30.9010, lon: 75.8573, name: 'Punjab (Ludhiana Agri Zone)' },
  maharashtra: { lat: 21.1458, lon: 79.0882, name: 'Maharashtra (Vidarbha / Nagpur)' },
  'uttar pradesh': { lat: 26.8467, lon: 80.9462, name: 'Uttar Pradesh (Central Plain)' },
  rajasthan: { lat: 26.9124, lon: 75.7873, name: 'Rajasthan (Semi-Arid Zone)' },
  'madhya pradesh': { lat: 23.2599, lon: 77.4126, name: 'Madhya Pradesh (Malwa Plateau)' },
  gujarat: { lat: 22.3039, lon: 70.8022, name: 'Gujarat (Saurashtra Belt)' },
  'tamil nadu': { lat: 11.0168, lon: 76.9558, name: 'Tamil Nadu (Coimbatore / Cauvery)' },
  'andhra pradesh': { lat: 16.5062, lon: 80.6480, name: 'Andhra Pradesh (Krishna-Godavari)' },
  telangana: { lat: 17.3850, lon: 78.4867, name: 'Telangana (Deccan Agri Region)' },
  haryana: { lat: 29.6857, lon: 76.9905, name: 'Haryana (Karnal Rice-Wheat Belt)' },
  bihar: { lat: 25.5941, lon: 85.1376, name: 'Bihar (Gangetic Plain)' },
  'west bengal': { lat: 22.9868, lon: 87.8550, name: 'West Bengal (Burdwan Paddy Belt)' },
};

function decodeWeatherCode(code: number): { condition: string; advisory: string } {
  if (code === 0) {
    return {
      condition: 'Clear Sunny Sky',
      advisory: 'Excellent clear weather. Safe for tractor tillage, seed sowing, and pesticide/fertilizer spraying.',
    };
  } else if (code >= 1 && code <= 3) {
    return {
      condition: 'Partly Cloudy',
      advisory: 'Moderate sunlight. Good conditions for transplanting and manual weeding. Evaporation rate is normal.',
    };
  } else if (code >= 45 && code <= 48) {
    return {
      condition: 'Fog / Mist',
      advisory: 'High morning humidity. Scout for fungal pathogens like rust or blight in cereals.',
    };
  } else if (code >= 51 && code <= 65) {
    return {
      condition: 'Light to Moderate Rain',
      advisory: 'Rain showers present. Postpone urea top-dressing and chemical sprays to prevent runoff wastage.',
    };
  } else if (code >= 71 && code <= 77) {
    return {
      condition: 'Hail / Cold Wave',
      advisory: 'Cold stress alert. Provide light protective evening irrigation to guard against frost injury.',
    };
  } else if (code >= 80 && code <= 99) {
    return {
      condition: 'Thunderstorms / Heavy Rain',
      advisory: 'Heavy rain alert. Ensure field drainage channels are open to prevent root asphyxiation.',
    };
  }
  return {
    condition: 'Pleasant Weather',
    advisory: 'Normal seasonal weather. Follow standard irrigation scheduling for current crop growth stage.',
  };
}

export async function fetchLiveWeather(locationName?: string): Promise<WeatherData> {
  let lat = 15.3647; // Default Karnataka Hubballi-Dharwad / Central India
  let lon = 75.1240;
  let resolvedName = 'Karnataka Agricultural Zone';

  if (locationName) {
    const key = locationName.trim().toLowerCase();
    for (const [st, coords] of Object.entries(STATE_COORDINATES)) {
      if (key.includes(st) || st.includes(key)) {
        lat = coords.lat;
        lon = coords.lon;
        resolvedName = coords.name;
        break;
      }
    }
  }

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,precipitation&daily=precipitation_sum,precipitation_probability_max&timezone=auto`;
    const response = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!response.ok) throw new Error('Weather API error');

    const data = await response.json();
    const current = data.current || {};
    const daily = data.daily || {};

    const code = current.weather_code ?? 0;
    const { condition, advisory } = decodeWeatherCode(code);

    return {
      locationName: resolvedName,
      temperature: Math.round(current.temperature_2m ?? 28),
      humidity: Math.round(current.relative_humidity_2m ?? 65),
      weatherCode: code,
      condition,
      windSpeed: Math.round(current.wind_speed_10m ?? 8),
      rainProbability: Math.round(daily.precipitation_probability_max?.[0] ?? 10),
      forecastRainfallMm: Math.round((daily.precipitation_sum?.[0] ?? 0) * 10) / 10,
      farmingAdvisory: advisory,
      isLive: true,
    };
  } catch (error) {
    console.warn('Live weather fetch error, returning realistic regional forecast:', error);
    return {
      locationName: resolvedName || 'Regional Farming Zone',
      temperature: 29,
      humidity: 58,
      weatherCode: 1,
      condition: 'Partly Sunny',
      windSpeed: 10,
      rainProbability: 15,
      forecastRainfallMm: 0,
      farmingAdvisory: 'Normal seasonal temperature. Good conditions for seedbed preparation, weeding, and balanced irrigation.',
      isLive: false,
    };
  }
}
