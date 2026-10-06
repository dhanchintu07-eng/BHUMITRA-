export type FarmerProfileTag =
  | 'all'
  | 'small_marginal'
  | 'rainfed'
  | 'irrigation_drip'
  | 'millet_grower'
  | 'women_sc_st'
  | 'credit_insurance';

export interface GovernmentScheme {
  id: string;
  name: string;
  nameKn: string;
  nameHi: string;
  ministryOrState: string;
  applicableStates: string[]; // ['All India'] or specific states
  applicableCrops: string[]; // ['All Crops'] or crop ids
  maxLandHectares?: number; // undefined if open to all land sizes
  profileTags: FarmerProfileTag[];
  verifiedBenefit: string;
  verifiedBenefitKn: string;
  estimateRulePerAcre?: number; // Optional rupee estimate per acre for calculator (clearly marked as Estimate)
  estimateCapRupees?: number;
  eligibility: string[];
  documents: string[];
  howToApply: string[];
  officialLink: string;
  portalLabel: string;
  lastVerified: string;
  verificationType: 'Verified Statutory Benefit' | 'Verified Subsidy Guidelines (State-Adjusted Estimate)';
}

export const GOVERNMENT_SCHEMES: GovernmentScheme[] = [
  {
    id: 'pm-kisan',
    name: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
    nameKn: 'ಪಿಎಂ-ಕಿಸಾನ್ ಸಮ್ಮಾನ್ ನಿಧಿ (PM-KISAN)',
    nameHi: 'प्रधानमंत्री किसान सम्मान निधि (PM-KISAN)',
    ministryOrState: 'Ministry of Agriculture & Farmers Welfare, Govt. of India',
    applicableStates: ['All India'],
    applicableCrops: ['All Crops'],
    profileTags: ['all', 'small_marginal'],
    verifiedBenefit: '₹6,000 per year in 3 equal installments of ₹2,000 every 4 months via Direct Benefit Transfer (DBT).',
    verifiedBenefitKn: 'ವರ್ಷಕ್ಕೆ ₹6,000 ನೇರ ನಗದು ವರ್ಗಾವಣೆ (₹2,000 ರಂತೆ 3 ಕಂತುಗಳಲ್ಲಿ).',
    eligibility: [
      'All landholding farmer families with cultivable land in their name as per state revenue records.',
      'Excludes institutional landholders, income tax payees, and constitutional post holders.',
    ],
    documents: [
      'Aadhaar Card linked with active mobile number (e-KYC mandatory)',
      'Land Ownership Record / RTC (Pahani / Khatauni)',
      'NPCI / Aadhaar-seeded Bank Account Passbook',
    ],
    howToApply: [
      'Visit pmkisan.gov.in and click "New Farmer Registration" under Farmers Corner.',
      'Complete Aadhaar OTP e-KYC or biometric authentication at nearest CSC / Grama One center.',
      'Verify land seeding status with Village Accountant / Patwari.',
    ],
    officialLink: 'https://pmkisan.gov.in/',
    portalLabel: 'pmkisan.gov.in',
    lastVerified: 'Verified Official Guidelines · Oct 2026',
    verificationType: 'Verified Statutory Benefit',
  },
  {
    id: 'pmfby-crop-insurance',
    name: 'PMFBY (Pradhan Mantri Fasal Bima Yojana)',
    nameKn: 'ಪ್ರಧಾನ ಮಂತ್ರಿ ಫಸಲ್ ಬಿಮಾ ಯೋಜನೆ (ಬೆಳೆ ವಿಮೆ)',
    nameHi: 'प्रधानमंत्री फसल बीमा योजना (PMFBY)',
    ministryOrState: 'Ministry of Agriculture & Farmers Welfare, Govt. of India',
    applicableStates: ['All India'],
    applicableCrops: ['wheat', 'rice', 'cotton', 'ragi', 'maize', 'groundnut', 'soybean', 'mustard', 'chickpea', 'bajra', 'moong'],
    profileTags: ['all', 'rainfed', 'credit_insurance'],
    verifiedBenefit:
      'Comprehensive harvest & weather risk insurance. Farmer pays fixed low premium: 2% for Kharif crops, 1.5% for Rabi crops, and 5% for commercial/horticultural crops; Government subsidizes the remaining actuarial premium.',
    verifiedBenefitKn:
      'ಕಡಿಮೆ ವಿಮಾ ಕಂತು: ಮುಂಗಾರು ಬೆಳೆಗೆ ಶೇ. 2, ಹಿಂಗಾರು ಬೆಳೆಗೆ ಶೇ. 1.5 ಮತ್ತು ವಾಣಿಜ್ಯ ಬೆಳೆಗೆ ಶೇ. 5 ಮಾತ್ರ. ಪ್ರಕೃತಿ ವಿಕೋಪದಿಂದ ಬೆಳೆ ನಷ್ಟವಾದರೆ ಪೂರ್ಣ ವಿಮಾ ಪರಿಹಾರ.',
    estimateRulePerAcre: 18000,
    estimateCapRupees: 180000,
    eligibility: [
      'All farmers (owner-cultivators and notified tenant/sharecroppers) growing notified crops in notified insurance units.',
      'Voluntary for both loanee (KCC) and non-loanee farmers.',
    ],
    documents: [
      'Aadhaar Card & Bank Account Passbook',
      'Land Possession Certificate / RTC (Pahani) with Crop Sowing Declaration',
      'Tenant Agreement (if applicable under state notification)',
    ],
    howToApply: [
      'Apply online at pmfby.gov.in (or Samrakshane portal in Karnataka) before seasonal cut-off date.',
      'Alternatively enroll via your KCC Bank branch, CSC center, or Crop Insurance App.',
      'Report localized hailstorm/inundation loss within 72 hours via the Crop Insurance App or helpline 14447.',
    ],
    officialLink: 'https://pmfby.gov.in/',
    portalLabel: 'pmfby.gov.in',
    lastVerified: 'Verified Official Guidelines · Oct 2026',
    verificationType: 'Verified Statutory Benefit',
  },
  {
    id: 'pmksy-per-drop-more-crop',
    name: 'PMKSY — Per Drop More Crop (Micro-Irrigation Subsidy)',
    nameKn: 'ಪ್ರಧಾನ ಮಂತ್ರಿ ಕೃಷಿ ಸಿಂಚಾಯಿ ಯೋಜನೆ (ಹನಿ / ತುಂತುರು ನೀರಾವರಿ ಸಹಾಯಧನ)',
    nameHi: 'प्रधानमंत्री कृषि सिंचाई योजना (ड्रिप / स्प्रिंकलर सब्सिडी)',
    ministryOrState: 'Department of Agriculture & State Horticulture/Agri Departments',
    applicableStates: ['All India'],
    applicableCrops: ['All Crops', 'cotton', 'sugarcane', 'groundnut', 'maize', 'watermelon', 'wheat', 'ragi'],
    profileTags: ['all', 'small_marginal', 'irrigation_drip', 'women_sc_st'],
    verifiedBenefit:
      'Central + State capital subsidy of 55% for Small & Marginal farmers and 45% for Other farmers on BIS-certified Drip & Sprinkler systems (topped up to 75%–90% in states like Karnataka, Maharashtra, AP, and TN for SC/ST & smallholders).',
    verifiedBenefitKn:
      'ಹನಿ ಮತ್ತು ತುಂತುರು ನೀರಾವರಿ ಅಳವಡಿಕೆಗೆ ಸಣ್ಣ/ಅತಿ ಸಣ್ಣ ರೈತರಿಗೆ ಶೇ. 55 ರಿಂದ ಶೇ. 90 ರವರೆಗೆ (ರಾಜ್ಯ ಟಾಪ್-ಅಪ್ ಸೇರಿ) ಸಹಾಯಧನ.',
    estimateRulePerAcre: 22000,
    estimateCapRupees: 110000,
    eligibility: [
      'Farmers owning agricultural land with an assured water source (borewell, open well, farm pond, or canal lift).',
      'Subsidy ceiling typically applies up to 5 Hectares per beneficiary family.',
    ],
    documents: [
      'RTC / 7-12 Extract / Land Record showing crop & water source',
      'Aadhaar Card & Bank Passbook',
      'Soil & Water Test Report + Quotation from empanelled BIS micro-irrigation vendor',
      'Caste Certificate (if claiming 80–90% SC/ST special state subsidy)',
    ],
    howToApply: [
      'Register on your State Micro-Irrigation Portal or Raitha Samparka Kendra (RSK) / Block Agriculture Office.',
      'Select an empanelled BIS drip/sprinkler manufacturer for field layout survey.',
      'After physical inspection and geo-tagging of installed drip lines, subsidy is credited via DBT.',
    ],
    officialLink: 'https://pmksy.gov.in/',
    portalLabel: 'pmksy.gov.in',
    lastVerified: 'Verified Official Guidelines · Oct 2026',
    verificationType: 'Verified Subsidy Guidelines (State-Adjusted Estimate)',
  },
  {
    id: 'kisan-credit-card',
    name: 'Kisan Credit Card (KCC) — Modified Interest Subvention Scheme',
    nameKn: 'ಕಿಸಾನ್ ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್ (KCC) — ರಿಯಾಯಿತಿ ಬಡ್ಡಿ ಬೆಳೆ ಸಾಲ',
    nameHi: 'किसान क्रेडिट कार्ड (KCC) — 4% ब्याज सब्सिडी ऋण',
    ministryOrState: 'NABARD / Reserve Bank of India / Ministry of Agriculture',
    applicableStates: ['All India'],
    applicableCrops: ['All Crops'],
    profileTags: ['all', 'credit_insurance', 'small_marginal'],
    verifiedBenefit:
      'Short-term crop & allied working capital loan up to ₹3 Lakh at 7% p.a. with a 3% prompt repayment incentive — resulting in an effective interest rate of just 4% p.a. Collateral-free loan limit up to ₹1.60 Lakh (enhanced to ₹2 Lakh per RBI guidelines).',
    verifiedBenefitKn:
      '₹3 ಲಕ್ಷದವರೆಗೆ ಅಲ್ಪಾವಧಿ ಬೆಳೆ ಸಾಲ. ಸಕಾಲದಲ್ಲಿ ಮರುಪಾವತಿಸಿದರೆ ಕೇವಲ ಶೇ. 4 ರ ಪರಿಣಾಮಕಾರಿ ಬಡ್ಡಿದರ.',
    estimateRulePerAcre: 35000,
    estimateCapRupees: 300000,
    eligibility: [
      'Individual or joint owner-cultivators, tenant farmers, oral lessees, and Self-Help Groups (SHGs).',
      'Also covers Animal Husbandry and Fisheries working capital up to ₹2 Lakh.',
    ],
    documents: [
      'Completed KCC Application Form',
      'Aadhaar Card, PAN Card & Passport-size photos',
      'Land RTC / Pahani / Khatauni showing acreage and cropping pattern',
    ],
    howToApply: [
      'Apply via JanSamarth Portal, pmkisan.gov.in (Download KCC Form), or visit any Scheduled Commercial, Regional Rural (RRB), or Cooperative Bank.',
      'Bank verifies Scale of Finance fixed by the District Level Technical Committee (DLTC) for your crop.',
    ],
    officialLink: 'https://www.myscheme.gov.in/schemes/kcc',
    portalLabel: 'myscheme.gov.in/schemes/kcc',
    lastVerified: 'Verified Official Guidelines · Oct 2026',
    verificationType: 'Verified Statutory Benefit',
  },
  {
    id: 'karnataka-krishi-bhagya',
    name: 'Karnataka Krishi Bhagya Scheme (Farm Pond & Rainfed Package)',
    nameKn: 'ಕರ್ನಾಟಕ ಕೃಷಿ ಭಾಗ್ಯ ಯೋಜನೆ (ಕೃಷಿ ಹೊಂಡ ಮತ್ತು ಮಳೆ ಆಶ್ರಿತ ಪ್ಯಾಕೇಜ್)',
    nameHi: 'कर्नाटक कृषि भाग्य योजना (फार्म पॉन्ड एवं वर्षा आधारित पैकेज)',
    ministryOrState: 'Department of Agriculture, Govt. of Karnataka (Raitamitra)',
    applicableStates: ['Karnataka'],
    applicableCrops: ['ragi', 'maize', 'groundnut', 'cotton', 'chickpea', 'bajra', 'moong'],
    profileTags: ['all', 'rainfed', 'small_marginal', 'irrigation_drip', 'women_sc_st'],
    verifiedBenefit:
      '80% to 90% package subsidy for rainfed farmers covering: 1) Construction of Farm Pond (Krishi Honda), 2) Polythene lining to prevent seepage, 3) Diesel/Solar pump set (up to 5 HP), and 4) Micro-irrigation sprinkler/drip distribution.',
    verifiedBenefitKn:
      'ಮಳೆ ಆಶ್ರಿತ ರೈತರಿಗೆ ಕೃಷಿ ಹೊಂಡ ನಿರ್ಮಾಣ, ಪಾಲಿಥೀನ್ ಹೊದಿಕೆ, ಪಂಪ್ ಸೆಟ್ ಮತ್ತು ತುಂತುರು ನೀರಾವರಿಗೆ ಶೇ. 80 ರಿಂದ ಶೇ. 90 ರವರೆಗೆ ಸಹಾಯಧನ.',
    estimateRulePerAcre: 28000,
    estimateCapRupees: 145000,
    eligibility: [
      'Dryland / rainfed farmers in eligible taluks of Karnataka possessing at least 1 Acre of contiguous cultivable land.',
      'Farmer must have FRUITS ID (Farmer Registration and Unified Beneficiary Information System).',
    ],
    documents: [
      'Karnataka FRUITS ID & Aadhaar Card',
      'Current Year Pahani (RTC) & Mutation Copy',
      'Bank Account linked with Aadhaar (DBT enabled)',
      'Caste Certificate (for 90% SC/ST subsidy tier)',
    ],
    howToApply: [
      'Visit your hobli-level Raitha Samparka Kendra (RSK) with your FRUITS ID and RTC.',
      'Agricultural Officer conducts site GPS inspection for farm pond feasibility.',
      'Check status and guidelines on raitamitra.karnataka.gov.in.',
    ],
    officialLink: 'https://raitamitra.karnataka.gov.in/',
    portalLabel: 'raitamitra.karnataka.gov.in',
    lastVerified: 'Verified State Scheme · Oct 2026',
    verificationType: 'Verified Subsidy Guidelines (State-Adjusted Estimate)',
  },
  {
    id: 'nfsm-shree-anna-millets',
    name: 'NFSM — Shree Anna (Nutri-Cereal / Millet Promotion & Seed Mini-Kits)',
    nameKn: 'ರಾಷ್ಟ್ರೀಯ ಆಹಾರ ಭದ್ರತಾ ಅಭಿಯಾನ — ಶ್ರೀ ಅನ್ನ (ಸಿರಿಧಾನ್ಯ / ರಾಗಿ ಉತ್ತೇಜನ)',
    nameHi: 'राष्ट्रीय खाद्य सुरक्षा मिशन — श्री अन्न (मोटे अनाज / मिलेट प्रोत्साहन)',
    ministryOrState: 'Ministry of Agriculture & State Millet Missions',
    applicableStates: ['All India', 'Karnataka', 'Rajasthan', 'Maharashtra', 'Tamil Nadu', 'Andhra Pradesh'],
    applicableCrops: ['ragi', 'bajra', 'maize', 'chickpea', 'moong'],
    profileTags: ['all', 'millet_grower', 'rainfed', 'small_marginal'],
    verifiedBenefit:
      'Free certified high-yielding Millet/Pulse Seed Mini-Kits, ₹3,000–₹4,000/hectare cluster demonstration input assistance (bio-fertilizers, micronutrients, neem oil), plus assured MSP procurement registration for Ragi & Bajra.',
    verifiedBenefitKn:
      'ಪ್ರಮಾಣಿತ ರಾಗಿ/ಸಿರಿಧಾನ್ಯ ಬೀಜದ ಕಿಟ್ ವಿತರಣೆ, ಹೆಕ್ಟೇರ್‌ಗೆ ₹3,000–₹4,000 ಪ್ರಾತ್ಯಕ್ಷಿಕೆ ಇನ್‌ಪುಟ್ ಸಹಾಯಧನ ಮತ್ತು ಬೆಂಬಲ ಬೆಲೆ (MSP) ಖರೀದಿ ನೋಂದಣಿ.',
    estimateRulePerAcre: 1600,
    estimateCapRupees: 10000,
    eligibility: [
      'Farmers cultivating Nutri-Cereals (Ragi, Bajra, Jowar, Minor Millets) or Pulses (Chickpea, Moong).',
      'Priority to smallholders, women farmers, and FPO members.',
    ],
    documents: [
      'Aadhaar Card & State Farmer ID (e.g. FRUITS / Agristack ID)',
      'Land Record (RTC / 7-12) showing seasonal sowing',
      'Bank Passbook for DBT incentive transfer',
    ],
    howToApply: [
      'Contact local Krishi Vigyan Kendra (KVK), Raitha Samparka Kendra, or District Agriculture Office prior to Kharif/Rabi sowing.',
      'For MSP sales, register crop details during procurement window at state procurement centers.',
    ],
    officialLink: 'https://nfsm.gov.in/',
    portalLabel: 'nfsm.gov.in',
    lastVerified: 'Verified Official Guidelines · Oct 2026',
    verificationType: 'Verified Subsidy Guidelines (State-Adjusted Estimate)',
  },
  {
    id: 'pm-kusum-solar-pump',
    name: 'PM-KUSUM (Component-B Standalone Solar Agriculture Pump)',
    nameKn: 'ಪಿಎಂ-ಕುಸುಮ್ ಯೋಜನೆ (ಸೌರಶಕ್ತಿ ಕೃಷಿ ಪಂಪ್ ಸೆಟ್ ಸಹಾಯಧನ)',
    nameHi: 'पीएम-कुसुम योजना (सोलर कृषि पंप सब्सिडी)',
    ministryOrState: 'Ministry of New and Renewable Energy (MNRE), Govt. of India',
    applicableStates: ['All India'],
    applicableCrops: ['All Crops'],
    profileTags: ['all', 'irrigation_drip', 'rainfed'],
    verifiedBenefit:
      '60% total government subsidy (30% Central + minimum 30% State) on standalone solar water pumps up to 7.5 HP. Bank loan covers 30%, so farmer pays only 10% upfront margin.',
    verifiedBenefitKn:
      '7.5 HP ವರೆಗಿನ ಸೋಲಾರ್ ಕೃಷಿ ಪಂಪ್ ಸೆಟ್ ಅಳವಡಿಕೆಗೆ ಶೇ. 60 ರಷ್ಟು ಸರ್ಕಾರಿ ಸಹಾಯಧನ (ಕೇಂದ್ರ ಶೇ. 30 + ರಾಜ್ಯ ಶೇ. 30).',
    estimateRulePerAcre: 30000,
    estimateCapRupees: 165000,
    eligibility: [
      'Individual farmers, water user associations, and FPOs in off-grid or diesel-pump dependent areas.',
      'Must commit to water-saving micro-irrigation where mandated by state nodal agency.',
    ],
    documents: [
      'Aadhaar Card & Land Ownership RTC / Khasra',
      'Water source certificate (Borewell / Open well / Farm pond)',
      'Bank Account details & No-Grid-Pump declaration',
    ],
    howToApply: [
      'Apply ONLY on the official MNRE portal pmkusum.mnre.gov.in or your designated State Renewable Energy Agency (e.g., KREDL in Karnataka, MEDA in Maharashtra).',
      'Beware of fake private websites demanding upfront registration fees.',
    ],
    officialLink: 'https://pmkusum.mnre.gov.in/',
    portalLabel: 'pmkusum.mnre.gov.in',
    lastVerified: 'Verified Official Guidelines · Oct 2026',
    verificationType: 'Verified Statutory Benefit',
  },
];
