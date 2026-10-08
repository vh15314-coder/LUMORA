import React, { useRef, useState, useEffect } from 'react';
import { Sparkles, RefreshCw, Eraser, Flower, CircleDot, Waves, Dot } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface GardenItem {
  id: string;
  type: 'stone' | 'moss' | 'petal';
  x: number;
  y: number;
  size: number;
  rotation: number;
}

export const ZenSandGarden: React.FC = () => {
  const { user } = useApp();
  const isQuiet = user?.settings.quietMode;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [tool, setTool] = useState<'rake-wave' | 'rake-line' | 'smooth' | 'add-stone' | 'add-petal'>('rake-wave');
  const [items, setItems] = useState<GardenItem[]>([
    { id: '1', type: 'stone', x: 120, y: 130, size: 28, rotation: 15 },
    { id: '2', type: 'moss', x: 340, y: 180, size: 24, rotation: -20 },
    { id: '3', type: 'petal', x: 220, y: 90, size: 14, rotation: 45 },
  ]);
  const [isDrawing, setIsDrawing] = useState(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  // Soft sound of raking sand
  const playRakeSound = () => {
    if (isQuiet) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const bufferSize = ctx.sampleRate * 0.08;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.08;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, ctx.currentTime);
      filter.Q.setValueAtTime(1.5, ctx.currentTime);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
    } catch {}
  };

  // Initialize canvas with warm serene sand color
  const initSandCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#e5decf'; // Warm Japanese sand tone
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add delicate micro-granule texture
    for (let i = 0; i < 2000; i++) {
      const rx = Math.random() * canvas.width;
      const ry = Math.random() * canvas.height;
      ctx.fillStyle = Math.random() > 0.5 ? '#dcd4c3' : '#eee8db';
      ctx.fillRect(rx, ry, 1.5, 1.5);
    }
  };

  useEffect(() => {
    initSandCanvas();
  }, []);

  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const handleStart = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoords(e);
    if (tool === 'add-stone') {
      setItems((prev) => [
        ...prev,
        {
          id: `item_${Date.now()}`,
          type: 'stone',
          x: coords.x,
          y: coords.y,
          size: 22 + Math.random() * 10,
          rotation: Math.random() * 360,
        },
      ]);
      return;
    }
    if (tool === 'add-petal') {
      setItems((prev) => [
        ...prev,
        {
          id: `item_${Date.now()}`,
          type: 'petal',
          x: coords.x,
          y: coords.y,
          size: 12 + Math.random() * 6,
          rotation: Math.random() * 360,
        },
      ]);
      return;
    }

    setIsDrawing(true);
    lastPos.current = coords;
  };

  const handleMove = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const coords = getCanvasCoords(e);
    if (!lastPos.current) {
      lastPos.current = coords;
      return;
    }

    ctx.save();
    if (tool === 'smooth') {
      ctx.strokeStyle = '#e5decf';
      ctx.lineWidth = 32;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(lastPos.current.x, lastPos.current.y);
      ctx.lineTo(coords.x, coords.y);
      ctx.stroke();
    } else {
      // Raking tine grooves (3 parallel zen ridges)
      playRakeSound();
      const ridgeOffsets = tool === 'rake-wave' ? [-10, 0, 10] : [-6, 6];
      ridgeOffsets.forEach((offset) => {
        // Deep groove shadow
        ctx.strokeStyle = '#c6bcab';
        ctx.lineWidth = 3.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(lastPos.current!.x + offset, lastPos.current!.y + offset);
        ctx.lineTo(coords.x + offset, coords.y + offset);
        ctx.stroke();

        // Soft sand ridge highlight
        ctx.strokeStyle = '#f4ede1';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(lastPos.current!.x + offset + 1.5, lastPos.current!.y + offset + 1.5);
        ctx.lineTo(coords.x + offset + 1.5, coords.y + offset + 1.5);
        ctx.stroke();
      });
    }
    ctx.restore();

    lastPos.current = coords;
  };

  const handleEnd = () => {
    setIsDrawing(false);
    lastPos.current = null;
  };

  const resetGarden = () => {
    initSandCanvas();
    setItems([]);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto rounded-3xl bg-slate-900/60 backdrop-blur-md border border-slate-800 p-6 shadow-xl text-slate-200">
      <div className="flex items-center justify-between w-full mb-4">
        <div>
          <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Zen Sand Rake Garden (枯山水)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Rake peaceful ridges in fine sand. Place river stones and sakura petals.
          </p>
        </div>

        <button
          onClick={resetGarden}
          title="Smooth the sand"
          aria-label="Smooth the entire sand surface"
          className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-400 hover:text-white transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Garden Sandbox Container */}
      <div className="relative w-full rounded-2xl overflow-hidden border-4 border-amber-950/80 shadow-2xl bg-[#e5decf] cursor-crosshair">
        <canvas
          ref={canvasRef}
          width={520}
          height={320}
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
          className="w-full h-auto block select-none touch-none"
        />

        {/* Placed Zen Elements (Stones, Petals) */}
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              left: `${(item.x / 520) * 100}%`,
              top: `${(item.y / 320) * 100}%`,
              transform: `translate(-50%, -50%) rotate(${item.rotation}deg)`,
            }}
            className="absolute pointer-events-none select-none"
          >
            {item.type === 'stone' && (
              <div
                style={{ width: `${item.size}px`, height: `${item.size * 0.75}px` }}
                className="rounded-full bg-gradient-to-tr from-stone-900 via-stone-800 to-stone-600 shadow-md shadow-stone-950/70 border border-stone-600/40 relative"
              >
                <div className="absolute top-1 left-2 w-2 h-1 rounded-full bg-stone-300/30 blur-[0.5px]" />
              </div>
            )}
            {item.type === 'moss' && (
              <div
                style={{ width: `${item.size}px`, height: `${item.size * 0.8}px` }}
                className="rounded-full bg-gradient-to-tr from-emerald-950 via-emerald-800 to-teal-700 shadow-md border border-emerald-600/50"
              />
            )}
            {item.type === 'petal' && (
              <div
                style={{ width: `${item.size}px`, height: `${item.size * 0.6}px` }}
                className="rounded-full bg-gradient-to-tr from-pink-400 to-rose-300 shadow-sm border border-pink-200/60"
              />
            )}
          </div>
        ))}
      </div>

      {/* Rake Tool Selector */}
      <div className="w-full mt-4 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 rounded-2xl border border-slate-800">
          <button
            onClick={() => setTool('rake-wave')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              tool === 'rake-wave' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Waves className="w-3.5 h-3.5" />
            <span>Wave Rake</span>
          </button>

          <button
            onClick={() => setTool('rake-line')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              tool === 'rake-line' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <CircleDot className="w-3.5 h-3.5" />
            <span>Zen Lines</span>
          </button>

          <button
            onClick={() => setTool('smooth')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              tool === 'smooth' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eraser className="w-3.5 h-3.5" />
            <span>Smooth Rake</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setTool('add-stone')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all border ${
              tool === 'add-stone'
                ? 'bg-slate-800 border-indigo-400 text-white'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Dot className="w-4 h-4 text-stone-400" />
            <span>Place Stone</span>
          </button>

          <button
            onClick={() => setTool('add-petal')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all border ${
              tool === 'add-petal'
                ? 'bg-slate-800 border-pink-400 text-white'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Flower className="w-3.5 h-3.5 text-pink-400" />
            <span>Sakura Petal</span>
          </button>
        </div>
      </div>
    </div>
  );
};
