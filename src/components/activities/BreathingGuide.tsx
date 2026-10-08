import React, { useEffect, useState } from 'react';
import { Play, Pause, Wind } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const BreathingGuide: React.FC = () => {
  const { user } = useApp();
  const [isActive, setIsActive] = useState<boolean>(true);
  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [timer, setTimer] = useState<number>(4);

  // 4-7-8 rhythm: Inhale 4s, Hold 7s, Exhale 8s
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev > 1) {
          return prev - 1;
        } else {
          // Switch phase
          if (phase === 'Inhale') {
            setPhase('Hold');
            return 7;
          } else if (phase === 'Hold') {
            setPhase('Exhale');
            return 8;
          } else {
            setPhase('Inhale');
            return 4;
          }
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, phase]);

  const scaleClass =
    phase === 'Inhale'
      ? 'scale-125 duration-[4000ms]'
      : phase === 'Hold'
      ? 'scale-125 duration-0'
      : 'scale-90 duration-[8000ms]';

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-xl mx-auto rounded-3xl bg-slate-900/60 backdrop-blur-md border border-slate-800 p-6 shadow-xl text-slate-200">
      <div className="flex items-center justify-between w-full mb-4">
        <div>
          <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
            <Wind className="w-4 h-4 text-sky-400" />
            4-7-8 Centering Breath
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Calms the nervous system, lowers heart rate, and grounds restless thoughts.
          </p>
        </div>

        <button
          onClick={() => setIsActive(!isActive)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
        >
          {isActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span>{isActive ? 'Pause' : 'Resume'}</span>
        </button>
      </div>

      {/* Breathing Circle Visual */}
      <div className="relative flex items-center justify-center w-56 h-56 my-4">
        {/* Soft outer glow */}
        <div
          className={`absolute inset-0 rounded-full bg-sky-500/15 blur-xl transition-transform ease-in-out ${scaleClass}`}
        />

        {/* Main pulsating circle */}
        <div
          className={`w-40 h-40 rounded-full border-2 border-sky-400/50 bg-gradient-to-tr from-indigo-950/60 to-sky-900/40 flex flex-col items-center justify-center transition-transform ease-in-out shadow-lg ${scaleClass}`}
        >
          <span className="text-sm font-semibold tracking-wide text-sky-200 uppercase">
            {phase}
          </span>
          <span className="text-2xl font-mono font-bold text-white mt-1">
            {timer}s
          </span>
        </div>
      </div>

      <div className="flex items-center gap-6 mt-2 text-xs text-slate-400">
        <span className={phase === 'Inhale' ? 'text-sky-300 font-semibold' : ''}>
          4s Inhale
        </span>
        <span aria-hidden="true">·</span>
        <span className={phase === 'Hold' ? 'text-sky-300 font-semibold' : ''}>
          7s Hold
        </span>
        <span aria-hidden="true">·</span>
        <span className={phase === 'Exhale' ? 'text-sky-300 font-semibold' : ''}>
          8s Release
        </span>
      </div>
    </div>
  );
};
