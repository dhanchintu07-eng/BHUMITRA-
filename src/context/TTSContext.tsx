import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { LanguageCode } from '../types';

export interface TTSContextType {
  isSupported: boolean;
  isPlaying: boolean;
  isPaused: boolean;
  activeId: string | null;
  activeTitle: string | null;
  speechRate: number; // 0.85 (Slow) or 1.0 (Normal)
  setSpeechRate: (rate: number) => void;
  speak: (id: string, title: string, text: string, lang?: LanguageCode) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
}

const TTSContext = createContext<TTSContextType | undefined>(undefined);

const LANGUAGE_VOICE_MAP: Record<LanguageCode, string[]> = {
  kn: ['kn-IN', 'kn', 'en-IN'],
  hi: ['hi-IN', 'hi', 'en-IN'],
  pa: ['pa-IN', 'pa', 'hi-IN', 'en-IN'],
  mr: ['mr-IN', 'mr', 'hi-IN', 'en-IN'],
  te: ['te-IN', 'te', 'en-IN'],
  ta: ['ta-IN', 'ta', 'en-IN'],
  en: ['en-IN', 'en-GB', 'en-US', 'en'],
};

export const TTSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isSupported, setIsSupported] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeTitle, setActiveTitle] = useState<string | null>(null);
  const [speechRate, setSpeechRate] = useState<number>(0.92); // Slightly deliberate speed for clear farmer listening
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);

      const updateVoices = () => {
        const availableVoices = window.speechSynthesis.getVoices();
        if (availableVoices && availableVoices.length > 0) {
          setVoices(availableVoices);
        }
      };

      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }, []);

  const findBestVoice = (lang: LanguageCode): SpeechSynthesisVoice | null => {
    if (!voices || voices.length === 0) return null;
    const preferredLocales = LANGUAGE_VOICE_MAP[lang] || ['en-IN', 'en'];

    for (const locale of preferredLocales) {
      const match = voices.find(
        (v) => v.lang.toLowerCase() === locale.toLowerCase() || v.lang.toLowerCase().startsWith(locale.toLowerCase())
      );
      if (match) return match;
    }

    // Default to any Indian English voice if available
    const indianVoice = voices.find((v) => v.lang.toLowerCase().includes('in'));
    if (indianVoice) return indianVoice;

    return voices[0] || null;
  };

  const stop = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    currentUtteranceRef.current = null;
    setIsPlaying(false);
    setIsPaused(false);
    setActiveId(null);
    setActiveTitle(null);
  };

  const pause = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && isPlaying) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const resume = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  };

  const cleanTextForSpeech = (rawText: string): string => {
    return rawText
      .replace(/[*_#`~[\]]/g, '') // remove markdown symbols
      .replace(/https?:\/\/\S+/g, '') // remove urls
      .replace(/\s+/g, ' ') // normalize spaces
      .trim();
  };

  const speak = (id: string, title: string, text: string, lang: LanguageCode = 'en') => {
    if (!isSupported) {
      alert('Speech synthesis is not supported on this browser.');
      return;
    }

    // If clicking on currently playing item, toggle pause / stop
    if (activeId === id) {
      if (isPlaying && !isPaused) {
        pause();
        return;
      } else if (isPlaying && isPaused) {
        resume();
        return;
      } else {
        stop();
        return;
      }
    }

    // Cancel any previous audio
    stop();

    const cleanText = cleanTextForSpeech(text);
    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = speechRate;
    utterance.pitch = 1.0;

    const matchedVoice = findBestVoice(lang);
    if (matchedVoice) {
      utterance.voice = matchedVoice;
      utterance.lang = matchedVoice.lang;
    } else {
      utterance.lang = lang === 'kn' ? 'kn-IN' : lang === 'hi' ? 'hi-IN' : lang === 'ta' ? 'ta-IN' : lang === 'te' ? 'te-IN' : 'en-IN';
    }

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
      setActiveId(id);
      setActiveTitle(title);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      setActiveId(null);
      setActiveTitle(null);
      currentUtteranceRef.current = null;
    };

    utterance.onerror = (e) => {
      // Ignore normal cancel/interrupted events
      if (e.error !== 'canceled' && e.error !== 'interrupted') {
        console.warn('Speech synthesis error:', e);
      }
      setIsPlaying(false);
      setIsPaused(false);
      setActiveId(null);
      setActiveTitle(null);
      currentUtteranceRef.current = null;
    };

    currentUtteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  return (
    <TTSContext.Provider
      value={{
        isSupported,
        isPlaying,
        isPaused,
        activeId,
        activeTitle,
        speechRate,
        setSpeechRate,
        speak,
        pause,
        resume,
        stop,
      }}
    >
      {children}
    </TTSContext.Provider>
  );
};

export const useTTS = (): TTSContextType => {
  const context = useContext(TTSContext);
  if (!context) {
    throw new Error('useTTS must be used within a TTSProvider');
  }
  return context;
};
