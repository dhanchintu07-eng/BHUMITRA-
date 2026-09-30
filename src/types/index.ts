export type SoilType = 'sandy' | 'loamy' | 'clay' | 'black' | 'red' | 'other';
export type Season = 'kharif' | 'rabi' | 'zaid';
export type WaterAvailability = 'low' | 'medium' | 'high';
export type LandUnit = 'Acres' | 'Hectares' | 'Bigha' | 'Guntha';
export type LanguageCode = 'en' | 'hi' | 'pa' | 'mr' | 'te' | 'ta' | 'kn';

export type AppPage = 'home' | 'wizard' | 'results' | 'charts' | 'compare' | 'helpdesk' | 'ask' | 'saved';

export interface UserFarmingConditions {
  location: string;
  soilType: SoilType;
  season: Season;
  rainfall: number; // in mm
  waterAvailability: WaterAvailability;
  landSize?: number;
  landUnit?: LandUnit;
}

export interface GrowthStage {
  stageName: string;
  days: number;
  description: string;
}

export interface NutrientRequirement {
  nitrogen: number; // N in kg/ha
  phosphorus: number; // P in kg/ha
  potassium: number; // K in kg/ha
  zinc: number; // Zn in kg/ha
}

export interface Crop {
  id: string;
  name: string;
  localNames: {
    hi: string;
    pa: string;
    mr: string;
    te: string;
    ta: string;
    kn: string;
  };
  category: string;
  image?: string;
  suitableSoils: SoilType[];
  suitableSeasons: Season[];
  optimalRainfallMin: number;
  optimalRainfallMax: number;
  waterNeed: string;
  waterRequirementMm: string;
  waterNumericMm: number;
  waterLevels: WaterAvailability[];
  growingDuration: string;
  growingDaysNumeric: number;
  avgYieldPerAcre: string;
  irrigationStages: string;
  soilDescription: string;
  farmingTip: string;
  marketDemand: string;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Very Low';
  pestAdvisory: string;
  suitabilityPercentage?: number;
  matchReason?: string;
  nutrients: NutrientRequirement;
  growthStages: GrowthStage[];
}

export interface WeatherData {
  locationName: string;
  temperature: number;
  humidity: number;
  weatherCode: number;
  condition: string;
  windSpeed: number;
  rainProbability: number;
  forecastRainfallMm: number;
  farmingAdvisory: string;
  isLive: boolean;
}

export interface RecommendationResponse {
  success: boolean;
  topCrops: Crop[];
  runnerUps: Crop[];
  aiInsight: string;
  inputs: UserFarmingConditions;
  error?: string;
}

export interface SavedPlan {
  id: string;
  timestamp: string;
  conditions: UserFarmingConditions;
  topCrops: Crop[];
  aiInsight: string;
}

export interface RecentSearch {
  id: string;
  label: string;
  conditions: UserFarmingConditions;
  date: string;
}
