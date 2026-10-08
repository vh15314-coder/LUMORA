import React from 'react';
import { useApp } from '../../context/AppContext';
import { Droplets, Sun, Sparkles, RefreshCw } from 'lucide-react';

export const GrowPlant: React.FC = () => {
  const { plantProgress, waterPlant, sunPlant, harvestAndReplant } = useApp();
  const { stage, waterCount, sunCount, flowersHarvested, plantName } = plantProgress;

  const stageDescriptions = {
    seed: 'A quiet seed nestled in warm, nourishing soil.',
    sprout: 'A tiny green shoot reaching upward into the gentle air.',
    plant: 'A thriving stem unfolding soft, healthy leaves.',
    flower: 'A full moonlit bloom radiating calm fragrance.',
  };

  const renderPlantGraphic = () => {
    switch (stage) {
      case 'seed':
        return (
          <svg viewBox="0 0 120 120" className="w-40 h-40">
            {/* Pot */}
            <path d="M30 75 L40 110 L80 110 L90 75 Z" fill="#78350f" />
            <ellipse cx="60" cy="75" rx="30" ry="8" fill="#5c2607" />
            {/* Soil */}
            <ellipse cx="60" cy="76" rx="28" ry="7" fill="#451a03" />
            {/* Seed */}
            <ellipse cx="60" cy="74" rx="6" ry="4" fill="#a16207" />
          </svg>
        );
      case 'sprout':
        return (
          <svg viewBox="0 0 120 120" className="w-40 h-40">
            {/* Pot */}
            <path d="M30 75 L40 110 L80 110 L90 75 Z" fill="#78350f" />
            <ellipse cx="60" cy="75" rx="30" ry="8" fill="#5c2607" />
            <ellipse cx="60" cy="76" rx="28" ry="7" fill="#451a03" />
            {/* Stem */}
            <path d="M60 74 Q60 55 60 48" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" fill="none" />
            {/* Leaves */}
            <path d="M60 54 Q48 50 48 44 Q56 42 60 52" fill="#4ade80" />
            <path d="M60 50 Q72 46 72 40 Q64 38 60 48" fill="#4ade80" />
          </svg>
        );
      case 'plant':
        return (
          <svg viewBox="0 0 120 120" className="w-40 h-40">
            {/* Pot */}
            <path d="M30 75 L40 110 L80 110 L90 75 Z" fill="#78350f" />
            <ellipse cx="60" cy="75" rx="30" ry="8" fill="#5c2607" />
            <ellipse cx="60" cy="76" rx="28" ry="7" fill="#451a03" />
            {/* Stem */}
            <path d="M60 74 Q62 48 60 30" stroke="#16a34a" strokeWidth="5" strokeLinecap="round" fill="none" />
            {/* Big Leaves */}
            <path d="M60 56 Q38 52 36 42 Q52 38 60 50" fill="#22c55e" />
            <path d="M60 48 Q82 44 84 34 Q68 30 60 42" fill="#22c55e" />
            <path d="M60 36 Q42 32 44 24 Q56 22 60 32" fill="#4ade80" />
            <path d="M60 32 Q78 28 76 20 Q64 18 60 28" fill="#4ade80" />
          </svg>
        );
      case 'flower':
        return (
          <svg viewBox="0 0 120 120" className="w-40 h-40 drop-shadow-md">
            {/* Pot */}
            <path d="M30 75 L40 110 L80 110 L90 75 Z" fill="#78350f" />
            <ellipse cx="60" cy="75" rx="30" ry="8" fill="#5c2607" />
            <ellipse cx="60" cy="76" rx="28" ry="7" fill="#451a03" />
            {/* Stem & Leaves */}
            <path d="M60 74 Q60 45 60 26" stroke="#16a34a" strokeWidth="5" strokeLinecap="round" fill="none" />
            <path d="M60 54 Q40 50 38 42 Q52 38 60 48" fill="#22c55e" />
            <path d="M60 46 Q80 42 82 34 Q68 30 60 40" fill="#22c55e" />
            {/* Blossom Petals */}
            <g transform="translate(60, 24)">
              <circle cx="0" cy="-12" r="8" fill="#f472b6" />
              <circle cx="11" cy="-4" r="8" fill="#f472b6" />
              <circle cx="7" cy="9" r="8" fill="#f472b6" />
              <circle cx="-7" cy="9" r="8" fill="#f472b6" />
              <circle cx="-11" cy="-4" r="8" fill="#f472b6" />
              <circle cx="0" cy="0" r="7" fill="#fbbf24" />
            </g>
          </svg>
        );
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto rounded-3xl bg-slate-900/60 backdrop-blur-md border border-slate-800 p-6 shadow-xl text-slate-200">
      <div className="flex items-center justify-between w-full mb-3">
        <div>
          <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            {plantName}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">{stageDescriptions[stage]}</p>
        </div>

        <div className="text-right">
          <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider block">
            {stage}
          </span>
          <span className="text-[11px] text-slate-400">
            Harvested: {flowersHarvested}
          </span>
        </div>
      </div>

      {/* Visual Plant graphic */}
      <div className="flex items-center justify-center w-full py-4 bg-slate-950/50 rounded-2xl border border-slate-800/80 mb-5">
        {renderPlantGraphic()}
      </div>

      {/* Care buttons */}
      {stage !== 'flower' ? (
        <div className="grid grid-cols-2 gap-3 w-full">
          <button
            onClick={waterPlant}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-sky-950/60 hover:bg-sky-900/80 text-sky-300 border border-sky-800/80 font-medium text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
          >
            <Droplets className="w-4 h-4 text-sky-400" />
            <span>Water Plant ({waterCount})</span>
          </button>

          <button
            onClick={sunPlant}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-amber-950/60 hover:bg-amber-900/80 text-amber-300 border border-amber-800/80 font-medium text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
          >
            <Sun className="w-4 h-4 text-amber-400" />
            <span>Gentle Sunlight ({sunCount})</span>
          </button>
        </div>
      ) : (
        <div className="w-full text-center">
          <p className="text-xs text-emerald-300 mb-3 font-medium">
            Your gentle flower is in full bloom! You can enjoy its presence or plant a new seed.
          </p>
          <button
            onClick={harvestAndReplant}
            className="flex items-center justify-center gap-2 mx-auto py-2.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs shadow-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Plant a New Seed</span>
          </button>
        </div>
      )}
    </div>
  );
};
