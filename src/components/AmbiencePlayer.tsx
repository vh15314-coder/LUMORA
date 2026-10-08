import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AmbienceType } from '../types';
import {
  Volume2,
  VolumeX,
  Volume1,
  Play,
  Pause,
  Square,
  CloudRain,
  Waves,
  Trees,
  Flame,
  Moon,
  Music2,
  Bird,
  Sliders,
} from 'lucide-react';

export const AmbiencePlayer: React.FC = () => {
  const {
    isAmbiencePlaying,
    activeAmbience,
    ambienceVolume,
    isMuted,
    toggleAmbience,
    setAmbienceType,
    setAmbienceVolume,
    toggleMute,
    stopAmbience,
    user,
  } = useApp();

  const [isExpanded, setIsExpanded] = useState(false);

  const ambienceOptions: { type: AmbienceType; label: string; icon: React.ReactNode }[] = [
    { type: 'rain', label: 'Rain', icon: <CloudRain className="w-4 h-4" /> },
    { type: 'ocean', label: 'Ocean', icon: <Waves className="w-4 h-4" /> },
    { type: 'forest', label: 'Forest', icon: <Trees className="w-4 h-4" /> },
    { type: 'fireplace', label: 'Fireplace', icon: <Flame className="w-4 h-4" /> },
    { type: 'night', label: 'Night', icon: <Moon className="w-4 h-4" /> },
    { type: 'instrumental', label: 'Chimes', icon: <Music2 className="w-4 h-4" /> },
    { type: 'birds', label: 'Birds', icon: <Bird className="w-4 h-4" /> },
  ];

  if (user?.settings.quietMode) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/40 border border-slate-800 text-xs text-slate-500">
        <VolumeX className="w-4 h-4" />
        <span>Quiet Mode active (Sounds silenced)</span>
      </div>
    );
  }

  return (
    <div className="relative inline-flex flex-col rounded-2xl bg-slate-900/80 backdrop-blur-md border border-slate-800/80 shadow-lg text-slate-200 transition-all duration-200">
      <div className="flex items-center gap-2 p-2">
        {/* Play / Pause button */}
        <button
          onClick={toggleAmbience}
          aria-label={isAmbiencePlaying ? `Pause ${activeAmbience} soundscape` : `Play ${activeAmbience} soundscape`}
          className={`flex items-center justify-center w-11 h-11 rounded-xl transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
            isAmbiencePlaying
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          {isAmbiencePlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
        </button>

        {/* Ambience label & live indicator */}
        <div className="flex flex-col text-left pr-1 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
          <span className="text-xs font-semibold text-slate-200 capitalize flex items-center gap-1.5">
            {activeAmbience} Soundscape
            {isAmbiencePlaying && !isMuted && (
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            )}
            {isMuted && isAmbiencePlaying && (
              <span className="text-[10px] text-amber-400">(Muted)</span>
            )}
          </span>
          <span className="text-[11px] text-slate-400">
            {isAmbiencePlaying ? (isMuted ? 'Muted' : 'Playing softly') : 'Tap to start sound'}
          </span>
        </div>

        {/* Quick Mute Toggle */}
        <button
          onClick={toggleMute}
          title={isMuted ? 'Unmute' : 'Mute'}
          aria-label={isMuted ? 'Unmute soundscape' : 'Mute soundscape'}
          className="flex items-center justify-center w-9 h-9 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
        >
          {isMuted || ambienceVolume === 0 ? <VolumeX className="w-4 h-4 text-amber-400" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {/* Stop button */}
        {isAmbiencePlaying && (
          <button
            onClick={stopAmbience}
            title="Stop soundscape"
            aria-label="Stop soundscape"
            className="flex items-center justify-center w-9 h-9 rounded-lg text-slate-400 hover:text-rose-300 hover:bg-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
          </button>
        )}

        {/* Expand / Adjust Settings */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label="Toggle sound settings"
          className="flex items-center justify-center w-9 h-9 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors ml-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
        >
          <Sliders className="w-4 h-4" />
        </button>
      </div>

      {isExpanded && (
        <div className="p-3 pt-1 border-t border-slate-800/80 flex flex-col gap-3 min-w-[300px]">
          {/* Soundscape Type Selector */}
          <div className="grid grid-cols-4 gap-1.5 pt-2">
            {ambienceOptions.map((opt) => (
              <button
                key={opt.type}
                onClick={() => setAmbienceType(opt.type)}
                className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-[11px] font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 ${
                  activeAmbience === opt.type
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                    : 'bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {opt.icon}
                <span className="truncate">{opt.label}</span>
              </button>
            ))}
          </div>

          {/* Volume Slider & Mute */}
          <div className="flex items-center gap-2 pt-1 text-slate-400">
            <button
              onClick={toggleMute}
              className="p-1 hover:text-white transition-colors"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-amber-400" /> : <Volume1 className="w-4 h-4" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.02"
              value={isMuted ? 0 : ambienceVolume}
              onChange={(e) => {
                if (isMuted) toggleMute();
                setAmbienceVolume(parseFloat(e.target.value));
              }}
              aria-label="Soundscape volume"
              className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500 focus-visible:outline-none"
            />
            <span className="text-[11px] font-mono text-slate-400 w-9 text-right">
              {isMuted ? '0%' : `${Math.round(ambienceVolume * 100)}%`}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
