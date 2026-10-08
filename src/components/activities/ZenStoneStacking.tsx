import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, RefreshCw, Layers, Wind, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface Stone {
  id: string;
  name: string;
  width: number;
  height: number;
  color: string;
  borderColor: string;
  texture: string;
  weight: number;
}

const AVAILABLE_STONES: Omit<Stone, 'id'>[] = [
  {
    name: 'Foundation Basalt',
    width: 170,
    height: 38,
    color: 'from-slate-700 to-slate-800',
    borderColor: 'border-slate-600',
    texture: 'River basalt',
    weight: 20,
  },
  {
    name: 'Smooth Granite',
    width: 145,
    height: 34,
    color: 'from-stone-600 to-stone-700',
    borderColor: 'border-stone-500',
    texture: 'Granite slate',
    weight: 16,
  },
  {
    name: 'River Slate',
    width: 125,
    height: 30,
    color: 'from-zinc-600 to-zinc-700',
    borderColor: 'border-zinc-500',
    texture: 'Blue slate',
    weight: 12,
  },
  {
    name: 'Jade Pebble',
    width: 105,
    height: 28,
    color: 'from-emerald-800 to-teal-900',
    borderColor: 'border-emerald-600/60',
    texture: 'Polished jade',
    weight: 10,
  },
  {
    name: 'Amber Quartz',
    width: 85,
    height: 26,
    color: 'from-amber-700 to-amber-900',
    borderColor: 'border-amber-600/60',
    texture: 'Sun quartz',
    weight: 7,
  },
  {
    name: 'Amethyst Shard',
    width: 68,
    height: 24,
    color: 'from-purple-800 to-indigo-900',
    borderColor: 'border-purple-500/60',
    texture: 'Lilac crystal',
    weight: 5,
  },
  {
    name: 'Moonstone Cap',
    width: 52,
    height: 22,
    color: 'from-indigo-400 to-slate-300',
    borderColor: 'border-indigo-300',
    texture: 'Luminous moonstone',
    weight: 3,
  },
];

export const ZenStoneStacking: React.FC = () => {
  const { user } = useApp();
  const isQuiet = user?.settings.quietMode;

  const [stackedStones, setStackedStones] = useState<Stone[]>([]);
  const [wobble, setWobble] = useState<number>(0);
  const [isBalanced, setIsBalanced] = useState<boolean>(true);
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [nextStoneIndex, setNextStoneIndex] = useState<number>(0);

  // Web Audio sound synthesizer for stones
  const playStoneClink = (pitchMultiplier: number = 1) => {
    if (isQuiet) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      // Organic low-frequency thud
      const thudOsc = ctx.createOscillator();
      const thudGain = ctx.createGain();
      thudOsc.type = 'triangle';
      thudOsc.frequency.setValueAtTime(180 * pitchMultiplier, ctx.currentTime);
      thudOsc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.1);
      thudGain.gain.setValueAtTime(0.09, ctx.currentTime);
      thudGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      thudOsc.connect(thudGain);
      thudGain.connect(ctx.destination);
      thudOsc.start();
      thudOsc.stop(ctx.currentTime + 0.13);

      // Glassy mineral clink harmonic
      const clinkOsc = ctx.createOscillator();
      const clinkGain = ctx.createGain();
      clinkOsc.type = 'sine';
      clinkOsc.frequency.setValueAtTime(850 * pitchMultiplier, ctx.currentTime);
      clinkGain.gain.setValueAtTime(0.04, ctx.currentTime);
      clinkGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3);
      clinkOsc.connect(clinkGain);
      clinkGain.connect(ctx.destination);
      clinkOsc.start();
      clinkOsc.stop(ctx.currentTime + 0.32);
    } catch {
      // Audio fallback
    }
  };

  const playChimeHarmonic = () => {
    if (isQuiet) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const notes = [528, 660, 792, 1056];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
        gain.gain.setValueAtTime(0.03, ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.08 + 1.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 1.3);
      });
    } catch {}
  };

  const addStone = () => {
    if (nextStoneIndex >= AVAILABLE_STONES.length) return;
    const baseStone = AVAILABLE_STONES[nextStoneIndex];
    const newStone: Stone = {
      ...baseStone,
      id: `stone_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    };

    const newStack = [newStone, ...stackedStones];
    setStackedStones(newStack);
    setNextStoneIndex((idx) => idx + 1);

    // Calculate stability
    const count = newStack.length;
    playStoneClink(1 + count * 0.12);

    // Gentle wobble animation
    const randomWobble = (Math.random() * 4 - 2) * (count * 0.4);
    setWobble(randomWobble);
    setTimeout(() => setWobble(0), 400);

    if (count === 3) {
      setSuccessMessage('Peaceful Cairn established · 3 stones balanced');
      playChimeHarmonic();
    } else if (count === 5) {
      setSuccessMessage('Harmonious Balance achieved · Mind is settling');
      playChimeHarmonic();
    } else if (count === 7) {
      setSuccessMessage('Master of Zen Equilibrium · Pure Sanctuary Serenity');
      playChimeHarmonic();
    }
  };

  const removeTopStone = () => {
    if (stackedStones.length === 0) return;
    setStackedStones((prev) => prev.slice(1));
    setNextStoneIndex((idx) => Math.max(0, idx - 1));
    setSuccessMessage('');
    playStoneClink(0.9);
  };

  const resetStack = () => {
    setStackedStones([]);
    setNextStoneIndex(0);
    setSuccessMessage('');
    setWobble(0);
  };

  const nextAvailable = AVAILABLE_STONES[nextStoneIndex];

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto rounded-3xl bg-slate-900/60 backdrop-blur-md border border-slate-800 p-6 shadow-xl text-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between w-full mb-4">
        <div>
          <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            Zen Stone Stacking (Cairn)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Balance smooth river pebbles one by one. Cultivate patience and stillness.
          </p>
        </div>

        <button
          onClick={resetStack}
          title="Reset stone tower"
          aria-label="Reset stone tower"
          className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-400 hover:text-white transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Success Notification */}
      {successMessage && (
        <div className="w-full mb-4 px-4 py-2.5 rounded-2xl bg-emerald-950/60 border border-emerald-800/60 flex items-center gap-2 text-xs text-emerald-300 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Cairn Stacking Stage */}
      <div className="relative w-full h-80 rounded-2xl bg-gradient-to-b from-slate-950/70 via-slate-900/40 to-slate-950/90 border border-slate-800/80 flex flex-col items-center justify-end pb-8 overflow-hidden">
        {/* Soft atmospheric background sun & clouds */}
        <div className="absolute top-6 w-20 h-20 rounded-full bg-amber-500/10 blur-xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_var(--tw-gradient-stops))] from-indigo-950/20 via-transparent to-transparent pointer-events-none" />

        {/* Stack of Stones */}
        <div
          className="flex flex-col items-center gap-1 transition-transform duration-300"
          style={{ transform: `rotate(${wobble}deg)` }}
        >
          {stackedStones.map((stone, idx) => {
            const isTop = idx === 0;
            return (
              <div
                key={stone.id}
                style={{ width: `${stone.width}px`, height: `${stone.height}px` }}
                className={`relative rounded-[40px] bg-gradient-to-b ${stone.color} border ${stone.borderColor} shadow-lg shadow-black/40 flex items-center justify-center transition-all duration-300 ${
                  isTop ? 'scale-100 ring-1 ring-white/20' : ''
                }`}
              >
                {/* Stone surface highlight */}
                <div className="absolute top-1 inset-x-3 h-1.5 rounded-full bg-white/20 blur-[1px]" />
                <span className="text-[10px] text-slate-300/80 font-medium select-none pointer-events-none tracking-tight">
                  {stone.texture}
                </span>
              </div>
            );
          })}
        </div>

        {/* River Shore Platform */}
        <div className="w-64 h-5 rounded-full bg-slate-800 border-t border-slate-700/80 shadow-inner mt-1 flex items-center justify-center">
          <span className="text-[9px] text-slate-500 tracking-wider uppercase font-semibold">
            Zen Shore Platform
          </span>
        </div>
      </div>

      {/* Controls & Next Stone */}
      <div className="w-full mt-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {nextAvailable ? (
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <span className="text-slate-400">Next stone:</span>
              <span className="font-semibold text-white px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700">
                {nextAvailable.name}
              </span>
            </div>
          ) : (
            <span className="text-xs text-emerald-400 font-medium">All stones placed in harmony!</span>
          )}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {stackedStones.length > 0 && (
            <button
              onClick={removeTopStone}
              className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-medium transition-colors"
            >
              Take Top Stone
            </button>
          )}

          {nextAvailable && (
            <button
              onClick={addStone}
              className="flex-1 sm:flex-none px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Balance Stone ({stackedStones.length + 1}/7)</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
