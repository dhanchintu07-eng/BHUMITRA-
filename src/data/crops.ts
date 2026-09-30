import { Crop, UserFarmingConditions } from '../types';

import wheatImg from '../assets/images/crop_wheat_harvest_1790413196832.jpg';
import riceImg from '../assets/images/crop_rice_paddy_1790413214797.jpg';
import cottonImg from '../assets/images/crop_cotton_field_1790413228500.jpg';

export const CROPS_DATA: Crop[] = [
  {
    id: 'wheat',
    name: 'Wheat',
    localNames: {
      hi: 'गेहूं (Gehun)',
      pa: 'ਕਣਕ (Kanak)',
      mr: 'गहू (Gahu)',
      te: 'గోధుమలు (Godhumalu)',
      ta: 'கோதுமை (Godhumai)',
      kn: 'ಗೋಧಿ (Godhi)',
    },
    category: 'Cereal / Food Grain',
    image: wheatImg,
    suitableSoils: ['loamy', 'clay', 'black'],
    suitableSeasons: ['rabi'],
    optimalRainfallMin: 350,
    optimalRainfallMax: 750,
    waterNeed: 'Medium (400 - 600 mm)',
    waterRequirementMm: '450 - 650 mm',
    waterNumericMm: 550,
    waterLevels: ['medium', 'high'],
    growingDuration: '110 - 130 days',
    growingDaysNumeric: 120,
    avgYieldPerAcre: '18 - 22 Quintals',
    irrigationStages: '4 - 6 critical irrigations: CRI stage (21 DAS), tillering, jointing, flowering, and grain milking.',
    soilDescription: 'Deep, fertile, well-drained loamy or clayey soils with neutral pH (6.0 - 7.5). Avoid heavy waterlogging.',
    farmingTip: 'Crown Root Initiation (CRI) at 20-25 days is the most sensitive stage. Missing CRI irrigation can cut yield by 25%.',
    marketDemand: 'Very High (Government MSP Procurement & Private Mills)',
    riskLevel: 'Low',
    pestAdvisory: 'Watch for yellow or brown rust during overcast winter days; spray Propiconazole 25 EC (1ml/L) if noticed.',
    nutrients: {
      nitrogen: 120,
      phosphorus: 60,
      potassium: 40,
      zinc: 25,
    },
    growthStages: [
      { stageName: 'Germination & CRI', days: 25, description: 'Crown root formation. First critical irrigation window.' },
      { stageName: 'Tillering & Jointing', days: 40, description: 'Rapid stalk elongation and shoot formation.' },
      { stageName: 'Flowering / Heading', days: 25, description: 'Spikelet emergence. Maintain soil moisture.' },
      { stageName: 'Grain Milking & Dough', days: 20, description: 'Nutrient transfer to grains.' },
      { stageName: 'Ripening / Maturity', days: 10, description: 'Golden heads dry out. Ready for harvest.' },
    ],
  },
  {
    id: 'rice',
    name: 'Paddy / Rice',
    localNames: {
      hi: 'धान / चावल (Dhan)',
      pa: 'ਝੋਨਾ / ਚੌਲ (Jhona)',
      mr: 'भात / तांदूळ (Bhat)',
      te: 'వరి (Vari)',
      ta: 'நெல் (Nel)',
      kn: 'ಭತ್ತ / ಅಕ್ಕಿ (Bhatta)',
    },
    category: 'Cereal / Staple Grain',
    image: riceImg,
    suitableSoils: ['clay', 'loamy', 'black'],
    suitableSeasons: ['kharif'],
    optimalRainfallMin: 1000,
    optimalRainfallMax: 1800,
    waterNeed: 'High (1000 - 1400 mm)',
    waterRequirementMm: '1100 - 1400 mm',
    waterNumericMm: 1250,
    waterLevels: ['high'],
    growingDuration: '115 - 140 days',
    growingDaysNumeric: 130,
    avgYieldPerAcre: '22 - 28 Quintals',
    irrigationStages: 'Maintain 2-5 cm standing water during early tillering and panicle development. Drain 10 days before harvest.',
    soilDescription: 'Heavy clay or clay-loam soils with high water holding capacity and slow percolation.',
    farmingTip: 'Adopt Alternate Wetting and Drying (AWD) or Direct Seeded Rice (DSR) to save 25-30% irrigation water without yield penalty.',
    marketDemand: 'Very High (Universal staple with steady demand)',
    riskLevel: 'Medium',
    pestAdvisory: 'Monitor yellow stem borer and bacterial leaf blight. Apply balanced Potash to strengthen plant cell walls.',
    nutrients: {
      nitrogen: 130,
      phosphorus: 50,
      potassium: 50,
      zinc: 20,
    },
    growthStages: [
      { stageName: 'Nursery & Transplanting', days: 25, description: 'Seedling establishment and transplanting in puddled field.' },
      { stageName: 'Active Tillering', days: 35, description: 'Formation of productive tillers with shallow standing water.' },
      { stageName: 'Panicle Initiation', days: 30, description: 'Flowering head formation inside the boot leaf.' },
      { stageName: 'Grain Filling', days: 25, description: 'Starch accumulation in paddy grains.' },
      { stageName: 'Maturity & Harvest', days: 15, description: 'Panicles turn golden yellow. Drain field.' },
    ],
  },
  {
    id: 'cotton',
    name: 'Cotton',
    localNames: {
      hi: 'कपास (Kapas)',
      pa: 'ਕਪਾਹ (Kapaah)',
      mr: 'कापूस (Kapoos)',
      te: 'పత్తి (Patthi)',
      ta: 'பருத்தி (Paruthi)',
      kn: 'ಹತ್ತಿ (Hatti)',
    },
    category: 'Commercial / Fiber',
    image: cottonImg,
    suitableSoils: ['black', 'loamy'],
    suitableSeasons: ['kharif'],
    optimalRainfallMin: 500,
    optimalRainfallMax: 900,
    waterNeed: 'Medium (500 - 750 mm)',
    waterRequirementMm: '600 - 800 mm',
    waterNumericMm: 700,
    waterLevels: ['medium', 'low'],
    growingDuration: '150 - 180 days',
    growingDaysNumeric: 165,
    avgYieldPerAcre: '8 - 12 Quintals',
    irrigationStages: '3 - 5 light irrigations at squaring, peak flowering, and boll swelling. Avoid wet soil during picking.',
    soilDescription: 'Deep black soil (Regur) rich in clay and montmorillonite minerals with superb moisture conservation.',
    farmingTip: 'Do not over-apply chemical nitrogen early on. Install yellow sticky traps and pheromone traps for pink bollworm monitoring.',
    marketDemand: 'High (Textile mills & export demand)',
    riskLevel: 'Medium',
    pestAdvisory: 'Spray 5% Neem Seed Kernel Extract (NSKE) at early vegetative stage against sucking pests (aphids, jassids).',
    nutrients: {
      nitrogen: 100,
      phosphorus: 50,
      potassium: 50,
      zinc: 15,
    },
    growthStages: [
      { stageName: 'Germination & Seedling', days: 25, description: 'Early root establishment and true leaf emergence.' },
      { stageName: 'Squaring (Bud Formation)', days: 40, description: 'First floral buds (squares) appear. Check for bollworm.' },
      { stageName: 'Flowering & Boll Setting', days: 45, description: 'White blossoms change to pink. Peak water requirement.' },
      { stageName: 'Boll Development & Burst', days: 40, description: 'Cotton bolls expand and open fluffy white fiber.' },
      { stageName: 'Picking Stage', days: 15, description: 'Manual picking of clean dry bolls in morning sun.' },
    ],
  },
  {
    id: 'ragi',
    name: 'Finger Millet / Ragi',
    localNames: {
      hi: 'मडुआ / रागी (Ragi)',
      pa: 'ਰਾਗੀ (Ragi)',
      mr: 'नाचणी (Nachani)',
      te: 'రాగులు (Ragulu)',
      ta: 'கேழ்வரகு / ரಾಗಿ (Kelvaragu)',
      kn: 'ರಾಗಿ (Ragi)',
    },
    category: 'Millet / Nutri-Cereal',
    suitableSoils: ['red', 'loamy', 'sandy', 'other'],
    suitableSeasons: ['kharif', 'rabi'],
    optimalRainfallMin: 350,
    optimalRainfallMax: 650,
    waterNeed: 'Low (300 - 450 mm)',
    waterRequirementMm: '300 - 450 mm',
    waterNumericMm: 380,
    waterLevels: ['low', 'medium'],
    growingDuration: '100 - 115 days',
    growingDaysNumeric: 108,
    avgYieldPerAcre: '14 - 18 Quintals',
    irrigationStages: '1 - 2 protective irrigations at tillering and flowering; predominantly rainfed.',
    soilDescription: 'Thrives in porous red soils, loams, and light soils with good surface drainage. Tolerates mild soil acidity.',
    farmingTip: 'Karnataka staple powerhouse. Highly calcium rich. Intercrop with Redgram (4:2 or 8:2 ratio) for risk reduction and nitrogen fixation.',
    marketDemand: 'Very High (Nutri-cereal mission & steady government MSP)',
    riskLevel: 'Very Low',
    pestAdvisory: 'Treat seeds with Carbendazim (2g/kg) to shield against blast disease. Blast-resistant varieties like GPU-28 or MR-1 perform best.',
    nutrients: {
      nitrogen: 60,
      phosphorus: 30,
      potassium: 30,
      zinc: 10,
    },
    growthStages: [
      { stageName: 'Seedling & Establishment', days: 20, description: 'Early root crown and shoot development.' },
      { stageName: 'Tillering', days: 30, description: 'Formation of multiple strong productive tillers.' },
      { stageName: 'Panicle Emergence', days: 25, description: 'Distinct finger-like head emergence.' },
      { stageName: 'Grain Hardening', days: 20, description: 'Seed grains turn reddish-brown.' },
      { stageName: 'Harvest & Threshing', days: 13, description: 'Cut ear-heads when lower leaves dry out.' },
    ],
  },
  {
    id: 'mustard',
    name: 'Mustard / Sarson',
    localNames: {
      hi: 'सरसों (Sarson)',
      pa: 'ਸਰ੍ਹੋਂ (Sarhon)',
      mr: 'मोहरी (Mohari)',
      te: 'ఆవాలు (Avalu)',
      ta: 'கடுகு (Kadugu)',
      kn: 'ಸಾಸಿವೆ (Sasive)',
    },
    category: 'Oilseed / Cash Crop',
    suitableSoils: ['sandy', 'loamy', 'black'],
    suitableSeasons: ['rabi'],
    optimalRainfallMin: 250,
    optimalRainfallMax: 450,
    waterNeed: 'Low (250 - 400 mm)',
    waterRequirementMm: '250 - 350 mm',
    waterNumericMm: 300,
    waterLevels: ['low', 'medium'],
    growingDuration: '100 - 120 days',
    growingDaysNumeric: 110,
    avgYieldPerAcre: '7 - 10 Quintals',
    irrigationStages: 'Only 2 - 3 irrigations needed: first at pre-flowering (30-35 DAS) and second at pod formation (60 DAS).',
    soilDescription: 'Light sandy loam to medium loam, well drained with moderate fertility.',
    farmingTip: 'Apply Sulphur @ 20 kg/ha along with basal fertilizer; sulphur directly boosts seed oil content by 2-3%.',
    marketDemand: 'High (Edible mustard oil demand)',
    riskLevel: 'Low',
    pestAdvisory: 'Watch for mustard aphid during cloudy winter periods. Spray Dimethoate 30 EC (1.5 ml/L) if aphid colonies appear.',
    nutrients: {
      nitrogen: 80,
      phosphorus: 40,
      potassium: 40,
      zinc: 15,
    },
    growthStages: [
      { stageName: 'Seedling Stage', days: 20, description: 'Cotyledon expansion and first true rosette leaves.' },
      { stageName: 'Vegetative & Branching', days: 30, description: 'Rapid branching. First irrigation at 30-35 DAS.' },
      { stageName: 'Bright Yellow Flowering', days: 25, description: 'Golden canopy flowers bloom. Bee pollination active.' },
      { stageName: 'Siliqua (Pod) Formation', days: 25, description: 'Seeds swell inside elongated pods.' },
      { stageName: 'Maturity & Harvest', days: 10, description: 'Pods turn light yellow-brown. Harvest before shattering.' },
    ],
  },
  {
    id: 'chickpea',
    name: 'Chickpea / Chana',
    localNames: {
      hi: 'चना (Chana)',
      pa: 'ਛੋਲੇ (Chhole)',
      mr: 'हरभरा (Harbhara)',
      te: 'శనగలు (Senagalu)',
      ta: 'கொண்டைக்கடலை (Kondakadalai)',
      kn: 'ಕಡಲೆ (Kadale)',
    },
    category: 'Pulse / Legume',
    suitableSoils: ['loamy', 'black', 'red', 'sandy'],
    suitableSeasons: ['rabi'],
    optimalRainfallMin: 300,
    optimalRainfallMax: 550,
    waterNeed: 'Low (250 - 400 mm)',
    waterRequirementMm: '250 - 400 mm',
    waterNumericMm: 320,
    waterLevels: ['low', 'medium'],
    growingDuration: '95 - 115 days',
    growingDaysNumeric: 105,
    avgYieldPerAcre: '8 - 11 Quintals',
    irrigationStages: '1 - 2 light irrigations: at pre-flowering branching and pod formation. Never flood during flowering.',
    soilDescription: 'Deep, well-aerated sandy loam to medium black soil. High root nodulation capability.',
    farmingTip: 'Nip terminal shoots at 30-35 days after sowing (nipping). This promotes massive lateral branching and more pods.',
    marketDemand: 'High (High protein dietary staple)',
    riskLevel: 'Low',
    pestAdvisory: 'Install pheromone traps for Helicoverpa pod borer. Intercrop with coriander or mustard to repel pests.',
    nutrients: {
      nitrogen: 20, // Fixes own nitrogen
      phosphorus: 50,
      potassium: 20,
      zinc: 10,
    },
    growthStages: [
      { stageName: 'Emergence', days: 15, description: 'Root nodule initiation starts.' },
      { stageName: 'Branching & Nipping', days: 30, description: 'Terminal tip nipping to boost pods.' },
      { stageName: 'Flowering', days: 25, description: 'Small papilionaceous flowers appear.' },
      { stageName: 'Pod Filling', days: 25, description: '1-2 seeds develop per green pod.' },
      { stageName: 'Maturity', days: 10, description: 'Leaves dry and shed. Pods rattle.' },
    ],
  },
  {
    id: 'maize',
    name: 'Maize / Corn',
    localNames: {
      hi: 'मक्का (Makka)',
      pa: 'ਮੱਕੀ (Makki)',
      mr: 'मका (Maka)',
      te: 'మొక్కజొన్న (Mokkajonna)',
      ta: 'மக்காச்சோளம் (Makkacholam)',
      kn: 'ಮೆಕ್ಕೆಜೋಳ (Mekkejola)',
    },
    category: 'Cereal / Multi-use Grain',
    suitableSoils: ['loamy', 'red', 'black'],
    suitableSeasons: ['kharif', 'rabi'],
    optimalRainfallMin: 500,
    optimalRainfallMax: 850,
    waterNeed: 'Medium (500 - 750 mm)',
    waterRequirementMm: '500 - 700 mm',
    waterNumericMm: 600,
    waterLevels: ['medium', 'high'],
    growingDuration: '90 - 110 days',
    growingDaysNumeric: 100,
    avgYieldPerAcre: '20 - 26 Quintals',
    irrigationStages: 'Crucial at knee-high stage, tasseling, silking, and soft dough stage.',
    soilDescription: 'Deep, fertile loamy soil with plenty of organic matter. Intolerant to standing water.',
    farmingTip: 'Sow on ridges with furrow irrigation. Apply Zinc Sulphate (10 kg/acre) to prevent white bud deficiency.',
    marketDemand: 'Very High (Poultry feed, starch & silage)',
    riskLevel: 'Low',
    pestAdvisory: 'Scout regularly for Fall Armyworm (FAW); apply neem-based sprays or Emamectin benzoate early in the leaf whorl.',
    nutrients: {
      nitrogen: 120,
      phosphorus: 60,
      potassium: 40,
      zinc: 25,
    },
    growthStages: [
      { stageName: 'Germination & Knee-High', days: 25, description: 'Fast vegetative growth. Ridge earthing up.' },
      { stageName: 'Tasseling (Male Flower)', days: 25, description: 'Pollen tassel emergence at top.' },
      { stageName: 'Silking & Fertilization', days: 20, description: 'Ear silk catches pollen. Critical water stage.' },
      { stageName: 'Milking & Dough Stage', days: 20, description: 'Kernels fill with sweet starch.' },
      { stageName: 'Dent & Harvest', days: 10, description: 'Black layer forms at kernel base. Ready.' },
    ],
  },
  {
    id: 'groundnut',
    name: 'Groundnut / Peanut',
    localNames: {
      hi: 'मूंगफली (Moongphali)',
      pa: 'ਮੂੰਗਫਲੀ (Mungphali)',
      mr: 'भुईमूग (Bhuimug)',
      te: 'వేరుశనగ (Verusanaga)',
      ta: 'வேர்க்கடலை (Verkadalai)',
      kn: 'ಕಡಲೆಕಾಯಿ (Kadale kaayi)',
    },
    category: 'Oilseed / Legume',
    suitableSoils: ['sandy', 'red', 'loamy'],
    suitableSeasons: ['kharif', 'zaid'],
    optimalRainfallMin: 450,
    optimalRainfallMax: 700,
    waterNeed: 'Medium (400 - 600 mm)',
    waterRequirementMm: '450 - 600 mm',
    waterNumericMm: 500,
    waterLevels: ['low', 'medium'],
    growingDuration: '105 - 120 days',
    growingDaysNumeric: 112,
    avgYieldPerAcre: '9 - 14 Quintals',
    irrigationStages: 'Moisture is essential during peg penetration (40-45 DAS) and pod swelling (65-75 DAS).',
    soilDescription: 'Light, loose, friable sandy loam or red soil that allows easy subterranean peg entry.',
    farmingTip: 'Apply Gypsum @ 200 kg/acre at 40-45 DAS. Calcium is crucial for solid pod kernel filling and reducing empty pods.',
    marketDemand: 'High (Edible oil, snacks, butter & export)',
    riskLevel: 'Medium',
    pestAdvisory: 'Spray Mancozeb (2g/L) if tikka circular leaf spots are seen on lower foliage.',
    nutrients: {
      nitrogen: 25,
      phosphorus: 50,
      potassium: 40,
      zinc: 15,
    },
    growthStages: [
      { stageName: 'Vegetative Growth', days: 25, description: 'Four-foliate leaves develop on spreading stems.' },
      { stageName: 'Yellow Flowering', days: 20, description: 'Self-pollinating flowers bloom on leaf axils.' },
      { stageName: 'Peg Penetration', days: 25, description: 'Pegs bend down and push 2-7cm under soil surface.' },
      { stageName: 'Underground Pod Filling', days: 30, description: 'Subterranean pods expand. Keep soil moist & loose.' },
      { stageName: 'Harvest Pulling', days: 12, description: 'Plants uprooted when pod interior turns dark.' },
    ],
  },
  {
    id: 'sugarcane',
    name: 'Sugarcane',
    localNames: {
      hi: 'गन्ना (Ganna)',
      pa: 'ਗੰਨਾ (Ganna)',
      mr: 'ऊस (Oos)',
      te: 'చెరకు (Cheraku)',
      ta: 'கரும்பு (Karumbu)',
      kn: 'ಕಬ್ಬು (Kabbu)',
    },
    category: 'Commercial / Cash Crop',
    suitableSoils: ['loamy', 'clay', 'black'],
    suitableSeasons: ['kharif', 'rabi'],
    optimalRainfallMin: 1100,
    optimalRainfallMax: 1900,
    waterNeed: 'High (1500 - 2200 mm)',
    waterRequirementMm: '1500 - 2000 mm',
    waterNumericMm: 1750,
    waterLevels: ['high'],
    growingDuration: '300 - 360 days',
    growingDaysNumeric: 330,
    avgYieldPerAcre: '350 - 450 Quintals',
    irrigationStages: '15 - 20 irrigations or drip irrigation scheduled every 3-5 days in dry spells.',
    soilDescription: 'Deep, fertile alluvial or clayey loam soils with neutral pH and excellent root depth.',
    farmingTip: 'Adopt drip fertigation and trash mulching between cane rows; cuts water usage by 45% and boosts cane thickness.',
    marketDemand: 'Assured (Sugar mills statutory fair & remunerative price)',
    riskLevel: 'Low',
    pestAdvisory: 'Intercrop with pulses like moong or cowpea during first 90 days to suppress weeds and early shoot borer.',
    nutrients: {
      nitrogen: 250,
      phosphorus: 100,
      potassium: 120,
      zinc: 30,
    },
    growthStages: [
      { stageName: 'Germination Phase', days: 40, description: 'Bud sprout and primary root emergence.' },
      { stageName: 'Tillering Phase', days: 80, description: 'Multiple cane stalks emerge from root stool.' },
      { stageName: 'Grand Growth Phase', days: 120, description: 'Rapid internode elongation and sugar storage.' },
      { stageName: 'Ripening & Maturation', days: 90, description: 'Sucrose concentration peaks in stalk juice.' },
    ],
  },
  {
    id: 'soybean',
    name: 'Soybean',
    localNames: {
      hi: 'सोयाबीन (Soyabean)',
      pa: 'ਸੋਇਆਬੀਨ (Soyabean)',
      mr: 'सोयाबीन (Soyabean)',
      te: 'సోయాబీన్ (Soyabean)',
      ta: 'சோயாபீன் (Soyabean)',
      kn: 'ಸೋಯಾಬೀನ್ (Soyabean)',
    },
    category: 'Oilseed / High Protein',
    suitableSoils: ['black', 'loamy'],
    suitableSeasons: ['kharif'],
    optimalRainfallMin: 600,
    optimalRainfallMax: 950,
    waterNeed: 'Medium (500 - 750 mm)',
    waterRequirementMm: '500 - 650 mm',
    waterNumericMm: 580,
    waterLevels: ['medium'],
    growingDuration: '90 - 105 days',
    growingDaysNumeric: 98,
    avgYieldPerAcre: '8 - 12 Quintals',
    irrigationStages: 'Predominantly rainfed; 1 critical supplemental irrigation if dry spell hits during pod development.',
    soilDescription: 'Medium to deep black soils with good drainage. Poorly tolerant to more than 24h waterlogging.',
    farmingTip: 'Treat seeds with Rhizobium culture and Trichoderma before sowing. Increases natural nitrogen nodules by 40%.',
    marketDemand: 'Very High (Animal feed & cooking oil processing)',
    riskLevel: 'Low',
    pestAdvisory: 'Set up yellow sticky traps to combat whitefly and girdle beetle. Maintain field perimeter cleanliness.',
    nutrients: {
      nitrogen: 30,
      phosphorus: 60,
      potassium: 40,
      zinc: 15,
    },
    growthStages: [
      { stageName: 'Seedling & Nodulation', days: 20, description: 'Nodule bacteria colonize root hairs.' },
      { stageName: 'Rapid Branching', days: 25, description: 'Trifoliate leaves form thick canopy.' },
      { stageName: 'Flowering', days: 20, description: 'Tiny purple/white blooms appear in clusters.' },
      { stageName: 'Pod & Seed Fill', days: 25, description: 'Hairy pods pack 2-3 nutritious beans.' },
      { stageName: 'Maturity', days: 8, description: 'Leaves yellow and drop; pods dry.' },
    ],
  },
  {
    id: 'moong',
    name: 'Green Gram / Moong',
    localNames: {
      hi: 'मूंग दाल (Moong Dal)',
      pa: 'ਮੂੰਗ (Moong)',
      mr: 'मूग (Moog)',
      te: 'పెసలు (Pesalu)',
      ta: 'பாசிப்பயறு (Pasipayaru)',
      kn: 'ಹೆಸರು ಕಾಳು (Hesaru Kaalu)',
    },
    category: 'Short-Duration Pulse',
    suitableSoils: ['loamy', 'sandy', 'black', 'red'],
    suitableSeasons: ['kharif', 'zaid'],
    optimalRainfallMin: 300,
    optimalRainfallMax: 550,
    waterNeed: 'Low (250 - 350 mm)',
    waterRequirementMm: '250 - 350 mm',
    waterNumericMm: 300,
    waterLevels: ['low', 'medium'],
    growingDuration: '60 - 75 days',
    growingDaysNumeric: 68,
    avgYieldPerAcre: '5 - 7 Quintals',
    irrigationStages: '2 - 3 light irrigations in summer Zaid; largely rainfed in Kharif.',
    soilDescription: 'Well-drained loam or sandy loam. Ideal short catch crop between major cropping seasons.',
    farmingTip: 'Short 65-day crop enriches farm soil with 35 kg biological nitrogen per hectare for the following crop.',
    marketDemand: 'High (Universal Indian kitchen dal)',
    riskLevel: 'Low',
    pestAdvisory: 'Select Yellow Mosaic Virus (YMV) resistant varieties like IPM 02-3 or Samrat.',
    nutrients: {
      nitrogen: 20,
      phosphorus: 40,
      potassium: 20,
      zinc: 10,
    },
    growthStages: [
      { stageName: 'Seedling', days: 12, description: 'Rapid uniform emergence.' },
      { stageName: 'Branching', days: 18, description: 'Bushy short plant structure.' },
      { stageName: 'Flowering', days: 15, description: 'Dense yellow flowers open.' },
      { stageName: 'Pod Filling', days: 15, description: 'Slender green pods mature into black.' },
      { stageName: 'Picking', days: 8, description: 'Multiple hand pickings or one-time harvest.' },
    ],
  },
  {
    id: 'bajra',
    name: 'Pearl Millet / Bajra',
    localNames: {
      hi: 'बाजरा (Bajra)',
      pa: 'ਬਾਜਰਾ (Bajra)',
      mr: 'बाजरी (Bajri)',
      te: 'ಸಜ್ಜೆ (Sajjalu)',
      ta: 'கம்பு (Kambu)',
      kn: 'ಸಜ್ಜೆ (Sajje)',
    },
    category: 'Millet / Climate Resilient',
    suitableSoils: ['sandy', 'red', 'other'],
    suitableSeasons: ['kharif'],
    optimalRainfallMin: 250,
    optimalRainfallMax: 500,
    waterNeed: 'Very Low (200 - 350 mm)',
    waterRequirementMm: '250 - 350 mm',
    waterNumericMm: 280,
    waterLevels: ['low'],
    growingDuration: '75 - 90 days',
    growingDaysNumeric: 82,
    avgYieldPerAcre: '12 - 16 Quintals',
    irrigationStages: '1 - 2 protective irrigations only in severe dry spells at flowering or grain milk stage.',
    soilDescription: 'Coarse sandy, gravelly, or red shallow soils. Withstands intense heat and arid conditions.',
    farmingTip: 'Extremely climate-resilient with very low input costs, delivering high net profitability even in arid zones.',
    marketDemand: 'Rising Rapidly (Nutri-cereal health food boom)',
    riskLevel: 'Very Low',
    pestAdvisory: 'Use hybrid certified seeds treated with Thiram/Carbendazim to shield against ergot and smut.',
    nutrients: {
      nitrogen: 60,
      phosphorus: 30,
      potassium: 30,
      zinc: 10,
    },
    growthStages: [
      { stageName: 'Vegetative Seedling', days: 20, description: 'Strong deep taproot goes down.' },
      { stageName: 'Tillering', days: 25, description: 'Dense tillers form with broad leaves.' },
      { stageName: 'Boot & Earhead Emergence', days: 20, description: 'Long cylindrical spike emerges.' },
      { stageName: 'Grain Hardening', days: 17, description: 'Greyish grains pack tightly on cob.' },
    ],
  },
  {
    id: 'watermelon',
    name: 'Watermelon',
    localNames: {
      hi: 'तरबूज (Tarbooj)',
      pa: 'ਹਦਵਾਣਾ (Hadwana)',
      mr: 'कलिंगड (Kalingad)',
      te: 'పుచ్చకాయ (Pucchakaya)',
      ta: 'தர்பூசணி (Tharboosani)',
      kn: 'ಕಲ್ಲಂಗಡಿ (Kallangadi)',
    },
    category: 'Horticulture / Fruit',
    suitableSoils: ['sandy', 'loamy'],
    suitableSeasons: ['zaid'],
    optimalRainfallMin: 200,
    optimalRainfallMax: 450,
    waterNeed: 'Medium (350 - 500 mm)',
    waterRequirementMm: '350 - 450 mm',
    waterNumericMm: 400,
    waterLevels: ['medium', 'high'],
    growingDuration: '80 - 100 days',
    growingDaysNumeric: 90,
    avgYieldPerAcre: '150 - 220 Quintals',
    irrigationStages: 'Light, regular drip irrigation. Cease irrigation 5-7 days prior to harvest to increase sugar sweetness.',
    soilDescription: 'Warm, highly porous sandy loam or riverbed sand with rapid water drainage.',
    farmingTip: 'Silver-black plastic mulching preserves moisture, halts weeds, and yields clean blemish-free melons.',
    marketDemand: 'Very High in Peak Summer Months',
    riskLevel: 'Medium',
    pestAdvisory: 'Install methyl eugenol fruit fly traps (4-6 traps/acre) to prevent fruit stinging and rotting.',
    nutrients: {
      nitrogen: 80,
      phosphorus: 50,
      potassium: 80,
      zinc: 10,
    },
    growthStages: [
      { stageName: 'Vine Spreading', days: 25, description: 'Vigorous tendril and vine creepers.' },
      { stageName: 'Male & Female Flowering', days: 20, description: 'Yellow blossoms pollinated by morning bees.' },
      { stageName: 'Fruit Swelling', days: 30, description: 'Melons gain weight and size rapidly.' },
      { stageName: 'Ripening & Sugar Build', days: 15, description: 'Tendril next to stem dries up; thumping dull sound.' },
    ],
  },
];

export function runCropRecommendationEngine(conditions: UserFarmingConditions) {
  const scored = CROPS_DATA.map((crop) => {
    let score = 50;
    const reasons: string[] = [];

    // 1. Soil match
    const userSoil = conditions.soilType.toLowerCase();
    if (crop.suitableSoils.includes(conditions.soilType)) {
      score += 25;
      reasons.push(`Optimal performance in ${conditions.soilType} soil.`);
    } else if (userSoil === 'other' || crop.suitableSoils.includes('loamy')) {
      score += 12;
      reasons.push(`Adaptable to ${conditions.soilType} with organic compost.`);
    } else {
      score -= 10;
    }

    // 2. Season match
    if (crop.suitableSeasons.includes(conditions.season)) {
      score += 25;
      reasons.push(`Ideal climate cycle during ${conditions.season.toUpperCase()} season.`);
    } else {
      score -= 20;
    }

    // 3. Water & Rainfall
    const rainfall = conditions.rainfall;
    const userWater = conditions.waterAvailability;

    if (crop.waterNeed.toLowerCase().includes('low') && (userWater === 'low' || rainfall < 500)) {
      score += 20;
      reasons.push(`Thrives under low water / rainfed conditions with high drought tolerance.`);
    } else if (crop.waterNeed.toLowerCase().includes('high')) {
      if (userWater === 'high' || rainfall >= 1000) {
        score += 20;
        reasons.push(`Abundant water supply fully satisfies high irrigation requirements.`);
      } else {
        score -= 22;
        reasons.push(`May experience moisture deficit without supplemental tube well irrigation.`);
      }
    } else {
      if (userWater !== 'low' || rainfall >= 450) {
        score += 15;
        reasons.push(`Balanced moisture needs match your regional rainfall and irrigation capacity.`);
      } else {
        score += 5;
      }
    }

    // Regional match bonus
    const loc = (conditions.location || '').toLowerCase();
    if (loc.includes('karnataka')) {
      if (['ragi', 'cotton', 'maize', 'sugarcane', 'groundnut'].includes(crop.id)) score += 10;
    } else if (loc.includes('punjab') || loc.includes('haryana') || loc.includes('uttar pradesh')) {
      if (['wheat', 'rice', 'mustard', 'sugarcane'].includes(crop.id)) score += 8;
    } else if (loc.includes('maharashtra') || loc.includes('gujarat') || loc.includes('madhya pradesh')) {
      if (['cotton', 'soybean', 'groundnut', 'chickpea'].includes(crop.id)) score += 8;
    } else if (loc.includes('rajasthan')) {
      if (['bajra', 'mustard', 'chickpea', 'moong'].includes(crop.id)) score += 10;
    } else if (loc.includes('tamil nadu') || loc.includes('andhra')) {
      if (['rice', 'maize', 'groundnut', 'cotton', 'ragi'].includes(crop.id)) score += 8;
    }

    const finalPercentage = Math.min(98, Math.max(62, Math.round(score)));

    return {
      ...crop,
      suitabilityPercentage: finalPercentage,
      matchReason: reasons.slice(0, 2).join(' ') || `Strong general agronomic match for current parameters.`,
    };
  });

  scored.sort((a, b) => (b.suitabilityPercentage || 0) - (a.suitabilityPercentage || 0));

  const topCrops = scored.slice(0, 3);
  const runnerUps = scored.slice(3, 6);

  return {
    topCrops,
    runnerUps,
  };
}
