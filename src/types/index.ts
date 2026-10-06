export type SoilType = 'sandy' | 'loamy' | 'clay' | 'black' | 'red' | 'other';
export type Season = 'kharif' | 'rabi' | 'zaid';
export type WaterAvailability = 'low' | 'medium' | 'high';
export type LandUnit = 'Acres' | 'Hectares' | 'Bigha' | 'Guntha';
export type LanguageCode = 'en' | 'hi' | 'pa' | 'mr' | 'te' | 'ta' | 'kn';

export type AppPage =
  | 'home'
  | 'news'
  | 'apmc'
  | 'wizard'
  | 'results'
  | 'schemes'
  | 'charts'
  | 'compare'
  | 'helpdesk'
  | 'ask'
  | 'saved';

export type AgriNewsCategory =
  | 'all'
  | 'rainfall'
  | 'government'
  | 'markets'
  | 'crops'
  | 'technology'
  | 'schemes';

export interface GroundingWebSource {
  title: string;
  uri: string;
}

export interface AgriNewsArticle {
  id: string;
  category: Exclude<AgriNewsCategory, 'all'>;
  title: string;
  titleKn: string;
  titleHi: string;
  summary: string;
  summaryKn: string;
  summaryHi: string;
  whyItMatters: string;
  whyItMattersKn: string;
  whyItMattersHi: string;
  sourceName: string;
  sourceUrl: string;
  publishedDate: string;
  isLiveGrounded?: boolean;
  regionTag: string;
}

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
  remindersEnabled?: boolean;
  sowingDate?: string;
}

export interface RecentSearch {
  id: string;
  label: string;
  conditions: UserFarmingConditions;
  date: string;
}

export type NotificationStageCategory =
  | 'fertilization'
  | 'harvest'
  | 'irrigation'
  | 'flowering'
  | 'pest_scouting';

export interface GrowthStageNotification {
  id: string;
  planId: string;
  planLocation: string;
  season: Season;
  cropId: string;
  cropName: string;
  stageName: string;
  stageCategory: NotificationStageCategory;
  dayWindow: string;
  title: string;
  message: string;
  actionableDosage: string;
  timestamp: string;
  isRead: boolean;
}

export interface SecurityAuditResult {
  verified: boolean;
  sessionAuthorized: boolean;
  threatLevel: 'NONE' | 'WARNING' | 'BLOCKED';
  threatCategory?: string;
  policyCheck: string;
  sanitizedInput: boolean;
  timestamp: string;
}
