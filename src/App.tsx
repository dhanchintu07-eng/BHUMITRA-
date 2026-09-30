import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { WeatherWidget } from './components/WeatherWidget';
import { RecommendationForm } from './components/RecommendationForm';
import { RecommendationResults } from './components/RecommendationResults';
import { CropCharts } from './components/CropCharts';
import { AskAI } from './components/AskAI';
import { CropComparison } from './components/CropComparison';
import { AIHelpDesk } from './components/AIHelpDesk';
import { SavedRecommendations } from './components/SavedRecommendations';
import { Footer } from './components/Footer';
import { TTSProvider } from './context/TTSContext';
import { AudioPlayerBar } from './components/AudioPlayerBar';
import {
  Crop,
  UserFarmingConditions,
  LanguageCode,
  SavedPlan,
  RecentSearch,
  AppPage
} from './types';
import { runCropRecommendationEngine, CROPS_DATA } from './data/crops';
import {
  Home,
  SlidersHorizontal,
  Award,
  BarChart3,
  ArrowUpDown,
  MessageSquareCode,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Stethoscope
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
  const [hasGenerated, setHasGenerated] = useState(false);

  // Saved Plans & Recent Searches
  const [savedPlans, setSavedPlans] = useState<SavedPlan[]>(() => {
    try {
      const stored = localStorage.getItem('bhumitra_saved_plans');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
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

  // Sync Language
  const handleLanguageChange = (newLang: LanguageCode) => {
    setLanguage(newLang);
    localStorage.setItem('bhumitra_lang', newLang);
  };

  // Sync Accessibility Attributes
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

  // Initial calculation on load
  useEffect(() => {
    const initialResult = runCropRecommendationEngine(currentConditions);
    setTopCrops(initialResult.topCrops);
    setRunnerUps(initialResult.runnerUps);
    setAiInsight(
      'ಕರ್ನಾಟಕದ ಕೆಂಪು ಮಣ್ಣಿಗೆ ಮುಂಗಾರು ಹಂಗಾಮಿನಲ್ಲಿ ರಾಗಿ, ಶೇಂಗಾ ಅಥವಾ ಹತ್ತಿ ಅತ್ಯುತ್ತಮ. ಬಿತ್ತನೆಗೆ ಮುನ್ನ ಬೀಜೋಪಚಾರ ಮತ್ತು ಸಾವಯವ ಗೊಬ್ಬರ ಬಳಸಿ.'
    );
    setHasGenerated(true);
  }, []);

  // Form Submit Handler
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
      setHasGenerated(true);
    } catch (err) {
      console.warn('Backend call failed, using client-side agronomic engine:', err);
      const localResult = runCropRecommendationEngine(conditions);
      setTopCrops(localResult.topCrops);
      setRunnerUps(localResult.runnerUps);
      setAiInsight(
        `For ${conditions.soilType} soil in ${conditions.season} season with ${conditions.waterAvailability} water availability in ${conditions.location || 'your area'}: Prioritize certified seed treatment with bio-fungicide (Trichoderma 4g/kg). Maintain balanced fertilization and avoid moisture stress during flowering.`
      );
      setHasGenerated(true);
    } finally {
      setIsLoading(false);

      // Record in recent searches
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

      // Advance directly to Results Page (Page 3)
      setActivePage('results');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Save Current Plan to localStorage
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
    };

    setSavedPlans((prev) => {
      const updated = [newPlan, ...prev];
      localStorage.setItem('bhumitra_saved_plans', JSON.stringify(updated));
      return updated;
    });
  };

  const handleDeletePlan = (id: string) => {
    setSavedPlans((prev) => {
      const updated = prev.filter((p) => p.id !== id);
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
    { id: 'home', label: '1. Home & Weather', icon: Home },
    { id: 'wizard', label: '2. Crop Finder', icon: SlidersHorizontal },
    { id: 'results', label: '3. Recommendations', icon: Award },
    { id: 'charts', label: '4. NPK Charts', icon: BarChart3 },
    { id: 'compare', label: '5. Compare', icon: ArrowUpDown },
    { id: 'helpdesk', label: '6. AI Help Desk & Routine', icon: Stethoscope },
    { id: 'ask', label: '7. Ask AI', icon: MessageSquareCode },
    { id: 'saved', label: '8. Saved Plans', icon: Bookmark },
  ];

  const currentPageIndex = PAGES.findIndex((p) => p.id === activePage);

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

  return (
    <TTSProvider>
      <div className="min-h-screen flex flex-col bg-[#F8FAF5] text-slate-800 relative pb-16">
        {/* 3-Zone Header with Kannada & Accessibility */}
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

      {/* Page Stepper Navigation Banner (Page by Page Indicator) */}
      <div className="bg-white border-b border-emerald-100 py-3 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
              Page {currentPageIndex + 1} of {PAGES.length}
            </span>
            <span className="text-sm font-bold text-slate-800 hidden sm:inline font-heading">
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
              <span>Previous Page</span>
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
              <span>Next Page</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Single-Screen Content (Page by Page View) */}
      <main className="flex-1">
        {/* PAGE 1: Home & Live Farm Weather */}
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
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
              {/* Integrated Live Weather Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-extrabold text-slate-900 font-heading">
                    Live Farm Weather & Climate Desk
                  </h3>
                  <span className="text-xs font-medium text-slate-500">
                    Real-time field sensors and Open-Meteo satellite feed
                  </span>
                </div>
                <WeatherWidget
                  language={language}
                  selectedLocation={currentConditions.location}
                  onLocationUpdate={(loc) => setCurrentConditions((c) => ({ ...c, location: loc }))}
                />
              </div>

              {/* Action Banner to go to Page 2 */}
              <div className="p-8 rounded-3xl bg-gradient-to-r from-emerald-800 to-green-700 text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl shadow-emerald-900/10">
                <div className="space-y-1 text-center sm:text-left">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-200">
                    Step 1 Complete
                  </span>
                  <h4 className="text-2xl font-extrabold font-heading">
                    Ready to discover your field's highest yielding crops?
                  </h4>
                  <p className="text-sm text-emerald-100">
                    Takes only 1 minute. Enter your soil, season, rainfall, and water availability.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setActivePage('wizard');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-8 py-4 rounded-2xl bg-white text-emerald-900 hover:bg-emerald-50 font-extrabold text-base shadow-lg transition-all flex items-center gap-2 whitespace-nowrap shrink-0"
                >
                  <span>Start Crop Finder (Page 2)</span>
                  <ArrowRight className="w-5 h-5 text-emerald-700" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PAGE 2: Crop Finder Wizard */}
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

        {/* PAGE 3: Recommendation Results */}
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
            />
          </div>
        )}

        {/* PAGE 4: Recharts Nutrient (NPK) & Growth Cycle Charts */}
        {activePage === 'charts' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in duration-300">
            <CropCharts
              language={language}
              crops={topCrops.length > 0 ? topCrops : CROPS_DATA.slice(0, 3)}
            />

            {/* Stepper Navigation between Page 4 and other pages */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200">
              <button
                onClick={() => {
                  setActivePage('results');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors"
              >
                ← Back to Recommendations (Page 3)
              </button>

              <button
                onClick={() => {
                  setActivePage('compare');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Go to Crop Comparison (Page 5) →</span>
              </button>
            </div>
          </div>
        )}

        {/* PAGE 5: Crop Comparison Matrix */}
        {activePage === 'compare' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
            <CropComparison
              language={language}
              initialCrops={comparisonCrops.length > 0 ? comparisonCrops : topCrops}
            />

            {/* Stepper Navigation */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200 mt-8">
              <button
                onClick={() => {
                  setActivePage('charts');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors"
              >
                ← Back to NPK Charts (Page 4)
              </button>

              <button
                onClick={() => {
                  setActivePage('helpdesk');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Go to AI Help Desk & Routine (Page 6) →</span>
              </button>
            </div>
          </div>
        )}

        {/* PAGE 6: AI Help Desk (Daily Routine & Plant Doctor for Less Healthy Crops) */}
        {activePage === 'helpdesk' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
            <AIHelpDesk
              language={language}
              selectedCrop={topCrops.length > 0 ? topCrops[0].name : undefined}
              selectedLocation={currentConditions.location}
            />

            {/* Stepper Navigation */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-slate-200 mt-8">
              <button
                onClick={() => {
                  setActivePage('compare');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors"
              >
                ← Back to Compare (Page 5)
              </button>

              <button
                onClick={() => {
                  setActivePage('ask');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Go to Ask AI Agronomist (Page 7) →</span>
              </button>
            </div>
          </div>
        )}

        {/* PAGE 6: Ask BHUMITRA AI Agronomist */}
        {activePage === 'ask' && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
            <AskAI
              language={language}
              selectedCropContext={topCrops.length > 0 ? topCrops[0].name : undefined}
            />
          </div>
        )}

        {/* PAGE 7: Saved Recommendations */}
        {activePage === 'saved' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-300">
            <SavedRecommendations
              language={language}
              savedPlans={savedPlans}
              onDeletePlan={handleDeletePlan}
              onLoadPlan={(conds) => {
                handleLoadPlan(conds);
                setActivePage('results');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </div>
        )}
      </main>

      {/* Modern Indian Agriculture Trustworthy Footer */}
      <Footer language={language} onNavigate={(tab) => {
        setActivePage(tab);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }} />

      {/* Global Accessibility Audio Player Toolbar */}
      <AudioPlayerBar language={language} />
    </div>
  </TTSProvider>
  );
}
