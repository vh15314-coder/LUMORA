import React, { useState } from 'react';
import { RefreshCw, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  popped: boolean;
}

export const BubblePop: React.FC = () => {
  const { user } = useApp();
  const isQuiet = user?.settings.quietMode;

  const playPopSound = () => {
    if (isQuiet) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      const freq = 450 + Math.random() * 350;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.8, ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.07);
    } catch {
      // Ignore
    }
  };

  const generateBubbles = (): Bubble[] => {
    const bubbleColors = [
      'rgba(129, 140, 248, 0.4)',
      'rgba(167, 139, 250, 0.4)',
      'rgba(56, 189, 248, 0.4)',
      'rgba(52, 211, 153, 0.4)',
      'rgba(244, 114, 182, 0.4)',
    ];

    const list: Bubble[] = [];
    for (let i = 0; i < 24; i++) {
      list.push({
        id: i,
        x: 6 + (i % 6) * 15 + (Math.random() * 4 - 2),
        y: 10 + Math.floor(i / 6) * 22 + (Math.random() * 4 - 2),
        size: 44 + Math.floor(Math.random() * 22),
        color: bubbleColors[i % bubbleColors.length],
        popped: false,
      });
    }
    return list;
  };

  const [bubbles, setBubbles] = useState<Bubble[]>(generateBubbles);
  const [poppedCount, setPoppedCount] = useState(0);

  const popBubble = (id: number) => {
    setBubbles((prev) =>
      prev.map((b) => {
        if (b.id === id && !b.popped) {
          playPopSound();
          setPoppedCount((c) => c + 1);
          return { ...b, popped: true };
        }
        return b;
      })
    );
  };

  const handleReset = () => {
    setBubbles(generateBubbles());
    setPoppedCount(0);
  };

  return (
    <div className="flex flex-col items-center justify-between w-full max-w-xl mx-auto rounded-3xl bg-slate-900/60 backdrop-blur-md border border-slate-800 p-6 shadow-xl text-slate-200">
      <div className="flex items-center justify-between w-full mb-4">
        <div>
          <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            Mindful Bubble Pop
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            No timers, no penalties, no scoreboard. Pop freely at your own calm pace.
          </p>
        </div>

        <button
          onClick={handleReset}
          aria-label="Refresh bubbles"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>New Bubbles</span>
        </button>
      </div>

      {/* Bubble Play Field */}
      <div className="relative w-full h-[320px] rounded-2xl bg-slate-950/70 border border-slate-800/80 overflow-hidden shadow-inner">
        {bubbles.map((bubble) => {
          if (bubble.popped) return null;
          return (
            <button
              key={bubble.id}
              onClick={() => popBubble(bubble.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  popBubble(bubble.id);
                }
              }}
              style={{
                left: `${bubble.x}%`,
                top: `${bubble.y}%`,
                width: `${bubble.size}px`,
                height: `${bubble.size}px`,
                backgroundColor: bubble.color,
                boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.4), 0 4px 10px rgba(0,0,0,0.2)',
              }}
              aria-label="Pop bubble"
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/30 backdrop-blur-xs transition-transform duration-150 hover:scale-110 active:scale-90 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
            >
              {/* Highlight glimmer */}
              <span className="absolute top-1.5 left-2 w-2 h-2 rounded-full bg-white/70 pointer-events-none" />
            </button>
          );
        })}

        {bubbles.every((b) => b.popped) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
            <span className="text-2xl mb-1">✨</span>
            <p className="text-sm font-medium text-slate-200">All clear and peaceful.</p>
            <p className="text-xs text-slate-400 mt-1">Take a deep, slow breath.</p>
            <button
              onClick={handleReset}
              className="mt-3 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white shadow-md transition-colors"
            >
              Pop More
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between w-full mt-4 text-xs text-slate-400">
        <span>Popped gently: {poppedCount}</span>
        <span className="italic">Click or tap any bubble</span>
      </div>
    </div>
  );
};
