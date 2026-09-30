import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize GoogleGenAI server-side with telemetry header
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    aiConfigured: Boolean(apiKey),
    timestamp: new Date().toISOString(),
  });
});

// Comprehensive Indian Agronomy Knowledge Base for Fallback & Grounding
const CROP_DATABASE = [
  {
    id: 'wheat',
    name: 'Wheat',
    localNames: { hi: 'गेहूं', pa: 'ਕਣਕ', mr: 'गहू', te: 'గోధుమలు', ta: 'கோதுமை' },
    category: 'Cereal / Food Grain',
    suitableSoils: ['loamy', 'clay', 'black'],
    suitableSeasons: ['rabi'],
    optimalRainfallMin: 350,
    optimalRainfallMax: 750,
    waterNeed: 'Medium (400 - 600 mm)',
    waterLevels: ['medium', 'high'],
    growingDuration: '110 - 130 days',
    avgYieldPerAcre: '18 - 22 Quintals',
    waterRequirementMm: '450 - 650 mm',
    irrigationStages: '4 - 6 irrigations (Crown root initiation, tillering, flowering, grain milk stage)',
    soilDescription: 'Deep, well-drained loamy or clayey soils with neutral pH (6.0 - 7.5).',
    farmingTip: 'First irrigation at 20-25 days after sowing (CRI stage) is critical. Use balanced NPK (120:60:40 kg/ha).',
    marketDemand: 'Very High (MSP backed)',
    riskLevel: 'Low',
    pestAdvisory: 'Watch for yellow/brown rust in cool, damp weather. Treat seeds with Carboxin or Thiram before sowing.',
  },
  {
    id: 'rice',
    name: 'Paddy / Rice',
    localNames: { hi: 'धान / चावल', pa: 'ਚੌਲ / ਝੋਨਾ', mr: 'भात / तांदूळ', te: 'వరి / ధాన్యం', ta: 'நெல்' },
    category: 'Cereal / Staple Grain',
    suitableSoils: ['clay', 'loamy', 'black'],
    suitableSeasons: ['kharif'],
    optimalRainfallMin: 1000,
    optimalRainfallMax: 1800,
    waterNeed: 'High (1000 - 1400 mm)',
    waterLevels: ['high'],
    growingDuration: '115 - 140 days',
    avgYieldPerAcre: '22 - 28 Quintals',
    waterRequirementMm: '1100 - 1400 mm',
    irrigationStages: 'Standing water of 2-5 cm maintained during tillering and panicle initiation.',
    soilDescription: 'Heavy clay soils that retain moisture with low water permeability.',
    farmingTip: 'Adopt alternate wetting and drying (AWD) technique or Direct Seeded Rice (DSR) to save up to 30% water.',
    marketDemand: 'Very High (Universal staple)',
    riskLevel: 'Medium (water dependent)',
    pestAdvisory: 'Monitor stem borer and blast disease. Maintain 20x15 cm spacing for aeration.',
  },
  {
    id: 'cotton',
    name: 'Cotton',
    localNames: { hi: 'कपास', pa: 'ਕਪਾਹ', mr: 'कापूस', te: 'పత్తి', ta: 'பருத்தி' },
    category: 'Commercial / Fiber',
    suitableSoils: ['black', 'loamy'],
    suitableSeasons: ['kharif'],
    optimalRainfallMin: 500,
    optimalRainfallMax: 900,
    waterNeed: 'Medium (500 - 750 mm)',
    waterLevels: ['medium', 'low'],
    growingDuration: '150 - 180 days',
    avgYieldPerAcre: '8 - 12 Quintals (Seed Cotton)',
    waterRequirementMm: '600 - 800 mm',
    irrigationStages: '3 - 5 light irrigations at squaring, flowering, and boll development.',
    soilDescription: 'Deep black cotton soil (Regur) with high clay content and good moisture retention.',
    farmingTip: 'Avoid excessive nitrogen which causes vegetative overgrowth. Install pheromone traps for pink bollworm early.',
    marketDemand: 'High (Textile industry)',
    riskLevel: 'Medium',
    pestAdvisory: 'Spray Neem oil 5ml/litre at vegetative stage against whiteflies and jassids.',
  },
  {
    id: 'ragi',
    name: 'Finger Millet / Ragi',
    localNames: { hi: 'रागी', pa: 'ਰਾਗੀ', mr: 'नाचणी', te: 'రాగులు', ta: 'கேழ்வரகு', kn: 'ರಾಗಿ' },
    category: 'Millet / Nutri-Cereal',
    suitableSoils: ['red', 'loamy', 'sandy', 'other'],
    suitableSeasons: ['kharif', 'rabi'],
    optimalRainfallMin: 350,
    optimalRainfallMax: 650,
    waterNeed: 'Low (300 - 450 mm)',
    waterLevels: ['low', 'medium'],
    growingDuration: '100 - 115 days',
    avgYieldPerAcre: '14 - 18 Quintals',
    waterRequirementMm: '300 - 450 mm',
    irrigationStages: '1 - 2 protective irrigations at tillering and flowering; largely rainfed.',
    soilDescription: 'Porous red soils, sandy loams, well-aerated with good drainage.',
    farmingTip: 'Super climate resilient Karnataka crop. Intercrop with redgram (4:2) for soil nitrogen enhancement.',
    marketDemand: 'Very High (Nutri-cereal mission)',
    riskLevel: 'Very Low',
    pestAdvisory: 'Use blast resistant varieties like GPU-28 or MR-1.',
  },
  {
    id: 'mustard',
    name: 'Mustard / Sarson',
    localNames: { hi: 'सरसों', pa: 'ਸਰ੍ਹੋਂ', mr: 'मोहरी', te: 'ఆవాలు', ta: 'கடுகு' },
    category: 'Oilseed',
    suitableSoils: ['sandy', 'loamy', 'black'],
    suitableSeasons: ['rabi'],
    optimalRainfallMin: 250,
    optimalRainfallMax: 450,
    waterNeed: 'Low (250 - 400 mm)',
    waterLevels: ['low', 'medium'],
    growingDuration: '100 - 120 days',
    avgYieldPerAcre: '7 - 10 Quintals',
    waterRequirementMm: '250 - 350 mm',
    irrigationStages: '2 - 3 irrigations (Pre-flowering at 30-35 DAS and pod development at 60 DAS).',
    soilDescription: 'Light to medium sandy loam, fertile and well-drained, tolerant to mild salinity.',
    farmingTip: 'Excellent cash crop for low rainfall areas. Apply sulphur 20 kg/ha to boost oil content significantly.',
    marketDemand: 'High (Cooking oil demand)',
    riskLevel: 'Low',
    pestAdvisory: 'Watch for aphid infestation during cloudy winter mornings; spray Dimethoate 30 EC if needed.',
  },
  {
    id: 'chickpea',
    name: 'Chickpea / Chana',
    localNames: { hi: 'चना', pa: 'ਛੋਲੇ', mr: 'हरभरा', te: 'శనగలు', ta: 'கொண்டைக் கடலை' },
    category: 'Pulse / Legume',
    suitableSoils: ['loamy', 'black', 'red', 'sandy'],
    suitableSeasons: ['rabi'],
    optimalRainfallMin: 300,
    optimalRainfallMax: 550,
    waterNeed: 'Low (250 - 400 mm)',
    waterLevels: ['low', 'medium'],
    growingDuration: '95 - 115 days',
    avgYieldPerAcre: '8 - 11 Quintals',
    waterRequirementMm: '250 - 400 mm',
    irrigationStages: '1 - 2 protective irrigations at branching and pod filling. Never irrigate during peak bloom.',
    soilDescription: 'Well-aerated sandy loam to black soil; root system fixes atmospheric nitrogen.',
    farmingTip: 'Nip terminal shoots at 30-35 days after sowing to stimulate vigorous lateral branching and higher pods.',
    marketDemand: 'High (Protein staple)',
    riskLevel: 'Low',
    pestAdvisory: 'Helicoverpa pod borer can be managed using Trichogramma egg parasitoids or HaNPV bio-pesticide.',
  },
  {
    id: 'maize',
    name: 'Maize / Corn',
    localNames: { hi: 'मक्का', pa: 'ਮੱਕੀ', mr: 'मका', te: 'మొక్కజొన్న', ta: 'மக்காச்சோளம்' },
    category: 'Cereal / Multi-purpose',
    suitableSoils: ['loamy', 'red', 'black'],
    suitableSeasons: ['kharif', 'rabi'],
    optimalRainfallMin: 500,
    optimalRainfallMax: 850,
    waterNeed: 'Medium (500 - 750 mm)',
    waterLevels: ['medium', 'high'],
    growingDuration: '90 - 110 days',
    avgYieldPerAcre: '20 - 26 Quintals',
    waterRequirementMm: '500 - 700 mm',
    irrigationStages: 'Critical at knee-high stage, tasseling, and grain milking stage.',
    soilDescription: 'Rich, fertile loamy soil with excellent organic matter and drainage (no waterlogging).',
    farmingTip: 'Ensure Ridge and Furrow planting to prevent water stagnation. Highly responsive to potash and zinc.',
    marketDemand: 'Very High (Feed, starch, food)',
    riskLevel: 'Low-Medium',
    pestAdvisory: 'Watch for Fall Armyworm (FAW) whorl damage; apply whorl application of Emamectin benzoate early.',
  },
  {
    id: 'sugarcane',
    name: 'Sugarcane',
    localNames: { hi: 'गन्ना', pa: 'ਗੰਨਾ', mr: 'ऊस', te: 'చెరకు', ta: 'கரும்பு' },
    category: 'Cash Crop / Commercial',
    suitableSoils: ['loamy', 'clay', 'black'],
    suitableSeasons: ['kharif', 'rabi'],
    optimalRainfallMin: 1100,
    optimalRainfallMax: 1900,
    waterNeed: 'High (1500 - 2200 mm)',
    waterLevels: ['high'],
    growingDuration: '300 - 360 days',
    avgYieldPerAcre: '350 - 450 Quintals (Fresh Cane)',
    waterRequirementMm: '1500 - 2000 mm',
    irrigationStages: '15 - 20 irrigations or continuous precision drip irrigation.',
    soilDescription: 'Deep, rich alluvial or black soils with at least 1 meter rooting depth.',
    farmingTip: 'Drip fertigation saves up to 50% water and increases cane diameter. Trash mulching preserves soil moisture.',
    marketDemand: 'Assured (Sugar Mills MSP/FRP)',
    riskLevel: 'Low (assured mill offtake)',
    pestAdvisory: 'Intercrop with cowpea or green gram to suppress early shoot borer and add organic matter.',
  },
  {
    id: 'groundnut',
    name: 'Groundnut / Peanut',
    localNames: { hi: 'मूंगफली', pa: 'ਮੂੰਗਫਲੀ', mr: 'भुईमूग', te: 'వేరుశనగ', ta: 'வேர்க்கடலை' },
    category: 'Oilseed / Legume',
    suitableSoils: ['sandy', 'red', 'loamy'],
    suitableSeasons: ['kharif', 'zaid'],
    optimalRainfallMin: 450,
    optimalRainfallMax: 700,
    waterNeed: 'Medium (400 - 600 mm)',
    waterLevels: ['low', 'medium'],
    growingDuration: '105 - 120 days',
    avgYieldPerAcre: '9 - 14 Quintals',
    waterRequirementMm: '450 - 600 mm',
    irrigationStages: 'Pegging stage (40-45 DAS) and pod formation (60-70 DAS) require adequate moisture.',
    soilDescription: 'Friable, porous sandy loam or red sandy soil allowing easy peg penetration.',
    farmingTip: 'Apply Gypsum @ 200 kg/acre at 40 days after sowing. Calcium is vital for full pod filling and oil synthesis.',
    marketDemand: 'High (Domestic and export)',
    riskLevel: 'Medium',
    pestAdvisory: 'Control tikka leaf spot with prophylactic spray of Mancozeb (2g/litre).',
  },
  {
    id: 'soybean',
    name: 'Soybean',
    localNames: { hi: 'सोयाबीन', pa: 'ਸੋਇਆਬੀਨ', mr: 'सोयाबीन', te: 'సోయాబీన్', ta: 'சோயாபீன்' },
    category: 'Oilseed / Protein',
    suitableSoils: ['black', 'loamy'],
    suitableSeasons: ['kharif'],
    optimalRainfallMin: 600,
    optimalRainfallMax: 950,
    waterNeed: 'Medium (500 - 750 mm)',
    waterLevels: ['medium'],
    growingDuration: '90 - 105 days',
    avgYieldPerAcre: '8 - 12 Quintals',
    waterRequirementMm: '500 - 650 mm',
    irrigationStages: 'Rainfed primarily; 1 supplemental irrigation during pod filling if dry spell occurs.',
    soilDescription: 'Medium to deep black soils with good drainage; cannot tolerate water stagnation beyond 24 hrs.',
    farmingTip: 'Inoculate seed with Bradyrhizobium japonicum culture before sowing to enhance natural nodulation.',
    marketDemand: 'Very High (Soymeal & cooking oil)',
    riskLevel: 'Low-Medium',
    pestAdvisory: 'Use yellow sticky traps and pheromone traps for Spodoptera litura caterpillar detection.',
  },
  {
    id: 'moong',
    name: 'Green Gram / Moong',
    localNames: { hi: 'मूंग दाल', pa: 'ਮੂੰਗ', mr: 'मूग', te: 'పెసలు', ta: 'பாசிப்பயறு' },
    category: 'Short-Duration Pulse',
    suitableSoils: ['loamy', 'sandy', 'black', 'red'],
    suitableSeasons: ['kharif', 'zaid'],
    optimalRainfallMin: 300,
    optimalRainfallMax: 550,
    waterNeed: 'Low (250 - 350 mm)',
    waterLevels: ['low', 'medium'],
    growingDuration: '60 - 75 days',
    avgYieldPerAcre: '5 - 7 Quintals',
    waterRequirementMm: '250 - 350 mm',
    irrigationStages: '2 - 3 light irrigations in Zaid summer season; mostly rainfed in Kharif.',
    soilDescription: 'Well-drained loam to sandy loam. Excellent catch crop between Rabi harvest and Kharif sowing.',
    farmingTip: 'Enriches soil with 30-40 kg nitrogen/ha for subsequent crop. Ideal short window crop for summer profits.',
    marketDemand: 'High (Everyday kitchen pulse)',
    riskLevel: 'Low',
    pestAdvisory: 'Control whiteflies early as they transmit Yellow Mosaic Virus (YMV); choose YMV-resistant seeds (e.g. IPM 02-3).',
  },
  {
    id: 'bajra',
    name: 'Pearl Millet / Bajra',
    localNames: { hi: 'बाजरा', pa: 'ਬਾਜਰਾ', mr: 'बाजरी', te: 'సజ్జలు', ta: 'கம்பு' },
    category: 'Millet / Climate Resilient',
    suitableSoils: ['sandy', 'red', 'other'],
    suitableSeasons: ['kharif'],
    optimalRainfallMin: 250,
    optimalRainfallMax: 500,
    waterNeed: 'Very Low (200 - 350 mm)',
    waterLevels: ['low'],
    growingDuration: '75 - 90 days',
    avgYieldPerAcre: '12 - 16 Quintals',
    waterRequirementMm: '250 - 350 mm',
    irrigationStages: '1 - 2 lifesaving irrigations during extreme dry spells at boot and grain development stage.',
    soilDescription: 'Light sandy soils, shallow gravelly soils, drought hardy with deep root system.',
    farmingTip: 'Super climate-resilient crop that thrives in harsh summer temperatures. Low input costs yield high net margin.',
    marketDemand: 'Growing Rapidly (Nutri-cereal surge & millet mission)',
    riskLevel: 'Very Low',
    pestAdvisory: 'Downy mildew resistant hybrids (e.g. HHB 67 Improved) perform best under arid conditions.',
  },
  {
    id: 'watermelon',
    name: 'Watermelon',
    localNames: { hi: 'तरबूज', pa: 'ਹਦਵਾਣਾ / ਤਰਬੂਜ਼', mr: 'कलिंगड', te: 'పుచ్చకాయ', ta: 'தர்பூசணி' },
    category: 'Horticulture / Fruit',
    suitableSoils: ['sandy', 'loamy'],
    suitableSeasons: ['zaid'],
    optimalRainfallMin: 200,
    optimalRainfallMax: 450,
    waterNeed: 'Medium (350 - 500 mm)',
    waterLevels: ['medium', 'high'],
    growingDuration: '80 - 100 days',
    avgYieldPerAcre: '150 - 220 Quintals (Fruit)',
    waterRequirementMm: '350 - 450 mm',
    irrigationStages: 'Frequent light drip irrigation; stop irrigation 5-7 days before harvest to build fruit brix sweetness.',
    soilDescription: 'Warm, porous sandy loam or riverbed sand with rapid drainage.',
    farmingTip: 'Silver-black plastic mulch keeps soil warm, checks weeds, and delivers clean spotless melons with higher market rates.',
    marketDemand: 'Very High in Peak Summer',
    riskLevel: 'Medium (Perishable produce)',
    pestAdvisory: 'Use yellow sticky cards for aphids and fruit fly traps with methyl eugenol pheromone lures.',
  },
];

// Helper calculation engine
function calculateCropScore(crop: any, input: any) {
  let score = 50;
  const reasons: string[] = [];

  // 1. Soil Match
  const userSoil = (input.soilType || '').toLowerCase();
  if (crop.suitableSoils.includes(userSoil)) {
    score += 25;
    reasons.push(`Optimal growth match for ${input.soilType} soil structure.`);
  } else if (userSoil === 'other' || crop.suitableSoils.includes('loamy')) {
    score += 12;
    reasons.push(`Adaptable to ${input.soilType} soil with good organic mulching.`);
  } else {
    score -= 10;
  }

  // 2. Season Match
  const userSeason = (input.season || '').toLowerCase();
  if (crop.suitableSeasons.includes(userSeason)) {
    score += 25;
    reasons.push(`Perfect climatic window during the ${input.season} season.`);
  } else {
    score -= 20;
    reasons.push(`Secondary season candidate under controlled micro-climate.`);
  }

  // 3. Water Availability & Rainfall
  const rainfall = Number(input.rainfall) || 600;
  const userWater = (input.waterAvailability || 'medium').toLowerCase();

  // If crop is drought-tolerant and water availability is low:
  if (crop.waterNeed.toLowerCase().includes('low') && (userWater === 'low' || rainfall < 500)) {
    score += 20;
    reasons.push(`Exceptional drought resilience suited for limited water availability.`);
  } else if (crop.waterNeed.toLowerCase().includes('high')) {
    if (userWater === 'high' || rainfall >= 1000) {
      score += 20;
      reasons.push(`Plentiful water support meets this crop's heavy irrigation requirements.`);
    } else {
      score -= 25;
      reasons.push(`High water requirement may face moisture stress under current water supply.`);
    }
  } else {
    // Medium water need
    if (userWater !== 'low' || rainfall >= 450) {
      score += 15;
      reasons.push(`Balanced moisture demand aligns with your regional rainfall and tube well setup.`);
    } else {
      score += 5;
    }
  }

  // 4. Regional suitability bonus
  const state = (input.location || '').toLowerCase();
  if (state.includes('punjab') || state.includes('haryana') || state.includes('uttar pradesh')) {
    if (['wheat', 'rice', 'mustard', 'sugarcane'].includes(crop.id)) score += 8;
  } else if (state.includes('maharashtra') || state.includes('gujarat') || state.includes('madhya pradesh')) {
    if (['cotton', 'soybean', 'groundnut', 'chickpea', 'jowar'].includes(crop.id)) score += 8;
  } else if (state.includes('rajasthan')) {
    if (['bajra', 'mustard', 'chickpea', 'moong'].includes(crop.id)) score += 10;
  } else if (state.includes('karnataka')) {
    if (['ragi', 'rice', 'maize', 'groundnut', 'cotton', 'sugarcane'].includes(crop.id)) score += 10;
  } else if (state.includes('andhra') || state.includes('tamil nadu')) {
    if (['rice', 'maize', 'groundnut', 'cotton', 'sugarcane', 'ragi'].includes(crop.id)) score += 8;
  }

  // Clamp score between 60% and 98%
  const finalPercentage = Math.min(98, Math.max(62, Math.round(score)));

  return {
    ...crop,
    suitabilityPercentage: finalPercentage,
    matchReason: reasons.slice(0, 2).join(' ') || `Strong general agronomic suitability for current parameters.`,
  };
}

// Recommendation API endpoint
app.post('/api/recommend', async (req, res) => {
  try {
    const { location, soilType, season, rainfall, waterAvailability, landSize, landUnit } = req.body;

    // Calculate scores for all crops
    const scoredCrops = CROP_DATABASE.map((c) =>
      calculateCropScore(c, { location, soilType, season, rainfall, waterAvailability })
    ).sort((a, b) => b.suitabilityPercentage - a.suitabilityPercentage);

    const topCrops = scoredCrops.slice(0, 3);
    const runnerUps = scoredCrops.slice(3, 6);

    let aiInsight = '';

    // If Gemini API is available, enrich with real AI agronomic intelligence
    if (ai) {
      try {
        const prompt = `You are BHUMITRA AI, an expert agronomist for Indian agriculture.
Given the farmer's parameters:
- Location: ${location || 'India'}
- Soil Type: ${soilType}
- Season: ${season}
- Average Rainfall: ${rainfall} mm
- Water Availability: ${waterAvailability}
- Land Area: ${landSize || '1'} ${landUnit || 'Acres'}
Top recommended crops: ${topCrops.map((c) => c.name).join(', ')}.

Provide 2-3 concise, farmer-friendly, highly practical agricultural recommendations (under 120 words total).
Mention:
1. One critical pre-sowing soil conditioning or seed treatment step for this exact soil (${soilType}).
2. Recommended water management or moisture conservation strategy.
Keep tone warm, encouraging, realistic, and practical.`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
        });

        if (response.text) {
          aiInsight = response.text.trim();
        }
      } catch (err: any) {
        console.warn('Gemini recommendation enrichment fallback:', err.message);
      }
    }

    // Default fallback agronomy summary if AI was not invoked or errored
    if (!aiInsight) {
      aiInsight = `For ${soilType} soil in ${season} season with ${waterAvailability} water availability in ${location || 'your area'}: Prioritize deep summer plowing to eliminate soil-borne pathogens. Treat certified seeds with Trichoderma viride (4g/kg seed) before sowing. If water availability is ${waterAvailability}, consider micro-sprinklers or drip lines to maximize yield per drop.`;
    }

    res.json({
      success: true,
      topCrops,
      runnerUps,
      aiInsight,
      inputs: { location, soilType, season, rainfall, waterAvailability, landSize, landUnit },
    });
  } catch (error: any) {
    console.error('Error in /api/recommend:', error);
    res.status(500).json({ success: false, error: error.message || 'Internal server error' });
  }
});

// "Ask BHUMITRA AI" endpoint
app.post('/api/ask-ai', async (req, res) => {
  try {
    const { question, language = 'English', cropContext } = req.body;

    if (!question || typeof question !== 'string') {
      return res.status(400).json({ error: 'Question is required' });
    }

    let answer = '';

    if (ai) {
      try {
        const systemInstruction = `You are BHUMITRA AI, a trusted, friendly, and practical agricultural advisory engine for Indian farmers, students, and agronomists.
Guidelines:
- Answer must be short, practical, actionable, and easy to understand (max 120 words).
- State exact quantities where applicable (e.g. fertilizer dose, water intervals, seed rate).
- If question is in Hindi, Punjabi, Marathi, Telugu, Tamil, or if user requested language '${language}', respond in that language or clear Romanized vernacular if requested, keeping technical terms accessible.
- Avoid vague generic statements. Focus on field-tested Indian farming practices (ICAR/KVK aligned).`;

        const contents = cropContext
          ? `Context: User is farming/inquiring about ${cropContext}.\nQuestion: ${question}`
          : question;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents,
          config: {
            systemInstruction,
          },
        });

        answer = response.text?.trim() || '';
      } catch (err: any) {
        console.warn('Gemini chat error, using expert fallback:', err.message);
      }
    }

    // Fallback agricultural expert response if no API key or network error
    if (!answer) {
      const qLower = question.toLowerCase();
      if (qLower.includes('fertilizer') || qLower.includes('urea') || qLower.includes('npk')) {
        answer = `Balanced fertilization is key. For cereals like Wheat and Rice, standard NPK ratio is 4:2:1 (approx 120kg N, 60kg P2O5, 40kg K2O per hectare). Apply 1/3 Nitrogen with full P & K as basal dose, and top-dress remaining Nitrogen in two equal splits during tillering and panicle/flowering stages. Supplement with Zinc Sulphate (25 kg/ha) in deficient soils.`;
      } else if (qLower.includes('pest') || qLower.includes('insect') || qLower.includes('worm')) {
        answer = `For eco-friendly pest control: 1) Spray Neem Oil (5ml/L + liquid soap) at first sign of sucking pests. 2) Install 4-5 pheromone traps per acre to monitor bollworms and stem borers. 3) Conserve beneficial predators like ladybird beetles. For severe fungal spots, apply Mancozeb 75 WP @ 2g/litre water.`;
      } else if (qLower.includes('water') || qLower.includes('irrigation') || qLower.includes('drip')) {
        answer = `Irrigate during cool morning or evening hours to reduce evaporation losses. Avoid water stress during flowering and grain-filling stages. If using flood irrigation, create bunds and furrows. Switching to drip irrigation can save 40-50% water while boosting yield by 20-30%.`;
      } else if (qLower.includes('soil') || qLower.includes('black') || qLower.includes('clay') || qLower.includes('sand')) {
        answer = `Maintain soil health by incorporating well-decomposed Farm Yard Manure (FYM) or vermicompost @ 4-5 tonnes/acre annually. In sandy soils, mulching retains vital moisture; in heavy clay soils, ensure field surface drains to prevent water stagnation. Test soil pH and organic carbon every 2 years.`;
      } else {
        answer = `For healthy crop development, focus on 4 fundamentals: 1) Use certified disease-free seeds treated with bio-fungicide, 2) Maintain optimal plant-to-plant spacing for sunlight and air, 3) Apply balanced fertilizers based on soil test values, and 4) Scout fields weekly to detect weed or pest buildup early.`;
      }
    }

    res.json({
      success: true,
      answer,
      source: ai ? 'gemini-3.8-flash' : 'bhumitra-expert-engine',
    });
  } catch (error: any) {
    console.error('Error in /api/ask-ai:', error);
    res.status(500).json({ success: false, error: error.message || 'Internal server error' });
  }
});

// Serve frontend in dev vs prod
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`BHUMITRA server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
