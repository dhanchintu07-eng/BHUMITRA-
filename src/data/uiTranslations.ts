import { LanguageCode } from '../types';

export interface GlobalUIDictionary {
  // Brand & Companion Banner
  trustedCompanionBadge: string;
  taglineMain: string;
  voiceFirstHint: string;
  tapToSpeakBtn: string;
  listeningNow: string;
  listenBtn: string;
  stopBtn: string;
  listenFullPageBtn: string;

  // Navigation Tabs
  nav: {
    home: string;
    news: string;
    apmc: string;
    wizard: string;
    results: string;
    schemes: string;
    charts: string;
    compare: string;
    helpdesk: string;
    ask: string;
    saved: string;
  };

  // Today in Agriculture (Daily News)
  news: {
    badge: string;
    title: string;
    subtitle: string;
    listenBulletinBtn: string;
    refreshLiveBtn: string;
    refreshingBtn: string;
    searchPlaceholder: string;
    voiceSearchBtn: string;
    whyItMattersLabel: string;
    sourceLabel: string;
    verifiedDateLabel: string;
    askAiAboutNewsBtn: string;
    readSourceBtn: string;
    liveSearchGroundedBadge: string;
    verifiedOfficialBadge: string;
    categories: {
      all: string;
      rainfall: string;
      government: string;
      markets: string;
      crops: string;
      technology: string;
      schemes: string;
    };
  };

  // APMC Market Intelligence
  apmc: {
    badge: string;
    title: string;
    subtitle: string;
    marketMoversTitle: string;
    marketMoversSub: string;
    risingLabel: string;
    fallingLabel: string;
    stableLabel: string;
    filterState: string;
    filterDistrict: string;
    filterMandi: string;
    filterCrop: string;
    allStates: string;
    allDistricts: string;
    allMandis: string;
    allCrops: string;
    modalPriceLabel: string;
    minPriceLabel: string;
    maxPriceLabel: string;
    mspFloorLabel: string;
    suitabilityMatchLabel: string;
    aboveMspTag: string;
    belowMspTag: string;
    listenPriceBtn: string;
    askAiMarketBtn: string;
    verifyGoogleSearchBtn: string;
    verifyingGoogleSearchBtn: string;
    liveWebGroundingTitle: string;
  };

  // Scheme Saathi
  schemes: {
    badge: string;
    title: string;
    subtitle: string;
    listenSchemeBtn: string;
    benefitLabel: string;
    eligibilityLabel: string;
    documentsLabel: string;
    howToApplyLabel: string;
    officialPortalBtn: string;
    askAiSchemeBtn: string;
  };

  // BHUMITRA AI
  ai: {
    badge: string;
    title: string;
    subtitle: string;
    searchGroundedActive: string;
    contextualMemoryActive: string;
    autoSpeakLabel: string;
    tapMicPrompt: string;
    webSourcesLabel: string;
    platformSourcesLabel: string;
    clarificationTitle: string;
    keyActionsTitle: string;
  };
}

const EN_UI: GlobalUIDictionary = {
  trustedCompanionBadge: 'Trusted AI Farming Companion in Every Farmer’s Pocket',
  taglineMain: 'Know the Market. Choose the Crop. Grow Smarter.',
  voiceFirstHint: 'Voice-First Platform: Tap 🔊 to Listen or 🎙️ to Speak in Your Language',
  tapToSpeakBtn: 'Speak Question 🎙️',
  listeningNow: 'Listening... Speak Now',
  listenBtn: 'Listen 🔊',
  stopBtn: 'Stop ⏹️',
  listenFullPageBtn: 'Listen to Summary 🔊',
  nav: {
    home: 'Home',
    news: 'Today in Agri News',
    apmc: 'Mandi / APMC Prices',
    wizard: 'Crop Finder',
    results: 'Best Crops',
    schemes: 'Scheme Saathi',
    charts: 'NPK Charts',
    compare: 'Compare',
    helpdesk: 'Crop Doctor',
    ask: 'BHUMITRA AI',
    saved: 'My Plans',
  },
  news: {
    badge: 'DAILY AGRICULTURE NEWS • GOOGLE SEARCH GROUNDED',
    title: 'Today in Agriculture',
    subtitle:
      'Fresh India-focused agriculture news covering rainfall, government decisions, APMC markets, crops, schemes, and farming technology — verified with live sources.',
    listenBulletinBtn: 'Listen to Today’s News Bulletin 🔊',
    refreshLiveBtn: 'Fetch Latest Live Web News (Google Search)',
    refreshingBtn: 'Searching Live India Agri News...',
    searchPlaceholder: 'Search news by crop, rainfall, MSP, scheme...',
    voiceSearchBtn: 'Voice Search 🎙️',
    whyItMattersLabel: 'Why It Matters to Farmers',
    sourceLabel: 'Verified Source',
    verifiedDateLabel: 'Published / Verified',
    askAiAboutNewsBtn: 'Ask BHUMITRA AI How This Affects My Farm',
    readSourceBtn: 'Official Source',
    liveSearchGroundedBadge: 'Live Google Search Grounded',
    verifiedOfficialBadge: 'Verified PIB / ICAR / IMD Bulletin',
    categories: {
      all: 'All Updates',
      rainfall: '🌧️ Rainfall & Weather',
      government: '🏛️ Govt Decisions & MSP',
      markets: '📈 Markets & Trade',
      crops: '🌾 Crops & Pest Advisory',
      technology: '🚜 Agri-Technology',
      schemes: '📋 Subsidies & Schemes',
    },
  },
  apmc: {
    badge: 'OFFICIAL AGMARKNET / e-NAM & MSP BENCHMARKS',
    title: 'Mandi / APMC Market Intelligence',
    subtitle:
      'Compare latest crop modal prices, minimum/maximum ranges, and price trends (📈 Rising, ➡️ Stable, 📉 Falling) alongside your land suitability.',
    marketMoversTitle: 'Notable Market Movements & Farmer Opportunities',
    marketMoversSub: 'Instant snapshot of 📈 Rising, ➡️ Stable, and 📉 Falling crops across APMCs',
    risingLabel: '📈 Rising Price',
    fallingLabel: '📉 Falling Price',
    stableLabel: '➡️ Stable Trend',
    filterState: '1. Select State',
    filterDistrict: '2. Select District',
    filterMandi: '3. Select APMC / Mandi',
    filterCrop: '4. Select Crop / Commodity',
    allStates: 'All States (India)',
    allDistricts: 'All Districts',
    allMandis: 'All APMC Mandis',
    allCrops: 'All Crops / Commodities',
    modalPriceLabel: 'Latest Modal Price',
    minPriceLabel: 'Minimum',
    maxPriceLabel: 'Maximum',
    mspFloorLabel: 'Govt MSP Floor',
    suitabilityMatchLabel: 'Your Land Match',
    aboveMspTag: 'Trading Above MSP',
    belowMspTag: 'Below MSP — Use Govt Procurement',
    listenPriceBtn: 'Listen Price 🔊',
    askAiMarketBtn: 'Ask AI Selling Advice',
    verifyGoogleSearchBtn: 'Live Google Search Mandi Check',
    verifyingGoogleSearchBtn: 'Checking Live Web Mandi Rates...',
    liveWebGroundingTitle: 'Live Google Search Grounded Market Intelligence',
  },
  schemes: {
    badge: 'OFFICIAL CENTRAL & STATE AGRICULTURAL SCHEMES',
    title: 'Scheme Saathi — Government Scheme Finder',
    subtitle:
      'Find verified subsidies, crop insurance, solar pumps, and direct income support tailored to your state, crop, and land size.',
    listenSchemeBtn: 'Listen Scheme Details 🔊',
    benefitLabel: 'Verified Benefit',
    eligibilityLabel: 'Eligibility Criteria',
    documentsLabel: 'Required Documents',
    howToApplyLabel: 'How to Apply Step-by-Step',
    officialPortalBtn: 'Visit Official Govt Portal',
    askAiSchemeBtn: 'Ask AI How to Apply',
  },
  ai: {
    badge: 'GOOGLE SEARCH GROUNDED • MULTILINGUAL VOICE AI',
    title: 'BHUMITRA AI — Trusted Farming Companion',
    subtitle:
      'Ask by voice 🎙️ or text in Kannada, Hindi, or English. Connected to live Google Search, APMC prices, Crop Suitability, Scheme Saathi, and Today’s News.',
    searchGroundedActive: 'Google Search Grounding Active',
    contextualMemoryActive: 'Contextual Memory Active',
    autoSpeakLabel: 'Auto-Read AI Answers Aloud 🔊',
    tapMicPrompt: 'Tap Microphone to Speak in Your Language',
    webSourcesLabel: 'Live Google Search Grounded Sources',
    platformSourcesLabel: 'BHUMITRA Verified Dataset Citations',
    clarificationTitle: 'Quick Clarification to Help You Better',
    keyActionsTitle: 'Actionable Steps for Your Farm',
  },
};

const KN_UI: GlobalUIDictionary = {
  trustedCompanionBadge: 'ಪ್ರತಿ ರೈತನ ಜೇಬಿನಲ್ಲಿರುವ ನಂಬಿಕಸ್ಥ AI ಕೃಷಿ ಒಡನಾಡಿ',
  taglineMain: 'ಮಾರುಕಟ್ಟೆ ಅರಿಯಿರಿ. ಸೂಕ್ತ ಬೆಳೆ ಆಯ್ಕೆಮಾಡಿ. ಸ್ಮಾರ್ಟ್ ಆಗಿ ಬೆಳೆಯಿರಿ.',
  voiceFirstHint: 'ಧ್ವನಿ-ಮೊದಲ ವೇದಿಕೆ: ಕೇಳಲು 🔊 ಒತ್ತಿರಿ ಅಥವಾ ಕನ್ನಡದಲ್ಲಿ ಮಾತನಾಡಲು 🎙️ ಒತ್ತಿರಿ',
  tapToSpeakBtn: 'ಧ್ವನಿಯಲ್ಲಿ ಕೇಳಿ 🎙️',
  listeningNow: 'ಆಲಿಸಲಾಗುತ್ತಿದೆ... ಈಗ ಮಾತನಾಡಿ',
  listenBtn: 'ಆಲಿಸಿ 🔊',
  stopBtn: 'ನಿಲ್ಲಿಸಿ ⏹️',
  listenFullPageBtn: 'ಸಾರಾಂಶ ಆಲಿಸಿ 🔊',
  nav: {
    home: 'ಮುಖಪುಟ',
    news: 'ಇಂದಿನ ಕೃಷಿ ಸುದ್ದಿ',
    apmc: 'ಎಪಿಎಂಸಿ / ಮಂಡಿ ಬೆಲೆ',
    wizard: 'ಬೆಳೆ ಶೋಧಕ',
    results: 'ಶಿಫಾರಸು ಬೆಳೆ',
    schemes: 'ಸ್ಕೀಮ್ ಸಾಥಿ (ಯೋಜನೆ)',
    charts: 'NPK ಚಾರ್ಟ್',
    compare: 'ಹೋಲಿಕೆ',
    helpdesk: 'ಬೆಳೆ ವೈದ್ಯ',
    ask: 'ಭೂಮಿತ್ರ AI',
    saved: 'ನನ್ನ ಯೋಜನೆ',
  },
  news: {
    badge: 'ದೈನಂದಿನ ಕೃಷಿ ಸುದ್ದಿ • ಗೂಗಲ್ ಸರ್ಚ್ ಆಧಾರಿತ',
    title: 'ಇಂದಿನ ಕೃಷಿ ಜಗತ್ತು (Today in Agriculture)',
    subtitle:
      'ಮಳೆ ಮಾಹಿತಿ, ಸರ್ಕಾರಿ ನಿರ್ಧಾರಗಳು, ಎಪಿಎಂಸಿ ಮಾರುಕಟ್ಟೆ ಧಾರಣೆ, ಬೆಳೆ ಸಲಹೆ ಮತ್ತು ಕೃಷಿ ತಂತ್ರಜ್ಞಾನದ ಇಂದಿನ ಪ್ರಮುಖ ಸುದ್ದಿಗಳು.',
    listenBulletinBtn: 'ಇಂದಿನ ಸಂಪೂರ್ಣ ಕೃಷಿ ವಾರ್ತೆ ಆಲಿಸಿ 🔊',
    refreshLiveBtn: 'ತಾಜಾ ನೇರ ಸುದ್ದಿ ಪಡೆಯಿರಿ (Google Search)',
    refreshingBtn: 'ತಾಜಾ ಕೃಷಿ ಸುದ್ದಿ ಹುಡುಕಲಾಗುತ್ತಿದೆ...',
    searchPlaceholder: 'ಬೆಳೆ, ಮಳೆ, ಬೆಂಬಲ ಬೆಲೆ (MSP), ಯೋಜನೆ ಕುರಿತು ಹುಡುಕಿ...',
    voiceSearchBtn: 'ಧ್ವನಿ ಹುಡುಕಾಟ 🎙️',
    whyItMattersLabel: 'ಇದು ರೈತರಿಗೆ ಏಕೆ ಮುಖ್ಯ?',
    sourceLabel: 'ದೃಢೀಕೃತ ಮೂಲ',
    verifiedDateLabel: 'ಪ್ರಕಟಿತ ದಿನಾಂಕ',
    askAiAboutNewsBtn: 'ಈ ಸುದ್ದಿಯ ಬಗ್ಗೆ ಭೂಮಿತ್ರ AI ಕೇಳಿ',
    readSourceBtn: 'ಅಧಿಕೃತ ಲಿಂಕ್',
    liveSearchGroundedBadge: 'ಗೂಗಲ್ ಸರ್ಚ್ ನೇರ ಮಾಹಿತಿ',
    verifiedOfficialBadge: 'ದೃಢೀಕೃತ PIB / ICAR / IMD ಪ್ರಕಟಣೆ',
    categories: {
      all: 'ಎಲ್ಲಾ ಸುದ್ದಿಗಳು',
      rainfall: '🌧️ ಮಳೆ ಮತ್ತು ಹವಾಮಾನ',
      government: '🏛️ ಸರ್ಕಾರಿ ನಿರ್ಧಾರ & MSP',
      markets: '📈 ಮಾರುಕಟ್ಟೆ ಧಾರಣೆ',
      crops: '🌾 ಬೆಳೆ ಮತ್ತು ಕೀಟ ಸಲಹೆ',
      technology: '🚜 ಕೃಷಿ ತಂತ್ರಜ್ಞಾನ',
      schemes: '📋 ಸಹಾಯಧನ ಮತ್ತು ಯೋಜನೆ',
    },
  },
  apmc: {
    badge: 'ಅಧಿಕೃತ AGMARKNET / e-NAM ಮತ್ತು MSP ದರಗಳು',
    title: 'ಎಪಿಎಂಸಿ / ಮಂಡಿ ಮಾರುಕಟ್ಟೆ ಧಾರಣೆ',
    subtitle:
      'ರಾಜ್ಯ, ಜಿಲ್ಲೆ ಮತ್ತು ಮಂಡಿವಾರು ಇಂದಿನ ಮಾದರಿ ಬೆಲೆ, ಕನಿಷ್ಠ/ಗರಿಷ್ಠ ದರ ಹಾಗೂ ಬೆಲೆ ಏರಿಳಿತಗಳನ್ನು (📈 ಏರಿಕೆ, ➡️ ಸ್ಥಿರ, 📉 ಇಳಿಕೆ) ನಿಮ್ಮ ಜಮೀನಿನ ಹೊಂದಾಣಿಕೆಯೊಂದಿಗೆ ಹೋಲಿಸಿ.',
    marketMoversTitle: 'ಪ್ರಮುಖ ಮಾರುಕಟ್ಟೆ ಏರಿಳಿತ ಮತ್ತು ರೈತರಿಗೆ ಅವಕಾಶಗಳು',
    marketMoversSub: '📈 ಬೆಲೆ ಏರುತ್ತಿರುವ, ➡️ ಸ್ಥಿರವಾಗಿರುವ ಮತ್ತು 📉 ಇಳಿಕೆಯಾಗುತ್ತಿರುವ ಬೆಳೆಗಳ ನೇರ ನೋಟ',
    risingLabel: '📈 ಬೆಲೆ ಏರಿಕೆ',
    fallingLabel: '📉 ಬೆಲೆ ಇಳಿಕೆ',
    stableLabel: '➡️ ಸ್ಥಿರ ಧಾರಣೆ',
    filterState: '1. ರಾಜ್ಯ ಆಯ್ಕೆಮಾಡಿ',
    filterDistrict: '2. ಜಿಲ್ಲೆ ಆಯ್ಕೆಮಾಡಿ',
    filterMandi: '3. ಎಪಿಎಂಸಿ / ಮಂಡಿ',
    filterCrop: '4. ಬೆಳೆ ಆಯ್ಕೆಮಾಡಿ',
    allStates: 'ಎಲ್ಲಾ ರಾಜ್ಯಗಳು',
    allDistricts: 'ಎಲ್ಲಾ ಜಿಲ್ಲೆಗಳು',
    allMandis: 'ಎಲ್ಲಾ ಎಪಿಎಂಸಿ ಮಂಡಿಗಳು',
    allCrops: 'ಎಲ್ಲಾ ಬೆಳೆಗಳು',
    modalPriceLabel: 'ಇಂದಿನ ಮಾದರಿ ಬೆಲೆ (Modal)',
    minPriceLabel: 'ಕನಿಷ್ಠ ಬೆಲೆ',
    maxPriceLabel: 'ಗರಿಷ್ಠ ಬೆಲೆ',
    mspFloorLabel: 'ಸರ್ಕಾರಿ ಬೆಂಬಲ ಬೆಲೆ (MSP)',
    suitabilityMatchLabel: 'ನಿಮ್ಮ ಜಮೀನಿನ ಹೊಂದಾಣಿಕೆ',
    aboveMspTag: 'MSP ಗಿಂತ ಹೆಚ್ಚಿನ ಬೆಲೆ',
    belowMspTag: 'MSP ಗಿಂತ ಕಡಿಮೆ — ಸರ್ಕಾರಿ ಖರೀದಿ ಕೇಂದ್ರ ಬಳಸಿ',
    listenPriceBtn: 'ಬೆಲೆ ಆಲಿಸಿ 🔊',
    askAiMarketBtn: 'ಮಾರಾಟ ಸಲಹೆ ಕೇಳಿ',
    verifyGoogleSearchBtn: 'ಗೂಗಲ್ ಸರ್ಚ್ ನೇರ ಮಂಡಿ ದರ ಪರಿಶೀಲಿಸಿ',
    verifyingGoogleSearchBtn: 'ನೇರ ಮಂಡಿ ಬೆಲೆ ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...',
    liveWebGroundingTitle: 'ಗೂಗಲ್ ಸರ್ಚ್ ಆಧಾರಿತ ನೇರ ಮಾರುಕಟ್ಟೆ ವರದಿ',
  },
  schemes: {
    badge: 'ಕೇಂದ್ರ ಮತ್ತು ರಾಜ್ಯ ಸರ್ಕಾರದ ಅಧಿಕೃತ ಕೃಷಿ ಯೋಜನೆಗಳು',
    title: 'ಸ್ಕೀಮ್ ಸಾಥಿ — ಸರ್ಕಾರಿ ಯೋಜನೆಗಳ ಶೋಧಕ',
    subtitle:
      'ನಿಮ್ಮ ರಾಜ್ಯ, ಬೆಳೆ ಮತ್ತು ಜಮೀನಿನ ವಿಸ್ತೀರ್ಣಕ್ಕೆ ಸಿಗುವ ಸಹಾಯಧನ, ಬೆಳೆ ವಿಮೆ, ಸೋಲಾರ್ ಪಂಪ್ ಮತ್ತು ಪಿಎಂ-ಕಿಸಾನ್ ಸೌಲಭ್ಯಗಳನ್ನು ತಿಳಿಯಿರಿ.',
    listenSchemeBtn: 'ಯೋಜನೆ ಆಲಿಸಿ 🔊',
    benefitLabel: 'ದೃಢೀಕೃತ ಸೌಲಭ್ಯ / ಸಹಾಯಧನ',
    eligibilityLabel: 'ಅರ್ಹತಾ ಮಾನದಂಡಗಳು',
    documentsLabel: 'ಬೇಕಾಗುವ ದಾಖಲೆಗಳು',
    howToApplyLabel: 'ಅರ್ಜಿ ಸಲ್ಲಿಸುವ ವಿಧಾನ',
    officialPortalBtn: 'ಅಧಿಕೃತ ಸರ್ಕಾರಿ ವೆಬ್‌ಸೈಟ್',
    askAiSchemeBtn: 'ಅರ್ಜಿ ಸಲ್ಲಿಸುವ ಬಗ್ಗೆ AI ಕೇಳಿ',
  },
  ai: {
    badge: 'ಗೂಗಲ್ ಸರ್ಚ್ ಆಧಾರಿತ • ಬಹುಭಾಷಾ ಧ್ವನಿ AI',
    title: 'ಭೂಮಿತ್ರ AI — ನಿಮ್ಮ ನಂಬಿಕಸ್ಥ ಕೃಷಿ ತಜ್ಞ',
    subtitle:
      'ಧ್ವನಿ 🎙️ ಅಥವಾ ಬರಹದ ಮೂಲಕ ಕನ್ನಡ, ಹಿಂದಿ ಅಥವಾ ಇಂಗ್ಲಿಷ್‌ನಲ್ಲಿ ಕೇಳಿ. ಎಪಿಎಂಸಿ ಬೆಲೆ, ಬೆಳೆ ಶಿಫಾರಸು, ಸರ್ಕಾರಿ ಯೋಜನೆ ಮತ್ತು ಇಂದಿನ ಕೃಷಿ ಸುದ್ದಿಗಳೊಂದಿಗೆ ಸಂಪರ್ಕಿತವಾಗಿದೆ.',
    searchGroundedActive: 'ಗೂಗಲ್ ಸರ್ಚ್ ನೇರ ಮಾಹಿತಿ ಸಕ್ರಿಯ',
    contextualMemoryActive: 'ಸಂಭಾಷಣೆಯ ಸ್ಮರಣೆ ಸಕ್ರಿಯ',
    autoSpeakLabel: 'AI ಉತ್ತರವನ್ನು ಸ್ವಯಂಚಾಲಿತವಾಗಿ ಓದಿ 🔊',
    tapMicPrompt: 'ಕನ್ನಡದಲ್ಲಿ ಮಾತನಾಡಲು ಮೈಕ್ ಒತ್ತಿರಿ',
    webSourcesLabel: 'ಗೂಗಲ್ ಸರ್ಚ್ ನೇರ ವೆಬ್ ಮೂಲಗಳು',
    platformSourcesLabel: 'ಭೂಮಿತ್ರ ಅಧಿಕೃತ ದತ್ತಾಂಶ ಮೂಲಗಳು',
    clarificationTitle: 'ನಿಖರ ಸಲಹೆಗಾಗಿ ಒಂದು ಸಣ್ಣ ಪ್ರಶ್ನೆ',
    keyActionsTitle: 'ನಿಮ್ಮ ಜಮೀನಿಗೆ ಪ್ರಮುಖ ಕ್ರಮಗಳು',
  },
};

const HI_UI: GlobalUIDictionary = {
  trustedCompanionBadge: 'हर किसान की जेब में भरोसेमंद AI कृषि साथी',
  taglineMain: 'बाज़ार को जानें। सही फसल चुनें। स्मार्ट खेती करें।',
  voiceFirstHint: 'वॉइस-फर्स्ट प्लेटफॉर्म: सुनने के लिए 🔊 दबाएं या अपनी भाषा में बोलने के लिए 🎙️ दबाएं',
  tapToSpeakBtn: 'बोलकर पूछें 🎙️',
  listeningNow: 'सुन रहे हैं... कृपया बोलें',
  listenBtn: 'सुनें 🔊',
  stopBtn: 'रोकें ⏹️',
  listenFullPageBtn: 'सारांश सुनें 🔊',
  nav: {
    home: 'मुख्य पृष्ठ',
    news: 'आज की कृषि खबरें',
    apmc: 'मंडी / APMC भाव',
    wizard: 'फसल खोजक',
    results: 'शीर्ष फसलें',
    schemes: 'स्कीम साथी',
    charts: 'NPK चार्ट',
    compare: 'तुलना करें',
    helpdesk: 'फसल डॉक्टर',
    ask: 'भूमिमित्र AI',
    saved: 'मेरी योजनाएं',
  },
  news: {
    badge: 'दैनिक कृषि समाचार • गूगल सर्च ग्राउंडेड',
    title: 'आज की कृषि खबरें (Today in Agriculture)',
    subtitle:
      'बारिश, सरकारी फैसलों, मंडी भाव, फसल सलाह, योजनाओं और कृषि तकनीक से जुड़ी ताज़ा भारतीय खबरें — आधिकारिक स्रोतों से सत्यापित।',
    listenBulletinBtn: 'आज का पूरा कृषि समाचार बुलेटिन सुनें 🔊',
    refreshLiveBtn: 'ताज़ा लाइव खबरें प्राप्त करें (Google Search)',
    refreshingBtn: 'ताज़ा कृषि खबरें खोजी जा रही हैं...',
    searchPlaceholder: 'फसल, बारिश, MSP या योजना से खबरें खोजें...',
    voiceSearchBtn: 'बोलकर खोजें 🎙️',
    whyItMattersLabel: 'किसानों के लिए यह क्यों महत्वपूर्ण है',
    sourceLabel: 'सत्यापित स्रोत',
    verifiedDateLabel: 'प्रकाशित तिथि',
    askAiAboutNewsBtn: 'इस खबर पर भूमिमित्र AI से सलाह लें',
    readSourceBtn: 'आधिकारिक स्रोत',
    liveSearchGroundedBadge: 'लाइव गूगल सर्च ग्राउंडेड',
    verifiedOfficialBadge: 'सत्यापित PIB / ICAR / IMD बुलेटिन',
    categories: {
      all: 'सभी खबरें',
      rainfall: '🌧️ बारिश और मौसम',
      government: '🏛️ सरकारी फैसले व MSP',
      markets: '📈 मंडी और बाज़ार',
      crops: '🌾 फसल व कीट सलाह',
      technology: '🚜 कृषि तकनीक',
      schemes: '📋 सब्सिडी व योजनाएं',
    },
  },
  apmc: {
    badge: 'आधिकारिक AGMARKNET / e-NAM एवं MSP बेंचमार्क',
    title: 'मंडी / APMC बाज़ार भाव और रुझान',
    subtitle:
      'राज्य, जिला और मंडी के अनुसार ताज़ा मॉडल भाव, न्यूनतम/अधिकतम रेट और भाव के रुझान (📈 तेज़ी, ➡️ स्थिर, 📉 मंदी) को अपनी भूमि उपयुक्तता के साथ देखें।',
    marketMoversTitle: 'प्रमुख बाज़ार हलचल और किसानों के लिए अवसर',
    marketMoversSub: 'मंडियों में 📈 तेज़ी, ➡️ स्थिर और 📉 नरमी वाली फसलों का सीधा सारांश',
    risingLabel: '📈 भाव में तेज़ी',
    fallingLabel: '📉 भाव में नरमी',
    stableLabel: '➡️ स्थिर भाव',
    filterState: '1. राज्य चुनें',
    filterDistrict: '2. जिला चुनें',
    filterMandi: '3. APMC / मंडी चुनें',
    filterCrop: '4. फसल / जिंस चुनें',
    allStates: 'सभी राज्य (भारत)',
    allDistricts: 'सभी जिले',
    allMandis: 'सभी APMC मंडियां',
    allCrops: 'सभी फसलें',
    modalPriceLabel: 'ताज़ा मॉडल भाव (Modal)',
    minPriceLabel: 'न्यूनतम',
    maxPriceLabel: 'अधिकतम',
    mspFloorLabel: 'सरकारी MSP दर',
    suitabilityMatchLabel: 'आपकी भूमि उपयुक्तता',
    aboveMspTag: 'MSP से ऊपर व्यापार',
    belowMspTag: 'MSP से नीचे — सरकारी खरीद केंद्र का उपयोग करें',
    listenPriceBtn: 'भाव सुनें 🔊',
    askAiMarketBtn: 'बिक्री सलाह पूछें',
    verifyGoogleSearchBtn: 'लाइव गूगल सर्च मंडी भाव जांचें',
    verifyingGoogleSearchBtn: 'लाइव वेब मंडी भाव की जांच हो रही है...',
    liveWebGroundingTitle: 'गूगल सर्च आधारित लाइव मंडी रिपोर्ट',
  },
  schemes: {
    badge: 'केंद्र और राज्य सरकार की आधिकारिक कृषि योजनाएं',
    title: 'स्कीम साथी — सरकारी योजना खोजक',
    subtitle:
      'अपने राज्य, फसल और खेत के आकार के अनुसार सत्यापित सब्सिडी, फसल बीमा, सोलर पंप और सम्मान निधि योजनाओं की जानकारी पाएं।',
    listenSchemeBtn: 'योजना सुनें 🔊',
    benefitLabel: 'सत्यापित लाभ / सब्सिडी',
    eligibilityLabel: 'पात्रता शर्तें',
    documentsLabel: 'आवश्यक दस्तावेज़',
    howToApplyLabel: 'आवेदन कैसे करें',
    officialPortalBtn: 'आधिकारिक सरकारी पोर्टल',
    askAiSchemeBtn: 'आवेदन प्रक्रिया AI से पूछें',
  },
  ai: {
    badge: 'गूगल सर्च ग्राउंडेड • बहुभाषी वॉइस AI',
    title: 'भूमिमित्र AI — आपका भरोसेमंद कृषि साथी',
    subtitle:
      'आवाज़ 🎙️ या टेक्स्ट से हिंदी, कन्नड़ या अंग्रेज़ी में पूछें। लाइव गूगल सर्च, APMC मंडी भाव, फसल उपयुक्तता, स्कीम साथी और आज की कृषि खबरों से जुड़ा हुआ।',
    searchGroundedActive: 'गूगल सर्च ग्राउंडिंग सक्रिय',
    contextualMemoryActive: 'संवाद स्मृति (Memory) सक्रिय',
    autoSpeakLabel: 'AI उत्तर अपने आप बोलकर सुनाएं 🔊',
    tapMicPrompt: 'अपनी भाषा में बोलने के लिए माइक दबाएं',
    webSourcesLabel: 'लाइव गूगल सर्च वेब स्रोत',
    platformSourcesLabel: 'भूमिमित्र सत्यापित डेटा स्रोत',
    clarificationTitle: 'बेहतर सलाह के लिए एक छोटा प्रश्न',
    keyActionsTitle: 'आपके खेत के लिए मुख्य कदम',
  },
};

export function getGlobalUI(lang: LanguageCode): GlobalUIDictionary {
  if (lang === 'kn') return KN_UI;
  if (lang === 'hi' || lang === 'mr' || lang === 'pa') return HI_UI;
  return EN_UI;
}
