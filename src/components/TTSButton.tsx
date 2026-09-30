import React from 'react';
import { Volume2, VolumeX, Pause, Play } from 'lucide-react';
import { useTTS } from '../context/TTSContext';
import { LanguageCode } from '../types';

interface TTSButtonProps {
  id: string;
  title: string;
  textToSpeak: string;
  language: LanguageCode;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'subtle' | 'pill';
  labelOverride?: string;
  className?: string;
}

const LISTEN_LABELS: Record<LanguageCode, { listen: string; playing: string; paused: string; stop: string }> = {
  kn: { listen: 'ಕೇಳಿ (Listen)', playing: 'ಆಲಿಸುತ್ತಿದೆ...', paused: 'ವಿರಾಮ', stop: 'ನಿಲ್ಲಿಸಿ' },
  hi: { listen: 'सुनें (Listen)', playing: 'चल रहा है...', paused: 'रुका हुआ', stop: 'रोकें' },
  pa: { listen: 'ਸੁਣੋ (Listen)', playing: 'ਚੱਲ ਰਿਹਾ ਹੈ...', paused: 'ਰੁਕਿਆ', stop: 'ਰੋਕੋ' },
  mr: { listen: 'ऐका (Listen)', playing: 'सुरू आहे...', paused: 'थांबवले', stop: 'थाಂಬವಾ' },
  te: { listen: 'వినండి (Listen)', playing: 'వింటున్నారు...', paused: 'ఆగింది', stop: 'ఆపండి' },
  ta: { listen: 'கேளுங்கள் (Listen)', playing: 'ஒலிக்கிறது...', paused: 'நிறுத்தப்பட்டது', stop: 'நிறுத்து' },
  en: { listen: 'Listen', playing: 'Playing...', paused: 'Paused', stop: 'Stop' },
};

export const TTSButton: React.FC<TTSButtonProps> = ({
  id,
  title,
  textToSpeak,
  language,
  size = 'md',
  variant = 'secondary',
  labelOverride,
  className = '',
}) => {
  const { isSupported, isPlaying, isPaused, activeId, speak, pause, resume, stop } = useTTS();

  if (!isSupported) return null;

  const isCurrentActive = activeId === id;
  const isCurrentPlaying = isCurrentActive && isPlaying && !isPaused;
  const isCurrentPaused = isCurrentActive && isPlaying && isPaused;

  const labels = LISTEN_LABELS[language] || LISTEN_LABELS.en;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCurrentPlaying) {
      pause();
    } else if (isCurrentPaused) {
      resume();
    } else {
      speak(id, title, textToSpeak, language);
    }
  };

  const handleStop = (e: React.MouseEvent) => {
    e.stopPropagation();
    stop();
  };

  // Size styling
  const sizeClasses = {
    sm: 'px-2.5 py-1 text-xs gap-1.5',
    md: 'px-3.5 py-1.5 text-xs sm:text-sm gap-2',
    lg: 'px-5 py-2.5 text-sm sm:text-base gap-2.5 font-bold',
  }[size];

  // Base styling variants
  let variantClasses = '';
  if (isCurrentPlaying) {
    variantClasses = 'bg-amber-100 text-amber-900 border-amber-300 ring-2 ring-amber-400/40 shadow-xs animate-pulse';
  } else if (isCurrentPaused) {
    variantClasses = 'bg-amber-50 text-amber-800 border-amber-200 shadow-2xs';
  } else {
    switch (variant) {
      case 'primary':
        variantClasses = 'bg-emerald-700 hover:bg-emerald-800 text-white border-transparent shadow-xs';
        break;
      case 'pill':
        variantClasses = 'bg-white/90 hover:bg-white text-emerald-900 border-emerald-200 shadow-2xs rounded-full';
        break;
      case 'subtle':
        variantClasses = 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-transparent';
        break;
      case 'secondary':
      default:
        variantClasses = 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border-emerald-200/80 shadow-2xs';
        break;
    }
  }

  const roundedClasses = variant === 'pill' ? 'rounded-full' : 'rounded-xl';

  return (
    <div className="inline-flex items-center gap-1">
      <button
        type="button"
        onClick={handleClick}
        className={`inline-flex items-center justify-center font-bold border transition-all cursor-pointer select-none active:scale-95 ${sizeClasses} ${variantClasses} ${roundedClasses} ${className}`}
        title={isCurrentPlaying ? 'Click to Pause' : isCurrentPaused ? 'Click to Resume' : `Listen to ${title}`}
        aria-label={`Listen to ${title}`}
      >
        {isCurrentPlaying ? (
          <>
            {/* Animated soundwave bars */}
            <div className="flex items-center gap-0.5 h-3.5 w-3.5 mr-0.5">
              <span className="w-0.5 h-full bg-amber-700 rounded-full animate-bounce" />
              <span className="w-0.5 h-2/3 bg-amber-700 rounded-full animate-bounce [animation-delay:0.15s]" />
              <span className="w-0.5 h-full bg-amber-700 rounded-full animate-bounce [animation-delay:0.3s]" />
            </div>
            <span>{labelOverride || labels.playing}</span>
          </>
        ) : isCurrentPaused ? (
          <>
            <Play className="w-3.5 h-3.5 text-amber-700 fill-amber-700" />
            <span>{labels.paused}</span>
          </>
        ) : (
          <>
            <Volume2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
            <span>{labelOverride || labels.listen}</span>
          </>
        )}
      </button>

      {/* Quick Stop Button when currently active */}
      {isCurrentActive && (
        <button
          type="button"
          onClick={handleStop}
          className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs transition-colors"
          title="Stop reading"
          aria-label="Stop reading"
        >
          <VolumeX className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
