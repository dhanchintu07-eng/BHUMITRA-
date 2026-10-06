import type { AgriNewsArticle, LanguageCode } from '../types/index.ts';

export const VERIFIED_AGRI_NEWS_ARTICLES: AgriNewsArticle[] = [
  {
    id: 'pib-msp-rabi-kharif-update',
    category: 'government',
    title: 'Cabinet Approves Enhanced MSP Floor for Pulses, Oilseeds & Shree Anna Millets',
    titleKn: 'ಬೇಳೆಕಾಳುಗಳು, ಎಣ್ಣೆಕಾಳುಗಳು ಮತ್ತು ಸಿರಿಧಾನ್ಯಗಳಿಗೆ (ಶ್ರೀ ಅನ್ನ) ಹೆಚ್ಚಳವಾದ ಬೆಂಬಲ ಬೆಲೆ (MSP) ಕೇಂದ್ರ ಸಂಪುಟ ಅನುಮೋದನೆ',
    titleHi: 'केंद्र सरकार ने दलहन, तिलहन और श्री अन्न (मिलेट्स) के न्यूनतम समर्थन मूल्य (MSP) में वृद्धि को मंजूरी दी',
    summary:
      'The Union Cabinet Committee on Economic Affairs (CCEA) has increased Minimum Support Prices across key Kharif and Rabi crops including Ragi (₹4,290/qtl), Tur/Pigeon Pea (₹7,550/qtl), Mustard (₹5,950/qtl), and Wheat (₹2,425/qtl) to guarantee at least 50% margin over cost of production.',
    summaryKn:
      'ರೈತರ ಉತ್ಪಾದನಾ ವೆಚ್ಚಕ್ಕಿಂತ ಕನಿಷ್ಠ ಶೇ.50 ರಷ್ಟು ಲಾಭಾಂಶ ಖಾತರಿಪಡಿಸಲು ಕೇಂದ್ರ ಸರ್ಕಾರವು ರಾಗಿ (₹4,290/ಕ್ವಿಂಟಾಲ್), ತೊಗರಿ (₹7,550/ಕ್ವಿಂಟಾಲ್), ಸಾಸಿವೆ (₹5,950/ಕ್ವಿಂಟಾಲ್) ಮತ್ತು ಗೋಧಿ (₹2,425/ಕ್ವಿಂಟಾಲ್) ಬೆಂಬಲ ಬೆಲೆಯನ್ನು ಹೆಚ್ಚಿಸಿದೆ.',
    summaryHi:
      'आर्थिक मामलों की मंत्रिमंडलीय समिति (CCEA) ने किसानों को लागत पर कम से कम 50% मुनाफा सुनिश्चित करने के लिए रागी (₹4,290/क्विंटल), अरहर/तूर (₹7,550/क्विंटल), सरसों (₹5,950/क्विंटल) और गेहूं (₹2,425/क्विंटल) के MSP में वृद्धि की है।',
    whyItMatters:
      'Farmers growing Ragi, Tur, Soybean, or Mustard should register on state procurement portals (FRUITS / e-Samruddhi) early so they never have to sell below the MSP floor if mandi prices dip during peak harvest.',
    whyItMattersKn:
      'ರಾಗಿ, ತೊಗರಿ ಅಥವಾ ಸಾಸಿವೆ ಬೆಳೆಯುವ ರೈತರು ಮುಂಚಿತವಾಗಿಯೇ FRUITS ಪೋರ್ಟಲ್‌ನಲ್ಲಿ ನೋಂದಾಯಿಸಿಕೊಳ್ಳುವುದರಿಂದ ಮಾರುಕಟ್ಟೆ ಬೆಲೆ ಕುಸಿದರೂ ಸರ್ಕಾರಿ MSP ದರದಲ್ಲಿ ಬೆಳೆ ಮಾರಾಟ ಮಾಡಬಹುದು.',
    whyItMattersHi:
      'रागी, तूर, सोयाबीन या सरसों उगाने वाले किसानों को सरकारी खरीद पोर्टल पर समय रहते पंजीकरण कराना चाहिए ताकि मंडी भाव गिरने पर भी MSP से नीचे फसल न बेचनी पड़े।',
    sourceName: 'PIB / Ministry of Agriculture & Farmers Welfare',
    sourceUrl: 'https://pib.gov.in/',
    publishedDate: 'Official CACP / PIB Bulletin (2025–26 Marketing Season)',
    isLiveGrounded: false,
    regionTag: 'All India',
  },
  {
    id: 'imd-monsoon-soil-moisture-advisory',
    category: 'rainfall',
    title: 'IMD Agromet Advisory: Above-Normal Soil Moisture Supports Timely Sowing & Farm Pond Recharge',
    titleKn: 'ಭಾರತೀಯ ಹವಾಮಾನ ಇಲಾಖೆ (IMD) ಕೃಷಿ ಸಲಹೆ: ಉತ್ತಮ ಮಳೆಯಿಂದಾಗಿ ಮಣ್ಣಿನ ತೇವಾಂಶ ವೃದ್ಧಿ ಮತ್ತು ಕೃಷಿ ಹೊಂಡಗಳಲ್ಲಿ ನೀರಿನ ಸಂಗ್ರಹ',
    titleHi: 'IMD कृषि मौसम सलाह: अच्छी बारिश से मिट्टी की नमी बढ़ी, समय पर बुवाई और खेत तालाब जल संचयन में लाभ',
    summary:
      'India Meteorological Department (IMD) Agromet Division reports strong reservoir storage and favorable soil moisture across Southern Peninsula, Central India, and Indo-Gangetic plains. Farmers in rainfed districts are advised to construct ridge-and-furrow channels to drain excess water from pulse fields.',
    summaryKn:
      'ದಕ್ಷಿಣ ಭಾರತ ಮತ್ತು ಮಧ್ಯ ಭಾರತದ ಜಲಾಶಯಗಳಲ್ಲಿ ನೀರಿನ ಮಟ್ಟ ಉತ್ತಮವಾಗಿದ್ದು, ಮಣ್ಣಿನ ತೇವಾಂಶ ಬಿತ್ತನೆಗೆ ಪೂರಕವಾಗಿದೆ. ತೊಗರಿ ಮತ್ತು ಶೇಂಗಾ ಹೊಲಗಳಲ್ಲಿ ಹೆಚ್ಚುವರಿ ಮಳೆ ನೀರು ನಿಲ್ಲದಂತೆ ಬಸಿಗಾಲುವೆ ನಿರ್ಮಿಸಲು IMD ಸೂಚಿಸಿದೆ.',
    summaryHi:
      'भारतीय मौसम विज्ञान विभाग (IMD) के अनुसार जलाशयों और मिट्टी में नमी का स्तर अनुकूल है। दलहन और मूंगफली के खेतों में जलभराव रोकने के लिए मेड़ और जल निकासी नालियां बनाने की सलाह दी गई है।',
    whyItMatters:
      'Avoid foliar fertilizer or pesticide sprays on days with >70% rain probability; use current moisture for basal neem-coated urea or Trichoderma soil application.',
    whyItMattersKn:
      'ಮಳೆ ಸಾಧ್ಯತೆ ಶೇ.70 ಕ್ಕಿಂತ ಹೆಚ್ಚಿರುವ ದಿನಗಳಲ್ಲಿ ಕೀಟನಾಶಕ ಸಿಂಪಡಣೆ ಬೇಡ; ಪ್ರಸ್ತುತ ಮಣ್ಣಿನ ತೇವಾಂಶವನ್ನು ಬೇವಿನ ಲೇಪಿತ ಯೂರಿಯಾ ಅಥವಾ ಟ್ರೈಕೋಡರ್ಮಾ ಬಳಕೆಗೆ ಉಪಯೋಗಿಸಿ.',
    whyItMattersHi:
      '70% से अधिक बारिश की संभावना वाले दिनों में कीटनाशक स्प्रे न करें; वर्तमान मिट्टी की नमी का उपयोग ट्राइकोडर्मा या बेसल खाद डालने के लिए करें।',
    sourceName: 'IMD Agrimet Division (imdagrimet.gov.in)',
    sourceUrl: 'https://imdagrimet.gov.in/',
    publishedDate: 'IMD Weekly Agromet Bulletin',
    isLiveGrounded: false,
    regionTag: 'Karnataka, Maharashtra & Central India',
  },
  {
    id: 'enam-apmc-digital-interstate-trade',
    category: 'markets',
    title: 'e-NAM Cross-Mandi Digital Trading Expands to 1,389+ APMCs Across 23 States',
    titleKn: 'ಇ-ನ್ಯಾಮ್ (e-NAM) ಡಿಜಿಟಲ್ ಮಾರುಕಟ್ಟೆ ವಿಸ್ತರಣೆ: 23 ರಾಜ್ಯಗಳ 1,389+ ಎಪಿಎಂಸಿ ಮಂಡಿಗಳಲ್ಲಿ ನೇರ ಆನ್‌ಲೈನ್ ವ್ಯಾಪಾರ',
    titleHi: 'e-NAM डिजिटल मंडी नेटवर्क 23 राज्यों की 1,389+ APMC मंडियों तक पहुंचा, अंतर-मंडी व्यापार में तेजी',
    summary:
      'Small Farmers Agribusiness Consortium (SFAC) has enabled quality assaying labs and direct e-bidding across 1,389 APMC mandis on the e-NAM platform. Millet, Cotton, Tur, and Spice growers are seeing 6% to 11% better price discovery through transparent digital bidding.',
    summaryKn:
      'ಇ-ನ್ಯಾಮ್ (e-NAM) ವೇದಿಕೆಯ ಮೂಲಕ 1,389 ಎಪಿಎಂಸಿ ಮಾರುಕಟ್ಟೆಗಳಲ್ಲಿ ಗುಣಮಟ್ಟ ಪರೀಕ್ಷೆ ಮತ್ತು ಆನ್‌ಲೈನ್ ಬಿಡ್ಡಿಂಗ್ ಸೌಲಭ್ಯ ಕಲ್ಪಿಸಲಾಗಿದೆ. ರಾಗಿ, ಹತ್ತಿ ಮತ್ತು ತೊಗರಿ ಬೆಳೆಗಾರರಿಗೆ ಶೇ. 6 ರಿಂದ 11 ರಷ್ಟು ಹೆಚ್ಚಿನ ಧಾರಣೆ ಲಭಿಸುತ್ತಿದೆ.',
    summaryHi:
      'e-NAM प्लेटफॉर्म पर 1,389 APMC मंडियों में डिजिटल नीलामी और गुणवत्ता जांच प्रयोगशालाएं शुरू हो चुकी हैं, जिससे रागी, कपास और दलहन किसानों को 6% से 11% तक बेहतर भाव मिल रहा है।',
    whyItMatters:
      'Dry your produce to safe moisture (12% for grains, 8% for oilseeds) and request an e-NAM lot assaying slip at the APMC gate to attract multiple institutional buyers.',
    whyItMattersKn:
      'ನಿಮ್ಮ ಬೆಳೆಯನ್ನು ಸರಿಯಾದ ತೇವಾಂಶಕ್ಕೆ (ಧಾನ್ಯಗಳಿಗೆ 12%, ಎಣ್ಣೆಕಾಳುಗಳಿಗೆ 8%) ಒಣಗಿಸಿ ಎಪಿಎಂಸಿ ಗೇಟ್‌ನಲ್ಲಿ ಇ-ನ್ಯಾಮ್ ಗುಣಮಟ್ಟ ಪರೀಕ್ಷಾ ಚೀಟಿ ಪಡೆದರೆ ಹೆಚ್ಚಿನ ಬೆಲೆ ಸಿಗುತ್ತದೆ.',
    whyItMattersHi:
      'अपनी उपज को उचित नमी (अनाज 12%, तिलहन 8%) तक सुखाकर मंडी गेट पर e-NAM गुणवत्ता जांच पर्ची बनवाएं ताकि अधिक व्यापारी ऊंची बोली लगाएं।',
    sourceName: 'e-NAM / AGMARKNET Portal (enam.gov.in)',
    sourceUrl: 'https://enam.gov.in/web/',
    publishedDate: 'SFAC / e-NAM Market Update',
    isLiveGrounded: false,
    regionTag: 'Pan-India APMCs',
  },
  {
    id: 'icar-drone-nano-urea-dap-tech',
    category: 'technology',
    title: 'ICAR & Namo Drone Didi: Precision Foliar Spraying Cuts Fertilizer & Water Cost by 35%',
    titleKn: 'ಐಸಿಎಆರ್ (ICAR) ಮತ್ತು ನಮೋ ಡ್ರೋನ್ ದೀದಿ: ಕೃಷಿ ಡ್ರೋನ್ ಸಿಂಪಡಣೆಯಿಂದ ಗೊಬ್ಬರ ಮತ್ತು ನೀರಿನ ವೆಚ್ಚದಲ್ಲಿ ಶೇ. 35 ಉಳಿತಾಯ',
    titleHi: 'ICAR और नमो ड्रोन दीदी: कृषि ड्रोन से नैनो यूरिया व नैनो डीएपी छिड़काव से पानी और खाद खर्च में 35% की बचत',
    summary:
      'Indian Council of Agricultural Research (ICAR) field trials show that foliar application of Nano DAP and Nano Urea via agricultural drones during tillering and pre-flowering stages improves nutrient absorption efficiency while saving 90% water compared to knapsack sprayers.',
    summaryKn:
      'ಬೆಳೆಯ ತೆನೆ ಕಟ್ಟುವ ಮತ್ತು ಹೂವಾಡುವ ಹಂತದಲ್ಲಿ ಕೃಷಿ ಡ್ರೋನ್ ಮೂಲಕ ನ್ಯಾನೋ ಯೂರಿಯಾ ಮತ್ತು ನ್ಯಾನೋ ಡಿಎಪಿ ಸಿಂಪಡಿಸುವುದರಿಂದ ಪೋಷಕಾಂಶಗಳ ಹೀರಿಕೊಳ್ಳುವಿಕೆ ಹೆಚ್ಚಾಗಿ ಸಮಯ ಮತ್ತು ನೀರಿನ ಉಳಿತಾಯವಾಗುತ್ತದೆ ಎಂದು ICAR ತಿಳಿಸಿದೆ.',
    summaryHi:
      'भारतीय कृषि अनुसंधान परिषद (ICAR) के परीक्षणों के अनुसार कल्ले फूटने और फूल आने से पहले कृषि ड्रोन द्वारा नैनो डीएपी और नैनो यूरिया के छिड़काव से पोषक तत्वों का अवशोषण बढ़ता है और 90% पानी बचता है।',
    whyItMatters:
      'Farmers can book subsidized drone spraying through their nearest FPO, Primary Agricultural Credit Society (PACS), or Raitha Samparka Kendra at ₹300–₹400 per acre.',
    whyItMattersKn:
      'ರೈತರು ತಮ್ಮ ಹತ್ತಿರದ ರೈತ ಸಂಪರ್ಕ ಕೇಂದ್ರ (RSK) ಅಥವಾ ಪ್ರಾಥಮಿಕ ಕೃಷಿ ಪತ್ತಿನ ಸಹಕಾರ ಸಂಘದ (PACS) ಮೂಲಕ ಪ್ರತಿ ಎಕರೆಗೆ ಕಡಿಮೆ ಬಾಡಿಗೆಯಲ್ಲಿ ಡ್ರೋನ್ ಸಿಂಪಡಣೆ ಸೇವೆ ಪಡೆಯಬಹುದು.',
    whyItMattersHi:
      'किसान अपने नजदीकी FPO, पैक्स (PACS) या कृषि केंद्र के माध्यम से मात्र ₹300–₹400 प्रति एकड़ में ड्रोन छिड़काव सेवा बुक कर सकते हैं।',
    sourceName: 'ICAR (Indian Council of Agricultural Research)',
    sourceUrl: 'https://icar.org.in/',
    publishedDate: 'ICAR Agronomy Technology Bulletin',
    isLiveGrounded: false,
    regionTag: 'All India',
  },
  {
    id: 'pm-kusum-krishi-bhagya-solar-subsidy',
    category: 'schemes',
    title: 'PM-KUSUM & Karnataka Krishi Bhagya: Faster Approval for Solar Pumps & Farm Ponds',
    titleKn: 'ಪಿಎಂ-ಕುಸುಮ್ (PM-KUSUM) ಮತ್ತು ಕೃಷಿ ಭಾಗ್ಯ ಯೋಜನೆ: ಸೋಲಾರ್ ಪಂಪ್ ಹಾಗೂ ಕೃಷಿ ಹೊಂಡಕ್ಕೆ ಶೇ. 60 ರಿಂದ 90 ಸಹಾಯಧನ',
    titleHi: 'पीएम-कुसुम और कृषि भाग्य योजना: सोलर पंप और खेत तालाब के लिए 60% से 90% तक सब्सिडी आवेदन शुरू',
    summary:
      'State Agriculture and Renewable Energy departments have streamlined single-window Aadhaar/FID verification for standalone solar irrigation pumps (3 HP to 7.5 HP) under PM-KUSUM Component-B and polyhouse/farm pond lining under Krishi Bhagya.',
    summaryKn:
      'ಪಿಎಂ-ಕುಸುಮ್ ಯೋಜನೆಯಡಿ 3 ರಿಂದ 7.5 HP ಸೋಲಾರ್ ಪಂಪ್‌ಸೆಟ್‌ಗಳಿಗೆ ಶೇ. 60 ಸಹಾಯಧನ ಹಾಗೂ ಕರ್ನಾಟಕದ ಕೃಷಿ ಭಾಗ್ಯ ಯೋಜನೆಯಡಿ ಕೃಷಿ ಹೊಂಡ ಮತ್ತು ಪಾಲಿಹೌಸ್ ನಿರ್ಮಾಣಕ್ಕೆ ಶೇ. 80–90 ಸಹಾಯಧನಕ್ಕಾಗಿ ಏಕಗವಾಕ್ಷಿ ನೋಂದಣಿ ಸುಲಭಗೊಳಿಸಲಾಗಿದೆ.',
    summaryHi:
      'पीएम-कुसुम योजना (घटक-B) के तहत 3 से 7.5 HP सोलर पंपों पर 60% सब्सिडी और कृषि तालाब व ड्रिप सिंचाई के लिए ऑनलाइन सिंगल-विंडो सत्यापन प्रक्रिया तेज कर दी गई है।',
    whyItMatters:
      'Eliminates daytime electricity cut issues during critical crop flowering stages and reduces diesel irrigation expenses to zero.',
    whyItMattersKn:
      'ಹಗಲು ಹೊತ್ತಿನಲ್ಲಿ ವಿದ್ಯುತ್ ಕಡಿತದ ಸಮಸ್ಯೆಯಿಲ್ಲದೆ ಬೆಳೆಗಳ ಹೂವಾಡುವ ಹಂತದಲ್ಲಿ ಸಮಯಕ್ಕೆ ಸರಿಯಾಗಿ ನೀರು ಹಾಯಿಸಲು ಮತ್ತು ಡೀಸೆಲ್ ವೆಚ್ಚ ಶೂನ್ಯಗೊಳಿಸಲು ಇದು ಸಹಾಯಕ.',
    whyItMattersHi:
      'फसल के फूल आने के महत्वपूर्ण चरण में बिजली कटौती की समस्या समाप्त होती है और डीजल पंप का खर्च शून्य हो जाता है।',
    sourceName: 'PM-KUSUM / Raita Mitra Portal',
    sourceUrl: 'https://pmkusum.mnre.gov.in/',
    publishedDate: 'Ministry of New & Renewable Energy / State Agri Dept',
    isLiveGrounded: false,
    regionTag: 'Karnataka & All States',
  },
  {
    id: 'icar-ipm-pink-bollworm-fall-armyworm',
    category: 'crops',
    title: 'Crop Protection Alert: Pheromone Trap & Neem Oil Protocol for Maize & Cotton',
    titleKn: 'ಬೆಳೆ ಸಂರಕ್ಷಣಾ ಸಲಹೆ: ಮೆಕ್ಕೆಜೋಳದ ಲದ್ದಿ ಹುಳು ಮತ್ತು ಹತ್ತಿಯ ಗುಲಾಬಿ ಕಾಯಿಕೊರಕ ನಿಯಂತ್ರಣಕ್ಕೆ ಮೋಹಕ ಬಲೆ ಹಾಗೂ ಬೇವಿನ ಎಣ್ಣೆ ಬಳಕೆ',
    titleHi: 'फसल सुरक्षा सलाह: मक्का में फॉल आर्मीवर्म और कपास में गुलाबी सुंडी की रोकथाम हेतु फेरोमोन ट्रैप व नीम तेल प्रोटोकॉल',
    summary:
      'State Agricultural Universities and ICAR-NBAIR advise farmers at 25–45 days crop age to install 5 pheromone traps per acre and spray Azadirachtin 1500 ppm (Neem Oil 5ml/L) before resorting to synthetic pesticides.',
    summaryKn:
      'ಬಿತ್ತನೆಯಾದ 25–45 ದಿನಗಳ ಬೆಳೆಯಲ್ಲಿ ಪ್ರತಿ ಎಕರೆಗೆ 5 ಲಿಂಗಾಕರ್ಷಕ (Pheromone) ಬಲೆಗಳನ್ನು ಅಳವಡಿಸಲು ಮತ್ತು ರಾಸಾಯನಿಕ ಕೀಟನಾಶಕಕ್ಕೂ ಮುನ್ನ ಬೇವಿನ ಎಣ್ಣೆ (ಪ್ರತಿ ಲೀಟರ್ ನೀರಿಗೆ 5 ಮಿ.ಲೀ) ಸಿಂಪಡಿಸಲು ಕೃಷಿ ವಿಶ್ವವಿದ್ಯಾಲಯಗಳು ಸಲಹೆ ನೀಡಿವೆ.',
    summaryHi:
      'कृषि विश्वविद्यालयों और ICAR ने बुवाई के 25–45 दिन बाद प्रति एकड़ 5 फेरोमोन ट्रैप लगाने और रासायनिक कीटनाशकों से पहले नीम तेल (5 मिली/लीटर) का छिड़काव करने की सलाह दी है।',
    whyItMatters:
      'Early pheromone trap monitoring saves ₹2,500–₹4,000 per acre in chemical spray costs and protects beneficial honeybees during pollination.',
    whyItMattersKn:
      'ಆರಂಭಿಕ ಹಂತದಲ್ಲಿಯೇ ಮೋಹಕ ಬಲೆ ಬಳಸುವುದರಿಂದ ಪ್ರತಿ ಎಕರೆಗೆ ₹2,500–₹4,000 ಕೀಟನಾಶಕ ವೆಚ್ಚ ಉಳಿಯುತ್ತದೆ ಮತ್ತು ಪರಾಗಸ್ಪರ್ಶ ಮಾಡುವ ಜೇನುನೊಣಗಳ ರಕ್ಷಣೆಯಾಗುತ್ತದೆ.',
    whyItMattersHi:
      'शुरुआती चरण में फेरोमोन ट्रैप लगाने से प्रति एकड़ ₹2,500–₹4,000 के कीटनाशक खर्च की बचत होती है और परागण करने वाली मधुमक्खियां सुरक्षित रहती हैं।',
    sourceName: 'ICAR-NBAIR / UAS Bengaluru Advisory',
    sourceUrl: 'https://www.nbair.res.in/',
    publishedDate: 'ICAR Seasonal Crop Protection Bulletin',
    isLiveGrounded: false,
    regionTag: 'South & Central India',
  },
];

export function localizeNewsArticle(article: AgriNewsArticle, lang: LanguageCode) {
  if (lang === 'kn') {
    return {
      title: article.titleKn || article.title,
      summary: article.summaryKn || article.summary,
      whyItMatters: article.whyItMattersKn || article.whyItMatters,
    };
  }
  if (lang === 'hi' || lang === 'mr' || lang === 'pa') {
    return {
      title: article.titleHi || article.title,
      summary: article.summaryHi || article.summary,
      whyItMatters: article.whyItMattersHi || article.whyItMatters,
    };
  }
  return {
    title: article.title,
    summary: article.summary,
    whyItMatters: article.whyItMatters,
  };
}
