import React from 'react';
import { Volume2, Pause, Play, Square, Gauge, X, VolumeX } from 'lucide-react';
import { useTTS } from '../context/TTSContext';
import { LanguageCode } from '../types';

interface AudioPlayerBarProps {
  language: LanguageCode;
}

export const AudioPlayerBar: React.FC<AudioPlayerBarProps> = ({ language }) => {
  const { isPlaying, isPaused, activeTitle, speechRate, setSpeechRate, pause, resume, stop } = useTTS();

  if (!isPlaying && !isPaused) return null;

  const toggleRate = () => {
    if (speechRate > 0.9) {
      setSpeechRate(0.8); // Slower, clearer speech
    } else {
      setSpeechRate(1.0); // Standard speed
    }
  };

  return (
    <aside
      aria-label="Audio Reader Player"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 bg-slate-900/95 text-white backdrop-blur-md px-4 py-3 rounded-2xl shadow-2xl border border-slate-700/80 flex items-center justify-between gap-3 animate-in slide-in-from-bottom-5 duration-200"
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {/* Pulsing audio animation icon */}
        <div className="w-9 h-9 rounded-xl bg-emerald-600/30 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
          {!isPaused ? (
            <div className="flex items-center gap-0.5 h-4">
              <span className="w-1 h-full bg-emerald-400 rounded-full animate-bounce" />
              <span className="w-1 h-3/4 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.15s]" />
              <span className="w-1 h-full bg-emerald-400 rounded-full animate-bounce [animation-delay:0.3s]" />
            </div>
          ) : (
            <Volume2 className="w-4 h-4 text-slate-400" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 block truncate">
            {isPaused ? 'Audio Paused (ವಿರಾಮ)' : 'Voice Reader Active (ಆಲಿಸುತ್ತಿದೆ)'}
          </span>
          <span className="text-xs font-bold text-white block truncate">
            {activeTitle || 'Agricultural Audio Advisory'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {/* Speed toggle button */}
        <button
          type="button"
          onClick={toggleRate}
          className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-mono font-bold text-slate-300 border border-slate-700 flex items-center gap-1 transition-colors"
          title="Toggle Speech Speed (Normal 1.0x vs Slow 0.8x for clear understanding)"
        >
          <Gauge className="w-3 h-3 text-emerald-400" />
          <span>{speechRate < 0.9 ? '0.8x Slow' : '1.0x'}</span>
        </button>

        {/* Play/Pause Button */}
        <button
          type="button"
          onClick={isPaused ? resume : pause}
          className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
          title={isPaused ? 'Resume Audio' : 'Pause Audio'}
        >
          {isPaused ? <Play className="w-4 h-4 fill-white" /> : <Pause className="w-4 h-4 fill-white" />}
        </button>

        {/* Stop Button */}
        <button
          type="button"
          onClick={stop}
          className="p-2 rounded-xl bg-slate-800 hover:bg-red-900/60 hover:text-red-300 text-slate-300 transition-colors"
          title="Stop Audio"
        >
          <Square className="w-4 h-4 fill-current" />
        </button>
      </div>
    </aside>
  );
};
