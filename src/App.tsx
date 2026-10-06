import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ExtremeWeatherAlertBanner } from './components/ExtremeWeatherAlertBanner';
import { Hero } from './components/Hero';
import { WeatherWidget } from './components/WeatherWidget';
import { APMCMarketIntelligence } from './components/APMCMarketIntelligence';
import { SchemeSaathi } from './components/SchemeSaathi';
import { RecommendationForm } from './components/RecommendationForm';
import { RecommendationResults } from './components/RecommendationResults';
import { CropCharts } from './components/CropCharts';
import { AskAI } from './components/AskAI';
import { CropComparison } from './components/CropComparison';
import { AIHelpDesk } from './components/AIHelpDesk';
import { SavedRecommendations } from './components/SavedRecommendations';
import { GrowthStageNotificationSystem } from './components/GrowthStageNotificationSystem';
import { Footer } from './components/Footer';
import { TTSProvider } from './context/TTSContext';
import { AudioPlayerBar } from './components/AudioPlayerBar';
import {
  Crop,
  UserFarmingConditions,
  LanguageCode,
  SavedPlan,
  RecentSearch,
  AppPage,
  WeatherData,
} from './types';
import { runCropRecommendationEngine, CROPS_DATA } from './data/crops';
import {
  Home,
  Store,
  SlidersHorizontal,
  Award,
  Landmark,
  BarChart3,
  ArrowUpDown,
  MessageSquareCode,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Stethoscope,
} from 'lucide-react';

export default function App() {
  const [language, setLanguage] = useState<LanguageCode>(() => {
    return (localStorage.getItem('bhumitra_lang') as LanguageCode) || 'kn';
  });

  const [activePage, setActivePage] = useState<AppPage>('home');
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isLargeFont, setIsLargeFont] = useState(false);

  // Farming Conditions State
  const [currentConditions, setCurrentConditions] = useState<UserFarmingConditions>({
    location: 'Karnataka',
    soilType: 'red',
    season: 'kharif',
    rainfall: 650,
    waterAvailability: 'medium',
    landSize: 2.5,
    landUnit: 'Acres',
  });

  const [topCrops, setTopCrops] = useState<Crop[]>([]);
  const [runnerUps, setRunnerUps] = useState<Crop[]>([]);
  const [aiInsight, setAiInsight] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // Saved Plans & Recent Searches
  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>(() => {
    try {
      const stored = localStorage.getItem('bhumitra_saved_plans');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore parse errors
    }

    const defaultConds: UserFarmingConditions = {
      location: 'Karnataka',
      soilType: 'red',
      season: 'kharif',
      rainfall: 650,
      waterAvailability: 'medium',
      landSize: 2.5,
      landUnit: 'Acres',
    };
    const seededEngine = runCropRecommendationEngine(defaultConds);
    const starterPlan: SavedPlan = {
      id: 'plan-starter-1',
      timestamp: new Date().toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      conditions: defaultConds,
      topCrops: seededEngine.topCrops,
      aiInsight:
        'Prioritize certified seed treatment with Trichoderma viride (4g/kg). Apply split Nitrogen doses during tillering and maintain soil moisture at flowering.',
      remindersEnabled: true,
    };
    return [starterPlan];
  });

  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>(() => {
    try {
      const stored = localStorage.getItem('bhumitra_recent_searches');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Comparison State
  const [comparisonCrops, setComparisonCrops] = useState<Crop[]>([]);

  // Notification & AI Cross-linking State
  const [externalTriggeredPlan, setExternalTriggeredPlan] = useState<SavedPlan | null>(null);
  const [aiInitialPrompt, setAiInitialPrompt] = useState<string>('');
  const [aiContextCrop, setAiContextCrop] = useState<string | undefined>(undefined);
  const [sharedWeather, setSharedWeather] = useState<WeatherData | null>(null);

  const handleLanguageChange = (newLang: LanguageCode) => {
    setLanguage(newLang);
    localStorage.setItem('bhumitra_lang', newLang);
  };

  useEffect(() => {
    if (isHighContrast) {
      document.documentElement.setAttribute('data-high-contrast', 'true');
    } else {
      document.documentElement.removeAttribute('data-high-contrast');
    }
  }, [isHighContrast]);

  useEffect(() => {
    if (isLargeFont) {
      document.documentElement.setAttribute('data-font-size', 'large');
    } else {
      document.documentElement.removeAttribute('data-font-size');
    }
  }, [isLargeFont]);

  useEffect(() => {
    const initialResult = runCropRecommendationEngine(currentConditions);
    setTopCrops(initialResult.topCrops);
    setRunnerUps(initialResult.runnerUps);
    setAiInsight(
      'ಕರ್ನಾಟಕದ ಕೆಂಪು ಮಣ್ಣಿಗೆ ಮುಂಗಾರು ಹಂಗಾಮಿನಲ್ಲಿ ರಾಗಿ, ಶೇಂಗಾ ಅಥವಾ ಹತ್ತಿ ಅತ್ಯುತ್ತಮ. ಬಿತ್ತನೆಗೆ ಮುನ್ನ ಬೀಜೋಪಚಾರ ಮತ್ತು ಸಾವಯವ ಗೊಬ್ಬರ ಬಳಸಿ.'
    );
  }, []);

  const handleFormSubmit = async (conditions: UserFarmingConditions) => {
    setIsLoading(true);
    setCurrentConditions(conditions);

    try {
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(conditions),
      });

      if (!response.ok) throw new Error('API server returned error');
      const data = await response.json();

      setTopCrops(data.topCrops || []);
      setRunnerUps(data.runnerUps || []);
      setAiInsight(data.aiInsight || '');
    } catch (err) {
      console.warn('Backend call failed, using client-side agronomic engine:', err);
      const localResult = runCropRecommendationEngine(conditions);
      setTopCrops(localResult.topCrops);
      setRunnerUps(localResult.runnerUps);
      setAiInsight(
        `For ${conditions.soilType} soil in ${conditions.season} season with ${conditions.waterAvailability} water availability in ${conditions.location || 'your area'}: Prioritize certified seed treatment with bio-fungicide (Trichoderma 4g/kg). Maintain balanced fertilization and avoid moisture stress during flowering.`
      );
    } finally {
      setIsLoading(false);

      const searchItem: RecentSearch = {
        id: 's-' + Date.now(),
        label: `${conditions.location || 'Farm'} · ${conditions.soilType} · ${conditions.season}`,
        conditions,
        date: new Date().toLocaleDateString(),
      };
      setRecentSearches((prev) => {
        const filtered = prev.filter((p) => p.label !== searchItem.label);
        const updated = [searchItem, ...filtered].slice(0, 4);
        localStorage.setItem('bhumitra_recent_searches', JSON.stringify(updated));
        return updated;
      });

      setActivePage('results');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSavePlan = () => {
    const newPlan: SavedPlan = {
      id: 'plan-' + Date.now(),
      timestamp: new Date().toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      conditions: currentConditions,
      topCrops,
      aiInsight,
      remindersEnabled: true,
    };

    setSavedPlans((prev) => {
      const updated = [newPlan, ...prev];
      localStorage.setItem('bhumitra_saved_plans', JSON.stringify(updated));
      return updated;
    });
    setExternalTriggeredPlan(newPlan);
  };

  const handleDeletePlan = (id: string) => {
    setSavedPlans((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      localStorage.setItem('bhumitra_saved_plans', JSON.stringify(updated));
      return updated;
    });
  };

  const handleTogglePlanReminders = (id: string) => {
    setSavedPlans((prev) => {
      const updated = prev.map((p) =>
        p.id === id ? { ...p, remindersEnabled: p.remindersEnabled === false ? true : false } : p
      );
      localStorage.setItem('bhumitra_saved_plans', JSON.stringify(updated));
      return updated;
    });
  };

  const handleLoadPlan = (conds: UserFarmingConditions) => {
    setCurrentConditions(conds);
    handleFormSubmit(conds);
  };

  const handleCompareWith = (crop: Crop) => {
    setComparisonCrops((prev) => {
      const exists = prev.some((c) => c.id === crop.id);
      if (exists) return prev;
      return [...prev, crop].slice(0, 3);
    });
    setActivePage('compare');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isCurrentPlanSaved = savedPlans.some(
    (p) =>
      p.conditions.location === currentConditions.location &&
      p.conditions.soilType === currentConditions.soilType &&
      p.conditions.season === currentConditions.season
  );

  // Page List for Stepper
  const PAGES: { id: AppPage; label: string; icon: any }[] = [
    { id: 'home', label: '01. Home, Market & Weather', icon: Home },
    { id: 'apmc', label: '02. Mandi / APMC Prices', icon: Store },
    { id: 'wizard', label: '03. Crop Finder', icon: SlidersHorizontal },
    { id: 'results', label: '04. Suitability & Price Match', icon: Award },
    { id: 'schemes', label: '05. Scheme Saathi Subsidies', icon: Landmark },
    { id: 'ask', label: '06. BHUMITRA AI Assistant', icon: MessageSquareCode },
    { id: 'charts', label: '07. NPK & Growth Charts', icon: BarChart3 },
    { id: 'compare', label: '08. Compare Crops', icon: ArrowUpDown },
    { id: 'helpdesk', label: '09. Crop Doctor & Routine', icon: Stethoscope },
    { id: 'saved', label: '10. Saved Plans', icon: Bookmark },
  ];

  const currentPageIndex = Math.max(0, PAGES.findIndex((p) => p.id === activePage));

  const goToNextPage = () => {
    if (currentPageIndex < PAGES.length - 1) {
      setActivePage(PAGES[currentPageIndex + 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToPrevPage = () => {
    if (currentPageIndex > 0) {
      setActivePage(PAGES[currentPageIndex - 1].id);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const launchAIWithPrompt = (prompt: string, cropName?: string) => {
    setAiInitialPrompt(prompt);
    if (cropName) setAiContextCrop(cropName);
    setActivePage('ask');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <TTSProvider>
      <div className="min-h-screen flex flex-col bg-[#F8FAF5] text-slate-800 relative pb-16">
        {/* Real-Time Extreme Weather Alert Banner at Top of App UI */}
        <ExtremeWeatherAlertBanner
          language={language}
          location={currentConditions.location}
          liveWeatherOverride={sharedWeather}
          onAskAIProtectionPlan={(prompt) => launchAIWithPrompt(prompt)}
        />

        {/* Recurring Local Growth Stage Notification Strip & Toast Manager */}
        <GrowthStageNotificationSystem
          language={language}
          savedPlans={savedPlans}
          fallbackCrops={topCrops.length > 0 ? topCrops : CROPS_DATA.slice(0, 3)}
          fallbackLocation={currentConditions.location}
          onNavigateToSaved={() => {
            setActivePage('saved');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onAskAIAboutStage={(prompt, cropName) => launchAIWithPrompt(prompt, cropName)}
          externalTriggerPlan={externalTriggeredPlan}
          onClearExternalTrigger={() => setExternalTriggeredPlan(null)}
        />

        {/* Header with Kannada & English Support */}
        <Header
          language={language}
          onLanguageChange={handleLanguageChange}
          isHighContrast={isHighContrast}
          onToggleContrast={() => setIsHighContrast(!isHighContrast)}
          isLargeFont={isLargeFont}
          onToggleFontSize={() => setIsLargeFont(!isLargeFont)}
          activePage={activePage}
          onPageChange={(page) => {
            setActivePage(page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          savedCount={savedPlans.length}
        />

        {/* Page Stepper Navigation Banner */}
        <div className="bg-white border-b border-emerald-100 py-2.5 shadow-2xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <div className="flex items-center gap-3 text-xs">
              <span className="font-bold text-emerald-800">
                Step {currentPageIndex + 1} of {PAGES.length}
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-sm font-bold text-slate-900 font-heading">
                {PAGES[currentPageIndex].label}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={goToPrevPage}
                disabled={currentPageIndex === 0}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors ${
                  currentPageIndex === 0
                    ? 'text-slate-300 cursor-not-allowed'
                    : 'bg-slate-50 border border-slate-200 text-slate-700 hover:bg-emerald-50 hover:text-emerald-800'
                }`}
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              <button
                onClick={goToNextPage}
                disabled={currentPageIndex === PAGES.length - 1}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors ${
                  currentPageIndex === PAGES.length - 1
                    ? 'text-slate-300 cursor-not-allowed'
                    : 'bg-emerald-700 text-white hover:bg-emerald-800 shadow-2xs'
                }`}
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1">
          {/* PAGE 1: Home, Live Farm Weather & Prominent APMC Market Intelligence */}
          {activePage === 'home' && (
            <div className="animate-in fade-in duration-300">
              <Hero
                language={language}
                onStartClick={() => {
                  setActivePage('wizard');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onCompareClick={() => {
                  setActivePage('compare');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onNavigatePage={(page) => {
                  setActivePage(page);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />

              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
                {/* Prominent APMC Market Intelligence Section right on Home */}
                <APMCMarketIntelligence
                  language={language}
                  userConditions={currentConditions}
                  recommendedCrops={topCrops.length > 0 ? topCrops : CROPS_DATA.slice(0, 3)}
                  onAskMarketAI={(prompt, cropName) => launchAIWithPrompt(prompt, cropName)}
                />

                {/* Live Farm Weather Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-extrabold text-slate-900 font-heading">
                      Live Farm Weather & Climate Desk
                    </h3>
                    <span className="text-xs font-medium text-slate-500">
                      Open-Meteo satellite & regional agro-meteorological feed
                    </span>
                  </div>
                  <WeatherWidget
                    language={language}
                    selectedLocation={currentConditions.location}
                    onLocationUpdate={(loc) =>
                      setCurrentConditions((c) => ({ ...c, location: loc }))
                    }
                    onWeatherFetched={(w) => setSharedWeather(w)}
                  />
                </div>

                {/* Action Banner to Crop Finder & Scheme Saathi */}
                <div className="p-8 rounded-3xl bg-gradient-to-r from-emerald-800 via-green-700 to-sky-800 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
                  <div className="space-y-1 text-center sm:text-left">
                    <span className="text-xs font-extrabold text-amber-300">
                      Know the Market. Choose the Crop. Grow Smarter.
                    </span>
                    <h4 className="text-2xl font-extrabold font-heading">
                      Ready to match your exact soil, water & government subsidies?
                    </h4>
                    <p className="text-sm text-emerald-100">
                      Run the 1-minute Crop Suitability Finder or explore Scheme Saathi subsidies.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 shrink-0">
                    <button
                      onClick={() => {
                        setActivePage('wizard');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="px-6 py-3.5 rounded-2xl bg-white text-emerald-950 hover:bg-emerald-50 font-extrabold text-sm shadow-lg transition-all flex items-center gap-2"
                    >
                      <span>Start Crop Finder</span>
                      <ArrowRight className="w-4 h-4 text-emerald-700" />
                    </button>

                    <button
                      onClick={() => {
                        setActivePage('schemes');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="px-5 py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-extrabold text-sm shadow-md transition-all"
                    >
                      <span>Open Scheme Saathi</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PAGE 2: Dedicated Mandi / APMC Market Intelligence */}
          {activePage === 'apmc' && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
              <APMCMarketIntelligence
                language={language}
                userConditions={currentConditions}
                recommendedCrops={topCrops.length > 0 ? topCrops : CROPS_DATA.slice(0, 3)}
                onAskMarketAI={(prompt, cropName) => launchAIWithPrompt(prompt, cropName)}
              />
            </div>
          )}

          {/* PAGE 3: Crop Finder Wizard */}
          {activePage === 'wizard' && (
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
              <RecommendationForm
                language={language}
                initialConditions={currentConditions}
                onSubmit={handleFormSubmit}
                isLoading={isLoading}
                recentSearches={recentSearches}
                onSelectRecent={handleLoadPlan}
              />
            </div>
          )}

          {/* PAGE 4: Recommendation Results (Suitability + APMC Price) */}
          {activePage === 'results' && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
              <RecommendationResults
                language={language}
                conditions={currentConditions}
                topCrops={topCrops}
                runnerUps={runnerUps}
                aiInsight={aiInsight}
                onSavePlan={handleSavePlan}
                isSaved={isCurrentPlanSaved}
                onCompareWith={handleCompareWith}
                onGoToCharts={() => {
                  setActivePage('charts');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onGoToWizard={() => {
                  setActivePage('wizard');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onGoToAPMC={() => {
                  setActivePage('apmc');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onGoToSchemes={() => {
                  setActivePage('schemes');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </div>
          )}

          {/* PAGE 5: Scheme Saathi — Government Scheme Finder */}
          {activePage === 'schemes' && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
              <SchemeSaathi
                language={language}
                userConditions={currentConditions}
                onAskSchemeAI={(prompt) => launchAIWithPrompt(prompt)}
              />
            </div>
          )}

          {/* PAGE 6: Ask BHUMITRA AI Assistant */}
          {activePage === 'ask' && (
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
              <AskAI
                language={language}
                selectedCropContext={
                  aiContextCrop || (topCrops.length > 0 ? topCrops[0].name : undefined)
                }
                farmConditions={currentConditions}
                initialPrompt={aiInitialPrompt}
                onClearInitialPrompt={() => setAiInitialPrompt('')}
              />
            </div>
          )}

          {/* PAGE 7: Recharts Nutrient (NPK) & Growth Cycle Charts */}
          {activePage === 'charts' && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in duration-300">
              <CropCharts
                language={language}
                crops={topCrops.length > 0 ? topCrops : CROPS_DATA.slice(0, 3)}
              />
            </div>
          )}

          {/* PAGE 8: Crop Comparison Matrix */}
          {activePage === 'compare' && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
              <CropComparison
                language={language}
                initialCrops={comparisonCrops.length > 0 ? comparisonCrops : topCrops}
              />
            </div>
          )}

          {/* PAGE 9: AI Help Desk (Daily Routine & Plant Doctor for Less Healthy Crops) */}
          {activePage === 'helpdesk' && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
              <AIHelpDesk
                language={language}
                selectedCrop={topCrops.length > 0 ? topCrops[0].name : undefined}
                selectedLocation={currentConditions.location}
              />
            </div>
          )}

          {/* PAGE 10: Saved Recommendations */}
          {activePage === 'saved' && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
              <SavedRecommendations
                language={language}
                savedPlans={savedPlans}
                onDeletePlan={handleDeletePlan}
                onToggleReminders={handleTogglePlanReminders}
                onTriggerPlanNotification={(plan) => setExternalTriggeredPlan(plan)}
                onLoadPlan={(conds) => {
                  handleLoadPlan(conds);
                  setActivePage('results');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              />
            </div>
          )}
        </main>

        {/* Footer */}
        <Footer
          language={language}
          onNavigate={(tab) => {
            setActivePage(tab);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />

        {/* Global Accessibility Audio Player Toolbar */}
        <AudioPlayerBar language={language} />
      </div>
    </TTSProvider>
  );
}
